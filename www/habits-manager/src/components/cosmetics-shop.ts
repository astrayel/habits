/**
 * Cosmetics Shop Component
 * Displays available cosmetic items for purchase with coins
 */

import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CosmeticItem, CosmeticCategory, CosmeticRarity, Child } from '../types/models';
import { RARITY_COLORS } from '../styles/theme';
import './item-card';
import './hm-dialog';


export class CosmeticsShop extends LitElement {
  @property({ type: Object }) child!: Child;
  @property({ type: Array }) availableCosmetics: CosmeticItem[] = [];
  @property({ type: Array }) allCosmetics: CosmeticItem[] = [];
  @state() private selectedCategory: CosmeticCategory | 'all' = 'all';
  @state() private selectedCosmetic?: CosmeticItem;
  @state() private showPurchaseDialog = false;

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .shop-header {
      margin-bottom: 24px;
    }

    .shop-title {
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 8px 0;
    }

    .coins-display {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .coin-icon {
      font-size: 24px;
    }

    .category-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .category-tab {
      padding: 8px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: var(--card-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      white-space: nowrap;
    }

    .category-tab:hover {
      background: var(--secondary-background-color);
    }

    .category-tab.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .cosmetics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .cosmetic-card {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 16px;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .cosmetic-card.available {
      border-color: var(--divider-color);
      cursor: pointer;
    }

    .cosmetic-card.available:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .cosmetic-card.owned {
      opacity: 0.7;
      border-color: var(--success-color);
      background: var(--success-color-light, rgba(76, 175, 80, 0.05));
    }

    .cosmetic-card.locked {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rarity-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: white;
    }

    .status-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: white;
      border: 1px solid var(--divider-color);
    }

    .preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      font-size: 64px;
      margin-bottom: 12px;
    }

    .cosmetic-name {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 4px 0;
    }

    .cosmetic-description {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 12px 0;
      min-height: 32px;
    }

    .cosmetic-price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }

    .price-amount {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 16px;
      font-weight: 600;
    }

    .unlock-requirements {
      font-size: 12px;
      color: var(--warning-color);
      margin-top: 8px;
      padding: 8px;
      background: var(--warning-color-light, rgba(255, 152, 0, 0.1));
      border-radius: 4px;
    }

