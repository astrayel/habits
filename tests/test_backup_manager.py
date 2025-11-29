"""Tests for backup manager."""
import pytest
from datetime import datetime
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN
from custom_components.habits_manager.core.exceptions import ValidationError
from custom_components.habits_manager.managers.backup_manager import BackupManager


class TestBackupManager:
    """Test backup and restore functionality."""

    async def test_backup_includes_all_entities(self, mock_hass, sample_child_data, sample_task_data, sample_habit_data, sample_reward_data):
        """Test that backup includes all entity types."""
        # Create various entities
        child_resp = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )
        child_id = child_resp["child"]["id"]

        await mock_hass.services.async_call(
            DOMAIN,
            "create_task",
            sample_task_data,
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "create_habit",
            sample_habit_data,
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "create_reward",
            sample_reward_data,
            blocking=True,
        )

        # Create backup
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Verify structure
        assert "version" in backup_response
        assert "created_at" in backup_response
        assert "data" in backup_response

        data = backup_response["data"]
        assert "children" in data
        assert "tasks" in data
        assert "habits" in data
        assert "rewards" in data

    async def test_backup_without_history(self, mock_hass, setup_test_child):
        """Test backup with include_history=False."""
        # Add some points to create history
        await mock_hass.services.async_call(
            DOMAIN,
            "add_points",
            {"child_id": setup_test_child, "points": 100, "reason": "Test"},
            blocking=True,
        )

        # Create backup without history
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {"include_history": False},
            blocking=True,
            return_response=True,
        )

        # Check that children exist but history is empty
        assert len(backup_response["data"]["children"]) >= 1
        # History should be empty or filtered
        for child in backup_response["data"]["children"]:
            assert child.get("points_history", []) == []

    async def test_backup_without_cosmetics(self, mock_hass, setup_test_child, sample_cosmetic_data):
        """Test backup with include_cosmetics=False."""
        # Create a cosmetic
        cosmetic_resp = await mock_hass.services.async_call(
            DOMAIN,
            "create_cosmetic",
            sample_cosmetic_data,
            blocking=True,
            return_response=True,
        )
        cosmetic_id = cosmetic_resp["cosmetic"]["id"]

        # Give child coins and purchase cosmetic
        await mock_hass.services.async_call(
            DOMAIN,
            "add_coins",
            {"child_id": setup_test_child, "coins": 500},
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "purchase_cosmetic",
            {"cosmetic_id": cosmetic_id, "child_id": setup_test_child},
            blocking=True,
        )

        # Create backup without cosmetics
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {"include_cosmetics": False},
            blocking=True,
            return_response=True,
        )

        # Check that owned_cosmetics is empty
        for child in backup_response["data"]["children"]:
            assert child.get("owned_cosmetics", []) == []

    async def test_restore_backup_overwrite(self, mock_hass, sample_child_data):
        """Test restore with overwrite strategy."""
        # Create initial child
        child_resp = await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
            return_response=True,
        )

        # Create backup
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Restore with overwrite
        restore_response = await mock_hass.services.async_call(
            DOMAIN,
            "restore_data",
            {"backup_data": backup_response, "merge_strategy": "overwrite"},
            blocking=True,
            return_response=True,
        )

        assert "children_restored" in restore_response
        assert restore_response["children_restored"] >= 1

    async def test_restore_backup_merge(self, mock_hass, sample_child_data):
        """Test restore with merge strategy."""
        # Create child
        await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
        )

        # Create backup
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Restore with merge (should skip existing as they are newer)
        restore_response = await mock_hass.services.async_call(
            DOMAIN,
            "restore_data",
            {"backup_data": backup_response, "merge_strategy": "merge"},
            blocking=True,
            return_response=True,
        )

        assert "skipped" in restore_response

    async def test_restore_backup_skip(self, mock_hass, sample_child_data):
        """Test restore with skip strategy."""
        # Create child
        await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
        )

        # Create backup
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Restore with skip (should skip all existing)
        restore_response = await mock_hass.services.async_call(
            DOMAIN,
            "restore_data",
            {"backup_data": backup_response, "merge_strategy": "skip"},
            blocking=True,
            return_response=True,
        )

        assert "skipped" in restore_response
        assert restore_response["skipped"] >= 1


