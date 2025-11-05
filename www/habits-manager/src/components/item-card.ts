/**
 * Item Card Component
 * Reusable card for displaying items in lists
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('hm-item-card')
export class ItemCard extends LitElement {
  @property({ type: String }) icon = '';
  @property({ type: String }) iconColor = '';
  @property({ type: Boolean }) clickable = false;
  @property({ type: Boolean }) selected = false;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      padding: 16px;
      background: var(--secondary-background-color, #fafafa);
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      transition: all 0.2s ease;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .card.clickable {
      cursor: pointer;
    }

    .card.clickable:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .card.selected {
      border-color: var(--primary-color, #03a9f4);
      background: var(--primary-color-light, rgba(3, 169, 244, 0.1));
    }

    .icon-container {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--card-background-color, white);
      font-size: 20px;
    }

    .content {
      flex: 1;
      min-width: 0;
    }

    .actions {
      flex-shrink: 0;
      display: flex;
      gap: 8px;
    }

    ::slotted([slot='actions']) {
      display: flex;
      gap: 8px;
    }
  `;

  private handleClick(): void {
    if (this.clickable) {
      this.dispatchEvent(
        new CustomEvent('item-click', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <div
        class="card ${this.clickable ? 'clickable' : ''} ${this.selected ? 'selected' : ''}"
        @click="${this.handleClick}"
      >
        ${this.icon
          ? html`
              <div class="icon-container" style="color: ${this.iconColor || 'inherit'}">
                ${this.icon}
              </div>
            `
          : ''}
        <div class="content">
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hm-item-card': ItemCard;
  }
}
