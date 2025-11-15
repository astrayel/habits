/**
 * Shared Styles for Kids Tasks Legacy Cards
 *
 * This file contains all the CSS styles for the new features added during
 * the migration from kids-tasks-ha to habits-manager:
 * - Habits (recurring activities with streaks)
 * - Cosmetics (avatar customization items)
 * - Validation (task and reward approval workflow)
 * - Enhanced tabs and navigation
 *
 * These styles are designed to match the existing visual style of
 * kids-tasks-ha-card while supporting the new functionality.
 */

export const sharedStyles = `
  /* =====================================================
     TABS AND NAVIGATION
     ===================================================== */

  .tabs {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-bottom: 2px solid var(--divider-color, #e0e0e0);
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .tab {
    flex: 0 0 auto;
    padding: 8px 16px;
    background: var(--secondary-background-color, #f5f5f5);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--secondary-text-color, #666);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .tab:hover {
    background: var(--divider-color, #e0e0e0);
    transform: translateY(-1px);
  }

  .tab.active {
    background: var(--primary-color, #3b82f6);
    color: var(--text-primary-on-background, #fff);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .tab:focus {
    outline: 2px solid var(--primary-color, #3b82f6);
    outline-offset: 2px;
  }

  /* =====================================================
     HABITS SECTION
     ===================================================== */

  .habits-section {
    padding: 16px;
  }

  .habits-section h3 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
  }

  .habit-card {
    background: var(--card-background-color, #fff);
    border: 2px solid var(--divider-color, #e0e0e0);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
  }

  .habit-card:hover {
    border-color: var(--primary-color, #3b82f6);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .habit-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .habit-icon {
    font-size: 32px;
    line-height: 1;
  }

  .habit-name {
    flex: 1;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
  }

  .habit-streak {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    border-radius: 12px;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }

  .habit-description {
    color: var(--secondary-text-color, #666);
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 1.4;
  }

  .habit-rewards {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .habit-rewards > span {
    padding: 4px 10px;
    background: var(--secondary-background-color, #f5f5f5);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
  }

  .complete-habit-btn {
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #4ade80, #22c55e);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .complete-habit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
  }

  .complete-habit-btn:active {
    transform: translateY(0);
  }

  .complete-habit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* =====================================================
     COSMETICS SECTION
     ===================================================== */

  .cosmetics-section {
    padding: 16px;
  }

  .cosmetics-section h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
  }

  .cosmetics-section > p {
    margin: 0 0 20px 0;
    color: var(--secondary-text-color, #666);
    font-size: 14px;
  }

  .cosmetic-category {
    margin-bottom: 24px;
  }

  .cosmetic-category h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cosmetic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .cosmetic-card {
    background: var(--card-background-color, #fff);
    border: 3px solid var(--divider-color, #e0e0e0);
    border-radius: 12px;
    padding: 12px;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .cosmetic-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  /* Rarity-based border colors */
  .rarity-common {
    border-color: #9ca3af;
  }

  .rarity-common:hover {
    border-color: #6b7280;
    box-shadow: 0 6px 12px rgba(156, 163, 175, 0.3);
  }

  .rarity-rare {
    border-color: #3b82f6;
  }

  .rarity-rare:hover {
    border-color: #2563eb;
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
  }

  .rarity-epic {
    border-color: #a855f7;
  }

  .rarity-epic:hover {
    border-color: #9333ea;
    box-shadow: 0 6px 12px rgba(168, 85, 247, 0.3);
  }

  .rarity-legendary {
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fef3c7, #fff);
  }

  .rarity-legendary:hover {
    border-color: #d97706;
    box-shadow: 0 6px 12px rgba(245, 158, 11, 0.4);
  }

  .cosmetic-preview {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    background: var(--secondary-background-color, #f5f5f5);
    border-radius: 8px;
  }

  .cosmetic-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .cosmetic-icon {
    font-size: 48px;
    line-height: 1;
  }

  .cosmetic-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    margin-bottom: 4px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cosmetic-rarity {
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .rarity-common .cosmetic-rarity {
    color: #6b7280;
  }

  .rarity-rare .cosmetic-rarity {
    color: #2563eb;
  }

  .rarity-epic .cosmetic-rarity {
    color: #9333ea;
  }

  .rarity-legendary .cosmetic-rarity {
    color: #d97706;
  }

  .cosmetic-cost {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-color, #3b82f6);
    margin-bottom: 8px;
  }

  .cosmetic-owned {
    display: inline-block;
    padding: 4px 8px;
    background: #dcfce7;
    color: #166534;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .cosmetic-locked {
    display: inline-block;
    padding: 4px 8px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
  }

  .purchase-cosmetic-btn {
    width: 100%;
    padding: 6px 12px;
    background: var(--primary-color, #3b82f6);
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .purchase-cosmetic-btn:hover {
    background: var(--primary-color-dark, #2563eb);
    transform: scale(1.05);
  }

  .purchase-cosmetic-btn:active {
    transform: scale(0.98);
  }

  /* =====================================================
     VALIDATION SECTION
     ===================================================== */

  .validation-section {
    padding: 16px;
  }

  .validation-section h3 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
  }

  .validation-queue {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .validation-queue h4 {
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--divider-color, #e0e0e0);
    font-size: 16px;
    font-weight: 600;
    color: var(--secondary-text-color, #666);
  }

  .validation-card {
    background: var(--card-background-color, #fff);
    border: 2px solid var(--warning-color, #ff9800);
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;
  }

  .validation-card:hover {
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
    transform: translateY(-2px);
  }

  .validation-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .validation-header .child-name {
    padding: 4px 10px;
    background: var(--primary-color, #3b82f6);
    color: white;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  .validation-header .task-name {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
  }

  .validation-info {
    color: var(--secondary-text-color, #666);
    font-size: 13px;
    margin-bottom: 12px;
  }

  .validation-actions {
    display: flex;
    gap: 8px;
  }

  .validate-btn {
    flex: 1;
    padding: 10px;
    background: linear-gradient(135deg, #4ade80, #22c55e);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .validate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
  }

  .validate-btn:active {
    transform: translateY(0);
  }

  .refuse-btn {
    flex: 1;
    padding: 10px;
    background: linear-gradient(135deg, #f87171, #ef4444);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .refuse-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  }

  .refuse-btn:active {
    transform: translateY(0);
  }

  .approve-btn {
    flex: 1;
    padding: 10px;
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .approve-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .approve-btn:active {
    transform: translateY(0);
  }

  /* =====================================================
     RESPONSIVE DESIGN
     ===================================================== */

  @media (max-width: 768px) {
    .tabs {
      padding: 8px 12px;
    }

    .tab {
      padding: 6px 12px;
      font-size: 13px;
    }

    .cosmetic-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;
    }

    .validation-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .validation-actions {
      flex-direction: column;
    }

    .validate-btn,
    .refuse-btn,
    .approve-btn {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .cosmetic-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .habit-header {
      flex-wrap: wrap;
    }

    .habit-streak {
      order: -1;
      width: 100%;
      justify-content: center;
    }
  }

  /* =====================================================
     ANIMATIONS
     ===================================================== */

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .habit-card,
  .cosmetic-card,
  .validation-card {
    animation: slideIn 0.3s ease-out;
  }

  .rarity-legendary {
    animation: pulse 2s ease-in-out infinite;
  }

  /* =====================================================
     ACCESSIBILITY
     ===================================================== */

  .tab:focus-visible,
  .complete-habit-btn:focus-visible,
  .purchase-cosmetic-btn:focus-visible,
  .validate-btn:focus-visible,
  .refuse-btn:focus-visible,
  .approve-btn:focus-visible {
    outline: 3px solid var(--primary-color, #3b82f6);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* =====================================================
     DARK MODE SUPPORT
     ===================================================== */

  @media (prefers-color-scheme: dark) {
    .habit-card,
    .cosmetic-card,
    .validation-card {
      background: var(--card-background-color, #1e1e1e);
    }

    .cosmetic-preview {
      background: rgba(255, 255, 255, 0.05);
    }

    .tab {
      background: rgba(255, 255, 255, 0.05);
    }

    .tab:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

/**
 * Helper function to inject styles into a shadow root
 * @param {ShadowRoot} shadowRoot - The shadow root to inject styles into
 */
export function injectSharedStyles(shadowRoot) {
  const styleEl = document.createElement('style');
  styleEl.textContent = sharedStyles;
  shadowRoot.appendChild(styleEl);
}

/**
 * Helper function to get category labels in French
 * @param {string} category - The category key
 * @returns {string} The localized category label
 */
export function getCategoryLabel(category) {
  const labels = {
    clothes: '=U Vêtements',
    accessory: '<€ Accessoires',
    pet: '=> Animaux',
    theme: '<¨ Thèmes',
    badge: '<Æ Badges',
    animation: '( Animations',
  };
  return labels[category] || category;
}

/**
 * Helper function to get rarity labels in French
 * @param {string} rarity - The rarity key
 * @returns {string} The localized rarity label
 */
export function getRarityLabel(rarity) {
  const labels = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire',
  };
  return labels[rarity] || rarity;
}

export default sharedStyles;
