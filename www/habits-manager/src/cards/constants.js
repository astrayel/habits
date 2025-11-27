// Domaines de service
export const SERVICE_DOMAIN = 'habits_manager';
export const ENTITY_PREFIX = 'habits_manager';

// Mapping des services
export const SERVICE_MAPPING = {
  'complete_task': 'mark_task_completed',
  'claim_reward': 'claim_reward',
  'update_child': 'update_child',
  'remove_child': 'delete_child',
  'create_child': 'create_child',
  'list_children': 'list_children',
  'list_tasks': 'list_tasks',
  'list_rewards': 'list_rewards',
};

// Nouveaux services
export const NEW_SERVICES = [
  'validate_task',
  'refuse_task',
  'approve_claim',
  'complete_habit',
  'purchase_cosmetic',
  'list_habits',
  'list_cosmetics',
];

// Mapping des statuts de tâches
export const TASK_STATUS_MAPPING = {
  'pending': 'todo',
  'completed_waiting': 'completed',
  'validated': 'validated',
  'refused': 'todo',
  'failed': 'cancelled',
};

// Development mode flag (Phase 2)
export const DEV_MODE = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';
