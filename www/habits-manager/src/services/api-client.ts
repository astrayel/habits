/**
 * API Client for Habits Manager
 * Handles all communication with Home Assistant backend
 */

import { HomeAssistant } from '../types/home-assistant';
import { DOMAIN, SERVICES } from '../types/constants';
import type {
  Child,
  Task,
  Habit,
} from '../types/models';

export const API_VERSION = '2025-11-07T19:30:00Z';

export class HabitsManagerAPI {
  private hass: HomeAssistant;

  constructor(hass: HomeAssistant) {
    this.hass = hass;
    console.log(`%c[Habits Manager API v${API_VERSION}]`, 'color: #03a9f4; font-weight: bold', 'Initialized with WebSocket API for return_response');
  }

  /**
   * Call a service on the habits_manager domain
   */
  private async callService(service: string, data: any = {}): Promise<any> {
    console.log(`[API] callService: ${DOMAIN}.${service}`, data);
    return this.hass.callService(DOMAIN, service, data);
  }

  /**
   * Call a service that returns a response
   * Uses WebSocket API directly since hass.callService doesn't properly support return_response
   */
  private async callServiceWithResponse(service: string, data: any = {}): Promise<any> {
    const message = {
      type: 'call_service',
      domain: DOMAIN,
      service: service,
      service_data: data,
      return_response: true,
    };
    console.log(`%c[API] callServiceWithResponse: ${DOMAIN}.${service}`, 'color: #4caf50; font-weight: bold');
    console.log('[API] WebSocket message:', JSON.stringify(message, null, 2));

    try {
      const response = await this.hass.connection.sendMessagePromise(message);
      console.log(`%c[API] ✓ Response received for ${service}:`, 'color: #4caf50', response);
      return response;
    } catch (error) {
      console.error(`%c[API] ✗ Error calling ${service}:`, 'color: #f44336; font-weight: bold', error);
      throw error;
    }
  }

  // =====================================================
  // Child Services
  // =====================================================

  async createChild(data: {
    name: string;
    person_entity: string;
    avatar_photo_url?: string;
  }): Promise<void> {
    return this.callService(SERVICES.CREATE_CHILD, data);
  }

  async updateChild(childId: string, data: Partial<Child>): Promise<void> {
    return this.callService(SERVICES.UPDATE_CHILD, {
      child_id: childId,
      ...data,
    });
  }

  async deleteChild(childId: string): Promise<void> {
    return this.callService(SERVICES.DELETE_CHILD, {
      child_id: childId,
    });
  }

  // =====================================================
  // Task Services
  // =====================================================

  async createTask(data: {
    title: string;
    description: string;
    type: string;
    assigned_to: string[];
    schedule_type: string;
    schedule_days?: number[];
    schedule_time?: string;
    rewards_points?: number;
    rewards_coins?: number;
    rewards_experience?: number;
    penalties_points?: number;
    penalties_coins?: number;
    icon?: string;
    color?: string;
    difficulty?: number;
    estimated_duration?: number;
    category?: string;
  }): Promise<void> {
    return this.callService(SERVICES.CREATE_TASK, data);
  }

