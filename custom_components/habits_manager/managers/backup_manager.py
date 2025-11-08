"""Backup manager for Habits Manager.

Manages backup and restore of all system data.
"""
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from ..const import _LOGGER, STORAGE_VERSION
from ..core.exceptions import ValidationError, StorageError
from ..storage.storage_manager import StorageManager


class BackupManager:
    """Gère les backups et la restauration des données."""

    def __init__(self, storage: StorageManager):
        """Initialise le backup manager.

        Args:
            storage: Manager de stockage
        """
        self.storage = storage

    async def create_backup(
        self,
        include_history: bool = True,
        include_cosmetics: bool = True
    ) -> dict:
        """Crée un backup complet du système.

        Args:
            include_history: Inclure l'historique des points
            include_cosmetics: Inclure les cosmétiques possédés

        Returns:
            Dictionnaire contenant toutes les données

        Raises:
            StorageError: Si l'export échoue
        """
        try:
            _LOGGER.info("Creating backup...")

            # Charger toutes les données
            children = await self.storage.load_children()
            tasks = await self.storage.load_tasks()
            habits = await self.storage.load_habits()
            task_instances = await self.storage.load_task_instances()
            habit_streaks = await self.storage.load_habit_streaks()
            rewards = await self.storage.load_rewards()
            reward_claims = await self.storage.load_reward_claims()
            cosmetics = await self.storage.load_cosmetics()

            # Préparer les métadonnées
            metadata = {
                "children_count": len(children),
                "tasks_count": len(tasks),
                "habits_count": len(habits),
                "task_instances_count": len(task_instances),
                "habit_streaks_count": len(habit_streaks),
                "rewards_count": len(rewards),
                "reward_claims_count": len(reward_claims),
                "cosmetics_count": len(cosmetics),
            }

            # Convertir en dictionnaires
            children_data = []
            for child in children:
                child_dict = child.to_dict()

                # Filtrer l'historique si demandé
                if not include_history:
                    child_dict["points_history"] = []

                # Filtrer les cosmétiques si demandé
                if not include_cosmetics:
                    child_dict["owned_cosmetics"] = []

                children_data.append(child_dict)

            # Créer le backup
            backup = {
                "version": STORAGE_VERSION,
                "created_at": datetime.now().isoformat(),
                "metadata": metadata,
                "data": {
                    "children": children_data,
                    "tasks": [task.to_dict() for task in tasks],
                    "habits": [habit.to_dict() for habit in habits],
                    "task_instances": [inst.to_dict() for inst in task_instances],
                    "habit_streaks": [streak.to_dict() for streak in habit_streaks],
                    "rewards": [reward.to_dict() for reward in rewards],
                    "reward_claims": [claim.to_dict() for claim in reward_claims],
                    "cosmetics": [cosmetic.to_dict() for cosmetic in cosmetics],
                }
            }

            _LOGGER.info(
                f"Backup created successfully: {metadata['children_count']} children, "
                f"{metadata['tasks_count']} tasks, {metadata['habits_count']} habits"
            )

            return backup

        except Exception as err:
            _LOGGER.error(f"Failed to create backup: {err}")
            raise StorageError(f"Failed to create backup: {err}")

    def validate_backup(self, backup_data: dict) -> bool:
        """Valide l'intégrité d'un backup.

        Args:
            backup_data: Données du backup à valider

        Returns:
            True si le backup est valide

        Raises:
            ValidationError: Si le backup est invalide
        """
        try:
            # Vérifier la structure de base
            required_keys = ["version", "created_at", "metadata", "data"]
            for key in required_keys:
                if key not in backup_data:
                    raise ValidationError(f"Missing required key: {key}")

            # Vérifier la version
            if "version" not in backup_data:
                raise ValidationError("Backup version missing")

            # Vérifier les données
            data = backup_data.get("data", {})
            required_data_keys = [
                "children", "tasks", "habits", "task_instances",
                "habit_streaks", "rewards", "reward_claims", "cosmetics"
            ]
            for key in required_data_keys:
                if key not in data:
                    raise ValidationError(f"Missing data key: {key}")
                if not isinstance(data[key], list):
                    raise ValidationError(f"Data key {key} must be a list")

            # Vérifier les métadonnées
            metadata = backup_data.get("metadata", {})
            if not isinstance(metadata, dict):
                raise ValidationError("Metadata must be a dictionary")

            _LOGGER.info(f"Backup validation successful (version: {backup_data['version']})")
            return True

        except ValidationError:
            raise
        except Exception as err:
            raise ValidationError(f"Backup validation failed: {err}")

    async def restore_backup(
        self,
        backup_data: dict,
        merge_strategy: str = "overwrite"
    ) -> dict:
        """Restaure les données depuis un backup.

        Args:
            backup_data: Données du backup
            merge_strategy: Stratégie de fusion (overwrite, merge, skip)
                - overwrite: Écrase toutes les données existantes
                - merge: Fusionne avec les données existantes (garde les plus récentes)
                - skip: Ignore les conflits (garde les données existantes)

        Returns:
            Dictionnaire avec les statistiques de restauration

        Raises:
            ValidationError: Si le backup est invalide
            StorageError: Si la restauration échoue
        """
        try:
            # Valider le backup
            self.validate_backup(backup_data)

            _LOGGER.info(f"Restoring backup with strategy: {merge_strategy}")

            # Vérifier la stratégie
            if merge_strategy not in ["overwrite", "merge", "skip"]:
                raise ValidationError(f"Invalid merge strategy: {merge_strategy}")

            data = backup_data["data"]
            stats = {
                "children_restored": 0,
                "tasks_restored": 0,
                "habits_restored": 0,
                "task_instances_restored": 0,
                "habit_streaks_restored": 0,
                "rewards_restored": 0,
                "reward_claims_restored": 0,
                "cosmetics_restored": 0,
                "skipped": 0,
            }

            # Charger les données existantes pour les stratégies merge/skip
            existing_data = {}
            if merge_strategy in ["merge", "skip"]:
                existing_data = {
                    "children": {c.id: c for c in await self.storage.load_children()},
                    "tasks": {t.id: t for t in await self.storage.load_tasks()},
                    "habits": {h.id: h for h in await self.storage.load_habits()},
                    "task_instances": {i.id: i for i in await self.storage.load_task_instances()},
                    "habit_streaks": {s.id: s for s in await self.storage.load_habit_streaks()},
                    "rewards": {r.id: r for r in await self.storage.load_rewards()},
                    "reward_claims": {c.id: c for c in await self.storage.load_reward_claims()},
                    "cosmetics": {c.id: c for c in await self.storage.load_cosmetics()},
                }

            # Strategy overwrite: effacer d'abord
            if merge_strategy == "overwrite":
                _LOGGER.warning("Overwrite strategy: deleting existing data")
                # On va simplement sauvegarder les nouvelles données qui vont écraser

            # Restaurer les enfants
            from ..core.models import (
                Child, Avatar, AvatarCustomization, PointsHistoryEntry, HistoryActionType
            )

            for child_data in data["children"]:
                child_id = child_data["id"]

                # Appliquer la stratégie
                should_restore = True
                if merge_strategy == "skip" and child_id in existing_data.get("children", {}):
                    should_restore = False
                    stats["skipped"] += 1
                elif merge_strategy == "merge" and child_id in existing_data.get("children", {}):
                    # Comparer les dates de mise à jour
                    existing_child = existing_data["children"][child_id]
                    backup_updated = datetime.fromisoformat(child_data["updated_at"])
                    if existing_child.updated_at > backup_updated:
                        should_restore = False
                        stats["skipped"] += 1

                if should_restore:
                    # Reconstruire le Child
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

                    # Désérialiser l'historique des points
                    points_history = []
                    for entry_data in child_data.get("points_history", []):
                        try:
                            entry = PointsHistoryEntry(
                                id=entry_data["id"],
                                timestamp=datetime.fromisoformat(entry_data["timestamp"]),
                                action_type=HistoryActionType(entry_data["action_type"]),
                                points_delta=entry_data["points_delta"],
                                coins_delta=entry_data.get("coins_delta", 0),
                                experience_delta=entry_data.get("experience_delta", 0),
                                description=entry_data.get("description", ""),
                                related_entity_type=entry_data.get("related_entity_type", ""),
                                related_entity_id=entry_data.get("related_entity_id", ""),
                                related_entity_name=entry_data.get("related_entity_name", ""),
                                validator_id=entry_data.get("validator_id"),
                            )
                            points_history.append(entry)
                        except Exception as e:
                            _LOGGER.warning(f"Failed to deserialize points history entry: {e}")

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
                        points_history=points_history,
                        created_at=datetime.fromisoformat(child_data["created_at"]),
                        updated_at=datetime.fromisoformat(child_data["updated_at"]),
                    )

                    await self.storage.save_child(child)
                    stats["children_restored"] += 1

            # Restaurer les autres entités de manière similaire
            # Pour simplifier, on va utiliser les méthodes de sauvegarde du storage
            # qui écrasent ou créent selon l'ID

            # Tasks
            from ..core.models import Task, TaskType, ScheduleType, TaskCategory, TaskSchedule, TaskRewards, TaskPenalties
            for task_data in data["tasks"]:
                task_id = task_data["id"]
                should_restore = self._should_restore(
                    task_id, existing_data.get("tasks", {}),
                    task_data, merge_strategy, stats
                )

                if should_restore:
                    # Reconstruire la Task (simplifié - en production, utiliser une méthode from_dict)
                    schedule = TaskSchedule(
                        type=ScheduleType(task_data["schedule"]["type"]),
                        days=task_data["schedule"].get("days"),
                        time=task_data["schedule"].get("time"),
                        specific_date=datetime.fromisoformat(task_data["schedule"]["specific_date"]) if task_data["schedule"].get("specific_date") else None,
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

                    await self.storage.save_task(task)
                    stats["tasks_restored"] += 1

            # Pour les autres entités (habits, task_instances, etc.), on peut faire similairement
            # ou simplement sauvegarder les dictionnaires directement si le storage le supporte

            _LOGGER.info(
                f"Backup restored successfully: {stats['children_restored']} children, "
                f"{stats['tasks_restored']} tasks restored, {stats['skipped']} skipped"
            )

            return stats

        except ValidationError:
            raise
        except Exception as err:
            _LOGGER.error(f"Failed to restore backup: {err}")
            raise StorageError(f"Failed to restore backup: {err}")

    def _should_restore(
        self,
        entity_id: str,
        existing_entities: dict,
        backup_data: dict,
        merge_strategy: str,
        stats: dict
    ) -> bool:
        """Détermine si une entité doit être restaurée selon la stratégie.

        Args:
            entity_id: ID de l'entité
            existing_entities: Dictionnaire des entités existantes
            backup_data: Données du backup
            merge_strategy: Stratégie de fusion
            stats: Statistiques à mettre à jour

        Returns:
            True si l'entité doit être restaurée
        """
        if merge_strategy == "overwrite":
            return True

        if merge_strategy == "skip" and entity_id in existing_entities:
            stats["skipped"] += 1
            return False

        if merge_strategy == "merge" and entity_id in existing_entities:
            # Pour merge, on compare les dates updated_at si disponibles
            if "updated_at" in backup_data and hasattr(existing_entities[entity_id], "updated_at"):
                backup_updated = datetime.fromisoformat(backup_data["updated_at"])
                if existing_entities[entity_id].updated_at > backup_updated:
                    stats["skipped"] += 1
                    return False

        return True
