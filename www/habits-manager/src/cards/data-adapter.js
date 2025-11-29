import { TASK_STATUS_MAPPING, CLAIM_STATUS_MAPPING } from './constants.js';

/**
 * DataAdapter - Transforme les données backend en format frontend
 *
 * Cette classe adapte les structures de données retournées par le backend
 * vers le format attendu par les composants frontend.
 */
export class DataAdapter {
  /**
   * Adapte un enfant du format backend vers frontend
   * @param {Object} habitsChild - Données enfant du backend
   * @returns {Object} Données adaptées pour le frontend
   */
  static adaptChild(habitsChild) {
    return {
      // Identifiants
      id: habitsChild.id,
      child_id: habitsChild.id,
      name: habitsChild.name,

      // Statistiques principales
      points: habitsChild.points || 0,
      coins: habitsChild.coins || 0,
      level: habitsChild.level || 1,
      experience: habitsChild.experience || 0,
      experience_to_next_level: habitsChild.experience_to_next_level || 100,

      // Avatar
      avatar: habitsChild.avatar?.photo_url || '👤',
      avatar_type: habitsChild.avatar?.photo_url ? 'url' : 'emoji',
      avatar_data: habitsChild.avatar?.photo_url,
      person_entity_id: habitsChild.person_entity,

      // Personnalisation
      cosmetics: {
        avatar: { emoji: habitsChild.avatar?.customization?.theme || '👤' },
        outfits: [
          habitsChild.avatar?.customization?.clothes,
          habitsChild.avatar?.customization?.accessory,
          habitsChild.avatar?.customization?.pet,
        ].filter(Boolean),
      },

      // Collections
      badges: habitsChild.badges || [],
      owned_cosmetics: habitsChild.owned_cosmetics || [],
      equipped_cosmetics: habitsChild.equipped_cosmetics || [],

      // Historique (limité aux 10 dernières entrées pour l'affichage)
      points_history: (habitsChild.points_history || []).slice(0, 10).map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        action_type: entry.action_type,
        points_delta: entry.points_delta,
        coins_delta: entry.coins_delta || 0,
        experience_delta: entry.experience_delta || 0,
        description: entry.description,
        related_entity_name: entry.related_entity_name,
      })),

      // Métadonnées
      created_at: habitsChild.created_at,
      updated_at: habitsChild.updated_at,
    };
  }

  /**
   * Adapte une tâche du format backend vers frontend
   * @param {Object} habitsTask - Définition de tâche du backend
   * @param {Array} instances - Instances de tâches associées
   * @returns {Object} Données adaptées pour le frontend
   */
  static adaptTask(habitsTask, instances = []) {
    const childInstances = instances.filter(i => i.task_id === habitsTask.id);
    const latestInstance = childInstances[childInstances.length - 1];

    return {
      // Identifiants
      id: habitsTask.id,
      task_id: habitsTask.id,

      // Informations de base
      name: habitsTask.title,
      title: habitsTask.title,
      description: habitsTask.description || '',
      icon: habitsTask.icon || 'mdi:check-circle',
      color: habitsTask.color || '#4CAF50',

      // Statut et progression
      status: this._mapTaskStatus(childInstances),
      active: habitsTask.active,
      suspended: habitsTask.suspended || false,
      suspended_until: habitsTask.suspended_until,
      suspended_reason: habitsTask.suspended_reason || '',

      // Récompenses et pénalités
      points: habitsTask.rewards?.points || 0,
      coins: habitsTask.rewards?.coins || 0,
      experience: habitsTask.rewards?.experience || 0,
      penalty_points: habitsTask.penalties?.points || 0,
      penalty_coins: habitsTask.penalties?.coins || 0,

      // Classification
      category: habitsTask.category || 'other',
      type: habitsTask.type || 'mandatory',
      frequency: this._mapFrequency(habitsTask),
      difficulty: habitsTask.difficulty || 1,
      estimated_duration: habitsTask.estimated_duration || 10,

      // Assignation
      assigned_children: habitsTask.assigned_to || [],
      assigned_child_ids: habitsTask.assigned_to || [],

      // Données de l'instance courante (si existe)
      instance_id: latestInstance?.id,
      completed_at: latestInstance?.completed_at,
      validated_at: latestInstance?.validated_at,
      validator_id: latestInstance?.validator_id,
      validation_note: latestInstance?.validation_note || '',
      photo_url: latestInstance?.photo_url,

      // Données d'annulation/replanification
      cancelled_at: latestInstance?.cancelled_at,
      cancel_reason: latestInstance?.cancel_reason || '',
      rescheduled_at: latestInstance?.rescheduled_at,
      rescheduled_from: latestInstance?.rescheduled_from,

      // Métadonnées
      created_at: habitsTask.created_at,

      // Toutes les instances pour ce child (pour historique)
      instances: childInstances.map(inst => this.adaptTaskInstance(inst)),
    };
  }

  /**
   * Adapte une instance de tâche individuelle
   * @param {Object} instance - Instance de tâche du backend
   * @returns {Object} Instance adaptée
   */
  static adaptTaskInstance(instance) {
    return {
      id: instance.id,
      task_id: instance.task_id,
      child_id: instance.child_id,
      date: instance.date,
      status: TASK_STATUS_MAPPING[instance.status] || instance.status,
      raw_status: instance.status,
      completed_at: instance.completed_at,
      validated_at: instance.validated_at,
      validator_id: instance.validator_id,
      validation_note: instance.validation_note || '',
      is_penalty_applied: instance.is_penalty_applied || false,
      photo_url: instance.photo_url,
      cancelled_at: instance.cancelled_at,
      cancel_reason: instance.cancel_reason || '',
      rescheduled_at: instance.rescheduled_at,
      rescheduled_from: instance.rescheduled_from,
    };
  }

  /**
   * Mappe le statut des instances vers le statut frontend
   * @param {Array} instances - Liste d'instances
   * @returns {string} Statut frontend
   */
  static _mapTaskStatus(instances) {
    if (instances.length === 0) return 'todo';
    const latest = instances[instances.length - 1];

    return TASK_STATUS_MAPPING[latest.status] || 'todo';
  }

  /**
   * Mappe la fréquence de la tâche
   * @param {Object} habitsTask - Tâche backend
   * @returns {string} Fréquence frontend
   */
  static _mapFrequency(habitsTask) {
    if (habitsTask.type === 'bonus') return 'bonus';

    const scheduleMap = {
      'daily': 'daily',
      'weekly': 'weekly',
      'monthly': 'monthly',
      'specific_date': 'once',
    };

    return scheduleMap[habitsTask.schedule?.type] || 'daily';
  }

  /**
   * Adapte une récompense du format backend vers frontend
   * @param {Object} habitsReward - Récompense du backend
   * @param {Array} claims - Réclamations associées (optionnel)
   * @returns {Object} Données adaptées pour le frontend
   */
  static adaptReward(habitsReward, claims = []) {
    const rewardClaims = claims.filter(c => c.reward_id === habitsReward.id);
    const pendingClaims = rewardClaims.filter(c => c.status === 'pending');

    return {
      // Identifiants
      id: habitsReward.id,
      reward_id: habitsReward.id,

      // Informations de base
      name: habitsReward.title,
      title: habitsReward.title,
      description: habitsReward.description || '',
      icon: habitsReward.icon || 'mdi:gift',
      color: habitsReward.color || '#FF5722',

      // Coûts
      cost: habitsReward.cost_points || 0,
      cost_points: habitsReward.cost_points || 0,
      coin_cost: habitsReward.cost_coins || 0,
      cost_coins: habitsReward.cost_coins || 0,

      // Classification
      category: habitsReward.type || 'other',
      type: habitsReward.type || 'other',
      reward_type: habitsReward.type || 'other',
      rarity: null, // Pas de rareté pour les récompenses réelles

      // Disponibilité
      available: habitsReward.active,
      active: habitsReward.active,
      stock: habitsReward.stock,
      remaining_quantity: habitsReward.stock,
      cooldown_days: habitsReward.cooldown_days || 0,
      requires_parent_approval: habitsReward.requires_parent_approval ?? true,

      // Prérequis (géré côté frontend)
      min_level: null,

      // Réclamations en cours
      pending_claims_count: pendingClaims.length,
      claims: rewardClaims.map(claim => this.adaptRewardClaim(claim)),
    };
  }

  /**
   * Adapte une réclamation de récompense
   * @param {Object} claim - Réclamation du backend
   * @returns {Object} Réclamation adaptée
   */
  static adaptRewardClaim(claim) {
    return {
      id: claim.id,
      claim_id: claim.id,
      reward_id: claim.reward_id,
      child_id: claim.child_id,
      status: CLAIM_STATUS_MAPPING[claim.status] || claim.status,
      raw_status: claim.status,
      claimed_at: claim.claimed_at,
      approved_by: claim.approved_by,
      approved_at: claim.approved_at,
      used_at: claim.used_at,
      expires_at: claim.expires_at,
    };
  }

  /**
   * Adapte un cosmétique du format backend vers frontend
   * @param {Object} habitsCosmetic - Cosmétique du backend
   * @param {Object} childData - Données de l'enfant (pour owned/equipped)
   * @returns {Object} Données adaptées pour le frontend
   */
  static adaptCosmetic(habitsCosmetic, childData = null) {
    const isOwned = childData?.owned_cosmetics?.includes(habitsCosmetic.id) || false;
    const isEquipped = childData?.equipped_cosmetics?.includes(habitsCosmetic.id) || false;

    return {
      // Identifiants
      id: habitsCosmetic.id,
      cosmetic_id: habitsCosmetic.id,

      // Informations de base
      name: habitsCosmetic.name,
      description: habitsCosmetic.description || '',
      icon: habitsCosmetic.icon,
      color: habitsCosmetic.color,
      preview_image: habitsCosmetic.preview_image || '',

      // Classification
      category: habitsCosmetic.category,
      subcategory: habitsCosmetic.subcategory || '',
      rarity: habitsCosmetic.rarity || 'common',
      reward_type: 'cosmetic',

      // Coûts (cosmétiques utilisent des pièces, pas des points)
      cost: 0,
      cost_points: 0,
      coin_cost: habitsCosmetic.cost_coins || 0,
      cost_coins: habitsCosmetic.cost_coins || 0,

      // Disponibilité
      available: habitsCosmetic.active,
      active: habitsCosmetic.active,
      remaining_quantity: null, // Illimité pour cosmétiques

      // Prérequis de déblocage
      min_level: habitsCosmetic.unlock_requirements?.level,
      required_badge: habitsCosmetic.unlock_requirements?.badge,
      unlock_requirements: habitsCosmetic.unlock_requirements,

      // État pour l'enfant (si childData fourni)
      is_owned: isOwned,
      is_equipped: isEquipped,

      // Données legacy pour compatibilité
      cosmetic_data: {
        category: habitsCosmetic.category,
        subcategory: habitsCosmetic.subcategory || '',
      },
    };
  }

  /**
   * Adapte une habitude du format backend vers frontend
   * @param {Object} habitsHabit - Habitude du backend
   * @param {Array} streaks - Streaks associés (pour un enfant spécifique)
   * @returns {Object} Données adaptées pour le frontend
   */
  static adaptHabit(habitsHabit, streaks = []) {
    const childStreak = streaks.find(s => s.habit_id === habitsHabit.id);

    return {
      // Identifiants
      id: habitsHabit.id,
      habit_id: habitsHabit.id,

      // Informations de base
      name: habitsHabit.title,
      title: habitsHabit.title,
      description: habitsHabit.description || '',
      icon: habitsHabit.icon || 'mdi:repeat',
      color: habitsHabit.color || '#9C27B0',

      // Fréquence
      frequency: habitsHabit.frequency || 'daily',

      // Récompenses
      points: habitsHabit.rewards?.points || 0,
      coins: habitsHabit.rewards?.coins || 0,
      experience: habitsHabit.rewards?.experience || 0,

      // Configuration du bonus de streak
      streak_bonus: habitsHabit.rewards?.streak_bonus || {
        enabled: true,
        type: 'progressive',
        multiplier: 0.1,
      },

      // Données de streak pour l'enfant (si streak fourni)
      streak_id: childStreak?.id,
      current_streak: childStreak?.current_streak || 0,
      longest_streak: childStreak?.longest_streak || 0,
      total_completions: childStreak?.total_completions || 0,
      last_completed: childStreak?.last_completed,

      // Historique du streak (limité aux 30 derniers jours)
      streak_history: (childStreak?.streak_history || []).slice(0, 30).map(entry => ({
        date: entry.date,
        completed: entry.completed,
      })),

      // Assignation
      assigned_to: habitsHabit.assigned_to || [],
      assigned_child_ids: habitsHabit.assigned_to || [],

      // Disponibilité
      active: habitsHabit.active,
      available: habitsHabit.active,

      // Calculer si complété aujourd'hui
      is_completed_today: this._isCompletedToday(childStreak),
    };
  }

  /**
   * Vérifie si une habitude a été complétée aujourd'hui
   * @param {Object} streak - Streak de l'habitude
   * @returns {boolean} True si complétée aujourd'hui
   */
  static _isCompletedToday(streak) {
    if (!streak?.last_completed) return false;

    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = streak.last_completed.split('T')[0];

    return today === lastCompleted;
  }

  /**
   * Adapte un badge du format backend vers frontend
   * @param {Object} badge - Badge du backend
   * @param {boolean} isEarned - Si le badge est gagné par l'enfant
   * @returns {Object} Badge adapté
   */
  static adaptBadge(badge, isEarned = false) {
    return {
      id: badge.id,
      badge_id: badge.id,
      name: badge.name,
      description: badge.description || '',
      icon: badge.icon,
      color: badge.color,
      rarity: badge.rarity || 'common',
      condition_type: badge.condition_type,
      condition_value: badge.condition_value,
      is_earned: isEarned,
    };
  }

  /**
   * Adapte les statistiques d'un enfant
   * @param {Object} stats - Statistiques du backend
   * @returns {Object} Statistiques adaptées
   */
  static adaptChildStats(stats) {
    return {
      child_id: stats.child_id,
      period: stats.period,

      // Résumé des tâches
      tasks: {
        total: stats.tasks?.total || 0,
        completed: stats.tasks?.completed || 0,
        validated: stats.tasks?.validated || 0,
        refused: stats.tasks?.refused || 0,
        pending: stats.tasks?.pending || 0,
        completion_rate: stats.tasks?.completion_rate || 0,
      },

      // Résumé des habitudes
      habits: {
        total: stats.habits?.total || 0,
        completed_today: stats.habits?.completed_today || 0,
        current_streaks: stats.habits?.current_streaks || 0,
        longest_streak: stats.habits?.longest_streak || 0,
      },

      // Résumé des récompenses
      rewards: {
        claimed: stats.rewards?.claimed || 0,
        pending: stats.rewards?.pending || 0,
        approved: stats.rewards?.approved || 0,
      },

      // Points gagnés sur la période
      points_earned: stats.points_earned || 0,
      coins_earned: stats.coins_earned || 0,
      experience_earned: stats.experience_earned || 0,
    };
  }
}
