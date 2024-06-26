import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-foot.scss';

/**
 * `kyn-tfoot` Web Component.
 *
 * Represents a custom table foot (`<tfoot>`) for Shidoka's design system tables.
 * Designed to contain and style table footer rows (`<tr>`) and footer cells (`<td>`).
 *
 * @slot unnamed - The content slot for adding table foot rows.
 */
@customElement('kyn-tfoot')
export class TableFoot extends LitElement {
  static override styles = [styles];

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-tfoot': TableFoot;
  }
}
