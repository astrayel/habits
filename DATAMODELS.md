# Modèles de données - Référence Backend ↔ Frontend

> **IMPORTANT :** Ce fichier est la source de vérité pour tous les modèles de données.
> Toute modification doit être synchronisée entre Python (backend) et TypeScript (frontend).

---

## Child (Enfant)

### Python (Backend)

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

@dataclass
class AvatarCustomization:
    """Personnalisation de l'avatar"""
    clothes: Optional[str] = None
    accessory: Optional[str] = None
    pet: Optional[str] = None
    theme: str = "default"

@dataclass
class Avatar:
    """Avatar de l'enfant"""
    photo_url: str
    customization: AvatarCustomization = field(default_factory=AvatarCustomization)

@dataclass
class Child:
    """Représentation d'un enfant dans le système"""
    id: str
    name: str
    person_entity: str  # Ex: "person.emma"
    points: int = 0
    coins: int = 0
    level: int = 1
    experience: int = 0
    experience_to_next_level: int = 100
    avatar: Avatar = field(default_factory=lambda: Avatar(photo_url=""))
    badges: List[str] = field(default_factory=list)
    owned_cosmetics: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> dict:
        """Convertit en dictionnaire pour stockage/API"""
        return {
            "id": self.id,
            "name": self.name,
            "person_entity": self.person_entity,
            "points": self.points,
            "coins": self.coins,
            "level": self.level,
            "experience": self.experience,
            "experience_to_next_level": self.experience_to_next_level,
            "avatar": {
                "photo_url": self.avatar.photo_url,
                "customization": {
                    "clothes": self.avatar.customization.clothes,
                    "accessory": self.avatar.customization.accessory,
                    "pet": self.avatar.customization.pet,
                    "theme": self.avatar.customization.theme,
                }
            },
            "badges": self.badges,
            "owned_cosmetics": self.owned_cosmetics,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
```

### TypeScript (Frontend)

```typescript
export interface AvatarCustomization {
  clothes: string | null;
  accessory: string | null;
  pet: string | null;
  theme: string;
}

export interface Avatar {
  photo_url: string;
  customization: AvatarCustomization;
}

export interface Child {
  id: string;
  name: string;
  person_entity: string;
  points: number;
  coins: number;
  level: number;
  experience: number;
  experience_to_next_level: number;
  avatar: Avatar;
  badges: string[];
  owned_cosmetics: string[];
  created_at: string;  // ISO 8601 format
  updated_at: string;  // ISO 8601 format
}

export const DEFAULT_AVATAR_CUSTOMIZATION: AvatarCustomization = {
  clothes: null,
  accessory: null,
  pet: null,
  theme: 'default',
};
```

---

## Task (Tâche)

### Python (Backend)

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
from enum import Enum

class TaskType(Enum):
    """Type de tâche"""
    MANDATORY = "mandatory"
    BONUS = "bonus"

class ScheduleType(Enum):
    """Type de planning"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    SPECIFIC_DATE = "specific_date"

class TaskCategory(Enum):
    """Catégorie de tâche"""
    CHORES = "chores"
    HOMEWORK = "homework"
    PERSONAL = "personal"
    OTHER = "other"

@dataclass
class TaskSchedule:
    """Planning d'une tâche"""
    type: ScheduleType
    days: Optional[List[int]] = None  # 1=Lundi, 7=Dimanche
    time: Optional[str] = None  # Format "HH:MM"
    specific_date: Optional[datetime] = None

@dataclass
class TaskRewards:
    """Récompenses d'une tâche"""
    points: int = 0
    coins: int = 0
    experience: int = 0

@dataclass
class TaskPenalties:
    """Pénalités d'une tâche"""
    points: int = 0
    coins: int = 0

@dataclass
class Task:
    """Définition d'une tâche"""
    id: str
    title: str
    description: str
    type: TaskType
    assigned_to: List[str]  # Liste d'IDs d'enfants
    schedule: TaskSchedule
    rewards: TaskRewards
    penalties: TaskPenalties
    icon: str = "mdi:check-circle"
    color: str = "#4CAF50"
    difficulty: int = 1  # 1=Facile, 2=Moyen, 3=Difficile
    estimated_duration: int = 10  # minutes
    category: TaskCategory = TaskCategory.OTHER
    active: bool = True
    created_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "type": self.type.value,
            "assigned_to": self.assigned_to,
            "schedule": {
                "type": self.schedule.type.value,
                "days": self.schedule.days,
                "time": self.schedule.time,
                "specific_date": self.schedule.specific_date.isoformat() if self.schedule.specific_date else None,
            },
            "rewards": {
                "points": self.rewards.points,
                "coins": self.rewards.coins,
                "experience": self.rewards.experience,
            },
            "penalties": {
                "points": self.penalties.points,
                "coins": self.penalties.coins,
            },
            "icon": self.icon,
            "color": self.color,
            "difficulty": self.difficulty,
            "estimated_duration": self.estimated_duration,
            "category": self.category.value,
            "active": self.active,
            "created_at": self.created_at.isoformat(),
        }
```

### TypeScript (Frontend)

```typescript
export enum TaskType {
  MANDATORY = 'mandatory',
  BONUS = 'bonus',
}

export enum ScheduleType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SPECIFIC_DATE = 'specific_date',
}

export enum TaskCategory {
  CHORES = 'chores',
  HOMEWORK = 'homework',
  PERSONAL = 'personal',
  OTHER = 'other',
}

export interface TaskSchedule {
  type: ScheduleType;
  days?: number[];  // 1=Monday, 7=Sunday
  time?: string;    // Format "HH:MM"
  specific_date?: string;  // ISO 8601
}

export interface TaskRewards {
  points: number;
  coins: number;
  experience: number;
}

export interface TaskPenalties {
  points: number;
  coins: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  assigned_to: string[];
  schedule: TaskSchedule;
  rewards: TaskRewards;
  penalties: TaskPenalties;
  icon: string;
  color: string;
  difficulty: number;  // 1-3
  estimated_duration: number;  // minutes
  category: TaskCategory;
  active: boolean;
  created_at: string;  // ISO 8601
}
```

---

## TaskInstance (Instance de tâche)

### Python (Backend)

```python
from enum import Enum
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional

class TaskInstanceStatus(Enum):
    """Statut d'une instance de tâche"""
    PENDING = "pending"
    COMPLETED_WAITING = "completed_waiting"
    VALIDATED = "validated"
    REFUSED = "refused"
    FAILED = "failed"

@dataclass
class TaskInstance:
    """Instance concrète d'une tâche pour un enfant à une date donnée"""
    id: str
    task_id: str
    child_id: str
    date: date
    status: TaskInstanceStatus = TaskInstanceStatus.PENDING
    completed_at: Optional[datetime] = None
    validated_at: Optional[datetime] = None
    validator_id: Optional[str] = None
    validation_note: str = ""
    is_penalty_applied: bool = False

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "task_id": self.task_id,
            "child_id": self.child_id,
            "date": self.date.isoformat(),
            "status": self.status.value,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "validated_at": self.validated_at.isoformat() if self.validated_at else None,
            "validator_id": self.validator_id,
            "validation_note": self.validation_note,
            "is_penalty_applied": self.is_penalty_applied,
        }
```

### TypeScript (Frontend)

```typescript
export enum TaskInstanceStatus {
  PENDING = 'pending',
  COMPLETED_WAITING = 'completed_waiting',
  VALIDATED = 'validated',
  REFUSED = 'refused',
  FAILED = 'failed',
}

export interface TaskInstance {
  id: string;
  task_id: string;
  child_id: string;
  date: string;  // ISO 8601 date
  status: TaskInstanceStatus;
  completed_at: string | null;  // ISO 8601
  validated_at: string | null;  // ISO 8601
  validator_id: string | null;
  validation_note: string;
  is_penalty_applied: boolean;
}
```

---

## Habit (Habitude)

### Python (Backend)

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import List

class HabitFrequency(Enum):
    """Fréquence d'une habitude"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class StreakBonusType(Enum):
    """Type de bonus de streak"""
    PROGRESSIVE = "progressive"
    FIXED = "fixed"

@dataclass
class StreakBonus:
    """Configuration du bonus de streak"""
    enabled: bool = True
    type: StreakBonusType = StreakBonusType.PROGRESSIVE
    multiplier: float = 0.1  # +10% par unité de streak

@dataclass
class HabitRewards:
    """Récompenses d'une habitude"""
    points: int = 0
    coins: int = 0
    experience: int = 0
    streak_bonus: StreakBonus = field(default_factory=StreakBonus)

@dataclass
class Habit:
    """Définition d'une habitude"""
    id: str
    title: str
    description: str
    icon: str
    color: str
    frequency: HabitFrequency
    rewards: HabitRewards
    active: bool = True
    assigned_to: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
            "color": self.color,
            "frequency": self.frequency.value,
            "rewards": {
                "points": self.rewards.points,
                "coins": self.rewards.coins,
                "experience": self.rewards.experience,
                "streak_bonus": {
                    "enabled": self.rewards.streak_bonus.enabled,
                    "type": self.rewards.streak_bonus.type.value,
                    "multiplier": self.rewards.streak_bonus.multiplier,
                }
            },
            "active": self.active,
            "assigned_to": self.assigned_to,
        }
