"""Points calculator for Habits Manager.

Handles all calculations related to points, coins, and experience.
"""
from typing import Dict
from ..core.models import Task, Habit, Child, StreakBonusType


class PointsCalculator:
    """Calcule les points, pièces et expérience."""

    @staticmethod
    def calculate_task_rewards(task: Task) -> Dict[str, int]:
        """Calcule les récompenses d'une tâche.

        Args:
            task: Tâche dont calculer les récompenses

        Returns:
            Dictionnaire avec points, coins, experience
        """
        return {
            "points": task.rewards.points,
            "coins": task.rewards.coins,
            "experience": task.rewards.experience,
        }

    @staticmethod
    def calculate_habit_rewards(habit: Habit, streak: int) -> Dict[str, int]:
        """Calcule les récompenses d'une habitude avec bonus streak.

        Args:
            habit: Habitude dont calculer les récompenses
            streak: Streak actuel de l'enfant pour cette habitude

        Returns:
            Dictionnaire avec points, coins, experience (avec bonus appliqué)
        """
        base_points = habit.rewards.points
        base_coins = habit.rewards.coins
        base_xp = habit.rewards.experience

        if not habit.rewards.streak_bonus.enabled:
            return {
                "points": base_points,
                "coins": base_coins,
                "experience": base_xp,
            }

        # Calculer le bonus selon le type
        if habit.rewards.streak_bonus.type == StreakBonusType.PROGRESSIVE:
            # Bonus progressif: +X% par jour de streak
            # Exemple: streak de 7 jours avec multiplier 0.1 = +70% = x1.7
            multiplier = 1 + (streak * habit.rewards.streak_bonus.multiplier)
        else:
            # Bonus fixe: toujours le même bonus si streak > 0
            multiplier = 1 + habit.rewards.streak_bonus.multiplier if streak > 0 else 1

        return {
            "points": int(base_points * multiplier),
            "coins": int(base_coins * multiplier),
            "experience": int(base_xp * multiplier),
        }

    @staticmethod
    def apply_rewards(child: Child, rewards: Dict[str, int]) -> Child:
        """Applique les récompenses à un enfant.

        Args:
            child: Enfant à qui appliquer les récompenses
            rewards: Dictionnaire avec points, coins, experience

        Returns:
            Child avec les récompenses appliquées
        """
        child.points += rewards.get("points", 0)
        child.coins += rewards.get("coins", 0)
        child.experience += rewards.get("experience", 0)
        return child

    @staticmethod
    def apply_penalties(child: Child, penalties: Dict[str, int]) -> Child:
        """Applique les pénalités à un enfant.

        Les valeurs dans penalties sont déjà négatives.
        Ne permet pas de descendre en dessous de 0.

        Args:
            child: Enfant à qui appliquer les pénalités
            penalties: Dictionnaire avec points, coins (valeurs négatives)

        Returns:
            Child avec les pénalités appliquées
        """
        # Les pénalités sont négatives, donc on les ajoute
        child.points = max(0, child.points + penalties.get("points", 0))
        child.coins = max(0, child.coins + penalties.get("coins", 0))
        return child

    @staticmethod
    def can_afford_reward(child: Child, cost_points: int, cost_coins: int) -> bool:
        """Vérifie si un enfant peut se permettre une récompense.

        Args:
            child: Enfant
            cost_points: Coût en points
            cost_coins: Coût en pièces

        Returns:
            True si l'enfant a assez de points et de pièces
        """
        return child.points >= cost_points and child.coins >= cost_coins

    @staticmethod
    def deduct_cost(child: Child, cost_points: int, cost_coins: int) -> Child:
        """Déduit le coût d'une récompense ou cosmétique.

        Args:
            child: Enfant
            cost_points: Coût en points
            cost_coins: Coût en pièces

        Returns:
            Child avec le coût déduit

        Note:
            Assurez-vous d'appeler can_afford_reward() avant !
        """
        child.points = max(0, child.points - cost_points)
        child.coins = max(0, child.coins - cost_coins)
        return child
