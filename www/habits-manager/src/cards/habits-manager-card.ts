/**
 * Habits Manager Card
 * Management card for parents/admins to configure children, tasks, habits, and rewards
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { HabitsManagerAPI } from '../services/api-client';
import { baseStyles } from '../styles/base-styles';
import { CARD_TYPE_MANAGER } from '../types/constants';

interface HabitsManagerCardConfig extends CardConfig {
  title?: string;
}

@customElement('habits-manager-card')
export class HabitsManagerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsManagerCardConfig;
  @state() private _api?: HabitsManagerAPI;
  @state() private _unsubscribe?: () => void;

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

    if (changedProps.has('hass') && this.hass) {
      if (!this._api) {
        this._api = new HabitsManagerAPI(this.hass);
        this._subscribeToUpdates();
      }
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
      console.log('Habits Manager Update:', event);
      this.requestUpdate();
    });
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const title = this._config.title || 'Gestionnaire de Tâches';

    return html`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${title}</h1>
          </div>

          <div class="section">
            <h2 class="section-title">Enfants</h2>
            <p>Section de gestion des enfants (à implémenter)</p>
          </div>

          <div class="section">
            <h2 class="section-title">Tâches</h2>
            <p>Section de gestion des tâches (à implémenter)</p>
          </div>

          <div class="section">
            <h2 class="section-title">Habitudes</h2>
            <p>Section de gestion des habitudes (à implémenter)</p>
          </div>

          <div class="section">
            <h2 class="section-title">Récompenses</h2>
            <p>Section de gestion des récompenses (à implémenter)</p>
          </div>
        </div>
      </ha-card>
    `;
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
