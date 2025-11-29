"""Tests for statistics and reporting services."""
import pytest
from datetime import datetime, timedelta
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestStatsServices:
    """Test statistics and reporting services."""

    async def test_get_weekly_report(self, mock_hass, setup_test_child):
        """Test getting weekly report."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_weekly_report",
            {"child_id": setup_test_child},
            blocking=True,
            return_response=True,
        )

        assert "report" in response
        assert "child_id" in response["report"]
        assert "week_start" in response["report"]
        assert "week_end" in response["report"]
        assert "current_status" in response["report"]  # Structure actuelle

    async def test_compare_children(self, mock_hass, sample_child_data):
        """Test comparing multiple children."""
        # Create two children
        child1_data = sample_child_data.copy()
        child1_data["child_id"] = "child_001"
        child1_data["name"] = "Alice"
        child1_data["person_entity"] = "person.alice_stats"

        child2_data = sample_child_data.copy()
        child2_data["child_id"] = "child_002"
        child2_data["name"] = "Bob"
        child2_data["pin_code"] = "5678"
        child2_data["person_entity"] = "person.bob_stats"

        child1_resp = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            child1_data,
            blocking=True,
            return_response=True,
        )

        child2_resp = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            child2_data,
            blocking=True,
            return_response=True,
        )

        # Use actual returned IDs for comparison
        child1_id = child1_resp["child"]["id"]
        child2_id = child2_resp["child"]["id"]

        # Compare them
        response = await mock_hass.services.async_call(
            DOMAIN,
            "compare_children",
            {
                "child_ids": [child1_id, child2_id],
                "period": "week",
            },
            blocking=True,
            return_response=True,
        )

        assert "comparison" in response
        assert len(response["comparison"]["children"]) == 2

    async def test_get_points_history(self, mock_hass, setup_test_child):
        """Test getting points history."""
        # Add some points
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 25,
                "reason": "Test 1",
            },
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": setup_test_child,
                "points": 50,
                "reason": "Test 2",
            },
            blocking=True,
        )

        # Get history
        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_points_history",
            {
                "child_id": setup_test_child,
                "days": 7,
            },
            blocking=True,
            return_response=True,
        )

        assert "history" in response
        assert "total_points" in response
        assert response["total_points"] == 75

    async def test_get_child_history(self, mock_hass, setup_test_child):
        """Test getting complete child history."""
        # Add some points to create history
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {"child_id": setup_test_child, "points": 50, "reason": "Test history"},
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {"child_id": setup_test_child, "coins": 10, "reason": "Test coins"},
            blocking=True,
        )

        # Get child history
        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_child_history",
            {"child_id": setup_test_child, "limit": 10},
            blocking=True,
            return_response=True,
        )

        assert "history" in response
        assert len(response["history"]) >= 2  # Au moins points + coins

    async def test_get_child_stats(self, mock_hass, setup_test_child):
        """Test getting child statistics."""
        # Add some activity
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {"child_id": setup_test_child, "points": 100},
            blocking=True,
        )

        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_child_stats",
            {"child_id": setup_test_child},
            blocking=True,
            return_response=True,
        )

        assert "stats" in response
        assert "child_id" in response["stats"]
