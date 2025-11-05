"""Scheduler service for Habits Manager.

Handles automated daily tasks: instance generation, failure detection, streak checking.
"""
from datetime import date
from typing import List, Tuple

from ..const import _LOGGER
from ..core.models import TaskInstance, HabitStreak, Habit
from ..managers.task_manager import TaskManager
from ..managers.habit_manager import HabitManager
from ..storage.entity_manager import EntityManager


class Scheduler:
    """Gère les tâches planifiées automatiques."""

    def __init__(self, task_mgr: TaskManager, habit_mgr: HabitManager, entity_mgr: EntityManager):
        """Initialise le scheduler.

        Args:
            task_mgr: Manager de tâches
            habit_mgr: Manager d'habitudes
            entity_mgr: Manager d'entités HA
        """
        self.task_mgr = task_mgr
        self.habit_mgr = habit_mgr
        self.entity_mgr = entity_mgr

    async def run_daily_tasks(self, target_date: date = None) -> dict:
        """Exécute toutes les tâches quotidiennes automatiques.

        1. Génère les task instances pour la journée
        2. Vérifie les tâches échouées (deadline dépassée)
        3. Vérifie les streaks cassés

        Args:
            target_date: Date cible (par défaut aujourd'hui)

        Returns:
            Dictionnaire avec les résultats de chaque tâche
        """
        if target_date is None:
            target_date = date.today()

        _LOGGER.info(f"Running daily tasks for {target_date}")

        results = {}

        # 1. Générer les instances de tâches
        new_instances = await self.generate_instances(target_date)
        results["instances_generated"] = len(new_instances)

        # 2. Vérifier les tâches échouées
        failed_tasks = await self.check_failed_tasks(target_date)
        results["tasks_failed"] = len(failed_tasks)

        # 3. Vérifier les streaks cassés
        broken_streaks = await self.check_broken_streaks(target_date)
        results["streaks_broken"] = len(broken_streaks)

        _LOGGER.info(
            f"Daily tasks completed: {results['instances_generated']} instances, "
            f"{results['tasks_failed']} failed, {results['streaks_broken']} streaks broken"
        )

        return results

    async def generate_instances(self, target_date: date) -> List[TaskInstance]:
        """Génère les task instances pour une date donnée.

        Args:
            target_date: Date pour laquelle générer les instances

        Returns:
            Liste des instances générées
        """
        _LOGGER.debug(f"Generating task instances for {target_date}")

        instances = await self.task_mgr.generate_task_instances(target_date)

        # Mettre à jour les compteurs pour chaque enfant concerné
        child_ids = set(inst.child_id for inst in instances)
        for child_id in child_ids:
            all_instances = await self.task_mgr.get_task_instances(child_id=child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await self.entity_mgr.update_task_counts(child_id, pending_count, waiting_count)

        _LOGGER.info(f"Generated {len(instances)} task instances for {target_date}")

        return instances

    async def check_failed_tasks(self, check_date: date = None) -> List[TaskInstance]:
        """Vérifie et marque les tâches échouées (deadline dépassée).

        Args:
            check_date: Date à vérifier (par défaut aujourd'hui)

        Returns:
            Liste des instances marquées comme échouées
        """
        if check_date is None:
            check_date = date.today()

        _LOGGER.debug(f"Checking for failed tasks on {check_date}")

        failed_instances = await self.task_mgr.check_failed_tasks(check_date)

        # Mettre à jour les compteurs pour chaque enfant concerné
        child_ids = set(inst.child_id for inst in failed_instances)
        for child_id in child_ids:
            all_instances = await self.task_mgr.get_task_instances(child_id=child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await self.entity_mgr.update_task_counts(child_id, pending_count, waiting_count)

        if failed_instances:
            _LOGGER.info(f"Marked {len(failed_instances)} task instances as failed")

        return failed_instances

    async def check_broken_streaks(self, check_date: date = None) -> List[Tuple[HabitStreak, Habit]]:
        """Vérifie et réinitialise les streaks cassés.

        Args:
            check_date: Date à vérifier (par défaut aujourd'hui)

        Returns:
            Liste de tuples (streak cassé, habitude)
        """
        if check_date is None:
            check_date = date.today()

        _LOGGER.debug(f"Checking for broken streaks on {check_date}")

        broken = await self.habit_mgr.check_streak_breaks(check_date)

        # Mettre à jour longest_streak pour chaque enfant concerné
        child_ids = set(streak.child_id for streak, _ in broken)
        for child_id in child_ids:
            longest_streak = await self.habit_mgr.get_child_longest_streak(child_id)
            await self.entity_mgr.update_longest_streak(child_id, longest_streak)

        if broken:
            _LOGGER.info(f"Reset {len(broken)} broken streaks")

        return broken
