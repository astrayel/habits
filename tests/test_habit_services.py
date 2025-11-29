"""Tests for habit-related services."""
import pytest
from datetime import datetime, timedelta
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestHabitServices:
    """Test habit management services."""

    async def test_create_habit(self, mock_hass, setup_test_child, sample_habit_data):
        """Test creating a habit."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "create_habit",
            sample_habit_data,
            blocking=True,
            return_response=True,
        )

        assert "habit" in response
        assert response["habit"]["title"] == sample_habit_data["title"]
        assert response["habit"]["frequency"] == sample_habit_data["frequency"]

    async def test_list_habits(self, mock_hass, setup_test_habit):
        """Test listing habits."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_habits",
            {},
            blocking=True,
            return_response=True,
        )

        assert "habits" in response
        assert len(response["habits"]) >= 1

    async def test_update_habit(self, mock_hass, setup_test_habit):
        """Test updating a habit."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "update_habit",
            {
                "habit_id": setup_test_habit,
                "title": "Brosser les dents (matin et soir)",
            },
            blocking=True,
            return_response=True,
        )

        assert response["habit"]["title"] == "Brosser les dents (matin et soir)"

    async def test_mark_habit_completed(self, mock_hass, setup_test_child, setup_test_habit):
        """Test marking a habit as completed."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "mark_habit_completed",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        assert "completion" in response
        assert response["completion"]["habit_id"] == setup_test_habit
        assert "rewards_earned" in response

    async def test_habit_streak(self, mock_hass, setup_test_child, setup_test_habit):
        """Test that completing habits builds streaks."""
        # Complete habit multiple times
        for _ in range(3):
            await mock_hass.services.async_call(
                DOMAIN,
                "mark_habit_completed",
                {
                    "habit_id": setup_test_habit,
                    "child_id": setup_test_child,
                },
                blocking=True,
            )

        # Get habit history to check streak
        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_habit_history",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
                "days": 7,
            },
            blocking=True,
            return_response=True,
        )

        assert "history" in response
        assert response["current_streak"] >= 1

    async def test_reset_streak(self, mock_hass, setup_test_child, setup_test_habit):
        """Test resetting a habit streak."""
        # Build a streak first
        await mock_hass.services.async_call(
            DOMAIN,
            "mark_habit_completed",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        # Reset streak
        response = await mock_hass.services.async_call(
            DOMAIN,
            "reset_streak",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
                "reason": "Oubli",
            },
            blocking=True,
            return_response=True,
        )

        assert response["streak_reset"] is True
        assert response["new_streak"] == 0

    async def test_get_habit_history(self, mock_hass, setup_test_child, setup_test_habit):
        """Test getting habit completion history."""
        # Complete habit
        await mock_hass.services.async_call(
            DOMAIN,
            "mark_habit_completed",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
            },
            blocking=True,
        )

        # Get history
        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_habit_history",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
                "days": 30,
            },
            blocking=True,
            return_response=True,
        )

        assert "history" in response
        assert "current_streak" in response
        assert "completion_rate" in response

    async def test_delete_habit(self, mock_hass, setup_test_habit):
        """Test deleting a habit."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "delete_habit",
            {"habit_id": setup_test_habit},
            blocking=True,
            return_response=True,
        )

        assert response["deleted"] is True

    async def test_habit_with_photo_proof(self, mock_hass, setup_test_child, setup_test_habit):
        """Test completing habit with photo proof."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "mark_habit_completed",
            {
                "habit_id": setup_test_habit,
                "child_id": setup_test_child,
                "photo_proof": "/local/proof_images/teeth_brushed.jpg",
            },
            blocking=True,
            return_response=True,
        )

        assert "photo_proof" in response["completion"]
