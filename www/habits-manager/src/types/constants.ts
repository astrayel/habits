/**
 * Constants matching Python backend constants
 * This file mirrors custom_components/habits_manager/const.py
 */

export const DOMAIN = 'habits_manager';

// Points and progression
export const DEFAULT_STARTING_POINTS = 0;
export const DEFAULT_STARTING_COINS = 0;
export const DEFAULT_STARTING_LEVEL = 1;
export const DEFAULT_STARTING_XP = 0;
export const BASE_XP_FOR_LEVEL_UP = 100;
export const XP_MULTIPLIER_PER_LEVEL = 1.2;

// Difficulty levels
export const DIFFICULTY_EASY = 1;
export const DIFFICULTY_MEDIUM = 2;
export const DIFFICULTY_HARD = 3;

// Rarity cost ranges
export const RARITY_COST = {
  common: { min: 10, max: 30 },
  rare: { min: 40, max: 80 },
  epic: { min: 100, max: 200 },
  legendary: { min: 250, max: 500 },
};

// Events
export const EVENT_UPDATE = `${DOMAIN}_update`;

// Services
export const SERVICES = {
  // Child services
  CREATE_CHILD: 'create_child',
  UPDATE_CHILD: 'update_child',
  DELETE_CHILD: 'delete_child',

  // Task services
  CREATE_TASK: 'create_task',
  UPDATE_TASK: 'update_task',
  DELETE_TASK: 'delete_task',
  MARK_TASK_COMPLETED: 'mark_task_completed',
  VALIDATE_TASK: 'validate_task',
  REFUSE_TASK: 'refuse_task',
  VALIDATE_PENALTY: 'validate_penalty',

  // Habit services
  CREATE_HABIT: 'create_habit',
  UPDATE_HABIT: 'update_habit',
  DELETE_HABIT: 'delete_habit',
  COMPLETE_HABIT: 'complete_habit',

  // Reward services
  CREATE_REWARD: 'create_reward',
  CLAIM_REWARD: 'claim_reward',
  APPROVE_CLAIM: 'approve_claim',

  // Cosmetic services
  CREATE_COSMETIC: 'create_cosmetic',
  PURCHASE_COSMETIC: 'purchase_cosmetic',

  // Listing services
  LIST_CHILDREN: 'list_children',
  LIST_TASKS: 'list_tasks',
  LIST_HABITS: 'list_habits',
  LIST_REWARDS: 'list_rewards',
  LIST_COSMETICS: 'list_cosmetics',
};

// Card types
export const CARD_TYPE_MANAGER = 'habits-manager-card';
export const CARD_TYPE_SUPERVISION = 'habits-supervision-card';
export const CARD_TYPE_CHILD = 'habits-child-card';

// UI Constants
export const DEFAULT_ICON = 'mdi:check-circle';
export const DEFAULT_TASK_COLOR = '#4CAF50';
export const DEFAULT_REWARD_COLOR = '#FF5722';
export const DEFAULT_HABIT_COLOR = '#2196F3';

// Validation rules
export const MAX_NAME_LENGTH = 50;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