```

### TypeScript (Frontend)

```typescript
export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum StreakBonusType {
  PROGRESSIVE = 'progressive',
  FIXED = 'fixed',
}

export interface StreakBonus {
  enabled: boolean;
  type: StreakBonusType;
  multiplier: number;
}

export interface HabitRewards {
  points: number;
  coins: number;
  experience: number;
  streak_bonus: StreakBonus;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  rewards: HabitRewards;
  active: boolean;
  assigned_to: string[];
}
```

---

## HabitStreak (Streak d'habitude)

### Python (Backend)

```python
from dataclasses import dataclass, field
from datetime import date
from typing import List

@dataclass
class StreakHistoryEntry:
    """Entrée dans l'historique de streak"""
    date: date
    completed: bool

    def to_dict(self) -> dict:
        return {
            "date": self.date.isoformat(),
            "completed": self.completed,
        }

@dataclass
class HabitStreak:
    """Streak d'une habitude pour un enfant"""
    id: str
    habit_id: str
    child_id: str
    current_streak: int = 0
    longest_streak: int = 0
    last_completed: Optional[date] = None
    total_completions: int = 0
    streak_history: List[StreakHistoryEntry] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "habit_id": self.habit_id,
            "child_id": self.child_id,
            "current_streak": self.current_streak,
            "longest_streak": self.longest_streak,
            "last_completed": self.last_completed.isoformat() if self.last_completed else None,
            "total_completions": self.total_completions,
            "streak_history": [entry.to_dict() for entry in self.streak_history],
        }
