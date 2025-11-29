"""Tests for child-related services."""
import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestChildServices:
    """Test child management services."""

    async def test_create_child(self, mock_hass, sample_child_data):
        """Test creating a child."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )

        assert "child" in response
        assert "id" in response["child"]
        assert response["child"]["id"].startswith("child_")  # Auto-generated ID
        assert response["child"]["name"] == sample_child_data["name"]
        assert response["child"]["points"] == 0
        assert response["child"]["coins"] == 0
        assert response["child"]["level"] == 1
        assert response["child"]["experience"] == 0

    async def test_list_children(self, mock_hass, setup_test_child):
        """Test listing children."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_children",
            {},
            blocking=True,
            return_response=True,
        )

        assert "children" in response
        # Check that the specific child is in the list (not exact count due to test isolation)
        child_ids = [c["id"] for c in response["children"]]
        assert setup_test_child in child_ids

    async def test_update_child(self, mock_hass, setup_test_child):
        """Test updating a child."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "update_child",
            {
                "child_id": setup_test_child,
                "name": "Alice Updated",
            },
            blocking=True,
            return_response=True,
        )

        assert response["child"]["name"] == "Alice Updated"
        assert response["child"]["id"] == setup_test_child

    async def test_add_points(self, mock_hass, setup_test_child):
        """Test adding points to a child."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 50,
                "reason": "Test points",
            },
            blocking=True,
            return_response=True,
        )

        assert response["points_added"] == 50
        assert response["points"] == 50

    async def test_remove_points(self, mock_hass, setup_test_child):
        """Test removing points from a child."""
        # First add points
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
                "reason": "Initial points",
            },
            blocking=True,
            return_response=True,
        )

        # Then remove some
        response = await mock_hass.services.async_call(
            DOMAIN,
            "remove_points",
            {
                "child_id": setup_test_child,
                "points": 30,
                "reason": "Test removal",
            },
            blocking=True,
            return_response=True,
        )

        assert response["points_removed"] == 30
        assert response["points"] == 70

    async def test_set_points(self, mock_hass, setup_test_child):
        """Test setting points directly."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "set_points",
            {
                "child_id": setup_test_child,
                "points": 150,
            },
            blocking=True,
            return_response=True,
        )

        assert response["points"] == 150

    async def test_add_coins(self, mock_hass, setup_test_child):
        """Test adding coins to a child."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {
                "child_id": setup_test_child,
                "coins": 25,
                "reason": "Test coins",
            },
            blocking=True,
            return_response=True,
        )

        assert response["coins_added"] == 25
        assert response["coins"] == 25

    async def test_add_experience(self, mock_hass, setup_test_child):
        """Test adding experience points."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "add_experience",
            {
                "child_id": setup_test_child,
                "xp": 50,
                "reason": "Test XP",
            },
            blocking=True,
            return_response=True,
        )

        assert response["xp_added"] == 50
        assert response["total_xp"] == 50
        assert response["level"] == 1  # Not enough to level up

    async def test_level_up(self, mock_hass, setup_test_child):
        """Test that adding enough XP triggers level up."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "add_experience",
            {
                "child_id": setup_test_child,
                "xp": 150,  # Enough to level up from 1 to 2
                "reason": "Level up test",
            },
            blocking=True,
            return_response=True,
        )

        assert response["level"] >= 2

    async def test_set_level(self, mock_hass, setup_test_child):
        """Test setting level directly."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "set_level",
            {
                "child_id": setup_test_child,
                "level": 5,
            },
            blocking=True,
            return_response=True,
        )

        assert response["new_level"] == 5
        assert response["xp_for_next_level"] > 0

    async def test_get_child_stats(self, mock_hass, setup_test_child):
        """Test getting child statistics."""
        # First add some data
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 100,
            },
            blocking=True,
            return_response=True,
        )

        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_child_stats",
            {
                "child_id": setup_test_child,
                "period": "week",
            },
            blocking=True,
            return_response=True,
        )

        assert "stats" in response
        assert response["stats"]["child_id"] == setup_test_child
        assert "current_status" in response["stats"]
        assert response["stats"]["current_status"]["points"] == 100

    async def test_delete_child(self, mock_hass, setup_test_child):
        """Test deleting a child."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "delete_child",
            {"child_id": setup_test_child},
            blocking=True,
            return_response=True,
        )

        assert response["deleted"] is True
        assert response["child_id"] == setup_test_child

        # Verify child is deleted (check specific child, not total count)
        list_response = await mock_hass.services.async_call(
            DOMAIN,
            "list_children",
            {},
            blocking=True,
            return_response=True,
        )

        child_ids = [c["id"] for c in list_response["children"]]
        assert setup_test_child not in child_ids

    async def test_create_child_duplicate_id(self, mock_hass, setup_test_child, sample_child_data):
        """Test that creating a child with duplicate ID fails."""
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "create_child",
                sample_child_data,  # Same ID as setup_test_child
                blocking=True,
            )

    async def test_update_nonexistent_child(self, mock_hass):
        """Test that updating a non-existent child fails."""
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "update_child",
                {
                    "child_id": "nonexistent_child",
                    "name": "Ghost",
                },
                blocking=True,
            )
