"""Storage manager for Habits Manager.

Handles all JSON file operations for persistent storage.
"""
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, date

from homeassistant.core import HomeAssistant

from ..const import (
    STORAGE_DIR,
    FILE_CHILDREN,
    FILE_TASKS,
    FILE_HABITS,
    FILE_TASK_INSTANCES,
    FILE_HABIT_STREAKS,
    FILE_REWARDS,
    FILE_REWARD_CLAIMS,
    FILE_COSMETICS,
    _LOGGER,
)
from ..core.models import (
    Child,
    Task,
    Habit,
    TaskInstance,
    HabitStreak,
    Reward,
    RewardClaim,
    CosmeticItem,
)
from ..core.exceptions import StorageError


class StorageManager:
    """Gère le stockage persistant des données."""

    def __init__(self, hass: HomeAssistant, base_path: str = STORAGE_DIR):
        """Initialise le storage manager.

        Args:
            hass: Instance Home Assistant
            base_path: Chemin du répertoire de stockage
        """
        self.hass = hass
        self.base_path = hass.config.path(base_path)

    async def ensure_storage_dir(self) -> None:
        """Crée le répertoire de stockage s'il n'existe pas."""
        try:
            os.makedirs(self.base_path, exist_ok=True)
            _LOGGER.info(f"Storage directory ensured at {self.base_path}")
        except Exception as err:
            _LOGGER.error(f"Failed to create storage directory: {err}")
            raise StorageError(f"Cannot create storage directory: {err}")

    async def load_json(self, filename: str) -> Dict[str, Any]:
        """Charge un fichier JSON.

        Args:
            filename: Nom du fichier (sans chemin)

        Returns:
            Dictionnaire avec les données, ou {} si le fichier n'existe pas

        Raises:
            StorageError: Si la lecture échoue
        """
        file_path = os.path.join(self.base_path, filename)

        if not os.path.exists(file_path):
            _LOGGER.debug(f"File {filename} does not exist, returning empty dict")
            return {}

        try:
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)
                _LOGGER.debug(f"Loaded {filename} successfully")
                return data
        except json.JSONDecodeError as err:
            _LOGGER.error(f"Invalid JSON in {filename}: {err}")
            raise StorageError(f"Invalid JSON in {filename}: {err}")
        except Exception as err:
            _LOGGER.error(f"Failed to read {filename}: {err}")
            raise StorageError(f"Cannot read {filename}: {err}")

    async def save_json(self, filename: str, data: Dict[str, Any]) -> None:
        """Sauvegarde un fichier JSON.

        Args:
            filename: Nom du fichier (sans chemin)
            data: Données à sauvegarder

        Raises:
            StorageError: Si l'écriture échoue
        """
        file_path = os.path.join(self.base_path, filename)

        try:
            with open(file_path, "w", encoding="utf-8") as file:
                json.dump(data, file, indent=2, ensure_ascii=False)
                _LOGGER.debug(f"Saved {filename} successfully")
        except Exception as err:
            _LOGGER.error(f"Failed to write {filename}: {err}")
            raise StorageError(f"Cannot write {filename}: {err}")

    # ========================================================================
    # CHILDREN
    # ========================================================================

    async def load_children(self) -> List[Child]:
        """Charge tous les enfants.

        Returns:
            Liste des enfants
        """
        data = await self.load_json(FILE_CHILDREN)
        children = []

        for child_id, child_data in data.items():
            try:
                # Reconstruction du Child depuis le dict
                from ..core.models import Avatar, AvatarCustomization

                avatar_data = child_data.get("avatar", {})
                customization_data = avatar_data.get("customization", {})

                customization = AvatarCustomization(
                    clothes=customization_data.get("clothes"),
                    accessory=customization_data.get("accessory"),
                    pet=customization_data.get("pet"),
                    theme=customization_data.get("theme", "default"),
                )

                avatar = Avatar(
                    photo_url=avatar_data.get("photo_url", ""),
                    customization=customization,
                )

                child = Child(
                    id=child_data["id"],
                    name=child_data["name"],
                    person_entity=child_data["person_entity"],
                    points=child_data.get("points", 0),
                    coins=child_data.get("coins", 0),
                    level=child_data.get("level", 1),
                    experience=child_data.get("experience", 0),
                    experience_to_next_level=child_data.get("experience_to_next_level", 100),
                    avatar=avatar,
                    badges=child_data.get("badges", []),
                    owned_cosmetics=child_data.get("owned_cosmetics", []),
                    created_at=datetime.fromisoformat(child_data["created_at"]),
                    updated_at=datetime.fromisoformat(child_data["updated_at"]),
                )
                children.append(child)
            except Exception as err:
                _LOGGER.error(f"Failed to load child {child_id}: {err}")

        return children

    async def save_child(self, child: Child) -> None:
        """Sauvegarde un enfant.

        Args:
            child: Enfant à sauvegarder
        """
        data = await self.load_json(FILE_CHILDREN)
        child.updated_at = datetime.now()
        data[child.id] = child.to_dict()
        await self.save_json(FILE_CHILDREN, data)

    async def delete_child(self, child_id: str) -> None:
        """Supprime un enfant.

        Args:
            child_id: ID de l'enfant
        """
        data = await self.load_json(FILE_CHILDREN)
        if child_id in data:
            del data[child_id]
            await self.save_json(FILE_CHILDREN, data)

    async def get_child(self, child_id: str) -> Optional[Child]:
        """Récupère un enfant par son ID.

        Args:
            child_id: ID de l'enfant

        Returns:
            Child ou None si non trouvé
        """
        children = await self.load_children()
        for child in children:
            if child.id == child_id:
                return child
        return None

    # ========================================================================
    # TASKS
    # ========================================================================

    async def load_tasks(self) -> List[Task]:
        """Charge toutes les tâches.

        Returns:
            Liste des tâches
        """
        data = await self.load_json(FILE_TASKS)
        tasks = []

        for task_id, task_data in data.items():
            try:
                from ..core.models import (
                    TaskSchedule,
                    TaskRewards,
                    TaskPenalties,
                    TaskType,
                    ScheduleType,
                    TaskCategory,
                )

                # Reconstruction du TaskSchedule
                schedule_data = task_data["schedule"]
                specific_date = None
                if schedule_data.get("specific_date"):
                    specific_date = datetime.fromisoformat(schedule_data["specific_date"])

                schedule = TaskSchedule(
                    type=ScheduleType(schedule_data["type"]),
                    days=schedule_data.get("days"),
                    time=schedule_data.get("time"),
                    specific_date=specific_date,
                )

                rewards = TaskRewards(**task_data["rewards"])
                penalties = TaskPenalties(**task_data["penalties"])

                task = Task(
                    id=task_data["id"],
                    title=task_data["title"],
                    description=task_data["description"],
                    type=TaskType(task_data["type"]),
                    assigned_to=task_data["assigned_to"],
                    schedule=schedule,
                    rewards=rewards,
                    penalties=penalties,
                    icon=task_data.get("icon", "mdi:check-circle"),
                    color=task_data.get("color", "#4CAF50"),
                    difficulty=task_data.get("difficulty", 1),
                    estimated_duration=task_data.get("estimated_duration", 10),
                    category=TaskCategory(task_data.get("category", "other")),
                    active=task_data.get("active", True),
                    created_at=datetime.fromisoformat(task_data["created_at"]),
                )
                tasks.append(task)
            except Exception as err:
                _LOGGER.error(f"Failed to load task {task_id}: {err}")

        return tasks

    async def save_task(self, task: Task) -> None:
        """Sauvegarde une tâche.

        Args:
            task: Tâche à sauvegarder
        """
        data = await self.load_json(FILE_TASKS)
        data[task.id] = task.to_dict()
        await self.save_json(FILE_TASKS, data)

    async def delete_task(self, task_id: str) -> None:
        """Supprime une tâche.

        Args:
            task_id: ID de la tâche
        """
        data = await self.load_json(FILE_TASKS)
        if task_id in data:
            del data[task_id]
            await self.save_json(FILE_TASKS, data)

    # ========================================================================
    # HABITS
    # ========================================================================

    async def load_habits(self) -> List[Habit]:
        """Charge toutes les habitudes.

        Returns:
            Liste des habitudes
        """
        data = await self.load_json(FILE_HABITS)
        habits = []

        for habit_id, habit_data in data.items():
            try:
                from ..core.models import HabitRewards, StreakBonus, HabitFrequency, StreakBonusType

                # Reconstruction des rewards avec streak_bonus
                rewards_data = habit_data["rewards"]
                bonus_data = rewards_data.get("streak_bonus", {})

                streak_bonus = StreakBonus(
                    enabled=bonus_data.get("enabled", True),
                    type=StreakBonusType(bonus_data.get("type", "progressive")),
                    multiplier=bonus_data.get("multiplier", 0.1),
                )

                rewards = HabitRewards(
                    points=rewards_data.get("points", 0),
                    coins=rewards_data.get("coins", 0),
                    experience=rewards_data.get("experience", 0),
                    streak_bonus=streak_bonus,
                )

                habit = Habit(
                    id=habit_data["id"],
                    title=habit_data["title"],
                    description=habit_data["description"],
                    icon=habit_data["icon"],
                    color=habit_data["color"],
                    frequency=HabitFrequency(habit_data["frequency"]),
                    rewards=rewards,
                    active=habit_data.get("active", True),
                    assigned_to=habit_data.get("assigned_to", []),
                )
                habits.append(habit)
            except Exception as err:
                _LOGGER.error(f"Failed to load habit {habit_id}: {err}")

        return habits

    async def save_habit(self, habit: Habit) -> None:
        """Sauvegarde une habitude.

        Args:
            habit: Habitude à sauvegarder
        """
        data = await self.load_json(FILE_HABITS)
        data[habit.id] = habit.to_dict()
        await self.save_json(FILE_HABITS, data)

    async def delete_habit(self, habit_id: str) -> None:
        """Supprime une habitude.

        Args:
            habit_id: ID de l'habitude
        """
        data = await self.load_json(FILE_HABITS)
        if habit_id in data:
            del data[habit_id]
            await self.save_json(FILE_HABITS, data)

    # ========================================================================
    # TASK INSTANCES
    # ========================================================================

    async def save_task_instance(self, instance: TaskInstance) -> None:
        """Sauvegarde une instance de tâche.

        Args:
            instance: Instance à sauvegarder
        """
        data = await self.load_json(FILE_TASK_INSTANCES)
        data[instance.id] = instance.to_dict()
        await self.save_json(FILE_TASK_INSTANCES, data)

    async def load_task_instances(self, child_id: Optional[str] = None, date_filter: Optional[date] = None) -> List[TaskInstance]:
        """Charge les instances de tâches avec filtres optionnels.

        Args:
            child_id: Filtrer par enfant (optionnel)
            date_filter: Filtrer par date (optionnel)

        Returns:
            Liste des instances
        """
        data = await self.load_json(FILE_TASK_INSTANCES)
        instances = []

        for instance_id, instance_data in data.items():
            try:
                from ..core.models import TaskInstanceStatus

                instance_date = date.fromisoformat(instance_data["date"])

                # Appliquer les filtres
                if child_id and instance_data["child_id"] != child_id:
                    continue
                if date_filter and instance_date != date_filter:
                    continue

                instance = TaskInstance(
                    id=instance_data["id"],
                    task_id=instance_data["task_id"],
                    child_id=instance_data["child_id"],
                    date=instance_date,
                    status=TaskInstanceStatus(instance_data["status"]),
                    completed_at=datetime.fromisoformat(instance_data["completed_at"]) if instance_data.get("completed_at") else None,
                    validated_at=datetime.fromisoformat(instance_data["validated_at"]) if instance_data.get("validated_at") else None,
                    validator_id=instance_data.get("validator_id"),
                    validation_note=instance_data.get("validation_note", ""),
                    is_penalty_applied=instance_data.get("is_penalty_applied", False),
                )
                instances.append(instance)
            except Exception as err:
                _LOGGER.error(f"Failed to load task instance {instance_id}: {err}")

        return instances

    # ========================================================================
    # HABIT STREAKS
    # ========================================================================

    async def save_habit_streak(self, streak: HabitStreak) -> None:
        """Sauvegarde un streak d'habitude.

        Args:
            streak: Streak à sauvegarder
        """
        data = await self.load_json(FILE_HABIT_STREAKS)
        data[streak.id] = streak.to_dict()
        await self.save_json(FILE_HABIT_STREAKS, data)

    async def load_habit_streak(self, habit_id: str, child_id: str) -> Optional[HabitStreak]:
        """Charge le streak d'une habitude pour un enfant.

        Args:
            habit_id: ID de l'habitude
            child_id: ID de l'enfant

        Returns:
            HabitStreak ou None
        """
        data = await self.load_json(FILE_HABIT_STREAKS)

        for streak_id, streak_data in data.items():
            if streak_data["habit_id"] == habit_id and streak_data["child_id"] == child_id:
                from ..core.models import StreakHistoryEntry

                history = [
                    StreakHistoryEntry(
                        date=date.fromisoformat(entry["date"]),
                        completed=entry["completed"]
                    )
                    for entry in streak_data.get("streak_history", [])
                ]

                return HabitStreak(
                    id=streak_data["id"],
                    habit_id=streak_data["habit_id"],
                    child_id=streak_data["child_id"],
                    current_streak=streak_data.get("current_streak", 0),
                    longest_streak=streak_data.get("longest_streak", 0),
                    last_completed=date.fromisoformat(streak_data["last_completed"]) if streak_data.get("last_completed") else None,
                    total_completions=streak_data.get("total_completions", 0),
                    streak_history=history,
                )

        return None
