# Backend Structure - Habits Manager

Ce document explique l'organisation du code backend et le rôle de chaque module.

## Vue d'ensemble

```
custom_components/habits_manager/
├── __init__.py              # Point d'entrée de l'intégration
├── const.py                 # Constantes et configuration
├── manifest.json            # Métadonnées de l'intégration
├── services.yaml            # Définitions des services HA
├── sensor.py                # Définition des sensors
├── core/                    # Modèles et exceptions
│   ├── models.py           # Dataclasses (Child, Task, etc.)
│   └── exceptions.py       # Exceptions personnalisées
├── managers/                # Logique métier
│   ├── child_manager.py    # Gestion des enfants
│   ├── task_manager.py     # Gestion des tâches
│   ├── habit_manager.py    # Gestion des habitudes
│   ├── reward_manager.py   # Gestion des récompenses
│   └── cosmetic_manager.py # Gestion des cosmétiques
├── storage/                 # Persistance des données
│   ├── storage_manager.py  # Opérations fichiers JSON
│   └── entity_manager.py   # Gestion des entités HA
├── services/                # Services utilitaires
│   ├── points_calculator.py   # Calculs de points
│   ├── level_calculator.py    # Système de niveaux/XP
│   └── scheduler.py           # Planification des tâches
└── www/                     # Ressources frontend
    ├── habits-manager-card.js
    ├── habits-supervision-card.js
    └── habits-child-card.js
```

---

## Point d'entrée

### `__init__.py`

Fichier principal qui initialise l'intégration Home Assistant.

**Fonctions principales:**

```python
async def async_setup(hass, config):
    """Setup de l'intégration (config YAML - legacy)."""
    return True

async def async_setup_entry(hass, entry):
    """
    Setup moderne de l'intégration (Config Flow).
    
    Ordre d'exécution:
    1. Créer tous les managers
    2. Charger les enfants depuis le storage
    3. Créer les entités (sensors) pour chaque enfant
    4. Générer les task instances pour aujourd'hui
    5. Enregistrer les services
    6. Charger la plateforme sensor
    """
    
async def register_services(hass):
    """
    Enregistre tous les services HA.
    ~20 services définis dans services.yaml
    """

async def register_frontend_resources(hass):
    """
    Enregistre les ressources frontend (cartes Lovelace).
    """
```

**Managers créés:**
- `StorageManager` - Lecture/écriture JSON
- `EntityManager` - Gestion entités HA
- `ChildManager` - Logique enfants
- `TaskManager` - Logique tâches
- `HabitManager` - Logique habitudes
- `RewardManager` - Logique récompenses
- `CosmeticManager` - Logique cosmétiques
- `Scheduler` - Planification automatique
- `PointsCalculator` - Calculs de points
- `LevelCalculator` - Calculs XP/level

**Stockage dans `hass.data[DOMAIN]`:**
```python
hass.data[DOMAIN] = {
    "storage": StorageManager(...),
    "entity_manager": EntityManager(...),
    "child_manager": ChildManager(...),
    "task_manager": TaskManager(...),
    "habit_manager": HabitManager(...),
    "reward_manager": RewardManager(...),
    "cosmetic_manager": CosmeticManager(...),
    "scheduler": Scheduler(...),
    "points_calculator": PointsCalculator(),
    "level_calculator": LevelCalculator(),
    "children_entities": {  # Données pour sensors
        "child_abc123": {
            "name": "Sophie",
            "points": 150,
            # ...
        }
    }
}
```

---

## Constantes

### `const.py`

Contient toutes les constantes et configurations du projet.

**Domaine:**
```python
DOMAIN = "habits_manager"
```

**Storage:**
```python
STORAGE_DIR = ".storage/habits_manager"
FILE_CHILDREN = "children.json"
FILE_TASKS = "tasks.json"
FILE_HABITS = "habits.json"
FILE_TASK_INSTANCES = "task_instances.json"
FILE_HABIT_STREAKS = "habit_streaks.json"
FILE_REWARDS = "rewards.json"
FILE_REWARD_CLAIMS = "reward_claims.json"
FILE_COSMETICS = "cosmetics.json"
```

