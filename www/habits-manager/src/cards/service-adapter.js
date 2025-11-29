import { SERVICE_DOMAIN, SERVICE_MAPPING } from './constants.js';

/**
 * ServiceAdapter - Couche d'abstraction pour les appels de services backend
 *
 * Cette classe adapte les appels frontend aux services backend en:
 * - Mappant les noms de services (ex: complete_task → mark_task_completed)
 * - Adaptant les noms de paramètres selon le service
 * - Fournissant une API cohérente pour le frontend
 */
export class ServiceAdapter {
  constructor(hass) {
    this._hass = hass;
  }

  /**
   * Appelle un service backend avec adaptation automatique des données
   * @param {string} service - Nom du service (frontend ou backend)
   * @param {Object} data - Données à envoyer
   * @returns {Promise<Object>} Réponse du service
   */
  async callService(service, data = {}) {
    const mappedService = SERVICE_MAPPING[service] || service;

    if (!SERVICE_MAPPING[service] && !Object.values(SERVICE_MAPPING).includes(service)) {
      console.warn(`[ServiceAdapter] Service '${service}' not found in mapping, using as-is`);
    }

    const adaptedData = this._adaptServiceData(service, data);

    try {
      return await this._hass.callService(
        SERVICE_DOMAIN,
        mappedService,
        adaptedData
      );
    } catch (error) {
      console.error(`[ServiceAdapter] Error calling ${SERVICE_DOMAIN}.${mappedService}:`, error);
      throw error;
    }
  }

  /**
   * Adapte les données selon le service appelé
   * @param {string} service - Nom du service
   * @param {Object} data - Données originales
   * @returns {Object} Données adaptées
   */
  _adaptServiceData(service, data) {
    // Clone pour éviter de modifier l'original
    const adapted = { ...data };

    switch (service) {
      // ========================================================================
      // SERVICES TÂCHES
      // ========================================================================

      case 'complete_task':
      case 'mark_task_completed':
        return {
          instance_id: data.instance_id || data.task_id,
          child_id: data.child_id,
          ...(data.photo_url && { photo_url: data.photo_url }),
        };

      case 'validate_task':
        return {
          instance_id: data.instance_id || data.task_instance_id,
          ...(data.validator_id && { validator_id: data.validator_id }),
          ...(data.note && { note: data.note }),
        };

      case 'refuse_task':
        return {
          instance_id: data.instance_id || data.task_instance_id,
          ...(data.validator_id && { validator_id: data.validator_id }),
          ...(data.apply_penalty !== undefined && { apply_penalty: data.apply_penalty }),
          ...(data.note && { note: data.note }),
        };

      case 'cancel_task_instance':
        return {
          instance_id: data.instance_id,
          ...(data.reason && { reason: data.reason }),
        };

      case 'reschedule_task_instance':
        return {
          instance_id: data.instance_id,
          new_date: data.new_date,
        };

      case 'create_task':
        return {
          title: data.title || data.name,
          description: data.description || '',
          assigned_to: data.assigned_to || data.assigned_child_ids,
          difficulty: data.difficulty || 1,
          task_type: data.task_type || data.type || 'mandatory',
        };

      case 'update_task':
        return {
          task_id: data.task_id || data.id,
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.is_active !== undefined && { is_active: data.is_active }),
        };

      case 'delete_task':
        return {
          task_id: data.task_id || data.id,
        };

      case 'list_task_instances':
        return {
          ...(data.child_id && { child_id: data.child_id }),
          ...(data.task_id && { task_id: data.task_id }),
          ...(data.status && { status: data.status }),
          ...(data.date_from && { date_from: data.date_from }),
          ...(data.date_to && { date_to: data.date_to }),
          ...(data.limit && { limit: data.limit }),
        };

      // ========================================================================
      // SERVICES ENFANTS
      // ========================================================================

      case 'remove_child':
      case 'delete_child':
        return {
          child_id: data.child_id || data.id,
        };

      case 'create_child':
        return {
          name: data.name,
          person_entity: data.person_entity || data.person_entity_id,
        };

      case 'update_child':
        return {
          child_id: data.child_id || data.id,
          ...(data.name && { name: data.name }),
        };

      case 'add_points':
      case 'remove_points':
      case 'set_points':
        return {
          child_id: data.child_id,
          points: data.points,
          ...(data.reason && { reason: data.reason }),
        };

      case 'add_coins':
      case 'remove_coins':
      case 'set_coins':
        return {
          child_id: data.child_id,
          coins: data.coins,
          ...(data.reason && { reason: data.reason }),
        };

      case 'add_experience':
        return {
          child_id: data.child_id,
          xp: data.xp || data.experience,
          ...(data.reason && { reason: data.reason }),
        };

      case 'set_level':
        return {
          child_id: data.child_id,
          level: data.level,
          ...(data.reason && { reason: data.reason }),
        };

      case 'get_child_history':
        return {
          child_id: data.child_id,
          ...(data.limit && { limit: data.limit }),
          ...(data.action_type_filter && { action_type_filter: data.action_type_filter }),
        };

      // ========================================================================
      // SERVICES HABITUDES
      // ========================================================================

      case 'complete_habit':
      case 'mark_habit_completed':
        return {
          habit_id: data.habit_id || data.id,
          child_id: data.child_id,
          ...(data.completion_date && { completion_date: data.completion_date }),
        };

      case 'create_habit':
        return {
          title: data.title || data.name,
          description: data.description || '',
          assigned_to: data.assigned_to || data.assigned_child_ids,
          frequency: data.frequency || 'daily',
        };

      case 'update_habit':
        return {
          habit_id: data.habit_id || data.id,
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.is_active !== undefined && { is_active: data.is_active }),
        };

