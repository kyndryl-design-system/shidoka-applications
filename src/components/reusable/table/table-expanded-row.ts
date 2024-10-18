import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import styles from './table-expanded-row.scss';

/**
 *
 * `kyn-expanded-tr` Web Component.

 * Designed to display additional details for a row in a table.
 * The row is expandable and can be expanded/collapsed by toggling the plus/minus icons.
 *
 * @slot unnamed - The slot for adding content to the expandable details section.
 */
@customElement('kyn-expanded-tr')
export class TableExpandedRow extends LitElement {
  static override styles = [styles];

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'row';

  /**
   * The number of columns that the expanded row should span.
   * Reflects the `colspan` attribute.
   */
  @property({ type: Number, attribute: 'colspan' })
  colSpan = 1;

  /**
   * `true` if the table row should be expanded.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  override render() {
    const { colSpan } = this;
    return html`
      <td></td>
      <td colspan="${colSpan}">
        <div class="child-row-inner-container">
          <slot></slot>
        </div>
      </td>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-expanded-tr': TableExpandedRow;
  }
}