**Services:**
```python
SERVICE_CREATE_CHILD = "create_child"
SERVICE_UPDATE_CHILD = "update_child"
SERVICE_DELETE_CHILD = "delete_child"
SERVICE_CREATE_TASK = "create_task"
# ... ~20 services au total
```

**Valeurs par défaut:**
```python
DEFAULT_STARTING_POINTS = 0
DEFAULT_STARTING_COINS = 0
DEFAULT_STARTING_LEVEL = 1
DEFAULT_STARTING_XP = 0
```

---

## Core

### `core/models.py`

Définit tous les modèles de données avec dataclasses Python.

**Modèles principaux:**

```python
@dataclass
class Child:
    id: str
    name: str
    person_entity: str
    points: int = 0
    coins: int = 0
    level: int = 1
    experience: int = 0
    # ...
    
    def to_dict(self) -> dict:
        """Conversion pour JSON/API"""
        
    @staticmethod
    def from_dict(data: dict) -> 'Child':
        """Reconstruction depuis JSON"""

@dataclass
class Task:
    id: str
    title: str
    description: str
    type: TaskType  # Enum
    assigned_to: List[str]
    schedule: TaskSchedule
    rewards: TaskRewards
    penalties: TaskPenalties
    # ...

@dataclass
class TaskInstance:
    """Instance quotidienne d'une tâche"""
    instance_id: str
    task_id: str
    child_id: str
    date: date
    status: TaskInstanceStatus  # Enum
    completed_at: Optional[datetime]

@dataclass
class Habit:
    id: str
    title: str
    assigned_to: List[str]
    # ...

@dataclass
class Reward:
    id: str
    title: str
    reward_type: RewardType  # Enum
    cost_points: int
    # ...

@dataclass
class CosmeticItem:
    id: str
    name: str
    category: CosmeticCategory  # Enum
    rarity: CosmeticRarity  # Enum
    cost_coins: int
    # ...
```

**Enums:**
```python
class TaskType(Enum):
    MANDATORY = "mandatory"
    BONUS = "bonus"

class TaskInstanceStatus(Enum):
    PENDING = "pending"
    COMPLETED_WAITING = "completed_waiting"
    VALIDATED = "validated"
    REFUSED = "refused"

class RewardType(Enum):
    SCREEN_TIME = "screen_time"
    OUTING = "outing"
    TOY = "toy"
    FOOD = "food"
    PRIVILEGE = "privilege"

class CosmeticCategory(Enum):
    CLOTHES = "clothes"
    ACCESSORY = "accessory"
    PET = "pet"
    THEME = "theme"

class CosmeticRarity(Enum):
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"
```

### `core/exceptions.py`

Exceptions personnalisées pour gestion d'erreurs explicite.

```python
class HabitsManagerError(Exception):
    """Base exception"""

class ChildNotFoundError(HabitsManagerError):
    """Enfant introuvable"""

class TaskNotFoundError(HabitsManagerError):
    """Tâche introuvable"""

class InsufficientPointsError(HabitsManagerError):
    """Pas assez de points"""

class InsufficientCoinsError(HabitsManagerError):
    """Pas assez de pièces"""

class ValidationError(HabitsManagerError):
    """Données invalides"""

class StorageError(HabitsManagerError):
    """Erreur de stockage"""
```

---

## Managers

Les managers contiennent toute la **logique métier**. Chaque manager est responsable d'un domaine fonctionnel.

### `managers/child_manager.py`

Gère le cycle de vie des enfants.

**Méthodes:**
```python
class ChildManager:
    async def create_child(name, person_entity) -> Child
    async def get_child(child_id) -> Child
    async def get_all_children() -> List[Child]
    async def update_child(child: Child) -> Child
    async def delete_child(child_id) -> None
    async def add_points(child_id, points) -> Child
    async def deduct_points(child_id, points) -> Child
    async def add_coins(child_id, coins) -> Child
    async def deduct_coins(child_id, coins) -> Child
    async def add_experience(child_id, xp) -> Child
    async def purchase_cosmetic(child_id, cosmetic_id) -> Child
```

**Responsabilités:**
- Validation des données enfant
- Calcul automatique de l'XP pour level-up
- Mise à jour des sensors via EntityManager
- Interaction avec StorageManager pour persistance

