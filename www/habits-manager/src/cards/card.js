// Kids Tasks Main Dashboard Card - Optimized CSS Version

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';
import { ENTITY_PREFIX } from './constants.js';
import { DataAdapter } from './data-adapter.js';
import logger from './logger.js';

class KidsTasksCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'dashboard';
  }

  setConfig(config) {
    this.config = { 
      title: 'Kids Tasks Manager',
      show_navigation: true,
      show_completed: false,
      show_rewards: true,
      mode: 'dashboard',
      ...config 
    };
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;

    // Optimized: Check only critical entity count changes (Phase 2)
    // Avoid full state object iteration when possible
    const oldKeys = oldHass.states ? Object.keys(oldHass.states) : [];
    const newKeys = newHass.states ? Object.keys(newHass.states) : [];
    
    // Quick length check first
    if (oldKeys.length !== newKeys.length) return true;
    
    // Only check habits_manager entities (more targeted)
    const oldHabitsCount = oldKeys.filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_`)).length;
    const newHabitsCount = newKeys.filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_`)).length;

    return oldHabitsCount !== newHabitsCount;
  }

  async render() {
    if (!this._hass) {
      this.shadowRoot.innerHTML = '<div class="kt-loading">Chargement...</div>';
      return;
    }

    const children = await this.getChildren();

    this.shadowRoot.innerHTML = `
      ${this.getOptimizedStyles()}
      <div class="card-content kids-tasks-scope">
        <div class="card-header">
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content">
          ${await this.renderCurrentView(children)}
        </div>
      </div>
    `;
  }


  getOptimizedStyles() {
    return `
      ${this.getCommonStyles()}
      <style>
        /* Dashboard-specific overrides */
        .card-header {
          background: linear-gradient(90deg, var(--custom-header-color, var(--kt-primary)) 0%, transparent 100%);
          background-size: 100% 4px;
          background-position: bottom;
        }
      </style>
    `;
  }

  renderNavigation() {
    const views = [
      { id: 'dashboard', label: '🏠 Tableau de bord' },
      { id: 'summary', label: '📊 Résumé' },
      { id: 'management', label: '⚙️ Gestion' }
    ];

    return `
      <div class="navigation">
        ${views.map(view => `
          <button 
            class="nav-button ${this.currentView === view.id ? 'active' : ''}"
            data-action="switch-view"
            data-id="${view.id}"
          >
            ${view.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  async renderCurrentView(children) {
    switch (this.currentView) {
      case 'dashboard':
        return await this.renderDashboard(children);
      case 'summary':
        return await this.renderSummary(children);
      case 'management':
        return this.renderManagement(children);
      default:
        return await this.renderDashboard(children);
    }
  }

  async renderDashboard(children) {
    if (children.length === 0) {
      return `
        <div class="kt-empty">
          <div class="kt-empty__icon">👨‍👩‍👧‍👦</div>
          <div class="kt-empty__text">Aucun enfant configuré</div>
          <div class="kt-empty__subtext">Configurez des enfants dans l'intégration Kids Tasks Manager.</div>
        </div>
      `;
    }

    const stats = await this.calculateGlobalStats(children);

    return `
      <div class="summary-stats kt-fade-in">
        <div class="summary-card">
          <div class="summary-icon">👦🏻</div>
          <div class="summary-number">${children.length}</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📋</div>
          <div class="summary-number">${stats.totalTasks}</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">✅</div>
          <div class="summary-number">${stats.completedToday}</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">⌛</div>
          <div class="summary-number">${stats.pendingTasks}</div>
        </div>
      </div>

      <div class="children-grid kt-fade-in">
        ${children.map(child => this.renderChild(child)).join('')}
      </div>
    `;
  }

  async renderSummary(children) {
    const stats = await this.calculateGlobalStats(children);
    
    return `
      <div class="summary-stats kt-fade-in">
        <div class="summary-card">
          <div class="summary-number">${children.length}</div>
          <div class="summary-label">Enfants</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${stats.totalTasks}</div>
          <div class="summary-label">Tâches actives</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${stats.completedToday}</div>
          <div class="summary-label">Terminées aujourd'hui</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${stats.totalPoints}</div>
          <div class="summary-label">Points</div>
        </div>
      </div>
      
      <div class="children-grid">
        ${children.map(child => this.renderChildSummary(child)).join('')}
      </div>
    `;
  }

  renderManagement(children) {
    return `
      <div class="management-content">
        <div class="kt-empty">
          <div class="kt-empty__icon">🚧</div>
          <div class="kt-empty__text">Gestion avancée</div>
          <div class="kt-empty__subtext">Fonctionnalités de gestion en cours de développement.</div>
        </div>
      </div>
    `;
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'view-child':
        this.handleViewChild(id);
        break;
      case 'show-child-history':
        this.showChildHistory(id);
        break;
      default:
        if (__DEV__) {
          console.warn('Unknown action:', action);
        }
    }
  }

  handleViewChild(childId) {
    console.info('View child details:', childId);
    
    const event = new CustomEvent('kids-tasks-view-child', {
      detail: { childId },
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  // Data methods (same as before)
  async getChildren() {
    if (!this._hass) return [];

    try {
      // Use API like base-card.js
      const result = await this._hass.callWS({
        type: 'call_service',
        domain: 'habits_manager',
        service: 'list_children',
        service_data: {},
        return_response: true
      });

      if (result && result.response && result.response.children) {
        return result.response.children.map(child => DataAdapter.adaptChild(child));
      }
    } catch (error) {
      logger.error('Error fetching children from API:', error);
    }

    // Fallback to sensor scanning
    const children = [];
    Object.keys(this._hass.states).forEach(entityId => {
      if (entityId.startsWith(`sensor.${ENTITY_PREFIX}_`) && entityId.endsWith('_points')) {
        const entity = this._hass.states[entityId];
        if (entity && entity.state !== 'unavailable') {
          const childId = entityId.replace(`sensor.${ENTITY_PREFIX}_`, '').replace('_points', '');
          children.push({
            id: childId,
            name: entity.attributes.friendly_name || childId,
            points: parseInt(entity.state) || 0,
            coins: entity.attributes.coins || 0,
            level: entity.attributes.level || 1,
            avatar: entity.attributes.avatar || entity.attributes.cosmetics?.avatar?.emoji || '👤',
            ...entity.attributes
          });
        }
      }
    });

    return children.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getChildStats(child) {
    const tasks = await this.getChildTasks(child.id);
    const today = new Date().toDateString();
    
    const completedToday = tasks.filter(t => 
      (t.status === 'completed' || t.status === 'validated') && 
      t.completed_at && new Date(t.completed_at).toDateString() === today
    ).length;
    
    const totalToday = tasks.filter(t => t.status === 'todo').length;
    
    return {
      completedToday,
      totalToday,
      totalTasks: tasks.length
    };
  }

  async getChildTasks(childId) {
    if (!this._hass) return [];

    try {
      // Use API
      const result = await this._hass.callWS({
        type: 'call_service',
        domain: 'habits_manager',
        service: 'list_tasks',
        service_data: { assigned_to: childId },
        return_response: true
      });

      if (result && result.response && result.response.tasks) {
        return result.response.tasks.map(task => DataAdapter.adaptTask(task, []));
      }
    } catch (error) {
      logger.error('Error fetching tasks from API:', error);
    }

    // Fallback to sensor scanning
    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_task_`))
      .map(id => this._hass.states[id])
      .filter(entity => entity.attributes &&
                      entity.attributes.assigned_children &&
                      entity.attributes.assigned_children.includes(childId));

    return taskEntities.map(entity => ({
      id: entity.entity_id.replace(`sensor.${ENTITY_PREFIX}_task_`, ''),
      name: entity.attributes.friendly_name || 'Tâche',
      status: entity.state,
      completed_at: entity.attributes.completed_at,
      ...entity.attributes
    }));
  }

  async calculateGlobalStats(children) {
    // Cache key based on child IDs and their points (Phase 3 optimization)
    const cacheKey = 'globalStats_' + children.map(c => `${c.id}:${c.points}`).join('_');
    const cached = this._getCachedData ? this._getCachedData(cacheKey) : null;
    if (cached) {
      return cached;
    }

    let totalTasks = 0;
    let completedToday = 0;
    let totalPoints = 0;
    let pendingTasks = 0;

    // Use Promise.all for parallel API calls
    const childStatsPromises = children.map(child => this.getChildStats(child));
    const childTasksPromises = children.map(child => this.getChildTasks(child.id));
    
    const [allStats, allTasks] = await Promise.all([
      Promise.all(childStatsPromises),
      Promise.all(childTasksPromises)
    ]);

    children.forEach((child, index) => {
      const stats = allStats[index];
      const childTasks = allTasks[index];
      
      totalTasks += stats.totalToday;
      completedToday += stats.completedToday;
      totalPoints += child.points || 0;

      // Calculer les tâches en attente de validation (completed mais pas validated)
      pendingTasks += childTasks.filter(task =>
        task.status === 'completed' && !task.validated
      ).length;
    });

    const result = {
      totalTasks,
      completedToday,
      totalPoints,
      pendingTasks
    };

    // Cache the result (shorter TTL since stats change frequently)
    if (this._setCachedData) {
      this._setCachedData(cacheKey, result);
    }

    return result;
  }

  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-card-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-card',
      title: 'Kids Tasks Manager',
      show_navigation: true,
      show_completed: false,
      show_rewards: true,
      mode: 'dashboard'
    };
  }
}

export { KidsTasksCard };