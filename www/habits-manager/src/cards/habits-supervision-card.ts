/**
 * Habits Supervision Card
 * Supervision card for parents to validate tasks and monitor children's progress
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, CardConfig } from '../types/home-assistant';
import { HabitsManagerStore, createStore } from '../services/store';
import { baseStyles } from '../styles/base-styles';
import { CARD_TYPE_SUPERVISION } from '../types/constants';
import type { Child } from '../types/models';

// Import shared components
import '../components/hm-dialog';
import '../components/item-card';
import '../components/form-textarea';
import '../components/form-checkbox';

interface HabitsSupervisionCardConfig extends CardConfig {
  title?: string;
}

@customElement('habits-supervision-card')
export class HabitsSupervisionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HabitsSupervisionCardConfig;
  @state() private _store?: HabitsManagerStore;
  @state() private _children: Child[] = [];
  @state() private _unsubscribe?: () => void;

  // Dialog states
  @state() private _showValidateDialog = false;
  @state() private _showRefuseDialog = false;
  @state() private _showApproveClaimDialog = false;
  @state() private _selectedInstanceId?: string;
  @state() private _selectedClaimId?: string;
  @state() private _validationNote = '';
  @state() private _refuseNote = '';
  @state() private _applyPenalty = false;
  @state() private _loading = false;

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
      if (!this._store) {
        this._store = createStore(this.hass);
        this._unsubscribe = this._store.subscribe(() => {
          this._loadData();
          this.requestUpdate();
        });
        this._loadData();
      }
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

  private _loadData(): void {
    if (!this._store) return;
    this._children = this._store.getChildren();
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
                ${this._renderChildrenOverview()}
                ${this._renderTasksSection()}
                ${this._renderClaimsSection()}
              `}
        </div>
      </ha-card>

      ${this._renderValidateDialog()}
      ${this._renderRefuseDialog()}
      ${this._renderApproveClaimDialog()}
    `;
  }

  /**
   * Render children overview with task counts
   */
  private _renderChildrenOverview() {
    return html`
      <div class="section">
        <h2 class="section-title">Vue d'ensemble des enfants (${this._children.length})</h2>
        <div class="grid grid-2">
          ${this._children.map((child) => this._renderChildCard(child))}
        </div>
      </div>
    `;
  }

  /**
   * Render a single child card with stats
   */
  private _renderChildCard(child: Child) {
    const taskCounts = this._store?.getTaskCounts(child.id) || { pending: 0, waiting: 0 };
    const habitStats = this._store?.getHabitStats(child.id) || { count: 0, longest_streak: 0 };

    return html`
      <hm-item-card
        .icon=${'👤'}
        .iconColor=${'var(--primary-color, #03a9f4)'}
        .clickable=${true}
        @item-click=${() => this._handleChildClick(child.id)}
      >
        <div>
          <h3>${child.name}</h3>
          <p style="margin: 4px 0; font-size: 14px; color: var(--secondary-text-color);">
            Niveau ${child.level} • ${child.points} pts • ${child.coins} 💰
          </p>
          <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${taskCounts.pending > 0
              ? html`<span class="badge badge-primary">${taskCounts.pending} à faire</span>`
              : ''}
            ${taskCounts.waiting > 0
              ? html`<span class="badge badge-warning">${taskCounts.waiting} à valider</span>`
              : ''}
            ${habitStats.longest_streak > 0
              ? html`<span class="badge badge-success">🔥 ${habitStats.longest_streak} jours</span>`
              : ''}
          </div>
        </div>
      </hm-item-card>
    `;
  }

  /**
   * Render tasks awaiting validation section
   */
  private _renderTasksSection() {
    return html`
      <div class="section">
        <h2 class="section-title">Tâches en attente de validation</h2>

        <div style="padding: 16px; background: var(--secondary-background-color, #fafafa); border-radius: 8px; border-left: 4px solid var(--warning-color, #ff9800);">
          <p style="margin: 0; font-size: 14px;">
            <strong>⚠️ Limitation backend:</strong> Le backend ne fournit pas encore la liste des task instances via les sensors.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            Les méthodes <code>validateTask()</code> et <code>refuseTask()</code> sont déjà implémentées et fonctionnelles.
            Pour l'instant, seuls les <strong>counts</strong> sont disponibles et affichés dans la vue d'ensemble ci-dessus.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            <strong>À faire:</strong> Ajouter un service backend pour exposer les task instances avec status "completed_waiting" via un sensor.
          </p>
        </div>

        ${this._renderTaskValidationExample()}
      </div>
    `;
  }

  /**
   * Render example task validation UI (demo)
   */
  private _renderTaskValidationExample() {
    return html`
      <div style="margin-top: 16px;">
        <p style="font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px;">
          <strong>Aperçu UI</strong> (Exemple de ce qui sera affiché une fois les données disponibles):
        </p>

        <hm-item-card .icon=${'✓'} .iconColor=${'var(--success-color)'}>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 15px;">Ranger sa chambre</h4>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
              Par: <strong>Emma</strong> • Complétée le 05/11/2025 à 14:30
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--secondary-text-color);">
              Récompense: +10 pts, +5 💰, +8 XP
            </p>
          </div>
          <div slot="actions" style="display: flex; gap: 8px;">
            <button
              class="button button-success"
              style="padding: 6px 12px; font-size: 13px;"
              @click=${() => this._handleValidateTaskDemo('demo-instance-1')}
            >
              ✓ Valider
            </button>
            <button
              class="button button-danger"
              style="padding: 6px 12px; font-size: 13px;"
              @click=${() => this._handleRefuseTaskDemo('demo-instance-1')}
            >
              ✗ Refuser
            </button>
          </div>
        </hm-item-card>
      </div>
    `;
  }

  /**
   * Render reward claims section
   */
  private _renderClaimsSection() {
    return html`
      <div class="section">
        <h2 class="section-title">Réclamations de récompenses</h2>

        <div style="padding: 16px; background: var(--secondary-background-color, #fafafa); border-radius: 8px; border-left: 4px solid var(--warning-color, #ff9800);">
          <p style="margin: 0; font-size: 14px;">
            <strong>⚠️ Limitation backend:</strong> Le backend ne fournit pas encore la liste des reward claims via les sensors.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            La méthode <code>approveClaim()</code> est déjà implémentée et fonctionnelle.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            <strong>À faire:</strong> Ajouter un service backend pour exposer les reward claims avec status "pending" via un sensor.
          </p>
        </div>

        ${this._renderClaimApprovalExample()}
      </div>
    `;
  }

  /**
   * Render example claim approval UI (demo)
   */
  private _renderClaimApprovalExample() {
    return html`
      <div style="margin-top: 16px;">
        <p style="font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px;">
          <strong>Aperçu UI</strong> (Exemple de ce qui sera affiché une fois les données disponibles):
        </p>

        <hm-item-card .icon=${'🎁'} .iconColor=${'var(--primary-color)'}>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 15px;">30 minutes de jeu vidéo</h4>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
              Réclamée par: <strong>Emma</strong> • Le 05/11/2025 à 15:00
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--secondary-text-color);">
              Coût: 50 pts, 20 💰
            </p>
          </div>
          <div slot="actions" style="display: flex; gap: 8px;">
            <button
              class="button button-success"
              style="padding: 6px 12px; font-size: 13px;"
              @click=${() => this._handleApproveClaimDemo('demo-claim-1')}
            >
              ✓ Approuver
            </button>
            <button
              class="button button-danger"
              style="padding: 6px 12px; font-size: 13px;"
            >
              ✗ Refuser
            </button>
          </div>
        </hm-item-card>
      </div>
    `;
  }

  /**
   * Render validation dialog
   */
  private _renderValidateDialog() {
    return html`
      <hm-dialog
        ?open=${this._showValidateDialog}
        title="Valider la tâche"
        confirmText="Valider"
        cancelText="Annuler"
        ?loading=${this._loading}
        @confirm=${this._handleConfirmValidate}
        @cancel=${this._handleCancelValidate}
      >
        <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--secondary-text-color);">
          Confirmez-vous la validation de cette tâche ? L'enfant recevra les récompenses associées.
        </p>

        <hm-form-textarea
          label="Note (optionnelle)"
          placeholder="Excellent travail ! Très bien rangé."
          .value=${this._validationNote}
          rows="3"
          helper="Ajoutez un message d'encouragement"
          @value-changed=${(e: CustomEvent) => {
            this._validationNote = e.detail.value;
          }}
        ></hm-form-textarea>
      </hm-dialog>
    `;
  }

  /**
   * Render refuse dialog
   */
  private _renderRefuseDialog() {
    return html`
      <hm-dialog
        ?open=${this._showRefuseDialog}
        title="Refuser la tâche"
        confirmText="Refuser"
        cancelText="Annuler"
        ?loading=${this._loading}
        @confirm=${this._handleConfirmRefuse}
        @cancel=${this._handleCancelRefuse}
      >
        <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--error-color, #f44336);">
          ⚠️ Attention: Refuser cette tâche la marquera comme non complétée.
        </p>

        <hm-form-textarea
          label="Raison du refus"
          placeholder="La chambre n'est pas encore bien rangée. Merci de refaire..."
          .value=${this._refuseNote}
          rows="3"
          required
          helper="Expliquez pourquoi la tâche est refusée"
          @value-changed=${(e: CustomEvent) => {
            this._refuseNote = e.detail.value;
          }}
        ></hm-form-textarea>

        <hm-form-checkbox
          label="Appliquer la pénalité"
          .checked=${this._applyPenalty}
          helper="Si activé, l'enfant perdra les points/pièces définis comme pénalité"
          @checked-changed=${(e: CustomEvent) => {
            this._applyPenalty = e.detail.checked;
          }}
        ></hm-form-checkbox>
      </hm-dialog>
    `;
  }

  /**
   * Render approve claim dialog
   */
  private _renderApproveClaimDialog() {
    return html`
      <hm-dialog
        ?open=${this._showApproveClaimDialog}
        title="Approuver la réclamation"
        confirmText="Approuver"
        cancelText="Annuler"
        ?loading=${this._loading}
        @confirm=${this._handleConfirmApproveClaim}
        @cancel=${this._handleCancelApproveClaim}
      >
        <p style="margin: 0; font-size: 14px; color: var(--secondary-text-color);">
          Confirmez-vous l'approbation de cette réclamation de récompense ?
        </p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
          L'enfant pourra utiliser sa récompense une fois approuvée.
        </p>
      </hm-dialog>
    `;
  }

  // ===============================================
  // Event Handlers
  // ===============================================

  private _handleChildClick(childId: string): void {
    console.log('Child clicked:', childId);
    // TODO: Navigate to child detail view or show child details modal
  }

  private _handleValidateTaskDemo(instanceId: string): void {
    this._selectedInstanceId = instanceId;
    this._validationNote = '';
    this._showValidateDialog = true;
  }

  private _handleRefuseTaskDemo(instanceId: string): void {
    this._selectedInstanceId = instanceId;
    this._refuseNote = '';
    this._applyPenalty = false;
    this._showRefuseDialog = true;
  }

  private _handleApproveClaimDemo(claimId: string): void {
    this._selectedClaimId = claimId;
    this._showApproveClaimDialog = true;
  }

  private async _handleConfirmValidate(): Promise<void> {
    if (!this._selectedInstanceId || !this._store) return;

    this._loading = true;
    try {
      await this._store.validateTask(
        this._selectedInstanceId,
        undefined, // validatorId - optional, backend can detect from HA user
        this._validationNote || undefined
      );

      console.log('Task validated successfully:', this._selectedInstanceId);
      this._showValidateDialog = false;
      this._validationNote = '';
      this._selectedInstanceId = undefined;

      // Show success feedback
      alert('✓ Tâche validée avec succès!');
    } catch (error) {
      console.error('Failed to validate task:', error);
      alert('❌ Erreur lors de la validation de la tâche');
    } finally {
      this._loading = false;
    }
  }

  private _handleCancelValidate(): void {
    this._showValidateDialog = false;
    this._validationNote = '';
    this._selectedInstanceId = undefined;
  }

  private async _handleConfirmRefuse(): Promise<void> {
    if (!this._selectedInstanceId || !this._store) return;

    if (!this._refuseNote.trim()) {
      alert('⚠️ Veuillez fournir une raison pour le refus');
      return;
    }

    this._loading = true;
    try {
      await this._store.refuseTask(
        this._selectedInstanceId,
        undefined, // validatorId - optional
        this._applyPenalty,
        this._refuseNote
      );

      console.log('Task refused successfully:', this._selectedInstanceId);
      this._showRefuseDialog = false;
      this._refuseNote = '';
      this._applyPenalty = false;
      this._selectedInstanceId = undefined;

      // Show success feedback
      alert('✓ Tâche refusée');
    } catch (error) {
      console.error('Failed to refuse task:', error);
      alert('❌ Erreur lors du refus de la tâche');
    } finally {
      this._loading = false;
    }
  }

  private _handleCancelRefuse(): void {
    this._showRefuseDialog = false;
    this._refuseNote = '';
    this._applyPenalty = false;
    this._selectedInstanceId = undefined;
  }

  private async _handleConfirmApproveClaim(): Promise<void> {
    if (!this._selectedClaimId || !this._store) return;

    this._loading = true;
    try {
      await this._store.approveClaim(
        this._selectedClaimId,
        undefined // approverId - optional
      );

      console.log('Claim approved successfully:', this._selectedClaimId);
      this._showApproveClaimDialog = false;
      this._selectedClaimId = undefined;

      // Show success feedback
      alert('✓ Réclamation approuvée avec succès!');
    } catch (error) {
      console.error('Failed to approve claim:', error);
      alert('❌ Erreur lors de l\'approbation de la réclamation');
    } finally {
      this._loading = false;
    }
  }

  private _handleCancelApproveClaim(): void {
    this._showApproveClaimDialog = false;
    this._selectedClaimId = undefined;
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
