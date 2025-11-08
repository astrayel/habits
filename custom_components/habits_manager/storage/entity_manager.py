"""Entity manager for Habits Manager.

Handles creation and management of Home Assistant entities for each child.
"""
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import Entity

from ..const import DOMAIN, _LOGGER
from ..core.models import Child


class EntityManager:
    """Gère les entités Home Assistant pour chaque enfant."""

    def __init__(self, hass: HomeAssistant):
        """Initialise l'entity manager.

        Args:
            hass: Instance Home Assistant
        """
        self.hass = hass
        self._entities = {}  # child_id -> liste d'entités

    async def create_child_entities(self, child: Child) -> None:
        """Crée toutes les entités pour un enfant.

        Créé les sensors suivants:
        - sensor.habits_child_XXX_points
        - sensor.habits_child_XXX_coins
        - sensor.habits_child_XXX_level
        - sensor.habits_child_XXX_xp
        - sensor.habits_child_XXX_tasks_pending
        - sensor.habits_child_XXX_tasks_waiting
        - sensor.habits_child_XXX_longest_streak
        - binary_sensor.habits_child_XXX_has_pending_validation

        Args:
            child: Enfant pour lequel créer les entités
        """
        _LOGGER.info(f"Creating entities for child {child.name} ({child.id})")

        # Les entités seront créées via sensor.py
        # Cette méthode prépare les données pour sensor.py

        # Stocker les données de l'enfant dans hass.data pour que sensor.py puisse y accéder
        if DOMAIN not in self.hass.data:
            self.hass.data[DOMAIN] = {}

        if "children_entities" not in self.hass.data[DOMAIN]:
            self.hass.data[DOMAIN]["children_entities"] = {}

        self.hass.data[DOMAIN]["children_entities"][child.id] = {
            "name": child.name,
            "person_entity": child.person_entity,
            "points": child.points,
            "coins": child.coins,
            "level": child.level,
            "experience": child.experience,
            "experience_to_next_level": child.experience_to_next_level,
            "avatar": child.avatar.to_dict() if hasattr(child.avatar, 'to_dict') else {},
            "badges": child.badges,
            "owned_cosmetics": child.owned_cosmetics,
            "tasks_pending": 0,  # Sera mis à jour par les managers
            "tasks_waiting": 0,  # Sera mis à jour par les managers
            "longest_streak": 0,  # Sera mis à jour par les managers
            "has_pending_validation": False,  # Sera mis à jour par les managers
        }

        _LOGGER.debug(f"Entity data prepared for child {child.id}")

    async def update_child_entities(self, child: Child) -> None:
        """Met à jour les entités d'un enfant.

        Args:
            child: Enfant dont les entités doivent être mises à jour
        """
        if DOMAIN not in self.hass.data:
            return

        if "children_entities" not in self.hass.data[DOMAIN]:
            return

        if child.id not in self.hass.data[DOMAIN]["children_entities"]:
            # L'enfant n'a pas encore d'entités, les créer
            await self.create_child_entities(child)
            return

        # Mettre à jour les données
        entity_data = self.hass.data[DOMAIN]["children_entities"][child.id]
        entity_data["name"] = child.name
        entity_data["person_entity"] = child.person_entity
        entity_data["points"] = child.points
        entity_data["coins"] = child.coins
        entity_data["level"] = child.level
        entity_data["experience"] = child.experience
        entity_data["experience_to_next_level"] = child.experience_to_next_level
        entity_data["avatar"] = child.avatar.to_dict() if hasattr(child.avatar, 'to_dict') else {}
        entity_data["badges"] = child.badges
        entity_data["owned_cosmetics"] = child.owned_cosmetics

        # Déclencher une mise à jour des entités
        # Les entités sensor.py écouteront les changements dans hass.data
        _LOGGER.debug(f"Updated entity data for child {child.id}")

        # Émettre un événement pour notifier les entités
        self.hass.bus.fire(f"{DOMAIN}_entity_update", {"child_id": child.id})

    async def update_task_counts(self, child_id: str, pending: int, waiting: int) -> None:
        """Met à jour les compteurs de tâches pour un enfant.

        Args:
            child_id: ID de l'enfant
            pending: Nombre de tâches en attente
            waiting: Nombre de tâches en attente de validation
        """
        if DOMAIN not in self.hass.data:
            return

        if "children_entities" not in self.hass.data[DOMAIN]:
            return

        if child_id not in self.hass.data[DOMAIN]["children_entities"]:
            return

        entity_data = self.hass.data[DOMAIN]["children_entities"][child_id]
        entity_data["tasks_pending"] = pending
        entity_data["tasks_waiting"] = waiting
        entity_data["has_pending_validation"] = waiting > 0

        # Émettre un événement
        self.hass.bus.fire(f"{DOMAIN}_entity_update", {"child_id": child_id})

    async def update_longest_streak(self, child_id: str, longest_streak: int) -> None:
        """Met à jour le plus long streak d'un enfant.

        Args:
            child_id: ID de l'enfant
            longest_streak: Valeur du plus long streak
        """
        if DOMAIN not in self.hass.data:
            return

        if "children_entities" not in self.hass.data[DOMAIN]:
            return

        if child_id not in self.hass.data[DOMAIN]["children_entities"]:
            return

        entity_data = self.hass.data[DOMAIN]["children_entities"][child_id]
        entity_data["longest_streak"] = longest_streak

        # Émettre un événement
        self.hass.bus.fire(f"{DOMAIN}_entity_update", {"child_id": child_id})

    async def delete_child_entities(self, child_id: str) -> None:
        """Supprime les entités d'un enfant.

        Args:
            child_id: ID de l'enfant
        """
        _LOGGER.info(f"Deleting entities for child {child_id}")

        if DOMAIN not in self.hass.data:
            return

        if "children_entities" not in self.hass.data[DOMAIN]:
            return

        if child_id in self.hass.data[DOMAIN]["children_entities"]:
            del self.hass.data[DOMAIN]["children_entities"][child_id]
            _LOGGER.debug(f"Entity data deleted for child {child_id}")

            # Émettre un événement pour notifier la suppression
            self.hass.bus.fire(f"{DOMAIN}_entity_delete", {"child_id": child_id})

    def get_entity_data(self, child_id: str) -> dict:
        """Récupère les données d'entités pour un enfant.

        Args:
            child_id: ID de l'enfant

        Returns:
            Dictionnaire avec les données ou None
        """
        if DOMAIN not in self.hass.data:
            return None

        if "children_entities" not in self.hass.data[DOMAIN]:
            return None

        return self.hass.data[DOMAIN]["children_entities"].get(child_id)
