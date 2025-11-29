// Domaines de service
export const SERVICE_DOMAIN = 'habits_manager';
export const ENTITY_PREFIX = 'habits_manager';

// ============================================================================
// MAPPING DES SERVICES BACKEND (40+ services)
// ============================================================================

// Services CRUD Enfants
export const CHILD_SERVICES = {
  'create_child': 'create_child',
  'update_child': 'update_child',
  'delete_child': 'delete_child',
  'add_points': 'add_points',
  'remove_points': 'remove_points',
  'set_points': 'set_points',
  'add_coins': 'add_coins',
  'remove_coins': 'remove_coins',
  'set_coins': 'set_coins',
  'get_child_history': 'get_child_history',
  'add_experience': 'add_experience',
  'set_level': 'set_level',
};

// Services CRUD Tâches
export const TASK_SERVICES = {
  'create_task': 'create_task',
  'update_task': 'update_task',
  'delete_task': 'delete_task',
  'mark_task_completed': 'mark_task_completed',
  'validate_task': 'validate_task',
  'refuse_task': 'refuse_task',
  'list_task_instances': 'list_task_instances',
  'get_task_instance': 'get_task_instance',
  'cancel_task_instance': 'cancel_task_instance',
  'reschedule_task_instance': 'reschedule_task_instance',
};

// Services CRUD Habitudes
export const HABIT_SERVICES = {
  'create_habit': 'create_habit',
  'update_habit': 'update_habit',
  'delete_habit': 'delete_habit',
  'mark_habit_completed': 'mark_habit_completed',
  'reset_streak': 'reset_streak',
  'get_habit_history': 'get_habit_history',
};

// Services CRUD Récompenses
export const REWARD_SERVICES = {
  'create_reward': 'create_reward',
  'update_reward': 'update_reward',
  'delete_reward': 'delete_reward',
  'claim_reward': 'claim_reward',
  'approve_claim': 'approve_claim',
  'refuse_claim': 'refuse_claim',
  'consume_claim': 'consume_claim',
  'list_claims': 'list_claims',
};

// Services CRUD Cosmétiques
export const COSMETIC_SERVICES = {
  'create_cosmetic': 'create_cosmetic',
  'update_cosmetic': 'update_cosmetic',
  'delete_cosmetic': 'delete_cosmetic',
  'purchase_cosmetic': 'purchase_cosmetic',
  'equip_cosmetic': 'equip_cosmetic',
  'unequip_cosmetic': 'unequip_cosmetic',
  'list_owned_cosmetics': 'list_owned_cosmetics',
};

// Services de listage
export const LIST_SERVICES = {
  'list_children': 'list_children',
  'list_tasks': 'list_tasks',
  'list_habits': 'list_habits',
  'list_rewards': 'list_rewards',
  'list_cosmetics': 'list_cosmetics',
};

// Services statistiques
export const STATS_SERVICES = {
  'get_child_stats': 'get_child_stats',
  'get_weekly_report': 'get_weekly_report',
  'compare_children': 'compare_children',
};

// Services configuration
export const CONFIG_SERVICES = {
  'create_category': 'create_category',
  'list_categories': 'list_categories',
  'update_level_config': 'update_level_config',
  'get_system_config': 'get_system_config',
};

// Mapping complet de tous les services (pour compatibilité)
export const SERVICE_MAPPING = {
  ...CHILD_SERVICES,
  ...TASK_SERVICES,
  ...HABIT_SERVICES,
  ...REWARD_SERVICES,
  ...COSMETIC_SERVICES,
  ...LIST_SERVICES,
  ...STATS_SERVICES,
  ...CONFIG_SERVICES,
  // Alias pour rétrocompatibilité
  'complete_task': 'mark_task_completed',
  'remove_child': 'delete_child',
  'complete_habit': 'mark_habit_completed',
};

// Pour rétrocompatibilité avec l'ancien code
export const NEW_SERVICES = SERVICE_MAPPING;

// ============================================================================
// MAPPING DES STATUTS
// ============================================================================

// Mapping des statuts de tâches (TaskInstanceStatus)
export const TASK_STATUS_MAPPING = {
  'pending': 'todo',
  'completed_waiting': 'completed',
  'validated': 'validated',
  'refused': 'todo',
  'failed': 'cancelled',
  'cancelled': 'cancelled',
};

// Mapping des statuts de réclamations (RewardClaimStatus)
export const CLAIM_STATUS_MAPPING = {
  'pending': 'pending',
  'approved': 'approved',
  'refused': 'refused',
  'used': 'consumed',
  'consumed': 'consumed',
  'expired': 'expired',
};
