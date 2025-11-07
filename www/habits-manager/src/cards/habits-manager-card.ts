/**
 * Habits Manager Card
 * Management card for parents/admins to configure children, tasks, habits, and rewards
 * @version 0.1.0
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { HabitsManagerStore, createStore } from '../services/store';
import { baseStyles } from '../styles/base-styles';
import { CARD_TYPE_MANAGER } from '../types/constants';
import type {
  Child,
  Task,
  TaskType,
  TaskSchedule,
  ScheduleType,
  TaskCategory,
  Habit,
  HabitFrequency,
  Reward,
  RewardType,
  CosmeticItem,
} from '../types/models';
import { CosmeticCategory, CosmeticRarity } from '../types/models';

// Import shared components
import '../components/form-input';
import '../components/form-select';
import '../components/form-textarea';
import '../components/form-checkbox';
import '../components/hm-dialog';
import '../components/item-card';
import type { SelectOption } from '../components/form-select';

interface HabitsManagerCardConfig extends CardConfig {
  title?: string;
}

type TabType = 'children' | 'tasks' | 'habits' | 'rewards' | 'cosmetics';
type DialogMode = 'create' | 'edit';

const CARD_VERSION = '0.1.0';

@customElement('habits-manager-card')
export class HabitsManagerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsManagerCardConfig;
  @state() private _store?: HabitsManagerStore;
  @state() private _activeTab: TabType = 'children';
  @state() private _showDialog = false;
  @state() private _dialogMode: DialogMode = 'create';
  @state() private _selectedItem?: any;
  @state() private _loading = false;
  @state() private _error = '';
  @state() private _formData: any = {};

  static styles = baseStyles;

  public setConfig(config: HabitsManagerCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 3;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass && !this._store) {
      console.log('[Manager Card] Initializing store with hass:', !!this.hass);
      this._store = createStore(this.hass);
      this._store.subscribe(() => {
        console.log('[Manager Card] Store state changed, requesting update');
        this.requestUpdate();
      });
      // Force immediate update to show loading state
      this.requestUpdate();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._store) {
      this._store.destroy();
    }
  }

  // =====================================================
  // Main Render
  // =====================================================

  protected render() {
    if (!this._config || !this.hass) {
      return html`<div>Loading Habits Manager v${CARD_VERSION}...</div>`;
    }

    const title = this._config.title || 'Gestionnaire de Tâches';

    return html`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${title}</h1>
          </div>

          ${this._error
            ? html`
                <div class="error-banner">
                  <span>${this._error}</span>
                  <button class="btn btn-text" @click="${() => (this._error = '')}">✕</button>
                </div>
              `
            : ''}

          ${this._renderTabs()} ${this._renderContent()} ${this._renderDialog()}
        </div>
      </ha-card>
    `;
  }

  // =====================================================
  // Tabs Navigation
  // =====================================================

  private _renderTabs() {
    const tabs: { key: TabType; label: string; icon: string }[] = [
      { key: 'children', label: 'Enfants', icon: '👶' },
      { key: 'tasks', label: 'Tâches', icon: '✅' },
      { key: 'habits', label: 'Habitudes', icon: '🔄' },
      { key: 'rewards', label: 'Récompenses', icon: '🎁' },
      { key: 'cosmetics', label: 'Cosmétiques', icon: '👕' },
    ];

    return html`
      <div class="tabs">
        ${tabs.map(
          (tab) => html`
            <button
              class="tab ${this._activeTab === tab.key ? 'active' : ''}"
              @click="${() => this._handleTabChange(tab.key)}"
            >
              <span class="tab-icon">${tab.icon}</span>
              <span class="tab-label">${tab.label}</span>
            </button>
          `
        )}
      </div>
    `;
  }

  private _handleTabChange(tab: TabType): void {
    this._activeTab = tab;
    this._error = '';
  }

  // =====================================================
  // Content Based on Active Tab
  // =====================================================

  private _renderContent() {
    switch (this._activeTab) {
      case 'children':
        return this._renderChildrenSection();
      case 'tasks':
        return this._renderTasksSection();
      case 'habits':
        return this._renderHabitsSection();
      case 'rewards':
        return this._renderRewardsSection();
      case 'cosmetics':
        return this._renderCosmeticsSection();
      default:
        return html``;
    }
  }

  // =====================================================
  // Children Section
  // =====================================================

  private _renderChildrenSection() {
    if (!this._store) {
      console.log('[Manager Card] No store available yet');
      return html`<div class="loading">Initialisation du store...</div>`;
    }

    const state = this._store.getState();
    console.log('[Manager Card] Rendering children section, loading:', state.loading, 'children count:', state.children.length);

    if (state.loading) {
      return html`<div class="loading">Chargement des données...</div>`;
    }

    if (state.error) {
      return html`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${state.error}</span>
            <button class="btn btn-text" @click="${() => this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;
    }

    const children = state.children;

    return html`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Enfants</h2>
          <button class="btn btn-primary" @click="${() => this._openChildDialog('create')}">
            + Ajouter un enfant
          </button>
        </div>

        ${children.length === 0
          ? html`<p class="empty-message">Aucun enfant enregistré</p>`
          : html`
              <div class="items-list">
                ${children.map((child) => this._renderChildCard(child))}
              </div>
            `}
      </div>
    `;
  }

  private _renderChildCard(child: Child) {
    return html`
      <hm-item-card .icon="${'👤'}" .iconColor="${'#03a9f4'}">
        <div class="item-content">
          <h3 class="item-title">${child.name}</h3>
          <p class="item-description">
            Niveau ${child.level} • ${child.points} points • ${child.coins} pièces
          </p>
          <div class="item-meta">
            <span class="badge">${child.person_entity}</span>
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${() => this._openChildDialog('edit', child)}"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            class="btn-icon"
            @click="${() => this._handleDeleteChild(child)}"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </hm-item-card>
    `;
  }

  private _openChildDialog(mode: DialogMode, child?: Child): void {
    console.log('[Manager Card] Opening child dialog in mode:', mode, child);
    this._dialogMode = mode;
    this._selectedItem = child;
    this._formData = child
      ? {
          name: child.name,
          person_entity: child.person_entity,
          avatar_photo_url: child.avatar.photo_url,
        }
      : {
          name: '',
          person_entity: '',
          avatar_photo_url: '',
        };
    this._showDialog = true;
    console.log('[Manager Card] Dialog state updated:', {
      showDialog: this._showDialog,
      dialogMode: this._dialogMode,
      formData: this._formData
    });
    this.requestUpdate();
  }

  private async _handleSaveChild(): Promise<void> {
    if (!this._store) return;

    try {
      this._loading = true;
      this._error = '';

      if (this._dialogMode === 'create') {
        await this._store.createChild({
          name: this._formData.name,
          person_entity: this._formData.person_entity,
          avatar_photo_url: this._formData.avatar_photo_url || undefined,
        });
      } else if (this._selectedItem) {
        await this._store.updateChild(this._selectedItem.id, {
          name: this._formData.name,
          person_entity: this._formData.person_entity,
          avatar: {
            ...this._selectedItem.avatar,
            photo_url: this._formData.avatar_photo_url,
          },
        });
      }

      this._showDialog = false;
      this._formData = {};
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
    } finally {
      this._loading = false;
    }
  }

  private async _handleDeleteChild(child: Child): Promise<void> {
    if (!this._store) return;
    if (!confirm(`Supprimer l'enfant "${child.name}" ?`)) return;

    try {
      this._loading = true;
      this._error = '';
      await this._store.deleteChild(child.id);
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la suppression';
    } finally {
      this._loading = false;
    }
  }

  // =====================================================
  // Tasks Section
  // =====================================================

  private _renderTasksSection() {
    if (!this._store) return html`<div class="loading">Initialisation du store...</div>`;

    const state = this._store.getState();

    if (state.loading) {
      return html`<div class="loading">Chargement des données...</div>`;
    }

    if (state.error) {
      return html`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${state.error}</span>
            <button class="btn btn-text" @click="${() => this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;
    }

    const tasks = state.tasks;

    return html`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Tâches</h2>
          <button class="btn btn-primary" @click="${() => this._openTaskDialog('create')}">
            + Ajouter une tâche
          </button>
        </div>

        ${tasks.length === 0
          ? html`<p class="empty-message">Aucune tâche créée</p>`
          : html`
              <div class="items-list">
                ${tasks.map((task) => this._renderTaskCard(task))}
              </div>
            `}
      </div>
    `;
  }

  private _renderTaskCard(task: Task) {
    const children = this._store?.getChildren() || [];
    const assignedNames = task.assigned_to
      .map((id) => children.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    return html`
      <hm-item-card .icon="${task.icon}" .iconColor="${task.color}">
        <div class="item-content">
          <h3 class="item-title">${task.title}</h3>
          <p class="item-description">${task.description}</p>
          <div class="item-meta">
            <span class="badge">${task.type === 'mandatory' ? 'Obligatoire' : 'Bonus'}</span>
            <span class="badge">${this._formatCategory(task.category)}</span>
            ${assignedNames ? html`<span class="badge">👤 ${assignedNames}</span>` : ''}
            <span class="badge">⭐ ${task.rewards.points} pts</span>
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${() => this._openTaskDialog('edit', task)}"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            class="btn-icon"
            @click="${() => this._handleDeleteTask(task)}"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </hm-item-card>
    `;
  }

  private _openTaskDialog(mode: DialogMode, task?: Task): void {
    this._dialogMode = mode;
    this._selectedItem = task;
    this._formData = task
      ? {
          title: task.title,
          description: task.description,
          type: task.type,
          assigned_to: task.assigned_to,
          schedule_type: task.schedule.type,
          schedule_days: task.schedule.days || [],
          schedule_time: task.schedule.time || '',
          schedule_specific_date: task.schedule.specific_date || '',
          rewards_points: task.rewards.points,
          rewards_coins: task.rewards.coins,
          rewards_experience: task.rewards.experience,
          penalties_points: task.penalties.points,
          penalties_coins: task.penalties.coins,
          icon: task.icon,
          color: task.color,
          difficulty: task.difficulty,
          estimated_duration: task.estimated_duration,
          category: task.category,
        }
      : {
          title: '',
          description: '',
          type: 'mandatory',
          assigned_to: [],
          schedule_type: 'daily',
          schedule_days: [],
          schedule_time: '',
          schedule_specific_date: '',
          rewards_points: 10,
          rewards_coins: 5,
          rewards_experience: 10,
          penalties_points: 5,
          penalties_coins: 2,
          icon: '✅',
          color: '#03a9f4',
          difficulty: 1,
          estimated_duration: 15,
          category: 'chores',
        };
    this._showDialog = true;
  }

  private async _handleSaveTask(): Promise<void> {
    if (!this._store) return;

    try {
      this._loading = true;
      this._error = '';

      const taskData = {
        title: this._formData.title,
        description: this._formData.description,
        type: this._formData.type as TaskType,
        assigned_to: this._formData.assigned_to,
        schedule: {
          type: this._formData.schedule_type as ScheduleType,
          days: this._formData.schedule_days.length > 0 ? this._formData.schedule_days : undefined,
          time: this._formData.schedule_time || undefined,
          specific_date: this._formData.schedule_specific_date || undefined,
        } as TaskSchedule,
        rewards: {
          points: Number(this._formData.rewards_points),
          coins: Number(this._formData.rewards_coins),
          experience: Number(this._formData.rewards_experience),
        },
        penalties: {
          points: Number(this._formData.penalties_points),
          coins: Number(this._formData.penalties_coins),
        },
        icon: this._formData.icon,
        color: this._formData.color,
        difficulty: Number(this._formData.difficulty),
        estimated_duration: Number(this._formData.estimated_duration),
        category: this._formData.category as TaskCategory,
        active: true,
      };

      if (this._dialogMode === 'create') {
        await this._store.createTask(taskData);
      } else if (this._selectedItem) {
        await this._store.updateTask(this._selectedItem.id, taskData);
      }

      this._showDialog = false;
      this._formData = {};
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
    } finally {
      this._loading = false;
    }
  }

  private async _handleDeleteTask(task: Task): Promise<void> {
    if (!this._store) return;
    if (!confirm(`Supprimer la tâche "${task.title}" ?`)) return;

    try {
      this._loading = true;
      this._error = '';
      await this._store.deleteTask(task.id);
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la suppression';
    } finally {
      this._loading = false;
    }
  }

  // =====================================================
  // Habits Section
  // =====================================================

  private _renderHabitsSection() {
    if (!this._store) return html`<div class="loading">Initialisation du store...</div>`;

    const state = this._store.getState();

    if (state.loading) {
      return html`<div class="loading">Chargement des données...</div>`;
    }

    if (state.error) {
      return html`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${state.error}</span>
            <button class="btn btn-text" @click="${() => this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;
    }

    const habits = state.habits;

    return html`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Habitudes</h2>
          <button class="btn btn-primary" @click="${() => this._openHabitDialog('create')}">
            + Ajouter une habitude
          </button>
        </div>

        ${habits.length === 0
          ? html`<p class="empty-message">Aucune habitude créée</p>`
          : html`
              <div class="items-list">
                ${habits.map((habit) => this._renderHabitCard(habit))}
              </div>
            `}
      </div>
    `;
  }

  private _renderHabitCard(habit: Habit) {
    const children = this._store?.getChildren() || [];
    const assignedNames = habit.assigned_to
      .map((id) => children.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    return html`
      <hm-item-card .icon="${habit.icon}" .iconColor="${habit.color}">
        <div class="item-content">
          <h3 class="item-title">${habit.title}</h3>
          <p class="item-description">${habit.description}</p>
          <div class="item-meta">
            <span class="badge">${this._formatFrequency(habit.frequency)}</span>
            ${assignedNames ? html`<span class="badge">👤 ${assignedNames}</span>` : ''}
            <span class="badge">⭐ ${habit.rewards.points} pts</span>
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${() => this._openHabitDialog('edit', habit)}"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            class="btn-icon"
            @click="${() => this._handleDeleteHabit(habit)}"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </hm-item-card>
    `;
  }

  private _openHabitDialog(mode: DialogMode, habit?: Habit): void {
    this._dialogMode = mode;
    this._selectedItem = habit;
    this._formData = habit
      ? {
          title: habit.title,
          description: habit.description,
          frequency: habit.frequency,
          assigned_to: habit.assigned_to,
          rewards_points: habit.rewards.points,
          rewards_coins: habit.rewards.coins,
          rewards_experience: habit.rewards.experience,
          streak_bonus_enabled: habit.rewards.streak_bonus.enabled,
          streak_bonus_type: habit.rewards.streak_bonus.type,
          streak_bonus_multiplier: habit.rewards.streak_bonus.multiplier,
          icon: habit.icon,
          color: habit.color,
        }
      : {
          title: '',
          description: '',
          frequency: 'daily',
          assigned_to: [],
          rewards_points: 5,
          rewards_coins: 2,
          rewards_experience: 5,
          streak_bonus_enabled: true,
          streak_bonus_type: 'progressive',
          streak_bonus_multiplier: 1.1,
          icon: '🔄',
          color: '#4caf50',
        };
    this._showDialog = true;
  }

  private async _handleSaveHabit(): Promise<void> {
    if (!this._store) return;

    try {
      this._loading = true;
      this._error = '';

      const habitData = {
        title: this._formData.title,
        description: this._formData.description,
        frequency: this._formData.frequency as HabitFrequency,
        assigned_to: this._formData.assigned_to,
        rewards: {
          points: Number(this._formData.rewards_points),
          coins: Number(this._formData.rewards_coins),
          experience: Number(this._formData.rewards_experience),
          streak_bonus: {
            enabled: Boolean(this._formData.streak_bonus_enabled),
            type: this._formData.streak_bonus_type,
            multiplier: Number(this._formData.streak_bonus_multiplier),
          },
        },
        icon: this._formData.icon,
        color: this._formData.color,
        active: true,
      };

      if (this._dialogMode === 'create') {
        await this._store.createHabit(habitData);
      } else if (this._selectedItem) {
        await this._store.updateHabit(this._selectedItem.id, habitData);
      }

      this._showDialog = false;
      this._formData = {};
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
    } finally {
      this._loading = false;
    }
  }

  private async _handleDeleteHabit(habit: Habit): Promise<void> {
    if (!this._store) return;
    if (!confirm(`Supprimer l'habitude "${habit.title}" ?`)) return;

    try {
      this._loading = true;
      this._error = '';
      await this._store.deleteHabit(habit.id);
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la suppression';
    } finally {
      this._loading = false;
    }
  }

  // =====================================================
  // Rewards Section
  // =====================================================

  private _renderRewardsSection() {
    if (!this._store) return html`<div class="loading">Initialisation du store...</div>`;

    const state = this._store.getState();

    if (state.loading) {
      return html`<div class="loading">Chargement des données...</div>`;
    }

    if (state.error) {
      return html`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${state.error}</span>
            <button class="btn btn-text" @click="${() => this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;
    }

    const rewards = state.rewards;

    return html`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Récompenses</h2>
          <button class="btn btn-primary" @click="${() => this._openRewardDialog('create')}">
            + Ajouter une récompense
          </button>
        </div>

        ${rewards.length === 0
          ? html`<p class="empty-message">Aucune récompense créée</p>`
          : html`
              <div class="items-list">
                ${rewards.map((reward) => this._renderRewardCard(reward))}
              </div>
            `}
      </div>
    `;
  }

  private _renderRewardCard(reward: Reward) {
    return html`
      <hm-item-card .icon="${reward.icon}" .iconColor="${reward.color}">
        <div class="item-content">
          <h3 class="item-title">${reward.title}</h3>
          <p class="item-description">${reward.description}</p>
          <div class="item-meta">
            <span class="badge">${this._formatRewardType(reward.type)}</span>
            <span class="badge">⭐ ${reward.cost_points} pts</span>
            <span class="badge">💰 ${reward.cost_coins} pièces</span>
            ${reward.requires_parent_approval
              ? html`<span class="badge">✅ Validation requise</span>`
              : ''}
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${() => this._openRewardDialog('edit', reward)}"
            title="Modifier"
          >
            ✏️
          </button>
        </div>
      </hm-item-card>
    `;
  }

  private _openRewardDialog(mode: DialogMode, reward?: Reward): void {
    this._dialogMode = mode;
    this._selectedItem = reward;
    this._formData = reward
      ? {
          title: reward.title,
          description: reward.description,
          type: reward.type,
          cost_points: reward.cost_points,
          cost_coins: reward.cost_coins,
          icon: reward.icon,
          color: reward.color,
          stock: reward.stock,
          cooldown_days: reward.cooldown_days,
          requires_parent_approval: reward.requires_parent_approval,
        }
      : {
          title: '',
          description: '',
          type: 'activity',
          cost_points: 50,
          cost_coins: 20,
          icon: '🎁',
          color: '#ff9800',
          stock: null,
          cooldown_days: 0,
          requires_parent_approval: true,
        };
    this._showDialog = true;
  }

  private async _handleSaveReward(): Promise<void> {
    if (!this._store) return;

    try {
      this._loading = true;
      this._error = '';

      const rewardData = {
        title: this._formData.title,
        description: this._formData.description,
        type: this._formData.type as RewardType,
        cost_points: Number(this._formData.cost_points),
        cost_coins: Number(this._formData.cost_coins),
        icon: this._formData.icon,
        color: this._formData.color,
        stock: this._formData.stock ? Number(this._formData.stock) : null,
        cooldown_days: Number(this._formData.cooldown_days),
        requires_parent_approval: Boolean(this._formData.requires_parent_approval),
        active: true,
      };

      if (this._dialogMode === 'create') {
        await this._store.createReward(rewardData);
      } else if (this._selectedItem) {
        // Note: Update reward is not in the store, we'll need to add it
        // For now, just create a new one
        await this._store.createReward(rewardData);
      }

      this._showDialog = false;
      this._formData = {};
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
    } finally {
      this._loading = false;
    }
  }

  // =====================================================
  // Dialog Rendering
  // =====================================================

  private _renderDialog() {
    if (!this._showDialog) return html``;

    const title =
      this._dialogMode === 'create'
        ? `Ajouter ${this._getDialogTitleSuffix()}`
        : `Modifier ${this._getDialogTitleSuffix()}`;

    return html`
      <hm-dialog
        .open="${this._showDialog}"
        .title="${title}"
        .loading="${this._loading}"
        @confirm="${this._handleDialogConfirm}"
        @cancel="${this._handleDialogCancel}"
      >
        ${this._renderDialogContent()}
      </hm-dialog>
    `;
  }

  private _getDialogTitleSuffix(): string {
    switch (this._activeTab) {
      case 'children':
        return 'un enfant';
      case 'tasks':
        return 'une tâche';
      case 'habits':
        return 'une habitude';
      case 'rewards':
        return 'une récompense';
      case 'cosmetics':
        return 'un cosmétique';
      default:
        return '';
    }
  }

  private _renderDialogContent() {
    switch (this._activeTab) {
      case 'children':
        return this._renderChildForm();
      case 'tasks':
        return this._renderTaskForm();
      case 'habits':
        return this._renderHabitForm();
      case 'rewards':
        return this._renderRewardForm();
      case 'cosmetics':
        return this._renderCosmeticForm();
      default:
        return html``;
    }
  }

  private _handleDialogConfirm(): void {
    switch (this._activeTab) {
      case 'children':
        this._handleSaveChild();
        break;
      case 'tasks':
        this._handleSaveTask();
        break;
      case 'habits':
        this._handleSaveHabit();
        break;
      case 'rewards':
        this._handleSaveReward();
        break;
      case 'cosmetics':
        this._saveCosmeticDialog();
        break;
    }
  }

  private _handleDialogCancel(): void {
    this._showDialog = false;
    this._formData = {};
    this._selectedItem = undefined;
  }

  // =====================================================
  // Form Rendering
  // =====================================================

  private _renderChildForm() {
    return html`
      <hm-form-input
        label="Nom"
        .value="${this._formData.name || ''}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.name = e.detail.value)}"
      ></hm-form-input>

      <hm-form-input
        label="Entité Person"
        .value="${this._formData.person_entity || ''}"
        required
        helper="Ex: person.alice"
        @value-changed="${(e: CustomEvent) => (this._formData.person_entity = e.detail.value)}"
      ></hm-form-input>

      <hm-form-input
        label="URL Avatar (optionnel)"
        .value="${this._formData.avatar_photo_url || ''}"
        type="text"
        placeholder="https://..."
        @value-changed="${(e: CustomEvent) => (this._formData.avatar_photo_url = e.detail.value)}"
      ></hm-form-input>
    `;
  }

  private _renderTaskForm() {
    const children = this._store?.getChildren() || [];
    const childrenOptions: SelectOption[] = children.map((c) => ({
      value: c.id,
      label: c.name,
    }));

    const typeOptions: SelectOption[] = [
      { value: 'mandatory', label: 'Obligatoire' },
      { value: 'bonus', label: 'Bonus' },
    ];

    const scheduleOptions: SelectOption[] = [
      { value: 'daily', label: 'Quotidien' },
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'monthly', label: 'Mensuel' },
      { value: 'specific_date', label: 'Date spécifique' },
    ];

    const categoryOptions: SelectOption[] = [
      { value: 'chores', label: 'Tâches ménagères' },
      { value: 'homework', label: 'Devoirs' },
      { value: 'personal', label: 'Personnel' },
      { value: 'other', label: 'Autre' },
    ];

    return html`
      <hm-form-input
        label="Titre"
        .value="${this._formData.title || ''}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.title = e.detail.value)}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description || ''}"
        rows="3"
        @value-changed="${(e: CustomEvent) => (this._formData.description = e.detail.value)}"
      ></hm-form-textarea>

      <hm-form-select
        label="Type"
        .value="${this._formData.type || 'mandatory'}"
        .options="${typeOptions}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.type = e.detail.value)}"
      ></hm-form-select>

      <hm-form-select
        label="Assigné à"
        .value="${this._formData.assigned_to || []}"
        .options="${childrenOptions}"
        .multiple="${true}"
        helper="Sélectionnez un ou plusieurs enfants"
        @value-changed="${(e: CustomEvent) => (this._formData.assigned_to = e.detail.value)}"
      ></hm-form-select>

      <hm-form-select
        label="Fréquence"
        .value="${this._formData.schedule_type || 'daily'}"
        .options="${scheduleOptions}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.schedule_type = e.detail.value)}"
      ></hm-form-select>

      <hm-form-select
        label="Catégorie"
        .value="${this._formData.category || 'chores'}"
        .options="${categoryOptions}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.category = e.detail.value)}"
      ></hm-form-select>

      <div class="form-row">
        <hm-form-input
          label="Points (récompense)"
          .value="${String(this._formData.rewards_points || 10)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.rewards_points = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces (récompense)"
          .value="${String(this._formData.rewards_coins || 5)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.rewards_coins = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Expérience"
          .value="${String(this._formData.rewards_experience || 10)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) =>
            (this._formData.rewards_experience = e.detail.value)}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Points (pénalité)"
          .value="${String(this._formData.penalties_points || 5)}"
          type="number"
          min="0"
          required
          helper="Points perdus si la tâche échoue"
          @value-changed="${(e: CustomEvent) => (this._formData.penalties_points = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces (pénalité)"
          .value="${String(this._formData.penalties_coins || 2)}"
          type="number"
          min="0"
          required
          helper="Pièces perdues si la tâche échoue"
          @value-changed="${(e: CustomEvent) => (this._formData.penalties_coins = e.detail.value)}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Difficulté (1-3)"
          .value="${String(this._formData.difficulty || 1)}"
          type="number"
          min="1"
          max="3"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.difficulty = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Durée (minutes)"
          .value="${String(this._formData.estimated_duration || 15)}"
          type="number"
          min="1"
          required
          @value-changed="${(e: CustomEvent) =>
            (this._formData.estimated_duration = e.detail.value)}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Icône"
          .value="${this._formData.icon || '✅'}"
          placeholder="✅"
          @value-changed="${(e: CustomEvent) => (this._formData.icon = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Couleur"
          .value="${this._formData.color || '#03a9f4'}"
          type="text"
          placeholder="#03a9f4"
          @value-changed="${(e: CustomEvent) => (this._formData.color = e.detail.value)}"
        ></hm-form-input>
      </div>
    `;
  }

  private _renderHabitForm() {
    const children = this._store?.getChildren() || [];
    const childrenOptions: SelectOption[] = children.map((c) => ({
      value: c.id,
      label: c.name,
    }));

    const frequencyOptions: SelectOption[] = [
      { value: 'daily', label: 'Quotidien' },
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'monthly', label: 'Mensuel' },
    ];

    const bonusTypeOptions: SelectOption[] = [
      { value: 'progressive', label: 'Progressif' },
      { value: 'fixed', label: 'Fixe' },
    ];

    return html`
      <hm-form-input
        label="Titre"
        .value="${this._formData.title || ''}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.title = e.detail.value)}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description || ''}"
        rows="3"
        @value-changed="${(e: CustomEvent) => (this._formData.description = e.detail.value)}"
      ></hm-form-textarea>

      <hm-form-select
        label="Fréquence"
        .value="${this._formData.frequency || 'daily'}"
        .options="${frequencyOptions}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.frequency = e.detail.value)}"
      ></hm-form-select>

      <hm-form-select
        label="Assigné à"
        .value="${this._formData.assigned_to || []}"
        .options="${childrenOptions}"
        .multiple="${true}"
        helper="Sélectionnez un ou plusieurs enfants"
        @value-changed="${(e: CustomEvent) => (this._formData.assigned_to = e.detail.value)}"
      ></hm-form-select>

      <div class="form-row">
        <hm-form-input
          label="Points"
          .value="${String(this._formData.rewards_points || 5)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.rewards_points = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces"
          .value="${String(this._formData.rewards_coins || 2)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.rewards_coins = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Expérience"
          .value="${String(this._formData.rewards_experience || 5)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) =>
            (this._formData.rewards_experience = e.detail.value)}"
        ></hm-form-input>
      </div>

      <hm-form-checkbox
        label="Activer bonus de série"
        .checked="${this._formData.streak_bonus_enabled ?? true}"
        @checked-changed="${(e: CustomEvent) =>
          (this._formData.streak_bonus_enabled = e.detail.checked)}"
      ></hm-form-checkbox>

      ${this._formData.streak_bonus_enabled
        ? html`
            <div class="form-row">
              <hm-form-select
                label="Type de bonus"
                .value="${this._formData.streak_bonus_type || 'progressive'}"
                .options="${bonusTypeOptions}"
                @value-changed="${(e: CustomEvent) =>
                  (this._formData.streak_bonus_type = e.detail.value)}"
              ></hm-form-select>

              <hm-form-input
                label="Multiplicateur"
                .value="${String(this._formData.streak_bonus_multiplier || 1.1)}"
                type="number"
                min="1"
                step="0.1"
                @value-changed="${(e: CustomEvent) =>
                  (this._formData.streak_bonus_multiplier = e.detail.value)}"
              ></hm-form-input>
            </div>
          `
        : ''}

      <div class="form-row">
        <hm-form-input
          label="Icône"
          .value="${this._formData.icon || '🔄'}"
          placeholder="🔄"
          @value-changed="${(e: CustomEvent) => (this._formData.icon = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Couleur"
          .value="${this._formData.color || '#4caf50'}"
          type="text"
          placeholder="#4caf50"
          @value-changed="${(e: CustomEvent) => (this._formData.color = e.detail.value)}"
        ></hm-form-input>
      </div>
    `;
  }

  private _renderRewardForm() {
    const typeOptions: SelectOption[] = [
      { value: 'screen_time', label: 'Temps d\'écran' },
      { value: 'meal_choice', label: 'Choix de repas' },
      { value: 'activity', label: 'Activité' },
      { value: 'other', label: 'Autre' },
    ];

    return html`
      <hm-form-input
        label="Titre"
        .value="${this._formData.title || ''}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.title = e.detail.value)}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description || ''}"
        rows="3"
        @value-changed="${(e: CustomEvent) => (this._formData.description = e.detail.value)}"
      ></hm-form-textarea>

      <hm-form-select
        label="Type"
        .value="${this._formData.type || 'activity'}"
        .options="${typeOptions}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.type = e.detail.value)}"
      ></hm-form-select>

      <div class="form-row">
        <hm-form-input
          label="Coût (points)"
          .value="${String(this._formData.cost_points || 50)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.cost_points = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Coût (pièces)"
          .value="${String(this._formData.cost_coins || 20)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.cost_coins = e.detail.value)}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Stock (optionnel)"
          .value="${this._formData.stock !== null ? String(this._formData.stock) : ''}"
          type="number"
          min="0"
          placeholder="Illimité"
          helper="Laissez vide pour stock illimité"
          @value-changed="${(e: CustomEvent) =>
            (this._formData.stock = e.detail.value ? Number(e.detail.value) : null)}"
        ></hm-form-input>

        <hm-form-input
          label="Cooldown (jours)"
          .value="${String(this._formData.cooldown_days || 0)}"
          type="number"
          min="0"
          helper="Délai avant réutilisation"
          @value-changed="${(e: CustomEvent) => (this._formData.cooldown_days = e.detail.value)}"
        ></hm-form-input>
      </div>

      <hm-form-checkbox
        label="Requiert validation parentale"
        .checked="${this._formData.requires_parent_approval ?? true}"
        @checked-changed="${(e: CustomEvent) =>
          (this._formData.requires_parent_approval = e.detail.checked)}"
      ></hm-form-checkbox>

      <div class="form-row">
        <hm-form-input
          label="Icône"
          .value="${this._formData.icon || '🎁'}"
          placeholder="🎁"
          @value-changed="${(e: CustomEvent) => (this._formData.icon = e.detail.value)}"
        ></hm-form-input>

        <hm-form-input
          label="Couleur"
          .value="${this._formData.color || '#ff9800'}"
          type="text"
          placeholder="#ff9800"
          @value-changed="${(e: CustomEvent) => (this._formData.color = e.detail.value)}"
        ></hm-form-input>
      </div>
    `;
  }

  private _renderCosmeticForm() {
    const categoryOptions: SelectOption[] = [
      { value: 'clothes', label: 'Vêtements' },
      { value: 'accessory', label: 'Accessoires' },
      { value: 'pet', label: 'Animaux' },
      { value: 'theme', label: 'Thèmes' },
      { value: 'badge', label: 'Badges' },
      { value: 'animation', label: 'Animations' },
    ];

    const rarityOptions: SelectOption[] = [
      { value: 'common', label: 'Commun' },
      { value: 'rare', label: 'Rare' },
      { value: 'epic', label: 'Épique' },
      { value: 'legendary', label: 'Légendaire' },
    ];

    return html`
      <hm-form-input
        label="Nom"
        .value="${this._formData.name || ''}"
        required
        @value-changed="${(e: CustomEvent) => (this._formData.name = e.detail.value)}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description || ''}"
        rows="3"
        @value-changed="${(e: CustomEvent) => (this._formData.description = e.detail.value)}"
      ></hm-form-textarea>

      <div class="form-row">
        <hm-form-select
          label="Catégorie"
          .value="${this._formData.category || 'clothes'}"
          .options="${categoryOptions}"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.category = e.detail.value)}"
        ></hm-form-select>

        <hm-form-input
          label="Sous-catégorie"
          .value="${this._formData.subcategory || ''}"
          placeholder="shirt, hat, dog..."
          helper="Type spécifique dans la catégorie"
          @value-changed="${(e: CustomEvent) => (this._formData.subcategory = e.detail.value)}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-select
          label="Rareté"
          .value="${this._formData.rarity || 'common'}"
          .options="${rarityOptions}"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.rarity = e.detail.value)}"
        ></hm-form-select>

        <hm-form-input
          label="Coût (pièces)"
          .value="${String(this._formData.cost_coins || 10)}"
          type="number"
          min="0"
          required
          @value-changed="${(e: CustomEvent) => (this._formData.cost_coins = e.detail.value)}"
        ></hm-form-input>
      </div>

      <hm-form-input
        label="Image/Emoji de prévisualisation"
        .value="${this._formData.preview_image || ''}"
        placeholder="👕"
        required
        helper="Emoji ou URL d'image"
        @value-changed="${(e: CustomEvent) => (this._formData.preview_image = e.detail.value)}"
      ></hm-form-input>

      <hm-form-input
        label="Niveau minimum requis (optionnel)"
        .value="${this._formData.unlock_min_level ? String(this._formData.unlock_min_level) : ''}"
        type="number"
        min="1"
        placeholder="Aucun prérequis"
        helper="Laissez vide si accessible dès le début"
        @value-changed="${(e: CustomEvent) =>
          (this._formData.unlock_min_level = e.detail.value ? Number(e.detail.value) : null)}"
      ></hm-form-input>

      <hm-form-checkbox
        label="Actif"
        .checked="${this._formData.active ?? true}"
        helper="Désactivez pour retirer temporairement de la boutique"
        @checked-changed="${(e: CustomEvent) => (this._formData.active = e.detail.checked)}"
      ></hm-form-checkbox>
    `;
  }

  // =====================================================
  // Cosmetics Section
  // =====================================================

  private _renderCosmeticsSection() {
    if (!this._store) return html`<div class="loading">Initialisation du store...</div>`;

    const state = this._store.getState();

    if (state.loading) {
      return html`<div class="loading">Chargement des données...</div>`;
    }

    if (state.error) {
      return html`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${state.error}</span>
            <button class="btn btn-text" @click="${() => this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;
    }

    const cosmetics = state.cosmetics;

    return html`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Cosmétiques</h2>
          <button class="btn btn-primary" @click="${() => this._openCosmeticDialog('create')}">
            + Ajouter un cosmétique
          </button>
        </div>

        <p style="margin-bottom: 16px; color: var(--secondary-text-color);">
          Les cosmétiques permettent aux enfants de personnaliser leur avatar avec les pièces qu'ils gagnent.
        </p>

        ${cosmetics.length === 0
          ? html`
              <div class="empty-message">
                <p>Aucun cosmétique disponible</p>
                <p style="font-size: 14px; margin-top: 8px;">
                  Les cosmétiques par défaut seront chargés au démarrage du système.
                </p>
              </div>
            `
          : html`
              <div class="items-list">
                ${cosmetics.map((cosmetic) => this._renderCosmeticCard(cosmetic))}
              </div>
            `}
      </div>
    `;
  }

  private _renderCosmeticCard(cosmetic: CosmeticItem) {
    return html`
      <hm-item-card .icon="${cosmetic.preview_image}" .iconColor="${this._getRarityColor(cosmetic.rarity)}">
        <div>
          <h3 style="margin: 0 0 4px 0;">${cosmetic.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--secondary-text-color);">
            ${cosmetic.description}
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            <span class="badge" style="background: ${this._getRarityColor(cosmetic.rarity)}">
              ${this._formatRarity(cosmetic.rarity)}
            </span>
            <span class="badge">${this._formatCosmeticCategory(cosmetic.category)}</span>
            <span class="badge">🪙 ${cosmetic.cost_coins}</span>
            ${cosmetic.unlock_requirements
              ? html`<span class="badge">🔒 Niveau requis</span>`
              : ''}
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn btn-icon"
            @click="${() => this._openCosmeticDialog('edit', cosmetic)}"
            title="Modifier"
          >
            ✏️
          </button>
        </div>
      </hm-item-card>
    `;
  }

  private _openCosmeticDialog(mode: DialogMode, cosmetic?: CosmeticItem): void {
    this._dialogMode = mode;
    this._selectedItem = cosmetic;
    this._formData = cosmetic
      ? { ...cosmetic }
      : {
          name: '',
          description: '',
          category: CosmeticCategory.CLOTHES,
          subcategory: '',
          rarity: CosmeticRarity.COMMON,
          cost_coins: 10,
          preview_image: '',
          unlock_requirements: null,
          active: true,
        };
    this._showDialog = true;
  }

  private async _saveCosmeticDialog(): Promise<void> {
    if (!this._store) return;

    this._loading = true;
    this._error = '';

    try {
      if (this._dialogMode === 'create') {
        await this._store.createCosmetic({
          name: this._formData.name,
          description: this._formData.description,
          category: this._formData.category,
          subcategory: this._formData.subcategory,
          rarity: this._formData.rarity,
          cost_coins: parseInt(this._formData.cost_coins),
          preview_image: this._formData.preview_image,
          unlock_requirements: this._formData.unlock_min_level
            ? { min_level: parseInt(this._formData.unlock_min_level) }
            : null,
          active: this._formData.active !== false,
        });
      }

      this._showDialog = false;
      this._formData = {};
      this._selectedItem = undefined;
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
    } finally {
      this._loading = false;
    }
  }

  // =====================================================
  // Helper Methods
  // =====================================================

  private _formatCategory(category: TaskCategory): string {
    const labels: Record<TaskCategory, string> = {
      chores: 'Tâches ménagères',
      homework: 'Devoirs',
      personal: 'Personnel',
      other: 'Autre',
    };
    return labels[category] || category;
  }

  private _formatFrequency(frequency: HabitFrequency): string {
    const labels: Record<HabitFrequency, string> = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
    };
    return labels[frequency] || frequency;
  }

  private _formatRewardType(type: RewardType): string {
    const labels: Record<RewardType, string> = {
      screen_time: 'Temps d\'écran',
      meal_choice: 'Choix de repas',
      activity: 'Activité',
      other: 'Autre',
    };
    return labels[type] || type;
  }

  private _formatCosmeticCategory(category: CosmeticCategory): string {
    const labels: Record<CosmeticCategory, string> = {
      clothes: 'Vêtements',
      accessory: 'Accessoires',
      pet: 'Animaux',
      theme: 'Thèmes',
      badge: 'Badges',
      animation: 'Animations',
    };
    return labels[category] || category;
  }

  private _formatRarity(rarity: CosmeticRarity): string {
    const labels: Record<CosmeticRarity, string> = {
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire',
    };
    return labels[rarity] || rarity;
  }

  private _getRarityColor(rarity: CosmeticRarity): string {
    const colors: Record<CosmeticRarity, string> = {
      common: '#9E9E9E',
      rare: '#2196F3',
      epic: '#9C27B0',
      legendary: '#FF9800',
    };
    return colors[rarity] || '#9E9E9E';
  }
}

// Register card for Lovelace UI editor
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TYPE_MANAGER,
  name: 'Habits Manager',
  description: 'Carte de gestion pour configurer les enfants, tâches et récompenses',
});

declare global {
  interface HTMLElementTagNameMap {
    'habits-manager-card': HabitsManagerCard;
  }
}
