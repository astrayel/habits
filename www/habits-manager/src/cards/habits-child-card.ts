/**
 * Habits Child Card
 * Interface for children to view and complete their tasks and habits
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { ChildApiClient } from '../services/child-api-client';
import { baseStyles } from '../styles/base-styles';
import { getLevelColor, getStreakColor } from '../styles/theme';
import { CARD_TYPE_CHILD } from '../types/constants';
import { API_VERSION } from '../services/api-client';
import '../components/item-card';
import '../components/cosmetics-shop';
import '../components/avatar-customizer';

interface HabitsChildCardConfig extends CardConfig {
  child_id: string;
  title?: string;
}

type ViewMode = 'overview' | 'shop' | 'customizer';

const CARD_VERSION = '2025-11-07T19:30:00Z';

@customElement('habits-child-card')
export class HabitsChildCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsChildCardConfig;
  @state() private _api?: ChildApiClient;
  @state() private _child?: any | null;
  @state() private _tasks: any[] = [];
  @state() private _unsubscribe?: () => void;
  @state() private _viewMode: ViewMode = 'overview';
  @state() private _loading = true;

  static styles = [
    baseStyles,
    css`
      .view-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 2px solid var(--divider-color);
      }

      .view-tab {
        padding: 12px 24px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
        margin-bottom: -2px;
      }

      .view-tab:hover {
        color: var(--primary-text-color);
      }

      .view-tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      @media (max-width: 600px) {
        .view-tab {
          padding: 8px 12px;
          font-size: 14px;
        }
      }
    `,
  ];

  public setConfig(config: HabitsChildCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (!config.child_id) {
      throw new Error('child_id is required');
    }
    this._config = config;
    console.log(`%c╔═══════════════════════════════════════════════════════╗`, 'color: #4caf50; font-weight: bold');
    console.log(`%c║  👶 Habits Child Card                                ║`, 'color: #4caf50; font-weight: bold');
    console.log(`%c║  Version: ${CARD_VERSION}                ║`, 'color: #4caf50; font-weight: bold');
    console.log(`%c║  API Version: ${API_VERSION}         ║`, 'color: #4caf50; font-weight: bold');
    console.log(`%c║  Child ID: ${config.child_id.padEnd(39, ' ')}║`, 'color: #4caf50; font-weight: bold');
    console.log(`%c╚═══════════════════════════════════════════════════════╝`, 'color: #4caf50; font-weight: bold');
  }

  public getCardSize(): number {
    return 4;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass && this._config) {
      if (!this._api) {
        console.log('[Child Card] Initializing lightweight API for child:', this._config.child_id);
        this._api = new ChildApiClient(this.hass, this._config.child_id);

        // Subscribe to HA events for real-time updates
        this._api.subscribeToUpdates(() => {
          console.log('[Child Card] Received update, refreshing data');
          this._loadData();
        }).then((unsub) => {
          this._unsubscribe = unsub;
        });

        // Load initial data only once
        this._loadData();
      } else {
        // Update the API's hass reference when hass changes
        this._api.updateHass(this.hass);
      }
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  private _loadData(): void {
    if (!this._api) return;

    console.log('[Child Card] Loading child data from sensors...');
    this._child = this._api.getChild();
    this._tasks = this._api.getTasksWaitingValidation();
    this._loading = false;

    console.log('[Child Card] Data loaded:', {
      child: this._child?.name,
      tasks: this._tasks.length,
    });

    // No need for requestUpdate() - @state() properties trigger renders automatically
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    if (this._loading || !this._api) {
      return html`
        <ha-card>
          <div class="card">
            <div class="loading">Chargement...</div>
          </div>
        </ha-card>
      `;
    }

    if (!this._child) {
      return html`
        <ha-card>
          <div class="card">
            <div class="empty-state">
              <ha-icon icon="mdi:account-child"></ha-icon>
              <p>Enfant non trouvé (ID: ${this._config.child_id})</p>
            </div>
          </div>
        </ha-card>
      `;
    }

    const title = this._config.title || `Bonjour ${this._child.name}!`;

    return html`
      <ha-card>
        <div class="card">
          <!-- Header -->
          <div class="card-header">
            <h1 class="card-title">${title}</h1>
          </div>

          <!-- View Tabs -->
          <div class="view-tabs">
            <button
              class="view-tab ${this._viewMode === 'overview' ? 'active' : ''}"
              @click="${() => this._viewMode = 'overview'}"
            >
              📊 Accueil
            </button>
            <button
              class="view-tab ${this._viewMode === 'shop' ? 'active' : ''}"
              @click="${() => this._viewMode = 'shop'}"
            >
              🛍️ Boutique
            </button>
            <button
              class="view-tab ${this._viewMode === 'customizer' ? 'active' : ''}"
              @click="${() => this._viewMode = 'customizer'}"
            >
              ✨ Mon Avatar
            </button>
          </div>

          <!-- View Content -->
          ${this._renderViewContent()}
        </div>
      </ha-card>
    `;
  }

  private _renderViewContent() {
    switch (this._viewMode) {
      case 'overview':
        return this._renderOverviewView();
      case 'shop':
        return this._renderShopView();
      case 'customizer':
        return this._renderCustomizerView();
      default:
        return html``;
    }
  }

  private _renderOverviewView() {
    const taskCounts = this._api?.getTaskCounts() || { pending: 0, waiting: 0 };
    const habitStats = this._api?.getHabitStats() || { count: 0, longest_streak: 0 };

    return html`
      <!-- Stats Grid -->
      ${this._renderStatsGrid()}

      <!-- Level Progress -->
      ${this._renderLevelProgress()}

      <!-- Tasks Section -->
      ${this._renderTasksSection(taskCounts)}

      <!-- Habits Section -->
      ${this._renderHabitsSection(habitStats)}

      <!-- Badges Section -->
      ${this._child!.badges.length > 0 ? this._renderBadgesSection() : ''}
    `;
  }

  private _renderShopView() {
    // TODO: Implement shop view with lightweight API
    return html`
      <div class="empty-state">
        <p>Boutique cosmétiques - En cours de développement</p>
      </div>
    `;
  }

  private _renderCustomizerView() {
    // TODO: Implement customizer view with lightweight API
    return html`
      <div class="empty-state">
        <p>Personnalisation avatar - En cours de développement</p>
      </div>
    `;
  }

  private async _handlePurchaseCosmetic(e: CustomEvent) {
    const { cosmeticId, childId } = e.detail;

    if (!this._store) return;

    try {
      await this._store.purchaseCosmetic(cosmeticId, childId);
      // Success feedback could be added here
    } catch (error) {
      console.error('Failed to purchase cosmetic:', error);
      // Error feedback could be added here
    }
  }

  private async _handleAvatarUpdated(e: CustomEvent) {
    const { childId, avatar } = e.detail;

    if (!this._store) return;

    try {
      await this._store.updateChild(childId, { avatar });
      // Success feedback could be added here
    } catch (error) {
      console.error('Failed to update avatar:', error);
      // Error feedback could be added here
    }
  }

  private _renderStatsGrid() {
    return html`
      <div class="section">
        <div class="grid grid-2">
          <hm-item-card>
            <div class="text-center">
              <div style="font-size: 40px; color: #FFC107;">⭐</div>
              <h3>${this._child!.points}</h3>
              <p>Points</p>
            </div>
          </hm-item-card>
          <hm-item-card>
            <div class="text-center">
              <div style="font-size: 40px; color: #FF9800;">🪙</div>
              <h3>${this._child!.coins}</h3>
              <p>Pièces</p>
            </div>
          </hm-item-card>
        </div>
      </div>
    `;
  }

  private _renderLevelProgress() {
    const child = this._child!;
    const percent = Math.min(100, (child.experience / child.experience_to_next_level) * 100);
    const color = getLevelColor(child.level);

    return html`
      <div class="section">
        <hm-item-card>
          <div>
            <div class="flex flex-between mb-sm">
              <span><strong>Niveau ${child.level}</strong></span>
              <span>${child.experience} / ${child.experience_to_next_level} XP</span>
            </div>
            <div style="
              width: 100%;
              height: 8px;
              background: var(--divider-color);
              border-radius: 4px;
              overflow: hidden;
            ">
              <div style="
                width: ${percent}%;
                height: 100%;
                background: ${color};
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>
        </hm-item-card>
      </div>
    `;
  }

  private _renderTasksSection(taskCounts: { pending: number; waiting: number }) {
    return html`
      <div class="section">
        <h2 class="section-title">
          Mes Tâches
          ${taskCounts.pending > 0 ? html`<span class="badge badge-primary">${taskCounts.pending} à faire</span>` : ''}
          ${taskCounts.waiting > 0 ? html`<span class="badge badge-warning">${taskCounts.waiting} en attente</span>` : ''}
        </h2>

        ${taskCounts.pending === 0 && taskCounts.waiting === 0
          ? html`
              <div class="empty-state">
                <div style="font-size: 48px;">✅</div>
                <p><strong>Aucune tâche en attente</strong></p>
                <p style="font-size: 12px; margin-top: 8px;">Bravo! Tu as tout terminé!</p>
              </div>
            `
          : html`
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${this._tasks.length > 0
                  ? html`
                      <p style="font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px;">
                        <strong>En attente de validation (${this._tasks.length})</strong>
                      </p>
                      ${this._tasks.map(
                        (task) => html`
                          <hm-item-card .icon=${'⏳'} .iconColor=${'var(--warning-color, #ff9800)'}>
                            <div style="flex: 1;">
                              <h4 style="margin: 0; font-size: 15px;">${task.task_title}</h4>
                              <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--secondary-text-color);">
                                Complétée • En attente de validation par un parent
                              </p>
                              <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--success-color);">
                                +${task.rewards.points} pts, +${task.rewards.coins} 💰, +${task.rewards.experience} XP
                              </p>
                            </div>
                          </hm-item-card>
                        `
                      )}
                    `
                  : ''}
                ${taskCounts.pending > 0
                  ? html`
                      <hm-item-card>
                        <div>
                          <p><strong>✨ ${taskCounts.pending} tâche(s) à compléter</strong></p>
                          <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
                            Complète tes tâches pour gagner des récompenses !
                          </p>
                        </div>
                      </hm-item-card>
                    `
                  : ''}
              </div>
            `}
      </div>
    `;
  }

  private _renderHabitsSection(habitStats: { count: number; longest_streak: number }) {
    const streakColor = getStreakColor(habitStats.longest_streak);

    return html`
      <div class="section">
        <h2 class="section-title">Mes Habitudes</h2>
        ${habitStats.longest_streak > 0
          ? html`
              <hm-item-card>
                <div>
                  <div class="flex flex-center" style="gap: 8px;">
                    <span style="font-size: 24px;">🔥</span>
                    <div>
                      <p><strong>Série record: ${habitStats.longest_streak} jours</strong></p>
                      <p style="font-size: 12px; color: ${streakColor};">Continue comme ça!</p>
                    </div>
                  </div>
                  ${habitStats.count > 0
                    ? html`<p style="font-size: 12px; margin-top: 8px; color: var(--secondary-text-color);">
                        ${habitStats.count} habitude(s) en cours
                      </p>`
                    : ''}
                  <p style="font-size: 12px; margin-top: 8px; color: var(--secondary-text-color);">
                    Demande à tes parents de valider tes habitudes sur leur écran.
                  </p>
                </div>
              </hm-item-card>
            `
          : html`
              <hm-item-card>
                <div>
                  <p><strong>Commence tes habitudes pour construire une série!</strong></p>
                  <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
                    Demande à tes parents de t'aider à démarrer.
                  </p>
                </div>
              </hm-item-card>
            `}
      </div>
    `;
  }

  private _renderBadgesSection() {
    return html`
      <div class="section">
        <h2 class="section-title">Mes Badges (${this._child!.badges.length})</h2>
        <div class="grid grid-3">
          ${this._child!.badges.map(
            (badge) => html`
              <hm-item-card>
                <div class="text-center">
                  <div style="font-size: 32px;">🏆</div>
                  <p style="font-size: 12px; margin-top: 4px;">${badge}</p>
                </div>
              </hm-item-card>
            `
          )}
        </div>
      </div>
    `;
  }
}

// Register card for Lovelace UI editor
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TYPE_CHILD,
  name: 'Habits Child',
  description: 'Carte pour enfants pour voir leurs tâches et progresser',
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    'habits-child-card': HabitsChildCard;
  }
}