class TestBackupValidation:
    """Test backup validation."""

    async def test_validate_backup_missing_version(self, mock_hass):
        """Test validation fails without version."""
        invalid_backup = {
            "created_at": datetime.now().isoformat(),
            "metadata": {},
            "data": {
                "children": [],
                "tasks": [],
                "habits": [],
                "task_instances": [],
                "habit_streaks": [],
                "rewards": [],
                "reward_claims": [],
                "cosmetics": [],
            }
        }

        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "restore_data",
                {"backup_data": invalid_backup},
                blocking=True,
            )

    async def test_validate_backup_missing_data(self, mock_hass):
        """Test validation fails without data section."""
        invalid_backup = {
            "version": "1.0.0",
            "created_at": datetime.now().isoformat(),
            "metadata": {},
        }

        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "restore_data",
                {"backup_data": invalid_backup},
                blocking=True,
            )

    async def test_validate_backup_missing_children_key(self, mock_hass):
        """Test validation fails without children in data."""
        invalid_backup = {
            "version": "1.0.0",
            "created_at": datetime.now().isoformat(),
            "metadata": {},
            "data": {
                "tasks": [],
                "habits": [],
                "task_instances": [],
                "habit_streaks": [],
                "rewards": [],
                "reward_claims": [],
                "cosmetics": [],
            }
        }

        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "restore_data",
                {"backup_data": invalid_backup},
                blocking=True,
            )

    async def test_validate_backup_invalid_data_type(self, mock_hass):
        """Test validation fails when data key is not a list."""
        invalid_backup = {
            "version": "1.0.0",
            "created_at": datetime.now().isoformat(),
            "metadata": {},
            "data": {
                "children": "not_a_list",
                "tasks": [],
                "habits": [],
                "task_instances": [],
                "habit_streaks": [],
                "rewards": [],
                "reward_claims": [],
                "cosmetics": [],
            }
        }

        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "restore_data",
                {"backup_data": invalid_backup},
                blocking=True,
            )

    async def test_validate_backup_invalid_merge_strategy(self, mock_hass, sample_child_data):
        """Test validation fails with invalid merge strategy."""
        # Create a valid backup first
        await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
        )

        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Try to restore with invalid strategy
        with pytest.raises(HomeAssistantError):
            await mock_hass.services.async_call(
                DOMAIN,
                "restore_data",
                {"backup_data": backup_response, "merge_strategy": "invalid_strategy"},
                blocking=True,
            )


class TestBackupMetadata:
    """Test backup metadata."""

    async def test_backup_contains_metadata(self, mock_hass, sample_child_data, sample_task_data):
        """Test that backup contains accurate metadata."""
        # Create some entities
        await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
        )

        await mock_hass.services.async_call(
            DOMAIN,
            "create_task",
            sample_task_data,
            blocking=True,
        )

        # Create backup
        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Verify metadata
        assert "metadata" in backup_response
        metadata = backup_response["metadata"]
        assert "children_count" in metadata
        assert "tasks_count" in metadata
        assert metadata["children_count"] >= 1
        assert metadata["tasks_count"] >= 1

    async def test_backup_timestamp(self, mock_hass, sample_child_data):
        """Test that backup has a valid timestamp."""
        await mock_hass.services.async_call(
            DOMAIN,
            "create_child",
            sample_child_data,
            blocking=True,
        )

        backup_response = await mock_hass.services.async_call(
            DOMAIN,
            "backup_data",
            {},
            blocking=True,
            return_response=True,
        )

        # Verify timestamp is valid ISO format
        created_at = backup_response["created_at"]
        parsed_date = datetime.fromisoformat(created_at)
        assert parsed_date is not None
        # Should be recent (within last minute)
        assert (datetime.now() - parsed_date).total_seconds() < 60
