/**
 * TypeScript type definitions matching Python backend models
 * This file is auto-generated from DATAMODELS.md
 *
 * IMPORTANT: Keep in sync with backend Python models
 */

// =====================================================
// Child (Enfant)
// =====================================================

export interface AvatarCustomization {
  clothes: string | null;
  accessory: string | null;
  pet: string | null;
  theme: string;
}

export interface Avatar {
  photo_url: string;
  customization: AvatarCustomization;
}

export interface Child {
  id: string;
  name: string;
  person_entity: string;
  points: number;
  coins: number;
  level: number;
  experience: number;
  experience_to_next_level: number;
  avatar: Avatar;
  badges: string[];
  owned_cosmetics: string[];
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

export const DEFAULT_AVATAR_CUSTOMIZATION: AvatarCustomization = {
  clothes: null,
  accessory: null,
  pet: null,
  theme: 'default',
};

// =====================================================
// Task (Tâche)
// =====================================================

export enum TaskType {
  MANDATORY = 'mandatory',
  BONUS = 'bonus',
}

export enum ScheduleType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SPECIFIC_DATE = 'specific_date',
}

export enum TaskCategory {
  CHORES = 'chores',
  HOMEWORK = 'homework',
  PERSONAL = 'personal',
  OTHER = 'other',
}

export interface TaskSchedule {
  type: ScheduleType;
  days?: number[];  // 1=Monday, 7=Sunday
  time?: string;    // Format "HH:MM"
  specific_date?: string;  // ISO 8601
}

export interface TaskRewards {
  points: number;
  coins: number;
  experience: number;
}

export interface TaskPenalties {
  points: number;
  coins: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  assigned_to: string[];
  schedule: TaskSchedule;
  rewards: TaskRewards;
  penalties: TaskPenalties;
  icon: string;
  color: string;
  difficulty: number;  // 1-3
  estimated_duration: number;  // minutes
  category: TaskCategory;
  active: boolean;
  created_at: string;  // ISO 8601
}

// =====================================================
// TaskInstance (Instance de tâche)
// =====================================================

export enum TaskInstanceStatus {
  PENDING = 'pending',
  COMPLETED_WAITING = 'completed_waiting',
  VALIDATED = 'validated',
  REFUSED = 'refused',
  FAILED = 'failed',
}

export interface TaskInstance {
  id: string;
  task_id: string;
  child_id: string;
  date: string;  // ISO 8601 date
  status: TaskInstanceStatus;
  completed_at: string | null;  // ISO 8601
  validated_at: string | null;  // ISO 8601
  validator_id: string | null;
  validation_note: string;
  is_penalty_applied: boolean;
}

// =====================================================
// Habit (Habitude)
// =====================================================

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum StreakBonusType {
  PROGRESSIVE = 'progressive',
  FIXED = 'fixed',
}

export interface StreakBonus {
  enabled: boolean;
  type: StreakBonusType;
  multiplier: number;
}

export interface HabitRewards {
  points: number;
  coins: number;
  experience: number;
  streak_bonus: StreakBonus;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  rewards: HabitRewards;
  active: boolean;
  assigned_to: string[];
}

// =====================================================
// HabitStreak (Streak d'habitude)
// =====================================================

export interface StreakHistoryEntry {
  date: string;  // ISO 8601
  completed: boolean;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  child_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed: string | null;  // ISO 8601
  total_completions: number;
  streak_history: StreakHistoryEntry[];
}

// =====================================================
// Reward (Récompense réelle)
// =====================================================

export enum RewardType {
  SCREEN_TIME = 'screen_time',
  MEAL_CHOICE = 'meal_choice',
  ACTIVITY = 'activity',
  OTHER = 'other',
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: RewardType;
  cost_points: number;
  cost_coins: number;
  icon: string;
  color: string;
  stock: number | null;
  cooldown_days: number;
  active: boolean;
  requires_parent_approval: boolean;
}

// =====================================================
// RewardClaim (Réclamation de récompense)
// =====================================================

export enum RewardClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  USED = 'used',
  EXPIRED = 'expired',
}

export interface RewardClaim {
  id: string;
  reward_id: string;
  child_id: string;
  claimed_at: string;  // ISO 8601
  status: RewardClaimStatus;
  approved_by: string | null;
  approved_at: string | null;  // ISO 8601
  used_at: string | null;  // ISO 8601
  expires_at: string | null;  // ISO 8601
}

// =====================================================
// CosmeticItem (Élément cosmétique)
// =====================================================

export enum CosmeticCategory {
  CLOTHES = 'clothes',
  ACCESSORY = 'accessory',
  PET = 'pet',
  THEME = 'theme',
  BADGE = 'badge',
  ANIMATION = 'animation',
}

export enum CosmeticRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface CosmeticUnlockRequirements {
  level?: number;
  badge?: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  subcategory: string;
  rarity: CosmeticRarity;
  cost_coins: number;
  preview_image: string;
  unlock_requirements: CosmeticUnlockRequirements | null;
  active: boolean;
}

// =====================================================
// Badge (Badge de réussite)
// =====================================================

export enum BadgeConditionType {
  FIRST_TASK = 'first_task',
  TASKS_COUNT = 'tasks_count',
  STREAK_DAYS = 'streak_days',
  LEVEL_REACHED = 'level_reached',
  POINTS_EARNED = 'points_earned',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition_type: BadgeConditionType;
  condition_value: number;
  rarity: CosmeticRarity;
}

// =====================================================
// Events (Événements Home Assistant)
// =====================================================

export interface HabitsManagerEvent {
  update_type: string;
  child_id: string;
  timestamp: string;
  [key: string]: any;  // Additional data based on update_type
}

export type EventUpdateType =
  | 'task_completed'
  | 'task_validated'
  | 'task_refused'
  | 'task_failed'
  | 'habit_completed'
  | 'streak_increased'
  | 'streak_broken'
  | 'reward_claimed'
  | 'reward_approved'
  | 'cosmetic_purchased'
  | 'level_up'
  | 'badge_earned'
  | 'points_changed'
  | 'coins_changed';
