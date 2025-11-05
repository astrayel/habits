/**
 * Habits Child Card
 * Interface for children to view and complete their tasks and habits
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { HabitsManagerAPI } from '../services/api-client';
import { baseStyles } from '../styles/base-styles';
import { CARD_TYPE_CHILD } from '../types/constants';
import type { Child } from '../types/models';

interface HabitsChildCardConfig extends CardConfig {
  child_id: string;
  title?: string;
}

@customElement('habits-child-card')
export class HabitsChildCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsChildCardConfig;
  @state() private _api?: HabitsManagerAPI;
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
      if (!this._api) {
        this._api = new HabitsManagerAPI(this.hass);
        this._subscribeToUpdates();
      }
      this._loadChild();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  private async _subscribeToUpdates(): Promise<void> {
    if (!this._api) return;

    this._unsubscribe = await this._api.subscribeToUpdates((event) => {
      console.log('Habits Child Update:', event);
      // Reload child data if this event is for our child
      if (event.child_id === this._config?.child_id) {
        this._loadChild();
      }
      this.requestUpdate();
    });
  }

  private _loadChild(): void {
    if (!this._api || !this._config) return;
    this._child = this._api.getChildData(this._config.child_id);
  }

  private _renderProgressBar(current: number, max: number): any {
    const percent = Math.min(100, (current / max) * 100);

    return html`
      <div style="
        width: 100%;
        height: 8px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 4px;
        overflow: hidden;
        margin-top: 4px;
      ">
        <div style="
          width: ${percent}%;
          height: 100%;
          background: var(--primary-color, #03a9f4);
          transition: width 0.3s ease;
        "></div>
      </div>
    `;
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    if (!this._child) {
      return html`
        <ha-card>
          <div class="card">
            <div class="loading">
              <p>Chargement...</p>
            </div>
          </div>
        </ha-card>
      `;
    }

    const title = this._config.title || `Bonjour ${this._child.name}!`;
    const taskCounts = this._api?.getTaskCounts(this._child.id) || { pending: 0, waiting: 0 };
    const habitStats = this._api?.getHabitStats(this._child.id) || { count: 0, longest_streak: 0 };

    return html`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${title}</h1>
          </div>

          <!-- Stats Section -->
          <div class="section">
            <div class="grid grid-2">
              <div class="item-card text-center">
                <ha-icon icon="mdi:star" class="icon-large" style="color: #FFC107;"></ha-icon>
                <h3>${this._child.points}</h3>
                <p>Points</p>
              </div>
              <div class="item-card text-center">
                <ha-icon icon="mdi:coin" class="icon-large" style="color: #FF9800;"></ha-icon>
                <h3>${this._child.coins}</h3>
                <p>Pièces</p>
              </div>
            </div>
          </div>

          <!-- Level Section -->
          <div class="section">
            <div class="item-card">
              <div class="flex flex-between mb-sm">
                <span><strong>Niveau ${this._child.level}</strong></span>
                <span>${this._child.experience} / ${this._child.experience_to_next_level} XP</span>
              </div>
              ${this._renderProgressBar(this._child.experience, this._child.experience_to_next_level)}
            </div>
          </div>

          <!-- Tasks Section -->
          <div class="section">
            <h2 class="section-title">Mes Tâches (${taskCounts.pending})</h2>
            ${taskCounts.pending > 0
              ? html`<p>Liste des tâches à faire (à implémenter)</p>`
              : html`
                  <div class="empty-state">
                    <ha-icon icon="mdi:check-all"></ha-icon>
                    <p>Aucune tâche en attente</p>
                  </div>
                `}
          </div>

          <!-- Habits Section -->
          <div class="section">
            <h2 class="section-title">Mes Habitudes (${habitStats.count})</h2>
            ${habitStats.longest_streak > 0
              ? html`
                  <div class="item-card">
                    <div class="flex flex-center">
                      <ha-icon icon="mdi:fire" style="color: #FF5722;"></ha-icon>
                      <span class="ml-sm">Série la plus longue: ${habitStats.longest_streak} jours</span>
                    </div>
                  </div>
                `
              : html`<p>Commence tes habitudes pour construire une série!</p>`}
          </div>

          <!-- Badges Section -->
          ${this._child.badges.length > 0
            ? html`
                <div class="section">
                  <h2 class="section-title">Mes Badges (${this._child.badges.length})</h2>
                  <p>Liste des badges (à implémenter)</p>
                </div>
              `
            : ''}
        </div>
      </ha-card>
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
