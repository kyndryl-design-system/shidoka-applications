import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-head.scss';

/**
 * `kyn-thead` Web Component.
 *
 * Represents a custom table head (`<thead>`) for Shidoka's design system tables.
 * Designed to contain and style table header rows (`<tr>`) and header cells (`<th>`).
 *
 * @slot unnamed - The content slot for adding table header rows (`<kyn-tr>`).
 */
@customElement('kyn-thead')
export class TableHead extends LitElement {
  static override styles = [styles];

  override firstUpdated() {
    this.addEventListener('on-sort-changed', this.handleChildSort as EventListener);
  }

  private handleChildSort(e: CustomEvent) {
    const sortedColumnKey = e.detail.sortKey;

    // Get all kyn-th elements
    const allHeaders = Array.from(this.querySelectorAll('kyn-th'));

    for (const header of allHeaders) {
      if (header.sortKey !== sortedColumnKey) {
        header.resetSort(); // Reset sort state of non-sorted columns
      }
    }
  }

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-thead': TableHead;
  }
}