### `managers/task_manager.py`

Gère les tâches et leurs instances quotidiennes.

**Méthodes:**
```python
class TaskManager:
    async def create_task(...) -> Task
    async def get_task(task_id) -> Task
    async def get_all_tasks() -> List[Task]
    async def get_tasks_for_child(child_id) -> List[Task]
    async def update_task(task: Task) -> Task
    async def delete_task(task_id) -> None
    
    # Instances
    async def generate_task_instances(date) -> List[TaskInstance]
    async def get_task_instances(child_id, status, date) -> List[TaskInstance]
    async def mark_instance_completed(instance_id, child_id) -> TaskInstance
    async def validate_instance(instance_id) -> TaskInstance
    async def refuse_instance(instance_id, reason) -> TaskInstance
```

**Concepts clés:**

1. **Task vs TaskInstance:**
   - `Task` = Template (ex: "Ranger sa chambre")
   - `TaskInstance` = Instance quotidienne pour un enfant spécifique

2. **Génération d'instances:**
   - Au démarrage de HA
   - À minuit chaque jour (via Scheduler)
   - Basé sur `schedule` de la tâche

3. **Workflow de validation:**
   ```
   PENDING → (enfant complète) → COMPLETED_WAITING 
   → (parent valide) → VALIDATED
   → (parent refuse) → REFUSED
   ```

### `managers/habit_manager.py`

Gère les habitudes et le système de streaks.

**Méthodes:**
```python
class HabitManager:
    async def create_habit(...) -> Habit
    async def get_habit(habit_id) -> Habit
    async def get_all_habits() -> List[Habit]
    async def get_habits_for_child(child_id) -> List[Habit]
    async def complete_habit(habit_id, child_id, date) -> HabitStreak
    async def get_streak(habit_id, child_id) -> HabitStreak
    async def calculate_streak(habit_id, child_id) -> int
```

**Système de streaks:**
- Compte les jours consécutifs de complétion
- Applique des bonus à intervalles réguliers
- Réinitialise si jour manqué

### `managers/reward_manager.py`

Gère les récompenses et réclamations.

**Méthodes:**
```python
class RewardManager:
    async def create_reward(...) -> Reward
    async def get_reward(reward_id) -> Reward
    async def get_available_rewards(child_id) -> List[Reward]
    async def claim_reward(reward_id, child_id) -> RewardClaim
    async def approve_claim(claim_id) -> RewardClaim
    async def get_claims_for_child(child_id) -> List[RewardClaim]
```

**Workflow:**
1. Enfant réclame une récompense
2. Points sont déduits immédiatement
3. Si `requires_approval=true` → statut `PENDING`
4. Parent approuve → statut `APPROVED`

### `managers/cosmetic_manager.py`

Gère la boutique de cosmétiques.

**Méthodes:**
```python
class CosmeticManager:
    async def create_cosmetic(...) -> CosmeticItem
    async def get_cosmetic(cosmetic_id) -> CosmeticItem
    async def get_all_cosmetics() -> List[CosmeticItem]
    async def get_available_for_child(child_id) -> List[CosmeticItem]
    async def purchase_cosmetic(cosmetic_id, child_id) -> CosmeticItem
```

**Filtrage:**
- Niveau requis
- Déjà possédé
- Catégorie
- Rareté

---

## Storage

### `storage/storage_manager.py`

Gère la lecture/écriture des fichiers JSON.

**Méthodes:**
```python
class StorageManager:
    async def ensure_storage_dir() -> None
    async def load_json(filename) -> dict
    async def save_json(filename, data) -> None
    
    # Méthodes spécialisées par type
    async def load_children() -> List[Child]
    async def save_child(child: Child) -> None
    async def delete_child(child_id) -> None
    
    async def load_tasks() -> List[Task]
    async def save_task(task: Task) -> None
    # ... idem pour habits, rewards, cosmetics
```

**Localisation:**
- Chemin: `/config/.storage/habits_manager/`
- Format: JSON
- Un fichier par type de données

### `storage/entity_manager.py`

Gère les données des entités Home Assistant (pour sensors).