    .empty-message {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    .purchase-dialog-content {
      padding: 16px;
    }

    .purchase-preview {
      text-align: center;
      padding: 24px;
    }

    .purchase-preview-icon {
      font-size: 80px;
      margin-bottom: 16px;
    }

    .purchase-info {
      margin: 16px 0;
    }

    .purchase-info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .purchase-actions {
      display: flex;
      gap: 8px;
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

  private getCategoryIcon(category: CosmeticCategory | 'all'): string {
    const icons = {
      all: '🛍️',
      clothes: '👕',
      accessory: '🎩',
      pet: '🐕',
      theme: '🎨',
      badge: '🏆',
      animation: '✨',
    };
    return icons[category] || '🛍️';
  }

  private getCategoryLabel(category: CosmeticCategory | 'all'): string {
    const labels = {
      all: 'Tout',
      clothes: 'Vêtements',
      accessory: 'Accessoires',
      pet: 'Animaux',
      theme: 'Thèmes',
      badge: 'Badges',
      animation: 'Animations',
    };
    return labels[category] || 'Tout';
  }

  private getRarityLabel(rarity: CosmeticRarity): string {
    const labels = {
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire',
    };
    return labels[rarity];
  }

  private getItemStatus(cosmetic: CosmeticItem): 'owned' | 'locked' | 'available' {
    // Check if owned
    if (this.child.owned_cosmetics.includes(cosmetic.id)) {
      return 'owned';
    }

    // Check unlock requirements
    if (cosmetic.unlock_requirements) {
      const reqs = cosmetic.unlock_requirements;

      if (reqs.level && this.child.level < reqs.level) {
        return 'locked';
      }

      if (reqs.badge && !this.child.badges.includes(reqs.badge)) {
        return 'locked';
      }
    }

    return 'available';
  }

  private getUnlockRequirementsText(cosmetic: CosmeticItem): string {
    if (!cosmetic.unlock_requirements) return '';

    const reqs = cosmetic.unlock_requirements;
    const parts: string[] = [];

    if (reqs.level) {
      parts.push(`Niveau ${reqs.level} requis`);
    }

    if (reqs.badge) {
      parts.push(`Badge requis`);
    }

    return parts.join(' • ');
  }

  private getFilteredCosmetics(): CosmeticItem[] {
    let cosmetics = this.allCosmetics;

    if (this.selectedCategory !== 'all') {
      cosmetics = cosmetics.filter(c => c.category === this.selectedCategory);
    }

    // Sort: available first, then by rarity, then by price
    return cosmetics.sort((a, b) => {
      const statusA = this.getItemStatus(a);
      const statusB = this.getItemStatus(b);

      // Owned items at the end
      if (statusA === 'owned' && statusB !== 'owned') return 1;
      if (statusA !== 'owned' && statusB === 'owned') return -1;

      // Then locked items
      if (statusA === 'locked' && statusB !== 'locked') return 1;
      if (statusA !== 'locked' && statusB === 'locked') return -1;

      // Then by rarity
      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
      const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
      if (rarityDiff !== 0) return rarityDiff;

      // Finally by price
      return a.cost_coins - b.cost_coins;
    });
  }

  private handleCosmeticClick(cosmetic: CosmeticItem): void {
    const status = this.getItemStatus(cosmetic);
    if (status === 'available') {
      this.selectedCosmetic = cosmetic;
      this.showPurchaseDialog = true;
    }
  }

  private async handlePurchase(): Promise<void> {
    if (!this.selectedCosmetic) return;

    const event = new CustomEvent('purchase-cosmetic', {
      detail: {
        cosmeticId: this.selectedCosmetic.id,
        childId: this.child.id,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
    this.showPurchaseDialog = false;
    this.selectedCosmetic = undefined;
  }

  private handleCancelPurchase(): void {
    this.showPurchaseDialog = false;
    this.selectedCosmetic = undefined;
  }

  render() {
    const filteredCosmetics = this.getFilteredCosmetics();

    return html`
      <div class="shop-header">
        <h2 class="shop-title">Boutique de Cosmétiques</h2>
        <div class="coins-display">
          <span class="coin-icon">🪙</span>
          <span>${this.child.coins} pièces</span>
        </div>
      </div>

      <div class="category-tabs">
        <div
          class="category-tab ${this.selectedCategory === 'all' ? 'selected' : ''}"
          @click="${() => this.selectedCategory = 'all'}"
        >
          ${this.getCategoryIcon('all')} ${this.getCategoryLabel('all')}
        </div>
        ${Object.values(CosmeticCategory).map(category => html`
          <div
            class="category-tab ${this.selectedCategory === category ? 'selected' : ''}"
            @click="${() => this.selectedCategory = category}"
          >
            ${this.getCategoryIcon(category)} ${this.getCategoryLabel(category)}
          </div>
        `)}
      </div>

      ${filteredCosmetics.length === 0 ? html`
        <div class="empty-message">
          <p>Aucun cosmétique disponible dans cette catégorie</p>
        </div>
      ` : html`
        <div class="cosmetics-grid">
          ${filteredCosmetics.map(cosmetic => {
            const status = this.getItemStatus(cosmetic);
            const unlockReqs = this.getUnlockRequirementsText(cosmetic);

            return html`
              <div
                class="cosmetic-card ${status}"
                @click="${() => this.handleCosmeticClick(cosmetic)}"
              >
                <div
                  class="rarity-badge"
                  style="background-color: ${RARITY_COLORS[cosmetic.rarity]}"
                >
                  ${this.getRarityLabel(cosmetic.rarity)}
                </div>

                ${status === 'owned' ? html`
                  <div class="status-badge">✅ Possédé</div>
                ` : status === 'locked' ? html`
                  <div class="status-badge">🔒 Verrouillé</div>
                ` : ''}

                <div class="preview-container">
                  ${cosmetic.preview_image}
                </div>

                <h3 class="cosmetic-name">${cosmetic.name}</h3>
                <p class="cosmetic-description">${cosmetic.description}</p>

                ${unlockReqs ? html`
                  <div class="unlock-requirements">
                    🔒 ${unlockReqs}
                  </div>
                ` : ''}

                <div class="cosmetic-price">
                  <span class="price-amount">
                    <span>🪙</span>
                    <span>${cosmetic.cost_coins}</span>
                  </span>
                  ${status === 'available' ? html`
                    <span style="color: var(--primary-color)">🛒 Acheter</span>
                  ` : ''}
                </div>
              </div>
            `;
          })}
        </div>
      `}

      ${this.showPurchaseDialog && this.selectedCosmetic ? html`
        <hm-dialog
          .open="${this.showPurchaseDialog}"
          @dialog-closed="${this.handleCancelPurchase}"
        >
          <div slot="header">Confirmer l'achat</div>
          <div slot="content" class="purchase-dialog-content">
            <div class="purchase-preview">
              <div class="purchase-preview-icon">${this.selectedCosmetic.preview_image}</div>
              <h3>${this.selectedCosmetic.name}</h3>
              <p>${this.selectedCosmetic.description}</p>
            </div>

            <div class="purchase-info">
              <div class="purchase-info-row">
                <span>Prix:</span>
                <span><strong>🪙 ${this.selectedCosmetic.cost_coins}</strong></span>
              </div>
              <div class="purchase-info-row">
                <span>Tes pièces:</span>
                <span>🪙 ${this.child.coins}</span>
              </div>
              <div class="purchase-info-row">
                <span>Après achat:</span>
                <span>🪙 ${this.child.coins - this.selectedCosmetic.cost_coins}</span>
              </div>
            </div>

            ${this.child.coins < this.selectedCosmetic.cost_coins ? html`
              <div style="color: var(--error-color); text-align: center; margin-top: 16px;">
                ⚠️ Pas assez de pièces!
              </div>
            ` : ''}
          </div>
          <div slot="actions" class="purchase-actions">
            <button class="btn btn-secondary" @click="${this.handleCancelPurchase}">
              Annuler
            </button>
            <button
              class="btn btn-primary"
              @click="${this.handlePurchase}"
              ?disabled="${this.child.coins < this.selectedCosmetic.cost_coins}"
            >
              Acheter
            </button>
          </div>
        </hm-dialog>
      ` : ''}
    `;
  }
}


if (!customElements.get('hm-dialog')) {
  customElements.define('hm-cosmetics-shop', CosmeticsShop);
}
declare global {
  interface HTMLElementTagNameMap {
    'hm-cosmetics-shop': CosmeticsShop;
  }
}
