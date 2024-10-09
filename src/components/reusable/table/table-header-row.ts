import { customElement, state, property } from 'lit/decorators.js';
import { TableRow } from './table-row';
import { html } from 'lit';

import styles from './table-header-row.scss';

/**
 * `kyn-header-tr` Web Component.
 *
 * The `<kyn-header-tr>` component is designed to function as the
 * header row within a table that's part of Shidoka's design system.
 */
@customElement('kyn-header-tr')
export class TableHeaderRow extends TableRow {
  static override styles = [styles];

  /**
   * headerCheckboxIndeterminate: Boolean indicating whether the header
   * checkbox is in an indeterminate state.
   * @ignore
   */
  @state()
  private headerCheckboxIndeterminate = false;

  /**
   * headerCheckboxChecked: Boolean indicating whether the header checkbox is
   * checked.
   * @ignore
   */
  @state()
  private headerCheckboxChecked = false;

  /**
   * expandableColumnWidth: The width of the expandable column.
   * @type {string}
   * @default '64px'
   */
  @property({ type: String })
  expandableColumnWidth = '64px';

  /**
   * multiSelectColumnWidth: The width of the multi-select column.
   * @type {string}
   * @default '64px'
   */
  @property({ type: String })
  multiSelectColumnWidth = '64px';

  /**
   * Toggles the selection state of all rows in the table.
   */
  handleToggleSelectionAll(event: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('on-header-checkbox-toggle', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Updates the state of the header checkbox based on the number of
   * selected rows.
   */
  updateHeaderCheckboxState(indeterminate: boolean, checked: boolean) {
    this.headerCheckboxIndeterminate = indeterminate;
    this.headerCheckboxChecked = checked;
    this.requestUpdate();
  }

  override render() {
    const { headerCheckboxIndeterminate, headerCheckboxChecked } = this;

    super.render();
    return html`
      ${this.expandable
        ? html`<kyn-th
            .align="${'center'}"
            .width=${this.expandableColumnWidth}
            visiblyHidden
            >Expandable Header Column
          </kyn-th>`
        : null}
      ${this.checkboxSelection
        ? html` <kyn-th
            .align=${'center'}
            ?dense=${this.dense}
            .width=${this.multiSelectColumnWidth}
            ><kyn-checkbox
              ?disabled=${this.disabled}
              .indeterminate=${headerCheckboxIndeterminate}
              .checked=${headerCheckboxChecked}
              visiblyHidden
              @on-checkbox-change=${this.handleToggleSelectionAll}
              >Select All Items</kyn-checkbox
            >
          </kyn-th>`
        : null}
      <slot></slot>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-tr': TableHeaderRow;
  }
}
