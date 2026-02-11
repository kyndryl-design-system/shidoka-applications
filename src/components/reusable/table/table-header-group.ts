import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-header-group.scss?inline';
import { TABLE_CELL_ALIGN } from './defs';

/**
 * `kyn-th-group` Web Component.
 *
 * Represents a stacked/grouped header that spans multiple columns.
 * Uses `display: contents` so it is invisible to the CSS table layout,
 * allowing its child `kyn-th` elements to participate directly as table-cells.
 * The group label is passed to children, which render it above their content.
 *
 * Usage:
 * ```html
 * <kyn-thead>
 *   <kyn-header-tr>
 *     <kyn-th-group label="Personal Info">
 *       <kyn-th sortable sortKey="firstName">First Name</kyn-th>
 *       <kyn-th sortable sortKey="lastName">Last Name</kyn-th>
 *     </kyn-th-group>
 *     <kyn-th-group label="Employment">
 *       <kyn-th>Job Title</kyn-th>
 *       <kyn-th>Department</kyn-th>
 *     </kyn-th-group>
 *   </kyn-header-tr>
 * </kyn-thead>
 * ```
 *
 * @slot unnamed - Slot for child `kyn-th` elements that belong to this group.
 */
@customElement('kyn-th-group')
export class TableHeaderGroup extends LitElement {
  static override styles = unsafeCSS(styles);

  /** The label/title displayed in the stacked (parent) header row. */
  @property({ type: String })
  accessor label = '';

  /**
   * Specifies the alignment of the group header label.
   * Options: 'left', 'center', 'right'
   */
  @property({ type: String, reflect: true })
  accessor align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.CENTER;

  /**
   * Marks slotted kyn-th children with stacked-child attributes
   * and passes group label and position information.
   * @internal
   */
  private _handleSlotChange = () => {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    if (!slot) return;

    const children = slot
      .assignedElements({ flatten: true })
      .filter((el) => el.tagName?.toLowerCase() === 'kyn-th') as HTMLElement[];

    children.forEach((el, index) => {
      el.setAttribute('stacked-child', '');
      el.setAttribute('data-group-label', this.label || '');
      el.setAttribute('data-group-align', this.align || 'center');

      // Mark first / last child in the group for border styling
      if (index === 0) {
        el.setAttribute('stacked-child-first', '');
      } else {
        el.removeAttribute('stacked-child-first');
      }
      if (index === children.length - 1) {
        el.setAttribute('stacked-child-last', '');
      } else {
        el.removeAttribute('stacked-child-last');
      }
    });
  };

  override updated(changedProps: any) {
    if (changedProps.has('label') || changedProps.has('align')) {
      this._handleSlotChange();
    }
  }

  override render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-th-group': TableHeaderGroup;
  }
}
