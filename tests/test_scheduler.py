"""Tests for scheduler service."""
import pytest
from datetime import date, timedelta
from unittest.mock import MagicMock, AsyncMock, patch

from custom_components.habits_manager.services.scheduler import Scheduler
from custom_components.habits_manager.core.models import (
    TaskInstance,
    TaskInstanceStatus,
    HabitStreak,
    Habit,
    HabitFrequency,
    HabitRewards,
    StreakBonus,
    StreakBonusType,
)


@pytest.fixture
def mock_task_manager():
    """Create a mock task manager."""
    mgr = MagicMock()
    mgr.generate_task_instances = AsyncMock(return_value=[])
    mgr.get_task_instances = AsyncMock(return_value=[])
    mgr.check_failed_tasks = AsyncMock(return_value=[])
    return mgr


@pytest.fixture
def mock_habit_manager():
    """Create a mock habit manager."""
    mgr = MagicMock()
    mgr.check_streak_breaks = AsyncMock(return_value=[])
    mgr.get_child_longest_streak = AsyncMock(return_value=0)
    return mgr


@pytest.fixture
def mock_entity_manager():
    """Create a mock entity manager."""
    mgr = MagicMock()
    mgr.update_task_counts = AsyncMock()
    mgr.update_longest_streak = AsyncMock()
    return mgr


@pytest.fixture
def scheduler(mock_task_manager, mock_habit_manager, mock_entity_manager):
    """Create a scheduler with mocked dependencies."""
    return Scheduler(mock_task_manager, mock_habit_manager, mock_entity_manager)


@pytest.fixture
def sample_task_instance():
    """Create a sample task instance."""
    return TaskInstance(
        id="inst_001",
        task_id="task_001",
        child_id="child_001",
        date=date.today(),
        status=TaskInstanceStatus.PENDING,
    )


@pytest.fixture
def sample_habit():
    """Create a sample habit."""
    return Habit(
        id="habit_001",
        title="Brush teeth",
        description="Brush teeth twice a day",
        icon="mdi:tooth",
        color="#4CAF50",
        frequency=HabitFrequency.DAILY,
        rewards=HabitRewards(
            points=5,
            coins=1,
            experience=10,
            streak_bonus=StreakBonus(
                enabled=True,
                type=StreakBonusType.PROGRESSIVE,
                multiplier=0.1,
            ),
        ),
    )


@pytest.fixture
def sample_habit_streak():
    """Create a sample habit streak."""
    return HabitStreak(
        id="streak_001",
        habit_id="habit_001",
        child_id="child_001",
        current_streak=5,
        longest_streak=10,
        last_completed=date.today() - timedelta(days=2),
        total_completions=50,
    )


class TestSchedulerInit:
    """Test Scheduler initialization."""

    def test_init(self, mock_task_manager, mock_habit_manager, mock_entity_manager):
        """Test scheduler initializes with managers."""
        scheduler = Scheduler(mock_task_manager, mock_habit_manager, mock_entity_manager)
        assert scheduler.task_mgr is mock_task_manager
        assert scheduler.habit_mgr is mock_habit_manager
        assert scheduler.entity_mgr is mock_entity_manager