```

### TypeScript (Frontend)

```typescript
export interface StreakHistoryEntry {
  date: string;  // ISO 8601
  completed: boolean;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  child_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed: string | null;  // ISO 8601
  total_completions: number;
  streak_history: StreakHistoryEntry[];
}
```

---

## Reward (Récompense)

### Python (Backend)

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

class RewardType(Enum):
    """Type de récompense"""
    SCREEN_TIME = "screen_time"
    MEAL_CHOICE = "meal_choice"
    ACTIVITY = "activity"
    OTHER = "other"

@dataclass
class Reward:
    """Définition d'une récompense"""
    id: str
    title: str
    description: str
    type: RewardType
    cost_points: int  # Coût en points
    cost_coins: int = 0  # 0 pour récompenses réelles
    icon: str = "mdi:gift"
    color: str = "#FF5722"
    stock: Optional[int] = None  # None = illimité
    cooldown_days: int = 0
    active: bool = True
    requires_parent_approval: bool = True

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "type": self.type.value,
            "cost_points": self.cost_points,
            "cost_coins": self.cost_coins,
            "icon": self.icon,
            "color": self.color,
            "stock": self.stock,
            "cooldown_days": self.cooldown_days,
            "active": self.active,
            "requires_parent_approval": self.requires_parent_approval,
        }
```

