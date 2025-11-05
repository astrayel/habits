"""Validation manager for Habits Manager.

Manages task validation, refusal, and penalty approval workflows.
"""
from datetime import datetime
from typing import Optional

from ..const import _LOGGER
from ..core.models import TaskInstance, TaskInstanceStatus, Task, Child
from ..core.exceptions import TaskNotFoundError, ChildNotFoundError, ValidationError
from ..storage.storage_manager import StorageManager
from ..storage.entity_manager import EntityManager


class ValidationManager:
    """Gère la validation des tâches et pénalités par les parents."""

    def __init__(self, storage: StorageManager, entity_mgr: EntityManager):
        """Initialise le validation manager.

        Args:
            storage: Manager de stockage
            entity_mgr: Manager d'entités HA
        """
        self.storage = storage
        self.entity_mgr = entity_mgr

    async def validate_task(
        self,
        instance_id: str,
        validator_id: str,
        note: str = ""
    ) -> tuple[TaskInstance, Task, dict]:
        """Valide une tâche complétée et retourne les récompenses à appliquer.

        Args:
            instance_id: ID de l'instance de tâche
            validator_id: ID du validateur (parent/admin)
            note: Note optionnelle de validation

        Returns:
            Tuple (instance validée, tâche, récompenses à appliquer)

        Raises:
            TaskNotFoundError: Si l'instance ou la tâche n'existe pas
            ValidationError: Si l'instance n'est pas dans l'état correct
        """
        # Charger l'instance
        all_instances = await self.storage.load_task_instances()
        instance = None
        for inst in all_instances:
            if inst.id == instance_id:
                instance = inst
                break

        if instance is None:
            raise TaskNotFoundError(f"Task instance {instance_id} not found")

        # Vérifier le statut
        if instance.status != TaskInstanceStatus.COMPLETED_WAITING:
            raise ValidationError(
                f"Cannot validate task instance {instance_id}: "
                f"status is {instance.status.value}, expected {TaskInstanceStatus.COMPLETED_WAITING.value}"
            )

        # Charger la tâche pour récupérer les récompenses
        tasks = await self.storage.load_tasks()
        task = None
        for t in tasks:
            if t.id == instance.task_id:
                task = t
                break

        if task is None:
            raise TaskNotFoundError(f"Task {instance.task_id} not found")

        # Mettre à jour l'instance
        instance.status = TaskInstanceStatus.VALIDATED
        instance.validated_at = datetime.now()
        instance.validator_id = validator_id
        instance.validation_note = note

        # Sauvegarder
        await self.storage.save_task_instance(instance)

        # Préparer les récompenses à appliquer
        rewards = {
            "points": task.rewards.points,
            "coins": task.rewards.coins,
            "experience": task.rewards.experience,
        }

        _LOGGER.info(
            f"Task instance {instance_id} validated by {validator_id}. "
            f"Rewards: {rewards['points']} pts, {rewards['coins']} coins, {rewards['experience']} xp"
        )

        return instance, task, rewards

    async def refuse_task(
        self,
        instance_id: str,
        validator_id: str,
        apply_penalty: bool = False,
        note: str = ""
    ) -> tuple[TaskInstance, Optional[dict]]:
        """Refuse une tâche complétée et optionnellement applique des pénalités.

        Args:
            instance_id: ID de l'instance de tâche
            validator_id: ID du validateur (parent/admin)
            apply_penalty: Si True, applique les pénalités définies dans la tâche
            note: Note optionnelle de refus

        Returns:
            Tuple (instance refusée, pénalités à appliquer ou None)

        Raises:
            TaskNotFoundError: Si l'instance ou la tâche n'existe pas
            ValidationError: Si l'instance n'est pas dans l'état correct
        """
        # Charger l'instance
        all_instances = await self.storage.load_task_instances()
        instance = None
        for inst in all_instances:
            if inst.id == instance_id:
                instance = inst
                break

        if instance is None:
            raise TaskNotFoundError(f"Task instance {instance_id} not found")

        # Vérifier le statut
        if instance.status != TaskInstanceStatus.COMPLETED_WAITING:
            raise ValidationError(
                f"Cannot refuse task instance {instance_id}: "
                f"status is {instance.status.value}, expected {TaskInstanceStatus.COMPLETED_WAITING.value}"
            )

        # Mettre à jour l'instance
        instance.status = TaskInstanceStatus.REFUSED
        instance.validated_at = datetime.now()
        instance.validator_id = validator_id
        instance.validation_note = note

        penalties = None

        # Appliquer les pénalités si demandé
        if apply_penalty:
            # Charger la tâche pour récupérer les pénalités
            tasks = await self.storage.load_tasks()
            task = None
            for t in tasks:
                if t.id == instance.task_id:
                    task = t
                    break

            if task is None:
                raise TaskNotFoundError(f"Task {instance.task_id} not found")

            penalties = {
                "points": task.penalties.points,
                "coins": task.penalties.coins,
            }

            instance.is_penalty_applied = True

            _LOGGER.info(
                f"Task instance {instance_id} refused by {validator_id} with penalties: "
                f"{penalties['points']} pts, {penalties['coins']} coins"
            )
        else:
            _LOGGER.info(f"Task instance {instance_id} refused by {validator_id} without penalties")

        # Sauvegarder
        await self.storage.save_task_instance(instance)

        return instance, penalties

    async def validate_penalty(
        self,
        instance_id: str,
        validator_id: str,
        note: str = ""
    ) -> tuple[TaskInstance, dict]:
        """Valide l'application d'une pénalité pour une tâche échouée.

        Utilisé quand une tâche est marquée FAILED et que le parent confirme
        l'application des pénalités.

        Args:
            instance_id: ID de l'instance de tâche
            validator_id: ID du validateur (parent/admin)
            note: Note optionnelle

        Returns:
            Tuple (instance, pénalités à appliquer)

        Raises:
            TaskNotFoundError: Si l'instance ou la tâche n'existe pas
            ValidationError: Si l'instance n'est pas FAILED ou pénalité déjà appliquée
        """
        # Charger l'instance
        all_instances = await self.storage.load_task_instances()
        instance = None
        for inst in all_instances:
            if inst.id == instance_id:
                instance = inst
                break

        if instance is None:
            raise TaskNotFoundError(f"Task instance {instance_id} not found")

        # Vérifier le statut
        if instance.status != TaskInstanceStatus.FAILED:
            raise ValidationError(
                f"Cannot validate penalty for instance {instance_id}: "
                f"status is {instance.status.value}, expected {TaskInstanceStatus.FAILED.value}"
            )

        # Vérifier que la pénalité n'a pas déjà été appliquée
        if instance.is_penalty_applied:
            raise ValidationError(f"Penalty already applied for instance {instance_id}")

        # Charger la tâche pour récupérer les pénalités
        tasks = await self.storage.load_tasks()
        task = None
        for t in tasks:
            if t.id == instance.task_id:
                task = t
                break

        if task is None:
            raise TaskNotFoundError(f"Task {instance.task_id} not found")

        # Préparer les pénalités
        penalties = {
            "points": task.penalties.points,
            "coins": task.penalties.coins,
        }

        # Marquer la pénalité comme appliquée
        instance.is_penalty_applied = True
        instance.validator_id = validator_id
        instance.validation_note = note
        instance.validated_at = datetime.now()

        # Sauvegarder
        await self.storage.save_task_instance(instance)

        _LOGGER.info(
            f"Penalty validated for instance {instance_id} by {validator_id}: "
            f"{penalties['points']} pts, {penalties['coins']} coins"
        )

        return instance, penalties
