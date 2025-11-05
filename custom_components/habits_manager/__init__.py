"""Habits Manager integration for Home Assistant.

This integration provides a gamified task and habit management system for children.
"""
from datetime import datetime, date
from homeassistant.core import HomeAssistant, ServiceCall
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
    SERVICE_UPDATE_REWARD,
    SERVICE_DELETE_REWARD,
    SERVICE_CLAIM_REWARD,
    SERVICE_APPROVE_CLAIM,
    SERVICE_CREATE_COSMETIC,
    SERVICE_UPDATE_COSMETIC,
    SERVICE_DELETE_COSMETIC,
)
from .storage.storage_manager import StorageManager
from .storage.entity_manager import EntityManager
from .managers.child_manager import ChildManager
from .managers.task_manager import TaskManager
from .managers.habit_manager import HabitManager
from .managers.validation_manager import ValidationManager
from .managers.reward_manager import RewardManager
from .managers.cosmetic_manager import CosmeticManager
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
    ValidationError,
)
from .sensor import async_create_child_sensors


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Setup de l'int�gration Habits Manager.

    Args:
        hass: Instance Home Assistant
        config: Configuration

    Returns:
        True si le setup r�ussit
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
        "scheduler": scheduler,
        "points_calculator": PointsCalculator(),
        "level_calculator": LevelCalculator(),
    }

    # Charger les enfants existants et cr�er leurs entit�s
    children = await child_mgr.get_all_children()
    for child in children:
        await entity_mgr.create_child_entities(child)

    _LOGGER.info(f"Loaded {len(children)} children")

    # G�n�rer les task instances pour aujourd'hui
    today = date.today()
    await task_mgr.generate_task_instances(today)

    # Enregistrer les services
    await register_services(hass)

    # Charger la plateforme sensor
    hass.async_create_task(
        discovery.async_load_platform(hass, "sensor", DOMAIN, {}, config)
    )

    _LOGGER.info("Habits Manager integration setup complete")
    _LOGGER.info(f"Registered {len(hass.services.async_services().get(DOMAIN, {}))} services for {DOMAIN}")

    return True


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
        """Service: Créer un enfant."""
        try:
            name = call.data["name"]
            person_entity = call.data["person_entity"]

            child = await child_mgr.create_child(name, person_entity)

            # Créer dynamiquement les sensors pour ce nouvel enfant
            await async_create_child_sensors(hass, child.id)

            # Émettre un événement
            hass.bus.fire(EVENT_UPDATE, {
                "update_type": "child_created",
                "child_id": child.id,
                "child_name": child.name,
            })

            _LOGGER.info(f"Service call: Child created - {child.name} with {8} sensors")

        except ValidationError as err:
            _LOGGER.error(f"Validation error in create_child: {err}")
            raise HomeAssistantError(f"Validation error: {err}")
        except Exception as err:
            _LOGGER.error(f"Error in create_child: {err}")
            raise HomeAssistantError(f"Failed to create child: {err}")

    async def handle_update_child(call: ServiceCall):
        """Service: Mettre � jour un enfant."""
        try:
            child_id = call.data["child_id"]
            child = await child_mgr.get_child(child_id)

            # Mettre � jour les champs fournis
            if "name" in call.data:
                child.name = call.data["name"]

            child = await child_mgr.update_child(child)

            # �mettre un �v�nement
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

            # �mettre un �v�nement
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
    # SERVICES T�CHES
    # ========================================================================

    async def handle_create_task(call: ServiceCall):
        """Service: Créer une tâche."""
        try:
            task_data = dict(call.data)
            task = await task_mgr.create_task(task_data)

            # Générer les instances pour aujourd'hui dynamiquement
            today = date.today()
            new_instances = await task_mgr.generate_task_instances(today)
            _LOGGER.info(f"Generated {len(new_instances)} task instances for today")

            # Mettre à jour les compteurs de tâches pour chaque enfant concerné
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            for child_id in task.assigned_to:
                # Compter les tâches en attente pour cet enfant
                all_instances = await task_mgr.get_task_instances(child_id=child_id)
                pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
                waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
                await entity_mgr.update_task_counts(child_id, pending_count, waiting_count)

            # Émettre un événement
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
        """Service: Mettre � jour une t�che."""
        try:
            task_id = call.data["task_id"]
            task = await task_mgr.get_task(task_id)

            # Mettre � jour les champs fournis
            if "title" in call.data:
                task.title = call.data["title"]
            if "description" in call.data:
                task.description = call.data["description"]
            if "active" in call.data:
                task.active = call.data["active"]

            task = await task_mgr.update_task(task)

            # �mettre un �v�nement
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
        """Service: Supprimer une t�che."""
        try:
            task_id = call.data["task_id"]
            await task_mgr.delete_task(task_id)

            # �mettre un �v�nement
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
        """Service: Marquer une tâche comme complétée (en attente de validation)."""
        try:
            instance_id = call.data["instance_id"]
            child_id = call.data["child_id"]

            instance = await task_mgr.mark_completed(instance_id)

            # Mettre à jour les compteurs de tâches dynamiquement
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            all_instances = await task_mgr.get_task_instances(child_id=child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await entity_mgr.update_task_counts(child_id, pending_count, waiting_count)

            # Émettre un événement
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
        """Service: Cr�er une habitude."""
        try:
            habit_data = dict(call.data)
            habit = await habit_mgr.create_habit(habit_data)

            # �mettre un �v�nement
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
        """Service: Mettre � jour une habitude."""
        try:
            habit_id = call.data["habit_id"]
            habit = await habit_mgr.get_habit(habit_id)

            # Mettre � jour les champs fournis
            if "title" in call.data:
                habit.title = call.data["title"]
            if "description" in call.data:
                habit.description = call.data["description"]
            if "active" in call.data:
                habit.active = call.data["active"]

            habit = await habit_mgr.update_habit(habit)

            # �mettre un �v�nement
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

            # �mettre un �v�nement
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
        """Service: Compléter une habitude."""
        try:
            habit_id = call.data["habit_id"]
            child_id = call.data["child_id"]

            # Enregistrer la complétion
            streak, streak_increased = await habit_mgr.record_completion(habit_id, child_id)

            # Calculer les récompenses avec bonus
            rewards = await habit_mgr.calculate_streak_bonus(habit_id, child_id)

            # Appliquer les récompenses (met à jour points/coins/level/xp automatiquement)
            await child_mgr.update_points(
                child_id,
                points=rewards["points"],
                coins=rewards["coins"],
                xp=rewards["experience"]
            )

            # Mettre à jour le longest_streak dynamiquement
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            longest_streak = await habit_mgr.get_child_longest_streak(child_id)
            await entity_mgr.update_longest_streak(child_id, longest_streak)

            # Émettre un événement
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
        """Service: Valider une tâche complétée."""
        try:
            instance_id = call.data["instance_id"]
            validator_id = call.data.get("validator_id", "admin")
            note = call.data.get("note", "")

            validation_mgr = hass.data[DOMAIN]["validation_manager"]

            # Valider et récupérer les récompenses
            instance, task, rewards = await validation_mgr.validate_task(
                instance_id, validator_id, note
            )

            # Appliquer les récompenses
            await child_mgr.update_points(
                instance.child_id,
                points=rewards["points"],
                coins=rewards["coins"],
                xp=rewards["experience"]
            )

            # Mettre à jour les compteurs
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            all_instances = await task_mgr.get_task_instances(child_id=instance.child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await entity_mgr.update_task_counts(instance.child_id, pending_count, waiting_count)

            # Émettre un événement
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
        """Service: Refuser une tâche complétée."""
        try:
            instance_id = call.data["instance_id"]
            validator_id = call.data.get("validator_id", "admin")
            apply_penalty = call.data.get("apply_penalty", False)
            note = call.data.get("note", "")

            validation_mgr = hass.data[DOMAIN]["validation_manager"]

            # Refuser et récupérer les pénalités si applicables
            instance, penalties = await validation_mgr.refuse_task(
                instance_id, validator_id, apply_penalty, note
            )

            # Appliquer les pénalités si présentes
            if penalties:
                await child_mgr.update_points(
                    instance.child_id,
                    points=penalties["points"],
                    coins=penalties["coins"],
                    xp=0
                )

            # Mettre à jour les compteurs
            entity_mgr = hass.data[DOMAIN]["entity_manager"]
            all_instances = await task_mgr.get_task_instances(child_id=instance.child_id)
            pending_count = sum(1 for inst in all_instances if inst.status.value == "pending")
            waiting_count = sum(1 for inst in all_instances if inst.status.value == "completed_waiting")
            await entity_mgr.update_task_counts(instance.child_id, pending_count, waiting_count)

            # Émettre un événement
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
        """Service: Créer une récompense."""
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
        """Service: Réclamer une récompense."""
        try:
            reward_id = call.data["reward_id"]
            child_id = call.data["child_id"]

            reward_mgr = hass.data[DOMAIN]["reward_manager"]

            # Réclamer la récompense
            claim, points_cost, coins_cost = await reward_mgr.claim_reward(reward_id, child_id)

            # Déduire les points/coins
            await child_mgr.update_points(child_id, points=-points_cost, coins=-coins_cost, xp=0)

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
        """Service: Approuver une réclamation."""
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
        """Service: Créer un cosmétique."""
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

    _LOGGER.info(f"Registered {17} services for {DOMAIN} (11 Phase 1 + 6 Phase 2)")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload de l'int�gration.

    Args:
        hass: Instance Home Assistant
        entry: Config entry

    Returns:
        True si succ�s
    """
    hass.data.pop(DOMAIN)
    return True
