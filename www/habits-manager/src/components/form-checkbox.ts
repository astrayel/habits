/**
 * Form Checkbox Component
 * Reusable checkbox input
 */

import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';


export class FormCheckbox extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) helper = '';

  static styles = css`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .checkbox-container {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
    }

    .checkbox-container.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      margin: 2px 8px 0 0;
      cursor: pointer;
      accent-color: var(--primary-color, #03a9f4);
    }

    input[type='checkbox']:disabled {
      cursor: not-allowed;
    }

    .label-text {
      flex: 1;
      font-size: 14px;
      color: var(--primary-text-color, #212121);
      user-select: none;
    }

    .helper-text {
      font-size: 12px;
      margin-top: 4px;
      margin-left: 26px;
      color: var(--secondary-text-color, #727272);
    }
  `;

  private handleChange(e: Event): void {
    const checkbox = e.target as HTMLInputElement;
    this.checked = checkbox.checked;
    this.dispatchEvent(
      new CustomEvent('checked-changed', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div>
        <label class="checkbox-container ${this.disabled ? 'disabled' : ''}">
          <input
            type="checkbox"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            @change="${this.handleChange}"
          />
          <span class="label-text">${this.label}</span>
        </label>
        ${this.helper ? html`<div class="helper-text">${this.helper}</div>` : ''}
      </div>
    `;
  }
}


if (!customElements.get('hm-form-checkbox')) {
  customElements.define('hm-form-checkbox', FormCheckbox);
}
declare global {
  interface HTMLElementTagNameMap {
    'hm-form-checkbox': FormCheckbox;
  }
}
