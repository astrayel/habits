/**
 * Central Store for Habits Manager
 * Manages global state and synchronization with Home Assistant
 */

import { HomeAssistant } from '../types/home-assistant';
import { HabitsManagerAPI } from './api-client';
import type {
  Child,
  Task,
  TaskInstance,
  Habit,
  HabitStreak,
  Reward,
  RewardClaim,
  CosmeticItem,
} from '../types/models';

type StoreListener = () => void;

interface StoreState {
  children: Child[];
  tasks: Task[];
  taskInstances: TaskInstance[];
  habits: Habit[];
  habitStreaks: HabitStreak[];
  rewards: Reward[];
  rewardClaims: RewardClaim[];
  cosmetics: CosmeticItem[];
  loading: boolean;
  error: string | null;
}

export class HabitsManagerStore {
  private hass: HomeAssistant;
  private api: HabitsManagerAPI;
  private listeners: Set<StoreListener> = new Set();
  private unsubscribe?: () => void;

  private state: StoreState = {
    children: [],
    tasks: [],
    taskInstances: [],
    habits: [],
    habitStreaks: [],
    rewards: [],
    rewardClaims: [],
    cosmetics: [],
    loading: true,
    error: null,
  };

  constructor(hass: HomeAssistant) {
    this.hass = hass;
    this.api = new HabitsManagerAPI(hass);
    this.initialize();
  }

  /**
   * Initialize store and subscribe to updates
   */
  private async initialize(): Promise<void> {
    try {
      await this.loadAllData();

      // Subscribe to Home Assistant events
      this.unsubscribe = await this.api.subscribeToUpdates((event) => {
        console.log('Store received update:', event);
        this.handleUpdate(event);
      });

      this.state.loading = false;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to initialize store:', error);
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.loading = false;
      this.notifyListeners();
    }
  }

  /**
   * Load all data from sensors
   */
  private async loadAllData(): Promise<void> {
    this.state.children = this.api.getChildren();
    // Note: tasks, taskInstances, habits, etc. would need backend sensor support
    // For now, we only have children data from sensors
  }

  /**
   * Handle update events from Home Assistant
   */
  private handleUpdate(event: any): void {
    const { update_type } = event;

    switch (update_type) {
      case 'child_created':
      case 'child_updated':
      case 'child_deleted':
        this.state.children = this.api.getChildren();
        break;

      case 'task_completed':
      case 'task_validated':
      case 'task_refused':
      case 'task_failed':
        // Reload task instances for affected child
        if (event.child_id) {
          this.state.children = this.api.getChildren();
        }
        break;

      case 'habit_completed':
      case 'streak_increased':
      case 'streak_broken':
        // Reload habit data
        if (event.child_id) {
          this.state.children = this.api.getChildren();
        }
        break;

      case 'reward_claimed':
      case 'reward_approved':
      case 'cosmetic_purchased':
        // Reload child data (points/coins changed)
        this.state.children = this.api.getChildren();
        break;

      case 'level_up':
      case 'badge_earned':
      case 'points_changed':
      case 'coins_changed':
        // Reload affected child
        this.state.children = this.api.getChildren();
        break;
    }

    this.notifyListeners();
  }

  /**
   * Subscribe to store changes
   */
  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Get current state (read-only)
   */
  public getState(): Readonly<StoreState> {
    return { ...this.state };
  }

  /**
   * Refresh all data from sensors
   */
  public async refresh(): Promise<void> {
    this.state.loading = true;
    this.notifyListeners();

    try {
      await this.loadAllData();
      this.state.loading = false;
      this.state.error = null;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.loading = false;
    }

    this.notifyListeners();
  }

  // =====================================================
  // Child Methods
  // =====================================================

  public getChildren(): Child[] {
    return this.state.children;
  }

  public getChild(childId: string): Child | undefined {
    return this.state.children.find((c) => c.id === childId);
  }

