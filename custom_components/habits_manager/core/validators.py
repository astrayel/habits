"""Data validators for Habits Manager."""
from typing import Dict, Any
from .exceptions import ValidationError


def validate_child_data(data: Dict[str, Any]) -> bool:
    """Valide les données d'un enfant.

    Args:
        data: Dictionnaire contenant les données de l'enfant

    Returns:
        True si les données sont valides

    Raises:
        ValidationError: Si les données sont invalides
    """
    if not data.get("name"):
        raise ValidationError("Le nom de l'enfant est requis")

    if len(data["name"]) > 50:
        raise ValidationError("Le nom ne peut pas dépasser 50 caractères")

    if not data.get("person_entity"):
        raise ValidationError("L'entité person est requise")

    if not data["person_entity"].startswith("person."):
        raise ValidationError("L'entité person doit commencer par 'person.'")

    return True


def validate_task_data(data: Dict[str, Any]) -> bool:
    """Valide les données d'une tâche.

    Args:
        data: Dictionnaire contenant les données de la tâche

    Returns:
        True si les données sont valides

    Raises:
        ValidationError: Si les données sont invalides
    """
    if not data.get("title"):
        raise ValidationError("Le titre de la tâche est requis")

    if len(data["title"]) > 100:
        raise ValidationError("Le titre ne peut pas dépasser 100 caractères")

    if not data.get("assigned_to") or len(data["assigned_to"]) == 0:
        raise ValidationError("La tâche doit être assignée à au moins un enfant")

    # Valider la difficulté
    difficulty = data.get("difficulty", 1)
    if difficulty < 1 or difficulty > 3:
        raise ValidationError("La difficulté doit être entre 1 et 3")

    # Valider la durée estimée
    duration = data.get("estimated_duration", 10)
    if duration <= 0:
        raise ValidationError("La durée estimée doit être positive")

    # Valider les récompenses
    if "rewards" in data:
        rewards = data["rewards"]
        if rewards.get("points", 0) < 0:
            raise ValidationError("Les points ne peuvent pas être négatifs")
        if rewards.get("coins", 0) < 0:
            raise ValidationError("Les pièces ne peuvent pas être négatives")
        if rewards.get("experience", 0) < 0:
            raise ValidationError("L'expérience ne peut pas être négative")

    # Valider les pénalités (doivent être <= 0)
    if "penalties" in data:
        penalties = data["penalties"]
        if penalties.get("points", 0) > 0:
            raise ValidationError("Les pénalités de points doivent être négatives ou nulles")
        if penalties.get("coins", 0) > 0:
            raise ValidationError("Les pénalités de pièces doivent être négatives ou nulles")

    return True


def validate_habit_data(data: Dict[str, Any]) -> bool:
    """Valide les données d'une habitude.

    Args:
        data: Dictionnaire contenant les données de l'habitude

    Returns:
        True si les données sont valides

    Raises:
        ValidationError: Si les données sont invalides
    """
    if not data.get("title"):
        raise ValidationError("Le titre de l'habitude est requis")

    if len(data["title"]) > 100:
        raise ValidationError("Le titre ne peut pas dépasser 100 caractères")

    if not data.get("frequency"):
        raise ValidationError("La fréquence est requise")

    if data["frequency"] not in ["daily", "weekly", "monthly"]:
        raise ValidationError("Fréquence invalide (daily, weekly, ou monthly)")

    # Valider les récompenses
    if "rewards" in data:
        rewards = data["rewards"]
        if rewards.get("points", 0) < 0:
            raise ValidationError("Les points ne peuvent pas être négatifs")
        if rewards.get("coins", 0) < 0:
            raise ValidationError("Les pièces ne peuvent pas être négatives")
        if rewards.get("experience", 0) < 0:
            raise ValidationError("L'expérience ne peut pas être négative")

        # Valider le streak bonus
        if "streak_bonus" in rewards:
            bonus = rewards["streak_bonus"]
            if bonus.get("multiplier", 0) < 0:
                raise ValidationError("Le multiplicateur de streak ne peut pas être négatif")

    return True


def validate_reward_data(data: Dict[str, Any]) -> bool:
    """Valide les données d'une récompense.

    Args:
        data: Dictionnaire contenant les données de la récompense

    Returns:
        True si les données sont valides

    Raises:
        ValidationError: Si les données sont invalides
    """
    if not data.get("title"):
        raise ValidationError("Le titre de la récompense est requis")

    if len(data["title"]) > 100:
        raise ValidationError("Le titre ne peut pas dépasser 100 caractères")

    if not data.get("type"):
        raise ValidationError("Le type de récompense est requis")

    if data["type"] not in ["screen_time", "meal_choice", "activity", "other"]:
        raise ValidationError("Type de récompense invalide")

    # Valider les coûts
    cost_points = data.get("cost_points", 0)
    cost_coins = data.get("cost_coins", 0)

    if cost_points < 0:
        raise ValidationError("Le coût en points ne peut pas être négatif")
    if cost_coins < 0:
        raise ValidationError("Le coût en pièces ne peut pas être négatif")

    # Au moins un coût doit être > 0
    if cost_points == 0 and cost_coins == 0:
        raise ValidationError("La récompense doit avoir un coût (points ou pièces)")

    # Valider le cooldown
    cooldown = data.get("cooldown_days", 0)
    if cooldown < 0:
        raise ValidationError("Le cooldown ne peut pas être négatif")

    return True


def validate_cosmetic_data(data: Dict[str, Any]) -> bool:
    """Valide les données d'un cosmétique.

    Args:
        data: Dictionnaire contenant les données du cosmétique

    Returns:
        True si les données sont valides

    Raises:
        ValidationError: Si les données sont invalides
    """
    if not data.get("name"):
        raise ValidationError("Le nom du cosmétique est requis")

    if len(data["name"]) > 100:
        raise ValidationError("Le nom ne peut pas dépasser 100 caractères")

    if not data.get("category"):
        raise ValidationError("La catégorie est requise")

    valid_categories = ["clothes", "accessory", "pet", "theme", "badge", "animation"]
    if data["category"] not in valid_categories:
        raise ValidationError(f"Catégorie invalide (doit être parmi: {', '.join(valid_categories)})")

    if not data.get("rarity"):
        raise ValidationError("La rareté est requise")

    if data["rarity"] not in ["common", "rare", "epic", "legendary"]:
        raise ValidationError("Rareté invalide")

    # Valider le coût
    cost = data.get("cost_coins", 0)
    if cost < 0:
        raise ValidationError("Le coût ne peut pas être négatif")

    return True


def validate_points(points: int) -> bool:
    """Valide un nombre de points.

    Args:
        points: Nombre de points

    Returns:
        True si valide

    Raises:
        ValidationError: Si invalide
    """
    if not isinstance(points, int):
        raise ValidationError("Les points doivent être un entier")

    return True


def validate_coins(coins: int) -> bool:
    """Valide un nombre de pièces.

    Args:
        coins: Nombre de pièces

    Returns:
        True si valide

    Raises:
        ValidationError: Si invalide
    """
    if not isinstance(coins, int):
        raise ValidationError("Les pièces doivent être un entier")

    return True


def validate_level(level: int) -> bool:
    """Valide un niveau.

    Args:
        level: Niveau

    Returns:
        True si valide

    Raises:
        ValidationError: Si invalide
    """
    if not isinstance(level, int):
        raise ValidationError("Le niveau doit être un entier")

    if level < 1:
        raise ValidationError("Le niveau doit être au moins 1")

    return True
