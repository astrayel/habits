/**
 * Avatar Customizer Component
 * Allows children to customize their avatar with owned cosmetic items
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Child, CosmeticItem, CosmeticCategory, Avatar } from '../types/models';

@customElement('hm-avatar-customizer')
export class AvatarCustomizer extends LitElement {
  @property({ type: Object }) child!: Child;
  @property({ type: Array }) ownedCosmetics: CosmeticItem[] = [];
  @state() private editingAvatar: Avatar;
  @state() private selectedCategory: CosmeticCategory | null = null;

  constructor() {
    super();
    this.editingAvatar = {
      photo_url: '',
      customization: {
        clothes: null,
        accessory: null,
        pet: null,
        theme: 'default',
      },
    };
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .customizer-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .customizer-container {
        grid-template-columns: 1fr;
      }
    }

    .preview-section {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }

    .preview-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 24px 0;
    }

    .avatar-preview {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto 24px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-base {
      width: 100%;
      height: 100%;
      object-fit: cover;
      font-size: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-layer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      pointer-events: none;
    }

    .avatar-layer.clothes {
      z-index: 1;
    }

    .avatar-layer.accessory {
      z-index: 2;
    }

    .avatar-layer.pet {
      z-index: 3;
      top: auto;
      bottom: 10px;
      left: auto;
      right: 10px;
      transform: none;
      font-size: 40px;
    }

    .current-theme {
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
      margin-top: 16px;
    }

    .selector-section {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
    }

    .selector-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 16px 0;
    }

    .category-buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 8px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: var(--card-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .category-btn:hover {
      background: var(--secondary-background-color);
    }

    .category-btn.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .cosmetics-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
      padding: 8px;
    }

    .cosmetic-option {
      aspect-ratio: 1;
      border: 2px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      position: relative;
    }

    .cosmetic-option:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }

    .cosmetic-option.selected {
      border-color: var(--primary-color);
      background: var(--primary-color-light, rgba(3, 169, 244, 0.1));
    }

    .cosmetic-option.selected::after {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 16px;
      color: var(--primary-color);
      background: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-option {
      aspect-ratio: 1;
      border: 2px dashed var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      gap: 4px;
    }

    .remove-option:hover {
      background: var(--divider-color);
    }

    .remove-label {
      font-size: 10px;
      color: var(--secondary-text-color);
    }

    .no-cosmetics {
      text-align: center;
      padding: 32px;
      color: var(--secondary-text-color);
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-secondary:hover {
      background: var(--divider-color);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    // Initialize editing avatar with current child avatar
    if (this.child) {
      this.editingAvatar = JSON.parse(JSON.stringify(this.child.avatar));
    }
  }

  updated(changedProperties: Map<string, any>): void {
    if (changedProperties.has('child') && this.child) {
      this.editingAvatar = JSON.parse(JSON.stringify(this.child.avatar));
    }
  }

  private getCategoryIcon(category: CosmeticCategory): string {
    const icons = {
      clothes: '👕',
      accessory: '🎩',
      pet: '🐕',
      theme: '🎨',
      badge: '🏆',
      animation: '✨',
    };
    return icons[category] || '';
  }

  private getCategoryLabel(category: CosmeticCategory): string {
    const labels = {
      clothes: 'Vêtements',
      accessory: 'Accessoires',
      pet: 'Animaux',
      theme: 'Thèmes',
      badge: 'Badges',
      animation: 'Animations',
    };
    return labels[category] || '';
  }

  private getCustomizableCategories(): CosmeticCategory[] {
    // Only categories that can be applied to avatar
    return [
      CosmeticCategory.CLOTHES,
      CosmeticCategory.ACCESSORY,
      CosmeticCategory.PET,
      CosmeticCategory.THEME,
    ];
  }

  private getCosmeticsForCategory(category: CosmeticCategory): CosmeticItem[] {
    return this.ownedCosmetics.filter(c => c.category === category);
  }

  private getSelectedCosmeticId(category: CosmeticCategory): string | null {
    const customization = this.editingAvatar.customization;

    switch (category) {
      case CosmeticCategory.CLOTHES:
        return customization.clothes;
      case CosmeticCategory.ACCESSORY:
        return customization.accessory;
      case CosmeticCategory.PET:
        return customization.pet;
      case CosmeticCategory.THEME:
        return customization.theme;
      default:
        return null;
    }
  }

  private selectCosmetic(category: CosmeticCategory, cosmeticId: string): void {
    const customization = { ...this.editingAvatar.customization };

    switch (category) {
      case CosmeticCategory.CLOTHES:
        customization.clothes = cosmeticId;
        break;
      case CosmeticCategory.ACCESSORY:
        customization.accessory = cosmeticId;
        break;
      case CosmeticCategory.PET:
        customization.pet = cosmeticId;
        break;
      case CosmeticCategory.THEME:
        customization.theme = cosmeticId;
        break;
    }

    this.editingAvatar = { ...this.editingAvatar, customization };
    this.requestUpdate();
  }

  private removeCosmetic(category: CosmeticCategory): void {
    const customization = { ...this.editingAvatar.customization };

    switch (category) {
      case CosmeticCategory.CLOTHES:
        customization.clothes = null;
        break;
      case CosmeticCategory.ACCESSORY:
        customization.accessory = null;
        break;
      case CosmeticCategory.PET:
        customization.pet = null;
        break;
      case CosmeticCategory.THEME:
        customization.theme = 'default';
        break;
    }

    this.editingAvatar = { ...this.editingAvatar, customization };
    this.requestUpdate();
  }

  private getCosmeticById(id: string | null): CosmeticItem | null {
    if (!id) return null;
    return this.ownedCosmetics.find(c => c.id === id) || null;
  }

  private handleSave(): void {
    const event = new CustomEvent('avatar-updated', {
      detail: {
        childId: this.child.id,
        avatar: this.editingAvatar,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  private handleReset(): void {
    this.editingAvatar = JSON.parse(JSON.stringify(this.child.avatar));
    this.requestUpdate();
  }

  private renderAvatarPreview() {
    const { customization } = this.editingAvatar;
    const clothesCosmetic = this.getCosmeticById(customization.clothes);
    const accessoryCosmetic = this.getCosmeticById(customization.accessory);
    const petCosmetic = this.getCosmeticById(customization.pet);
    const themeCosmetic = this.getCosmeticById(customization.theme);

    return html`
      <div class="avatar-preview">
        <!-- Base avatar (person photo or default) -->
        <div class="avatar-base">
          ${this.child.avatar.photo_url ? html`
            <img src="${this.child.avatar.photo_url}" alt="Avatar" />
          ` : html`
            <span>👤</span>
          `}
        </div>

        <!-- Cosmetic layers -->
        ${clothesCosmetic ? html`
          <div class="avatar-layer clothes">${clothesCosmetic.preview_image}</div>
        ` : ''}

        ${accessoryCosmetic ? html`
          <div class="avatar-layer accessory">${accessoryCosmetic.preview_image}</div>
        ` : ''}

        ${petCosmetic ? html`
          <div class="avatar-layer pet">${petCosmetic.preview_image}</div>
        ` : ''}
      </div>

      ${themeCosmetic ? html`
        <div class="current-theme">
          <strong>Thème:</strong> ${themeCosmetic.preview_image} ${themeCosmetic.name}
        </div>
      ` : ''}
    `;
  }

  render() {
    const categories = this.getCustomizableCategories();

    return html`
      <div class="customizer-container">
        <!-- Preview Section -->
        <div class="preview-section">
          <h3 class="preview-title">Aperçu de ton avatar</h3>
          ${this.renderAvatarPreview()}
          <div class="actions">
            <button class="btn btn-secondary" @click="${this.handleReset}">
              Réinitialiser
            </button>
            <button class="btn btn-primary" @click="${this.handleSave}">
              Sauvegarder
            </button>
          </div>
        </div>

        <!-- Selector Section -->
        <div class="selector-section">
          <h3 class="selector-title">Personnalise ton avatar</h3>

          <div class="category-buttons">
            ${categories.map(category => html`
              <button
                class="category-btn ${this.selectedCategory === category ? 'selected' : ''}"
                @click="${() => this.selectedCategory = category}"
              >
                ${this.getCategoryIcon(category)} ${this.getCategoryLabel(category)}
              </button>
            `)}
          </div>

          ${this.selectedCategory ? html`
            ${this.getCosmeticsForCategory(this.selectedCategory).length === 0 ? html`
              <div class="no-cosmetics">
                <p>Tu ne possèdes aucun cosmétique dans cette catégorie</p>
                <p style="margin-top: 8px; font-size: 14px;">
                  Va dans la boutique pour en acheter! 🛍️
                </p>
              </div>
            ` : html`
              <div class="cosmetics-list">
                <!-- Remove option -->
                <div class="remove-option" @click="${() => this.removeCosmetic(this.selectedCategory!)}">
                  <span>🗑️</span>
                  <span class="remove-label">Retirer</span>
                </div>

                <!-- Cosmetic options -->
                ${this.getCosmeticsForCategory(this.selectedCategory).map(cosmetic => {
                  const isSelected = this.getSelectedCosmeticId(this.selectedCategory!) === cosmetic.id;
                  return html`
                    <div
                      class="cosmetic-option ${isSelected ? 'selected' : ''}"
                      @click="${() => this.selectCosmetic(this.selectedCategory!, cosmetic.id)}"
                      title="${cosmetic.name}"
                    >
                      ${cosmetic.preview_image}
                    </div>
                  `;
                })}
              </div>
            `}
          ` : html`
            <div class="no-cosmetics">
              <p>Sélectionne une catégorie pour commencer</p>
            </div>
          `}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hm-avatar-customizer': AvatarCustomizer;
  }
}