  public async createChild(data: {
    name: string;
    person_entity: string;
    avatar_photo_url?: string;
  }): Promise<void> {
    try {
      await this.api.createChild(data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to create child:', error);
      throw error;
    }
  }

  public async updateChild(childId: string, data: Partial<Child>): Promise<void> {
    try {
      await this.api.updateChild(childId, data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to update child:', error);
      throw error;
    }
  }

  public async deleteChild(childId: string): Promise<void> {
    try {
      await this.api.deleteChild(childId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to delete child:', error);
      throw error;
    }
  }

  // =====================================================
  // Task Methods
  // =====================================================

  public getTaskCounts(childId: string): { pending: number; waiting: number } {
    return this.api.getTaskCounts(childId);
  }

  public async createTask(data: any): Promise<void> {
    try {
      await this.api.createTask(data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  public async updateTask(taskId: string, data: any): Promise<void> {
    try {
      await this.api.updateTask(taskId, data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  public async deleteTask(taskId: string): Promise<void> {
    try {
      await this.api.deleteTask(taskId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  public async markTaskCompleted(instanceId: string, childId: string): Promise<void> {
    try {
      await this.api.markTaskCompleted(instanceId, childId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to mark task completed:', error);
      throw error;
    }
  }

  public async validateTask(instanceId: string, validatorId?: string, note?: string): Promise<void> {
    try {
      await this.api.validateTask(instanceId, validatorId, note);
      await this.refresh();
    } catch (error) {
      console.error('Failed to validate task:', error);
      throw error;
    }
  }

  public async refuseTask(
    instanceId: string,
    validatorId?: string,
    applyPenalty?: boolean,
    note?: string
  ): Promise<void> {
    try {
      await this.api.refuseTask(instanceId, validatorId, applyPenalty, note);
      await this.refresh();
    } catch (error) {
      console.error('Failed to refuse task:', error);
      throw error;
    }
  }

  // =====================================================
  // Habit Methods
  // =====================================================

  public getHabitStats(childId: string): { count: number; longest_streak: number } {
    return this.api.getHabitStats(childId);
  }

  public async createHabit(data: any): Promise<void> {
    try {
      await this.api.createHabit(data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to create habit:', error);
      throw error;
    }
  }

  public async updateHabit(habitId: string, data: any): Promise<void> {
    try {
      await this.api.updateHabit(habitId, data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to update habit:', error);
      throw error;
    }
  }

  public async deleteHabit(habitId: string): Promise<void> {
    try {
      await this.api.deleteHabit(habitId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to delete habit:', error);
      throw error;
    }
  }

  public async completeHabit(habitId: string, childId: string): Promise<void> {
    try {
      await this.api.completeHabit(habitId, childId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to complete habit:', error);
      throw error;
    }
  }

  // =====================================================
  // Reward Methods
  // =====================================================

  public async createReward(data: any): Promise<void> {
    try {
      await this.api.createReward(data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to create reward:', error);
      throw error;
    }
  }

  public async claimReward(rewardId: string, childId: string): Promise<void> {
    try {
      await this.api.claimReward(rewardId, childId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to claim reward:', error);
      throw error;
    }
  }

  public async approveClaim(claimId: string, approverId?: string): Promise<void> {
    try {
      await this.api.approveClaim(claimId, approverId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to approve claim:', error);
      throw error;
    }
  }

  // =====================================================
  // Cosmetic Methods
  // =====================================================

  public async createCosmetic(data: any): Promise<void> {
    try {
      await this.api.createCosmetic(data);
      await this.refresh();
    } catch (error) {
      console.error('Failed to create cosmetic:', error);
      throw error;
    }
  }

  public async purchaseCosmetic(cosmeticId: string, childId: string): Promise<void> {
    try {
      await this.api.purchaseCosmetic(cosmeticId, childId);
      await this.refresh();
    } catch (error) {
      console.error('Failed to purchase cosmetic:', error);
      throw error;
    }
  }

  /**
   * Cleanup when store is no longer needed
   */
  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listeners.clear();
  }
}

/**
 * Create a store instance
 */
export function createStore(hass: HomeAssistant): HabitsManagerStore {
  return new HabitsManagerStore(hass);
}
