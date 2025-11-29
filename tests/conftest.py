"""Pytest configuration and fixtures for Habits Manager tests."""
import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta
import json
from pathlib import Path
import tempfile
import sys

# Add the parent directory to Python path so custom_components can be imported
sys.path.insert(0, str(Path(__file__).parent.parent))

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from homeassistant.const import CONF_NAME

from custom_components.habits_manager.const import DOMAIN


# Pytest plugin to enable custom component loading
pytest_plugins = "pytest_homeassistant_custom_component"


def pytest_configure(config):
    """Configure pytest with custom component path."""
    # This ensures Home Assistant can find custom_components
    pass


@pytest.fixture(autouse=True)
def clean_storage_before_test(hass):
    """Clean storage directory before each test.

    This fixture cleans the actual storage directory used by the integration
    which is at hass.config.path('.storage/habits_manager').
    """
    import shutil

    # Get the actual storage path that will be used
    storage_dir = Path(hass.config.path(".storage/habits_manager"))

    # Clean the storage directory before the test
    if storage_dir.exists():
        shutil.rmtree(storage_dir)

    yield

    # Clean after the test as well
    if storage_dir.exists():
        shutil.rmtree(storage_dir)


@pytest.fixture
async def mock_hass(hass, caplog):
    """Mock Home Assistant instance with configured integration."""
    # Set the custom_components path for hass
    hass.config.components.add(DOMAIN)

    # Import and setup the integration manually
    from custom_components.habits_manager import async_setup

    result = await async_setup(hass, {DOMAIN: {}})

    if not result:
        print(f"Setup failed. Logs:\n{caplog.text}")

    assert result, f"Failed to setup {DOMAIN} integration"
    await hass.async_block_till_done()
    yield hass


@pytest.fixture
def sample_child_data():
    """Sample child data for testing."""
    return {
        "child_id": "test_child_001",
        "name": "Alice",
        "person_entity": "person.alice",
        "avatar_url": "/local/alice.png",
        "pin_code": "1234",
    }


@pytest.fixture
def sample_task_data():
    """Sample task data for testing."""
    return {
        "title": "Ranger sa chambre",
        "description": "Ranger et nettoyer la chambre",
        "type": "mandatory",
        "schedule": {
            "type": "daily",
            "days": None,
            "time": "18:00",
        },
        "rewards": {
            "points": 10,
            "coins": 5,
            "experience": 15,
        },
        "penalties": {
            "points": 0,
            "coins": 0,
        },
        "difficulty": 2,
        "assigned_to": ["test_child_001"],
    }


@pytest.fixture
def sample_habit_data():
    """Sample habit data for testing."""
    return {
        "title": "Brosser les dents",
        "description": "Se brosser les dents matin et soir",
        "icon": "mdi:toothbrush",
        "color": "#4CAF50",
        "frequency": "daily",
        "rewards": {
            "points": 5,
            "coins": 2,
            "experience": 10,
        },
        "assigned_to": ["test_child_001"],
    }


@pytest.fixture
def sample_reward_data():
    """Sample reward data for testing."""
    return {
        "title": "30 minutes de jeu vidéo",
        "description": "Temps de jeu supplémentaire",
        "cost_points": 50,
        "cost_coins": 0,
        "rarity": "common",
        "available_for": ["test_child_001"],
        "category": "screen_time",
    }


@pytest.fixture
def sample_cosmetic_data():
    """Sample cosmetic data for testing."""
    return {
        "name": "Chapeau de pirate",
        "description": "Un magnifique chapeau de pirate",
        "preview_image": "/local/cosmetics/pirate_hat.png",
        "category": "accessory",
        "rarity": "rare",
        "cost_coins": 100,
    }


@pytest.fixture
async def setup_test_child(mock_hass, sample_child_data):
    """Create a test child in the system."""
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_child",
        sample_child_data,
        blocking=True,
        return_response=True,
    )
    return response["child"]["id"]


@pytest.fixture
async def setup_test_task(mock_hass, setup_test_child, sample_task_data):
    """Create a test task in the system.

    Returns the task_id for tests that need task-level operations (update, delete, etc.).
    """
    # Modify task data to use the actual child_id from setup_test_child
    task_data = sample_task_data.copy()
    task_data["assigned_to"] = [setup_test_child]

    # Create the task
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_task",
        task_data,
        blocking=True,
        return_response=True,
    )
    return response["task"]["id"]


@pytest.fixture
async def setup_test_task_instance(mock_hass, setup_test_child, setup_test_task):
    """Create a test task instance for today.

    Returns the instance_id for tests that need instance-level operations (mark_completed, validate, etc.).
    """
    from datetime import date
    task_mgr = mock_hass.data[DOMAIN]["task_manager"]

    # Generate instances for today
    await task_mgr.generate_task_instances(date.today())

    # Find any existing instance for this task
    all_instances = await task_mgr.get_task_instances(task_id=setup_test_task)
    task_instance = next((i for i in all_instances if i.task_id == setup_test_task), None)

    if task_instance:
        return task_instance.id

    raise RuntimeError(f"No task instance generated for task {setup_test_task}")


@pytest.fixture
async def setup_test_habit(mock_hass, setup_test_child, sample_habit_data):
    """Create a test habit in the system."""
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_habit",
        sample_habit_data,
        blocking=True,
        return_response=True,
    )
    return response["habit"]["id"]


@pytest.fixture
async def setup_test_reward(mock_hass, setup_test_child, sample_reward_data):
    """Create a test reward in the system."""
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_reward",
        sample_reward_data,
        blocking=True,
        return_response=True,
    )
    return response["reward"]["id"]


@pytest.fixture
async def setup_test_cosmetic(mock_hass, sample_cosmetic_data):
    """Create a test cosmetic in the system."""
    response = await mock_hass.services.async_call(
        DOMAIN,
        "create_cosmetic",
        sample_cosmetic_data,
        blocking=True,
        return_response=True,
    )
    return response["cosmetic"]["id"]


@pytest.fixture
def mock_events():
    """Track events fired during tests."""
    events = []

    def track_event(event_type, event_data):
        events.append({
            "type": event_type,
            "data": event_data,
            "timestamp": datetime.now(),
        })

    return events, track_event
