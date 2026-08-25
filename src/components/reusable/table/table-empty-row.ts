import { LitElement, html, unsafeCSS } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import styles from './table-empty-row.scss?inline';

/**
 *
 * `kyn-empty-tr` Web Component.

 * Designed to display an empty state row in a table.
 *
 * @slot unnamed - The slot for adding content to the empty section.
 */
@customElement('kyn-empty-tr')
export class TableEmptyRow extends LitElement {
  static override styles = unsafeCSS(styles);

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor role = 'row';

  /**
   * The number of columns that the expanded row should span.
   * Reflects the `colspan` attribute.
   */
  @property({ type: Number, attribute: 'colspan' })
  accessor colSpan = 1;

  override render() {
    const { colSpan } = this;
    return html`
      <td colspan="${colSpan}">
        <slot></slot>
      </td>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-empty-tr': TableEmptyRow;
  }
}
