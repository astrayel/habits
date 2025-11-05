"""Sensor platform for Habits Manager.

Creates sensor entities for each child to display their stats in Home Assistant.
"""
from homeassistant.components.sensor import SensorEntity
from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

from .const import DOMAIN, _LOGGER


async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType = None,
) -> None:
    """Configure la plateforme sensor.

    Args:
        hass: Instance Home Assistant
        config: Configuration
        async_add_entities: Callback pour ajouter les entités
        discovery_info: Informations de découverte
    """
    if DOMAIN not in hass.data:
        _LOGGER.warning("Habits Manager domain not found in hass.data")
        return

    if "children_entities" not in hass.data[DOMAIN]:
        _LOGGER.warning("No children entities data found")
        return

    entities = []
    children_data = hass.data[DOMAIN]["children_entities"]

    # Créer les sensors pour chaque enfant
    for child_id, child_data in children_data.items():
        entities.extend([
            ChildPointsSensor(hass, child_id, child_data),
            ChildCoinsSensor(hass, child_id, child_data),
            ChildLevelSensor(hass, child_id, child_data),
            ChildExperienceSensor(hass, child_id, child_data),
            ChildTasksPendingSensor(hass, child_id, child_data),
            ChildTasksWaitingSensor(hass, child_id, child_data),
            ChildLongestStreakSensor(hass, child_id, child_data),
            ChildHasPendingValidationSensor(hass, child_id, child_data),
        ])

    async_add_entities(entities, True)
    _LOGGER.info(f"Created {len(entities)} sensor entities for {len(children_data)} children")


class BaseChildSensor(SensorEntity):
    """Sensor de base pour un enfant."""

    def __init__(self, hass: HomeAssistant, child_id: str, child_data: dict):
        """Initialise le sensor.

        Args:
            hass: Instance Home Assistant
            child_id: ID de l'enfant
            child_data: Données de l'enfant
        """
        self.hass = hass
        self._child_id = child_id
        self._child_data = child_data
        self._attr_should_poll = False

    @property
    def device_info(self):
        """Informations du device groupant les sensors d'un enfant."""
        return {
            "identifiers": {(DOMAIN, self._child_id)},
            "name": f"Habits Manager - {self._child_data.get('name', 'Unknown')}",
            "manufacturer": "Habits Manager",
            "model": "Child Profile",
        }

    async def async_added_to_hass(self):
        """S'abonne aux événements de mise à jour."""

        @callback
        def handle_entity_update(event):
            """Handle entity update event."""
            if event.data.get("child_id") == self._child_id:
                # Rafraîchir les données depuis hass.data
                if DOMAIN in self.hass.data and "children_entities" in self.hass.data[DOMAIN]:
                    updated_data = self.hass.data[DOMAIN]["children_entities"].get(self._child_id)
                    if updated_data:
                        self._child_data.update(updated_data)
                        self.async_write_ha_state()

        @callback
        def handle_entity_delete(event):
            """Handle entity delete event."""
            if event.data.get("child_id") == self._child_id:
                # Supprimer l'entité
                self.hass.async_create_task(self.async_remove())

        # S'abonner aux événements
        self.async_on_remove(
            self.hass.bus.async_listen(f"{DOMAIN}_entity_update", handle_entity_update)
        )
        self.async_on_remove(
            self.hass.bus.async_listen(f"{DOMAIN}_entity_delete", handle_entity_delete)
        )


class ChildPointsSensor(BaseChildSensor):
    """Sensor pour les points d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Points"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_points"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("points", 0)

    @property
    def icon(self):
        """Icône du sensor."""
        return "mdi:star"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "pts"


class ChildCoinsSensor(BaseChildSensor):
    """Sensor pour les pièces d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Coins"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_coins"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("coins", 0)

    @property
    def icon(self):
        """Icône du sensor."""
        return "mdi:coin"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "coins"


class ChildLevelSensor(BaseChildSensor):
    """Sensor pour le niveau d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Level"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_level"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("level", 1)

    @property
    def icon(self):
        """Icône du sensor."""
        level = self._child_data.get("level", 1)
        if level >= 10:
            return "mdi:trophy"
        elif level >= 5:
            return "mdi:medal"
        else:
            return "mdi:chevron-up"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return None


class ChildExperienceSensor(BaseChildSensor):
    """Sensor pour l'expérience d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Experience"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_experience"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("experience", 0)

    @property
    def icon(self):
        """Icône du sensor."""
        return "mdi:chart-line"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "XP"

    @property
    def extra_state_attributes(self):
        """Attributs supplémentaires."""
        return {
            "experience_to_next_level": self._child_data.get("experience_to_next_level", 100),
            "progress_percentage": int(
                (self._child_data.get("experience", 0) / self._child_data.get("experience_to_next_level", 100)) * 100
            ) if self._child_data.get("experience_to_next_level", 100) > 0 else 0,
        }


