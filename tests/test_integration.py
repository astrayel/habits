"""Integration tests for complete workflows."""
import pytest
from datetime import datetime, timedelta
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestCompleteWorkflows:
    """Test complete user workflows integrating multiple services."""

    async def test_complete_task_workflow(self, mock_hass, sample_child_data, sample_task_data):
        """Test complete workflow: create child, create task, complete, validate.

        TODO: Ce test nécessite la génération automatique d'instances de tâches.
        """
        pass

    async def test_habit_streak_workflow(self, mock_hass, sample_child_data, sample_habit_data):
        """Test habit completion and streak building."""
        # Create child
        child_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )
        child_id = child_response["child"]["id"]

        # Create habit
        habit_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_habit",
            sample_habit_data,
            blocking=True,
            return_response=True,
        )
        habit_id = habit_response["habit"]["id"]

        # Complete habit 5 times to build streak
        for i in range(5):
            await mock_hass.services.async_call(
                DOMAIN,
                "mark_habit_completed",
                {
                    "habit_id": habit_id,
                    "child_id": child_id,
                },
                blocking=True,
            )

        # Check streak
        history_response = await mock_hass.services.async_call(
            DOMAIN,
            "get_habit_history",
            {
                "habit_id": habit_id,
                "child_id": child_id,
                "days": 7,
            },
            blocking=True,
            return_response=True,
        )

        assert history_response["current_streak"] >= 1
        assert len(history_response["history"]) >= 1  # 1 entrée par jour

        # Check points earned
        stats_response = await mock_hass.services.async_call(
            DOMAIN,
            "get_child_stats",
            {"child_id": child_id, "period": "week"},
            blocking=True,
            return_response=True,
        )

        expected_points = sample_habit_data["rewards"]["points"] * 5
        assert stats_response["stats"]["current_status"]["points"] >= expected_points

    async def test_reward_claim_workflow(self, mock_hass, sample_child_data, sample_reward_data):
        """Test complete reward workflow: earn points, claim, approve, consume."""
        # Create child
        child_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )
        child_id = child_response["child"]["id"]

        # Create reward
        reward_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_reward",
            sample_reward_data,
            blocking=True,
            return_response=True,
        )
        reward_id = reward_response["reward"]["id"]

        # Give child points
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {
                "child_id": child_id,
                "points": sample_reward_data["cost_points"] + 50,
            },
            blocking=True,
        )

        # Child claims reward
        claim_response = await mock_hass.services.async_call(
            DOMAIN,
            "claim_reward",
            {
                "reward_id": reward_id,
                "child_id": child_id,
            },
            blocking=True,
            return_response=True,
        )
        claim_id = claim_response["claim"]["id"]
        assert claim_response["claim"]["status"] == "pending"

        # Parent approves
        approve_response = await mock_hass.services.async_call(
            DOMAIN,
            "approve_claim",
            {
                "claim_id": claim_id,
                "approver_comment": "D'accord !",
            },
            blocking=True,
            return_response=True,
        )
        assert approve_response["claim"]["status"] == "approved"

        # Child consumes reward
        consume_response = await mock_hass.services.async_call(
            DOMAIN,
            "consume_claim",
            {"claim_id": claim_id},
            blocking=True,
            return_response=True,
        )
        assert consume_response["claim"]["status"] == "consumed"

    async def test_cosmetic_purchase_workflow(self, mock_hass, sample_child_data, sample_cosmetic_data):
        """Test cosmetic purchase and equip workflow."""
        # Create child
        child_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )
        child_id = child_response["child"]["id"]

        # Create cosmetic
        cosmetic_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_cosmetic",
            sample_cosmetic_data,
            blocking=True,
            return_response=True,
        )
        cosmetic_id = cosmetic_response["cosmetic"]["id"]

        # Give child coins
        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {
                "child_id": child_id,
                "coins": sample_cosmetic_data["cost_coins"] + 50,
            },
            blocking=True,
        )

        # Purchase cosmetic
        purchase_response = await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {
                "cosmetic_id": cosmetic_id,
                "child_id": child_id,
            },
            blocking=True,
            return_response=True,
        )
        assert purchase_response["purchased"] is True

        # Verify it's in owned list
        owned_response = await mock_hass.services.async_call(
            DOMAIN,
            "list_owned_cosmetics",
            {"child_id": child_id},
            blocking=True,
            return_response=True,
        )
        assert any(c["id"] == cosmetic_id for c in owned_response["cosmetics"])

        # Equip cosmetic
        equip_response = await mock_hass.services.async_call(
            DOMAIN,
            "equip_cosmetic",
            {
                "cosmetic_id": cosmetic_id,
                "child_id": child_id,
            },
            blocking=True,
            return_response=True,
        )
        assert equip_response["equipped"] is True

    async def test_leveling_system_workflow(self, mock_hass, sample_child_data, sample_task_data):
        """Test XP earning and level up workflow.

        TODO: La partie mark_task_completed nécessite la génération automatique d'instances.
        """
        # Create child
        child_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )
        child_id = child_response["child"]["id"]
        assert child_response["child"]["level"] == 1

        # Add enough XP to level up multiple times
        xp_response = await mock_hass.services.async_call(
            DOMAIN,
            "add_experience",
            {
                "child_id": child_id,
                "xp": 500,
                "reason": "Batch XP",
            },
            blocking=True,
            return_response=True,
        )

        # Should have leveled up
        assert xp_response["level"] > 1

    async def test_multi_child_comparison(self, mock_hass, sample_child_data):
        """Test comparing multiple children's performance."""
        # Create 3 children
        children = []
        for i in range(3):
            child_data = sample_child_data.copy()
            child_data["child_id"] = f"child_{i:03d}"
            child_data["name"] = f"Child {i+1}"
            child_data["pin_code"] = f"{i+1}{i+1}{i+1}{i+1}"
            child_data["person_entity"] = f"person.child_{i}"

            child_response = await mock_hass.services.async_call(
                DOMAIN,
                "create_child",
                child_data,
                blocking=True,
                return_response=True,
            )
            children.append(child_response["child"]["id"])

        # Give them different amounts of points
        for i, child_id in enumerate(children):
            await mock_hass.services.async_call(
                DOMAIN,
                "add_points",
                {
                    "child_id": child_id,
                    "points": (i + 1) * 50,
                },
                blocking=True,
            )

        # Compare them
        comparison_response = await mock_hass.services.async_call(
            DOMAIN,
            "compare_children",
            {
                "child_ids": children,
                "period": "week",
            },
            blocking=True,
            return_response=True,
        )

        assert len(comparison_response["comparison"]["children"]) == 3

    async def test_category_and_filtering(self, mock_hass, setup_test_child):
        """Test creating custom categories and filtering tasks by them.

        TODO: Les catégories personnalisées ne sont pas encore supportées dans les tâches.
        """
        pass

    async def test_backup_and_restore_workflow(self, mock_hass, sample_child_data):
        """Test backing up and restoring data."""
        # Create some data
        child_response = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )
        child_id = child_response["child"]["id"]

        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {"child_id": child_id, "points": 100},
            blocking=True,
        )

        # Backup data
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        assert "data" in backup_response
        assert "children" in backup_response["data"]
        assert len(backup_response["data"]["children"]) >= 1

        # Verify backup contains metadata
        assert "version" in backup_response
        assert "created_at" in backup_response

        # Test restore
        restore_response = await mock_hass.services.async_call(
            DOMAIN,
            "restore_data",
            {"backup_data": backup_response},
            blocking=True,
            return_response=True,
        )

        assert "children_restored" in restore_response
        assert restore_response["children_restored"] >= 1
