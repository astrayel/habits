// Kids Tasks Manager Card - Administration interface

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';
import { SERVICE_DOMAIN, ENTITY_PREFIX } from './constants.js';

class KidsTasksManagerCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'children';
    this.taskFilter = 'active';
  }

  setConfig(config) {
    this.config = {
      title: 'Gestion Tâches & Récompenses',
      show_navigation: true,
      ...config
    };
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;

    // Check for task/reward entity changes
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_task_`));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_task_`));

    if (oldTaskEntities.length !== newTaskEntities.length) return true;

    // Check for state changes in tasks/rewards
    for (const entityId of oldTaskEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state ||
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }

    // Check rewards
    const oldRewardEntities = Object.keys(oldHass.states).filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_reward_`));
    const newRewardEntities = Object.keys(newHass.states).filter(id => id.startsWith(`sensor.${ENTITY_PREFIX}_reward_`));

    if (oldRewardEntities.length !== newRewardEntities.length) return true;

    for (const entityId of oldRewardEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state ||
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }

    return false;
  }

  async render() {
    if (!this._hass) {
      this.shadowRoot.innerHTML = '<div class="kt-loading">Chargement...</div>';
      return;
    }

    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="card-content kids-tasks-scope">
        <div class="card-header">
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content">
          ${await this.renderCurrentView()}
        </div>
      </div>
    `;
  }

  getStyles() {
    return `
      ${this.getCommonStyles()}
      <style>
        /* Include task and reward styles */
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getTaskStyles() : ''}
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getRewardStyles() : ''}

        /* Manager-specific styles */

        .section {
          margin-bottom: var(--kt-space-lg);
        }

        .section h2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--kt-space-md);
          color: var(--primary-text-color);
        }

        ha-button.add-btn {
          --mdc-theme-primary: var(--kt-primary);
          --mdc-theme-on-primary: white;
        }


        .task-item.inactive {
          opacity: 0.6;
          background: var(--kt-surface-variant);
        }

        .task-item.out-of-period {
          border-left: 4px solid var(--kt-warning);
        }

        .task-main, .reward-main {
          flex: 1;
        }


        .task-rewards {
          display: flex;
          gap: var(--kt-space-xs);
          align-items: center;
        }

        .reward-points, .reward-coins {
          background: var(--kt-success);
          color: white;
          padding: 2px 8px;
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          font-size: 0.8em;
        }

        .reward-coins {
          background: var(--kt-coins-color);
        }

        /* Manager responsive overrides */
        @media (max-width: 768px) {
          .nav-tabs {
            flex-wrap: wrap;
          }

          .filters {
            justify-content: center;
          }
        }
      </style>
    `;
  }

  renderNavigation() {
    const tabs = [
      { id: 'children', label: '👦🏻 Enfants' },
      { id: 'tasks', label: '📝 Tâches' },
      { id: 'rewards', label: '🎁 Récompenses' },
      { id: 'cosmetics', label: '🎨 Cosmétiques' }
    ];

    return `
      <div class="navigation">
        ${tabs.map(tab => `
          <button
            class="nav-button ${this.currentView === tab.id ? 'active' : ''}"
            data-action="switch-view"
            data-id="${tab.id}"
          >
            ${tab.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  async renderCurrentView() {
    switch (this.currentView) {
      case 'children':
        return await this.renderChildrenView();
      case 'tasks':
        return await this.renderTasksView();
      case 'rewards':
        return await this.renderRewardsView();
      case 'cosmetics':
        return await this.renderCosmeticsView();
      default:
        return await this.renderChildrenView();
    }
  }

  async renderChildrenView() {
    const children = await this.getChildren();
    return `
      <div class="section">
        <h2>
          Gestion des enfants
          <ha-button class="add-btn" data-action="add-child" raised>Ajouter</ha-button>
        </h2>
        ${children.length > 0 ? `
          <div class="children-grid">
            ${children.map(child => this.renderChild(child)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">👶</div>
            <p>Aucun enfant configuré</p>
            <ha-button class="add-btn" data-action="add-child" raised>Créer votre premier enfant</ha-button>
          </div>
        `}
      </div>
    `;
  }

  async renderTasksView() {
    const allTasks = await this.getTasks();
    const tasks = this.filterTasks(allTasks, this.taskFilter);

    // Handle async renderTaskItem
    const taskItems = [];
    for (const task of tasks) {
      const html = await this.renderTaskItem(task);
      taskItems.push(html);
    }

    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <ha-button class="add-btn" data-action="add-task" raised>Ajouter</ha-button>
        </h2>

        <div class="filters">
          ${this.renderTaskFilters()}
        </div>

        ${tasks.length > 0 ? `
          <div class="task-list">
            ${taskItems.join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>Aucune tâche ${this.getFilterLabel(this.taskFilter)}</p>
            ${this.taskFilter === 'active' ? '<ha-button class="add-btn" data-action="add-task" raised>Créer votre première tâche</ha-button>' : ''}
          </div>
        `}
      </div>
    `;
  }

  renderTaskFilters() {
    const filters = [
      { id: 'all', label: 'Toutes' },
      { id: 'active', label: 'Actives' },
      { id: 'bonus', label: 'Bonus' },
      { id: 'inactive', label: 'Désactivées' },
      { id: 'out-of-period', label: 'Hors période' }
    ];

    return super.renderTaskFilters({
      filters,
      filterProperty: 'taskFilter',
      actionName: 'filter-tasks',
      wrapper: false
    });
  }

  async renderTaskItem(task) {
    const childName = await this.formatAssignedChildren(task);
    const taskIcon = this.getCategoryIcon(task);

    return `
      <div class="task-item kt-swipeable-item ${task.active === false ? 'inactive' : ''} ${!this.isTaskInPeriod(task) ? 'out-of-period' : ''}"
           data-action="edit-task" data-id="${task.id}">
        <div class="item-icon">${taskIcon}</div>
        <div class="task-main">
          <div class="task-name">${task.name}</div>
          <div class="task-meta">
            <span>👤${childName}</span>
            <span>📅${this.getFrequencyLabel(task.frequency)}</span>
            <span>📂${this.getCategoryLabel(task.category)}</span>
          </div>
          ${task.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${task.description}</div>` : ''}
        </div>
        <div class="task-rewards">
          ${task.points > 0 ? `<span class="reward-points">+${task.points} 🎫</span>` : ''}
          ${task.coins > 0 ? `<span class="reward-coins">+${task.coins} 🪙</span>` : ''}
        </div>
      </div>
    `;
  }

  async renderRewardsView() {
    const rewards = await this.getRewards();

    return `
      <div class="section">
        <h2>
          Gestion des récompenses
          <ha-button class="add-btn" data-action="add-reward" raised>Ajouter</ha-button>
        </h2>
        ${rewards.length > 0 ? `
          <div class="reward-list">
            ${rewards.map(reward => this.renderRewardItem(reward)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">🎁</div>
            <p>Aucune récompense créée</p>
            <ha-button class="add-btn" data-action="add-reward" raised>Créer votre première récompense</ha-button>
          </div>
        `}
      </div>
    `;
  }

  renderRewardItem(reward) {
    const rewardIcon = this.getCategoryIcon(reward);

    return `
      <div class="reward-item kt-swipeable-item"
           data-action="edit-reward" data-id="${reward.id}">
        <div class="item-icon">${rewardIcon}</div>
        <div class="reward-main">
          <div class="reward-name">${reward.name}</div>
          <div class="reward-meta">
            <span>💰 ${reward.cost} 🎫${reward.coin_cost > 0 ? ` + ${reward.coin_cost} 🪙` : ''}</span>
            <span>📂 ${this.getCategoryLabel(reward.category)}</span>
            ${reward.remaining_quantity !== null ? `<span>📦 ${reward.remaining_quantity} restant(s)</span>` : ''}
          </div>
          ${reward.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${reward.description}</div>` : ''}
        </div>
      </div>
    `;
  }

  async renderCosmeticsView() {
    // Charger les cosmétiques depuis le backend
    const cosmetics = await this.getCosmetics();

    return `
      <div class="section">
        <h2>
          🎨 Cosmétiques
          <ha-button class="add-btn" data-action="add-cosmetic" raised>Ajouter</ha-button>
        </h2>
        ${cosmetics.length > 0 ? `
          <div class="reward-list">
            ${cosmetics.map(cosmetic => this.renderCosmeticItem(cosmetic)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">🎨</div>
            <p>Aucun cosmétique disponible</p>
            <ha-button class="add-btn" data-action="add-cosmetic" raised>Créer votre premier cosmétique</ha-button>
          </div>
        `}
      </div>
    `;
  }

  renderCosmeticItem(cosmetic) {
    const rarityLabels = {
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire'
    };

    const categoryIcons = {
      clothes: '👕',
      accessory: '🎭',
      pet: '🐾',
      theme: '🎨',
      badge: '🏆',
      animation: '✨'
    };

    const icon = categoryIcons[cosmetic.category] || '🎁';

    return `
      <div class="reward-item kt-swipeable-item"
           data-action="edit-cosmetic" data-id="${cosmetic.id}">
        <div class="item-icon">${icon}</div>
        <div class="reward-main">
          <div class="reward-name">${cosmetic.name}</div>
          <div class="reward-meta">
            <span>🪙 ${cosmetic.cost_coins} pièces</span>
            <span>✨ ${rarityLabels[cosmetic.rarity] || 'Commun'}</span>
            ${cosmetic.unlock_requirements?.level ? `<span>🎯 Niveau ${cosmetic.unlock_requirements.level}+</span>` : ''}
          </div>
          ${cosmetic.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${cosmetic.description}</div>` : ''}
        </div>
      </div>
    `;
  }


  async handleAction(action, id, event) {
    console.log(`Action=${action}`);
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        await this.render();
        break;
      case 'filter-tasks':
        this.taskFilter = event.target.dataset.filter;
        await this.render();
        break;
      case 'add-child':
        await this.showChildForm();
        break;
      case 'edit-child':
        await this.showChildForm(id);
        break;
      case 'add-task':
        await this.handleAddTask();
        break;
      case 'edit-task':
        await this.handleEditTask(id);
        break;
      case 'add-reward':
        await this.handleAddReward();
        break;
      case 'edit-reward':
        await this.handleEditReward(id);
        break;
      case 'add-cosmetic':
        await this.handleAddCosmetic();
        break;
      case 'edit-cosmetic':
        await this.handleEditCosmetic(id);
        break;
      case 'show-child-history':
        await this.showChildHistory(id);
        break;
      case 'remove-child':
        await this.handleRemoveChild(id);
        break;
      default:
        if (__DEV__) {
          console.warn('Unknown action in manager card:', action);
        }
    }
  }

  // CRUD operations
  async handleAddTask() {
    await this.showTaskForm();
  }

  async handleEditTask(taskId) {
    await this.showTaskForm(taskId);
  }

  async showTaskForm(editTaskId = null) {
    const tasks = await this.getTasks();
    const children = await this.getChildren();
    const task = editTaskId ? tasks.find(t => t.id === editTaskId) : null;
    const isEdit = !!task;

    const categories = [
      { value: 'homework', label: '📚 Devoirs' },
      { value: 'chores', label: '🧹 Tâches ménagères' },
      { value: 'hygiene', label: '🪥 Hygiène' },
      { value: 'health', label: '💪 Santé' },
      { value: 'learning', label: '🎓 Apprentissage' },
      { value: 'creativity', label: '🎨 Créativité' },
      { value: 'social', label: '👥 Social' },
      { value: 'bonus', label: '⭐ Bonus' },
      { value: 'other', label: '📋 Autre' }
    ];

    const frequencies = [
      { value: 'daily', label: 'Quotidienne' },
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'monthly', label: 'Mensuelle' },
      { value: 'once', label: 'Une fois' }
    ];

    const weekDays = [
      { value: 'monday', label: 'Lun' },
      { value: 'tuesday', label: 'Mar' },
      { value: 'wednesday', label: 'Mer' },
      { value: 'thursday', label: 'Jeu' },
      { value: 'friday', label: 'Ven' },
      { value: 'saturday', label: 'Sam' },
      { value: 'sunday', label: 'Dim' }
    ];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="task_id" value="${task.id}">` : ''}

        <ha-textfield
          label="Nom de la tâche *"
          name="title"
          required
          value="${isEdit ? task.title || task.name : ''}"
          placeholder="Ex: Ranger sa chambre">
        </ha-textfield>

        <ha-textarea
          label="Description"
          name="description"
          value="${isEdit ? task.description || '' : ''}"
          placeholder="Détails de la tâche..."
          rows="3">
        </ha-textarea>

        <ha-select
          label="Catégorie *"
          name="category"
          required
          value="${isEdit ? task.category : 'chores'}">
          ${categories.map(cat => `
            <ha-list-item value="${cat.value}">${cat.label}</ha-list-item>
          `).join('')}
        </ha-select>

        <ha-select
          label="Fréquence *"
          name="frequency"
          required
          value="${isEdit ? task.frequency : 'daily'}">
          ${frequencies.map(freq => `
            <ha-list-item value="${freq.value}">${freq.label}</ha-list-item>
          `).join('')}
        </ha-select>

        <div class="selection-row">
          <div class="children-column">
            <div class="children-section">
              <label class="form-label">Enfants assignés *</label>
              <div class="children-grid">
                ${children.map(child => {
                  const childId = child.child_id || child.id;
                  const assignedIds = task ? (task.assigned_to || task.assigned_child_ids || task.assigned_children || []) : [];
                  const isAssigned = Array.isArray(assignedIds) ? assignedIds.includes(childId) : assignedIds === childId;
                  return `
                    <ha-formfield label="${child.name}">
                      <ha-checkbox
                        name="assigned_children"
                        value="${childId}"
                        ${isEdit && isAssigned ? 'checked' : ''}>
                      </ha-checkbox>
                    </ha-formfield>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="days-column">
            <div class="weekly-days-section" id="weekly-days" style="display: ${isEdit && task.frequency === 'weekly' ? 'block' : 'none'};">
              <label class="form-label">Jours de la semaine</label>
              <div class="days-grid">
                ${weekDays.map(day => `
                  <ha-formfield label="${day.label}">
                    <ha-checkbox
                      name="weekly_days"
                      value="${day.value}"
                      ${isEdit && (task.weekly_days || []).includes(day.value) ? 'checked' : ''}>
                    </ha-checkbox>
                  </ha-formfield>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <ha-textfield
            label="Difficulté (1=Facile, 3=Difficile)"
            name="difficulty"
            type="number"
            value="${isEdit ? task.difficulty || 1 : 1}"
            min="1"
            max="3">
          </ha-textfield>

          <ha-select
            label="Type de tâche"
            name="task_type"
            required
            value="${isEdit ? task.task_type || 'mandatory' : 'mandatory'}">
            <ha-list-item value="mandatory">Obligatoire</ha-list-item>
            <ha-list-item value="bonus">Bonus</ha-list-item>
          </ha-select>
        </div>

        <ha-formfield label="Tâche active">
          <ha-checkbox
            name="is_active"
            ${isEdit ? (task.is_active !== false && task.active !== false ? 'checked' : '') : 'checked'}>
          </ha-checkbox>
        </ha-formfield>

        <div class="dialog-actions">
          <ha-button type="button" class="btn btn-secondary btn-cancel">
            Annuler
          </ha-button>
          <ha-button type="button" class="btn btn-primary btn-submit">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier la tâche' : 'Ajouter une tâche');

    // Wire up buttons and set checkbox states
    setTimeout(() => {
      const btnCancel = dialog.querySelector('.btn-cancel');
      const btnSubmit = dialog.querySelector('.btn-submit');
      
      if (btnCancel) {
        btnCancel.addEventListener('click', () => dialog.close());
      }
      
      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => this.submitTaskForm(isEdit));
      }
      
      // Manually set checkbox states for editing and add change listeners
      if (isEdit && task) {
        const assignedIds = task.assigned_to || task.assigned_child_ids || task.assigned_children || [];
        const assignedArray = Array.isArray(assignedIds) ? assignedIds : [assignedIds];
        
        dialog.querySelectorAll('ha-checkbox[name="assigned_children"]').forEach(checkbox => {
          const childId = checkbox.value;
          const shouldBeChecked = assignedArray.includes(childId);
          checkbox.checked = shouldBeChecked;
          
          // Listen for changes
          checkbox.addEventListener('change', (e) => {
            console.log('Checkbox changed:', childId, 'checked:', e.target.checked);
          });
        });
      } else {
        // Add listeners for creation too
        dialog.querySelectorAll('ha-checkbox[name="assigned_children"]').forEach(checkbox => {
          checkbox.addEventListener('change', (e) => {
            console.log('Checkbox changed:', checkbox.value, 'checked:', e.target.checked);
          });
        });
      }
    }, 100);

    // Show/hide weekly days based on frequency
    setTimeout(() => {
      const frequencySelect = dialog.querySelector('ha-select[name="frequency"]');
      const weeklyDaysSection = dialog.querySelector('#weekly-days');

      if (frequencySelect && weeklyDaysSection) {
        const updateWeeklyDays = (freq) => {
          weeklyDaysSection.style.display = freq === 'weekly' ? 'block' : 'none';
        };

        frequencySelect.addEventListener('selected', (e) => {
          updateWeeklyDays(e.detail.value || e.target.value);
        });

        frequencySelect.addEventListener('change', (e) => {
          updateWeeklyDays(e.target.value);
        });
      }
    }, 100);
  }

  async submitTaskForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;

    // Get form values
    const title = form.querySelector('[name="title"]').value;
    const description = form.querySelector('[name="description"]')?.value || '';
    const category = form.querySelector('[name="category"]').value;
    const frequency = form.querySelector('[name="frequency"]').value;
    const difficulty = parseInt(form.querySelector('[name="difficulty"]').value) || 1;
    const task_type = form.querySelector('[name="task_type"]').value;
    const is_active = form.querySelector('[name="is_active"]').checked;

    // Get assigned children - ha-checkbox doesn't work with :checked selector
    const allCheckboxes = form.querySelectorAll('ha-checkbox[name="assigned_children"]');
    console.log('Reading checkbox states on submit:');
    const assignedChildren = Array.from(allCheckboxes)
      .filter(cb => {
        console.log('  -', cb.value, 'checked:', cb.checked);
        return cb.checked;
      })
      .map(cb => cb.value);
    console.log('Final assigned children:', assignedChildren);

    if (assignedChildren.length === 0) {
      alert('Veuillez sélectionner au moins un enfant');
      return;
    }

    // Get weekly days if applicable
    const weeklyDays = frequency === 'weekly'
      ? Array.from(form.querySelectorAll('[name="weekly_days"]:checked')).map(cb => cb.value)
      : null;

    const serviceData = {
      title,
      description,
      assigned_to: assignedChildren[0], // Backend expects single child ID for now
      difficulty,
      task_type
    };

    // Add optional fields only if editing
    if (isEdit) {
      serviceData.is_active = is_active;
    }

    try {
      if (isEdit) {
        const taskId = form.querySelector('[name="task_id"]').value;
        serviceData.task_id = taskId;
        await this.callService(SERVICE_DOMAIN, 'update_task', serviceData);
      } else {
        await this.callService(SERVICE_DOMAIN, 'create_task', serviceData);
      }
    } catch (error) {
      console.error('Error calling service:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'));
      return;
    }

    dialog.close();
  }

  async handleAddReward() {
    await this.showRewardForm();
  }

  async handleEditReward(rewardId) {
    await this.showRewardForm(rewardId);
  }

  async showRewardForm(editRewardId = null) {
    const rewards = await this.getRewards();
    const reward = editRewardId ? rewards.find(r => r.id === editRewardId) : null;
    const isEdit = !!reward;

    const categories = [
      { value: 'toy', label: '🧸 Jouet' },
      { value: 'activity', label: '🎮 Activité' },
      { value: 'treat', label: '🍭 Friandise' },
      { value: 'privilege', label: '⭐ Privilège' },
      { value: 'outing', label: '🎟️ Sortie' },
      { value: 'screen_time', label: "📺 Temps d'écran" },
      { value: 'cosmetic', label: '🎨 Cosmétique' },
      { value: 'other', label: '🎁 Autre' }
    ];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="reward_id" value="${reward.id}">` : ''}

        <ha-textfield
          label="Nom de la récompense *"
          name="name"
          required
          value="${isEdit ? reward.name : ''}"
          placeholder="Ex: 30 min de jeu vidéo">
        </ha-textfield>

        <ha-textarea
          label="Description"
          name="description"
          value="${isEdit ? reward.description || '' : ''}"
          placeholder="Détails de la récompense..."
          rows="3">
        </ha-textarea>

        <ha-select
          label="Catégorie *"
          name="category"
          required
          value="${isEdit ? reward.category : 'other'}">
          ${categories.map(cat => `
            <ha-list-item value="${cat.value}">${cat.label}</ha-list-item>
          `).join('')}
        </ha-select>

        <div class="form-row">
          <ha-textfield
            label="Coût en points 🎫"
            name="cost"
            type="number"
            value="${isEdit ? reward.cost || 0 : 100}"
            min="0"
            max="10000">
          </ha-textfield>

          <ha-textfield
            label="Coût en pièces 🪙"
            name="coin_cost"
            type="number"
            value="${isEdit ? reward.coin_cost || 0 : 0}"
            min="0"
            max="10000">
          </ha-textfield>
        </div>

        <ha-textfield
          label="Niveau minimum requis"
          name="min_level"
          type="number"
          value="${isEdit ? reward.min_level || 1 : 1}"
          min="1"
          max="99">
        </ha-textfield>

        <ha-textfield
          label="Quantité disponible (laisser vide pour illimité)"
          name="remaining_quantity"
          type="number"
          value="${isEdit && reward.remaining_quantity !== null ? reward.remaining_quantity : ''}"
          min="0"
          placeholder="Illimité">
        </ha-textfield>

        <ha-formfield label="Récompense active">
          <ha-checkbox
            name="active"
            ${isEdit ? (reward.active !== false ? 'checked' : '') : 'checked'}>
          </ha-checkbox>
        </ha-formfield>

        <div class="dialog-actions">
          <ha-button type="button" class="btn btn-secondary btn-cancel">
            Annuler
          </ha-button>
          <ha-button type="button" class="btn btn-primary btn-submit">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier la récompense' : 'Ajouter une récompense');

    // Wire up buttons
    setTimeout(() => {
      const btnCancel = dialog.querySelector('.btn-cancel');
      const btnSubmit = dialog.querySelector('.btn-submit');
      
      if (btnCancel) {
        btnCancel.addEventListener('click', () => dialog.close());
      }
      
      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => this.submitRewardForm(isEdit));
      }
    }, 100);
  }

  async submitRewardForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;

    // Get form values
    const title = form.querySelector('[name="name"]').value;
    const description = form.querySelector('[name="description"]')?.value || '';
    const cost_points = parseInt(form.querySelector('[name="cost"]').value) || 0;
    const stock_value = form.querySelector('[name="remaining_quantity"]').value;
    const stock = stock_value ? parseInt(stock_value) : null;

    const serviceData = {
      title,
      description,
      cost_points
    };

    if (stock !== null) {
      serviceData.stock = stock;
    }

    try {
      if (isEdit) {
        const rewardId = form.querySelector('[name="reward_id"]').value;
        serviceData.reward_id = rewardId;
        await this.callService(SERVICE_DOMAIN, 'update_reward', serviceData);
      } else {
        await this.callService(SERVICE_DOMAIN, 'create_reward', serviceData);
      }
    } catch (error) {
      console.error('Error calling service:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'));
      return;
    }

    dialog.close();
  }

  async handleAddCosmetic() {
    await this.showCosmeticForm();
  }

  async handleEditCosmetic(cosmeticId) {
    await this.showCosmeticForm(cosmeticId);
  }

  async showCosmeticForm(editCosmeticId = null) {
    const cosmetics = await this.getCosmetics();
    const cosmetic = editCosmeticId ? cosmetics.find(c => c.id === editCosmeticId) : null;
    const isEdit = !!cosmetic;

    const categories = [
      { value: 'clothes', label: '👕 Vêtements' },
      { value: 'accessory', label: '🎭 Accessoires' },
      { value: 'pet', label: '🐾 Animaux' },
      { value: 'theme', label: '🎨 Thèmes' },
      { value: 'badge', label: '🏆 Badges' },
      { value: 'animation', label: '✨ Animations' }
    ];

    const rarities = [
      { value: 'common', label: 'Commun' },
      { value: 'rare', label: 'Rare' },
      { value: 'epic', label: 'Épique' },
      { value: 'legendary', label: 'Légendaire' }
    ];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="cosmetic_id" value="${cosmetic.id}">` : ''}

        <ha-textfield
          label="Nom du cosmétique *"
          name="name"
          required
          value="${isEdit ? cosmetic.name : ''}"
          placeholder="Ex: T-shirt pirate">
        </ha-textfield>

        <ha-textarea
          label="Description"
          name="description"
          value="${isEdit ? cosmetic.description || '' : ''}"
          placeholder="Description du cosmétique..."
          rows="3">
        </ha-textarea>

        <ha-select
          label="Catégorie *"
          name="category"
          required
          value="${isEdit ? cosmetic.category : 'clothes'}">
          ${categories.map(cat => `
            <ha-list-item value="${cat.value}">${cat.label}</ha-list-item>
          `).join('')}
        </ha-select>

        <ha-textfield
          label="Sous-catégorie"
          name="subcategory"
          value="${isEdit ? cosmetic.subcategory || '' : ''}"
          placeholder="Ex: shirt, hat, dog...">
        </ha-textfield>

        <ha-select
          label="Rareté *"
          name="rarity"
          required
          value="${isEdit ? cosmetic.rarity : 'common'}">
          ${rarities.map(r => `
            <ha-list-item value="${r.value}">${r.label}</ha-list-item>
          `).join('')}
        </ha-select>

        <ha-textfield
          label="Coût en pièces 🪙"
          name="cost_coins"
          type="number"
          value="${isEdit ? cosmetic.cost_coins || 50 : 50}"
          min="0"
          max="10000">
        </ha-textfield>

        <ha-textfield
          label="URL de l'image (512x512px)"
          name="preview_image"
          value="${isEdit ? cosmetic.preview_image || '' : ''}"
          placeholder="/local/cosmetics/item.png">
        </ha-textfield>

        <ha-textfield
          label="Niveau minimum requis"
          name="level"
          type="number"
          value="${isEdit && cosmetic.unlock_requirements?.level ? cosmetic.unlock_requirements.level : ''}"
          min="1"
          max="99"
          placeholder="Aucun niveau requis">
        </ha-textfield>

        <ha-formfield label="Cosmétique actif">
          <ha-checkbox
            name="active"
            ${isEdit ? (cosmetic.active !== false ? 'checked' : '') : 'checked'}>
          </ha-checkbox>
        </ha-formfield>

        <div class="dialog-actions">
          <ha-button type="button" class="btn btn-secondary btn-cancel">
            Annuler
          </ha-button>
          <ha-button type="button" class="btn btn-primary btn-submit">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier le cosmétique' : 'Ajouter un cosmétique');

    // Wire up buttons
    setTimeout(() => {
      const btnCancel = dialog.querySelector('.btn-cancel');
      const btnSubmit = dialog.querySelector('.btn-submit');
      
      if (btnCancel) {
        btnCancel.addEventListener('click', () => dialog.close());
      }
      
      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => this.submitCosmeticForm(isEdit));
      }
    }, 100);
  }

  async submitCosmeticForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;

    // Get form values
    const name = form.querySelector('[name="name"]').value;
    const description = form.querySelector('[name="description"]')?.value || '';
    const category = form.querySelector('[name="category"]').value;
    const subcategory = form.querySelector('[name="subcategory"]')?.value || '';
    const rarity = form.querySelector('[name="rarity"]').value;
    const cost_coins = parseInt(form.querySelector('[name="cost_coins"]').value) || 50;
    const preview_image = form.querySelector('[name="preview_image"]')?.value || '';
    const level_value = form.querySelector('[name="level"]').value;
    const level = level_value ? parseInt(level_value) : null;
    const active = form.querySelector('[name="active"]').checked;

    const serviceData = {
      name,
      description,
      category,
      subcategory,
      rarity,
      cost_coins,
      active
    };

    if (preview_image) {
      serviceData.preview_image = preview_image;
    }

    if (level) {
      serviceData.unlock_requirements = { level };
    }

    try {
      if (isEdit) {
        const cosmeticId = form.querySelector('[name="cosmetic_id"]').value;
        serviceData.cosmetic_id = cosmeticId;
        await this.callService(SERVICE_DOMAIN, 'update_cosmetic', serviceData);
      } else {
        await this.callService(SERVICE_DOMAIN, 'create_cosmetic', serviceData);
      }
    } catch (error) {
      console.error('Error calling service:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'));
      return;
    }

    dialog.close();
  }

  async showChildForm(editChildId = null) {
    const children = await this.getChildren();
    const child = editChildId ? children.find(c => c.child_id === editChildId || c.id === editChildId) : null;
    const isEdit = !!child;
    const persons = this.getPersonEntities();

    const avatarOptions = ['👶', '👧', '👦', '🧒', '🧸', '🎈', '⭐', '🌟', '🏆', '🎯'];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="child_id" value="${child.child_id || child.id}">` : ''}

        <ha-textfield
          label="Nom de l'enfant *"
          name="name"
          required
          value="${isEdit ? child.name : ''}"
          placeholder="Prénom de l'enfant">
        </ha-textfield>

        <ha-select
          label="Type d'avatar"
          name="avatar_type"
          required
          value="${isEdit ? child.avatar_type || 'emoji' : 'emoji'}">
          <ha-list-item value="emoji">Emoji</ha-list-item>
          <ha-list-item value="url">URL d'image</ha-list-item>
          ${persons.length > 0 ? '<ha-list-item value="person_entity">Photo de la personne liée</ha-list-item>' : ''}
        </ha-select>

        <div id="avatar-config">
          <div id="emoji-config" style="display: ${isEdit && child.avatar_type !== 'emoji' ? 'none' : 'block'};">
            <label class="form-label">Choisir un emoji</label>
            <div class="avatar-options">
              ${avatarOptions.map(avatar => `
                <button type="button" class="avatar-option ${isEdit && child.avatar === avatar ? 'selected' : ''}"
                        data-avatar="${avatar}">
                  ${avatar}
                </button>
              `).join('')}
            </div>
            <input type="hidden" name="avatar" value="${isEdit ? child.avatar || '👶' : '👶'}">
          </div>

          <div id="url-config" style="display: ${isEdit && child.avatar_type === 'url' ? 'block' : 'none'};">
            <ha-textfield
              label="URL de l'image"
              name="avatar_url"
              value="${isEdit && child.avatar_type === 'url' ? child.avatar_data || '' : ''}"
              placeholder="https://example.com/photo.png">
            </ha-textfield>
          </div>

          ${persons.length > 0 ? `
          <div id="person_entity-config" style="display: ${isEdit && child.avatar_type === 'person_entity' ? 'block' : 'none'};">
            <ha-select
              label="Personne liée"
              name="person_entity_id"
              value="${isEdit ? child.person_entity_id || '' : ''}">
              <ha-list-item value="">Aucune liaison</ha-list-item>
              ${persons.map(person => `
                <ha-list-item value="${person.entity_id}" ${isEdit && child.person_entity_id === person.entity_id ? 'selected' : ''}>
                  ${person.name}
                </ha-list-item>
              `).join('')}
            </ha-select>
          </div>
          ` : ''}
        </div>

        ${!isEdit ? `
          <ha-textfield
            label="Points initiaux"
            name="initial_points"
            type="number"
            value="0"
            min="0"
            max="1000">
          </ha-textfield>
        ` : `
          <div class="form-row">
            <ha-textfield
              label="Niveau"
              name="level"
              type="number"
              value="${child.level || 1}"
              min="1"
              max="99">
            </ha-textfield>
            <ha-textfield
              label="Points"
              name="points"
              type="number"
              value="${child.points || 0}"
              min="0">
            </ha-textfield>
            <ha-textfield
              label="Pièces"
              name="coins"
              type="number"
              value="${child.coins || 0}"
              min="0">
            </ha-textfield>
          </div>
        `}

        <div class="dialog-actions">
          <ha-button type="button" class="btn btn-secondary btn-cancel">
            Annuler
          </ha-button>
          <ha-button type="button" class="btn btn-primary btn-submit">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant');

    // Wire up buttons
    setTimeout(() => {
      const btnCancel = dialog.querySelector('.btn-cancel');
      const btnSubmit = dialog.querySelector('.btn-submit');
      
      if (btnCancel) {
        btnCancel.addEventListener('click', () => dialog.close());
      }
      
      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => this.submitChildForm(isEdit));
      }
    }, 100);

    // Configuration des interactions avatar
    setTimeout(() => {
      // Gérer le changement de type d'avatar
      const avatarTypeSelect = dialog.querySelector('ha-select[name="avatar_type"]');
      const avatarConfig = dialog.querySelector('#avatar-config');

      if (avatarTypeSelect && avatarConfig) {
        // Fonction pour mettre à jour l'affichage des sections d'avatar
        const updateAvatarDisplay = (selectedType) => {
          avatarConfig.querySelectorAll('[id$="-config"]').forEach(div => {
            div.style.display = 'none';
          });
          const targetDiv = dialog.querySelector('#' + selectedType + '-config');
          if (targetDiv) {
            targetDiv.style.display = 'block';
          }
        };

        // Event listener pour ha-select
        avatarTypeSelect.addEventListener('selected', (e) => {
          const selectedType = e.detail.value || e.target.value;
          updateAvatarDisplay(selectedType);
        });

        // Event listener alternatif pour change
        avatarTypeSelect.addEventListener('change', (e) => {
          const selectedType = e.target.value;
          updateAvatarDisplay(selectedType);
        });

        // Gérer la sélection d'emoji
        avatarConfig.querySelectorAll('.avatar-option').forEach(btn => {
          btn.addEventListener('click', () => {
            avatarConfig.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const avatarInput = dialog.querySelector('input[name="avatar"]');
            if (avatarInput) {
              avatarInput.value = btn.dataset.avatar;
            }
          });
        });
      }
    }, 100);
  }

  // Note: showChildHistory is now handled by base-card.js

  async handleRemoveChild(childId) {
    const children = await this.getChildren();
    const child = children.find(c => c.child_id === childId || c.id === childId);
    const childName = child ? child.name : 'cet enfant';

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${childName} ?\n\n` +
                          `Cette action supprimera définitivement :\n` +
                          `• L'enfant et tous ses 🎫\n` +
                          `• Toutes ses tâches assignées\n` +
                          `• Tout l'historique de ses activités\n` +
                          `• Tous les capteurs associés\n\n` +
                          `Cette action est IRRÉVERSIBLE !`;

    if (confirm(confirmMessage)) {
      this.callService(SERVICE_DOMAIN, 'remove_child', {
        child_id: childId,
        force_remove_entities: true
      });
    }
  }

  async callService(domain, service, serviceData = {}) {
    try {
      await this._hass.callService(domain, service, serviceData);
      this._clearCache();
      await this.smartRender(true);
      return true;
    } catch (error) {
      console.error(`Error calling service ${service}:`, error);
      throw error;
    }
  }

  async submitChildForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;

    // Récupérer les valeurs des composants HA
    const name = form.querySelector('[name="name"]').value;
    const person_entity_id = form.querySelector('[name="person_entity_id"]')?.value || null;
    const avatar_type = form.querySelector('[name="avatar_type"]').value;

    let avatar_data = null;
    let avatar = '👶';

    // Déterminer les données d'avatar selon le type
    if (avatar_type === 'emoji') {
      avatar = form.querySelector('[name="avatar"]').value;
    } else if (avatar_type === 'url') {
      avatar_data = form.querySelector('[name="avatar_url"]').value;
    }

    const serviceData = {
      name,
      avatar,
      avatar_type,
    };

    // Ajouter seulement les champs non-null
    if (person_entity_id) serviceData.person_entity_id = person_entity_id;
    if (avatar_data) serviceData.avatar_data = avatar_data;

    if (!isEdit) {
      serviceData.initial_points = parseInt(form.querySelector('[name="initial_points"]')?.value || '0');
    } else {
      const childId = form.querySelector('[name="child_id"]').value;
      serviceData.child_id = childId;

      const newLevel = parseInt(form.querySelector('[name="level"]')?.value || '1');
      const newPoints = parseInt(form.querySelector('[name="points"]')?.value || '0');
      const newCoins = parseInt(form.querySelector('[name="coins"]')?.value || '0');

      // Pour l'édition, on utilise update_child
      const success = await this.callService(SERVICE_DOMAIN, 'update_child', serviceData);

      if (success) {
        // Ajuster les points et pièces si nécessaire
        const children = await this.getChildren();
        const currentChild = children.find(c => (c.child_id || c.id) === childId);

        if (currentChild) {
          const pointsDiff = newPoints - (currentChild.points || 0);
          const coinsDiff = newCoins - (currentChild.coins || 0);

          if (pointsDiff !== 0) {
            await this.callService(SERVICE_DOMAIN, 'adjust_points', {
              child_id: childId,
              points: pointsDiff,
              reason: 'Ajustement manuel par admin'
            });
          }

          if (coinsDiff !== 0) {
            await this.callService(SERVICE_DOMAIN, 'adjust_coins', {
              child_id: childId,
              coins: coinsDiff,
              reason: 'Ajustement manuel par admin'
            });
          }
        }
      }
/*    } else {
      await this.callService(SERVICE_DOMAIN, 'add_child', serviceData);*/
    }

    dialog.close();
  }

  getPersonEntities() {
    if (!this._hass) return [];

    const persons = [];
    const entities = this._hass.states;

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('person.')) {
        const personEntity = entities[entityId];
        if (personEntity) {
          persons.push({
            entity_id: entityId,
            name: personEntity.attributes.friendly_name || personEntity.attributes.name || entityId.replace('person.', ''),
            picture: personEntity.attributes.entity_picture
          });
        }
      }
    });

    return persons.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Configuration
  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-manager-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-manager',
      title: 'Gestion Tâches & Récompenses',
      show_navigation: true
    };
  }
}

// ES6 export
export { KidsTasksManagerCard };