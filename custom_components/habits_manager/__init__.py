"""Habits Manager integration for Home Assistant.
import uuid

This integration provides a gamified task and habit management system for children.
"""
from datetime import datetime, date
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.config_entries import ConfigEntry
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import discovery

from .const import (
    DOMAIN,
    _LOGGER,
    EVENT_UPDATE,
    SERVICE_CREATE_CHILD,
    SERVICE_UPDATE_CHILD,
    SERVICE_DELETE_CHILD,
    SERVICE_CREATE_TASK,
    SERVICE_UPDATE_TASK,
    SERVICE_DELETE_TASK,
    SERVICE_MARK_TASK_COMPLETED,
    SERVICE_VALIDATE_TASK,
    SERVICE_REFUSE_TASK,
    SERVICE_CREATE_HABIT,
    SERVICE_UPDATE_HABIT,
    SERVICE_DELETE_HABIT,
    SERVICE_MARK_HABIT_COMPLETED,
    SERVICE_CREATE_REWARD,
    SERVICE_CLAIM_REWARD,
    SERVICE_APPROVE_CLAIM,
    SERVICE_REFUSE_CLAIM,
    SERVICE_CONSUME_CLAIM,
    SERVICE_CREATE_COSMETIC,
    SERVICE_PURCHASE_COSMETIC,
    SERVICE_LIST_CHILDREN,
    SERVICE_LIST_TASKS,
    SERVICE_LIST_HABITS,
    SERVICE_LIST_REWARDS,
    SERVICE_LIST_COSMETICS,
    SERVICE_LIST_TASK_INSTANCES,
    SERVICE_LIST_CLAIMS,
    SERVICE_GET_POINTS_HISTORY,
    SERVICE_GET_CHILD_HISTORY,
    SERVICE_BACKUP_DATA,
    SERVICE_RESTORE_DATA,
    SERVICE_SUSPEND_TASK,
    SERVICE_RESUME_TASK,
    SERVICE_CHECK_EXPIRED_SUSPENSIONS,
    SERVICE_ADD_POINTS,
    SERVICE_REMOVE_POINTS,
    SERVICE_SET_POINTS,
    SERVICE_ADD_COINS,
    SERVICE_REMOVE_COINS,
    SERVICE_SET_COINS,
    SERVICE_RESET_DAILY_TASKS,
    SERVICE_RESET_WEEKLY_TASKS,
    SERVICE_RESET_MONTHLY_TASKS,
    SERVICE_CLEAR_ALL_DATA,
)
from .storage.storage_manager import StorageManager
from .storage.entity_manager import EntityManager
from .managers.child_manager import ChildManager
from .managers.task_manager import TaskManager
from .managers.habit_manager import HabitManager
from .managers.validation_manager import ValidationManager
from .managers.reward_manager import RewardManager
from .managers.cosmetic_manager import CosmeticManager
from .managers.backup_manager import BackupManager
from .services.points_calculator import PointsCalculator
from .services.level_calculator import LevelCalculator
from .services.scheduler import Scheduler
from .core.exceptions import (
    ChildNotFoundError,
    TaskNotFoundError,
    HabitNotFoundError,
    RewardNotFoundError,
    CosmeticNotFoundError,
    InsufficientPointsError,
    InsufficientCoinsError,
    ValidationError,
)
from .sensor import async_create_child_sensors


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Setup de l'intégration Habits Manager.

    Args:
        hass: Instance Home Assistant
        config: Configuration

    Returns:
        True si le setup réussit
    """
    _LOGGER.info("Setting up Habits Manager integration")

    # Initialiser le stockage
    storage = StorageManager(hass)
    await storage.ensure_storage_dir()

    # Initialiser les managers Phase 1
    entity_mgr = EntityManager(hass)
    child_mgr = ChildManager(storage, entity_mgr)
    task_mgr = TaskManager(storage)
    habit_mgr = HabitManager(storage)

    # Initialiser les managers Phase 2
    validation_mgr = ValidationManager(storage, entity_mgr)
    reward_mgr = RewardManager(storage)
    cosmetic_mgr = CosmeticManager(storage)
    backup_mgr = BackupManager(storage)

    # Initialiser le scheduler
    scheduler = Scheduler(task_mgr, habit_mgr, entity_mgr)

    # Stocker dans hass.data
    hass.data[DOMAIN] = {
        "storage": storage,
        "entity_manager": entity_mgr,
        "child_manager": child_mgr,
        "task_manager": task_mgr,
        "habit_manager": habit_mgr,
        "validation_manager": validation_mgr,
        "reward_manager": reward_mgr,
        "cosmetic_manager": cosmetic_mgr,
        "backup_manager": backup_mgr,
        "scheduler": scheduler,
        "points_calculator": PointsCalculator(),
        "level_calculator": LevelCalculator(),
    }

    # Charger les enfants existants et créer leurs entités
    children = await child_mgr.get_all_children()
    _LOGGER.info(f"Loaded {len(children)} children from storage")

    for child in children:
        _LOGGER.debug(f"Creating entities for child: {child.name} ({child.id})")
        await entity_mgr.create_child_entities(child)

    # Vérifier que children_entities est bien créé
    if "children_entities" in hass.data[DOMAIN]:
        _LOGGER.info(f"children_entities prepared for {len(hass.data[DOMAIN]['children_entities'])} children")
    else:
        _LOGGER.warning("children_entities not created in hass.data!")

    # Générer les task instances pour aujourd'hui
    today = date.today()
    await task_mgr.generate_task_instances(today)

    # Enregistrer les services
    await register_services(hass)

    # Enregistrer le chemin statique pour les cartes Lovelace
    await register_frontend_resources(hass)

    # Charger la plateforme sensor (attendre qu'elle soit prête)
    await discovery.async_load_platform(hass, "sensor", DOMAIN, {}, config)

    _LOGGER.info("Habits Manager integration setup complete")
    _LOGGER.info(f"Registered {len(hass.services.async_services().get(DOMAIN, {}))} services for {DOMAIN}")

    return True


async def register_frontend_resources(hass: HomeAssistant):
    """Enregistre les ressources frontend (cartes Lovelace).

    Args:
        hass: Instance Home Assistant
    """
    import os

    # Chemin vers le dossier www de l'intégration
    integration_dir = os.path.dirname(__file__)
    www_dir = os.path.join(integration_dir, "www")

    # Enregistrer le chemin statique avec un path custom (pas /hacsfiles car pas sur HACS)
    # Les fichiers seront accessibles via /habits_manager_static/*
    # Utiliser directement l'API aiohttp pour ajouter un chemin statique
    hass.http.app.router.add_static(
        f"/{DOMAIN}_static",
        www_dir,
        name=f"{DOMAIN}_static"
    )

    _LOGGER.info(f"Registered static path: /{DOMAIN}_static -> {www_dir}")

    # Les cartes sont maintenant disponibles aux URLs suivantes:
    # - /habits_manager_static/habits-manager-card.js
    # - /habits_manager_static/habits-supervision-card.js
    # - /habits_manager_static/habits-child-card.js

    # L'utilisateur doit les ajouter manuellement dans:
    # Configuration > Lovelace Dashboards > Resources
    # OU les déclarer dans configuration.yaml sous lovelace > resources
    _LOGGER.info("Frontend cards ready. Add resources in Lovelace configuration.")


async def register_services(hass: HomeAssistant):
    """Enregistre tous les services Home Assistant.

    Args:
        hass: Instance Home Assistant
    """
    child_mgr = hass.data[DOMAIN]["child_manager"]
    task_mgr = hass.data[DOMAIN]["task_manager"]
    habit_mgr = hass.data[DOMAIN]["habit_manager"]
    points_calc = hass.data[DOMAIN]["points_calculator"]

    # ========================================================================
    # SERVICES ENFANTS
    # ========================================================================

    async def handle_create_child(call: ServiceCall):
        """Service: CrÃ©er un enfant."""
        try:
            name = call.data["name"]
            person_entity = call.data["person_entity"]

            child = await child_mgr.create_child(name, person_entity)

            # CrÃ©er dynamiquement les sensors pour ce nouvel enfant
            await async_create_child_sensors(hass, child.id)

            # Ãmettre un Ã©vÃ©nement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "child_created",
                "child_id": child.id,
                "child_name": child.name,
            })

            _LOGGER.info(f"Service call: Child created - {child.name} with {12} sensors")

        except ValidationError as err:
            _LOGGER.error(f"Validation error in create_child: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in create_child: {err}")
            raise HomeAssistantError(f"Failed to create child: {err}")

    async def handle_update_child(call: ServiceCall):
        """Service: Mettre é jour un enfant."""
        try:
            child_id = call.data["child_id"]
            child = await child_mgr.get_child(child_id)

            # Mettre é jour les champs fournis
            if "name" in call.data:
                child.name = call.data["name"]

            child = await child_mgr.update_child(child)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "child_updated",
                "child_id": child.id,
            })

            _LOGGER.info(f"Service call: Child updated - {child.id}")

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in update_child: {err}")
            raise HomeAssistantError(f"Failed to update child: {err}")

    async def handle_delete_child(call: ServiceCall):
        """Service: Supprimer un enfant."""
        try:
            child_id = call.data["child_id"]
            await child_mgr.delete_child(child_id)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "child_deleted",
                "child_id": child_id,
            })

            _LOGGER.info(f"Service call: Child deleted - {child_id}")

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in delete_child: {err}")
            raise HomeAssistantError(f"Failed to delete child: {err}")

    # ========================================================================
    # SERVICES TéCHES
    # ========================================================================

    async def handle_create_task(call: ServiceCall):
        """Service: CrÃ©er une tÃ¢che."""
        try:
            task_data = dict(call.data)
            task = await task_mgr.create_task(task_data)

            # GÃ©nÃ©rer les instances pour aujourd'hui dynamiquement
            today = date.today()
            new_instances = await task_mgr.generate_task_instances(today)
            _LOGGER.info(f"Generated {len(new_instances)} task instances for today")

            # Mettre Ã  jour les compteurs de tÃ¢ches pour chaque enfant concernÃ©
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            for child_id in task.assigned_to:
                # Compter les tÃ¢ches en attente pour cet enfant
                all_instances = await task_mgr.get_task_instances(child_id=child_id)
                pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
                waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
                await entity_mgr.update_task_counts(child_id, pending_count, waiting_count)

            # Ãmettre un Ã©vÃ©nement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_created",
                "task_id": task.id,
                "task_title": task.title,
            })

            _LOGGER.info(f"Service call: Task created - {task.title}")

        except ValidationError as err:
            _LOGGER.error(f"Validation error in create_task: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in create_task: {err}")
            raise HomeAssistantError(f"Failed to create task: {err}")

    async def handle_update_task(call: ServiceCall):
        """Service: Mettre é jour une tâche."""
        try:
            task_id = call.data["task_id"]
            task = await task_mgr.get_task(task_id)

            # Mettre é jour les champs fournis
            if "title" in call.data:
                task.title = call.data["title"]
            if "description" in call.data:
                task.description = call.data["description"]
            if "active" in call.data:
                task.active = call.data["active"]

            task = await task_mgr.update_task(task)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_updated",
                "task_id": task.id,
            })

            _LOGGER.info(f"Service call: Task updated - {task.id}")

        except TaskNotFoundError as err:
            _LOGGER.error(f"Task not found: {err}")
            raise HomeAssistantError(f"Task not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in update_task: {err}")
            raise HomeAssistantError(f"Failed to update task: {err}")

    async def handle_delete_task(call: ServiceCall):
        """Service: Supprimer une tâche."""
        try:
            task_id = call.data["task_id"]
            await task_mgr.delete_task(task_id)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_deleted",
                "task_id": task_id,
            })

            _LOGGER.info(f"Service call: Task deleted - {task_id}")

        except TaskNotFoundError as err:
            _LOGGER.error(f"Task not found: {err}")
            raise HomeAssistantError(f"Task not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in delete_task: {err}")
            raise HomeAssistantError(f"Failed to delete task: {err}")

    async def handle_mark_task_completed(call: ServiceCall):
        """Service: Marquer une tÃ¢che comme complÃ©tÃ©e (en attente de validation)."""
        try:
            instance_id = call.data["instance_id"]
            child_id = call.data["child_id"]

            instance = await task_mgr.mark_completed(instance_id)

            # Mettre Ã  jour les compteurs de tÃ¢ches dynamiquement
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            all_instances = await task_mgr.get_task_instances(child_id=child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await entity_mgr.update_task_counts(child_id, pending_count, waiting_count)

            # Ãmettre un Ã©vÃ©nement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_completed",
                "instance_id": instance.id,
                "task_id": instance.task_id,
                "child_id": child_id,
            })

            _LOGGER.info(f"Service call: Task completed - instance {instance_id} (pending={pending_count}, waiting={waiting_count})")

        except TaskNotFoundError as err:
            _LOGGER.error(f"Task instance not found: {err}")
            raise HomeAssistantError(f"Task instance not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in mark_task_completed: {err}")
            raise HomeAssistantError(f"Failed to mark task completed: {err}")

    # ========================================================================
    # SERVICES HABITUDES
    # ========================================================================

    async def handle_create_habit(call: ServiceCall):
        """Service: Créer une habitude."""
        try:
            habit_data = dict(call.data)
            habit = await habit_mgr.create_habit(habit_data)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "habit_created",
                "habit_id": habit.id,
                "habit_title": habit.title,
            })

            _LOGGER.info(f"Service call: Habit created - {habit.title}")

        except ValidationError as err:
            _LOGGER.error(f"Validation error in create_habit: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in create_habit: {err}")
            raise HomeAssistantError(f"Failed to create habit: {err}")

    async def handle_update_habit(call: ServiceCall):
        """Service: Mettre é jour une habitude."""
        try:
            habit_id = call.data["habit_id"]
            habit = await habit_mgr.get_habit(habit_id)

            # Mettre é jour les champs fournis
            if "title" in call.data:
                habit.title = call.data["title"]
            if "description" in call.data:
                habit.description = call.data["description"]
            if "active" in call.data:
                habit.active = call.data["active"]

            habit = await habit_mgr.update_habit(habit)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "habit_updated",
                "habit_id": habit.id,
            })

            _LOGGER.info(f"Service call: Habit updated - {habit.id}")

        except HabitNotFoundError as err:
            _LOGGER.error(f"Habit not found: {err}")
            raise HomeAssistantError(f"Habit not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in update_habit: {err}")
            raise HomeAssistantError(f"Failed to update habit: {err}")

    async def handle_delete_habit(call: ServiceCall):
        """Service: Supprimer une habitude."""
        try:
            habit_id = call.data["habit_id"]
            await habit_mgr.delete_habit(habit_id)

            # émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "habit_deleted",
                "habit_id": habit_id,
            })

            _LOGGER.info(f"Service call: Habit deleted - {habit_id}")

        except HabitNotFoundError as err:
            _LOGGER.error(f"Habit not found: {err}")
            raise HomeAssistantError(f"Habit not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in delete_habit: {err}")
            raise HomeAssistantError(f"Failed to delete habit: {err}")

    async def handle_mark_habit_completed(call: ServiceCall):
        """Service: Marquer une habitude comme complétée."""
        try:
            habit_id = call.data["habit_id"]
            child_id = call.data["child_id"]

            # Enregistrer la complétion
            streak, streak_increased = await habit_mgr.record_completion(habit_id, child_id)

            # Calculer les rÃ©compenses avec bonus
            rewards = await habit_mgr.calculate_streak_bonus(habit_id, child_id)

            # Appliquer les rÃ©compenses (met Ã  jour points/coins/level/xp automatiquement)
            await child_mgr.update_points(
                child_id,
                points=rewards["points"],
                coins=rewards["coins"],
                xp=rewards["experience"]
            )

            # Charger l'habit pour avoir le titre
            habit = await habit_mgr.get_habit(habit_id)
            
            # Créer l'entrée d'historique
            from .core.models import PointsHistoryEntry, HistoryActionType
            history_entry = PointsHistoryEntry(
                id=f"history_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.now(),
                action_type=HistoryActionType.HABIT_COMPLETED,
                points_delta=rewards["points"],
                coins_delta=rewards["coins"],
                experience_delta=rewards["experience"],
                description=f"Habitude complétée : {habit.title} (streak: {streak.current_streak})",
                related_entity_type="habit",
                related_entity_id=habit.id,
                related_entity_name=habit.title,
            )
            await child_mgr.add_points_history(child_id, history_entry)

            # Mettre Ã  jour le longest_streak dynamiquement
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            longest_streak = await habit_mgr.get_child_longest_streak(child_id)
            await entity_mgr.update_longest_streak(child_id, longest_streak)

            # Ãmettre un Ã©vÃ©nement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "habit_completed",
                "habit_id": habit_id,
                "child_id": child_id,
                "streak": streak.current_streak,
                "longest_streak": longest_streak,
                "streak_increased": streak_increased,
                "rewards": rewards,
            })

            _LOGGER.info(f"Service call: Habit completed - {habit_id} by child {child_id}, streak={streak.current_streak}, longest={longest_streak}")

        except HabitNotFoundError as err:
            _LOGGER.error(f"Habit not found: {err}")
            raise HomeAssistantError(f"Habit not found: {err}")
        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in mark_habit_completed: {err}")
            raise HomeAssistantError(f"Failed to mark habit completed: {err}")

    # ========================================================================
    # SERVICES VALIDATION (Phase 2)
    # ========================================================================

    async def handle_validate_task(call: ServiceCall):
        """Service: Valider une tÃ¢che complÃ©tÃ©e."""
        try:
            instance_id = call.data["instance_id"]
            validator_id = call.data.get("validator_id", "admin")
            note = call.data.get("note", "")

            validation_mgr = hass.data[DOMAIN]["validation_manager"]

            # Valider et rÃ©cupÃ©rer les rÃ©compenses
            instance, task, rewards = await validation_mgr.validate_task(
                instance_id, validator_id, note
            )

            # Appliquer les rÃ©compenses
            await child_mgr.update_points(
                instance.child_id,
                points=rewards["points"],
                coins=rewards["coins"],
                xp=rewards["experience"]
            )

            # Créer l'entrée d'historique
            from .core.models import PointsHistoryEntry, HistoryActionType
            history_entry = PointsHistoryEntry(
                id=f"history_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.now(),
                action_type=HistoryActionType.TASK_VALIDATED,
                points_delta=rewards["points"],
                coins_delta=rewards["coins"],
                experience_delta=rewards["experience"],
                description=f"Tâche validée : {task.title}",
                related_entity_type="task",
                related_entity_id=task.id,
                related_entity_name=task.title,
                validator_id=validator_id,
            )
            await child_mgr.add_points_history(instance.child_id, history_entry)

            # Mettre Ã  jour les compteurs
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            all_instances = await task_mgr.get_task_instances(child_id=instance.child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await entity_mgr.update_task_counts(instance.child_id, pending_count, waiting_count)

            # Ãmettre un Ã©vÃ©nement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_validated",
                "instance_id": instance.id,
                "task_id": task.id,
                "child_id": instance.child_id,
                "rewards": rewards,
            })

            _LOGGER.info(f"Service call: Task validated - {instance_id} by {validator_id}")

        except TaskNotFoundError as err:
            _LOGGER.error(f"Task not found: {err}")
            raise HomeAssistantError(f"Task not found: {err}")
        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in validate_task: {err}")
            raise HomeAssistantError(f"Failed to validate task: {err}")

    async def handle_refuse_task(call: ServiceCall):
        """Service: Refuser une tÃ¢che complÃ©tÃ©e."""
        try:
            instance_id = call.data["instance_id"]
            validator_id = call.data.get("validator_id", "admin")
            apply_penalty = call.data.get("apply_penalty", False)
            note = call.data.get("note", "")

            validation_mgr = hass.data[DOMAIN]["validation_manager"]

            # Refuser et rÃ©cupÃ©rer les pÃ©nalitÃ©s si applicables
            instance, penalties = await validation_mgr.refuse_task(
                instance_id, validator_id, apply_penalty, note
            )

            # Appliquer les pÃ©nalitÃ©s si prÃ©sentes
            if penalties:
                await child_mgr.update_points(
                    instance.child_id,
                    points=penalties["points"],
                    coins=penalties["coins"],
                    xp=0
                )

                # Charger la task pour avoir le titre
                task = await task_mgr.get_task(instance.task_id)
                
                # Créer l'entrée d'historique
                from .core.models import PointsHistoryEntry, HistoryActionType
                history_entry = PointsHistoryEntry(
                    id=f"history_{uuid.uuid4().hex[:8]}",
                    timestamp=datetime.now(),
                    action_type=HistoryActionType.PENALTY_APPLIED,
                    points_delta=penalties["points"],
                    coins_delta=penalties["coins"],
                    experience_delta=0,
                    description=f"Pénalité appliquée : {task.title}",
                    related_entity_type="task",
                    related_entity_id=task.id,
                    related_entity_name=task.title,
                    validator_id=validator_id,
                )
                await child_mgr.add_points_history(instance.child_id, history_entry)

            # Mettre Ã  jour les compteurs
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            all_instances = await task_mgr.get_task_instances(child_id=instance.child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await entity_mgr.update_task_counts(instance.child_id, pending_count, waiting_count)

            # Ãmettre un Ã©vÃ©nement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_refused",
                "instance_id": instance.id,
                "child_id": instance.child_id,
                "penalties_applied": penalties is not None,
            })

            _LOGGER.info(f"Service call: Task refused - {instance_id} by {validator_id}")

        except TaskNotFoundError as err:
            _LOGGER.error(f"Task not found: {err}")
            raise HomeAssistantError(f"Task not found: {err}")
        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in refuse_task: {err}")
            raise HomeAssistantError(f"Failed to refuse task: {err}")

    # ========================================================================
    # SERVICES REWARDS (Phase 2)
    # ========================================================================

    async def handle_create_reward(call: ServiceCall):
        """Service: CrÃ©er une rÃ©compense."""
        try:
            reward_data = dict(call.data)
            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            reward = await reward_mgr.create_reward(reward_data)

            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "reward_created",
                "reward_id": reward.id,
            })

            _LOGGER.info(f"Service call: Reward created - {reward.title}")

        except Exception as err:
            _LOGGER.error(f"Error in create_reward: {err}")
            raise HomeAssistantError(f"Failed to create reward: {err}")

    async def handle_claim_reward(call: ServiceCall):
        """Service: RÃ©clamer une rÃ©compense."""
        try:
            reward_id = call.data["reward_id"]
            child_id = call.data["child_id"]

            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # RÃ©clamer la rÃ©compense
            claim, points_cost, coins_cost = await reward_mgr.claim_reward(reward_id, child_id)

            # DÃ©duire les points/coins
            await child_mgr.update_points(child_id, points=-points_cost, coins=-coins_cost, xp=0)


            # Charger la reward pour avoir le titre
            reward = await reward_mgr.get_reward(reward_id)
            
            # Créer l'entrée d'historique
            from .core.models import PointsHistoryEntry, HistoryActionType
            history_entry = PointsHistoryEntry(
                id=f"history_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.now(),
                action_type=HistoryActionType.REWARD_CLAIMED,
                points_delta=-points_cost,
                coins_delta=-coins_cost,
                experience_delta=0,
                description=f"Récompense réclamée : {reward.title}",
                related_entity_type="reward",
                related_entity_id=reward.id,
                related_entity_name=reward.title,
            )
            await child_mgr.add_points_history(child_id, history_entry)
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "reward_claimed",
                "reward_id": reward_id,
                "claim_id": claim.id,
                "child_id": child_id,
                "status": claim.status.value,
            })

            _LOGGER.info(f"Service call: Reward claimed - {reward_id} by {child_id}")

        except RewardNotFoundError as err:
            _LOGGER.error(f"Reward not found: {err}")
            raise HomeAssistantError(f"Reward not found: {err}")
        except InsufficientPointsError as err:
            _LOGGER.error(f"Insufficient points: {err}")
            raise HomeAssistantError(f"Insufficient points/coins: {err}")
        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in claim_reward: {err}")
            raise HomeAssistantError(f"Failed to claim reward: {err}")

    async def handle_approve_claim(call: ServiceCall):
        """Service: Approuver une rÃ©clamation."""
        try:
            claim_id = call.data["claim_id"]
            approver_id = call.data.get("approver_id", "admin")

            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            claim = await reward_mgr.approve_claim(claim_id, approver_id)

            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "claim_approved",
                "claim_id": claim.id,
                "child_id": claim.child_id,
            })

            _LOGGER.info(f"Service call: Claim approved - {claim_id} by {approver_id}")

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in approve_claim: {err}")
            raise HomeAssistantError(f"Failed to approve claim: {err}")

    # ========================================================================
    # SERVICES COSMETICS (Phase 2)
    # ========================================================================

    async def handle_create_cosmetic(call: ServiceCall):
        """Service: CrÃ©er un cosmÃ©tique."""
        try:
            cosmetic_data = dict(call.data)
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            cosmetic = await cosmetic_mgr.create_cosmetic(cosmetic_data)

            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_created",
                "cosmetic_id": cosmetic.id,
            })

            _LOGGER.info(f"Service call: Cosmetic created - {cosmetic.name}")

        except Exception as err:
            _LOGGER.error(f"Error in create_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to create cosmetic: {err}")

    async def handle_purchase_cosmetic(call: ServiceCall):
        """Service: Acheter un cosmétique."""
        try:
            cosmetic_id = call.data["cosmetic_id"]
            child_id = call.data["child_id"]

            child_mgr = hass.data[DOMAIN]["child_manager"]
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Get cosmetic to check cost
            cosmetic = await cosmetic_mgr.get_cosmetic(cosmetic_id)

            # Purchase cosmetic (deducts coins and adds to owned_cosmetics)
            child = await child_mgr.purchase_cosmetic(child_id, cosmetic_id, cosmetic.cost_coins)

            # Fire event
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_purchased",
                "cosmetic_id": cosmetic_id,
                "child_id": child_id,
                "coins_spent": cosmetic.cost_coins,
            })

            _LOGGER.info(f"Service call: Cosmetic {cosmetic.name} purchased by {child.name}")

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except CosmeticNotFoundError as err:
            _LOGGER.error(f"Cosmetic not found: {err}")
            raise HomeAssistantError(f"Cosmetic not found: {err}")
        except InsufficientCoinsError as err:
            _LOGGER.error(f"Insufficient coins: {err}")
            raise HomeAssistantError(f"Insufficient coins: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in purchase_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to purchase cosmetic: {err}")

    # ========================================================================
    # SERVICES LISTING (Phase 2)
    # ========================================================================

    async def handle_list_children(call: ServiceCall):
        """Service: Lister tous les enfants.

        Retourne la liste complète de tous les enfants avec leurs statistiques.
        Aucun filtre n'est nécessaire.
        """
        try:
            child_mgr = hass.data[DOMAIN]["child_manager"]

            # Récupérer tous les enfants
            children = await child_mgr.get_all_children()

            # Convertir en dictionnaires
            children_data = [child.to_dict() for child in children]

            _LOGGER.debug(f"Service call: list_children returned {len(children_data)} children")

            # Retourner les données directement au lieu d'émettre un événement
            return {"children": children_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_children: {err}")
            raise HomeAssistantError(f"Failed to list children: {err}")

    async def handle_list_tasks(call: ServiceCall):
        """Service: Lister toutes les tâches.

        Filtres optionnels:
        - assigned_to (child_id): Filtrer par enfant assigné
        - type (one_time, recurring): Filtrer par type
        - category: Filtrer par catégorie
        """
        try:
            task_mgr = hass.data[DOMAIN]["task_manager"]

            # Récupérer toutes les tâches
            tasks = await task_mgr.get_all_tasks()

            # Appliquer les filtres
            assigned_to = call.data.get("assigned_to")
            task_type = call.data.get("type")
            category = call.data.get("category")

            filtered_tasks = tasks

            if assigned_to:
                filtered_tasks = [t for t in filtered_tasks if assigned_to in t.assigned_to]

            if task_type:
                filtered_tasks = [t for t in filtered_tasks if t.type.value == task_type]

            if category:
                filtered_tasks = [t for t in filtered_tasks if t.category.value == category]

            # Convertir en dictionnaires
            tasks_data = [task.to_dict() for task in filtered_tasks]

            _LOGGER.debug(f"Service call: list_tasks returned {len(tasks_data)} tasks (filters: assigned_to={assigned_to}, type={task_type}, category={category})")

            # Retourner les données directement
            return {"tasks": tasks_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_tasks: {err}")
            raise HomeAssistantError(f"Failed to list tasks: {err}")

    async def handle_list_habits(call: ServiceCall):
        """Service: Lister toutes les habitudes.

        Filtres optionnels:
        - assigned_to (child_id): Filtrer par enfant assigné
        - frequency (daily, weekly, custom): Filtrer par fréquence
        """
        try:
            habit_mgr = hass.data[DOMAIN]["habit_manager"]

            # Récupérer toutes les habitudes
            habits = await habit_mgr.get_all_habits()

            # Appliquer les filtres
            assigned_to = call.data.get("assigned_to")
            frequency = call.data.get("frequency")

            filtered_habits = habits

            if assigned_to:
                filtered_habits = [h for h in filtered_habits if assigned_to in h.assigned_to]

            if frequency:
                filtered_habits = [h for h in filtered_habits if h.frequency.value == frequency]

            # Convertir en dictionnaires avec streaks actuels
            habits_data = []
            for habit in filtered_habits:
                habit_dict = habit.to_dict()

                # Ajouter les streaks pour chaque enfant assigné
                habit_dict["streaks"] = {}
                for child_id in habit.assigned_to:
                    streak = await habit_mgr.get_streak(habit.id, child_id)
                    if streak:
                        habit_dict["streaks"][child_id] = streak.to_dict()
                    else:
                        habit_dict["streaks"][child_id] = None

                habits_data.append(habit_dict)

            _LOGGER.debug(f"Service call: list_habits returned {len(habits_data)} habits (filters: assigned_to={assigned_to}, frequency={frequency})")

            # Retourner les données directement
            return {"habits": habits_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_habits: {err}")
            raise HomeAssistantError(f"Failed to list habits: {err}")

    async def handle_list_rewards(call: ServiceCall):
        """Service: Lister toutes les récompenses.

        Filtres optionnels:
        - type (physical, privilege, special): Filtrer par type
        - available_only (bool): Ne retourner que les récompenses en stock
        """
        try:
            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Récupérer toutes les récompenses
            rewards = await reward_mgr.get_all_rewards()

            # Appliquer les filtres
            reward_type = call.data.get("type")
            available_only = call.data.get("available_only", False)

            filtered_rewards = rewards

            if reward_type:
                filtered_rewards = [r for r in filtered_rewards if r.type.value == reward_type]

            if available_only:
                # Filtrer: stock is None (illimité) ou stock > 0
                filtered_rewards = [r for r in filtered_rewards if r.stock is None or r.stock > 0]

            # Convertir en dictionnaires
            rewards_data = [reward.to_dict() for reward in filtered_rewards]

            _LOGGER.debug(f"Service call: list_rewards returned {len(rewards_data)} rewards (filters: type={reward_type}, available_only={available_only})")

            # Retourner les données directement
            return {"rewards": rewards_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_rewards: {err}")
            raise HomeAssistantError(f"Failed to list rewards: {err}")

    async def handle_list_cosmetics(call: ServiceCall):
        """Service: Lister tous les cosmétiques.

        Filtres optionnels:
        - category (clothes, accessory, pet, theme, badge, animation): Filtrer par catégorie
        - rarity (common, rare, epic, legendary): Filtrer par rareté
        - active_only (bool): Ne retourner que les cosmétiques actifs
        """
        try:
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Récupérer les paramètres
            category = call.data.get("category")
            rarity = call.data.get("rarity")
            active_only = call.data.get("active_only", False)

            # Récupérer tous les cosmétiques
            cosmetics = await cosmetic_mgr.get_all_cosmetics(active_only=active_only)

            # Appliquer les filtres
            filtered_cosmetics = cosmetics

            if category:
                filtered_cosmetics = [c for c in filtered_cosmetics if c.category.value == category]

            if rarity:
                filtered_cosmetics = [c for c in filtered_cosmetics if c.rarity.value == rarity]

            # Convertir en dictionnaires
            cosmetics_data = [cosmetic.to_dict() for cosmetic in filtered_cosmetics]

            _LOGGER.debug(f"Service call: list_cosmetics returned {len(cosmetics_data)} cosmetics (filters: category={category}, rarity={rarity}, active_only={active_only})")

            # Retourner les données directement
            return {"cosmetics": cosmetics_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_cosmetics: {err}")
            raise HomeAssistantError(f"Failed to list cosmetics: {err}")

    async def handle_list_task_instances(call: ServiceCall):
        """Service: Lister les instances de tâches avec filtres.

        Filtres optionnels:
        - child_id: Filtrer par enfant
        - task_id: Filtrer par tâche
        - status: Filtrer par statut
        - date_from/date_to: Filtrer par période
        - limit: Limiter le nombre de résultats
        """
        try:
            task_mgr = hass.data[DOMAIN]["task_manager"]

            # Récupérer les paramètres de filtre
            child_id = call.data.get("child_id")
            task_id = call.data.get("task_id")
            status = call.data.get("status")
            date_from = call.data.get("date_from")
            date_to = call.data.get("date_to")
            limit = call.data.get("limit")

            # Récupérer toutes les instances
            instances = await task_mgr.get_task_instances(
                child_id=child_id,
                task_id=task_id
            )

            # Appliquer les filtres supplémentaires
            if status:
                instances = [i for i in instances if i.status.value == status]

            if date_from:
                from datetime import datetime
                date_from_dt = datetime.fromisoformat(date_from).date()
                instances = [i for i in instances if i.scheduled_date >= date_from_dt]

            if date_to:
                from datetime import datetime
                date_to_dt = datetime.fromisoformat(date_to).date()
                instances = [i for i in instances if i.scheduled_date <= date_to_dt]

            # Limiter le nombre de résultats
            if limit:
                instances = instances[:limit]

            # Convertir en dictionnaires
            instances_data = [instance.to_dict() for instance in instances]

            _LOGGER.debug(f"Service call: list_task_instances returned {len(instances_data)} instances")

            return {"instances": instances_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_task_instances: {err}")
            raise HomeAssistantError(f"Failed to list task instances: {err}")

    async def handle_list_claims(call: ServiceCall):
        """Service: Lister les réclamations de récompenses.

        Filtres optionnels:
        - child_id: Filtrer par enfant
        - status: Filtrer par statut (PENDING, APPROVED, REFUSED, CONSUMED)
        - date_from/date_to: Filtrer par période
        """
        try:
            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Récupérer les paramètres de filtre
            child_id = call.data.get("child_id")
            status = call.data.get("status")
            date_from = call.data.get("date_from")
            date_to = call.data.get("date_to")

            # Récupérer toutes les réclamations
            claims = await reward_mgr.get_all_claims()

            # Appliquer les filtres
            if child_id:
                claims = [c for c in claims if c.child_id == child_id]

            if status:
                claims = [c for c in claims if c.status.value == status]

            if date_from:
                from datetime import datetime
                date_from_dt = datetime.fromisoformat(date_from)
                claims = [c for c in claims if c.claimed_at >= date_from_dt]

            if date_to:
                from datetime import datetime
                date_to_dt = datetime.fromisoformat(date_to)
                claims = [c for c in claims if c.claimed_at <= date_to_dt]

            # Convertir en dictionnaires
            claims_data = [claim.to_dict() for claim in claims]

            _LOGGER.debug(f"Service call: list_claims returned {len(claims_data)} claims")

            return {"claims": claims_data}

        except Exception as err:
            _LOGGER.error(f"Error in list_claims: {err}")
            raise HomeAssistantError(f"Failed to list claims: {err}")

    async def handle_refuse_claim(call: ServiceCall):
        """Service: Refuser une réclamation de récompense.

        Paramètres:
        - claim_id (str): ID de la réclamation
        - reason (str, optional): Raison du refus
        """
        try:
            claim_id = call.data["claim_id"]
            reason = call.data.get("reason", "Réclamation refusée")

            reward_mgr = hass.data[DOMAIN]["reward_manager"]
            child_mgr = hass.data[DOMAIN]["child_manager"]

            # Récupérer la réclamation
            claim = await reward_mgr.get_claim(claim_id)

            # Vérifier que la réclamation est en attente
            if claim.status.value != "pending":
                raise ValidationError(f"Cannot refuse claim with status {claim.status.value}")

            # Récupérer la reward pour connaître le coût
            reward = await reward_mgr.get_reward(claim.reward_id)

            # Refuser la réclamation
            claim = await reward_mgr.refuse_claim(claim_id, reason)

            # Rembourser les points à l'enfant
            await child_mgr.update_points(
                claim.child_id,
                points=reward.cost_points,
                coins=0,
                xp=0
            )

            # Créer l'entrée d'historique
            from .core.models import PointsHistoryEntry, HistoryActionType
            import uuid
            history_entry = PointsHistoryEntry(
                id=f"history_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.now(),
                action_type=HistoryActionType.MANUAL_ADJUSTMENT,
                points_delta=reward.cost_points,
                coins_delta=0,
                experience_delta=0,
                description=f"Remboursement : {reward.title} (réclamation refusée)",
                related_entity_type="reward",
                related_entity_id=reward.id,
                related_entity_name=reward.title,
            )
            await child_mgr.add_points_history(claim.child_id, history_entry)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "claim_refused",
                "claim_id": claim.id,
                "child_id": claim.child_id,
                "reward_id": claim.reward_id,
            })

            _LOGGER.info(f"Service call: Claim refused - {claim_id}")

            return {"claim": claim.to_dict()}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in refuse_claim: {err}")
            raise HomeAssistantError(f"Failed to refuse claim: {err}")

    async def handle_get_task_instance(call: ServiceCall):
        """Service: Récupérer une instance de tâche spécifique.

        Paramètres:
        - instance_id (str): ID de l'instance
        """
        try:
            instance_id = call.data["instance_id"]

            task_mgr = hass.data[DOMAIN]["task_manager"]

            # Get the instance
            instance = await task_mgr.get_task_instance(instance_id)

            if not instance:
                raise ValidationError(f"Task instance {instance_id} not found")

            _LOGGER.debug(f"Service call: get_task_instance returned instance {instance_id}")

            return {"instance": instance.to_dict()}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in get_task_instance: {err}")
            raise HomeAssistantError(f"Failed to get task instance: {err}")

    async def handle_get_points_history(call: ServiceCall):
        """Service: Récupérer l'historique des points d'un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - limit (int, optional): Nombre max d'entrées (défaut 20, max 50)
        - action_type_filter (str, optional): Filtrer par type d'action
        """
        try:
            child_id = call.data["child_id"]
            limit = call.data.get("limit", 20)
            action_type_filter = call.data.get("action_type_filter")

            # Limiter entre 1 et 50
            limit = max(1, min(50, limit))

            # Récupérer l'enfant
            child = await child_mgr.get_child(child_id)

            # Filtrer l'historique si nécessaire
            history = child.points_history
            if action_type_filter:
                from .core.models import HistoryActionType
                history = [
                    entry for entry in history
                    if entry.action_type.value == action_type_filter
                ]

            # Limiter le nombre d'entrées
            history = history[:limit]

            # Convertir en dictionnaires
            history_data = [entry.to_dict() for entry in history]

            _LOGGER.debug(f"Service call: get_points_history for {child.name} returned {len(history_data)} entries")

            return {"history": history_data}

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in get_points_history: {err}")
            raise HomeAssistantError(f"Failed to get points history: {err}")

    async def handle_get_child_stats(call: ServiceCall):
        """Service: Récupérer les statistiques globales d'un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - period (str, optional): Période d'analyse (week, month, all_time) - défaut: all_time
        """
        try:
            child_id = call.data["child_id"]
            period = call.data.get("period", "all_time")

            child_mgr = hass.data[DOMAIN]["child_manager"]
            task_mgr = hass.data[DOMAIN]["task_manager"]
            habit_mgr = hass.data[DOMAIN]["habit_manager"]
            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Get the child
            child = await child_mgr.get_child(child_id)

            # Determine date range based on period
            from datetime import datetime, timedelta
            now = datetime.now()
            date_from = None

            if period == "week":
                date_from = now - timedelta(days=7)
            elif period == "month":
                date_from = now - timedelta(days=30)
            # all_time: date_from stays None

            # Get task instances
            instances = await task_mgr.get_task_instances(child_id=child_id)
            if date_from:
                instances = [i for i in instances if i.completion_date and i.completion_date >= date_from]

            # Calculate task statistics
            tasks_completed = len([i for i in instances if i.status.value == "validated"])
            tasks_pending = len([i for i in instances if i.status.value in ["pending", "completed_waiting"]])
            tasks_refused = len([i for i in instances if i.status.value == "refused"])

            # Get habits
            habits = await habit_mgr.get_habits(child_id=child_id)
            active_habits = len([h for h in habits if h.active])

            # Calculate habit streaks
            total_streak = sum(h.current_streak for h in habits)
            max_streak = max([h.current_streak for h in habits], default=0)

            # Get reward claims
            claims = await reward_mgr.get_all_claims()
            child_claims = [c for c in claims if c.child_id == child_id]
            if date_from:
                child_claims = [c for c in child_claims if c.claimed_at >= date_from]

            rewards_claimed = len([c for c in child_claims if c.status.value in ["approved", "consumed"]])
            rewards_pending = len([c for c in child_claims if c.status.value == "pending"])

            # Points statistics from history
            history = child.points_history
            if date_from:
                history = [h for h in history if h.timestamp >= date_from]

            points_earned = sum(h.points_delta for h in history if h.points_delta > 0)
            points_spent = sum(abs(h.points_delta) for h in history if h.points_delta < 0)
            coins_earned = sum(h.coins_delta for h in history if h.coins_delta > 0)
            xp_earned = sum(h.experience_delta for h in history if h.experience_delta > 0)

            stats = {
                "child_id": child_id,
                "child_name": child.name,
                "period": period,
                "current_status": {
                    "points": child.points,
                    "coins": child.coins,
                    "level": child.level,
                    "xp": child.experience,
                    "xp_for_next_level": child.xp_for_next_level,
                },
                "tasks": {
                    "completed": tasks_completed,
                    "pending": tasks_pending,
                    "refused": tasks_refused,
                    "total": len(instances),
                },
                "habits": {
                    "active": active_habits,
                    "total": len(habits),
                    "total_streak": total_streak,
                    "max_streak": max_streak,
                },
                "rewards": {
                    "claimed": rewards_claimed,
                    "pending": rewards_pending,
                    "total": len(child_claims),
                },
                "points_summary": {
                    "earned": points_earned,
                    "spent": points_spent,
                    "net": points_earned - points_spent,
                },
                "coins_earned": coins_earned,
                "xp_earned": xp_earned,
            }

            _LOGGER.debug(f"Service call: get_child_stats for {child.name} (period: {period})")

            return {"stats": stats}

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in get_child_stats: {err}")
            raise HomeAssistantError(f"Failed to get child stats: {err}")

    async def handle_equip_cosmetic(call: ServiceCall):
        """Service: Équiper un cosmétique sur un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - cosmetic_id (str): ID du cosmétique
        """
        try:
            child_id = call.data["child_id"]
            cosmetic_id = call.data["cosmetic_id"]

            child_mgr = hass.data[DOMAIN]["child_manager"]
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Vérifier que l'enfant possède ce cosmétique
            child = await child_mgr.get_child(child_id)
            if cosmetic_id not in child.owned_cosmetics:
                raise ValidationError(f"Child {child_id} does not own cosmetic {cosmetic_id}")

            # Équiper le cosmétique
            await cosmetic_mgr.equip_cosmetic(child_id, cosmetic_id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_equipped",
                "child_id": child_id,
                "cosmetic_id": cosmetic_id,
            })

            _LOGGER.info(f"Service call: Cosmetic equipped - {cosmetic_id} for {child.name}")

            return {
                "child_id": child_id,
                "cosmetic_id": cosmetic_id,
                "equipped": True
            }

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in equip_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to equip cosmetic: {err}")

    async def handle_unequip_cosmetic(call: ServiceCall):
        """Service: Déséquiper un cosmétique d'un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - cosmetic_id (str): ID du cosmétique
        """
        try:
            child_id = call.data["child_id"]
            cosmetic_id = call.data["cosmetic_id"]

            child_mgr = hass.data[DOMAIN]["child_manager"]
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Déséquiper le cosmétique
            await cosmetic_mgr.unequip_cosmetic(child_id, cosmetic_id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_unequipped",
                "child_id": child_id,
                "cosmetic_id": cosmetic_id,
            })

            child = await child_mgr.get_child(child_id)
            _LOGGER.info(f"Service call: Cosmetic unequipped - {cosmetic_id} for {child.name}")

            return {
                "child_id": child_id,
                "cosmetic_id": cosmetic_id,
                "equipped": False
            }

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in unequip_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to unequip cosmetic: {err}")

    async def handle_get_weekly_report(call: ServiceCall):
        """Service: Générer un rapport hebdomadaire pour un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - weeks_ago (int, optional): Nombre de semaines en arrière (0 = semaine actuelle)
        """
        try:
            child_id = call.data["child_id"]
            weeks_ago = call.data.get("weeks_ago", 0)

            child_mgr = hass.data[DOMAIN]["child_manager"]
            task_mgr = hass.data[DOMAIN]["task_manager"]
            habit_mgr = hass.data[DOMAIN]["habit_manager"]
            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Get the child
            child = await child_mgr.get_child(child_id)

            # Calculate date range for the week
            from datetime import datetime, timedelta
            now = datetime.now()
            week_start = now - timedelta(days=now.weekday(), weeks=weeks_ago)
            week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)
            week_end = week_start + timedelta(days=7)

            # Get task instances for the week
            instances = await task_mgr.get_task_instances(child_id=child_id)
            week_instances = [
                i for i in instances
                if i.scheduled_date and week_start.date() <= i.scheduled_date < week_end.date()
            ]

            tasks_completed = len([i for i in week_instances if i.status.value == "validated"])
            tasks_refused = len([i for i in week_instances if i.status.value == "refused"])
            tasks_pending = len([i for i in week_instances if i.status.value in ["pending", "completed_waiting"]])

            # Calculate completion rate
            total_tasks = len(week_instances)
            completion_rate = (tasks_completed / total_tasks * 100) if total_tasks > 0 else 0

            # Get habit completions for the week
            habits = await habit_mgr.get_habits(child_id=child_id)
            habit_completions = []
            for habit in habits:
                # Count completions in the week (this would need habit history)
                habit_completions.append({
                    "habit_id": habit.id,
                    "habit_name": habit.title,
                    "current_streak": habit.current_streak,
                    "active": habit.active,
                })

            # Get points history for the week
            history = child.points_history
            week_history = [h for h in history if week_start <= h.timestamp < week_end]

            points_earned = sum(h.points_delta for h in week_history if h.points_delta > 0)
            points_spent = sum(abs(h.points_delta) for h in week_history if h.points_delta < 0)
            coins_earned = sum(h.coins_delta for h in week_history if h.coins_delta > 0)
            xp_earned = sum(h.experience_delta for h in week_history if h.experience_delta > 0)

            # Get reward claims for the week
            claims = await reward_mgr.get_all_claims()
            week_claims = [
                c for c in claims
                if c.child_id == child_id and week_start <= c.claimed_at < week_end
            ]

            rewards_claimed = len([c for c in week_claims if c.status.value in ["approved", "consumed"]])

            # Build the report
            report = {
                "child_id": child_id,
                "child_name": child.name,
                "week_start": week_start.isoformat(),
                "week_end": week_end.isoformat(),
                "tasks": {
                    "total": total_tasks,
                    "completed": tasks_completed,
                    "pending": tasks_pending,
                    "refused": tasks_refused,
                    "completion_rate": round(completion_rate, 2),
                },
                "habits": habit_completions,
                "points": {
                    "earned": points_earned,
                    "spent": points_spent,
                    "net": points_earned - points_spent,
                },
                "coins_earned": coins_earned,
                "xp_earned": xp_earned,
                "rewards_claimed": rewards_claimed,
                "current_status": {
                    "points": child.points,
                    "coins": child.coins,
                    "level": child.level,
                    "xp": child.experience,
                },
            }

            _LOGGER.debug(f"Service call: get_weekly_report for {child.name} (week {weeks_ago} ago)")

            return {"report": report}

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in get_weekly_report: {err}")
            raise HomeAssistantError(f"Failed to get weekly report: {err}")

    async def handle_compare_children(call: ServiceCall):
        """Service: Comparer les performances de plusieurs enfants.

        Paramètres:
        - child_ids (list): Liste des IDs d'enfants à comparer
        - period (str, optional): Période de comparaison (week, month, all_time)
        """
        try:
            child_ids = call.data["child_ids"]
            period = call.data.get("period", "all_time")

            if not isinstance(child_ids, list) or len(child_ids) < 2:
                raise ValidationError("At least 2 child IDs are required for comparison")

            child_mgr = hass.data[DOMAIN]["child_manager"]
            task_mgr = hass.data[DOMAIN]["task_manager"]
            habit_mgr = hass.data[DOMAIN]["habit_manager"]

            # Determine date range based on period
            from datetime import datetime, timedelta
            now = datetime.now()
            date_from = None

            if period == "week":
                date_from = now - timedelta(days=7)
            elif period == "month":
                date_from = now - timedelta(days=30)

            # Collect stats for each child
            children_stats = []

            for child_id in child_ids:
                try:
                    child = await child_mgr.get_child(child_id)

                    # Get task instances
                    instances = await task_mgr.get_task_instances(child_id=child_id)
                    if date_from:
                        instances = [i for i in instances if i.completion_date and i.completion_date >= date_from]

                    tasks_completed = len([i for i in instances if i.status.value == "validated"])
                    total_tasks = len(instances)
                    completion_rate = (tasks_completed / total_tasks * 100) if total_tasks > 0 else 0

                    # Get habits
                    habits = await habit_mgr.get_habits(child_id=child_id)
                    total_streak = sum(h.current_streak for h in habits)

                    # Points from history
                    history = child.points_history
                    if date_from:
                        history = [h for h in history if h.timestamp >= date_from]

                    points_earned = sum(h.points_delta for h in history if h.points_delta > 0)

                    children_stats.append({
                        "child_id": child_id,
                        "child_name": child.name,
                        "level": child.level,
                        "points": child.points,
                        "coins": child.coins,
                        "tasks_completed": tasks_completed,
                        "total_tasks": total_tasks,
                        "completion_rate": round(completion_rate, 2),
                        "total_streak": total_streak,
                        "points_earned": points_earned,
                    })

                except ChildNotFoundError:
                    _LOGGER.warning(f"Child {child_id} not found, skipping")
                    continue

            # Sort by level descending
            children_stats.sort(key=lambda x: x["level"], reverse=True)

            # Add rankings
            for idx, stats in enumerate(children_stats):
                stats["rank"] = idx + 1

            comparison = {
                "period": period,
                "children_count": len(children_stats),
                "children": children_stats,
            }

            _LOGGER.debug(f"Service call: compare_children ({len(children_stats)} children, period: {period})")

            return {"comparison": comparison}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in compare_children: {err}")
            raise HomeAssistantError(f"Failed to compare children: {err}")

    async def handle_consume_claim(call: ServiceCall):
        """Service: Marquer une réclamation comme consommée.

        Paramètres:
        - claim_id (str): ID de la réclamation
        """
        try:
            claim_id = call.data["claim_id"]

            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Récupérer la réclamation
            claim = await reward_mgr.get_claim(claim_id)

            # Vérifier que la réclamation est approuvée
            if claim.status.value != "approved":
                raise ValidationError(f"Cannot consume claim with status {claim.status.value}")

            # Marquer comme consommée
            claim = await reward_mgr.consume_claim(claim_id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "claim_consumed",
                "claim_id": claim.id,
                "child_id": claim.child_id,
                "reward_id": claim.reward_id,
            })

            _LOGGER.info(f"Service call: Claim consumed - {claim_id}")

            return {"claim": claim.to_dict()}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in consume_claim: {err}")
            raise HomeAssistantError(f"Failed to consume claim: {err}")

    async def handle_update_reward(call: ServiceCall):
        """Service: Mettre à jour une récompense existante.

        Paramètres:
        - reward_id (str): ID de la récompense
        - title, description, cost_points, cost_coins, image_url, active (optionnels)
        """
        try:
            reward_id = call.data["reward_id"]

            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Récupérer les champs à mettre à jour
            updates = {}
            if "title" in call.data:
                updates["title"] = call.data["title"]
            if "description" in call.data:
                updates["description"] = call.data["description"]
            if "cost_points" in call.data:
                updates["cost_points"] = call.data["cost_points"]
            if "cost_coins" in call.data:
                updates["cost_coins"] = call.data["cost_coins"]
            if "image_url" in call.data:
                updates["image_url"] = call.data["image_url"]
            if "active" in call.data:
                updates["active"] = call.data["active"]

            # Mettre à jour la récompense
            reward = await reward_mgr.update_reward(reward_id, **updates)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "reward_updated",
                "reward_id": reward.id,
            })

            _LOGGER.info(f"Service call: Reward updated - {reward.title}")

            return {"reward": reward.to_dict()}

        except Exception as err:
            _LOGGER.error(f"Error in update_reward: {err}")
            raise HomeAssistantError(f"Failed to update reward: {err}")

    async def handle_delete_reward(call: ServiceCall):
        """Service: Supprimer une récompense.

        Paramètres:
        - reward_id (str): ID de la récompense
        """
        try:
            reward_id = call.data["reward_id"]

            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Supprimer la récompense
            await reward_mgr.delete_reward(reward_id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "reward_deleted",
                "reward_id": reward_id,
            })

            _LOGGER.info(f"Service call: Reward deleted - {reward_id}")

            return {"reward_id": reward_id, "deleted": True}

        except Exception as err:
            _LOGGER.error(f"Error in delete_reward: {err}")
            raise HomeAssistantError(f"Failed to delete reward: {err}")

    async def handle_reset_streak(call: ServiceCall):
        """Service: Réinitialiser le streak d'une habitude.

        Paramètres:
        - habit_id (str): ID de l'habitude
        """
        try:
            habit_id = call.data["habit_id"]

            habit_mgr = hass.data[DOMAIN]["habit_manager"]

            # Réinitialiser le streak
            habit = await habit_mgr.reset_streak(habit_id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "habit_streak_reset",
                "habit_id": habit.id,
            })

            _LOGGER.info(f"Service call: Habit streak reset - {habit.title}")

            return {
                "habit_id": habit.id,
                "current_streak": habit.current_streak,
                "best_streak": habit.best_streak,
            }

        except Exception as err:
            _LOGGER.error(f"Error in reset_streak: {err}")
            raise HomeAssistantError(f"Failed to reset streak: {err}")

    async def handle_get_habit_history(call: ServiceCall):
        """Service: Récupérer l'historique des complétions d'une habitude.

        Paramètres:
        - habit_id (str): ID de l'habitude
        - limit (int, optional): Nombre max d'entrées (défaut 30)
        """
        try:
            habit_id = call.data["habit_id"]
            limit = call.data.get("limit", 30)

            habit_mgr = hass.data[DOMAIN]["habit_manager"]

            # Récupérer l'historique
            history = await habit_mgr.get_habit_history(habit_id, limit=limit)

            _LOGGER.debug(f"Service call: get_habit_history returned {len(history)} entries")

            return {"history": history}

        except Exception as err:
            _LOGGER.error(f"Error in get_habit_history: {err}")
            raise HomeAssistantError(f"Failed to get habit history: {err}")

    async def handle_list_owned_cosmetics(call: ServiceCall):
        """Service: Lister les cosmétiques possédés par un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - equipped_only (bool, optional): Filtrer uniquement les cosmétiques équipés
        """
        try:
            child_id = call.data["child_id"]
            equipped_only = call.data.get("equipped_only", False)

            child_mgr = hass.data[DOMAIN]["child_manager"]
            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Récupérer l'enfant
            child = await child_mgr.get_child(child_id)

            # Récupérer tous les cosmétiques
            all_cosmetics = await cosmetic_mgr.get_all_cosmetics()

            # Filtrer les cosmétiques possédés
            owned_cosmetics = [
                c for c in all_cosmetics
                if c.id in child.owned_cosmetics
            ]

            # Filtrer par équipés si demandé
            if equipped_only:
                owned_cosmetics = [
                    c for c in owned_cosmetics
                    if c.id in child.equipped_cosmetics
                ]

            # Convertir en dictionnaires et ajouter le statut équipé
            cosmetics_data = []
            for cosmetic in owned_cosmetics:
                cosmetic_dict = cosmetic.to_dict()
                cosmetic_dict["equipped"] = cosmetic.id in child.equipped_cosmetics
                cosmetics_data.append(cosmetic_dict)

            _LOGGER.debug(f"Service call: list_owned_cosmetics for {child.name} returned {len(cosmetics_data)} cosmetics")

            return {"cosmetics": cosmetics_data}

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in list_owned_cosmetics: {err}")
            raise HomeAssistantError(f"Failed to list owned cosmetics: {err}")

    async def handle_update_cosmetic(call: ServiceCall):
        """Service: Mettre à jour un cosmétique existant.

        Paramètres:
        - cosmetic_id (str): ID du cosmétique
        - name, description, category, subcategory, rarity, cost_coins, image_url, active (optionnels)
        """
        try:
            cosmetic_id = call.data["cosmetic_id"]

            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Récupérer les champs à mettre à jour
            updates = {}
            if "name" in call.data:
                updates["name"] = call.data["name"]
            if "description" in call.data:
                updates["description"] = call.data["description"]
            if "category" in call.data:
                updates["category"] = call.data["category"]
            if "subcategory" in call.data:
                updates["subcategory"] = call.data["subcategory"]
            if "rarity" in call.data:
                updates["rarity"] = call.data["rarity"]
            if "cost_coins" in call.data:
                updates["cost_coins"] = call.data["cost_coins"]
            if "image_url" in call.data:
                updates["image_url"] = call.data["image_url"]
            if "active" in call.data:
                updates["active"] = call.data["active"]

            # Mettre à jour le cosmétique
            cosmetic = await cosmetic_mgr.update_cosmetic(cosmetic_id, **updates)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_updated",
                "cosmetic_id": cosmetic.id,
            })

            _LOGGER.info(f"Service call: Cosmetic updated - {cosmetic.name}")

            return {"cosmetic": cosmetic.to_dict()}

        except Exception as err:
            _LOGGER.error(f"Error in update_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to update cosmetic: {err}")

    async def handle_delete_cosmetic(call: ServiceCall):
        """Service: Supprimer un cosmétique.

        Paramètres:
        - cosmetic_id (str): ID du cosmétique
        """
        try:
            cosmetic_id = call.data["cosmetic_id"]

            cosmetic_mgr = hass.data[DOMAIN]["cosmetic_manager"]

            # Supprimer le cosmétique
            await cosmetic_mgr.delete_cosmetic(cosmetic_id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "cosmetic_deleted",
                "cosmetic_id": cosmetic_id,
            })

            _LOGGER.info(f"Service call: Cosmetic deleted - {cosmetic_id}")

            return {"cosmetic_id": cosmetic_id, "deleted": True}

        except Exception as err:
            _LOGGER.error(f"Error in delete_cosmetic: {err}")
            raise HomeAssistantError(f"Failed to delete cosmetic: {err}")

    async def handle_cancel_task_instance(call: ServiceCall):
        """Service: Annuler une instance de tâche.

        Paramètres:
        - instance_id (str): ID de l'instance
        - reason (str, optional): Raison de l'annulation
        """
        try:
            instance_id = call.data["instance_id"]
            reason = call.data.get("reason", "Instance annulée")

            task_mgr = hass.data[DOMAIN]["task_manager"]

            # Récupérer l'instance
            instance = await task_mgr.get_task_instance(instance_id)

            # Vérifier que l'instance peut être annulée
            if instance.status.value in ["validated", "refused"]:
                raise ValidationError(f"Cannot cancel instance with status {instance.status.value}")

            # Annuler l'instance
            instance = await task_mgr.cancel_task_instance(instance_id, reason)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_instance_cancelled",
                "instance_id": instance.id,
                "task_id": instance.task_id,
                "child_id": instance.child_id,
            })

            _LOGGER.info(f"Service call: Task instance cancelled - {instance_id}")

            return {"instance": instance.to_dict()}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in cancel_task_instance: {err}")
            raise HomeAssistantError(f"Failed to cancel task instance: {err}")

    async def handle_reschedule_task_instance(call: ServiceCall):
        """Service: Replanifier une instance de tâche.

        Paramètres:
        - instance_id (str): ID de l'instance
        - new_date (str): Nouvelle date (format ISO 8601)
        """
        try:
            instance_id = call.data["instance_id"]
            new_date_str = call.data["new_date"]

            task_mgr = hass.data[DOMAIN]["task_manager"]

            # Convertir la date
            from datetime import datetime
            new_date = datetime.fromisoformat(new_date_str).date()

            # Récupérer l'instance
            instance = await task_mgr.get_task_instance(instance_id)

            # Vérifier que l'instance peut être replanifiée
            if instance.status.value in ["validated", "refused", "cancelled"]:
                raise ValidationError(f"Cannot reschedule instance with status {instance.status.value}")

            # Replanifier l'instance
            instance = await task_mgr.reschedule_task_instance(instance_id, new_date)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "task_instance_rescheduled",
                "instance_id": instance.id,
                "task_id": instance.task_id,
                "child_id": instance.child_id,
                "new_date": new_date.isoformat(),
            })

            _LOGGER.info(f"Service call: Task instance rescheduled - {instance_id} to {new_date}")

            return {"instance": instance.to_dict()}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in reschedule_task_instance: {err}")
            raise HomeAssistantError(f"Failed to reschedule task instance: {err}")

    async def handle_add_experience(call: ServiceCall):
        """Service: Ajouter de l'expérience manuellement à un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - xp (int): Quantité d'XP à ajouter
        - reason (str, optional): Raison de l'ajout
        """
        try:
            child_id = call.data["child_id"]
            xp = call.data["xp"]
            reason = call.data.get("reason", "Ajout manuel d'expérience")

            child_mgr = hass.data[DOMAIN]["child_manager"]

            # Ajouter l'XP (cela peut faire monter de niveau automatiquement)
            child = await child_mgr.add_currency_manual(child_id, points=0, coins=0, xp=xp, reason=reason)

            _LOGGER.info(f"Service call: add_experience - {xp} XP for {child.name} (now level {child.level})")

            return {
                "child_id": child.id,
                "xp_added": xp,
                "total_xp": child.experience,
                "level": child.level,
                "xp_for_next_level": child.xp_for_next_level,
            }

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in add_experience: {err}")
            raise HomeAssistantError(f"Failed to add experience: {err}")

    async def handle_set_level(call: ServiceCall):
        """Service: Définir directement le niveau d'un enfant.

        Paramètres:
        - child_id (str): ID de l'enfant
        - level (int): Nouveau niveau
        - reason (str, optional): Raison du changement
        """
        try:
            child_id = call.data["child_id"]
            new_level = call.data["level"]
            reason = call.data.get("reason", "Ajustement manuel du niveau")

            child_mgr = hass.data[DOMAIN]["child_manager"]

            # Récupérer l'enfant
            child = await child_mgr.get_child(child_id)

            # Définir le niveau directement
            child = await child_mgr.set_level(child_id, new_level, reason=reason)

            _LOGGER.info(f"Service call: set_level - {child.name} set to level {new_level}")

            return {
                "child_id": child.id,
                "previous_level": child.level if hasattr(child, 'previous_level') else None,
                "new_level": child.level,
                "xp": child.experience,
                "xp_for_next_level": child.xp_for_next_level,
            }

        except ChildNotFoundError as err:
            _LOGGER.error(f"Child not found: {err}")
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in set_level: {err}")
            raise HomeAssistantError(f"Failed to set level: {err}")

    # ========================================================================
    # CONFIGURATION SYSTÈME
    # ========================================================================

    async def handle_create_category(call: ServiceCall):
        """Service: Créer une catégorie personnalisée.

        Paramètres:
        - name (str): Nom de la catégorie
        - type (str): Type (task, habit, reward)
        - icon (str, optional): Emoji/icône
        - color (str, optional): Couleur hex

        Retourne les détails de la catégorie créée.
        """
        try:
            name = call.data["name"]
            category_type = call.data["type"]
            icon = call.data.get("icon")
            color = call.data.get("color")

            # Valider le type
            valid_types = ["task", "habit", "reward"]
            if category_type not in valid_types:
                raise ValidationError(f"Invalid type. Must be one of: {', '.join(valid_types)}")

            # Charger les catégories existantes
            from homeassistant.util.json import load_json, save_json
            from pathlib import Path

            storage_path = Path(hass.config.path(STORAGE_DIR))
            categories_file = storage_path / FILE_CATEGORIES

            # Créer le répertoire si nécessaire
            storage_path.mkdir(parents=True, exist_ok=True)

            # Charger ou initialiser les catégories
            if categories_file.exists():
                categories = await hass.async_add_executor_job(load_json, str(categories_file))
            else:
                categories = []

            # Générer un ID unique
            import uuid
            category_id = str(uuid.uuid4())

            # Créer la nouvelle catégorie
            new_category = {
                "id": category_id,
                "name": name,
                "type": category_type,
                "icon": icon,
                "color": color,
                "created_at": datetime.now().isoformat()
            }

            categories.append(new_category)

            # Sauvegarder
            await hass.async_add_executor_job(save_json, str(categories_file), categories)

            _LOGGER.info(f"Category created: {category_id} - {name}")

            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "category_created",
                "category_id": category_id,
                "name": name,
                "type": category_type,
            })

            return {"category": new_category}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in create_category: {err}")
            raise HomeAssistantError(f"Failed to create category: {err}")

    async def handle_list_categories(call: ServiceCall):
        """Service: Lister toutes les catégories disponibles.

        Paramètres:
        - type (str, optional): Filtrer par type (task, habit, reward)

        Retourne la liste des catégories (built-in + personnalisées).
        """
        try:
            filter_type = call.data.get("type")

            # Catégories intégrées (built-in)
            builtin_categories = {
                "task": [
                    {"id": "chores", "name": "Tâches ménagères", "type": "task", "builtin": True},
                    {"id": "homework", "name": "Devoirs", "type": "task", "builtin": True},
                    {"id": "personal", "name": "Personnel", "type": "task", "builtin": True},
                    {"id": "other", "name": "Autre", "type": "task", "builtin": True},
                ],
                "habit": [
                    {"id": "health", "name": "Santé", "type": "habit", "builtin": True},
                    {"id": "education", "name": "Éducation", "type": "habit", "builtin": True},
                    {"id": "social", "name": "Social", "type": "habit", "builtin": True},
                ],
                "reward": [
                    {"id": "entertainment", "name": "Divertissement", "type": "reward", "builtin": True},
                    {"id": "treats", "name": "Friandises", "type": "reward", "builtin": True},
                    {"id": "privileges", "name": "Privilèges", "type": "reward", "builtin": True},
                ]
            }

            # Charger les catégories personnalisées
            from homeassistant.util.json import load_json
            from pathlib import Path

            storage_path = Path(hass.config.path(STORAGE_DIR))
            categories_file = storage_path / FILE_CATEGORIES

            custom_categories = []
            if categories_file.exists():
                custom_categories = await hass.async_add_executor_job(load_json, str(categories_file))

            # Combiner les catégories
            all_categories = []

            # Ajouter les built-in selon le filtre
            if filter_type:
                if filter_type in builtin_categories:
                    all_categories.extend(builtin_categories[filter_type])
            else:
                for cats in builtin_categories.values():
                    all_categories.extend(cats)

            # Ajouter les personnalisées selon le filtre
            for cat in custom_categories:
                if not filter_type or cat.get("type") == filter_type:
                    cat["builtin"] = False
                    all_categories.append(cat)

            return {
                "categories": all_categories,
                "count": len(all_categories)
            }

        except Exception as err:
            _LOGGER.error(f"Error in list_categories: {err}")
            raise HomeAssistantError(f"Failed to list categories: {err}")

    async def handle_update_level_config(call: ServiceCall):
        """Service: Configurer les seuils de niveau et d'expérience.

        Paramètres:
        - level (int): Niveau à configurer
        - xp_required (int): XP requise pour atteindre ce niveau
        - unlock_message (str, optional): Message de déblocage personnalisé

        Retourne la configuration mise à jour.
        """
        try:
            level = call.data["level"]
            xp_required = call.data["xp_required"]
            unlock_message = call.data.get("unlock_message")

            if level < 2:
                raise ValidationError("Level must be 2 or higher (level 1 is default)")

            if xp_required < 1:
                raise ValidationError("XP required must be positive")

            # Charger la config système
            from homeassistant.util.json import load_json, save_json
            from pathlib import Path

            storage_path = Path(hass.config.path(STORAGE_DIR))
            config_file = storage_path / FILE_SYSTEM_CONFIG

            storage_path.mkdir(parents=True, exist_ok=True)

            # Charger ou initialiser
            if config_file.exists():
                system_config = await hass.async_add_executor_job(load_json, str(config_file))
            else:
                system_config = {
                    "max_level": 100,
                    "xp_multiplier": XP_MULTIPLIER_PER_LEVEL,
                    "level_thresholds": []
                }

            # Trouver et mettre à jour ou ajouter le seuil
            level_thresholds = system_config.get("level_thresholds", [])

            threshold_found = False
            for threshold in level_thresholds:
                if threshold["level"] == level:
                    threshold["xp_required"] = xp_required
                    if unlock_message:
                        threshold["unlock_message"] = unlock_message
                    threshold_found = True
                    break

            if not threshold_found:
                new_threshold = {
                    "level": level,
                    "xp_required": xp_required
                }
                if unlock_message:
                    new_threshold["unlock_message"] = unlock_message
                level_thresholds.append(new_threshold)

                # Trier par niveau
                level_thresholds.sort(key=lambda x: x["level"])

            system_config["level_thresholds"] = level_thresholds
            system_config["last_updated"] = datetime.now().isoformat()

            # Sauvegarder
            await hass.async_add_executor_job(save_json, str(config_file), system_config)

            _LOGGER.info(f"Level config updated: Level {level} requires {xp_required} XP")

            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "level_config_updated",
                "level": level,
                "xp_required": xp_required,
            })

            return {"config": system_config}

        except ValidationError as err:
            _LOGGER.error(f"Validation error: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in update_level_config: {err}")
            raise HomeAssistantError(f"Failed to update level config: {err}")

    async def handle_get_system_config(call: ServiceCall):
        """Service: Récupérer la configuration système actuelle.

        Retourne la configuration complète du système.
        """
        try:
            from homeassistant.util.json import load_json
            from pathlib import Path

            storage_path = Path(hass.config.path(STORAGE_DIR))
            config_file = storage_path / FILE_SYSTEM_CONFIG

            # Charger ou retourner config par défaut
            if config_file.exists():
                system_config = await hass.async_add_executor_job(load_json, str(config_file))
            else:
                system_config = {
                    "max_level": 100,
                    "xp_multiplier": XP_MULTIPLIER_PER_LEVEL,
                    "base_xp": BASE_XP_FOR_LEVEL_UP,
                    "level_thresholds": [],
                    "rarity_costs": RARITY_COST
                }

            return {"config": system_config}

        except Exception as err:
            _LOGGER.error(f"Error in get_system_config: {err}")
            raise HomeAssistantError(f"Failed to get system config: {err}")


    async def handle_backup_data(call: ServiceCall):
        """Service: Créer un backup complet des données.

        Paramètres:
        - include_history (bool, optional): Inclure l'historique des points (défaut: true)
        - include_cosmetics (bool, optional): Inclure les cosmétiques possédés (défaut: true)

        Retourne un dictionnaire avec toutes les données du système.
        """
        try:
            backup_mgr = hass.data[DOMAIN]["backup_manager"]

            include_history = call.data.get("include_history", True)
            include_cosmetics = call.data.get("include_cosmetics", True)

            # Créer le backup
            backup = await backup_mgr.create_backup(
                include_history=include_history,
                include_cosmetics=include_cosmetics
            )

            _LOGGER.info(
                f"Service call: backup_data created successfully "
                f"({backup['metadata']['children_count']} children, "
                f"{backup['metadata']['tasks_count']} tasks)"
            )

            return backup

        except Exception as err:
            _LOGGER.error(f"Error in backup_data: {err}")
            raise HomeAssistantError(f"Failed to create backup: {err}")

    async def handle_restore_data(call: ServiceCall):
        """Service: Restaurer les données depuis un backup.

        Paramètres:
        - backup_data (dict): Données du backup à restaurer
        - merge_strategy (str, optional): Stratégie de fusion (overwrite|merge|skip, défaut: overwrite)
            - overwrite: Écrase toutes les données existantes
            - merge: Fusionne avec les données existantes (garde les plus récentes)
            - skip: Ignore les conflits (garde les données existantes)

        Retourne les statistiques de restauration.
        """
        try:
            backup_mgr = hass.data[DOMAIN]["backup_manager"]

            backup_data = call.data.get("backup_data")
            if not backup_data:
                raise HomeAssistantError("backup_data is required")

            merge_strategy = call.data.get("merge_strategy", "overwrite")

            # Restaurer le backup
            stats = await backup_mgr.restore_backup(
                backup_data=backup_data,
                merge_strategy=merge_strategy
            )

            _LOGGER.info(
                f"Service call: restore_data completed "
                f"({stats['children_restored']} children, "
                f"{stats['tasks_restored']} tasks restored, "
                f"{stats['skipped']} skipped)"
            )

            return stats

        except ValidationError as err:
            _LOGGER.error(f"Backup validation error: {err}")
            raise HomeAssistantError(f"Invalid backup data: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in restore_data: {err}")
            raise HomeAssistantError(f"Failed to restore backup: {err}")

    async def handle_suspend_task(call: ServiceCall):
        """Service: Suspendre une tâche."""
        try:
            task_id = call.data["task_id"]
            until_str = call.data.get("until")
            reason = call.data.get("reason", "")

            until = None
            if until_str:
                until = datetime.fromisoformat(until_str)

            task = await task_mgr.suspend_task(task_id, until, reason)

            _LOGGER.info(f"Service call: suspend_task - {task.title}")
            return {"task_id": task.id, "suspended": task.suspended}

        except TaskNotFoundError as err:
            raise HomeAssistantError(f"Task not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in suspend_task: {err}")
            raise HomeAssistantError(f"Failed to suspend task: {err}")

    async def handle_resume_task(call: ServiceCall):
        """Service: Lever la suspension d'une tâche."""
        try:
            task_id = call.data["task_id"]

            task = await task_mgr.resume_task(task_id)

            _LOGGER.info(f"Service call: resume_task - {task.title}")
            return {"task_id": task.id, "suspended": task.suspended}

        except TaskNotFoundError as err:
            raise HomeAssistantError(f"Task not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in resume_task: {err}")
            raise HomeAssistantError(f"Failed to resume task: {err}")

    async def handle_check_expired_suspensions(call: ServiceCall):
        """Service: Vérifier et lever les suspensions expirées."""
        try:
            resumed_tasks = await task_mgr.check_expired_suspensions()

            _LOGGER.info(f"Service call: check_expired_suspensions - {len(resumed_tasks)} tasks resumed")
            return {
                "resumed_count": len(resumed_tasks),
                "resumed_tasks": [{"id": t.id, "title": t.title} for t in resumed_tasks]
            }

        except Exception as err:
            _LOGGER.error(f"Error in check_expired_suspensions: {err}")
            raise HomeAssistantError(f"Failed to check expired suspensions: {err}")


    async def handle_add_points(call: ServiceCall):
        """Service: Ajouter des points manuellement."""
        try:
            child_id = call.data["child_id"]
            points = call.data["points"]
            reason = call.data.get("reason", "Ajustement manuel de points")
            
            child = await child_mgr.add_currency_manual(child_id, points=points, coins=0, reason=reason)
            _LOGGER.info(f"Service call: add_points - {points} points for {child.name}")
            return {"child_id": child.id, "points": child.points}
        except ChildNotFoundError as err:
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in add_points: {err}")
            raise HomeAssistantError(f"Failed to add points: {err}")

    async def handle_remove_points(call: ServiceCall):
        """Service: Retirer des points manuellement."""
        try:
            child_id = call.data["child_id"]
            points = call.data["points"]
            reason = call.data.get("reason", "Retrait manuel de points")
            
            child = await child_mgr.add_currency_manual(child_id, points=-points, coins=0, reason=reason)
            _LOGGER.info(f"Service call: remove_points - {points} points for {child.name}")
            return {"child_id": child.id, "points": child.points}
        except ChildNotFoundError as err:
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in remove_points: {err}")
            raise HomeAssistantError(f"Failed to remove points: {err}")

    async def handle_add_coins(call: ServiceCall):
        """Service: Ajouter des pièces manuellement."""
        try:
            child_id = call.data["child_id"]
            coins = call.data["coins"]
            reason = call.data.get("reason", "Ajustement manuel de pièces")
            
            child = await child_mgr.add_currency_manual(child_id, points=0, coins=coins, reason=reason)
            _LOGGER.info(f"Service call: add_coins - {coins} coins for {child.name}")
            return {"child_id": child.id, "coins": child.coins}
        except ChildNotFoundError as err:
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in add_coins: {err}")
            raise HomeAssistantError(f"Failed to add coins: {err}")

    async def handle_remove_coins(call: ServiceCall):
        """Service: Retirer des pièces manuellement."""
        try:
            child_id = call.data["child_id"]
            coins = call.data["coins"]
            reason = call.data.get("reason", "Retrait manuel de pièces")

            child = await child_mgr.add_currency_manual(child_id, points=0, coins=-coins, reason=reason)
            _LOGGER.info(f"Service call: remove_coins - {coins} coins for {child.name}")
            return {"child_id": child.id, "coins": child.coins}
        except ChildNotFoundError as err:
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in remove_coins: {err}")
            raise HomeAssistantError(f"Failed to remove coins: {err}")

    async def handle_set_points(call: ServiceCall):
        """Service: Définir les points d'un enfant."""
        try:
            child_id = call.data["child_id"]
            points = call.data["points"]
            reason = call.data.get("reason", "Définition manuelle des points")

            child = await child_mgr.get_child(child_id)
            delta = points - child.points
            child = await child_mgr.add_currency_manual(child_id, points=delta, coins=0, reason=reason)
            _LOGGER.info(f"Service call: set_points - set to {points} points for {child.name}")
            return {"child_id": child.id, "points": child.points}
        except ChildNotFoundError as err:
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in set_points: {err}")
            raise HomeAssistantError(f"Failed to set points: {err}")

    async def handle_set_coins(call: ServiceCall):
        """Service: Définir les pièces d'un enfant."""
        try:
            child_id = call.data["child_id"]
            coins = call.data["coins"]
            reason = call.data.get("reason", "Définition manuelle des pièces")

            child = await child_mgr.get_child(child_id)
            delta = coins - child.coins
            child = await child_mgr.add_currency_manual(child_id, points=0, coins=delta, reason=reason)
            _LOGGER.info(f"Service call: set_coins - set to {coins} coins for {child.name}")
            return {"child_id": child.id, "coins": child.coins}
        except ChildNotFoundError as err:
            raise HomeAssistantError(f"Child not found: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in set_coins: {err}")
            raise HomeAssistantError(f"Failed to set coins: {err}")

    async def handle_reset_daily_tasks(call: ServiceCall):
        """Service: Réinitialiser toutes les tâches quotidiennes."""
        try:
            count = await task_mgr.reset_tasks_by_schedule("daily")
            _LOGGER.info(f"Service call: reset_daily_tasks - {count} instances reset")
            return {"reset_count": count}
        except Exception as err:
            _LOGGER.error(f"Error in reset_daily_tasks: {err}")
            raise HomeAssistantError(f"Failed to reset daily tasks: {err}")

    async def handle_reset_weekly_tasks(call: ServiceCall):
        """Service: Réinitialiser toutes les tâches hebdomadaires."""
        try:
            count = await task_mgr.reset_tasks_by_schedule("weekly")
            _LOGGER.info(f"Service call: reset_weekly_tasks - {count} instances reset")
            return {"reset_count": count}
        except Exception as err:
            _LOGGER.error(f"Error in reset_weekly_tasks: {err}")
            raise HomeAssistantError(f"Failed to reset weekly tasks: {err}")

    async def handle_reset_monthly_tasks(call: ServiceCall):
        """Service: Réinitialiser toutes les tâches mensuelles."""
        try:
            count = await task_mgr.reset_tasks_by_schedule("monthly")
            _LOGGER.info(f"Service call: reset_monthly_tasks - {count} instances reset")
            return {"reset_count": count}
        except Exception as err:
            _LOGGER.error(f"Error in reset_monthly_tasks: {err}")
            raise HomeAssistantError(f"Failed to reset monthly tasks: {err}")

    async def handle_clear_all_data(call: ServiceCall):
        """Service: Effacer TOUTES les données (DESTRUCTIF)."""
        try:
            confirm = call.data.get("confirm", False)
            if not confirm:
                raise HomeAssistantError("Must set confirm=true to clear all data")
            
            # Supprimer tous les enfants (cascade)
            children = await storage.load_children()
            for child in children:
                await child_mgr.delete_child(child.id)
            
            # Supprimer toutes les tâches
            tasks = await storage.load_tasks()
            for task in tasks:
                await task_mgr.delete_task(task.id)
            
            # Supprimer toutes les habitudes
            habits = await storage.load_habits()
            for habit in habits:
                await habit_mgr.delete_habit(habit.id)
            
            _LOGGER.warning("Service call: clear_all_data - ALL DATA DELETED")
            return {"status": "all_data_cleared"}
        except Exception as err:
            _LOGGER.error(f"Error in clear_all_data: {err}")
            raise HomeAssistantError(f"Failed to clear data: {err}")
    # Enregistrer tous les services
    hass.services.async_register(DOMAIN, SERVICE_CREATE_CHILD, handle_create_child)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_CHILD, handle_update_child)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_CHILD, handle_delete_child)

    hass.services.async_register(DOMAIN, SERVICE_CREATE_TASK, handle_create_task)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_TASK, handle_update_task)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_TASK, handle_delete_task)
    hass.services.async_register(DOMAIN, SERVICE_MARK_TASK_COMPLETED, handle_mark_task_completed)

    hass.services.async_register(DOMAIN, SERVICE_CREATE_HABIT, handle_create_habit)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_HABIT, handle_update_habit)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_HABIT, handle_delete_habit)
    hass.services.async_register(DOMAIN, SERVICE_MARK_HABIT_COMPLETED, handle_mark_habit_completed)
    hass.services.async_register(DOMAIN, SERVICE_RESET_STREAK, handle_reset_streak, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_HABIT_HISTORY, handle_get_habit_history, supports_response=SupportsResponse.ONLY)

    # Phase 2 services
    hass.services.async_register(DOMAIN, SERVICE_VALIDATE_TASK, handle_validate_task)
    hass.services.async_register(DOMAIN, SERVICE_REFUSE_TASK, handle_refuse_task)
    hass.services.async_register(DOMAIN, SERVICE_CREATE_REWARD, handle_create_reward)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_REWARD, handle_update_reward, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_REWARD, handle_delete_reward, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CLAIM_REWARD, handle_claim_reward)
    hass.services.async_register(DOMAIN, SERVICE_APPROVE_CLAIM, handle_approve_claim)
    hass.services.async_register(DOMAIN, SERVICE_REFUSE_CLAIM, handle_refuse_claim, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CONSUME_CLAIM, handle_consume_claim, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CREATE_COSMETIC, handle_create_cosmetic)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_COSMETIC, handle_update_cosmetic, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_COSMETIC, handle_delete_cosmetic, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_PURCHASE_COSMETIC, handle_purchase_cosmetic)
    hass.services.async_register(DOMAIN, SERVICE_EQUIP_COSMETIC, handle_equip_cosmetic, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_UNEQUIP_COSMETIC, handle_unequip_cosmetic, supports_response=SupportsResponse.ONLY)

    # Services de lecture (avec support de réponse)
    hass.services.async_register(DOMAIN, SERVICE_LIST_CHILDREN, handle_list_children, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_TASKS, handle_list_tasks, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_HABITS, handle_list_habits, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_REWARDS, handle_list_rewards, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_COSMETICS, handle_list_cosmetics, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_OWNED_COSMETICS, handle_list_owned_cosmetics, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_TASK_INSTANCES, handle_list_task_instances, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_CLAIMS, handle_list_claims, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_TASK_INSTANCE, handle_get_task_instance, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CANCEL_TASK_INSTANCE, handle_cancel_task_instance, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_RESCHEDULE_TASK_INSTANCE, handle_reschedule_task_instance, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_CHILD_STATS, handle_get_child_stats, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_WEEKLY_REPORT, handle_get_weekly_report, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_COMPARE_CHILDREN, handle_compare_children, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_POINTS_HISTORY, handle_get_points_history, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_CHILD_HISTORY, handle_get_points_history, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_BACKUP_DATA, handle_backup_data, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_RESTORE_DATA, handle_restore_data, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_SUSPEND_TASK, handle_suspend_task, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_RESUME_TASK, handle_resume_task, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CHECK_EXPIRED_SUSPENSIONS, handle_check_expired_suspensions, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_ADD_POINTS, handle_add_points, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_REMOVE_POINTS, handle_remove_points, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_SET_POINTS, handle_set_points, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_ADD_COINS, handle_add_coins, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_REMOVE_COINS, handle_remove_coins, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_SET_COINS, handle_set_coins, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_ADD_EXPERIENCE, handle_add_experience, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_SET_LEVEL, handle_set_level, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CREATE_CATEGORY, handle_create_category, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_CATEGORIES, handle_list_categories, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_LEVEL_CONFIG, handle_update_level_config, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_GET_SYSTEM_CONFIG, handle_get_system_config, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_RESET_DAILY_TASKS, handle_reset_daily_tasks, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_RESET_WEEKLY_TASKS, handle_reset_weekly_tasks, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_RESET_MONTHLY_TASKS, handle_reset_monthly_tasks, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_CLEAR_ALL_DATA, handle_clear_all_data, supports_response=SupportsResponse.ONLY)
    SERVICE_RESET_DAILY_TASKS,
    SERVICE_RESET_WEEKLY_TASKS,
    SERVICE_RESET_MONTHLY_TASKS,
    SERVICE_CLEAR_ALL_DATA,
    SERVICE_ADD_POINTS,
    SERVICE_REMOVE_POINTS,
    SERVICE_ADD_COINS,
    SERVICE_REMOVE_COINS,
    SERVICE_RESET_DAILY_TASKS,
    SERVICE_RESET_WEEKLY_TASKS,
    SERVICE_RESET_MONTHLY_TASKS,
    SERVICE_CLEAR_ALL_DATA,
    SERVICE_SUSPEND_TASK,
    SERVICE_RESUME_TASK,
    SERVICE_CHECK_EXPIRED_SUSPENSIONS,
    SERVICE_ADD_POINTS,
    SERVICE_REMOVE_POINTS,
    SERVICE_ADD_COINS,
    SERVICE_REMOVE_COINS,
    SERVICE_RESET_DAILY_TASKS,
    SERVICE_RESET_WEEKLY_TASKS,
    SERVICE_RESET_MONTHLY_TASKS,
    SERVICE_CLEAR_ALL_DATA,
    SERVICE_BACKUP_DATA,
    SERVICE_RESTORE_DATA,
    SERVICE_SUSPEND_TASK,
    SERVICE_RESUME_TASK,
    SERVICE_CHECK_EXPIRED_SUSPENSIONS,
    SERVICE_ADD_POINTS,
    SERVICE_REMOVE_POINTS,
    SERVICE_ADD_COINS,
    SERVICE_REMOVE_COINS,
    SERVICE_RESET_DAILY_TASKS,
    SERVICE_RESET_WEEKLY_TASKS,
    SERVICE_RESET_MONTHLY_TASKS,
    SERVICE_CLEAR_ALL_DATA,
    SERVICE_GET_POINTS_HISTORY,
    SERVICE_BACKUP_DATA,
    SERVICE_RESTORE_DATA,
    SERVICE_SUSPEND_TASK,
    SERVICE_RESUME_TASK,
    SERVICE_CHECK_EXPIRED_SUSPENSIONS,
    SERVICE_ADD_POINTS,
    SERVICE_REMOVE_POINTS,
    SERVICE_ADD_COINS,
    SERVICE_REMOVE_COINS,
    SERVICE_RESET_DAILY_TASKS,
    SERVICE_RESET_WEEKLY_TASKS,
    SERVICE_RESET_MONTHLY_TASKS,
    SERVICE_CLEAR_ALL_DATA,

    _LOGGER.info(f"Registered {23} services for {DOMAIN} (11 Phase 1 + 7 Phase 2 + 5 Listing)")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload de l'intégration.

    Args:
        hass: Instance Home Assistant
        entry: Config entry

    Returns:
        True si succés
    """
    hass.data.pop(DOMAIN)
    return True
