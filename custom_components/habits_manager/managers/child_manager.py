"""Child manager for Habits Manager.

Manages all operations related to children.
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict

from ..const import _LOGGER, DEFAULT_STARTING_POINTS, DEFAULT_STARTING_COINS, DEFAULT_STARTING_LEVEL, DEFAULT_STARTING_XP
from ..core.models import Child, Avatar, AvatarCustomization
from ..core.exceptions import ChildNotFoundError, InsufficientCoinsError, ValidationError
from ..storage.storage_manager import StorageManager
from ..storage.entity_manager import EntityManager
from ..services.points_calculator import PointsCalculator
from ..services.level_calculator import LevelCalculator


class ChildManager:
    """Gère les enfants du système."""

    def __init__(self, storage: StorageManager, entity_mgr: EntityManager):
        """Initialise le child manager.

        Args:
            storage: Manager de stockage
            entity_mgr: Manager d'entités HA
        """
        self.storage = storage
        self.entity_mgr = entity_mgr
        self.points_calc = PointsCalculator()
        self.level_calc = LevelCalculator()

    async def create_child(self, name: str, person_entity: str) -> Child:
        """Crée un nouvel enfant.

        Args:
            name: Nom de l'enfant
            person_entity: Entité person de Home Assistant (ex: "person.emma")

        Returns:
            Child créé

        Raises:
            ValidationError: Si les données sont invalides
        """
        # Valider
        if not name or len(name) > 50:
            raise ValidationError("Nom invalide")

        if not person_entity or not person_entity.startswith("person."):
            raise ValidationError("Entité person invalide")

        # Générer ID unique
        child_id = f"child_{uuid.uuid4().hex[:8]}"

        # Récupérer la photo de l'entité person (si disponible)
        photo_url = ""
        try:
            person_state = self.entity_mgr.hass.states.get(person_entity)
            if person_state and hasattr(person_state.attributes, "entity_picture"):
                photo_url = person_state.attributes.get("entity_picture", "")
        except Exception as err:
            _LOGGER.warning(f"Could not fetch photo for {person_entity}: {err}")

        # Créer l'avatar
        avatar = Avatar(
            photo_url=photo_url,
            customization=AvatarCustomization(),
        )

        # Créer l'enfant
        child = Child(
            id=child_id,
            name=name,
            person_entity=person_entity,
            points=DEFAULT_STARTING_POINTS,
            coins=DEFAULT_STARTING_COINS,
            level=DEFAULT_STARTING_LEVEL,
            experience=DEFAULT_STARTING_XP,
            experience_to_next_level=self.level_calc.calculate_xp_for_level(2),
            avatar=avatar,
            badges=[],
            owned_cosmetics=[],
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        # Sauvegarder
        await self.storage.save_child(child)

        # Créer les entités HA
        await self.entity_mgr.create_child_entities(child)

        _LOGGER.info(f"Child created: {child.name} ({child.id})")

        return child

    async def get_child(self, child_id: str) -> Child:
        """Récupère un enfant par son ID.

        Args:
            child_id: ID de l'enfant

        Returns:
            Child

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        child = await self.storage.get_child(child_id)
        if child is None:
            raise ChildNotFoundError(f"Child {child_id} not found")
        return child

    async def get_all_children(self) -> List[Child]:
        """Récupère tous les enfants.

        Returns:
            Liste des enfants
        """
        return await self.storage.load_children()

    async def update_child(self, child: Child) -> Child:
        """Met à jour un enfant.

        Args:
            child: Enfant à mettre à jour

        Returns:
            Child mis à jour
        """
        child.updated_at = datetime.now()
        await self.storage.save_child(child)
        await self.entity_mgr.update_child_entities(child)

        _LOGGER.debug(f"Child updated: {child.name} ({child.id})")

        return child

    async def delete_child(self, child_id: str) -> None:
        """Supprime un enfant.

        Args:
            child_id: ID de l'enfant

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        # Vérifier que l'enfant existe
        await self.get_child(child_id)

        # Supprimer
        await self.storage.delete_child(child_id)
        await self.entity_mgr.delete_child_entities(child_id)

        _LOGGER.info(f"Child deleted: {child_id}")

    async def update_points(self, child_id: str, points: int, coins: int, xp: int) -> Child:
        """Met à jour les points, pièces et XP d'un enfant.

        Gère automatiquement les level-ups.

        Args:
            child_id: ID de l'enfant
            points: Delta de points (peut être négatif)
            coins: Delta de pièces (peut être négatif)
            xp: Delta d'XP (toujours positif)

        Returns:
            Child mis à jour

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        child = await self.get_child(child_id)

        # Appliquer les changements
        if points != 0:
            if points > 0:
                child.points += points
            else:
                child.points = max(0, child.points + points)

        if coins != 0:
            if coins > 0:
                child.coins += coins
            else:
                child.coins = max(0, child.coins + coins)

        # Ajouter l'XP et gérer les level-ups
        leveled_up = False
        if xp > 0:
            child, leveled_up = self.level_calc.add_experience(child, xp)

        # Sauvegarder
        await self.update_child(child)

        _LOGGER.debug(f"Points updated for {child.name}: ”points={points}, ”coins={coins}, ”xp={xp}, leveled_up={leveled_up}")

        return child

    async def add_badge(self, child_id: str, badge_id: str) -> Child:
        """Ajoute un badge à un enfant.

        Args:
            child_id: ID de l'enfant
            badge_id: ID du badge

        Returns:
            Child mis à jour

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        child = await self.get_child(child_id)

        if badge_id not in child.badges:
            child.badges.append(badge_id)
            await self.update_child(child)
            _LOGGER.info(f"Badge {badge_id} added to {child.name}")

        return child

    async def purchase_cosmetic(self, child_id: str, cosmetic_id: str, cost: int) -> Child:
        """Achète un cosmétique pour un enfant.

        Args:
            child_id: ID de l'enfant
            cosmetic_id: ID du cosmétique
            cost: Coût en pièces

        Returns:
            Child mis à jour

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
            InsufficientCoinsError: Si pas assez de pièces
        """
        child = await self.get_child(child_id)

        # Vérifier si assez de pièces
        if child.coins < cost:
            raise InsufficientCoinsError(f"Not enough coins: has {child.coins}, needs {cost}")

        # Vérifier si pas déjà possédé
        if cosmetic_id in child.owned_cosmetics:
            _LOGGER.warning(f"{child.name} already owns cosmetic {cosmetic_id}")
            return child

        # Déduire les pièces
        child.coins -= cost

        # Ajouter le cosmétique
        child.owned_cosmetics.append(cosmetic_id)

        # Sauvegarder
        await self.update_child(child)

        _LOGGER.info(f"Cosmetic {cosmetic_id} purchased by {child.name} for {cost} coins")

        return child

    async def apply_cosmetic(self, child_id: str, cosmetic_id: str, category: str) -> Child:
        """Applique un cosmétique à l'avatar d'un enfant.

        Args:
            child_id: ID de l'enfant
            cosmetic_id: ID du cosmétique
            category: Catégorie (clothes, accessory, pet, theme)

        Returns:
            Child mis à jour

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
            ValidationError: Si le cosmétique n'est pas possédé
        """
        child = await self.get_child(child_id)

        # Vérifier que le cosmétique est possédé
        if cosmetic_id not in child.owned_cosmetics:
            raise ValidationError(f"Cosmetic {cosmetic_id} not owned by {child.name}")

        # Appliquer selon la catégorie
        if category == "clothes":
            child.avatar.customization.clothes = cosmetic_id
        elif category == "accessory":
            child.avatar.customization.accessory = cosmetic_id
        elif category == "pet":
            child.avatar.customization.pet = cosmetic_id
        elif category == "theme":
            child.avatar.customization.theme = cosmetic_id
        else:
            raise ValidationError(f"Invalid cosmetic category: {category}")

        # Sauvegarder
        await self.update_child(child)

        _LOGGER.debug(f"Cosmetic {cosmetic_id} applied to {child.name} ({category})")

        return child

    async def remove_cosmetic(self, child_id: str, category: str) -> Child:
        """Retire un cosmétique de l'avatar d'un enfant.

        Args:
            child_id: ID de l'enfant
            category: Catégorie à retirer

        Returns:
            Child mis à jour

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        child = await self.get_child(child_id)

        # Retirer selon la catégorie
        if category == "clothes":
            child.avatar.customization.clothes = None
        elif category == "accessory":
            child.avatar.customization.accessory = None
        elif category == "pet":
            child.avatar.customization.pet = None
        elif category == "theme":
            child.avatar.customization.theme = "default"
        else:
            raise ValidationError(f"Invalid cosmetic category: {category}")

        # Sauvegarder
        await self.update_child(child)

        _LOGGER.debug(f"Cosmetic removed from {child.name} ({category})")

        return child

    async def get_child_stats(self, child_id: str) -> Dict:
        """Récupère les statistiques d'un enfant.

        Args:
            child_id: ID de l'enfant

        Returns:
            Dictionnaire avec les stats

        Raises:
            ChildNotFoundError: Si l'enfant n'existe pas
        """
        child = await self.get_child(child_id)

        return {
            "name": child.name,
            "level": child.level,
            "points": child.points,
            "coins": child.coins,
            "experience": child.experience,
            "experience_to_next_level": child.experience_to_next_level,
            "progress_percentage": self.level_calc.get_progress_percentage(child),
            "badges_count": len(child.badges),
            "cosmetics_count": len(child.owned_cosmetics),
        }
