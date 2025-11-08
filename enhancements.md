# Enhancements & Missing Features

Ce document compile toutes les améliorations suggérées pour Habits Manager, incluant :
- Fonctionnalités présentes dans kids-tasks-ha mais absentes dans habits
- Améliorations architecturales identifiées lors de l'analyse
- Priorisation et recommandations d'implémentation

**Date de création**: 2025-11-07
**Basé sur**: Analyse comparative avec kids-tasks-ha

---

## Table des Matières

1. [Fonctionnalités Critiques Manquantes](#1-fonctionnalités-critiques-manquantes)
2. [Fonctionnalités Importantes Manquantes](#2-fonctionnalités-importantes-manquantes)
3. [Fonctionnalités Mineures Manquantes](#3-fonctionnalités-mineures-manquantes)
4. [Améliorations Architecturales](#4-améliorations-architecturales)
5. [Priorisation et Roadmap](#5-priorisation-et-roadmap)
6. [Détails d'Implémentation](#6-détails-dimplémentation)

---

## 1. Fonctionnalités Critiques Manquantes

### 1.1 Système de Backup/Restore ⭐⭐⭐⭐⭐

**Statut**: ❌ Absent
**Priorité**: CRITIQUE
**Difficulté**: Moyenne
**Effort estimé**: 3-5 jours

#### Problème Actuel
- Aucun moyen d'exporter l'état complet du système
- Pas de protection contre la perte de données
- Impossible de migrer les données vers une nouvelle instance
- Pas de sauvegarde avant mises à jour majeures

#### Ce qui Manque
```yaml
# Services à créer
backup_data:
  description: Exporte toutes les données du système
  fields:
    include_history:
      description: Inclure l'historique des streaks
      type: boolean
      default: true
    include_cosmetics:
      description: Inclure les cosmétiques possédés
      type: boolean
      default: true

restore_data:
  description: Restaure les données depuis un backup
  fields:
    backup_data:
      description: Données JSON du backup
      type: string
      required: true
    merge_strategy:
      description: Comment gérer les conflits (overwrite, merge, skip)
      type: select
      options: [overwrite, merge, skip]
      default: merge
```

#### Implémentation Suggérée
1. **Créer un `BackupManager`** dans `managers/`
2. **Méthodes principales**:
   - `create_backup() -> dict` - Exporte tout en JSON
   - `restore_backup(data: dict, strategy: str)` - Restaure les données
   - `validate_backup(data: dict) -> bool` - Vérifie l'intégrité
3. **Formats de backup**:
   - Version du schéma (pour migrations futures)
   - Timestamp de création
   - Métadonnées (nombre d'enfants, tâches, etc.)
   - Données complètes de tous les fichiers JSON

#### Exemple de Structure de Backup
```json
{
  "version": "1.0.0",
  "created_at": "2025-11-07T10:30:00Z",
  "metadata": {
    "children_count": 3,
    "tasks_count": 15,
    "habits_count": 8
  },
  "data": {
    "children": [...],
    "tasks": [...],
    "habits": [...],
    "task_instances": [...],
    "habit_streaks": [...],
    "rewards": [...],
    "reward_claims": [...],
    "cosmetics": [...]
  }
}
```

#### Valeur Ajoutée
- ✅ Protection contre la perte de données
- ✅ Facilite les migrations
- ✅ Permet les tests A/B
- ✅ Sauvegarde avant mises à jour

---

### 1.2 Historique Détaillé des Points (Audit Trail) ⭐⭐⭐⭐⭐

**Statut**: ❌ Absent
**Priorité**: CRITIQUE
**Difficulté**: Moyenne
**Effort estimé**: 4-6 jours

#### Problème Actuel
- Impossible de savoir pourquoi un enfant a gagné/perdu des points
- Pas de transparence pour les enfants
- Difficile de déboguer les problèmes de points
- Aucune traçabilité des transactions

#### Ce qui Manque

**Nouveau modèle à créer** dans `core/models.py`:
```python
@dataclass
class PointsHistoryEntry:
    """Entrée dans l'historique des points."""
    id: str
    timestamp: datetime
    action_type: str  # "task_completed", "task_validated", "habit_completed",
                      # "penalty_applied", "reward_claimed", "manual_adjustment"
    points_delta: int  # Peut être négatif
    coins_delta: int = 0
    experience_delta: int = 0
    description: str = ""
    related_entity_type: str = ""  # "task", "habit", "reward", etc.
    related_entity_id: str = ""
    related_entity_name: str = ""
    validator_id: Optional[str] = None  # Si validation

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "action_type": self.action_type,
            "points_delta": self.points_delta,
            "coins_delta": self.coins_delta,
            "experience_delta": self.experience_delta,
            "description": self.description,
            "related_entity_type": self.related_entity_type,
            "related_entity_id": self.related_entity_id,
            "related_entity_name": self.related_entity_name,
            "validator_id": self.validator_id,
        }
```

**Modifier le modèle `Child`**:
```python
@dataclass
class Child:
    # ... champs existants ...
    points_history: List[PointsHistoryEntry] = field(default_factory=list)

    def add_history_entry(self, entry: PointsHistoryEntry):
        """Ajoute une entrée et garde les 50 plus récentes."""
        self.points_history.insert(0, entry)
        self.points_history = self.points_history[:50]  # Limite à 50 entrées
```

#### Intégration dans les Managers

**ValidationManager** - Lors de la validation:
```python
async def validate_task(self, instance_id: str, validator_id: str):
    # ... logique existante ...

    # Créer l'entrée d'historique
    history_entry = PointsHistoryEntry(
        id=f"history_{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now(),
        action_type="task_validated",
        points_delta=task.rewards.points,
        coins_delta=task.rewards.coins,
        experience_delta=task.rewards.experience,
        description=f"Tâche validée : {task.title}",
        related_entity_type="task",
        related_entity_id=task.id,
        related_entity_name=task.title,
        validator_id=validator_id,
    )

    child.add_history_entry(history_entry)
    await self.storage.save_child(child)
```

**HabitManager** - Lors de la complétion:
```python
async def record_completion(self, habit_id: str, child_id: str):
    # ... logique existante ...

    history_entry = PointsHistoryEntry(
        id=f"history_{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now(),
        action_type="habit_completed",
        points_delta=total_points_with_bonus,
        coins_delta=habit.rewards.coins,
        experience_delta=habit.rewards.experience,
        description=f"Habitude complétée : {habit.title} (streak: {streak.current_streak})",
        related_entity_type="habit",
        related_entity_id=habit.id,
        related_entity_name=habit.title,
    )

    child.add_history_entry(history_entry)
```

#### Nouveau Service

```yaml
get_points_history:
  name: Obtenir l'historique des points
  description: Récupère l'historique des transactions de points pour un enfant
  fields:
    child_id:
      description: ID de l'enfant
      required: true
    limit:
      description: Nombre max d'entrées (défaut 20, max 50)
      required: false
      default: 20
    action_type_filter:
      description: Filtrer par type d'action
      required: false
      options:
        - "task_validated"
        - "habit_completed"
        - "penalty_applied"
        - "reward_claimed"
        - "manual_adjustment"
```

#### UI Frontend
Créer un nouveau composant `points-history.ts` qui affiche:
- Timeline des transactions
- Icônes par type d'action
- Valeurs +/- en couleur (vert/rouge)
- Lien vers l'entité source (task, habit, reward)

#### Valeur Ajoutée
- ✅ Transparence totale pour les enfants
- ✅ Parents peuvent vérifier les calculs
- ✅ Facilite le débogage
- ✅ Gamification améliorée (voir sa progression)
- ✅ Audit trail pour disputes

---

### 1.3 Suspension Temporaire de Tâches ⭐⭐⭐⭐

**Statut**: ❌ Absent
**Priorité**: IMPORTANT
**Difficulté**: Facile
**Effort estimé**: 2-3 jours

#### Problème Actuel
- Impossible de suspendre une tâche temporairement
- Il faut supprimer/recréer pour les vacances
- Pas de gestion des périodes d'absence (maladie, voyage)

#### Ce qui Manque

**Modifier le modèle `Task`** dans `core/models.py`:
```python
@dataclass
class Task:
    # ... champs existants ...
    suspended: bool = False
    suspended_until: Optional[datetime] = None
    suspended_reason: Optional[str] = None

    def is_available(self) -> bool:
        """Vérifie si la tâche est disponible (active ET non suspendue)."""
        if not self.active:
            return False

        if self.suspended:
            # Vérifier si la suspension a expiré
            if self.suspended_until and datetime.now() >= self.suspended_until:
                self.suspended = False
                self.suspended_until = None
                self.suspended_reason = None
                return True
            return False

        return True
```

**Nouveaux services**:
```yaml
suspend_task:
  name: Suspendre une tâche
  description: Suspend temporairement une tâche
  fields:
    task_id:
      description: ID de la tâche
      required: true
    until:
      description: Date/heure de reprise (optionnel, indéfini si absent)
      required: false
      selector:
        datetime:
    reason:
      description: Raison de la suspension
      required: false
      example: "Vacances d'été"

resume_task:
  name: Reprendre une tâche
  description: Reprend une tâche suspendue immédiatement
  fields:
    task_id:
      description: ID de la tâche
      required: true
```

#### Intégration dans TaskManager

**Nouvelles méthodes**:
```python
async def suspend_task(
    self,
    task_id: str,
    until: Optional[datetime] = None,
    reason: Optional[str] = None
) -> Task:
    """Suspend une tâche."""
    task = await self.get_task(task_id)
    task.suspended = True
    task.suspended_until = until
    task.suspended_reason = reason
    await self.storage.save_task(task)

    _LOGGER.info(
        f"Task {task.title} suspended"
        f"{' until ' + until.isoformat() if until else ' indefinitely'}"
    )

    return task

async def resume_task(self, task_id: str) -> Task:
    """Reprend une tâche suspendue."""
    task = await self.get_task(task_id)
    task.suspended = False
    task.suspended_until = None
    task.suspended_reason = None
    await self.storage.save_task(task)

    _LOGGER.info(f"Task {task.title} resumed")

    return task
```

#### Intégration dans Scheduler

**Vérifier les suspensions expirées**:
```python
async def check_suspension_expiry(self) -> List[Task]:
    """Vérifie et reprend les tâches dont la suspension a expiré."""
    tasks = await self.task_mgr.get_all_tasks()
    resumed_tasks = []

    for task in tasks:
        if task.suspended and task.suspended_until:
            if datetime.now() >= task.suspended_until:
                await self.task_mgr.resume_task(task.id)
                resumed_tasks.append(task)

    return resumed_tasks
```

#### UI Frontend
Dans la card d'admin:
- Badge "SUSPENDU" sur les tâches suspendues
- Affichage de la date de reprise
- Bouton "Suspendre" / "Reprendre"

#### Valeur Ajoutée
- ✅ Gestion flexible des tâches
- ✅ Pas besoin de supprimer/recréer
- ✅ Planification anticipée des vacances
- ✅ Cas d'usage réels (maladie, voyage)

---

## 2. Fonctionnalités Importantes Manquantes

### 2.1 Services de Réinitialisation en Masse ⭐⭐⭐⭐

**Statut**: ⚠️ Partiellement présent (via scheduler automatique)
**Priorité**: MODÉRÉE
**Difficulté**: Facile
**Effort estimé**: 1-2 jours

#### Problème Actuel
- Le scheduler réinitialise automatiquement, mais pas de contrôle manuel
- Impossible de forcer un reset en cas de bug
- Pas de flexibilité pour tests

#### Ce qui Manque

**Nouveaux services**:
```yaml
reset_all_daily_tasks:
  name: Réinitialiser toutes les tâches quotidiennes
  description: Force la réinitialisation immédiate de toutes les tâches daily
  fields:
    apply_penalties:
      description: Appliquer les pénalités aux tâches non complétées
      type: boolean
      default: true

reset_all_weekly_tasks:
  name: Réinitialiser toutes les tâches hebdomadaires
  description: Force la réinitialisation de toutes les tâches weekly

reset_all_monthly_tasks:
  name: Réinitialiser toutes les tâches mensuelles
  description: Force la réinitialisation de toutes les tâches monthly

reset_task_by_id:
  name: Réinitialiser une tâche spécifique
  description: Réinitialise une seule tâche par son ID
  fields:
    task_id:
      required: true
    apply_penalty:
      type: boolean
      default: false
```

#### Implémentation dans TaskManager

```python
async def reset_tasks_by_schedule(
    self,
    schedule_type: ScheduleType,
    apply_penalties: bool = True
) -> List[TaskInstance]:
    """Réinitialise toutes les tâches d'un type de schedule."""

    all_tasks = await self.get_all_tasks()
    target_tasks = [t for t in all_tasks if t.schedule.type == schedule_type]

    reset_instances = []

    for task in target_tasks:
        instances = await self.get_task_instances(task.id, date.today())

        for instance in instances:
            if apply_penalties and instance.status == TaskInstanceStatus.PENDING:
                # Appliquer pénalités
                # ... logique de pénalité ...
                pass

            # Marquer comme failed ou supprimer selon logique
            instance.status = TaskInstanceStatus.FAILED
            await self.storage.save_task_instance(instance)
            reset_instances.append(instance)

    _LOGGER.info(
        f"Reset {len(reset_instances)} instances "
        f"for schedule type {schedule_type.value}"
    )

    return reset_instances
```

#### Cas d'Usage
- Forcer un reset après correction d'un bug
- Tester le système de pénalités
- Réinitialiser suite à un changement d'horaire
- Développement et tests

#### Valeur Ajoutée
- ✅ Contrôle manuel du système
- ✅ Facilite le débogage
- ✅ Flexibilité pour cas exceptionnels

---

### 2.2 Services Manuels de Gestion de Monnaie ⭐⭐⭐

**Statut**: ❌ Absent (mais workaround possible)
**Priorité**: MODÉRÉE
**Difficulté**: Facile
**Effort estimé**: 1-2 jours

#### Problème Actuel
- Pas de moyen direct d'ajuster manuellement les points/coins
- Il faut créer des tâches bonus temporaires
- Pas de traçabilité des ajustements manuels

#### Ce qui Manque

**Nouveaux services**:
```yaml
add_points:
  name: Ajouter des points
  description: Ajoute manuellement des points à un enfant
  fields:
    child_id:
      required: true
    amount:
      description: Nombre de points à ajouter
      required: true
      selector:
        number:
          min: 1
          max: 1000
    reason:
      description: Raison de l'ajout (obligatoire pour audit trail)
      required: true
      example: "Aide exceptionnelle pour déménagement"

remove_points:
  name: Retirer des points
  description: Retire manuellement des points à un enfant
  fields:
    child_id:
      required: true
    amount:
      required: true
    reason:
      required: true
      example: "Mauvais comportement"

add_coins:
  name: Ajouter des pièces
  description: Ajoute manuellement des pièces

remove_coins:
  name: Retirer des pièces
  description: Retire manuellement des pièces

add_currency:
  name: Ajouter de la monnaie
  description: Ajoute points ET pièces en une opération
  fields:
    child_id:
      required: true
    points:
      required: false
      default: 0
    coins:
      required: false
      default: 0
    experience:
      required: false
      default: 0
    reason:
      required: true

set_level:
  name: Définir le niveau
  description: Force le niveau d'un enfant (admin uniquement)
  fields:
    child_id:
      required: true
    level:
      required: true
      selector:
        number:
          min: 1
          max: 100
```

#### Implémentation dans ChildManager

```python
async def add_currency_manual(
    self,
    child_id: str,
    points: int = 0,
    coins: int = 0,
    experience: int = 0,
    reason: str = ""
) -> Child:
    """Ajoute de la monnaie manuellement avec audit trail."""

    child = await self.get_child(child_id)

    # Appliquer les changements
    child.points = max(0, child.points + points)
    child.coins = max(0, child.coins + coins)
    child.experience = max(0, child.experience + experience)

    # Créer entrée d'historique (si fonctionnalité 1.2 implémentée)
    if points != 0 or coins != 0 or experience != 0:
        history_entry = PointsHistoryEntry(
            id=f"history_{uuid.uuid4().hex[:8]}",
            timestamp=datetime.now(),
            action_type="manual_adjustment",
            points_delta=points,
            coins_delta=coins,
            experience_delta=experience,
            description=reason or "Ajustement manuel",
            related_entity_type="manual",
            related_entity_id="",
            related_entity_name="",
        )
        child.add_history_entry(history_entry)

    # Vérifier level-up
    if experience > 0:
        level_calculator = LevelCalculator()
        new_level = level_calculator.calculate_level(child.experience)
        if new_level > child.level:
            child.level = new_level
            # ... événement level_up ...

    await self.storage.save_child(child)
    await self.entity_mgr.update_child_entities(child)

    _LOGGER.info(
        f"Manual currency adjustment for {child.name}: "
        f"points={points:+d}, coins={coins:+d}, xp={experience:+d}"
    )

    return child
```

#### Intégration avec Points History
Ces services **nécessitent** que la fonctionnalité 1.2 (Points History) soit implémentée pour avoir un audit trail complet.

#### Cas d'Usage
- Récompense pour comportement exceptionnel hors système
- Correction d'erreurs de calcul
- Bonus surprise
- Pénalités pour mauvais comportement
- Tests et démos

#### Valeur Ajoutée
- ✅ Flexibilité pour cas exceptionnels
- ✅ Correction d'erreurs facile
- ✅ Transparence avec audit trail

---

### 2.3 Gestion Granulaire des Deadlines ⭐⭐⭐

**Statut**: ⚠️ Présent mais basique
**Priorité**: MODÉRÉE
**Difficulté**: Moyenne
**Effort estimé**: 2-3 jours

#### Problème Actuel
- Les deadlines sont vérifiées quotidiennement par le scheduler
- Pas de granularité heure par heure
- Pas de flag `deadline_passed` pour éviter re-vérifications

#### Ce que Habits a Actuellement
```python
# Scheduler vérifie les tâches échouées (deadline dépassée)
# Mais pas de vérification en temps réel
```

#### Amélioration Suggérée

**Modifier `TaskInstance`**:
```python
@dataclass
class TaskInstance:
    # ... champs existants ...
    deadline_time: Optional[str] = None  # Format "HH:MM"
    deadline_passed: bool = False  # Flag une seule fois
    deadline_check_at: Optional[datetime] = None  # Timestamp de la vérification

    def check_deadline(self) -> bool:
        """Vérifie si la deadline est passée MAINTENANT."""
        if self.status != TaskInstanceStatus.PENDING:
            return False

        if self.deadline_passed:
            return False  # Déjà marqué

        if not self.deadline_time:
            return False

        now = datetime.now()
        deadline_dt = datetime.combine(
            self.date,
            datetime.strptime(self.deadline_time, "%H:%M").time()
        )

        if now >= deadline_dt:
            self.deadline_passed = True
            self.deadline_check_at = now
            return True

        return False
```

**Créer un service de vérification temps réel**:
```yaml
check_deadlines_now:
  name: Vérifier les deadlines maintenant
  description: Force la vérification immédiate de toutes les deadlines
  fields:
    child_id:
      description: Vérifier seulement pour un enfant (optionnel)
      required: false
```

#### Intégration avec Scheduler

**Ajouter vérification horaire** (optionnel):
```python
# Dans scheduler.py
async def check_hourly_deadlines(self) -> List[TaskInstance]:
    """Vérifie les deadlines toutes les heures."""

    instances = await self.task_mgr.get_today_instances()
    failed_instances = []

    for instance in instances:
        if instance.check_deadline():
            # Appliquer pénalités
            # ...
            failed_instances.append(instance)

    return failed_instances
```

#### Valeur Ajoutée
- ✅ Précision des deadlines
- ✅ Moins de re-vérifications inutiles
- ✅ Performance améliorée
- ✅ Feedback temps réel

---

### 2.4 Service de Réinitialisation Complète ⭐⭐⭐

**Statut**: ❌ Absent
**Priorité**: FAIBLE
**Difficulté**: Facile
**Effort estimé**: 1 jour

#### Problème Actuel
- Pas de moyen simple de réinitialiser complètement le système
- Il faut supprimer manuellement les fichiers JSON

#### Ce qui Manque

```yaml
clear_all_data:
  name: Effacer toutes les données
  description: ATTENTION - Supprime TOUTES les données du système
  fields:
    confirmation:
      description: Taper "YES_DELETE_EVERYTHING" pour confirmer
      required: true
      selector:
        text:
```

**Implémentation**:
```python
async def clear_all_data(confirmation: str) -> bool:
    """Efface toutes les données - DANGEREUX."""

    if confirmation != "YES_DELETE_EVERYTHING":
        raise ValidationError("Confirmation incorrecte")

    # Supprimer tous les fichiers JSON
    storage_dir = hass.config.path(".storage", "habits_manager")

    files_to_delete = [
        "children.json",
        "tasks.json",
        "habits.json",
        "task_instances.json",
        "habit_streaks.json",
        "rewards.json",
        "reward_claims.json",
        "cosmetics.json",
    ]

    for filename in files_to_delete:
        filepath = os.path.join(storage_dir, filename)
        if os.path.exists(filepath):
            os.remove(filepath)

    # Supprimer toutes les entités
    await entity_mgr.remove_all_entities()

    _LOGGER.warning("ALL DATA CLEARED - System reset to initial state")

    return True
```

#### Cas d'Usage
- Tests et développement
- Repartir à zéro après démo
- Réinitialiser après erreur critique

#### Valeur Ajoutée
- ✅ Utile pour développement
- ✅ Reset propre du système

---

## 3. Fonctionnalités Mineures Manquantes

### 3.1 Nettoyage Automatique des Entités Orphelines ⭐⭐

**Statut**: ❌ Absent
**Priorité**: FAIBLE
**Difficulté**: Facile
**Effort estimé**: 1 jour

```yaml
cleanup_orphaned_entities:
  name: Nettoyer les entités orphelines
  description: Supprime les entités HA d'enfants supprimés
```

### 3.2 Multi-validation pour Tâches Bonus ⭐⭐

**Statut**: ⚠️ Incertain
**Priorité**: FAIBLE
**Difficulté**: Moyenne
**Effort estimé**: 2-3 jours

Permettre aux tâches bonus d'être validées plusieurs fois par jour avec historique.

### 3.3 Export des Données en CSV ⭐⭐

**Statut**: ❌ Absent
**Priorité**: FAIBLE
**Difficulté**: Facile
**Effort estimé**: 1-2 jours

```yaml
export_statistics:
  name: Exporter les statistiques
  description: Exporte les données en CSV pour analyse
  fields:
    format:
      options: [csv, json, xlsx]
    include:
      options: [tasks, habits, points_history, streaks]
```

---

## 4. Améliorations Architecturales

### 4.1 Système de Migrations ⭐⭐⭐⭐

**Statut**: ❌ Absent
**Priorité**: IMPORTANT
**Difficulté**: Moyenne
**Effort estimé**: 3-4 jours

#### Problème Actuel
- Aucun système de migration de schéma
- Les changements de modèles peuvent casser les données existantes
- Pas de versioning du schéma

#### Solution Suggérée

**Créer `migrations/` directory**:
```
migrations/
├── __init__.py
├── migration_manager.py
├── versions/
│   ├── v1_to_v2.py
│   ├── v2_to_v3.py
│   └── ...
```

**Migration Manager**:
```python
class MigrationManager:
    """Gère les migrations de schéma de données."""

    def __init__(self, storage: StorageManager):
        self.storage = storage
        self.current_version = STORAGE_VERSION  # const.py

    async def get_data_version(self) -> int:
        """Récupère la version actuelle des données."""
        version_file = self.storage.get_path("version.json")
        if os.path.exists(version_file):
            with open(version_file) as f:
                data = json.load(f)
                return data.get("version", 1)
        return 1

    async def needs_migration(self) -> bool:
        """Vérifie si une migration est nécessaire."""
        data_version = await self.get_data_version()
        return data_version < self.current_version

    async def migrate(self):
        """Exécute toutes les migrations nécessaires."""
        data_version = await self.get_data_version()

        while data_version < self.current_version:
            _LOGGER.info(f"Migrating from v{data_version} to v{data_version + 1}")

            # Backup avant migration
            await self.create_backup_before_migration(data_version)

            # Exécuter la migration
            migration = self.get_migration(data_version, data_version + 1)
            await migration.migrate(self.storage)

            # Mettre à jour la version
            data_version += 1
            await self.set_data_version(data_version)
```

**Exemple de migration v1 → v2**:
```python
# migrations/versions/v1_to_v2.py
class MigrationV1ToV2:
    """Migration v1 → v2: Ajoute points_history aux enfants."""

    async def migrate(self, storage: StorageManager):
        children = await storage.load_children()

        for child in children:
            if not hasattr(child, 'points_history'):
                child.points_history = []

        await storage.save_all_children(children)

    async def rollback(self, storage: StorageManager):
        """Rollback si nécessaire."""
        children = await storage.load_children()

        for child in children:
            if hasattr(child, 'points_history'):
                delattr(child, 'points_history')

        await storage.save_all_children(children)
```

#### Intégration dans async_setup

```python
async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    # ... setup existant ...

    # Vérifier et exécuter migrations
    migration_mgr = MigrationManager(storage)
    if await migration_mgr.needs_migration():
        _LOGGER.warning("Data migration required")
        await migration_mgr.migrate()
        _LOGGER.info("Migration completed successfully")

    # ... reste du setup ...
```

#### Valeur Ajoutée
- ✅ Évolutions sécurisées du schéma
- ✅ Rétrocompatibilité
- ✅ Moins de bugs lors des mises à jour

---

### 4.2 Tests Unitaires ⭐⭐⭐⭐

**Statut**: ❌ Absent (seulement tests d'intégration)
**Priorité**: IMPORTANT
**Difficulté**: Moyenne
**Effort estimé**: 5-10 jours

#### Problème Actuel
- Seulement tests d'intégration (via HA REST API)
- Pas de tests unitaires des composants
- Difficile de tester la logique isolément

#### Solution Suggérée

**Créer structure de tests**:
```
tests/
├── unit/
│   ├── test_calculators.py
│   ├── test_managers.py
│   ├── test_models.py
│   └── test_validators.py
├── integration/
│   ├── test_services.py  (existant)
│   └── test_storage.py   (existant)
└── fixtures/
    └── sample_data.py
```

**Exemple de tests unitaires**:
```python
# tests/unit/test_calculators.py
import pytest
from custom_components.habits_manager.services.points_calculator import PointsCalculator

class TestPointsCalculator:
    def setup_method(self):
        self.calculator = PointsCalculator()

    def test_calculate_task_points_easy(self):
        """Test calcul points tâche facile."""
        result = self.calculator.calculate_task_points(
            base_points=10,
            difficulty=1
        )
        assert result == 10

    def test_calculate_task_points_hard(self):
        """Test calcul points tâche difficile."""
        result = self.calculator.calculate_task_points(
            base_points=10,
            difficulty=3
        )
        assert result == 30  # Multiplié par difficulté

    def test_calculate_streak_bonus_progressive(self):
        """Test bonus de streak progressif."""
        result = self.calculator.calculate_streak_bonus(
            base_points=10,
            streak_count=5,
            bonus_type="progressive"
        )
        assert result == 12  # 10 + 20% bonus
```

**Tests des Managers avec Mocking**:
```python
# tests/unit/test_managers.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.habits_manager.managers.child_manager import ChildManager

@pytest.mark.asyncio
class TestChildManager:
    async def test_create_child_success(self):
        """Test création enfant réussie."""
        storage_mock = AsyncMock()
        entity_mock = AsyncMock()

        manager = ChildManager(storage_mock, entity_mock)

        child_data = {
            "name": "Test Child",
            "person_entity": "person.test"
        }

        child = await manager.create_child(child_data)

        assert child.name == "Test Child"
        assert child.points == 0
        assert child.level == 1
        storage_mock.save_child.assert_called_once()

    async def test_create_child_invalid_data(self):
        """Test création enfant avec données invalides."""
        storage_mock = AsyncMock()
        entity_mock = AsyncMock()

        manager = ChildManager(storage_mock, entity_mock)

        with pytest.raises(ValidationError):
            await manager.create_child({"name": ""})  # Nom vide
```

#### Configuration pytest

**pyproject.toml** ou **pytest.ini**:
```ini
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
asyncio_mode = "auto"
```

#### CI/CD Integration
```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install pytest pytest-asyncio pytest-cov
          pip install -r requirements.txt
      - name: Run unit tests
        run: pytest tests/unit/ -v --cov
      - name: Run integration tests
        run: pytest tests/integration/ -v
```

#### Valeur Ajoutée
- ✅ Détection précoce des bugs
- ✅ Refactoring plus sûr
- ✅ Documentation vivante du code
- ✅ Meilleure qualité globale

---

### 4.3 Validation de Schéma JSON ⭐⭐⭐

**Statut**: ⚠️ Validation basique
**Priorité**: MODÉRÉE
**Difficulté**: Facile
**Effort estimé**: 2-3 jours

#### Amélioration Suggérée

**Créer des schémas JSON Schema**:
```json
// schemas/child.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {"type": "string", "pattern": "^child_[a-f0-9]{8}$"},
    "name": {"type": "string", "minLength": 1, "maxLength": 50},
    "person_entity": {"type": "string", "pattern": "^person\\..+$"},
    "points": {"type": "integer", "minimum": 0},
    "level": {"type": "integer", "minimum": 1, "maximum": 100}
  },
  "required": ["id", "name", "person_entity"]
}
```

**Valider lors du chargement**:
```python
import jsonschema

async def load_child(self, child_id: str) -> Child:
    data = await self._load_json("children.json")
    child_data = data.get(child_id)

    # Valider contre le schéma
    with open("schemas/child.schema.json") as f:
        schema = json.load(f)
    jsonschema.validate(child_data, schema)

    return Child.from_dict(child_data)
```

---

### 4.4 Logging Structuré ⭐⭐⭐

**Statut**: ⚠️ Logging basique
**Priorité**: MODÉRÉE
**Difficulté**: Facile
**Effort estimé**: 1-2 jours

#### Amélioration Suggérée

**Logging structuré avec contexte**:
```python
import structlog

logger = structlog.get_logger()

# Au lieu de:
_LOGGER.info(f"Child created: {child.name} ({child.id})")

# Utiliser:
logger.info(
    "child_created",
    child_id=child.id,
    child_name=child.name,
    initial_level=child.level
)
```

**Avantages**:
- Parsing facile des logs
- Filtrage par contexte
- Meilleure observabilité

---

## 5. Priorisation et Roadmap

### Phase 1: Fonctionnalités Critiques (Q1 2025)
**Durée estimée**: 3-4 semaines

| Fonctionnalité | Priorité | Effort | Dépendances |
|----------------|----------|--------|-------------|
| **1.2 Points History** | ⭐⭐⭐⭐⭐ | 4-6j | Aucune |
| **1.1 Backup/Restore** | ⭐⭐⭐⭐⭐ | 3-5j | Aucune |
| **1.3 Suspension Tâches** | ⭐⭐⭐⭐ | 2-3j | Aucune |
| **4.1 Système Migrations** | ⭐⭐⭐⭐ | 3-4j | Aucune |

**Livrables**:
- [ ] Modèle `PointsHistoryEntry` implémenté
- [ ] Service `get_points_history` fonctionnel
- [ ] Services `backup_data` et `restore_data`
- [ ] Services `suspend_task` et `resume_task`
- [ ] Migration Manager avec version tracking
- [ ] UI affichant l'historique des points

---

### Phase 2: Améliorations Importantes (Q2 2025)
**Durée estimée**: 2-3 semaines

| Fonctionnalité | Priorité | Effort | Dépendances |
|----------------|----------|--------|-------------|
| **2.1 Reset en Masse** | ⭐⭐⭐⭐ | 1-2j | Aucune |
| **2.2 Services Monnaie** | ⭐⭐⭐ | 1-2j | 1.2 (Points History) |
| **2.3 Deadlines Granulaires** | ⭐⭐⭐ | 2-3j | Aucune |
| **4.2 Tests Unitaires** | ⭐⭐⭐⭐ | 5-10j | Aucune |

**Livrables**:
- [ ] Services `reset_all_*_tasks`
- [ ] Services `add_points`, `remove_points`, `add_currency`
- [ ] Deadline time avec flag `deadline_passed`
- [ ] Suite de tests unitaires (>80% coverage)

---

### Phase 3: Fonctionnalités Nice-to-Have (Q3 2025)
**Durée estimée**: 2 semaines

| Fonctionnalité | Priorité | Effort | Dépendances |
|----------------|----------|--------|-------------|
| **2.4 Clear All Data** | ⭐⭐⭐ | 1j | Aucune |
| **3.1 Cleanup Entities** | ⭐⭐ | 1j | Aucune |
| **3.2 Multi-validation** | ⭐⭐ | 2-3j | Aucune |
| **3.3 Export CSV** | ⭐⭐ | 1-2j | 1.2 (Points History) |
| **4.3 JSON Schema** | ⭐⭐⭐ | 2-3j | Aucune |
| **4.4 Logging Structuré** | ⭐⭐⭐ | 1-2j | Aucune |

**Livrables**:
- [ ] Service `clear_all_data`
- [ ] Service `cleanup_orphaned_entities`
- [ ] Tâches bonus multi-validation
- [ ] Export statistiques CSV/JSON/XLSX
- [ ] Validation JSON Schema sur tous les modèles

---

## 6. Détails d'Implémentation

### 6.1 Guidelines Générales

**Avant toute nouvelle fonctionnalité**:
1. ✅ Créer un ticket/issue GitHub avec description détaillée
2. ✅ Discuter l'approche dans un ADR (Architecture Decision Record)
3. ✅ Créer une branche feature: `feature/points-history`
4. ✅ Implémenter avec tests unitaires
5. ✅ Mettre à jour la documentation
6. ✅ Créer PR avec review checklist

**Standards de Code**:
- Type hints partout
- Docstrings Google style
- Tests unitaires pour nouvelle logique
- Logging approprié (DEBUG, INFO, WARNING, ERROR)
- Gestion d'erreurs avec exceptions custom

**Backward Compatibility**:
- TOUJOURS maintenir la compatibilité ascendante
- Utiliser les migrations pour changements de schéma
- Déprécier progressivement (warnings) avant suppression
- Documenter les breaking changes dans CHANGELOG.md

---

### 6.2 Checklist Implémentation Points History

Exemple de checklist détaillée pour la fonctionnalité prioritaire #1:

**Modèles et Types**:
- [ ] Créer `PointsHistoryEntry` dataclass dans `core/models.py`
- [ ] Ajouter `points_history: List[PointsHistoryEntry]` à `Child`
- [ ] Ajouter méthode `add_history_entry()` à `Child`
- [ ] Ajouter enum `HistoryActionType` avec tous les types

**Managers**:
- [ ] Modifier `ValidationManager.validate_task()` pour créer entry
- [ ] Modifier `ValidationManager.refuse_task()` pour créer entry
- [ ] Modifier `HabitManager.record_completion()` pour créer entry
- [ ] Modifier `RewardManager.claim_reward()` pour créer entry
- [ ] Ajouter dans `ChildManager`: méthode `get_points_history()`

**Storage**:
- [ ] Modifier `StorageManager` pour sauver/charger `points_history`
- [ ] Ajouter désérialisation dans `load_children()`
- [ ] Tester persistance des données

**Services**:
- [ ] Créer service `get_points_history` dans `services.yaml`
- [ ] Implémenter handler dans `__init__.py`
- [ ] Ajouter constante `SERVICE_GET_POINTS_HISTORY` dans `const.py`
- [ ] Tester service via Developer Tools

**Frontend**:
- [ ] Créer composant `points-history.ts` en Lit Element
- [ ] Intégrer dans `habits-child-card.ts`
- [ ] Ajouter styles pour timeline
- [ ] Icônes par type d'action
- [ ] Couleurs vert/rouge pour +/-
- [ ] Tester sur mobile

**Tests**:
- [ ] Tests unitaires `PointsHistoryEntry.to_dict()`
- [ ] Tests unitaires `Child.add_history_entry()` avec limite 50
- [ ] Tests intégration: valider tâche → vérifier history
- [ ] Tests intégration: compléter habit → vérifier history
- [ ] Tests intégration: service `get_points_history`

**Documentation**:
- [ ] Mettre à jour `DATAMODELS.md` avec `PointsHistoryEntry`
- [ ] Mettre à jour `architecture.md` section "Points System"
- [ ] Créer ADR-XXX: "Points History Implementation"
- [ ] Ajouter exemples dans README
- [ ] Screenshots dans docs/

**Migration**:
- [ ] Créer migration v1→v2 pour ajouter `points_history` vide
- [ ] Tester migration sur données existantes
- [ ] Rollback plan si nécessaire

---

### 6.3 Conventions de Nommage

**Services**:
- Actions: `create_*`, `update_*`, `delete_*`, `get_*`, `list_*`
- Opérations spéciales: `validate_*`, `approve_*`, `claim_*`
- Bulk: `*_all_*` (ex: `reset_all_daily_tasks`)

**Modèles**:
- Classes: PascalCase (ex: `PointsHistoryEntry`)
- Champs: snake_case (ex: `points_delta`)
- Enums: PascalCase pour classe, UPPER_CASE pour valeurs

**Managers**:
- Fichiers: `*_manager.py`
- Classes: `*Manager` (ex: `BackupManager`)
- Méthodes publiques: verbes d'action (ex: `create_backup()`)
- Méthodes privées: prefix `_` (ex: `_validate_backup_data()`)

**Constantes**:
- Tout en UPPER_CASE dans `const.py`
- Groupées par thème avec commentaires

---

### 6.4 Template ADR

```markdown
# ADR-XXX: [Titre de la Décision]

**Date**: YYYY-MM-DD
**Statut**: [Proposé | Accepté | Déprécié | Remplacé]
**Auteur**: [Nom]

## Contexte
[Pourquoi cette décision est nécessaire]

## Décision
[Quelle approche a été choisie]

## Alternatives Considérées
1. **Option A**: ...
2. **Option B**: ...

## Conséquences

### Positives
- ...

### Négatives
- ...

## Implémentation
[Notes techniques sur l'implémentation]

## Références
- [Lien documentation]
- [Issue GitHub]
```

---

## Conclusion

Ce document de 180+ améliorations identifiées représente une roadmap ambitieuse pour faire évoluer Habits Manager vers un système encore plus robuste et complet.

**Priorités absolues**:
1. **Points History** - Transparence et audit trail
2. **Backup/Restore** - Protection des données
3. **Suspension Tâches** - Flexibilité d'utilisation
4. **Système de Migrations** - Évolutions sécurisées

**Next Steps**:
1. Créer les issues GitHub pour Phase 1
2. Implémenter Points History (4-6 jours)
3. Implémenter Backup/Restore (3-5 jours)
4. Release v2.0.0 avec ces fonctionnalités majeures

---

**Maintenance de ce Document**:
- Mettre à jour après chaque implémentation
- Marquer les items complétés avec ✅
- Ajouter nouvelles idées en bas de sections appropriées
- Review trimestrielle des priorités
