import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-footer.scss';

/**
 * `kyn-tfoot` Web Component.
 *
 * Represents a custom table footer (`<tfoot>`) for Shidoka's design system tables.
 * Designed to contain and style table footer rows (`<tr>`) and footer cells (`<td>`).
 *
 * @slot - The content slot for adding table footer rows.
 */
@customElement('kyn-tfoot')
export class TableFooter extends LitElement {
  static override styles = [styles];

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-tfoot': TableFooter;
  }
}