      case 'delete_habit':
        return {
          habit_id: data.habit_id || data.id,
        };

      case 'reset_streak':
        return {
          habit_id: data.habit_id || data.id,
        };

      case 'get_habit_history':
        return {
          habit_id: data.habit_id || data.id,
          ...(data.limit && { limit: data.limit }),
        };

      // ========================================================================
      // SERVICES RÉCOMPENSES
      // ========================================================================

      case 'claim_reward':
        return {
          reward_id: data.reward_id || data.id,
          child_id: data.child_id,
        };

      case 'approve_claim':
        return {
          claim_id: data.claim_id || data.id,
          ...(data.approver_id && { approver_id: data.approver_id }),
        };

      case 'refuse_claim':
        return {
          claim_id: data.claim_id || data.id,
          ...(data.reason && { reason: data.reason }),
        };

      case 'consume_claim':
        return {
          claim_id: data.claim_id || data.id,
        };

      case 'create_reward':
        return {
          title: data.title || data.name,
          description: data.description || '',
          cost_points: data.cost_points || data.cost || 0,
          requires_parent_approval: data.requires_parent_approval ?? true,
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.cooldown_days && { cooldown_days: data.cooldown_days }),
        };

      case 'update_reward':
        return {
          reward_id: data.reward_id || data.id,
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.cost_points !== undefined && { cost_points: data.cost_points }),
          ...(data.cost_coins !== undefined && { cost_coins: data.cost_coins }),
          ...(data.image_url && { image_url: data.image_url }),
          ...(data.active !== undefined && { active: data.active }),
        };

      case 'delete_reward':
        return {
          reward_id: data.reward_id || data.id,
        };

      case 'list_claims':
        return {
          ...(data.child_id && { child_id: data.child_id }),
          ...(data.status && { status: data.status }),
          ...(data.date_from && { date_from: data.date_from }),
          ...(data.date_to && { date_to: data.date_to }),
        };

      // ========================================================================
      // SERVICES COSMÉTIQUES
      // ========================================================================

      case 'purchase_cosmetic':
        return {
          cosmetic_id: data.cosmetic_id || data.id,
          child_id: data.child_id,
        };

      case 'equip_cosmetic':
      case 'unequip_cosmetic':
        return {
          child_id: data.child_id,
          cosmetic_id: data.cosmetic_id || data.id,
        };

      case 'create_cosmetic':
        return {
          name: data.name,
          description: data.description || '',
          category: data.category,
          subcategory: data.subcategory || '',
          rarity: data.rarity || 'common',
          cost_coins: data.cost_coins || data.coin_cost || 50,
          ...(data.preview_image && { preview_image: data.preview_image }),
        };

      case 'update_cosmetic':
        return {
          cosmetic_id: data.cosmetic_id || data.id,
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.category && { category: data.category }),
          ...(data.subcategory && { subcategory: data.subcategory }),
          ...(data.rarity && { rarity: data.rarity }),
          ...(data.cost_coins !== undefined && { cost_coins: data.cost_coins }),
          ...(data.image_url && { image_url: data.image_url }),
          ...(data.active !== undefined && { active: data.active }),
        };

      case 'delete_cosmetic':
        return {
          cosmetic_id: data.cosmetic_id || data.id,
        };

      case 'list_owned_cosmetics':
        return {
          child_id: data.child_id,
          ...(data.equipped_only !== undefined && { equipped_only: data.equipped_only }),
        };

      // ========================================================================
      // SERVICES STATISTIQUES
      // ========================================================================

      case 'get_child_stats':
        return {
          child_id: data.child_id,
          ...(data.period && { period: data.period }),
        };

      case 'get_weekly_report':
        return {
          child_id: data.child_id,
          ...(data.weeks_ago !== undefined && { weeks_ago: data.weeks_ago }),
        };

      case 'compare_children':
        return {
          child_ids: data.child_ids,
          ...(data.period && { period: data.period }),
        };

      // ========================================================================
      // SERVICES CONFIGURATION
      // ========================================================================

      case 'create_category':
        return {
          name: data.name,
          type: data.type,
          ...(data.icon && { icon: data.icon }),
          ...(data.color && { color: data.color }),
        };

      case 'list_categories':
        return {
          ...(data.type && { type: data.type }),
        };

      case 'update_level_config':
        return {
          level: data.level,
          xp_required: data.xp_required,
          ...(data.unlock_message && { unlock_message: data.unlock_message }),
        };

      // ========================================================================
      // SERVICES DE LISTAGE (pas de transformation)
      // ========================================================================

      case 'list_children':
      case 'get_system_config':
        return {};

      case 'list_tasks':
        return {
          ...(data.assigned_to && { assigned_to: data.assigned_to }),
          ...(data.type && { type: data.type }),
          ...(data.category && { category: data.category }),
        };

      case 'list_habits':
        return {
          ...(data.assigned_to && { assigned_to: data.assigned_to }),
          ...(data.frequency && { frequency: data.frequency }),
        };

      case 'list_rewards':
        return {
          ...(data.type && { type: data.type }),
          ...(data.available_only !== undefined && { available_only: data.available_only }),
        };

      case 'list_cosmetics':
        return {
          ...(data.category && { category: data.category }),
          ...(data.rarity && { rarity: data.rarity }),
          ...(data.active_only !== undefined && { active_only: data.active_only }),
        };

      case 'get_task_instance':
        return {
          instance_id: data.instance_id || data.id,
        };

      // Par défaut, passer les données telles quelles
      default:
        return adapted;
    }
  }

  // ============================================================================
  // MÉTHODES UTILITAIRES POUR APPELS DIRECTS
  // ============================================================================

  // --- Enfants ---
  async listChildren() {
    return this.callService('list_children');
  }

  async createChild(name, personEntity) {
    return this.callService('create_child', { name, person_entity: personEntity });
  }

  async deleteChild(childId) {
    return this.callService('delete_child', { child_id: childId });
  }

  async addPoints(childId, points, reason = '') {
    return this.callService('add_points', { child_id: childId, points, reason });
  }

  async removePoints(childId, points, reason = '') {
    return this.callService('remove_points', { child_id: childId, points, reason });
  }

  async addCoins(childId, coins, reason = '') {
    return this.callService('add_coins', { child_id: childId, coins, reason });
  }

  async removeCoins(childId, coins, reason = '') {
    return this.callService('remove_coins', { child_id: childId, coins, reason });
  }

  // --- Tâches ---
  async listTasks(filters = {}) {
    return this.callService('list_tasks', filters);
  }

  async markTaskCompleted(instanceId, childId, photoUrl = null) {
    return this.callService('mark_task_completed', {
      instance_id: instanceId,
      child_id: childId,
      photo_url: photoUrl,
    });
  }

  async validateTask(instanceId, note = '') {
    return this.callService('validate_task', { instance_id: instanceId, note });
  }

  async refuseTask(instanceId, applyPenalty = false, note = '') {
    return this.callService('refuse_task', {
      instance_id: instanceId,
      apply_penalty: applyPenalty,
      note,
    });
  }

  // --- Habitudes ---
  async listHabits(filters = {}) {
    return this.callService('list_habits', filters);
  }

  async markHabitCompleted(habitId, childId) {
    return this.callService('mark_habit_completed', { habit_id: habitId, child_id: childId });
  }

  // --- Récompenses ---
  async listRewards(filters = {}) {
    return this.callService('list_rewards', filters);
  }

  async claimReward(rewardId, childId) {
    return this.callService('claim_reward', { reward_id: rewardId, child_id: childId });
  }

  async approveClaim(claimId) {
    return this.callService('approve_claim', { claim_id: claimId });
  }

  async refuseClaim(claimId, reason = '') {
    return this.callService('refuse_claim', { claim_id: claimId, reason });
  }

  // --- Cosmétiques ---
  async listCosmetics(filters = {}) {
    return this.callService('list_cosmetics', filters);
  }

  async purchaseCosmetic(cosmeticId, childId) {
    return this.callService('purchase_cosmetic', { cosmetic_id: cosmeticId, child_id: childId });
  }

  async equipCosmetic(childId, cosmeticId) {
    return this.callService('equip_cosmetic', { child_id: childId, cosmetic_id: cosmeticId });
  }

  async unequipCosmetic(childId, cosmeticId) {
    return this.callService('unequip_cosmetic', { child_id: childId, cosmetic_id: cosmeticId });
  }
}
