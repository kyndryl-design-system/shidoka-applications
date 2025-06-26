import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-footer.scss?inline';

/**
 * Table Footer
 *
 * Intended to contain Legend and Pagination.
 *
 * @slot unnamed - Default slot.
 */
@customElement('kyn-table-footer')
export class TableFooter extends LitElement {
  static override styles = unsafeCSS(styles);

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-footer': TableFooter;
  }
}