class TestRunDailyTasks:
    """Test run_daily_tasks method."""

    async def test_run_daily_tasks_default_date(self, scheduler):
        """Test run_daily_tasks uses today by default."""
        result = await scheduler.run_daily_tasks()

        assert "instances_generated" in result
        assert "tasks_failed" in result
        assert "streaks_broken" in result
        assert result["instances_generated"] == 0
        assert result["tasks_failed"] == 0
        assert result["streaks_broken"] == 0

    async def test_run_daily_tasks_specific_date(self, scheduler):
        """Test run_daily_tasks with specific date."""
        target_date = date(2024, 6, 15)
        result = await scheduler.run_daily_tasks(target_date)

        assert result["instances_generated"] == 0
        scheduler.task_mgr.generate_task_instances.assert_called()

    async def test_run_daily_tasks_with_instances(
        self, scheduler, mock_task_manager, sample_task_instance
    ):
        """Test run_daily_tasks when instances are generated."""
        mock_task_manager.generate_task_instances = AsyncMock(
            return_value=[sample_task_instance]
        )
        mock_task_manager.get_task_instances = AsyncMock(
            return_value=[sample_task_instance]
        )

        result = await scheduler.run_daily_tasks()

        assert result["instances_generated"] == 1

    async def test_run_daily_tasks_with_failed(
        self, scheduler, mock_task_manager, sample_task_instance
    ):
        """Test run_daily_tasks when tasks fail."""
        failed_instance = TaskInstance(
            id="inst_002",
            task_id="task_002",
            child_id="child_001",
            date=date.today() - timedelta(days=1),
            status=TaskInstanceStatus.FAILED,
        )
        mock_task_manager.check_failed_tasks = AsyncMock(return_value=[failed_instance])
        mock_task_manager.get_task_instances = AsyncMock(return_value=[failed_instance])

        result = await scheduler.run_daily_tasks()

        assert result["tasks_failed"] == 1

    async def test_run_daily_tasks_with_broken_streaks(
        self, scheduler, mock_habit_manager, sample_habit_streak, sample_habit
    ):
        """Test run_daily_tasks when streaks break."""
        mock_habit_manager.check_streak_breaks = AsyncMock(
            return_value=[(sample_habit_streak, sample_habit)]
        )

        result = await scheduler.run_daily_tasks()

        assert result["streaks_broken"] == 1


class TestGenerateInstances:
    """Test generate_instances method."""

    async def test_generate_instances_empty(self, scheduler):
        """Test generate_instances when no tasks to generate."""
        result = await scheduler.generate_instances(date.today())
        assert result == []

    async def test_generate_instances_with_tasks(
        self, scheduler, mock_task_manager, mock_entity_manager, sample_task_instance
    ):
        """Test generate_instances creates instances and updates counts."""
        mock_task_manager.generate_task_instances = AsyncMock(
            return_value=[sample_task_instance]
        )
        mock_task_manager.get_task_instances = AsyncMock(
            return_value=[sample_task_instance]
        )

        result = await scheduler.generate_instances(date.today())

        assert len(result) == 1
        assert result[0].id == "inst_001"
        mock_entity_manager.update_task_counts.assert_called_once()

    async def test_generate_instances_updates_multiple_children(
        self, scheduler, mock_task_manager, mock_entity_manager
    ):
        """Test generate_instances updates counts for multiple children."""
        instances = [
            TaskInstance(
                id="inst_001",
                task_id="task_001",
                child_id="child_001",
                date=date.today(),
                status=TaskInstanceStatus.PENDING,
            ),
            TaskInstance(
                id="inst_002",
                task_id="task_002",
                child_id="child_002",
                date=date.today(),
                status=TaskInstanceStatus.PENDING,
            ),
        ]
        mock_task_manager.generate_task_instances = AsyncMock(return_value=instances)
        mock_task_manager.get_task_instances = AsyncMock(return_value=[])

        await scheduler.generate_instances(date.today())

        # Should update counts for both children
        assert mock_entity_manager.update_task_counts.call_count == 2


class TestCheckFailedTasks:
    """Test check_failed_tasks method."""

    async def test_check_failed_tasks_none(self, scheduler):
        """Test check_failed_tasks when no tasks failed."""
        result = await scheduler.check_failed_tasks()
        assert result == []

    async def test_check_failed_tasks_default_date(self, scheduler, mock_task_manager):
        """Test check_failed_tasks uses today by default."""
        await scheduler.check_failed_tasks()
        mock_task_manager.check_failed_tasks.assert_called_with(date.today())

    async def test_check_failed_tasks_specific_date(self, scheduler, mock_task_manager):
        """Test check_failed_tasks with specific date."""
        check_date = date(2024, 6, 15)
        await scheduler.check_failed_tasks(check_date)
        mock_task_manager.check_failed_tasks.assert_called_with(check_date)

    async def test_check_failed_tasks_updates_counts(
        self, scheduler, mock_task_manager, mock_entity_manager
    ):
        """Test check_failed_tasks updates entity counts."""
        failed_instance = TaskInstance(
            id="inst_001",
            task_id="task_001",
            child_id="child_001",
            date=date.today() - timedelta(days=1),
            status=TaskInstanceStatus.FAILED,
        )
        mock_task_manager.check_failed_tasks = AsyncMock(return_value=[failed_instance])
        mock_task_manager.get_task_instances = AsyncMock(return_value=[])

        result = await scheduler.check_failed_tasks()

        assert len(result) == 1
        mock_entity_manager.update_task_counts.assert_called_once()


