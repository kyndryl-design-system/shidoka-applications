import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-foot.scss?inline';

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
  static override styles = unsafeCSS(styles);

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor role = 'rowgroup';

  @property({ type: Boolean, reflect: true })
  accessor stickyFooter = false;

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