### TypeScript (Frontend)

```typescript
export enum RewardType {
  SCREEN_TIME = 'screen_time',
  MEAL_CHOICE = 'meal_choice',
  ACTIVITY = 'activity',
  OTHER = 'other',
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: RewardType;
  cost_points: number;
  cost_coins: number;
  icon: string;
  color: string;
  stock: number | null;
  cooldown_days: number;
  active: boolean;
  requires_parent_approval: boolean;
}
```

---

## RewardClaim (Réclamation de récompense)

### Python (Backend)

```python
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional

class RewardClaimStatus(Enum):
    """Statut d'une réclamation"""
    PENDING = "pending"
    APPROVED = "approved"
    USED = "used"
    EXPIRED = "expired"

@dataclass
class RewardClaim:
    """Réclamation d'une récompense par un enfant"""
    id: str
    reward_id: str
    child_id: str
    claimed_at: datetime = field(default_factory=datetime.now)
    status: RewardClaimStatus = RewardClaimStatus.PENDING
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "reward_id": self.reward_id,
            "child_id": self.child_id,
            "claimed_at": self.claimed_at.isoformat(),
            "status": self.status.value,
            "approved_by": self.approved_by,
            "approved_at": self.approved_at.isoformat() if self.approved_at else None,
            "used_at": self.used_at.isoformat() if self.used_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }
```

### TypeScript (Frontend)

```typescript
export enum RewardClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  USED = 'used',
  EXPIRED = 'expired',
}

export interface RewardClaim {
  id: string;
  reward_id: string;
  child_id: string;
  claimed_at: string;  // ISO 8601
  status: RewardClaimStatus;
  approved_by: string | null;
  approved_at: string | null;  // ISO 8601
  used_at: string | null;  // ISO 8601
  expires_at: string | null;  // ISO 8601
}
```

---

## CosmeticItem (Élément cosmétique)

### Python (Backend)

```python
from dataclasses import dataclass
from enum import Enum
from typing import Optional, Dict, Any

class CosmeticCategory(Enum):
    """Catégorie de cosmétique"""
    CLOTHES = "clothes"
    ACCESSORY = "accessory"
    PET = "pet"
    THEME = "theme"
    BADGE = "badge"
    ANIMATION = "animation"

class CosmeticRarity(Enum):
    """Rareté d'un cosmétique"""
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"

@dataclass
class CosmeticUnlockRequirements:
    """Prérequis pour déverrouiller un cosmétique"""
    level: Optional[int] = None
    badge: Optional[str] = None

@dataclass
class CosmeticItem:
    """Élément cosmétique"""
    id: str
    name: str
    description: str
    category: CosmeticCategory
    subcategory: str  # Ex: "shirt", "hat", "dog", etc.
    rarity: CosmeticRarity
    cost_coins: int
    preview_image: str
    unlock_requirements: Optional[CosmeticUnlockRequirements] = None
    active: bool = True

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category.value,
            "subcategory": self.subcategory,
            "rarity": self.rarity.value,
            "cost_coins": self.cost_coins,
            "preview_image": self.preview_image,
            "unlock_requirements": {
                "level": self.unlock_requirements.level,
                "badge": self.unlock_requirements.badge,
            } if self.unlock_requirements else None,
            "active": self.active,
        }
```

### TypeScript (Frontend)

```typescript
export enum CosmeticCategory {
  CLOTHES = 'clothes',
  ACCESSORY = 'accessory',
  PET = 'pet',
  THEME = 'theme',
  BADGE = 'badge',
  ANIMATION = 'animation',
}

export enum CosmeticRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface CosmeticUnlockRequirements {
  level?: number;
  badge?: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  subcategory: string;
  rarity: CosmeticRarity;
  cost_coins: number;
  preview_image: string;
  unlock_requirements: CosmeticUnlockRequirements | null;
  active: boolean;
}
```

---

## Badge (Badge de réussite)

### Python (Backend)