class TestCheckBrokenStreaks:
    """Test check_broken_streaks method."""

    async def test_check_broken_streaks_none(self, scheduler):
        """Test check_broken_streaks when no streaks broken."""
        result = await scheduler.check_broken_streaks()
        assert result == []

    async def test_check_broken_streaks_default_date(self, scheduler, mock_habit_manager):
        """Test check_broken_streaks uses today by default."""
        await scheduler.check_broken_streaks()
        mock_habit_manager.check_streak_breaks.assert_called_with(date.today())

    async def test_check_broken_streaks_specific_date(self, scheduler, mock_habit_manager):
        """Test check_broken_streaks with specific date."""
        check_date = date(2024, 6, 15)
        await scheduler.check_broken_streaks(check_date)
        mock_habit_manager.check_streak_breaks.assert_called_with(check_date)

    async def test_check_broken_streaks_updates_longest(
        self, scheduler, mock_habit_manager, mock_entity_manager,
        sample_habit_streak, sample_habit
    ):
        """Test check_broken_streaks updates longest streak."""
        mock_habit_manager.check_streak_breaks = AsyncMock(
            return_value=[(sample_habit_streak, sample_habit)]
        )
        mock_habit_manager.get_child_longest_streak = AsyncMock(return_value=10)

        result = await scheduler.check_broken_streaks()

        assert len(result) == 1
        mock_entity_manager.update_longest_streak.assert_called_once_with("child_001", 10)

    async def test_check_broken_streaks_multiple_children(
        self, scheduler, mock_habit_manager, mock_entity_manager, sample_habit
    ):
        """Test check_broken_streaks handles multiple children."""
        streak1 = HabitStreak(
            id="streak_001",
            habit_id="habit_001",
            child_id="child_001",
            current_streak=0,
            longest_streak=5,
        )
        streak2 = HabitStreak(
            id="streak_002",
            habit_id="habit_002",
            child_id="child_002",
            current_streak=0,
            longest_streak=10,
        )
        mock_habit_manager.check_streak_breaks = AsyncMock(
            return_value=[(streak1, sample_habit), (streak2, sample_habit)]
        )
        mock_habit_manager.get_child_longest_streak = AsyncMock(return_value=5)

        await scheduler.check_broken_streaks()

        # Should update longest streak for both children
        assert mock_entity_manager.update_longest_streak.call_count == 2


class TestSchedulerIntegration:
    """Integration-like tests for scheduler."""

    async def test_full_daily_run_scenario(
        self, scheduler, mock_task_manager, mock_habit_manager, mock_entity_manager,
        sample_task_instance, sample_habit_streak, sample_habit
    ):
        """Test a complete daily run scenario."""
        # Setup: 2 new instances, 1 failed task, 1 broken streak
        new_instances = [
            sample_task_instance,
            TaskInstance(
                id="inst_002",
                task_id="task_002",
                child_id="child_001",
                date=date.today(),
                status=TaskInstanceStatus.PENDING,
            ),
        ]
        failed_instance = TaskInstance(
            id="inst_003",
            task_id="task_003",
            child_id="child_002",
            date=date.today() - timedelta(days=1),
            status=TaskInstanceStatus.FAILED,
        )

        mock_task_manager.generate_task_instances = AsyncMock(return_value=new_instances)
        mock_task_manager.check_failed_tasks = AsyncMock(return_value=[failed_instance])
        mock_task_manager.get_task_instances = AsyncMock(return_value=[])
        mock_habit_manager.check_streak_breaks = AsyncMock(
            return_value=[(sample_habit_streak, sample_habit)]
        )

        result = await scheduler.run_daily_tasks()

        assert result["instances_generated"] == 2
        assert result["tasks_failed"] == 1
        assert result["streaks_broken"] == 1

    async def test_empty_daily_run(self, scheduler):
        """Test daily run when nothing happens."""
        result = await scheduler.run_daily_tasks()

        assert result["instances_generated"] == 0
        assert result["tasks_failed"] == 0
        assert result["streaks_broken"] == 0