  async updateTask(taskId: string, data: Partial<Task>): Promise<void> {
    return this.callService(SERVICES.UPDATE_TASK, {
      task_id: taskId,
      ...data,
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.callService(SERVICES.DELETE_TASK, {
      task_id: taskId,
    });
  }

  async markTaskCompleted(instanceId: string, childId: string): Promise<void> {
    return this.callService(SERVICES.MARK_TASK_COMPLETED, {
      instance_id: instanceId,
      child_id: childId,
    });
  }

  async validateTask(
    instanceId: string,
    validatorId?: string,
    note?: string
  ): Promise<void> {
    return this.callService(SERVICES.VALIDATE_TASK, {
      instance_id: instanceId,
      validator_id: validatorId,
      note,
    });
  }

  async refuseTask(
    instanceId: string,
    validatorId?: string,
    applyPenalty: boolean = false,
    note?: string
  ): Promise<void> {
    return this.callService(SERVICES.REFUSE_TASK, {
      instance_id: instanceId,
      validator_id: validatorId,
      apply_penalty: applyPenalty,
      note,
    });
  }

  async validatePenalty(instanceId: string, validatorId?: string): Promise<void> {
    return this.callService(SERVICES.VALIDATE_PENALTY, {
      instance_id: instanceId,
      validator_id: validatorId,
    });
  }

  // =====================================================
  // Habit Services
  // =====================================================

  async createHabit(data: {
    title: string;
    description: string;
    frequency: string;
    assigned_to: string[];
    rewards_points?: number;
    rewards_coins?: number;
    rewards_experience?: number;
    icon?: string;
    color?: string;
  }): Promise<void> {
    return this.callService(SERVICES.CREATE_HABIT, data);
  }

  async updateHabit(habitId: string, data: Partial<Habit>): Promise<void> {
    return this.callService(SERVICES.UPDATE_HABIT, {
      habit_id: habitId,
      ...data,
    });
  }

  async deleteHabit(habitId: string): Promise<void> {
    return this.callService(SERVICES.DELETE_HABIT, {
      habit_id: habitId,
    });
  }

  async completeHabit(habitId: string, childId: string): Promise<void> {
    return this.callService(SERVICES.COMPLETE_HABIT, {
      habit_id: habitId,
      child_id: childId,
    });
  }

  // =====================================================
  // Reward Services
  // =====================================================

  async createReward(data: {
    title: string;
    description: string;
    type: string;
    cost_points: number;
    cost_coins?: number;
    icon?: string;
    color?: string;
    stock?: number;
    cooldown_days?: number;
    requires_parent_approval?: boolean;
  }): Promise<void> {
    return this.callService(SERVICES.CREATE_REWARD, data);
  }

  async claimReward(rewardId: string, childId: string): Promise<void> {
    return this.callService(SERVICES.CLAIM_REWARD, {
      reward_id: rewardId,
      child_id: childId,
    });
  }

  async approveClaim(claimId: string, approverId?: string): Promise<void> {
    return this.callService(SERVICES.APPROVE_CLAIM, {
      claim_id: claimId,
      approver_id: approverId,
    });
  }

  // =====================================================
  // Cosmetic Services
  // =====================================================

  async createCosmetic(data: {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    rarity: string;
    cost_coins: number;
    icon?: string;
    color?: string;
    preview_image?: string;
    unlock_requirements?: {
      min_level?: number;
      required_badge?: string;
      min_streak?: number;
    };
  }): Promise<void> {
    return this.callService(SERVICES.CREATE_COSMETIC, data);
  }

  async purchaseCosmetic(cosmeticId: string, childId: string): Promise<void> {
    return this.callService(SERVICES.PURCHASE_COSMETIC, {
      cosmetic_id: cosmeticId,
      child_id: childId,
    });
  }

  // =====================================================
  // Data Retrieval (from sensors)
  // =====================================================

  /**
   * Get all children from sensor states
   */
  getChildren(): Child[] {
    const children: Child[] = [];

    // Find all child sensors (looking for points sensors as they exist for all children)
    const childSensors = Object.values(this.hass.states).filter(
      (entity) => entity.entity_id.startsWith(`sensor.${DOMAIN}_`) &&
                  entity.entity_id.endsWith('_points')
    );

    for (const sensor of childSensors) {
      const childId = sensor.attributes.child_id;
      if (childId) {
        const child = this.getChildData(childId);
        if (child) {
          children.push(child);
        }
      }
    }

    return children;
  }

  /**
   * Get a single child's data from sensor states
   */
  getChildData(childId: string): Child | null {
    const pointsSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_points`];
    if (!pointsSensor) return null;

    const coinsSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_coins`];
    const levelSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_level`];
    const xpSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_experience`];

    return {
      id: childId,
      name: pointsSensor.attributes.child_name || 'Unknown',
      person_entity: pointsSensor.attributes.person_entity || '',
      points: parseInt(pointsSensor.state) || 0,
      coins: coinsSensor ? parseInt(coinsSensor.state) || 0 : 0,
      level: levelSensor ? parseInt(levelSensor.state) || 1 : 1,
      experience: xpSensor ? parseInt(xpSensor.state) || 0 : 0,
      experience_to_next_level: xpSensor?.attributes.experience_to_next_level || 100,
      avatar: pointsSensor.attributes.avatar || {
        photo_url: '',
        customization: {
          clothes: null,
          accessory: null,
          pet: null,
          theme: 'default',
        },
      },
      badges: pointsSensor.attributes.badges || [],
      owned_cosmetics: pointsSensor.attributes.owned_cosmetics || [],
      created_at: pointsSensor.attributes.created_at || new Date().toISOString(),
      updated_at: pointsSensor.attributes.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Get task counts for a child
   */
  getTaskCounts(childId: string): { pending: number; waiting: number } {
    const tasksSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_tasks_pending`];
    const waitingSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_tasks_completed_waiting`];

    return {
      pending: tasksSensor ? parseInt(tasksSensor.state) || 0 : 0,
      waiting: waitingSensor ? parseInt(waitingSensor.state) || 0 : 0,
    };
  }

  /**
   * Get habit stats for a child
   */
  getHabitStats(childId: string): { count: number; longest_streak: number } {
    const habitsSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_habits_count`];
    const streakSensor = this.hass.states[`sensor.${DOMAIN}_${childId}_longest_streak`];

    return {
      count: habitsSensor ? parseInt(habitsSensor.state) || 0 : 0,
      longest_streak: streakSensor ? parseInt(streakSensor.state) || 0 : 0,
    };
  }

  /**
   * Get tasks waiting validation for a child
   */
  getTasksWaitingValidation(childId: string): any[] {
    const sensor = this.hass.states[`sensor.habits_${childId}_tasks_waiting_validation_list`];
    if (!sensor || !sensor.attributes.instances) {
      return [];
    }
    return sensor.attributes.instances;
  }

  /**
   * Get pending reward claims for a child
   */
  getPendingClaims(childId: string): any[] {
    const sensor = this.hass.states[`sensor.habits_${childId}_pending_claims`];
    if (!sensor || !sensor.attributes.claims) {
      return [];
    }
    return sensor.attributes.claims;
  }

  /**
   * Get all cosmetics from sensor
   * Note: This assumes there's a sensor exposing cosmetics, or we fetch from a config
   * For now, returns empty array (cosmetics would need to be loaded from backend)
   */
  getCosmetics(): any[] {
    // TODO: Implement cosmetic loading from sensor or backend endpoint
    // For now, cosmetics need to be managed via services
    const cosmeticsSensor = this.hass.states[`sensor.${DOMAIN}_cosmetics`];
    if (cosmeticsSensor && cosmeticsSensor.attributes.cosmetics) {
      return cosmeticsSensor.attributes.cosmetics;
    }
    return [];
  }

  // =====================================================
  // Event Subscription
  // =====================================================

  /**
   * Subscribe to habits_manager_update events
   */
  async subscribeToUpdates(callback: (event: any) => void): Promise<() => void> {
    return this.hass.connection.subscribeEvents(callback, `${DOMAIN}_update`);
  }

  // =====================================================
  // Listing Services (fetch data via service calls)
  // =====================================================

  /**
   * List all children
   */
  async listChildren(): Promise<any[]> {
    console.log('[API] Calling list_children service with return_response...');
    try {
      const response = await this.callServiceWithResponse(SERVICES.LIST_CHILDREN, {});
      console.log('[API] Full response:', response);
      const children = response.response?.children || response.children || [];
      console.log(`[API] ✓ list_children responded with ${children.length} children`);
      return children;
    } catch (err) {
      console.error('[API] ✗ Error calling list_children service:', err);
      throw err;
    }
  }

  /**
   * List all tasks with optional filters
   */
  async listTasks(filters?: {
    assigned_to?: string;
    type?: string;
    category?: string;
  }): Promise<any[]> {
    console.log('[API] Calling list_tasks service with return_response, filters:', filters);
    try {
      const response = await this.callServiceWithResponse(SERVICES.LIST_TASKS, filters || {});
      const tasks = response.response?.tasks || response.tasks || [];
      console.log(`[API] ✓ list_tasks responded with ${tasks.length} tasks`);
      return tasks;
    } catch (err) {
      console.error('[API] ✗ Error calling list_tasks service:', err);
      throw err;
    }
  }

  /**
   * List all habits with optional filters
   */
  async listHabits(filters?: {
    assigned_to?: string;
    frequency?: string;
  }): Promise<any[]> {
    console.log('[API] Calling list_habits service with return_response, filters:', filters);
    try {
      const response = await this.callServiceWithResponse(SERVICES.LIST_HABITS, filters || {});
      const habits = response.response?.habits || response.habits || [];
      console.log(`[API] ✓ list_habits responded with ${habits.length} habits`);
      return habits;
    } catch (err) {
      console.error('[API] ✗ Error calling list_habits service:', err);
      throw err;
    }
  }

  /**
   * List all rewards with optional filters
   */
  async listRewards(filters?: {
    type?: string;
    available_only?: boolean;
  }): Promise<any[]> {
    console.log('[API] Calling list_rewards service with return_response, filters:', filters);
    try {
      const response = await this.callServiceWithResponse(SERVICES.LIST_REWARDS, filters || {});
      const rewards = response.response?.rewards || response.rewards || [];
      console.log(`[API] ✓ list_rewards responded with ${rewards.length} rewards`);
      return rewards;
    } catch (err) {
      console.error('[API] ✗ Error calling list_rewards service:', err);
      throw err;
    }
  }

  /**
   * List all cosmetics with optional filters
   */
  async listCosmetics(filters?: {
    category?: string;
    rarity?: string;
    active_only?: boolean;
  }): Promise<any[]> {
    console.log('[API] Calling list_cosmetics service with return_response, filters:', filters);
    try {
      const response = await this.callServiceWithResponse(SERVICES.LIST_COSMETICS, filters || {});
      const cosmetics = response.response?.cosmetics || response.cosmetics || [];
      console.log(`[API] ✓ list_cosmetics responded with ${cosmetics.length} cosmetics`);
      return cosmetics;
    } catch (err) {
      console.error('[API] ✗ Error calling list_cosmetics service:', err);
      throw err;
    }
  }
}