class ChildTasksPendingSensor(BaseChildSensor):
    """Sensor pour les tâches en attente d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Tasks Pending"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_tasks_pending"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("tasks_pending", 0)

    @property
    def icon(self):
        """Icône du sensor."""
        pending = self._child_data.get("tasks_pending", 0)
        if pending > 0:
            return "mdi:checkbox-marked-circle-outline"
        else:
            return "mdi:checkbox-marked-circle"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "tasks"


class ChildTasksWaitingSensor(BaseChildSensor):
    """Sensor pour les tâches en attente de validation d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Tasks Waiting Validation"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_tasks_waiting"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("tasks_waiting", 0)

    @property
    def icon(self):
        """Icône du sensor."""
        waiting = self._child_data.get("tasks_waiting", 0)
        if waiting > 0:
            return "mdi:clock-alert"
        else:
            return "mdi:clock-check"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "tasks"


class ChildLongestStreakSensor(BaseChildSensor):
    """Sensor pour le plus long streak d'un enfant."""

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Longest Streak"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_longest_streak"

    @property
    def state(self):
        """État du sensor."""
        return self._child_data.get("longest_streak", 0)

    @property
    def icon(self):
        """Icône du sensor."""
        streak = self._child_data.get("longest_streak", 0)
        if streak >= 30:
            return "mdi:fire"
        elif streak >= 7:
            return "mdi:flame"
        else:
            return "mdi:fire-off"

    @property
    def unit_of_measurement(self):
        """Unité de mesure."""
        return "days"


class ChildHasPendingValidationSensor(BinarySensorEntity):
    """Binary sensor indiquant si un enfant a des tâches en attente de validation."""

    def __init__(self, hass: HomeAssistant, child_id: str, child_data: dict):
        """Initialise le sensor.

        Args:
            hass: Instance Home Assistant
            child_id: ID de l'enfant
            child_data: Données de l'enfant
        """
        self.hass = hass
        self._child_id = child_id
        self._child_data = child_data
        self._attr_should_poll = False

    @property
    def name(self):
        """Nom du sensor."""
        return f"{self._child_data.get('name', 'Unknown')} Has Pending Validation"

    @property
    def unique_id(self):
        """ID unique du sensor."""
        return f"habits_{self._child_id}_has_pending_validation"

    @property
    def is_on(self):
        """État du binary sensor."""
        return self._child_data.get("has_pending_validation", False)

    @property
    def icon(self):
        """Icône du sensor."""
        if self.is_on:
            return "mdi:bell-alert"
        else:
            return "mdi:bell-outline"

    @property
    def device_class(self):
        """Classe du device."""
        return "problem"

    @property
    def device_info(self):
        """Informations du device."""
        return {
            "identifiers": {(DOMAIN, self._child_id)},
            "name": f"Habits Manager - {self._child_data.get('name', 'Unknown')}",
            "manufacturer": "Habits Manager",
            "model": "Child Profile",
        }

    async def async_added_to_hass(self):
        """S'abonne aux événements de mise à jour."""

        @callback
        def handle_entity_update(event):
            """Handle entity update event."""
            if event.data.get("child_id") == self._child_id:
                # Rafraîchir les données depuis hass.data
                if DOMAIN in self.hass.data and "children_entities" in self.hass.data[DOMAIN]:
                    updated_data = self.hass.data[DOMAIN]["children_entities"].get(self._child_id)
                    if updated_data:
                        self._child_data.update(updated_data)
                        self.async_write_ha_state()

        @callback
        def handle_entity_delete(event):
            """Handle entity delete event."""
            if event.data.get("child_id") == self._child_id:
                # Supprimer l'entité
                self.hass.async_create_task(self.async_remove())

        # S'abonner aux événements
        self.async_on_remove(
            self.hass.bus.async_listen(f"{DOMAIN}_entity_update", handle_entity_update)
        )
        self.async_on_remove(
            self.hass.bus.async_listen(f"{DOMAIN}_entity_delete", handle_entity_delete)
        )
