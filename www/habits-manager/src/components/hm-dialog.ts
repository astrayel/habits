/**
 * Dialog/Modal Component
 * Reusable modal dialog
 */

import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class HMDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = '';
  @property({ type: Boolean }) hideActions = false;
  @property({ type: String }) confirmText = 'Confirmer';
  @property({ type: String }) cancelText = 'Annuler';
  @property({ type: Boolean }) hideCancel = false;
  @property({ type: Boolean }) loading = false;

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dialog {
      background: var(--card-background-color, white);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease;
    }

    .dialog-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
      color: var(--primary-text-color, #212121);
    }

    .close-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      color: var(--secondary-text-color, #727272);
      transition: background 0.2s;
    }

    .close-button:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .dialog-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    button {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .cancel-button {
      background: var(--secondary-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }

    .cancel-button:hover:not(:disabled) {
      background: var(--divider-color, #d0d0d0);
    }

    .confirm-button {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .confirm-button:hover:not(:disabled) {
      opacity: 0.9;
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  private handleOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  private handleCancel(): void {
    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
    );
    this.close();
  }

  private handleConfirm(): void {
    this.dispatchEvent(
      new CustomEvent('confirm', {
        bubbles: true,
        composed: true,
      })
    );
  }

  public close(): void {
    this.open = false;
  }

  render() {
    if (!this.open) {
      return html``;
    }

    return html`
      <div class="overlay" @click="${this.handleOverlayClick}">
        <div class="dialog">
          <div class="dialog-header">
            <h2 class="dialog-title">${this.title}</h2>
            <button class="close-button" @click="${this.close}" ?disabled="${this.loading}">
              ✕
            </button>
          </div>

          <div class="dialog-content">
            <slot></slot>
          </div>

          ${!this.hideActions
            ? html`
                <div class="dialog-actions">
                  ${!this.hideCancel
                    ? html`
                        <button
                          class="cancel-button"
                          @click="${this.handleCancel}"
                          ?disabled="${this.loading}"
                        >
                          ${this.cancelText}
                        </button>
                      `
                    : ''}
                  <button
                    class="confirm-button"
                    @click="${this.handleConfirm}"
                    ?disabled="${this.loading}"
                  >
                    ${this.loading
                      ? html`<span class="loading-spinner"></span>`
                      : ''}${this.confirmText}
                  </button>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

// Définir l'élément seulement s'il n'existe pas déjà
if (!customElements.get('hm-dialog')) {
  customElements.define('hm-dialog', HMDialog);
}

declare global {
  interface HTMLElementTagNameMap {
    'hm-dialog': HMDialog;
  }
}
