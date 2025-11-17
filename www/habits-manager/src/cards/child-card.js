// Kids Tasks Child Card - Individual child view component

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';
import { ENTITY_PREFIX } from './constants.js';

class KidsTasksChildCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this._refreshInterval = null;
    this._refreshTimeout = null;
    this._allTimers = new Set(); // Track all timers for cleanup
    this.currentTab = 'tasks';
    this.tasksFilter = 'active';
    this.rewardsFilter = 'all';
    this._lastDataHash = null;
    this._isVisible = true;
    this._refreshRate = 30000; // Increased to 30 seconds for better performance
  }

  connectedCallback() {
    // Set up smart auto-refresh with visibility detection
    this._setupSmartRefresh();
    
    // Track page visibility to pause refreshing when not visible
    this._setupVisibilityDetection();
    
    // Clean up any existing timers first
    this._cleanupTimers();
  }

  disconnectedCallback() {
    this._cleanupTimers();
    this._removeVisibilityDetection();
  }

  // Smart refresh that only updates when data actually changes
  _setupSmartRefresh() {
    const smartRefresh = () => {
      if (!this._hass || !this._initialized || !this._isVisible) {
        this._scheduleNextRefresh();
        return;
      }

      // Check if data has actually changed
      const currentDataHash = this._getDataHash();
      if (currentDataHash === this._lastDataHash) {
        this._scheduleNextRefresh();
        return;
      }

      // Data changed, perform refresh
      this._lastDataHash = currentDataHash;
      this.smartRender();
      this._scheduleNextRefresh();
    };

    // Initial refresh
    if (this._hass && this._initialized) {
      smartRefresh();
    }
  }

  // Schedule next refresh with exponential backoff for inactive periods
  _scheduleNextRefresh() {
    this._cleanupRefreshTimers();
    
    const refreshRate = this._isVisible ? this._refreshRate : this._refreshRate * 2;
    
    this._refreshTimeout = setTimeout(() => {
      this._setupSmartRefresh();
    }, refreshRate);
    
    this._allTimers.add(this._refreshTimeout);
  }

  // Generate hash of relevant data to detect changes
  _getDataHash() {
    if (!this._hass || !this.config?.child_id) return null;
    
    const child = this.getChild();
    const tasks = this.getChildTasks(this.config.child_id);
    const rewards = this.getChildRewards(this.config.child_id);
    
    // Create simple hash of key data points
    const dataString = JSON.stringify({
      childPoints: child?.points || 0,
      childCoins: child?.coins || 0,
      childLevel: child?.level || 1,
      taskCount: tasks.length,
      taskStates: tasks.map(t => `${t.id}:${t.status}`).join(','),
      rewardCount: rewards.length
    });
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
  }

  // Set up page visibility detection
  _setupVisibilityDetection() {
    this._visibilityChangeHandler = () => {
      this._isVisible = !document.hidden;
      
      if (this._isVisible) {
        // Page became visible, refresh immediately
        this._setupSmartRefresh();
      } else {
        // Page hidden, clean up active refresh
        this._cleanupRefreshTimers();
      }
    };
    
    document.addEventListener('visibilitychange', this._visibilityChangeHandler);
    this._isVisible = !document.hidden;
  }

  // Remove visibility detection
  _removeVisibilityDetection() {
    if (this._visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
      this._visibilityChangeHandler = null;
    }
  }

  // Clean up refresh timers specifically
  _cleanupRefreshTimers() {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
    
    if (this._refreshTimeout) {
      clearTimeout(this._refreshTimeout);
      this._allTimers.delete(this._refreshTimeout);
      this._refreshTimeout = null;
    }
  }

  // Clean up all timers and intervals
  _cleanupTimers() {
    this._cleanupRefreshTimers();
    
    // Clean up any tracked timers
    for (const timer of this._allTimers) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this._allTimers.clear();
    
    // Performance monitoring cleanup
    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('timers', this.constructor.name, 'remove');
    }
  }

  // Override base card cleanup
  _cleanupTouchInteractions() {
    super._cleanupTouchInteractions();
    this._cleanupTimers();
  }

  setConfig(config) {
    if (!config || !config.child_id) {
      throw new Error('Invalid configuration: child_id required');
    }
    
    this.config = {
      child_id: config.child_id,
      title: config.title || 'Mes Tâches',
      show_avatar: config.show_avatar !== false,
      show_progress: config.show_progress !== false,
      show_rewards: config.show_rewards !== false,
      show_completed: config.show_completed !== false,
      ...config
    };
    
    if (this._initialized && this._hass) {
      this.render();
    }
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;
    
    // Check if child data changed
    const childId = this.config.child_id;
    const oldChild = this.getChildFromHass(oldHass, childId);
    const newChild = this.getChildFromHass(newHass, childId);
    
    if (JSON.stringify(oldChild) !== JSON.stringify(newChild)) {
      return true;
    }
    
    // Check tasks and rewards
    const taskEntities = Object.keys(newHass.states).filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_task_`));
    const rewardEntities = Object.keys(newHass.states).filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_reward_`));
    
    for (const entityId of [...taskEntities, ...rewardEntities]) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!oldEntity || !newEntity || 
          oldEntity.state !== newEntity.state || 
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }
    
    return false;
  }

  render() {
    if (!this._hass || !this.config) {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        <div class="loading">Chargement...</div>
      `;
      return;
    }

    const child = this.getChild();
    if (!child) {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        <div class="error">
          Enfant non trouvé (ID: ${this.config.child_id})
        </div>
      `;
      return;
    }

    try {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        ${this.getChildSpecificStyles()}
        <div class="child-card-container">
          ${this.renderChild(child)}
          ${this.renderTabs()}
          ${this.renderTabContent(child)}
        </div>
      `;
    } catch (error) {
      console.error('Error rendering child card:', error);
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        <div class="error">Erreur: ${error.message}</div>
      `;
    }
  }

  getChildSpecificStyles() {
    return `
      <style>
        .child-card-container {
          padding: var(--kt-space-lg);
        }

        .child-header {
          text-align: center;
          margin-bottom: var(--kt-space-lg);
          padding: var(--kt-space-lg);
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
        }

        .child-card-colorful {
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0px;
        }

        .child-stats {
          display: flex;
          gap: var(--kt-space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .card-header, .navigation {
          border-radius: 0px;
        }

        .stat {
          background: var(--kt-primary);
          color: white;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          font-size: 0.9em;
        }

        .tabs {
          display: flex;
          border-bottom: 2px solid var(--kt-surface-variant);
          margin-bottom: var(--kt-space-lg);
          gap: var(--kt-space-sm);
        }

        .tab-button {
          background: none;
          border: none;
          padding: var(--kt-space-sm) var(--kt-space-md);
          border-radius: var(--kt-radius-sm) var(--kt-radius-sm) 0 0;
          cursor: pointer;
          font-weight: 600;
          transition: all var(--kt-transition-fast);
          color: var(--secondary-text-color);
        }

        .tab-button.active {
          background: var(--kt-primary);
          color: white;
        }

        .tab-button:hover {
          background: var(--kt-surface-variant);
        }

        .tab-button.active:hover {
          background: var(--kt-primary);
          opacity: 0.9;
        }

        .tab-content {
          min-height: 200px;
        }


        .filters {
          display: flex;
          gap: var(--kt-space-sm);
          margin-bottom: var(--kt-space-lg);
          flex-wrap: wrap;
        }

        .filter-btn {
          background: var(--kt-surface-variant);
          border: 2px solid transparent;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--kt-transition-fast);
          font-size: 0.85em;
        }

        .filter-btn.active {
          border-color: var(--kt-primary);
          background: var(--kt-primary);
          color: white;
        }

        .loading {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        .error {
          background: var(--kt-error);
          color: white;
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        .empty-icon {
          font-size: 3em;
          margin-bottom: var(--kt-space-md);
          opacity: 0.6;
        }

        /* Progress section styling */
        .progress-section {
          margin-bottom: var(--kt-space-lg);
        }

        /* Responsive adjustments for child card */
        @media (max-width: 768px) {
          .child-stats {
            flex-direction: column;
            align-items: center;
          }

          .tabs {
            flex-wrap: wrap;
          }
        }

        /* Include task and reward styles for history display */
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getTaskStyles() : ''}
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getRewardStyles() : ''}

        /* === HABITS STYLES === */
        .habits-section {
          padding: var(--kt-space-md);
        }

        .section-description {
          color: var(--secondary-text-color);
          margin-bottom: var(--kt-space-md);
          font-size: 0.9em;
        }

        .habit-list {
          display: flex;
          flex-direction: column;
          gap: var(--kt-space-md);
        }

        .habit-card {
          background: var(--kt-surface);
          border: 2px solid var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-md);
          transition: all var(--kt-transition-fast);
        }

        .habit-card:hover {
          border-color: var(--kt-primary);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .habit-header {
          display: flex;
          align-items: flex-start;
          gap: var(--kt-space-md);
          margin-bottom: var(--kt-space-sm);
        }

        .habit-icon {
          font-size: 2em;
          flex-shrink: 0;
        }

        .habit-info {
          flex: 1;
        }

        .habit-name {
          font-weight: 600;
          font-size: 1.1em;
          margin-bottom: var(--kt-space-xs);
        }

        .habit-description {
          color: var(--secondary-text-color);
          font-size: 0.9em;
        }

        .habit-streak {
          display: flex;
          align-items: center;
          gap: var(--kt-space-xs);
          background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
          color: white;
          padding: var(--kt-space-xs) var(--kt-space-sm);
          border-radius: var(--kt-radius-sm);
          font-weight: 700;
          font-size: 1.2em;
        }

        .streak-icon {
          font-size: 1.2em;
        }

        .habit-rewards {
          display: flex;
          gap: var(--kt-space-sm);
          margin-bottom: var(--kt-space-md);
          flex-wrap: wrap;
        }

        .reward-badge {
          background: var(--kt-surface-variant);
          padding: var(--kt-space-xs) var(--kt-space-sm);
          border-radius: var(--kt-radius-sm);
          font-size: 0.85em;
          font-weight: 600;
        }

        .habit-action {
          display: flex;
          justify-content: flex-end;
        }

        .habit-action .btn {
          padding: var(--kt-space-sm) var(--kt-space-lg);
          border-radius: var(--kt-radius-sm);
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all var(--kt-transition-fast);
        }

        .habit-action .btn-complete {
          background: var(--kt-success);
          color: white;
        }

        .habit-action .btn-complete:hover {
          background: var(--kt-success-dark, #28a745);
          transform: translateY(-2px);
        }

        /* === COSMETICS STYLES === */
        .cosmetics-section {
          padding: var(--kt-space-md);
        }

        .child-coins-display {
          background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
          color: white;
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          margin-bottom: var(--kt-space-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1.2em;
        }

        .cosmetic-category {
          margin-bottom: var(--kt-space-xl);
        }

        .cosmetic-category h4 {
          margin-bottom: var(--kt-space-md);
          font-size: 1.2em;
          color: var(--primary-text-color);
        }

        .cosmetic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--kt-space-md);
        }

        .cosmetic-card {
          background: var(--kt-surface);
          border: 2px solid var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all var(--kt-transition-fast);
        }

        .cosmetic-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        /* Rarity colors */
        .cosmetic-card.rarity-common {
          border-color: #9e9e9e;
        }

        .cosmetic-card.rarity-rare {
          border-color: #2196f3;
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, var(--kt-surface) 100%);
        }

        .cosmetic-card.rarity-epic {
          border-color: #9c27b0;
          background: linear-gradient(135deg, rgba(156, 39, 176, 0.05) 0%, var(--kt-surface) 100%);
        }

        .cosmetic-card.rarity-legendary {
          border-color: #ff9800;
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, var(--kt-surface) 100%);
          box-shadow: 0 0 20px rgba(255, 152, 0, 0.3);
        }

        .cosmetic-preview {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--kt-space-sm);
          border-radius: var(--kt-radius-sm);
          background: var(--kt-surface-variant);
        }

        .cosmetic-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .cosmetic-icon {
          font-size: 3em;
        }

        .cosmetic-info {
          flex: 1;
          width: 100%;
          margin-bottom: var(--kt-space-sm);
        }

        .cosmetic-name {
          font-weight: 600;
          margin-bottom: var(--kt-space-xs);
          font-size: 0.95em;
        }

        .cosmetic-rarity {
          font-size: 0.8em;
          color: var(--secondary-text-color);
          margin-bottom: var(--kt-space-xs);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cosmetic-card.rarity-rare .cosmetic-rarity {
          color: #2196f3;
        }

        .cosmetic-card.rarity-epic .cosmetic-rarity {
          color: #9c27b0;
        }

        .cosmetic-card.rarity-legendary .cosmetic-rarity {
          color: #ff9800;
          font-weight: 700;
        }

        .cosmetic-cost {
          font-weight: 700;
          font-size: 1.1em;
          color: var(--kt-primary);
          margin-bottom: var(--kt-space-sm);
        }

        .cosmetic-action {
          width: 100%;
        }

        .cosmetic-action .btn-purchase {
          width: 100%;
          padding: var(--kt-space-sm);
          border: none;
          border-radius: var(--kt-radius-sm);
          background: var(--kt-primary);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .cosmetic-action .btn-purchase:hover {
          background: var(--kt-primary-dark, #0056b3);
          transform: translateY(-2px);
        }

        .cosmetic-owned {
          color: var(--kt-success);
          font-weight: 600;
          font-size: 0.9em;
        }

        .cosmetic-locked {
          color: var(--secondary-text-color);
          font-size: 0.85em;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cosmetic-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .habit-header {
            flex-wrap: wrap;
          }

          .habit-streak {
            order: -1;
            width: 100%;
            justify-content: center;
            margin-bottom: var(--kt-space-sm);
          }
        }
      </style>
    `;
  }

  renderHeader(child) {
    if (!this.config.show_avatar) return '';

    const stats = this.getChildStats(child);
    
    return `
      <div class="child-header">
        <div class="child-avatar">${this.getAvatar(child, '👶')}</div>
        <div class="child-name">${child.name}</div>
        <div class="child-stats">
          <span class="stat">${child.points || 0} 🎫 Points</span>
          <span class="stat">${child.coins || 0} 🪙 Pièces</span>
          <span class="stat">Niveau ${child.level || 1}</span>
        </div>
        ${this.config.show_progress ? this.renderProgress(stats, child) : ''}
      </div>
    `;
  }

  renderProgress(stats, child) {
    // Adapt stats to match renderGauges() expectations
    const gaugeStats = {
      level: child?.level || 1,
      pointsInCurrentLevel: (child?.points || 0) % 100,
      pointsToNextLevel: 100,
      completedToday: stats.completedToday,
      totalToday: stats.totalTasksToday,
      totalPoints: child?.points || 0,
      coins: stats.coins
    };

    return `
      <div class="progress-section">
        ${this.renderGauges(gaugeStats, true)}
      </div>
    `;
  }

  renderTabs() {
    const tabs = [
      { id: 'tasks', label: '✅ Tâches', show: true },
      { id: 'habits', label: '⭐ Habitudes', show: true },
      { id: 'rewards', label: '🎁 Récompenses', show: this.config.show_rewards },
      { id: 'cosmetics', label: '🛍️ Boutique', show: this.config.show_rewards },
      { id: 'history', label: '📈 Historique', show: this.config.show_completed }
    ].filter(tab => tab.show);

    return `
      <div class="card-header">
        <div class="navigation">
          ${tabs.map(tab => `
            <button 
              class="nav-button ${this.currentTab === tab.id ? 'active' : ''}"
              data-action="switch-view"
              data-id="${tab.id}"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderTabContent(child) {
    switch (this.currentTab) {
      case 'tasks':
        return this.renderTasksTab(child);
      case 'habits':
        return this.renderHabitsTab(child);
      case 'rewards':
        return this.renderRewardsTab(child);
      case 'cosmetics':
        return this.renderCosmeticsTab(child);
      case 'history':
        return this.renderHistoryTab(child);
      default:
        return this.renderTasksTab(child);
    }
  }

  renderTasksTab(child) {
    const tasks = this.getChildTasks(child.child_id);
    const filteredTasks = this.filterTasks(tasks, this.tasksFilter, 'child');

    // Debug
    console.log('=== DEBUG CHILD TASKS ===');
    console.log('Child:', child);
    console.log('Child ID used:', child.child_id);
    console.log('Config child_id:', this.config.child_id);
    console.log('All tasks found:', tasks);
    console.log('Current filter:', this.tasksFilter);
    console.log('Filtered tasks:', filteredTasks);
    console.log('========================');

    return `
      <div class="tab-content">
        ${this.renderTaskFilters()}
        ${filteredTasks.length > 0 ? `
          <div class="task-list">
            ${filteredTasks.map(task => this.renderTaskItem(task)).join('')}
          </div>
        ` : this.emptySection('📝', 'Aucune tâche', 'Aucune tâche disponible pour ce filtre.')}
      </div>
    `;
  }

  renderTaskFilters() {
    const filters = [
      { id: 'active', label: 'Actives' },
      { id: 'bonus', label: 'Bonus' },
      { id: 'completed', label: 'Terminées' },
      { id: 'all', label: 'Toutes' }
    ];

    return super.renderTaskFilters({
      filters,
      filterProperty: 'tasksFilter',
      actionName: 'filter-tasks',
      wrapper: true,
      wrapperClass: 'filters'
    });
  }

  renderTaskItem(task) {
    return `
      <div class="task-item">
        <div class="item-icon">${this.getCategoryIcon(task)}</div>
        <div class="task-main">
          <div class="task-name">${task.name}</div>
          <div class="task-description">${task.description || ''}</div>
          <div class="task-meta">
            <span class="task-points">+${task.points || 0} 🎫</span>
            <span class="task-status ${task.status}">${task.status}</span>
          </div>
        </div>
        <div class="task-action">
          ${task.status === 'todo' ? `
            <button class="btn btn-complete"
                    data-action="complete-task"
                    data-id="${task.id}">✓</button>
          ` : task.status === 'pending_validation' ? `
            <span class="status pending">En attente de validation</span>
          ` : `
            <span class="status completed">✓</span>
          `}
        </div>
      </div>
    `;
  }

  renderRewardsTab(child) {
    const rewards = this.getRewards().filter(r => (r.min_level || 1) <= (child.level || 1));
    const affordableRewards = rewards.filter(r => 
      (r.cost <= child.points) && (r.coin_cost <= child.coins)
    );

    return `
      <div class="tab-content">
        ${affordableRewards.length > 0 ? `
          <div class="reward-list">
            ${affordableRewards.map(reward => this.renderRewardItem(reward, child)).join('')}
          </div>
        ` : this.emptySection('🎁', 'Aucune récompense', 'Aucune récompense disponible pour le moment.')}
      </div>
    `;
  }

  renderRewardItem(reward, child) {
    const canAfford = (reward.cost <= child.points) && (reward.coin_cost <= child.coins);
    
    return `
      <div class="reward-item kt-clickable-item ${canAfford ? '' : 'disabled'}" 
           data-action="claim-reward" 
           data-id="${reward.id}">
        <div class="reward-title">${this.getCategoryIcon(reward)} ${reward.name}</div>
        <div class="reward-description">${reward.description || ''}</div>
        <div class="reward-meta">
          <span class="reward-cost">
            ${reward.cost > 0 ? `${reward.cost} 🎫` : ''}
            ${reward.coin_cost > 0 ? ` ${reward.coin_cost} 🪙` : ''}
          </span>
        </div>
      </div>
    `;
  }

  renderHistoryTab(child) {
    // Use a placeholder that will be populated asynchronously
    setTimeout(() => this.loadHistoryContent(child), 100);

    return `
      <div class="tab-content">
        <div class="history-content-placeholder" id="history-${child.child_id}">
          <div class="loading">Chargement de l'historique...</div>
        </div>
      </div>
    `;
  }

  async loadHistoryContent(child) {
    try {
      const historyContent = await this.renderChildHistoryForTab(child);
      const placeholder = this.shadowRoot.getElementById(`history-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = historyContent;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      const placeholder = this.shadowRoot.getElementById(`history-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = '<div class="error">Erreur lors du chargement de l\'historique</div>';
      }
    }
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentTab = id;
        this.render();
        break;
      case 'filter-tasks':
        this.tasksFilter = id;
        this.render();
        break;
      case 'complete-task':
        this.completeTask(id);
        break;
      case 'complete-habit':
        this.completeHabit(id);
        break;
      case 'claim-reward':
        this.claimReward(id);
        break;
      case 'purchase-cosmetic':
        this.purchaseCosmetic(id);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }


  async completeTask(taskId) {
    try {
      // Try new habits_manager API first
      try {
        // Get the task instance for today
        const today = new Date().toISOString().split('T')[0];
        const instancesResult = await this._hass.callWS({
          type: 'call_service',
          domain: 'habits_manager',
          service: 'get_task_instances',
          service_data: {
            child_id: this.config.child_id,
            date: today
          },
          return_response: true
        }).catch(() => null);

        if (instancesResult?.response?.instances) {
          const instance = instancesResult.response.instances.find(i => i.task_id === taskId && i.date === today);

          if (instance) {
            await this._hass.callService('habits_manager', 'mark_task_completed', {
              instance_id: instance.id,
              child_id: this.config.child_id
            });
            return;
          }
        }
      } catch (newApiError) {
        console.log('New API not available, falling back to old API');
      }

      // Fallback to old API
      await this._hass.callService('kids_tasks', 'complete_task', {
        task_id: taskId,
        child_id: this.config.child_id
      });
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Erreur lors de la complétion de la tâche');
    }
  }

  async claimReward(rewardId) {
    try {
      await this._hass.callService('kids_tasks', 'claim_reward', {
        reward_id: rewardId,
        child_id: this.config.child_id
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  }

  // === HABITS TAB ===
  renderHabitsTab(child) {
    // Use a placeholder that will be populated asynchronously
    setTimeout(() => this.loadHabitsContent(child), 100);

    return `
      <div class="tab-content">
        <div class="habits-content-placeholder" id="habits-${child.child_id}">
          <div class="loading">Chargement des habitudes...</div>
        </div>
      </div>
    `;
  }

  async loadHabitsContent(child) {
    try {
      const result = await this._hass.callWS({
        type: 'call_service',
        domain: 'habits_manager',
        service: 'list_habits',
        service_data: { assigned_to: child.child_id },
        return_response: true
      });

      const habits = result?.response?.habits || [];

      // Get habit streaks for this child
      const streaksResult = await this._hass.callWS({
        type: 'call_service',
        domain: 'habits_manager',
        service: 'get_habit_streaks',
        service_data: { child_id: child.child_id },
        return_response: true
      }).catch(() => ({ response: { streaks: [] } }));

      const streaks = streaksResult?.response?.streaks || [];

      const habitsHtml = habits.length > 0 ? `
        <div class="habits-section">
          <h3>⭐ Mes habitudes</h3>
          <p class="section-description">Complète tes habitudes quotidiennes pour gagner des points et des pièces !</p>
          <div class="habit-list">
            ${habits.map(habit => this.renderHabitCard(habit, child, streaks)).join('')}
          </div>
        </div>
      ` : this.emptySection('⭐', 'Aucune habitude', 'Aucune habitude assignée pour le moment.');

      const placeholder = this.shadowRoot.getElementById(`habits-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = habitsHtml;
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      const placeholder = this.shadowRoot.getElementById(`habits-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = '<div class="error">Erreur lors du chargement des habitudes</div>';
      }
    }
  }

  renderHabitCard(habit, child, streaks = []) {
    const streak = streaks.find(s => s.habit_id === habit.id) || { current_streak: 0, longest_streak: 0 };
    const canComplete = this.canCompleteHabitToday(habit, streak);

    return `
      <div class="habit-card">
        <div class="habit-header">
          <span class="habit-icon">${habit.icon || '⭐'}</span>
          <div class="habit-info">
            <div class="habit-name">${habit.title || habit.name}</div>
            <div class="habit-description">${habit.description || ''}</div>
          </div>
          <div class="habit-streak">
            <span class="streak-icon">🔥</span>
            <span class="streak-count">${streak.current_streak || 0}</span>
          </div>
        </div>
        <div class="habit-rewards">
          ${habit.rewards?.points > 0 ? `<span class="reward-badge">⭐ ${habit.rewards.points} pts</span>` : ''}
          ${habit.rewards?.coins > 0 ? `<span class="reward-badge">🪙 ${habit.rewards.coins}</span>` : ''}
          ${habit.rewards?.experience > 0 ? `<span class="reward-badge">✨ ${habit.rewards.experience} XP</span>` : ''}
        </div>
        <div class="habit-action">
          ${canComplete ? `
            <button class="btn btn-complete"
                    data-action="complete-habit"
                    data-id="${habit.id}">
              ✅ Compléter
            </button>
          ` : `
            <span class="status completed">✅ Complétée aujourd'hui</span>
          `}
        </div>
      </div>
    `;
  }

  canCompleteHabitToday(habit, streak) {
    if (!streak.last_completed) return true;
    const lastCompleted = new Date(streak.last_completed);
    const today = new Date();
    return lastCompleted.toDateString() !== today.toDateString();
  }

  async completeHabit(habitId) {
    try {
      await this._hass.callService('habits_manager', 'complete_habit', {
        habit_id: habitId,
        child_id: this.config.child_id
      });

      // Refresh the display
      this.smartRender(true);
    } catch (error) {
      console.error('Error completing habit:', error);
      alert('Erreur lors de la complétion de l\'habitude');
    }
  }

  // === COSMETICS TAB ===
  renderCosmeticsTab(child) {
    // Use a placeholder that will be populated asynchronously
    setTimeout(() => this.loadCosmeticsContent(child), 100);

    return `
      <div class="tab-content">
        <div class="cosmetics-content-placeholder" id="cosmetics-${child.child_id}">
          <div class="loading">Chargement de la boutique...</div>
        </div>
      </div>
    `;
  }

  async loadCosmeticsContent(child) {
    try {
      const result = await this._hass.callWS({
        type: 'call_service',
        domain: 'habits_manager',
        service: 'list_cosmetics',
        service_data: { active_only: true },
        return_response: true
      });

      const cosmetics = result?.response?.cosmetics || [];

      // Group by category
      const categories = {
        clothes: { label: '👕 Vêtements', items: cosmetics.filter(c => c.category === 'clothes') },
        accessory: { label: '🎩 Accessoires', items: cosmetics.filter(c => c.category === 'accessory') },
        pet: { label: '🐾 Animaux', items: cosmetics.filter(c => c.category === 'pet') },
        theme: { label: '🎨 Thèmes', items: cosmetics.filter(c => c.category === 'theme') },
        badge: { label: '🏆 Badges', items: cosmetics.filter(c => c.category === 'badge') },
        animation: { label: '✨ Animations', items: cosmetics.filter(c => c.category === 'animation') }
      };

      const hasCosmetics = cosmetics.length > 0;

      const cosmeticsHtml = hasCosmetics ? `
        <div class="cosmetics-section">
          <h3>🛍️ Boutique de cosmétiques</h3>
          <p class="section-description">Utilise tes pièces pour personnaliser ton avatar !</p>
          <div class="child-coins-display">
            <span class="coins-label">Tes pièces:</span>
            <span class="coins-amount">🪙 ${child.coins || 0}</span>
          </div>

          ${Object.entries(categories).map(([catKey, catData]) => {
            if (catData.items.length === 0) return '';
            return `
              <div class="cosmetic-category">
                <h4>${catData.label}</h4>
                <div class="cosmetic-grid">
                  ${catData.items.map(item => this.renderCosmeticCard(item, child)).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : this.emptySection('🛍️', 'Boutique vide', 'Aucun cosmétique disponible pour le moment.');

      const placeholder = this.shadowRoot.getElementById(`cosmetics-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = cosmeticsHtml;
      }
    } catch (error) {
      console.error('Error loading cosmetics:', error);
      const placeholder = this.shadowRoot.getElementById(`cosmetics-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = '<div class="error">Erreur lors du chargement de la boutique</div>';
      }
    }
  }

  renderCosmeticCard(cosmetic, child) {
    const isOwned = child.owned_cosmetics?.includes(cosmetic.id);
    const canAfford = child.coins >= cosmetic.cost_coins;
    const meetsLevelReq = !cosmetic.unlock_requirements?.level ||
                          child.level >= cosmetic.unlock_requirements.level;

    const rarityLabels = {
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire'
    };

    return `
      <div class="cosmetic-card rarity-${cosmetic.rarity || 'common'}">
        <div class="cosmetic-preview">
          ${cosmetic.preview_image ?
            `<img src="${cosmetic.preview_image}" alt="${cosmetic.name}">` :
            `<span class="cosmetic-icon">${cosmetic.icon || '✨'}</span>`
          }
        </div>
        <div class="cosmetic-info">
          <div class="cosmetic-name">${cosmetic.name}</div>
          <div class="cosmetic-rarity">${rarityLabels[cosmetic.rarity] || 'Commun'}</div>
          <div class="cosmetic-cost">🪙 ${cosmetic.cost_coins}</div>
        </div>
        <div class="cosmetic-action">
          ${isOwned ?
            '<span class="cosmetic-owned">✅ Possédé</span>' :
            !meetsLevelReq ?
              `<span class="cosmetic-locked">🔒 Niveau ${cosmetic.unlock_requirements.level} requis</span>` :
              !canAfford ?
                '<span class="cosmetic-locked">🔒 Pas assez de pièces</span>' :
                `<button class="btn btn-purchase"
                         data-action="purchase-cosmetic"
                         data-id="${cosmetic.id}">
                   💰 Acheter
                 </button>`
          }
        </div>
      </div>
    `;
  }

  async purchaseCosmetic(cosmeticId) {
    try {
      await this._hass.callService('habits_manager', 'purchase_cosmetic', {
        cosmetic_id: cosmeticId,
        child_id: this.config.child_id
      });

      // Refresh the display
      this.smartRender(true);
    } catch (error) {
      console.error('Error purchasing cosmetic:', error);
      alert('Erreur lors de l\'achat du cosmétique');
    }
  }

  // Data access methods
  getChild() {
    const childId = this.config.child_id;
    return this.getChildFromHass(this._hass, childId);
  }

  getChildFromHass(hass, childIdOrName) {
    console.log('=== getChildFromHass DEBUG ===');
    console.log('Looking for child:', childIdOrName);

    // Get all points entities to see what we have
    const pointsEntities = Object.keys(hass.states)
      .filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_`) && id.endsWith('_points'));

    console.log('All points entities:', pointsEntities);

    // First, search by friendly_name (most common case)
    for (const entityId of pointsEntities) {
      const e = hass.states[entityId];
      console.log(`Entity ${entityId}:`, {
        friendly_name: e.attributes.friendly_name,
        state: e.state,
        attributes: e.attributes
      });

      if (e.attributes.friendly_name === childIdOrName || e.attributes.friendly_name?.toLowerCase() === childIdOrName.toLowerCase()) {
        const realId = e.attributes.child_id || entityId.replace(`sensor.${ENTITY_PREFIX}_`, '').replace('_points', '');
        console.log('Found by friendly_name! Real ID:', realId);
        return {
          id: realId,
          name: e.attributes.friendly_name || realId,
          points: parseInt(e.state) || 0,
          coins: e.attributes.coins || 0,
          level: e.attributes.level || 1,
          ...e.attributes
        };
      }
    }

    // Then try direct ID (for UUID cases)
    let pointsEntityId = `sensor.${ENTITY_PREFIX}_${childIdOrName}_points`;
    let entity = hass.states[pointsEntityId];

    if (entity) {
      console.log('Found by direct ID:', childIdOrName);
      return {
        id: childIdOrName,
        name: entity.attributes.friendly_name || childIdOrName,
        points: parseInt(entity.state) || 0,
        coins: entity.attributes.coins || 0,
        level: entity.attributes.level || 1,
        ...entity.attributes
      };
    }

    console.log('Child not found!');
    console.log('===============================');
    return null;
  }

  getChildTasks(childId) {
    if (!this._hass) return [];

    console.log('=== getChildTasks DEBUG ===');
    console.log('Input childId:', childId);

    // Get all task entities
    const allTaskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_task_`));

    console.log('All task entities:', allTaskEntities);

    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_task_`))
      .map(id => this._hass.states[id])
      .filter(entity => {
        if (!entity.attributes) return false;

        // Support multiple assignment formats
        const assignedChildIds = entity.attributes.assigned_child_ids ||
                                (entity.attributes.assigned_children ? entity.attributes.assigned_children :
                                (entity.attributes.assigned_child_id ? [entity.attributes.assigned_child_id] : []));

        console.log(`Task ${entity.entity_id}:`, {
          assigned_child_ids: entity.attributes.assigned_child_ids,
          assigned_children: entity.attributes.assigned_children,
          assigned_child_id: entity.attributes.assigned_child_id,
          final_assignedChildIds: assignedChildIds,
          searching_for: childId
        });

        const result = Array.isArray(assignedChildIds) ? assignedChildIds.includes(childId) : assignedChildIds === childId;
        console.log('Match result:', result);
        return result;
      });

    console.log('Filtered entities:', taskEntities.length);
    console.log('==========================');


    const result = taskEntities.map(entity => ({
      id: entity.entity_id.replace(`sensor.${ENTITY_PREFIX}_task_`, ''),
      name: entity.attributes.friendly_name || 'Tâche',
      description: entity.attributes.description,
      status: entity.state,
      points: entity.attributes.points || 0,
      category: entity.attributes.category,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));

    console.log('Final mapped tasks:', result);
    return result;
  }

  getRewards() {
    if (!this._hass) return [];

    const rewardEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_reward_`))
      .map(id => this._hass.states[id]);

    return rewardEntities.map(entity => ({
      id: entity.entity_id.replace(`sensor.${ENTITY_PREFIX}_reward_`, ''),
      name: entity.attributes.friendly_name || 'Récompense',
      description: entity.attributes.description,
      cost: entity.attributes.cost || 0,
      coin_cost: entity.attributes.coin_cost || 0,
      min_level: entity.attributes.min_level || 1,
      category: entity.attributes.category,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));
  }

  getChildRewards(childId) {
    const child = this.getChildFromHass(this._hass, childId);
    if (!child) return [];

    const allRewards = this.getRewards();
    return allRewards.filter(reward => (reward.min_level || 1) <= (child.level || 1));
  }

  getChildStats(child) {
    const tasks = this.getChildTasks(child.child_id);
    const completedToday = tasks.filter(t => 
      (t.status === 'completed' || t.status === 'validated') && 
      this.isToday(t.completed_at)
    ).length;
    const totalToday = tasks.filter(t => t.status === 'todo').length;
    
    return {
      completedToday,
      totalTasksToday: totalToday,
      points: child.points || 0,
      coins: child.coins || 0
    };
  }




  isToday(dateString) {
    if (!dateString) return false;
    const today = new Date().toDateString();
    return new Date(dateString).toDateString() === today;
  }

  // Configuration
  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-child-card-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-child-card',
      child_id: 'child1',
      title: 'Mes Tâches',
      show_avatar: true,
      show_progress: true,
      show_rewards: true,
      show_completed: true
    };
  }
}

// ES6 export
export { KidsTasksChildCard };