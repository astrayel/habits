/**
 * Kids Tasks Legacy Cards - Entry Point
 *
 * This file exports the three main card components from the kids-tasks-ha-card project.
 * These cards will be adapted to work with the habits-manager backend.
 */

import { KidsTasksCard } from './card.js';
import { KidsTasksChildCard } from './child-card.js';
import { KidsTasksManagerCard } from './manager-card.js';

// Also export adapters for use by the cards
export { DataAdapter } from './data-adapter.js';
export { ServiceAdapter } from './service-adapter.js';

// Export the three main card components
export {
  KidsTasksCard,
  KidsTasksChildCard,
  KidsTasksManagerCard,
};

// Register the cards with Home Assistant custom elements
// These can be used in Lovelace as:
// - type: 'custom:kids-tasks-card'
// - type: 'custom:kids-tasks-child-card'
// - type: 'custom:kids-tasks-manager-card'

if (!customElements.get('kids-tasks-card')) {
  customElements.define('kids-tasks-card', KidsTasksCard);
}

if (!customElements.get('kids-tasks-child-card')) {
  customElements.define('kids-tasks-child-card', KidsTasksChildCard);
}

if (!customElements.get('kids-tasks-manager-card')) {
  customElements.define('kids-tasks-manager-card', KidsTasksManagerCard);
}