```python
from dataclasses import dataclass
from enum import Enum

class BadgeConditionType(Enum):
    """Type de condition pour déverrouiller un badge"""
    FIRST_TASK = "first_task"
    TASKS_COUNT = "tasks_count"
    STREAK_DAYS = "streak_days"
    LEVEL_REACHED = "level_reached"
    POINTS_EARNED = "points_earned"

@dataclass
class Badge:
    """Badge de réussite"""
    id: str
    name: str
    description: str
    icon: str
    color: str
    condition_type: BadgeConditionType
    condition_value: int  # Ex: 7 pour streak de 7 jours
    rarity: CosmeticRarity = CosmeticRarity.COMMON

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "icon": self.icon,
            "color": self.color,
            "condition_type": self.condition_type.value,
            "condition_value": self.condition_value,
            "rarity": self.rarity.value,
        }
```

### TypeScript (Frontend)

```typescript
export enum BadgeConditionType {
  FIRST_TASK = 'first_task',
  TASKS_COUNT = 'tasks_count',
  STREAK_DAYS = 'streak_days',
  LEVEL_REACHED = 'level_reached',
  POINTS_EARNED = 'points_earned',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition_type: BadgeConditionType;
  condition_value: number;
  rarity: CosmeticRarity;
}
```

---

## Événements Home Assistant

### Structure générique

```python
# Backend
event_data = {
    "update_type": "task_validated",  # Type d'événement
    "child_id": "child_001",
    "timestamp": datetime.now().isoformat(),
    # ... données spécifiques à l'événement
}
hass.bus.fire("habits_manager_update", event_data)
```

```typescript
// Frontend
interface HabitsManagerEvent {
  update_type: string;
  child_id: string;
  timestamp: string;
  [key: string]: any;  // Données additionnelles selon le type
}
```

### Types d'événements

| Type | Données additionnelles |
|------|------------------------|
| `task_completed` | `task_id`, `instance_id` |
| `task_validated` | `task_id`, `instance_id`, `rewards` |
| `task_refused` | `task_id`, `instance_id`, `reason` |
| `task_failed` | `task_id`, `instance_id`, `penalties` |
| `habit_completed` | `habit_id`, `streak` |
| `streak_increased` | `habit_id`, `current_streak`, `bonus` |
| `streak_broken` | `habit_id`, `lost_streak` |
| `reward_claimed` | `reward_id`, `claim_id` |
| `reward_approved` | `reward_id`, `claim_id` |
| `cosmetic_purchased` | `cosmetic_id`, `cost` |
| `level_up` | `new_level`, `old_level` |
| `badge_earned` | `badge_id`, `badge_name` |
| `points_changed` | `old_points`, `new_points`, `delta` |
| `coins_changed` | `old_coins`, `new_coins`, `delta` |

---

## Constantes

### Python

```python
# const.py

DOMAIN = "habits_manager"

# Points et progression
DEFAULT_STARTING_POINTS = 0
DEFAULT_STARTING_COINS = 0
DEFAULT_STARTING_LEVEL = 1
DEFAULT_STARTING_XP = 0
BASE_XP_FOR_LEVEL_UP = 100
XP_MULTIPLIER_PER_LEVEL = 1.2  # Chaque niveau nécessite 20% de XP en plus

# Niveaux de difficulté
DIFFICULTY_EASY = 1
DIFFICULTY_MEDIUM = 2
DIFFICULTY_HARD = 3

# Raretés
RARITY_COST = {
    "common": (10, 30),
    "rare": (40, 80),
    "epic": (100, 200),
    "legendary": (250, 500),
}

# Stockage
STORAGE_DIR = ".storage/habits_manager"
STORAGE_VERSION = 1

# Événements
EVENT_UPDATE = f"{DOMAIN}_update"

# Services
SERVICE_CREATE_CHILD = "create_child"
SERVICE_UPDATE_CHILD = "update_child"
SERVICE_DELETE_CHILD = "delete_child"
SERVICE_CREATE_TASK = "create_task"
SERVICE_UPDATE_TASK = "update_task"
SERVICE_DELETE_TASK = "delete_task"
SERVICE_MARK_TASK_COMPLETED = "mark_task_completed"
SERVICE_VALIDATE_TASK = "validate_task"
SERVICE_REFUSE_TASK = "refuse_task"
SERVICE_CREATE_HABIT = "create_habit"
SERVICE_UPDATE_HABIT = "update_habit"
SERVICE_DELETE_HABIT = "delete_habit"
SERVICE_COMPLETE_HABIT = "complete_habit"
SERVICE_CREATE_REWARD = "create_reward"
SERVICE_UPDATE_REWARD = "update_reward"
SERVICE_DELETE_REWARD = "delete_reward"
SERVICE_CLAIM_REWARD = "claim_reward"
SERVICE_APPROVE_CLAIM = "approve_claim"
SERVICE_CREATE_COSMETIC = "create_cosmetic"
SERVICE_PURCHASE_COSMETIC = "purchase_cosmetic"
SERVICE_VALIDATE_PENALTY = "validate_penalty"
```

