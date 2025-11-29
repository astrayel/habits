"""Tests for task-related services."""
import pytest
from datetime import datetime, timedelta
from homeassistant.exceptions import HomeAssistantError

from custom_components.habits_manager.const import DOMAIN


class TestTaskServices:
    """Test task management services."""

    async def test_create_task(self, mock_hass, setup_test_child, sample_task_data):
        """Test creating a task."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "create_task",
            sample_task_data,
            blocking=True,
            return_response=True,
        )

        assert "task" in response
        assert response["task"]["title"] == sample_task_data["title"]
        assert response["task"]["rewards"]["points"] == sample_task_data["rewards"]["points"]
        assert response["task"]["schedule"]["type"] == sample_task_data["schedule"]["type"]

    async def test_list_tasks(self, mock_hass, setup_test_task):
        """Test listing tasks."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_tasks",
            {},
            blocking=True,
            return_response=True,
        )

        assert "tasks" in response
        assert len(response["tasks"]) >= 1

    async def test_update_task(self, mock_hass, setup_test_task):
        """Test updating a task."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "update_task",
            {
                "task_id": setup_test_task,
                "title": "Ranger et nettoyer sa chambre",
            },
            blocking=True,
            return_response=True,
        )

        assert response["task"]["title"] == "Ranger et nettoyer sa chambre"

    async def test_mark_task_completed(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test marking a task as completed."""
        instance_id = setup_test_task_instance

        response = await mock_hass.services.async_call(
            DOMAIN,
            "mark_task_completed",
            {
                "instance_id": instance_id,
                "child_id": setup_test_child,
            },
            blocking=True,
            return_response=True,
        )

        assert "instance" in response
        assert response["instance"]["status"] == "completed_waiting"
        assert response["instance"]["id"] == instance_id

    async def test_validate_task(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test validating a completed task."""
        instance_id = setup_test_task_instance

        # First mark as completed
        await mock_hass.services.async_call(
            DOMAIN,
            "mark_task_completed",
            {"instance_id": instance_id, "child_id": setup_test_child},
            blocking=True,
        )

        # Then validate
        response = await mock_hass.services.async_call(
            DOMAIN,
            "validate_task",
            {"instance_id": instance_id, "validator_comment": "Bien fait !"},
            blocking=True,
            return_response=True,
        )

        assert response["instance"]["status"] == "validated"
        assert "rewards" in response

    async def test_refuse_task(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test refusing a completed task."""
        instance_id = setup_test_task_instance

        # First mark as completed
        await mock_hass.services.async_call(
            DOMAIN,
            "mark_task_completed",
            {"instance_id": instance_id, "child_id": setup_test_child},
            blocking=True,
        )

        # Then refuse
        response = await mock_hass.services.async_call(
            DOMAIN,
            "refuse_task",
            {
                "instance_id": instance_id,
                "validator_comment": "Pas assez bien rangé",
                "apply_penalties": True,
            },
            blocking=True,
            return_response=True,
        )

        assert response["instance"]["status"] == "refused"

    async def test_suspend_task(self, mock_hass, setup_test_task):
        """Test suspending a task."""
        from datetime import datetime, timedelta

        until_date = (datetime.now() + timedelta(days=7)).isoformat()

        response = await mock_hass.services.async_call(
            DOMAIN,
            "suspend_task",
            {
                "task_id": setup_test_task,
                "until": until_date,
                "reason": "Vacances",
            },
            blocking=True,
            return_response=True,
        )

        assert response["suspended"] is True

    async def test_resume_task(self, mock_hass, setup_test_task):
        """Test resuming a suspended task."""
        # First suspend the task
        await mock_hass.services.async_call(
            DOMAIN,
            "suspend_task",
            {"task_id": setup_test_task, "reason": "Test"},
            blocking=True,
        )

        # Then resume it
        response = await mock_hass.services.async_call(
            DOMAIN,
            "resume_task",
            {"task_id": setup_test_task},
            blocking=True,
            return_response=True,
        )

        assert response["suspended"] is False

    async def test_list_task_instances(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test listing task instances."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "list_task_instances",
            {"child_id": setup_test_child},
            blocking=True,
            return_response=True,
        )

        assert "instances" in response
        assert len(response["instances"]) >= 1

    async def test_get_task_instance(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test getting a specific task instance."""
        instance_id = setup_test_task_instance

        response = await mock_hass.services.async_call(
            DOMAIN,
            "get_task_instance",
            {"instance_id": instance_id},
            blocking=True,
            return_response=True,
        )

        assert "instance" in response
        assert response["instance"]["id"] == instance_id
        assert response["instance"]["child_id"] == setup_test_child

    async def test_cancel_task_instance(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test cancelling a task instance."""
        instance_id = setup_test_task_instance

        response = await mock_hass.services.async_call(
            DOMAIN,
            "cancel_task_instance",
            {"instance_id": instance_id, "reason": "Maladie"},
            blocking=True,
            return_response=True,
        )

        assert response["instance"]["status"] == "cancelled"
        assert response["instance"]["cancel_reason"] == "Maladie"

    async def test_reschedule_task_instance(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test rescheduling a task instance."""
        from datetime import date, timedelta

        instance_id = setup_test_task_instance
        new_date = (date.today() + timedelta(days=1)).isoformat()

        response = await mock_hass.services.async_call(
            DOMAIN,
            "reschedule_task_instance",
            {"instance_id": instance_id, "new_date": new_date},
            blocking=True,
            return_response=True,
        )

        assert response["instance"]["date"] == new_date
        assert response["instance"]["status"] == "pending"

    async def test_delete_task(self, mock_hass, setup_test_task):
        """Test deleting a task."""
        response = await mock_hass.services.async_call(
            DOMAIN,
            "delete_task",
            {"task_id": setup_test_task},
            blocking=True,
            return_response=True,
        )

        assert response["deleted"] is True

    async def test_task_with_photo_proof(self, mock_hass, setup_test_child, setup_test_task_instance):
        """Test completing task with photo proof."""
        instance_id = setup_test_task_instance

        response = await mock_hass.services.async_call(
            DOMAIN,
            "mark_task_completed",
            {
                "instance_id": instance_id,
                "child_id": setup_test_child,
                "photo_url": "/local/proofs/task_photo_123.jpg",
            },
            blocking=True,
            return_response=True,
        )

        # Vérifie que la tâche est marquée comme complétée
        assert response["instance"]["status"] == "completed_waiting"
        # Vérifie que la photo_url est stockée
        assert response["instance"]["photo_url"] == "/local/proofs/task_photo_123.jpg"
