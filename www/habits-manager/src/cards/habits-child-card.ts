/**
 * Habits Child Card
 * Interface for children to view and complete their tasks and habits
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { HabitsManagerStore, createStore } from '../services/store';
import { baseStyles } from '../styles/base-styles';
import { getLevelColor, getStreakColor } from '../styles/theme';
import { CARD_TYPE_CHILD } from '../types/constants';
import type { Child } from '../types/models';
import '../components/item-card';

interface HabitsChildCardConfig extends CardConfig {
  child_id: string;
  title?: string;
}

@customElement('habits-child-card')
export class HabitsChildCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsChildCardConfig;
  @state() private _store?: HabitsManagerStore;
  @state() private _child?: Child | null;
  @state() private _unsubscribe?: () => void;

  static styles = baseStyles;

  public setConfig(config: HabitsChildCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (!config.child_id) {
      throw new Error('child_id is required');
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 4;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass) {
      if (!this._store) {
        this._store = createStore(this.hass);
        this._unsubscribe = this._store.subscribe(() => {
          this._loadChild();
          this.requestUpdate();
        });
      }
      this._loadChild();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    if (this._store) {
      this._store.destroy();
    }
  }

  private _loadChild(): void {
    if (!this._store || !this._config) return;
    this._child = this._store.getChild(this._config.child_id);
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    if (!this._child) {
      return html`
        <ha-card>
          <div class="card">
            <div class="loading">Chargement...</div>
          </div>
        </ha-card>
      `;
    }

    const title = this._config.title || `Bonjour ${this._child.name}!`;
    const taskCounts = this._store?.getTaskCounts(this._child.id) || { pending: 0, waiting: 0 };
    const habitStats = this._store?.getHabitStats(this._child.id) || { count: 0, longest_streak: 0 };

    return html`
      <ha-card>
        <div class="card">
          <!-- Header -->
          <div class="card-header">
            <h1 class="card-title">${title}</h1>
          </div>

          <!-- Stats Grid -->
          ${this._renderStatsGrid()}

          <!-- Level Progress -->
          ${this._renderLevelProgress()}

          <!-- Tasks Section -->
          ${this._renderTasksSection(taskCounts)}

          <!-- Habits Section -->
          ${this._renderHabitsSection(habitStats)}

          <!-- Badges Section -->
          ${this._child.badges.length > 0 ? this._renderBadgesSection() : ''}
        </div>
      </ha-card>
    `;
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
        <h2 class="section-title">Mes Tâches</h2>
        ${taskCounts.pending > 0
          ? html`
              <hm-item-card>
                <div>
                  <p><strong>✨ ${taskCounts.pending} tâche(s) à faire aujourd'hui</strong></p>
                  <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
                    Demande à tes parents de te montrer la liste complète sur leur écran de gestion.
                  </p>
                </div>
              </hm-item-card>
            `
          : html`
              <div class="empty-state">
                <div style="font-size: 48px;">✅</div>
                <p><strong>Aucune tâche en attente</strong></p>
                <p style="font-size: 12px; margin-top: 8px;">Bravo! Tu as tout terminé!</p>
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
