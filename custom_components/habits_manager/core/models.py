"""Data models for Habits Manager.

All dataclasses defined here match the specifications in DATAMODELS.md.
Each model has a to_dict() method for JSON serialization.
"""
from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional
from enum import Enum


# ============================================================================
# ENUMS
# ============================================================================


class TaskType(Enum):
    """Type de tâche."""
    MANDATORY = "mandatory"
    BONUS = "bonus"


class ScheduleType(Enum):
    """Type de planning."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    SPECIFIC_DATE = "specific_date"


class TaskCategory(Enum):
    """Catégorie de tâche."""
    CHORES = "chores"
    HOMEWORK = "homework"
    PERSONAL = "personal"
    OTHER = "other"


class TaskInstanceStatus(Enum):
    """Statut d'une instance de tâche."""
    PENDING = "pending"
    COMPLETED_WAITING = "completed_waiting"
    VALIDATED = "validated"
    REFUSED = "refused"
    FAILED = "failed"


class HabitFrequency(Enum):
    """Fréquence d'une habitude."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class StreakBonusType(Enum):
    """Type de bonus de streak."""
    PROGRESSIVE = "progressive"
    FIXED = "fixed"


class RewardType(Enum):
    """Type de récompense."""
    SCREEN_TIME = "screen_time"
    MEAL_CHOICE = "meal_choice"
    ACTIVITY = "activity"
    OTHER = "other"


class RewardClaimStatus(Enum):
    """Statut d'une réclamation."""
    PENDING = "pending"
    APPROVED = "approved"
    USED = "used"
    EXPIRED = "expired"


class CosmeticCategory(Enum):
    """Catégorie de cosmétique."""
    CLOTHES = "clothes"
    ACCESSORY = "accessory"
    PET = "pet"
    THEME = "theme"
    BADGE = "badge"
    ANIMATION = "animation"


class CosmeticRarity(Enum):
    """Rareté d'un cosmétique."""
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"


class BadgeConditionType(Enum):
    """Type de condition pour déverrouiller un badge."""
    FIRST_TASK = "first_task"
    TASKS_COUNT = "tasks_count"
    STREAK_DAYS = "streak_days"
    LEVEL_REACHED = "level_reached"
    POINTS_EARNED = "points_earned"


# ============================================================================
# CHILD (ENFANT)
# ============================================================================


@dataclass
class AvatarCustomization:
    """Personnalisation de l'avatar."""
    clothes: Optional[str] = None
    accessory: Optional[str] = None
    pet: Optional[str] = None
    theme: str = "default"

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "clothes": self.clothes,
            "accessory": self.accessory,
            "pet": self.pet,
            "theme": self.theme,
        }


@dataclass
class Avatar:
    """Avatar de l'enfant."""
    photo_url: str
    customization: AvatarCustomization = field(default_factory=AvatarCustomization)

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "photo_url": self.photo_url,
            "customization": self.customization.to_dict(),
        }


@dataclass
class Child:
    """Représentation d'un enfant dans le système."""
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
        """Convertit en dictionnaire pour stockage/API."""
        return {
            "id": self.id,
            "name": self.name,
            "person_entity": self.person_entity,
            "points": self.points,
            "coins": self.coins,
            "level": self.level,
            "experience": self.experience,
            "experience_to_next_level": self.experience_to_next_level,
            "avatar": self.avatar.to_dict(),
            "badges": self.badges,
            "owned_cosmetics": self.owned_cosmetics,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


# ============================================================================
# TASK (TÂCHE)
# ============================================================================


@dataclass
class TaskSchedule:
    """Planning d'une tâche."""
    type: ScheduleType
    days: Optional[List[int]] = None  # 1=Lundi, 7=Dimanche
    time: Optional[str] = None  # Format "HH:MM"
    specific_date: Optional[datetime] = None

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "type": self.type.value,
            "days": self.days,
            "time": self.time,
            "specific_date": self.specific_date.isoformat() if self.specific_date else None,
        }


@dataclass
class TaskRewards:
    """Récompenses d'une tâche."""
    points: int = 0
    coins: int = 0
    experience: int = 0

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "points": self.points,
            "coins": self.coins,
            "experience": self.experience,
        }


