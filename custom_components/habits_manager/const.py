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
FILE_CATEGORIES = "categories.json"
FILE_SYSTEM_CONFIG = "system_config.json"

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
SERVICE_MARK_HABIT_COMPLETED = "mark_habit_completed"
SERVICE_CREATE_REWARD = "create_reward"
SERVICE_UPDATE_REWARD = "update_reward"
SERVICE_DELETE_REWARD = "delete_reward"
SERVICE_CLAIM_REWARD = "claim_reward"
SERVICE_APPROVE_CLAIM = "approve_claim"
SERVICE_REFUSE_CLAIM = "refuse_claim"
SERVICE_CONSUME_CLAIM = "consume_claim"
SERVICE_CREATE_COSMETIC = "create_cosmetic"
SERVICE_UPDATE_COSMETIC = "update_cosmetic"
SERVICE_DELETE_COSMETIC = "delete_cosmetic"
SERVICE_PURCHASE_COSMETIC = "purchase_cosmetic"
SERVICE_EQUIP_COSMETIC = "equip_cosmetic"
SERVICE_UNEQUIP_COSMETIC = "unequip_cosmetic"
SERVICE_LIST_OWNED_COSMETICS = "list_owned_cosmetics"
SERVICE_RESET_STREAK = "reset_streak"
SERVICE_GET_HABIT_HISTORY = "get_habit_history"
SERVICE_VALIDATE_PENALTY = "validate_penalty"
SERVICE_LIST_CHILDREN = "list_children"
SERVICE_LIST_TASKS = "list_tasks"
SERVICE_LIST_HABITS = "list_habits"
SERVICE_LIST_REWARDS = "list_rewards"
SERVICE_LIST_COSMETICS = "list_cosmetics"
SERVICE_LIST_TASK_INSTANCES = "list_task_instances"
SERVICE_LIST_CLAIMS = "list_claims"
SERVICE_GET_TASK_INSTANCE = "get_task_instance"
SERVICE_CANCEL_TASK_INSTANCE = "cancel_task_instance"
SERVICE_RESCHEDULE_TASK_INSTANCE = "reschedule_task_instance"
SERVICE_GET_CHILD_STATS = "get_child_stats"
SERVICE_GET_WEEKLY_REPORT = "get_weekly_report"
SERVICE_COMPARE_CHILDREN = "compare_children"
SERVICE_GET_POINTS_HISTORY = "get_points_history"
SERVICE_GET_CHILD_HISTORY = "get_child_history"
SERVICE_BACKUP_DATA = "backup_data"
SERVICE_RESTORE_DATA = "restore_data"
SERVICE_SUSPEND_TASK = "suspend_task"
SERVICE_RESUME_TASK = "resume_task"
SERVICE_CHECK_EXPIRED_SUSPENSIONS = "check_expired_suspensions"
SERVICE_ADD_POINTS = "add_points"
SERVICE_REMOVE_POINTS = "remove_points"
SERVICE_SET_POINTS = "set_points"
SERVICE_ADD_COINS = "add_coins"
SERVICE_REMOVE_COINS = "remove_coins"
SERVICE_SET_COINS = "set_coins"
SERVICE_RESET_DAILY_TASKS = "reset_daily_tasks"
SERVICE_RESET_WEEKLY_TASKS = "reset_weekly_tasks"
SERVICE_RESET_MONTHLY_TASKS = "reset_monthly_tasks"
SERVICE_CLEAR_ALL_DATA = "clear_all_data"
SERVICE_ADD_EXPERIENCE = "add_experience"
SERVICE_SET_LEVEL = "set_level"
SERVICE_CREATE_CATEGORY = "create_category"
SERVICE_LIST_CATEGORIES = "list_categories"
SERVICE_UPDATE_LEVEL_CONFIG = "update_level_config"
SERVICE_GET_SYSTEM_CONFIG = "get_system_config"

# Entités
SENSOR_PREFIX = f"sensor.{DOMAIN}_"
BINARY_SENSOR_PREFIX = f"binary_sensor.{DOMAIN}_"
