/**
 * Form Select Component
 * Reusable dropdown select field
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@customElement('hm-form-select')
export class FormSelect extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: Array }) options: SelectOption[] = [];
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) error = '';
  @property({ type: String }) helper = '';
  @property({ type: Boolean }) multiple = false;

  static styles = css`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .select-container {
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

    select {
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, #212121);
      cursor: pointer;
      transition: border-color 0.2s;
    }

    select:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--disabled-color, #f5f5f5);
    }

    select.error {
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

  private handleChange(e: Event): void {
    const select = e.target as HTMLSelectElement;

    if (this.multiple) {
      const selectedOptions = Array.from(select.selectedOptions).map(opt => opt.value);
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: selectedOptions },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.value = select.value;
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <div class="select-container">
        ${this.label
          ? html`<label class="${this.required ? 'required' : ''}">${this.label}</label>`
          : ''}
        <select
          .value="${this.value}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          ?multiple="${this.multiple}"
          class="${this.error ? 'error' : ''}"
          @change="${this.handleChange}"
        >
          ${!this.required && !this.multiple
            ? html`<option value="">-- Sélectionner --</option>`
            : ''}
          ${this.options.map(
            (option) => html`
              <option value="${option.value}" ?disabled="${option.disabled}">
                ${option.label}
              </option>
            `
          )}
        </select>
        ${this.error
          ? html`<span class="error-text">${this.error}</span>`
          : this.helper
          ? html`<span class="helper-text">${this.helper}</span>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hm-form-select': FormSelect;
  }
}
