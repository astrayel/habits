"""Tests for sensor platform."""
import pytest
from unittest.mock import MagicMock, AsyncMock, patch

from custom_components.habits_manager.const import DOMAIN
from custom_components.habits_manager.sensor import (
    BaseChildSensor,
    ChildPointsSensor,
    ChildCoinsSensor,
    ChildLevelSensor,
    ChildExperienceSensor,
    ChildTasksPendingSensor,
    ChildTasksWaitingSensor,
    ChildLongestStreakSensor,
    _create_child_sensors,
)


@pytest.fixture
def mock_hass_sensor():
    """Create a mock Home Assistant instance for sensors."""
    hass = MagicMock()
    hass.data = {
        DOMAIN: {
            "children_entities": {},
            "task_manager": MagicMock(),
            "reward_manager": MagicMock(),
        }
    }
    hass.bus = MagicMock()
    hass.bus.async_listen = MagicMock(return_value=MagicMock())
    return hass


@pytest.fixture
def sample_child_sensor_data():
    """Sample child data for sensors."""
    return {
        "id": "child_test_001",
        "name": "Alice",
        "person_entity": "person.alice",
        "points": 150,
        "coins": 75,
        "level": 5,
        "experience": 450,
        "experience_to_next_level": 500,
        "tasks_pending": 3,
        "tasks_waiting": 2,
        "longest_streak": 14,
        "avatar": {"photo_url": "/local/alice.jpg"},
        "badges": ["first_task", "streak_7"],
        "owned_cosmetics": ["hat_001", "theme_dark"],
    }


class TestChildPointsSensor:
    """Test ChildPointsSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 points"

    def test_sensor_unique_id(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unique_id."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unique_id == "habits_child_test_001_points"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 150

    def test_sensor_icon(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor icon."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.icon == "mdi:star"

    def test_sensor_unit(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unit of measurement."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unit_of_measurement == "pts"

    def test_sensor_state_default(self, mock_hass_sensor):
        """Test sensor state with no points."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", {"name": "Test"}
        )
        assert sensor.state == 0


