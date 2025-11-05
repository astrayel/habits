"""Cosmetic manager for Habits Manager.

Manages cosmetic items (clothes, accessories, pets, themes, badges, animations)
"""
import uuid
from typing import List, Optional

from ..const import _LOGGER
from ..core.models import CosmeticItem, CosmeticCategory, CosmeticRarity, CosmeticUnlockRequirements
from ..core.exceptions import CosmeticNotFoundError, ValidationError
from ..storage.storage_manager import StorageManager


class CosmeticManager:
    """Gère les cosmétiques et leur disponibilité."""

    def __init__(self, storage: StorageManager):
        """Initialise le cosmetic manager.

        Args:
            storage: Manager de stockage
        """
        self.storage = storage

    async def create_cosmetic(self, cosmetic_data: dict) -> CosmeticItem:
        """Crée un nouveau cosmétique.

        Args:
            cosmetic_data: Données du cosmétique

        Returns:
            CosmeticItem créé
        """
        # Générer ID
        cosmetic_id = f"cosmetic_{uuid.uuid4().hex[:8]}"

        # Gérer les unlock requirements si présents
        unlock_reqs = None
        if "unlock_requirements" in cosmetic_data:
            reqs_data = cosmetic_data["unlock_requirements"]
            unlock_reqs = CosmeticUnlockRequirements(
                min_level=reqs_data.get("min_level"),
                required_badge=reqs_data.get("required_badge"),
                min_streak=reqs_data.get("min_streak"),
            )

        # Créer le cosmétique
        cosmetic = CosmeticItem(
            id=cosmetic_id,
            name=cosmetic_data["name"],
            description=cosmetic_data.get("description", ""),
            category=CosmeticCategory(cosmetic_data["category"]),
            subcategory=cosmetic_data.get("subcategory", ""),
            rarity=CosmeticRarity(cosmetic_data.get("rarity", "common")),
            cost_coins=cosmetic_data.get("cost_coins", 0),
            preview_image=cosmetic_data.get("preview_image", ""),
            unlock_requirements=unlock_reqs,
            active=cosmetic_data.get("active", True),
        )

        # Sauvegarder
        await self.storage.save_cosmetic(cosmetic)

        _LOGGER.info(f"Cosmetic created: {cosmetic.name} ({cosmetic.id})")

        return cosmetic

    async def get_cosmetic(self, cosmetic_id: str) -> CosmeticItem:
        """Récupère un cosmétique par son ID.

        Args:
            cosmetic_id: ID du cosmétique

        Returns:
            CosmeticItem

        Raises:
            CosmeticNotFoundError: Si le cosmétique n'existe pas
        """
        cosmetics = await self.storage.load_cosmetics()
        for cosmetic in cosmetics:
            if cosmetic.id == cosmetic_id:
                return cosmetic

        raise CosmeticNotFoundError(f"Cosmetic {cosmetic_id} not found")

    async def get_all_cosmetics(
        self,
        active_only: bool = False,
        category: Optional[CosmeticCategory] = None
    ) -> List[CosmeticItem]:
        """Récupère tous les cosmétiques avec filtres optionnels.

        Args:
            active_only: Si True, ne retourne que les cosmétiques actifs
            category: Filtrer par catégorie (optionnel)

        Returns:
            Liste des cosmétiques
        """
        cosmetics = await self.storage.load_cosmetics()

        if active_only:
            cosmetics = [c for c in cosmetics if c.active]

        if category:
            cosmetics = [c for c in cosmetics if c.category == category]

        return cosmetics

    async def get_available_cosmetics_for_child(
        self,
        child_level: int,
        child_badges: List[str],
        child_longest_streak: int,
        owned_cosmetics: List[str]
    ) -> List[CosmeticItem]:
        """Récupère les cosmétiques disponibles pour un enfant.

        Un cosmétique est disponible si:
        - Il est actif
        - L'enfant ne le possède pas déjà
        - L'enfant remplit les unlock requirements

        Args:
            child_level: Niveau de l'enfant
            child_badges: Badges possédés par l'enfant
            child_longest_streak: Plus long streak de l'enfant
            owned_cosmetics: IDs des cosmétiques déjà possédés

        Returns:
            Liste des cosmétiques disponibles à l'achat
        """
        all_cosmetics = await self.get_all_cosmetics(active_only=True)
        available = []

        for cosmetic in all_cosmetics:
            # Déjà possédé ?
            if cosmetic.id in owned_cosmetics:
                continue

            # Vérifier unlock requirements
            if cosmetic.unlock_requirements:
                reqs = cosmetic.unlock_requirements

                # Niveau minimum
                if reqs.min_level and child_level < reqs.min_level:
                    continue

                # Badge requis
                if reqs.required_badge and reqs.required_badge not in child_badges:
                    continue

                # Streak minimum
                if reqs.min_streak and child_longest_streak < reqs.min_streak:
                    continue

            available.append(cosmetic)

        return available

    async def update_cosmetic(self, cosmetic: CosmeticItem) -> CosmeticItem:
        """Met à jour un cosmétique.

        Args:
            cosmetic: Cosmétique à mettre à jour

        Returns:
            CosmeticItem mis à jour
        """
        await self.storage.save_cosmetic(cosmetic)
        _LOGGER.debug(f"Cosmetic updated: {cosmetic.name} ({cosmetic.id})")
        return cosmetic

    async def delete_cosmetic(self, cosmetic_id: str) -> None:
        """Supprime un cosmétique.

        Args:
            cosmetic_id: ID du cosmétique

        Raises:
            CosmeticNotFoundError: Si le cosmétique n'existe pas
        """
        # Vérifier que le cosmétique existe
        await self.get_cosmetic(cosmetic_id)

        # Supprimer
        await self.storage.delete_cosmetic(cosmetic_id)
        _LOGGER.info(f"Cosmetic deleted: {cosmetic_id}")

    async def get_cosmetics_by_category(self, category: CosmeticCategory) -> List[CosmeticItem]:
        """Récupère tous les cosmétiques d'une catégorie.

        Args:
            category: Catégorie de cosmétiques

        Returns:
            Liste des cosmétiques de la catégorie
        """
        return await self.get_all_cosmetics(active_only=True, category=category)

    async def get_cosmetics_by_rarity(self, rarity: CosmeticRarity) -> List[CosmeticItem]:
        """Récupère tous les cosmétiques d'une rareté donnée.

        Args:
            rarity: Rareté des cosmétiques

        Returns:
            Liste des cosmétiques de la rareté
        """
        all_cosmetics = await self.get_all_cosmetics(active_only=True)
        return [c for c in all_cosmetics if c.rarity == rarity]
