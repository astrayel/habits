/**
 * Habits Supervision Card
 * Supervision card for parents to validate tasks and monitor children's progress
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { HabitsManagerAPI } from '../services/api-client';
import { baseStyles } from '../styles/base-styles';
import { CARD_TYPE_SUPERVISION } from '../types/constants';
import type { Child } from '../types/models';

interface HabitsSupervisionCardConfig extends CardConfig {
  title?: string;
}

@customElement('habits-supervision-card')
export class HabitsSupervisionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsSupervisionCardConfig;
  @state() private _api?: HabitsManagerAPI;
  @state() private _children: Child[] = [];
  @state() private _unsubscribe?: () => void;

  static styles = baseStyles;

  public setConfig(config: HabitsSupervisionCardConfig): void {
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

    if (changedProps.has('hass') && this.hass) {
      if (!this._api) {
        this._api = new HabitsManagerAPI(this.hass);
        this._subscribeToUpdates();
      }
      this._loadChildren();
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
      console.log('Habits Supervision Update:', event);
      this._loadChildren();
      this.requestUpdate();
    });
  }

  private _loadChildren(): void {
    if (!this._api) return;
    this._children = this._api.getChildren();
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const title = this._config.title || 'Supervision';

    return html`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${title}</h1>
          </div>

          ${this._children.length === 0
            ? html`
                <div class="empty-state">
                  <ha-icon icon="mdi:account-child"></ha-icon>
                  <p>Aucun enfant configuré</p>
                </div>
              `
            : html`
                <div class="section">
                  <h2 class="section-title">Enfants (${this._children.length})</h2>
                  ${this._children.map(
                    (child) => html`
                      <div class="item-card">
                        <h3>${child.name}</h3>
                        <p>Niveau ${child.level} • ${child.points} points • ${child.coins} pièces</p>
                      </div>
                    `
                  )}
                </div>

                <div class="section">
                  <h2 class="section-title">Tâches en attente de validation</h2>
                  <p>Liste des tâches à valider (à implémenter)</p>
                </div>

                <div class="section">
                  <h2 class="section-title">Réclamations de récompenses</h2>
                  <p>Liste des réclamations à approuver (à implémenter)</p>
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
}

// Register card for Lovelace UI editor
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TYPE_SUPERVISION,
  name: 'Habits Supervision',
  description: 'Carte de supervision pour valider les tâches et suivre les enfants',
});

declare global {
  interface HTMLElementTagNameMap {
    'habits-supervision-card': HabitsSupervisionCard;
  }
}