### TypeScript

```typescript
// constants.ts

export const DOMAIN = 'habits_manager';

export const DEFAULT_STARTING_POINTS = 0;
export const DEFAULT_STARTING_COINS = 0;
export const DEFAULT_STARTING_LEVEL = 1;
export const DEFAULT_STARTING_XP = 0;
export const BASE_XP_FOR_LEVEL_UP = 100;
export const XP_MULTIPLIER_PER_LEVEL = 1.2;

export const DIFFICULTY_EASY = 1;
export const DIFFICULTY_MEDIUM = 2;
export const DIFFICULTY_HARD = 3;

export const RARITY_COST = {
  common: { min: 10, max: 30 },
  rare: { min: 40, max: 80 },
  epic: { min: 100, max: 200 },
  legendary: { min: 250, max: 500 },
};

export const EVENT_UPDATE = `${DOMAIN}_update`;

export const SERVICES = {
  CREATE_CHILD: 'create_child',
  UPDATE_CHILD: 'update_child',
  DELETE_CHILD: 'delete_child',
  CREATE_TASK: 'create_task',
  UPDATE_TASK: 'update_task',
  DELETE_TASK: 'delete_task',
  MARK_TASK_COMPLETED: 'mark_task_completed',
  VALIDATE_TASK: 'validate_task',
  REFUSE_TASK: 'refuse_task',
  CREATE_HABIT: 'create_habit',
  UPDATE_HABIT: 'update_habit',
  DELETE_HABIT: 'delete_habit',
  COMPLETE_HABIT: 'complete_habit',
  CREATE_REWARD: 'create_reward',
  UPDATE_REWARD: 'update_reward',
  DELETE_REWARD: 'delete_reward',
  CLAIM_REWARD: 'claim_reward',
  APPROVE_CLAIM: 'approve_claim',
  CREATE_COSMETIC: 'create_cosmetic',
  PURCHASE_COSMETIC: 'purchase_cosmetic',
  VALIDATE_PENALTY: 'validate_penalty',
};
```

---

## Validation des données

### Règles communes

**Child :**
- `name` : Non vide, max 50 caractères
- `person_entity` : Format `person.XXX`
- `points`, `coins`, `experience` : >= 0
- `level` : >= 1
- `badges`, `owned_cosmetics` : Listes d'IDs valides

**Task :**
- `title` : Non vide, max 100 caractères
- `assigned_to` : Au moins un enfant
- `difficulty` : 1-3
- `estimated_duration` : > 0
- `rewards.points`, `rewards.coins`, `rewards.experience` : >= 0
- `penalties.points`, `penalties.coins` : <= 0 (valeurs négatives)

**Habit :**
- `title` : Non vide, max 100 caractères
- `frequency` : daily | weekly | monthly
- `rewards.streak_bonus.multiplier` : >= 0

**Reward :**
- `title` : Non vide, max 100 caractères
- `cost_points` : >= 0
- `cost_coins` : >= 0
- `cooldown_days` : >= 0

**CosmeticItem :**
- `name` : Non vide, max 100 caractères
- `cost_coins` : >= 0
- `preview_image` : Chemin ou URL valide

---

**Document vivant - Dernière mise à jour : 2025-11-04**