**Méthodes:**
```python
class EntityManager:
    async def create_child_entities(child: Child) -> None
    async def update_child_entities(child: Child) -> None
    async def delete_child_entities(child_id) -> None
    async def update_task_counts(child_id, pending, waiting) -> None
    async def update_longest_streak(child_id, streak) -> None
    def get_entity_data(child_id) -> dict
```

**Rôle:**
- Prépare les données pour `sensor.py`
- Stocke dans `hass.data[DOMAIN]["children_entities"]`
- Émet des événements pour mise à jour sensors

---

## Services

### `services/points_calculator.py`

Calcule les points/coins/XP selon la difficulté.

**Méthodes:**
```python
class PointsCalculator:
    def calculate_task_rewards(difficulty: int) -> dict:
        """
        Retourne: {"points": X, "coins": Y, "experience": Z}
        Basé sur la difficulté (1-3)
        """
    
    def calculate_habit_rewards() -> dict
    def calculate_penalty(difficulty: int) -> dict
```

### `services/level_calculator.py`

Gère le système de niveaux et XP.

**Méthodes:**
```python
class LevelCalculator:
    def calculate_xp_for_level(level: int) -> int:
        """XP nécessaire pour atteindre ce niveau"""
    
    def calculate_level_from_xp(xp: int) -> tuple[int, int]:
        """
        Retourne: (level, xp_to_next)
        Basé sur l'XP totale accumulée
        """
```

**Formule XP:**
```python
xp_required = 100 * (level ** 1.5)
```

### `services/scheduler.py`

Planification automatique des tâches.

**Méthodes:**
```python
class Scheduler:
    async def schedule_daily_tasks() -> None:
        """
        Appelé à minuit chaque jour.
        Génère les task instances pour aujourd'hui.
        """
```

---

## Sensors

### `sensor.py`

Définit tous les sensors Home Assistant.

**Point d'entrée:**
```python
async def async_setup_platform(hass, config, async_add_entities, discovery_info):
    """
    1. Récupère children_entities depuis hass.data
    2. Crée les sensors pour chaque enfant
    3. Ajoute les sensors globaux
    4. Enregistre le callback pour création dynamique
    """
```

**Classes de sensors:**
- `BaseChildSensor` - Classe de base pour tous les sensors enfant
- `ChildPointsSensor` - Points
- `ChildCoinsSensor` - Pièces
- `ChildLevelSensor` - Niveau
- `ChildExperienceSensor` - XP
- `ChildTasksPendingSensor` - Tâches pending
- `ChildTasksWaitingSensor` - Tâches waiting
- `ChildLongestStreakSensor` - Plus long streak
- `ChildTasksWaitingValidationListSensor` - Liste détaillée tâches
- `ChildPendingClaimsSensor` - Liste détaillée réclamations
- `ChildHasPendingValidationSensor` - Binary sensor
- `AllTaskInstancesSensor` - Sensor global instances
- `AllRewardClaimsSensor` - Sensor global claims

**Mise à jour:**
```python
async def async_added_to_hass(self):
    """S'abonne aux événements habits_manager_entity_update"""
    
    @callback
    def handle_entity_update(event):
        if event.data.get("child_id") == self._child_id:
            self.async_schedule_update_ha_state(True)
```

---

## Flux de données

### Exemple: Compléter une tâche

1. **Service call:** `habits_manager.mark_task_completed`
2. **__init__.py:** Route vers `handle_mark_task_completed`
3. **TaskManager:** `mark_instance_completed(instance_id, child_id)`
   - Change statut à `COMPLETED_WAITING`
   - Sauvegarde dans JSON
4. **EntityManager:** `update_task_counts(child_id, ...)`
   - Met à jour `hass.data[DOMAIN]["children_entities"][child_id]`
   - Émet événement `habits_manager_entity_update`
5. **Sensors:** Reçoivent l'événement
   - `ChildTasksWaitingSensor` se met à jour
   - `ChildHasPendingValidationSensor` passe à `on`
6. **Frontend:** Reçoit la mise à jour des sensors
   - Affiche la tâche en attente de validation

---

## Voir aussi

- [API_REFERENCE.md](./API_REFERENCE.md) - Documentation des services
- [SENSORS.md](./SENSORS.md) - Documentation des sensors
- [EVENTS.md](./EVENTS.md) - Système d'événements
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide du contributeur
