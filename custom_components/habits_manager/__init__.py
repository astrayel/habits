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
    SERVICE_COMPLETE_HABIT,
    SERVICE_CREATE_REWARD,
    SERVICE_CLAIM_REWARD,
    SERVICE_APPROVE_CLAIM,
    SERVICE_CREATE_COSMETIC,
    SERVICE_PURCHASE_COSMETIC,
    SERVICE_LIST_CHILDREN,
    SERVICE_LIST_TASKS,
    SERVICE_LIST_HABITS,
    SERVICE_LIST_REWARDS,
    SERVICE_LIST_COSMETICS,
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

    async def handle_complete_habit(call: ServiceCall):
        """Service: ComplÃ©ter une habitude."""
        try:
            habit_id = call.data["habit_id"]
            child_id = call.data["child_id"]

            # Enregistrer la complÃ©tion
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
            _LOGGER.error(f"Error in complete_habit: {err}")
            raise HomeAssistantError(f"Failed to complete habit: {err}")

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
    hass.services.async_register(DOMAIN, SERVICE_COMPLETE_HABIT, handle_complete_habit)

    # Phase 2 services
    hass.services.async_register(DOMAIN, SERVICE_VALIDATE_TASK, handle_validate_task)
    hass.services.async_register(DOMAIN, SERVICE_REFUSE_TASK, handle_refuse_task)
    hass.services.async_register(DOMAIN, SERVICE_CREATE_REWARD, handle_create_reward)
    hass.services.async_register(DOMAIN, SERVICE_CLAIM_REWARD, handle_claim_reward)
    hass.services.async_register(DOMAIN, SERVICE_APPROVE_CLAIM, handle_approve_claim)
    hass.services.async_register(DOMAIN, SERVICE_CREATE_COSMETIC, handle_create_cosmetic)
    hass.services.async_register(DOMAIN, SERVICE_PURCHASE_COSMETIC, handle_purchase_cosmetic)

    # Services de lecture (avec support de réponse)
    hass.services.async_register(DOMAIN, SERVICE_LIST_CHILDREN, handle_list_children, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_TASKS, handle_list_tasks, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_HABITS, handle_list_habits, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_REWARDS, handle_list_rewards, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_LIST_COSMETICS, handle_list_cosmetics, supports_response=SupportsResponse.ONLY)
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
