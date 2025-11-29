"""Tests for configuration services."""
import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestConfigServices:
    """Test system configuration services."""

    async def test_create_category(self, mock_hass):
        """Test creating a custom category."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "create_category",
            {
                "name": "École",
                "type": "task",
                "icon": "mdi:school",
                "color": "#4CAF50",
            },
            blocking=True,
            return_response=True,
        )

        assert "category" in response
        assert response["category"]["name"] == "École"
        assert response["category"]["type"] == "task"
        assert response["category"]["icon"] == "mdi:school"

    async def test_list_categories(self, mock_hass):
        """Test listing categories (built-in + custom)."""
        # Create a custom category first
        await mock_hass.services.async_call(
            DOMAIN,
            "create_category",
            {
                "name": "Sport",
                "type": "task",
                "icon": "mdi:soccer",
            },
            blocking=True,
        )

        # List all categories
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_categories",
            {},
            blocking=True,
            return_response=True,
        )

        assert "categories" in response
        assert len(response["categories"]) > 0

        # Check that both built-in and custom categories are present
        category_names = [c["name"] for c in response["categories"]]
        assert "Sport" in category_names

    async def test_list_categories_by_type(self, mock_hass):
        """Test filtering categories by type."""
        # Create categories of different types
        await mock_hass.services.async_call(
            DOMAIN,
            "create_category",
            {
                "name": "Devoirs",
                "type": "task",
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "create_category",
            {
                "name": "Exercice quotidien",
                "type": "habit",
            },
            blocking=True,
        )

        # List only task categories
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_categories",
            {"type": "task"},
            blocking=True,
            return_response=True,
        )

        assert all(c["type"] == "task" for c in response["categories"])

    async def test_update_level_config(self, mock_hass):
        """Test updating XP/level configuration."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "update_level_config",
            {
                "level": 10,
                "xp_required": 500,
                "unlock_message": "Félicitations !",
            },
            blocking=True,
            return_response=True,
        )

        assert "config" in response
        assert "level_thresholds" in response["config"]
        # Vérifier que le seuil a été ajouté
        thresholds = response["config"]["level_thresholds"]
        level_10 = next((t for t in thresholds if t["level"] == 10), None)
        assert level_10 is not None
        assert level_10["xp_required"] == 500

    async def test_get_system_config(self, mock_hass):
        """Test getting system configuration."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_system_config",
            {},
            blocking=True,
            return_response=True,
        )

        assert "config" in response
        assert "level_system" in response["config"]
        assert "base_xp_for_level_up" in response["config"]["level_system"]

    async def test_invalid_category_type(self, mock_hass):
        """Test that creating category with invalid type fails."""
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "create_category",
                {
                    "name": "Invalid",
                    "type": "invalid_type",
                },
                blocking=True,
            )

    async def test_update_level_config_validation(self, mock_hass):
        """Test that level config update validates inputs."""
        # Test with invalid values
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "update_level_config",
                {
                    "base_xp": -50,  # Negative XP should fail
                },
                blocking=True,
            )

