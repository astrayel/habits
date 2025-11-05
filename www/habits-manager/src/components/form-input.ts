/**
 * Form Input Component
 * Reusable text/number input field
 */

import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class FormInput extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) type: 'text' | 'number' | 'email' | 'password' = 'text';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) step?: number;
  @property({ type: String }) error = '';
  @property({ type: String }) helper = '';

  static styles = css`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .input-container {
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      color: var(--primary-text-color, #212121);
    }

    label.required::after {
      content: ' *';
      color: var(--error-color, #f44336);
    }

    input {
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, #212121);
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--disabled-color, #f5f5f5);
    }

    input.error {
      border-color: var(--error-color, #f44336);
    }

    .helper-text {
      font-size: 12px;
      margin-top: 4px;
      color: var(--secondary-text-color, #727272);
    }

    .error-text {
      font-size: 12px;
      margin-top: 4px;
      color: var(--error-color, #f44336);
    }
  `;

  private handleInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="input-container">
        ${this.label
          ? html`<label class="${this.required ? 'required' : ''}">${this.label}</label>`
          : ''}
        <input
          type="${this.type}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          class="${this.error ? 'error' : ''}"
          @input="${this.handleInput}"
        />
        ${this.error
          ? html`<span class="error-text">${this.error}</span>`
          : this.helper
          ? html`<span class="helper-text">${this.helper}</span>`
          : ''}
      </div>
    `;
  }
}

if (!customElements.get('hm-form-input')) {
  customElements.define('hm-form-input', FormInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'hm-form-input': FormInput;
  }
}
