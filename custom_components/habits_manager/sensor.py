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

    # Stocker le callback pour création dynamique ultérieure
    hass.data[DOMAIN]["sensor_add_entities"] = async_add_entities

    entities = []
    children_data = hass.data[DOMAIN]["children_entities"]

    # Créer les sensors pour chaque enfant
    for child_id, child_data in children_data.items():
        entities.extend(_create_child_sensors(hass, child_id, child_data))

    async_add_entities(entities, True)
    _LOGGER.info(f"Created {len(entities)} sensor entities for {len(children_data)} children")


def _create_child_sensors(hass: HomeAssistant, child_id: str, child_data: dict) -> list:
    """Crée la liste des 8 sensors pour un enfant.

    Args:
        hass: Instance Home Assistant
        child_id: ID de l'enfant
        child_data: Données de l'enfant

    Returns:
        Liste des sensors créés
    """
    return [
        ChildPointsSensor(hass, child_id, child_data),
        ChildCoinsSensor(hass, child_id, child_data),
        ChildLevelSensor(hass, child_id, child_data),
        ChildExperienceSensor(hass, child_id, child_data),
        ChildTasksPendingSensor(hass, child_id, child_data),
        ChildTasksWaitingSensor(hass, child_id, child_data),
        ChildLongestStreakSensor(hass, child_id, child_data),
        ChildHasPendingValidationSensor(hass, child_id, child_data),
    ]


async def async_create_child_sensors(hass: HomeAssistant, child_id: str) -> None:
    """Crée dynamiquement les sensors pour un nouvel enfant.

    Appelé après la création d'un enfant via le service create_child.

    Args:
        hass: Instance Home Assistant
        child_id: ID de l'enfant pour lequel créer les sensors
    """
    if DOMAIN not in hass.data:
        _LOGGER.error("Domain not found in hass.data, cannot create sensors")
        return

    if "sensor_add_entities" not in hass.data[DOMAIN]:
        _LOGGER.warning("sensor_add_entities callback not available, sensors will be created on next restart")
        return

    if "children_entities" not in hass.data[DOMAIN]:
        _LOGGER.error("children_entities not found in hass.data")
        return

    child_data = hass.data[DOMAIN]["children_entities"].get(child_id)
    if not child_data:
        _LOGGER.error(f"Child data not found for {child_id}")
        return

    # Créer les sensors
    sensors = _create_child_sensors(hass, child_id, child_data)

    # Ajouter les sensors via le callback
    add_entities = hass.data[DOMAIN]["sensor_add_entities"]
    add_entities(sensors, True)

    _LOGGER.info(f"Dynamically created {len(sensors)} sensors for child {child_id}")


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

    @property
    def extra_state_attributes(self):
        """Attributs communs à tous les sensors d'un enfant."""
        return {
            "child_id": self._child_id,
            "child_name": self._child_data.get('name', 'Unknown'),
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
        attrs = super().extra_state_attributes.copy()
        attrs.update({
            "experience_to_next_level": self._child_data.get("experience_to_next_level", 100),
            "progress_percentage": int(
                (self._child_data.get("experience", 0) / self._child_data.get("experience_to_next_level", 100)) * 100
            ) if self._child_data.get("experience_to_next_level", 100) > 0 else 0,
        })
        return attrs


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
