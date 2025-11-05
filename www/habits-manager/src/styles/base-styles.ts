/**
 * Base styles for all Habits Manager cards
 * Uses Lit's css tagged template literal
 */

import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  /* Card container */
  .card {
    padding: 16px;
    background: var(--ha-card-background, var(--card-background-color, white));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
  }

  /* Card header */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .card-title {
    font-size: 24px;
    font-weight: 500;
    color: var(--primary-text-color, #212121);
    margin: 0;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 500;
    color: var(--primary-text-color, #212121);
  }

  h1 { font-size: 24px; }
  h2 { font-size: 20px; }
  h3 { font-size: 18px; }
  h4 { font-size: 16px; }
  h5 { font-size: 14px; }
  h6 { font-size: 12px; }

  p {
    margin: 0;
    color: var(--secondary-text-color, #727272);
  }

  /* Buttons */
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, white);
  }

  .button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .button:active {
    transform: translateY(0);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-secondary {
    background: var(--secondary-color, #e0e0e0);
    color: var(--primary-text-color, #212121);
  }

  .button-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .button-danger {
    background: var(--error-color, #f44336);
    color: white;
  }

  .button-icon {
    padding: 8px;
    border-radius: 50%;
  }

  /* Icons */
  ha-icon {
    --mdc-icon-size: 24px;
  }

  .icon-small {
    --mdc-icon-size: 18px;
  }

  .icon-large {
    --mdc-icon-size: 32px;
  }

  /* Cards and containers */
  .section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color, #212121);
  }

  .item-card {
    padding: 12px;
    margin-bottom: 8px;
    background: var(--secondary-background-color, #fafafa);
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    transition: all 0.2s ease;
  }

  .item-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: var(--label-badge-background-color, #e0e0e0);
    color: var(--label-badge-text-color, #212121);
  }

  .badge-primary {
    background: var(--primary-color, #03a9f4);
    color: white;
  }

  .badge-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .badge-warning {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .badge-danger {
    background: var(--error-color, #f44336);
    color: white;
  }

  /* Lists */
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .list-item:last-child {
    border-bottom: none;
  }

  /* Grid layouts */
  .grid {
    display: grid;
    gap: 12px;
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    .grid-3,
    .grid-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .grid-2,
    .grid-3,
    .grid-4 {
      grid-template-columns: 1fr;
    }
  }

  /* Flex layouts */
  .flex {
    display: flex;
  }

  .flex-row {
    flex-direction: row;
  }

  .flex-column {
    flex-direction: column;
  }

  .flex-center {
    align-items: center;
    justify-content: center;
  }

  .flex-between {
    justify-content: space-between;
  }

  .flex-gap-sm {
    gap: 8px;
  }

  .flex-gap-md {
    gap: 16px;
  }

  .flex-gap-lg {
    gap: 24px;
  }

  /* Loading state */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: var(--secondary-text-color, #727272);
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color, #727272);
  }

  .empty-state ha-icon {
    --mdc-icon-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .slide-in {
    animation: slideIn 0.3s ease;
  }

  /* Utilities */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mt-sm { margin-top: 8px; }
  .mt-md { margin-top: 16px; }
  .mt-lg { margin-top: 24px; }

  .mb-sm { margin-bottom: 8px; }
  .mb-md { margin-bottom: 16px; }
  .mb-lg { margin-bottom: 24px; }

  .p-sm { padding: 8px; }
  .p-md { padding: 16px; }
  .p-lg { padding: 24px; }

  .hidden {
    display: none !important;
  }
`;
