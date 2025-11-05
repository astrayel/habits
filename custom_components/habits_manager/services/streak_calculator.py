"""Streak calculator for Habits Manager.

Handles all streak-related calculations for habits.
"""
from datetime import date
from ..core.models import HabitStreak, Habit, HabitFrequency


class StreakCalculator:
    """Calcule et gère les streaks d'habitudes."""

    @staticmethod
    def update_streak(habit_streak: HabitStreak, completion_date: date) -> HabitStreak:
        """Met à jour le streak après complétion d'une habitude.

        Args:
            habit_streak: Streak actuel
            completion_date: Date de complétion

        Returns:
            HabitStreak mis à jour
        """
        if habit_streak.last_completed is None:
            # Première complétion
            habit_streak.current_streak = 1
            habit_streak.last_completed = completion_date
        else:
            days_diff = (completion_date - habit_streak.last_completed).days

            if days_diff == 0:
                # Même jour : on ne fait rien (déjà complété aujourd'hui)
                pass
            elif days_diff == 1:
                # Jour consécutif : augmenter le streak
                habit_streak.current_streak += 1
                habit_streak.last_completed = completion_date
            else:
                # Streak cassé : redémarrer à 1
                habit_streak.current_streak = 1
                habit_streak.last_completed = completion_date

        # Mettre à jour le record si nécessaire
        if habit_streak.current_streak > habit_streak.longest_streak:
            habit_streak.longest_streak = habit_streak.current_streak

        # Incrémenter le total de complétions
        habit_streak.total_completions += 1

        return habit_streak

    @staticmethod
    def check_streak_broken(habit_streak: HabitStreak, habit: Habit, today: date) -> bool:
        """Vérifie si un streak est cassé (habitude non faite).

        Args:
            habit_streak: Streak actuel
            habit: Habitude concernée
            today: Date actuelle

        Returns:
            True si le streak est cassé
        """
        if habit_streak.last_completed is None:
            # Jamais complété, pas de streak à casser
            return False

        days_diff = (today - habit_streak.last_completed).days

        # Déterminer le seuil selon la fréquence
        if habit.frequency == HabitFrequency.DAILY:
            # Si non fait hier ou avant : streak cassé
            return days_diff > 1
        elif habit.frequency == HabitFrequency.WEEKLY:
            # Si non fait depuis plus d'une semaine
            return days_diff > 7
        elif habit.frequency == HabitFrequency.MONTHLY:
            # Si non fait depuis plus d'un mois
            return days_diff > 30

        return False

    @staticmethod
    def reset_streak(habit_streak: HabitStreak) -> HabitStreak:
        """Reset le streak à 0.

        Args:
            habit_streak: Streak à reset

        Returns:
            HabitStreak avec streak = 0
        """
        habit_streak.current_streak = 0
        return habit_streak

    @staticmethod
    def get_streak_days_remaining(habit_streak: HabitStreak, habit: Habit, today: date) -> int:
        """Calcule le nombre de jours restants avant que le streak se casse.

        Args:
            habit_streak: Streak actuel
            habit: Habitude concernée
            today: Date actuelle

        Returns:
            Nombre de jours restants (0 si déjà cassé ou jamais commencé)
        """
        if habit_streak.last_completed is None:
            return 0

        days_since = (today - habit_streak.last_completed).days

        if habit.frequency == HabitFrequency.DAILY:
            threshold = 1
        elif habit.frequency == HabitFrequency.WEEKLY:
            threshold = 7
        elif habit.frequency == HabitFrequency.MONTHLY:
            threshold = 30
        else:
            threshold = 1

        remaining = threshold - days_since

        return max(0, remaining)

    @staticmethod
    def is_completed_today(habit_streak: HabitStreak, today: date) -> bool:
        """Vérifie si l'habitude a été complétée aujourd'hui.

        Args:
            habit_streak: Streak actuel
            today: Date actuelle

        Returns:
            True si complété aujourd'hui
        """
        if habit_streak.last_completed is None:
            return False

        return habit_streak.last_completed == today
