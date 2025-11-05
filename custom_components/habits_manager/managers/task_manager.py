"""Task manager for Habits Manager.

Manages all operations related to tasks and task instances.
"""
import uuid
from datetime import datetime, date, time
from typing import List, Optional

from ..const import _LOGGER
from ..core.models import (
    Task,
    TaskInstance,
    TaskSchedule,
    TaskRewards,
    TaskPenalties,
    TaskType,
    ScheduleType,
    TaskCategory,
    TaskInstanceStatus,
)
from ..core.exceptions import TaskNotFoundError, ValidationError
from ..core.validators import validate_task_data
from ..storage.storage_manager import StorageManager


class TaskManager:
    """Gère les tâches et leurs instances."""

    def __init__(self, storage: StorageManager):
        """Initialise le task manager.

        Args:
            storage: Manager de stockage
        """
        self.storage = storage

    async def create_task(self, task_data: dict) -> Task:
        """Crée une nouvelle tâche.

        Args:
            task_data: Données de la tâche

        Returns:
            Task créée

        Raises:
            ValidationError: Si les données sont invalides
        """
        # Valider
        validate_task_data(task_data)

        # Générer ID
        task_id = f"task_{uuid.uuid4().hex[:8]}"

        # Construire le schedule
        schedule_data = task_data["schedule"]
        schedule = TaskSchedule(
            type=ScheduleType(schedule_data["type"]),
            days=schedule_data.get("days"),
            time=schedule_data.get("time"),
            specific_date=datetime.fromisoformat(schedule_data["specific_date"]) if schedule_data.get("specific_date") else None,
        )

        # Construire les rewards
        rewards_data = task_data.get("rewards", {})
        rewards = TaskRewards(
            points=rewards_data.get("points", 0),
            coins=rewards_data.get("coins", 0),
            experience=rewards_data.get("experience", 0),
        )

        # Construire les penalties
        penalties_data = task_data.get("penalties", {})
        penalties = TaskPenalties(
            points=penalties_data.get("points", 0),
            coins=penalties_data.get("coins", 0),
        )

        # Créer la tâche
        task = Task(
            id=task_id,
            title=task_data["title"],
            description=task_data.get("description", ""),
            type=TaskType(task_data.get("type", "mandatory")),
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
            created_at=datetime.now(),
        )

        # Sauvegarder
        await self.storage.save_task(task)

        _LOGGER.info(f"Task created: {task.title} ({task.id})")

        return task

    async def get_task(self, task_id: str) -> Task:
        """Récupère une tâche par son ID.

        Args:
            task_id: ID de la tâche

        Returns:
            Task

        Raises:
            TaskNotFoundError: Si la tâche n'existe pas
        """
        tasks = await self.storage.load_tasks()
        for task in tasks:
            if task.id == task_id:
                return task

        raise TaskNotFoundError(f"Task {task_id} not found")

    async def get_all_tasks(self) -> List[Task]:
        """Récupère toutes les tâches.

        Returns:
            Liste des tâches
        """
        return await self.storage.load_tasks()

    async def update_task(self, task: Task) -> Task:
        """Met à jour une tâche.

        Args:
            task: Tâche à mettre à jour

        Returns:
            Task mise à jour
        """
        await self.storage.save_task(task)
        _LOGGER.debug(f"Task updated: {task.title} ({task.id})")
        return task

    async def delete_task(self, task_id: str) -> None:
        """Supprime une tâche.

        Args:
            task_id: ID de la tâche

        Raises:
            TaskNotFoundError: Si la tâche n'existe pas
        """
        # Vérifier que la tâche existe
        await self.get_task(task_id)

        # Supprimer
        await self.storage.delete_task(task_id)
        _LOGGER.info(f"Task deleted: {task_id}")

    async def generate_task_instances(self, target_date: date) -> List[TaskInstance]:
        """Génère les instances de tâches pour une date donnée.

        Args:
            target_date: Date pour laquelle générer les instances

        Returns:
            Liste des instances créées
        """
        tasks = await self.get_all_tasks()
        instances = []

        for task in tasks:
            if not task.active:
                continue

            # Vérifier si la tâche doit être générée ce jour
            if not self._should_generate_for_date(task, target_date):
                continue

            # Générer une instance pour chaque enfant assigné
            for child_id in task.assigned_to:
                # Vérifier si une instance existe déjà
                existing_instances = await self.storage.load_task_instances(
                    child_id=child_id,
                    date_filter=target_date
                )

                # Vérifier si cette tâche a déjà une instance ce jour
                already_exists = any(
                    inst.task_id == task.id for inst in existing_instances
                )

                if already_exists:
                    _LOGGER.debug(f"Instance already exists for task {task.id}, child {child_id}, date {target_date}")
                    continue

                # Créer l'instance
                instance_id = f"inst_{uuid.uuid4().hex[:8]}"
                instance = TaskInstance(
                    id=instance_id,
                    task_id=task.id,
                    child_id=child_id,
                    date=target_date,
                    status=TaskInstanceStatus.PENDING,
                )

                await self.storage.save_task_instance(instance)
                instances.append(instance)

                _LOGGER.debug(f"Instance created: task={task.title}, child={child_id}, date={target_date}")

        _LOGGER.info(f"Generated {len(instances)} task instances for {target_date}")
        return instances

    def _should_generate_for_date(self, task: Task, target_date: date) -> bool:
        """Vérifie si une tâche doit être générée pour une date.

        Args:
            task: Tâche à vérifier
            target_date: Date cible

        Returns:
            True si la tâche doit être générée
        """
        schedule = task.schedule

        if schedule.type == ScheduleType.DAILY:
            # Tous les jours
            return True

        elif schedule.type == ScheduleType.WEEKLY:
            # Certains jours de la semaine
            if schedule.days is None:
                return False

            # weekday(): 0=Lundi, 6=Dimanche
            # Notre format: 1=Lundi, 7=Dimanche
            weekday = target_date.weekday() + 1
            return weekday in schedule.days

        elif schedule.type == ScheduleType.MONTHLY:
            # Certains jours du mois
            if schedule.days is None:
                return False

            return target_date.day in schedule.days

        elif schedule.type == ScheduleType.SPECIFIC_DATE:
            # Date spécifique
            if schedule.specific_date is None:
                return False

            return target_date == schedule.specific_date.date()

        return False

    async def get_instances_for_child(self, child_id: str, target_date: date) -> List[TaskInstance]:
        """Récupère les instances de tâches d'un enfant pour une date.

        Args:
            child_id: ID de l'enfant
            target_date: Date

        Returns:
            Liste des instances
        """
        return await self.storage.load_task_instances(
            child_id=child_id,
            date_filter=target_date
        )

    async def mark_completed(self, instance_id: str) -> TaskInstance:
        """Marque une instance comme complétée (en attente de validation).

        Args:
            instance_id: ID de l'instance

        Returns:
            TaskInstance mise à jour

        Raises:
            TaskNotFoundError: Si l'instance n'existe pas
        """
        # Charger toutes les instances et trouver la bonne
        all_instances = await self.storage.load_task_instances()
        instance = None

        for inst in all_instances:
            if inst.id == instance_id:
                instance = inst
                break

        if instance is None:
            raise TaskNotFoundError(f"Task instance {instance_id} not found")

        # Marquer comme complétée en attente
        instance.status = TaskInstanceStatus.COMPLETED_WAITING
        instance.completed_at = datetime.now()

        # Sauvegarder
        await self.storage.save_task_instance(instance)

        _LOGGER.info(f"Task instance {instance_id} marked as completed (waiting validation)")

        return instance

    async def check_failed_tasks(self, check_date: date = None) -> List[TaskInstance]:
        """Vérifie les tâches échouées (heure limite dépassée).

        Args:
            check_date: Date à vérifier (par défaut aujourd'hui)

        Returns:
            Liste des instances passées en statut FAILED
        """
        if check_date is None:
            check_date = date.today()

        # Charger les instances du jour en statut PENDING
        all_instances = await self.storage.load_task_instances(date_filter=check_date)

        failed_instances = []
        now = datetime.now()

        for instance in all_instances:
            if instance.status != TaskInstanceStatus.PENDING:
                continue

            # Récupérer la tâche pour voir l'heure limite
            try:
                task = await self.get_task(instance.task_id)
            except TaskNotFoundError:
                _LOGGER.warning(f"Task {instance.task_id} not found for instance {instance.id}")
                continue

            # Vérifier si l'heure limite est dépassée
            if task.schedule.time is None:
                # Pas d'heure limite spécifique
                continue

            # Parser l'heure limite
            try:
                limit_hour, limit_minute = map(int, task.schedule.time.split(":"))
                limit_time = datetime.combine(check_date, time(limit_hour, limit_minute))
            except Exception as err:
                _LOGGER.error(f"Invalid time format for task {task.id}: {task.schedule.time}")
                continue

            # Comparer avec maintenant
            if now > limit_time:
                # Tâche échouée
                instance.status = TaskInstanceStatus.FAILED
                await self.storage.save_task_instance(instance)
                failed_instances.append(instance)

                _LOGGER.info(f"Task instance {instance.id} marked as FAILED (deadline passed)")

        return failed_instances

    async def get_instance(self, instance_id: str) -> TaskInstance:
        """Récupère une instance par son ID.

        Args:
            instance_id: ID de l'instance

        Returns:
            TaskInstance

        Raises:
            TaskNotFoundError: Si l'instance n'existe pas
        """
        all_instances = await self.storage.load_task_instances()

        for instance in all_instances:
            if instance.id == instance_id:
                return instance

        raise TaskNotFoundError(f"Task instance {instance_id} not found")
