/**
 * Lightweight API Client for Child Card
 *
 * This client only uses sensors and doesn't load unnecessary data.
 * Perfect for child cards that only need data for one specific child.
 */

import type { HomeAssistant } from '../types/home-assistant';

const DOMAIN = 'habits_manager';

interface TaskInstance {
  instance_id: string;
  task_id: string;
  task_title: string;
  completed_at: string | null;
  rewards: {
    points: number;
    coins: number;
    experience: number;
  };
}

interface Child {
  id: string;
  name: string;
  person_entity: string;
  points: number;
  coins: number;
  level: number;
  experience: number;
  experience_to_next_level: number;
  avatar: any;
  badges: string[];
  owned_cosmetics: string[];
}

/**
 * Lightweight API client that only reads sensors for a specific child
 */
export class ChildApiClient {
  constructor(private hass: HomeAssistant, private childId: string) {}

  /**
   * Get child data from sensors
   */
  getChild(): Child | null {
    const pointsSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_points`];
    if (!pointsSensor) {
      console.warn(`[ChildAPI] Child sensor not found for ${this.childId}`);
      return null;
    }

    const coinsSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_coins`];
    const levelSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_level`];
    const experienceSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_experience`];

    return {
      id: this.childId,
      name: pointsSensor.attributes.child_name || 'Unknown',
      person_entity: pointsSensor.attributes.person_entity || '',
      points: parseInt(pointsSensor.state) || 0,
      coins: coinsSensor ? parseInt(coinsSensor.state) || 0 : 0,
      level: levelSensor ? parseInt(levelSensor.state) || 1 : 1,
      experience: experienceSensor ? parseInt(experienceSensor.state) || 0 : 0,
      experience_to_next_level: experienceSensor?.attributes.experience_to_next_level || 100,
      avatar: pointsSensor.attributes.avatar || { photo_url: '', customization: {} },
      badges: pointsSensor.attributes.badges || [],
      owned_cosmetics: pointsSensor.attributes.owned_cosmetics || [],
    };
  }

  /**
   * Get task counts for this child
   */
  getTaskCounts(): { pending: number; waiting: number } {
    const pendingSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_tasks_pending`];
    const waitingSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_tasks_completed_waiting`];

    return {
      pending: pendingSensor ? parseInt(pendingSensor.state) || 0 : 0,
      waiting: waitingSensor ? parseInt(waitingSensor.state) || 0 : 0,
    };
  }

  /**
   * Get tasks waiting validation (completed, awaiting parent approval)
   */
  getTasksWaitingValidation(): TaskInstance[] {
    const sensor = this.hass.states[`sensor.habits_${this.childId}_tasks_waiting_validation_list`];
    if (!sensor || !sensor.attributes.instances) {
      return [];
    }
    return sensor.attributes.instances;
  }

  /**
   * Get habit stats for this child
   */
  getHabitStats(): { count: number; longest_streak: number } {
    const habitsSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_habits_count`];
    const streakSensor = this.hass.states[`sensor.${DOMAIN}_${this.childId}_longest_streak`];

    return {
      count: habitsSensor ? parseInt(habitsSensor.state) || 0 : 0,
      longest_streak: streakSensor ? parseInt(streakSensor.state) || 0 : 0,
    };
  }

  /**
   * Mark a task instance as completed
   */
  async markTaskCompleted(instanceId: string): Promise<void> {
    console.log(`[ChildAPI] Marking task completed: ${instanceId}`);
    await this.hass.callService(DOMAIN, 'mark_task_completed', {
      instance_id: instanceId,
      child_id: this.childId,
    });
  }

  /**
   * Complete a habit
   */
  async completeHabit(habitId: string): Promise<void> {
    console.log(`[ChildAPI] Completing habit: ${habitId}`);
    await this.hass.callService(DOMAIN, 'complete_habit', {
      habit_id: habitId,
      child_id: this.childId,
    });
  }

  /**
   * Claim a reward
   */
  async claimReward(rewardId: string): Promise<void> {
    console.log(`[ChildAPI] Claiming reward: ${rewardId}`);
    await this.hass.callService(DOMAIN, 'claim_reward', {
      reward_id: rewardId,
      child_id: this.childId,
    });
  }

  /**
   * Subscribe to Home Assistant events for real-time updates
   */
  async subscribeToUpdates(callback: () => void): Promise<() => void> {
    return await this.hass.connection.subscribeEvents((event) => {
      console.log('[ChildAPI] Received HA event:', event);
      callback();
    }, `${DOMAIN}_update`);
  }
}
