"""Habit manager for Habits Manager.

Manages all operations related to habits and streaks.
"""
import uuid
from datetime import date
from typing import List, Optional, Tuple

from ..const import _LOGGER
from ..core.models import (
    Habit,
    HabitStreak,
    HabitRewards,
    StreakBonus,
    HabitFrequency,
    StreakBonusType,
    StreakHistoryEntry,
)
from ..core.exceptions import HabitNotFoundError, ValidationError
from ..core.validators import validate_habit_data
from ..storage.storage_manager import StorageManager
from ..services.streak_calculator import StreakCalculator


class HabitManager:
    """Gère les habitudes et leurs streaks."""

    def __init__(self, storage: StorageManager):
        """Initialise le habit manager.

        Args:
            storage: Manager de stockage
        """
        self.storage = storage
        self.streak_calc = StreakCalculator()

    async def create_habit(self, habit_data: dict) -> Habit:
        """Crée une nouvelle habitude.

        Args:
            habit_data: Données de l'habitude

        Returns:
            Habit créée

        Raises:
            ValidationError: Si les données sont invalides
        """
        # Valider
        validate_habit_data(habit_data)

        # Générer ID
        habit_id = f"habit_{uuid.uuid4().hex[:8]}"

        # Construire les rewards avec streak_bonus
        rewards_data = habit_data.get("rewards", {})
        bonus_data = rewards_data.get("streak_bonus", {})

        streak_bonus = StreakBonus(
            enabled=bonus_data.get("enabled", True),
            type=StreakBonusType(bonus_data.get("type", "progressive")),
            multiplier=bonus_data.get("multiplier", 0.1),
        )

        rewards = HabitRewards(
            points=rewards_data.get("points", 0),
            coins=rewards_data.get("coins", 0),
            experience=rewards_data.get("experience", 0),
            streak_bonus=streak_bonus,
        )

        # Créer l'habitude
        habit = Habit(
            id=habit_id,
            title=habit_data["title"],
            description=habit_data.get("description", ""),
            icon=habit_data.get("icon", "mdi:star"),
            color=habit_data.get("color", "#FFC107"),
            frequency=HabitFrequency(habit_data["frequency"]),
            rewards=rewards,
            active=habit_data.get("active", True),
            assigned_to=habit_data.get("assigned_to", []),
        )

        # Sauvegarder
        await self.storage.save_habit(habit)

        _LOGGER.info(f"Habit created: {habit.title} ({habit.id})")

        return habit

    async def get_habit(self, habit_id: str) -> Habit:
        """Récupère une habitude par son ID.

        Args:
            habit_id: ID de l'habitude

        Returns:
            Habit

        Raises:
            HabitNotFoundError: Si l'habitude n'existe pas
        """
        habits = await self.storage.load_habits()
        for habit in habits:
            if habit.id == habit_id:
                return habit

        raise HabitNotFoundError(f"Habit {habit_id} not found")

    async def get_all_habits(self) -> List[Habit]:
        """Récupère toutes les habitudes.

        Returns:
            Liste des habitudes
        """
        return await self.storage.load_habits()

    async def update_habit(self, habit: Habit) -> Habit:
        """Met à jour une habitude.

        Args:
            habit: Habitude à mettre à jour

        Returns:
            Habit mise à jour
        """
        await self.storage.save_habit(habit)
        _LOGGER.debug(f"Habit updated: {habit.title} ({habit.id})")
        return habit

    async def delete_habit(self, habit_id: str) -> None:
        """Supprime une habitude.

        Args:
            habit_id: ID de l'habitude

        Raises:
            HabitNotFoundError: Si l'habitude n'existe pas
        """
        # Vérifier que l'habitude existe
        await self.get_habit(habit_id)

        # Supprimer
        await self.storage.delete_habit(habit_id)
        _LOGGER.info(f"Habit deleted: {habit_id}")

    async def record_completion(self, habit_id: str, child_id: str, completion_date: date = None) -> Tuple[HabitStreak, bool]:
        """Enregistre la complétion d'une habitude.

        Args:
            habit_id: ID de l'habitude
            child_id: ID de l'enfant
            completion_date: Date de complétion (par défaut aujourd'hui)

        Returns:
            Tuple (HabitStreak mis à jour, streak_increased)

        Raises:
            HabitNotFoundError: Si l'habitude n'existe pas
        """
        # Vérifier que l'habitude existe
        habit = await self.get_habit(habit_id)

        if completion_date is None:
            completion_date = date.today()

        # Charger ou créer le streak
        streak = await self.get_streak(habit_id, child_id)

        if streak is None:
            # Créer un nouveau streak
            streak_id = f"streak_{uuid.uuid4().hex[:8]}"
            streak = HabitStreak(
                id=streak_id,
                habit_id=habit_id,
                child_id=child_id,
                current_streak=0,
                longest_streak=0,
                last_completed=None,
                total_completions=0,
                streak_history=[],
            )

        # Vérifier si déjà complété aujourd'hui
        if self.streak_calc.is_completed_today(streak, completion_date):
            _LOGGER.warning(f"Habit {habit_id} already completed today by child {child_id}")
            return streak, False

        # Sauvegarder le streak avant
        old_streak = streak.current_streak

        # Mettre à jour le streak
        streak = self.streak_calc.update_streak(streak, completion_date)

        # Ajouter à l'historique
        history_entry = StreakHistoryEntry(date=completion_date, completed=True)
        streak.streak_history.append(history_entry)

        # Garder seulement les 100 dernières entrées
        if len(streak.streak_history) > 100:
            streak.streak_history = streak.streak_history[-100:]

        # Sauvegarder
        await self.storage.save_habit_streak(streak)

        streak_increased = streak.current_streak > old_streak

        _LOGGER.info(f"Habit {habit.title} completed by child {child_id}. Streak: {streak.current_streak}")

        return streak, streak_increased

    async def get_streak(self, habit_id: str, child_id: str) -> Optional[HabitStreak]:
        """Récupère le streak d'une habitude pour un enfant.

        Args:
            habit_id: ID de l'habitude
            child_id: ID de l'enfant

        Returns:
            HabitStreak ou None si jamais commencé
        """
        return await self.storage.load_habit_streak(habit_id, child_id)

    async def calculate_streak_bonus(self, habit_id: str, child_id: str) -> dict:
        """Calcule les récompenses avec bonus de streak.

        Args:
            habit_id: ID de l'habitude
            child_id: ID de l'enfant

        Returns:
            Dictionnaire avec points, coins, experience (avec bonus)

        Raises:
            HabitNotFoundError: Si l'habitude n'existe pas
        """
        habit = await self.get_habit(habit_id)
        streak = await self.get_streak(habit_id, child_id)

        current_streak = 0 if streak is None else streak.current_streak

        # Utiliser le PointsCalculator pour calculer les récompenses
        from ..services.points_calculator import PointsCalculator
        calc = PointsCalculator()

        return calc.calculate_habit_rewards(habit, current_streak)

    async def check_streak_breaks(self, check_date: date = None) -> List[Tuple[HabitStreak, Habit]]:
        """Vérifie les streaks cassés (habitudes non faites).

        Args:
            check_date: Date de vérification (par défaut aujourd'hui)

        Returns:
            Liste de tuples (streak_cassé, habitude)
        """
        if check_date is None:
            check_date = date.today()

        habits = await self.get_all_habits()
        broken_streaks = []

        for habit in habits:
            if not habit.active:
                continue

            # Pour chaque enfant assigné
            for child_id in habit.assigned_to:
                streak = await self.get_streak(habit.id, child_id)

                if streak is None:
                    # Jamais commencé, pas de streak à casser
                    continue

                # Vérifier si le streak est cassé
                if self.streak_calc.check_streak_broken(streak, habit, check_date):
                    # Reset le streak
                    streak = self.streak_calc.reset_streak(streak)
                    await self.storage.save_habit_streak(streak)

                    broken_streaks.append((streak, habit))

                    _LOGGER.info(f"Streak broken for habit {habit.title}, child {child_id}")

        return broken_streaks

    async def get_habits_for_child(self, child_id: str) -> List[Habit]:
        """Récupère toutes les habitudes assignées à un enfant.

        Args:
            child_id: ID de l'enfant

        Returns:
            Liste des habitudes
        """
        all_habits = await self.get_all_habits()
        return [h for h in all_habits if h.active and child_id in h.assigned_to]

    async def get_child_longest_streak(self, child_id: str) -> int:
        """Récupère le plus long streak de toutes les habitudes d'un enfant.

        Args:
            child_id: ID de l'enfant

        Returns:
            Plus long streak (0 si aucun)
        """
        habits = await self.get_habits_for_child(child_id)
        longest = 0

        for habit in habits:
            streak = await self.get_streak(habit.id, child_id)
            if streak and streak.longest_streak > longest:
                longest = streak.longest_streak

        return longest