@dataclass
class TaskPenalties:
    """Pénalités d'une tâche."""
    points: int = 0
    coins: int = 0

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "points": self.points,
            "coins": self.coins,
        }


@dataclass
class Task:
    """Définition d'une tâche."""
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
        """Convertit en dictionnaire."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "type": self.type.value,
            "assigned_to": self.assigned_to,
            "schedule": self.schedule.to_dict(),
            "rewards": self.rewards.to_dict(),
            "penalties": self.penalties.to_dict(),
            "icon": self.icon,
            "color": self.color,
            "difficulty": self.difficulty,
            "estimated_duration": self.estimated_duration,
            "category": self.category.value,
            "active": self.active,
            "created_at": self.created_at.isoformat(),
        }


@dataclass
class TaskInstance:
    """Instance concrète d'une tâche pour un enfant à une date donnée."""
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
        """Convertit en dictionnaire."""
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


# ============================================================================
# HABIT (HABITUDE)
# ============================================================================


@dataclass
class StreakBonus:
    """Configuration du bonus de streak."""
    enabled: bool = True
    type: StreakBonusType = StreakBonusType.PROGRESSIVE
    multiplier: float = 0.1  # +10% par unité de streak

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "enabled": self.enabled,
            "type": self.type.value,
            "multiplier": self.multiplier,
        }


@dataclass
class HabitRewards:
    """Récompenses d'une habitude."""
    points: int = 0
    coins: int = 0
    experience: int = 0
    streak_bonus: StreakBonus = field(default_factory=StreakBonus)

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "points": self.points,
            "coins": self.coins,
            "experience": self.experience,
            "streak_bonus": self.streak_bonus.to_dict(),
        }


@dataclass
class Habit:
    """Définition d'une habitude."""
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
        """Convertit en dictionnaire."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
            "color": self.color,
            "frequency": self.frequency.value,
            "rewards": self.rewards.to_dict(),
            "active": self.active,
            "assigned_to": self.assigned_to,
        }


@dataclass
class StreakHistoryEntry:
    """Entrée dans l'historique de streak."""
    date: date
    completed: bool

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "date": self.date.isoformat(),
            "completed": self.completed,
        }


@dataclass
class HabitStreak:
    """Streak d'une habitude pour un enfant."""
    id: str
    habit_id: str
    child_id: str
    current_streak: int = 0
    longest_streak: int = 0
    last_completed: Optional[date] = None
    total_completions: int = 0
    streak_history: List[StreakHistoryEntry] = field(default_factory=list)

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
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


# ============================================================================
# REWARD (RÉCOMPENSE)
# ============================================================================


@dataclass
class Reward:
    """Définition d'une récompense."""
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
        """Convertit en dictionnaire."""
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


@dataclass
class RewardClaim:
    """Réclamation d'une récompense par un enfant."""
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
        """Convertit en dictionnaire."""
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


# ============================================================================
# COSMETIC (COSMÉTIQUE)
# ============================================================================


@dataclass
class CosmeticUnlockRequirements:
    """Prérequis pour déverrouiller un cosmétique."""
    level: Optional[int] = None
    badge: Optional[str] = None

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
        return {
            "level": self.level,
            "badge": self.badge,
        }


@dataclass
class CosmeticItem:
    """Élément cosmétique."""
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
        """Convertit en dictionnaire."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category.value,
            "subcategory": self.subcategory,
            "rarity": self.rarity.value,
            "cost_coins": self.cost_coins,
            "preview_image": self.preview_image,
            "unlock_requirements": self.unlock_requirements.to_dict() if self.unlock_requirements else None,
            "active": self.active,
        }


# ============================================================================
# BADGE
# ============================================================================


@dataclass
class Badge:
    """Badge de réussite."""
    id: str
    name: str
    description: str
    icon: str
    color: str
    condition_type: BadgeConditionType
    condition_value: int  # Ex: 7 pour streak de 7 jours
    rarity: CosmeticRarity = CosmeticRarity.COMMON

    def to_dict(self) -> dict:
        """Convertit en dictionnaire."""
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
