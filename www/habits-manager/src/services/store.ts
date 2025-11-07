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
    console.log('[Store] Initializing Habits Manager Store...');

    try {
      // Add timeout to prevent infinite loading
      const loadTimeout = setTimeout(() => {
        console.warn('[Store] Data loading is taking longer than expected (10s)');
      }, 10000);

      await this.loadAllData();
      clearTimeout(loadTimeout);

      // Subscribe to Home Assistant events
      console.log('[Store] Subscribing to Home Assistant updates...');
      this.unsubscribe = await this.api.subscribeToUpdates((event) => {
        console.log('[Store] Received update event:', event);
        this.handleUpdate(event);
      });

      this.state.loading = false;
      console.log('[Store] ✓ Store initialized successfully');
      console.log('[Store] State:', {
        children: this.state.children.length,
        tasks: this.state.tasks.length,
        habits: this.state.habits.length,
        rewards: this.state.rewards.length,
        cosmetics: this.state.cosmetics.length,
      });
      this.notifyListeners();
    } catch (error) {
      console.error('[Store] ✗ Failed to initialize store:', error);
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.loading = false;
      this.notifyListeners();
    }
  }

  /**
   * Load all data from listing services
   */
  private async loadAllData(): Promise<void> {
    console.log('[Store] Loading all data from listing services...');

    // Load all data using listing services with Promise.allSettled
    // This allows graceful handling of individual failures
    const results = await Promise.allSettled([
      this.api.listChildren(),
      this.api.listTasks(),
      this.api.listHabits(),
      this.api.listRewards(),
      this.api.listCosmetics({ active_only: true }),
    ]);

    // Children
    if (results[0].status === 'fulfilled') {
      this.state.children = results[0].value;
      console.log(`[Store] ✓ Loaded ${this.state.children.length} children`);
    } else {
      console.error('[Store] ✗ Error loading children:', results[0].reason);
      console.warn('[Store]   This is normal if no children exist yet');
      this.state.children = [];
    }

    // Tasks
    if (results[1].status === 'fulfilled') {
      this.state.tasks = results[1].value;
      console.log(`[Store] ✓ Loaded ${this.state.tasks.length} tasks`);
    } else {
      console.error('[Store] ✗ Error loading tasks:', results[1].reason);
      console.warn('[Store]   This is normal if no tasks exist yet');
      this.state.tasks = [];
    }

    // Habits
    if (results[2].status === 'fulfilled') {
      this.state.habits = results[2].value;
      console.log(`[Store] ✓ Loaded ${this.state.habits.length} habits`);
    } else {
      console.error('[Store] ✗ Error loading habits:', results[2].reason);
      console.warn('[Store]   This is normal if no habits exist yet');
      this.state.habits = [];
    }

    // Rewards
    if (results[3].status === 'fulfilled') {
      this.state.rewards = results[3].value;
      console.log(`[Store] ✓ Loaded ${this.state.rewards.length} rewards`);
    } else {
      console.error('[Store] ✗ Error loading rewards:', results[3].reason);
      console.warn('[Store]   This is normal if no rewards exist yet');
      this.state.rewards = [];
    }

    // Cosmetics
    if (results[4].status === 'fulfilled') {
      this.state.cosmetics = results[4].value;
      console.log(`[Store] ✓ Loaded ${this.state.cosmetics.length} cosmetics`);
    } else {
      console.error('[Store] ✗ Error loading cosmetics:', results[4].reason);
      console.warn('[Store]   This is normal if no cosmetics exist yet');
      this.state.cosmetics = [];
    }

    console.log('[Store] ✓ All data loading completed');
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

  public getTasks(): Task[] {
    return this.state.tasks;
  }

  public getTask(taskId: string): Task | undefined {
    return this.state.tasks.find((t) => t.id === taskId);
  }

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

  public getHabits(): Habit[] {
    return this.state.habits;
  }

  public getHabit(habitId: string): Habit | undefined {
    return this.state.habits.find((h) => h.id === habitId);
  }

  public getHabitStats(childId: string): { count: number; longest_streak: number } {
    return this.api.getHabitStats(childId);
  }

  public getTasksWaitingValidation(childId: string): any[] {
    return this.api.getTasksWaitingValidation(childId);
  }

  public getPendingClaims(childId: string): any[] {
    return this.api.getPendingClaims(childId);
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

  public getRewards(): Reward[] {
    return this.state.rewards;
  }

  public getReward(rewardId: string): Reward | undefined {
    return this.state.rewards.find((r) => r.id === rewardId);
  }

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

  public getCosmetics(): CosmeticItem[] {
    return this.state.cosmetics;
  }

  public getOwnedCosmetics(childId: string): CosmeticItem[] {
    const child = this.getChild(childId);
    if (!child) return [];

    return this.state.cosmetics.filter(c => child.owned_cosmetics.includes(c.id));
  }

  public getAvailableCosmetics(childId: string): CosmeticItem[] {
    const child = this.getChild(childId);
    if (!child) return [];

    return this.state.cosmetics.filter(cosmetic => {
      // Filter out owned cosmetics
      if (child.owned_cosmetics.includes(cosmetic.id)) {
        return false;
      }

      // Check unlock requirements
      if (cosmetic.unlock_requirements) {
        const reqs = cosmetic.unlock_requirements;

        // Check level requirement
        if (reqs.level && child.level < reqs.level) {
          return false;
        }

        // Check badge requirement
        if (reqs.badge && !child.badges.includes(reqs.badge)) {
          return false;
        }
      }

      return true;
    });
  }

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
