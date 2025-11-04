"""Constants for the Habits Manager integration."""
import logging

# Domain
DOMAIN = "habits_manager"

# Logging
_LOGGER = logging.getLogger(__name__)

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

# Raretés (min, max)
RARITY_COST = {
    "common": (10, 30),
    "rare": (40, 80),
    "epic": (100, 200),
    "legendary": (250, 500),
}

# Stockage
STORAGE_DIR = ".storage/habits_manager"
STORAGE_VERSION = 1

# Fichiers de stockage
FILE_CHILDREN = "children.json"
FILE_TASKS = "tasks.json"
FILE_HABITS = "habits.json"
FILE_TASK_INSTANCES = "task_instances.json"
FILE_HABIT_STREAKS = "habit_streaks.json"
FILE_REWARDS = "rewards.json"
FILE_REWARD_CLAIMS = "reward_claims.json"
FILE_COSMETICS = "cosmetics.json"

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

# Entités
SENSOR_PREFIX = f"sensor.{DOMAIN}_"
BINARY_SENSOR_PREFIX = f"binary_sensor.{DOMAIN}_"
