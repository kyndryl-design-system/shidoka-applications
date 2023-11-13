import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-container.scss';

/**
 * `kyn-table-container` Web Component.
 *
 * Provides a container for Shidoka's design system tables. It's designed to encapsulate
 * and apply styles uniformly across the table elements.
 *
 * @slot unnamed - The content slot for adding table and related elements.
 */
@customElement('kyn-table-container')
export class TableContainer extends LitElement {
  static override styles = [styles];

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-container': TableContainer;
  }
}
