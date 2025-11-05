/**
 * Theme utilities for Habits Manager
 * Provides color schemes, rarity colors, and theme helpers
 */

import { CosmeticRarity, TaskType } from '../types/models';

// Rarity colors
export const RARITY_COLORS = {
  [CosmeticRarity.COMMON]: '#9E9E9E',      // Gray
  [CosmeticRarity.RARE]: '#2196F3',       // Blue
  [CosmeticRarity.EPIC]: '#9C27B0',       // Purple
  [CosmeticRarity.LEGENDARY]: '#FF9800',  // Orange
};

// Task type colors
export const TASK_TYPE_COLORS = {
  [TaskType.MANDATORY]: '#F44336',  // Red
  [TaskType.BONUS]: '#4CAF50',      // Green
};

// Default colors
export const DEFAULT_COLORS = {
  task: '#4CAF50',
  habit: '#2196F3',
  reward: '#FF5722',
  cosmetic: '#9C27B0',
  badge: '#FFC107',
};

// Status colors
export const STATUS_COLORS = {
  pending: '#FF9800',           // Orange
  completed_waiting: '#03A9F4', // Light Blue
  validated: '#4CAF50',         // Green
  refused: '#F44336',           // Red
  failed: '#9E9E9E',            // Gray
  approved: '#4CAF50',          // Green
  expired: '#9E9E9E',           // Gray
};

// Level colors (gradient based on level)
export function getLevelColor(level: number): string {
  const colors = [
    '#9E9E9E',  // 1-5: Gray
    '#03A9F4',  // 6-10: Light Blue
    '#2196F3',  // 11-15: Blue
    '#9C27B0',  // 16-20: Purple
    '#FF9800',  // 21+: Orange
  ];

  const index = Math.min(Math.floor((level - 1) / 5), colors.length - 1);
  return colors[index];
}

// Streak colors (gradient based on streak length)
export function getStreakColor(streak: number): string {
  if (streak === 0) return '#9E9E9E';     // Gray
  if (streak < 7) return '#4CAF50';       // Green
  if (streak < 30) return '#2196F3';      // Blue
  if (streak < 90) return '#9C27B0';      // Purple
  return '#FF9800';                        // Orange (legendary)
}

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

// Get contrast color (black or white) based on background
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#ffffff';

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Lighten a color by a percentage
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent / 100));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent / 100));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent / 100));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Darken a color by a percentage
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.round(rgb.r * (100 - percent) / 100));
  const g = Math.max(0, Math.round(rgb.g * (100 - percent) / 100));
  const b = Math.max(0, Math.round(rgb.b * (100 - percent) / 100));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Generate CSS custom properties for a color scheme
export function generateColorScheme(primaryColor: string): Record<string, string> {
  return {
    '--primary-color': primaryColor,
    '--primary-color-light': lightenColor(primaryColor, 20),
    '--primary-color-dark': darkenColor(primaryColor, 20),
    '--primary-text-on-color': getContrastColor(primaryColor),
  };
}
