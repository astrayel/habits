"""Level calculator for Habits Manager.

Handles level and experience calculations.
"""
from typing import Tuple
from ..core.models import Child
from ..const import BASE_XP_FOR_LEVEL_UP, XP_MULTIPLIER_PER_LEVEL


class LevelCalculator:
    """Calcule les niveaux et l'expérience."""

    @staticmethod
    def calculate_xp_for_level(level: int) -> int:
        """Calcule l'XP nécessaire pour atteindre un niveau.

        La formule est : BASE_XP * (MULTIPLIER ^ (level - 1))
        Exemple avec BASE=100 et MULTIPLIER=1.2:
        - Niveau 1 -> 2 : 100 XP
        - Niveau 2 -> 3 : 120 XP
        - Niveau 3 -> 4 : 144 XP
        - Niveau 4 -> 5 : 173 XP
        - etc.

        Args:
            level: Niveau cible

        Returns:
            XP nécessaire pour atteindre ce niveau
        """
        return int(BASE_XP_FOR_LEVEL_UP * (XP_MULTIPLIER_PER_LEVEL ** (level - 1)))

    @staticmethod
    def add_experience(child: Child, xp: int) -> Tuple[Child, bool]:
        """Ajoute de l'XP et gère les level-ups automatiques.

        Args:
            child: Enfant à qui ajouter de l'XP
            xp: Quantité d'XP à ajouter

        Returns:
            Tuple (child mis à jour, leveled_up)
            - child: Child avec XP et level mis à jour
            - leveled_up: True si au moins un level-up s'est produit
        """
        child.experience += xp
        leveled_up = False

        # Boucle pour gérer plusieurs level-ups d'un coup si beaucoup d'XP
        while child.experience >= child.experience_to_next_level:
            # Level-up !
            child.experience -= child.experience_to_next_level
            child.level += 1
            leveled_up = True

            # Calculer l'XP nécessaire pour le prochain niveau
            child.experience_to_next_level = LevelCalculator.calculate_xp_for_level(child.level + 1)

        return child, leveled_up

    @staticmethod
    def get_progress_percentage(child: Child) -> float:
        """Calcule le pourcentage de progression vers le prochain niveau.

        Args:
            child: Enfant

        Returns:
            Pourcentage (0.0 à 100.0)
        """
        if child.experience_to_next_level == 0:
            return 100.0

        percentage = (child.experience / child.experience_to_next_level) * 100
        return min(100.0, max(0.0, percentage))

    @staticmethod
    def get_total_xp_for_level(level: int) -> int:
        """Calcule l'XP total nécessaire pour atteindre un niveau depuis le niveau 1.

        Args:
            level: Niveau cible

        Returns:
            XP total depuis le niveau 1
        """
        total_xp = 0
        for lvl in range(2, level + 1):
            total_xp += LevelCalculator.calculate_xp_for_level(lvl)
        return total_xp

    @staticmethod
    def get_level_from_total_xp(total_xp: int) -> Tuple[int, int]:
        """Calcule le niveau et l'XP restant à partir d'une quantité totale d'XP.

        Utile pour recalculer le niveau si nécessaire.

        Args:
            total_xp: XP total accumulé

        Returns:
            Tuple (level, remaining_xp)
            - level: Niveau atteint
            - remaining_xp: XP restant pour le prochain niveau
        """
        current_level = 1
        remaining_xp = total_xp

        while True:
            xp_needed = LevelCalculator.calculate_xp_for_level(current_level + 1)

            if remaining_xp < xp_needed:
                # Pas assez d'XP pour le prochain niveau
                break

            remaining_xp -= xp_needed
            current_level += 1

        return current_level, remaining_xp