class TestChildCoinsSensor:
    """Test ChildCoinsSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildCoinsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 coins"

    def test_sensor_unique_id(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unique_id."""
        sensor = ChildCoinsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unique_id == "habits_child_test_001_coins"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildCoinsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 75

    def test_sensor_icon(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor icon."""
        sensor = ChildCoinsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.icon == "mdi:coin"

    def test_sensor_unit(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unit of measurement."""
        sensor = ChildCoinsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unit_of_measurement == "coins"


class TestChildLevelSensor:
    """Test ChildLevelSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildLevelSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 level"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildLevelSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 5

    def test_sensor_icon_low_level(self, mock_hass_sensor):
        """Test sensor icon for low level."""
        sensor = ChildLevelSensor(
            mock_hass_sensor, "child_test_001", {"level": 2}
        )
        assert sensor.icon == "mdi:chevron-up"

    def test_sensor_icon_mid_level(self, mock_hass_sensor):
        """Test sensor icon for mid level."""
        sensor = ChildLevelSensor(
            mock_hass_sensor, "child_test_001", {"level": 7}
        )
        assert sensor.icon == "mdi:medal"

    def test_sensor_icon_high_level(self, mock_hass_sensor):
        """Test sensor icon for high level."""
        sensor = ChildLevelSensor(
            mock_hass_sensor, "child_test_001", {"level": 15}
        )
        assert sensor.icon == "mdi:trophy"

    def test_sensor_unit_none(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor has no unit."""
        sensor = ChildLevelSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unit_of_measurement is None


class TestChildExperienceSensor:
    """Test ChildExperienceSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildExperienceSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 experience"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildExperienceSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 450

    def test_sensor_icon(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor icon."""
        sensor = ChildExperienceSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.icon == "mdi:chart-line"

    def test_sensor_unit(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unit."""
        sensor = ChildExperienceSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unit_of_measurement == "XP"

    def test_sensor_extra_attributes(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor extra state attributes."""
        sensor = ChildExperienceSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        attrs = sensor.extra_state_attributes
        assert attrs["experience_to_next_level"] == 500
        assert attrs["progress_percentage"] == 90  # 450/500 * 100

    def test_sensor_progress_zero_division(self, mock_hass_sensor):
        """Test progress percentage handles zero."""
        sensor = ChildExperienceSensor(
            mock_hass_sensor, "child_test_001",
            {"experience": 50, "experience_to_next_level": 0}
        )
        attrs = sensor.extra_state_attributes
        assert attrs["progress_percentage"] == 0


class TestChildTasksPendingSensor:
    """Test ChildTasksPendingSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildTasksPendingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 tasks pending"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildTasksPendingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 3

    def test_sensor_icon_with_pending(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor icon when there are pending tasks."""
        sensor = ChildTasksPendingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.icon == "mdi:checkbox-marked-circle-outline"

    def test_sensor_icon_no_pending(self, mock_hass_sensor):
        """Test sensor icon when no pending tasks."""
        sensor = ChildTasksPendingSensor(
            mock_hass_sensor, "child_test_001", {"tasks_pending": 0}
        )
        assert sensor.icon == "mdi:checkbox-marked-circle"

    def test_sensor_unit(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unit."""
        sensor = ChildTasksPendingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unit_of_measurement == "tasks"


class TestChildTasksWaitingSensor:
    """Test ChildTasksWaitingSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildTasksWaitingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 tasks waiting"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildTasksWaitingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 2

    def test_sensor_icon_with_waiting(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor icon when there are waiting tasks."""
        sensor = ChildTasksWaitingSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.icon == "mdi:clock-alert"

    def test_sensor_icon_no_waiting(self, mock_hass_sensor):
        """Test sensor icon when no waiting tasks."""
        sensor = ChildTasksWaitingSensor(
            mock_hass_sensor, "child_test_001", {"tasks_waiting": 0}
        )
        assert sensor.icon == "mdi:clock-check"


class TestChildLongestStreakSensor:
    """Test ChildLongestStreakSensor."""

    def test_sensor_name(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor name."""
        sensor = ChildLongestStreakSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.name == "habits child_test_001 longest streak"

    def test_sensor_state(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor state."""
        sensor = ChildLongestStreakSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.state == 14

    def test_sensor_icon_low_streak(self, mock_hass_sensor):
        """Test sensor icon for low streak."""
        sensor = ChildLongestStreakSensor(
            mock_hass_sensor, "child_test_001", {"longest_streak": 3}
        )
        assert sensor.icon == "mdi:fire-off"

    def test_sensor_icon_mid_streak(self, mock_hass_sensor):
        """Test sensor icon for mid streak."""
        sensor = ChildLongestStreakSensor(
            mock_hass_sensor, "child_test_001", {"longest_streak": 14}
        )
        assert sensor.icon == "mdi:flame"

    def test_sensor_icon_high_streak(self, mock_hass_sensor):
        """Test sensor icon for high streak (30+ days)."""
        sensor = ChildLongestStreakSensor(
            mock_hass_sensor, "child_test_001", {"longest_streak": 45}
        )
        assert sensor.icon == "mdi:fire"

    def test_sensor_unit(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor unit."""
        sensor = ChildLongestStreakSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor.unit_of_measurement == "days"


class TestBaseChildSensor:
    """Test BaseChildSensor common functionality."""

    def test_device_info(self, mock_hass_sensor, sample_child_sensor_data):
        """Test device info for grouping sensors."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        device_info = sensor.device_info
        assert device_info["identifiers"] == {(DOMAIN, "child_test_001")}
        assert "Alice" in device_info["name"]
        assert device_info["manufacturer"] == "Habits Manager"
        assert device_info["model"] == "Child Profile"

    def test_extra_state_attributes_base(self, mock_hass_sensor, sample_child_sensor_data):
        """Test base extra state attributes."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        attrs = sensor.extra_state_attributes
        assert attrs["child_id"] == "child_test_001"
        assert attrs["child_name"] == "Alice"
        assert attrs["person_entity"] == "person.alice"
        assert "avatar" in attrs
        assert "badges" in attrs
        assert "owned_cosmetics" in attrs

    def test_should_poll_false(self, mock_hass_sensor, sample_child_sensor_data):
        """Test sensor should not poll."""
        sensor = ChildPointsSensor(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        assert sensor._attr_should_poll is False


class TestCreateChildSensors:
    """Test _create_child_sensors helper function."""

    def test_creates_correct_number_of_sensors(self, mock_hass_sensor, sample_child_sensor_data):
        """Test that correct number of sensors are created."""
        sensors = _create_child_sensors(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )
        # Should create 10 sensors per child
        assert len(sensors) == 10

    def test_creates_all_sensor_types(self, mock_hass_sensor, sample_child_sensor_data):
        """Test that all sensor types are created."""
        sensors = _create_child_sensors(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )

        sensor_types = [type(s).__name__ for s in sensors]
        assert "ChildPointsSensor" in sensor_types
        assert "ChildCoinsSensor" in sensor_types
        assert "ChildLevelSensor" in sensor_types
        assert "ChildExperienceSensor" in sensor_types
        assert "ChildTasksPendingSensor" in sensor_types
        assert "ChildTasksWaitingSensor" in sensor_types
        assert "ChildLongestStreakSensor" in sensor_types

    def test_all_sensors_have_unique_ids(self, mock_hass_sensor, sample_child_sensor_data):
        """Test that all sensors have unique IDs."""
        sensors = _create_child_sensors(
            mock_hass_sensor, "child_test_001", sample_child_sensor_data
        )

        unique_ids = [s.unique_id for s in sensors]
        assert len(unique_ids) == len(set(unique_ids))  # All IDs unique
