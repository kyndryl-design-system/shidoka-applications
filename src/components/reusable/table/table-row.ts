import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import styles from './table-row.scss';
import '../checkbox/checkbox';

/**
 * `kyn-tr` Web Component.
 *
 * Represents a table row (`<tr>`) equivalent for custom tables created with Shidoka's design system.
 * It primarily acts as a container for individual table cells and behaves similarly to a native `<tr>` element.
 *
 * @slot unnamed - The content slot for adding table cells (`kyn-td` or other relevant cells).
 */
@customElement('kyn-tr')
export class TableRow extends LitElement {
  static override styles = [styles];

  /**
   * rowId: String - Unique identifier for the row.
   */
  @property({ type: String, reflect: true })
  rowId = '';

  /**
   * selected: Boolean indicating whether the row is selected.
   * Reflects the `selected` attribute.
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * checkboxSelection: Boolean indicating whether rows should be
   * selectable using checkboxes.
   */
  @property({ type: Boolean, reflect: true })
  checkboxSelection = false;

  /**
   * dense: Boolean indicating whether the table should be displayed
   * in dense mode.
   */
  @property({ type: Boolean })
  dense = false;

  /**
   * Context consumer for the table context.
   * Updates the cell's dense and ellipsis properties when the context changes.
   * @private
   * @ignore
   * @type {ContextConsumer<TableContextType, TableHeader>}
   */
  @state()
  // @ts-expect-error - This is a context consumer
  private _contextConsumer = new ContextConsumer(
    this,
    tableContext,
    (context) => {
      if (context) this.handleContextChange(context);
    },
    true
  );

  /**
   * Updates the cell's dense and ellipsis properties when the context changes.
   * @param {TableContextType} context - The updated context.
   */
  handleContextChange = ({ checkboxSelection }: TableContextType) => {
    if (typeof checkboxSelection == 'boolean') {
      this.checkboxSelection = checkboxSelection;
    }
  };

  /**
   * Handles the change of selection state for a specific row.
   */
  handleRowSelectionChange(event: CustomEvent) {
    this.selected = event.detail.checked;
    // Emit the custom event with the selected row and its new state
    this.dispatchEvent(
      new CustomEvent('on-row-select', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      ${this.checkboxSelection
        ? html`
            <kyn-td .align=${'center'} ?dense=${this.dense}>
              <kyn-checkbox
                .checked=${this.selected}
                visiblyHidden
                @on-checkbox-change=${this.handleRowSelectionChange}
              >
                ${this.selected ? 'Deselect' : 'Select'} Row ${this.rowId}
              </kyn-checkbox>
            </kyn-td>
          `
        : null}
      <slot></slot>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-tr': TableRow;
  }
}
