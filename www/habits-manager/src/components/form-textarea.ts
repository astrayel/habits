/**
 * Form Textarea Component
 * Reusable multiline text input
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('hm-form-textarea')
export class FormTextarea extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) rows = 3;
  @property({ type: Number }) maxlength?: number;
  @property({ type: String }) error = '';
  @property({ type: String }) helper = '';

  static styles = css`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .textarea-container {
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

    textarea {
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, #212121);
      resize: vertical;
      transition: border-color 0.2s;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--disabled-color, #f5f5f5);
      resize: none;
    }

    textarea.error {
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

    .char-count {
      font-size: 12px;
      margin-top: 4px;
      text-align: right;
      color: var(--secondary-text-color, #727272);
    }
  `;

  private handleInput(e: Event): void {
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;
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
      <div class="textarea-container">
        ${this.label
          ? html`<label class="${this.required ? 'required' : ''}">${this.label}</label>`
          : ''}
        <textarea
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          rows="${this.rows}"
          maxlength="${this.maxlength || ''}"
          class="${this.error ? 'error' : ''}"
          @input="${this.handleInput}"
        ></textarea>
        ${this.error
          ? html`<span class="error-text">${this.error}</span>`
          : this.helper
          ? html`<span class="helper-text">${this.helper}</span>`
          : ''}
        ${this.maxlength
          ? html`<span class="char-count">${this.value.length} / ${this.maxlength}</span>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hm-form-textarea': FormTextarea;
  }
}
