import { customElement, state, property } from 'lit/decorators.js';
import { TableRow } from './table-row';
import { html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import '../../reusable/overflowMenu';

import styles from './table-header-row.scss?inline';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import caretDown from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/caret-down.svg';

/**
 * `kyn-header-tr` Web Component.
 *
 * The `<kyn-header-tr>` component is designed to function as the
 * header row within a table that's part of Shidoka's design system.
 */
@customElement('kyn-header-tr')
export class TableHeaderRow extends TableRow {
  static override styles = unsafeCSS(styles);

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor role = 'row';

  /**
   * headerCheckboxIndeterminate: Boolean indicating whether the header
   * checkbox is in an indeterminate state.
   * @ignore
   */
  @state()
  private accessor headerCheckboxIndeterminate = false;

  /**
   * headerCheckboxChecked: Boolean indicating whether the header checkbox is
   * checked.
   * @ignore
   */
  @state()
  private accessor headerCheckboxChecked = false;

  /**
   * expandableColumnWidth: The width of the expandable column.
   * @type {string}
   * @default '64px'
   */
  @property({ type: String })
  accessor expandableColumnWidth = '64px';

  /**
   * multiSelectColumnWidth: The width of the multi-select column.
   * @type {string}
   * @default '64px'
   */
  @property({ type: String })
  accessor multiSelectColumnWidth = '64px';

  /** Text for "Select all items" option in the bulk selection menu. */
  @property({ type: String })
  accessor selectAllItemsText = 'Select all items';

  /** Tooltip text for "Select all items" option in the bulk selection menu. */
  @property({ type: String })
  accessor selectAllTooltipText = '';

  /** Assistive text for the bulk selection menu trigger. */
  @property({ type: String })
  accessor selectAllAssistiveText = 'Select all options';

  /** Text for "Clear selection" option in the bulk selection menu. */
  @property({ type: String })
  accessor clearSelectionText = 'Clear selection';

  /** "Clear selection" option state in the bulk selection menu.*/
  @property({ type: Boolean })
  accessor disableClearSelection = false;

  /**
   * @internal
   */
  @property({ type: Boolean })
  override accessor enableBulkSelection = false;

  /**
   * Handles bulk menu selection
   */
  private handleToggleBulkSelection(action: 'bulkselect-all' | 'clear-all') {
    this.dispatchEvent(
      new CustomEvent('on-bulkselect-all', {
        detail: { action },
        bubbles: true,
        composed: true,
      })
    );
  }

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
            class="expandable-header-column"
            >Expandable Header Column
          </kyn-th>`
        : null}
      ${this.checkboxSelection
        ? html` <kyn-th
            .align=${'center'}
            ?dense=${this.dense}
            .width=${this.multiSelectColumnWidth}
            class="checkbox-header-column"
          >
            <div class="checkbox-container">
              <kyn-checkbox
                ?disabled=${this.disabled}
                .indeterminate=${headerCheckboxIndeterminate}
                .checked=${headerCheckboxChecked}
                visiblyHidden
                @on-checkbox-change=${this.handleToggleSelectionAll}
                >Select all rows</kyn-checkbox
              >
              ${this.enableBulkSelection
                ? html`
                    <kyn-overflow-menu
                      class="ml-2"
                      anchorLeft
                      fixed
                      verticalDots
                      assistiveText=${this.selectAllAssistiveText}
                    >
                      <span slot="icon">${unsafeSVG(caretDown)}</span>
                      <kyn-overflow-menu-item
                        @on-click=${() =>
                          this.handleToggleBulkSelection('bulkselect-all')}
                      >
                        ${this.selectAllItemsText}
                        ${this.selectAllTooltipText
                          ? html`
                              <kyn-tooltip slot="tooltip">
                                <span slot="anchor" style="display:flex"
                                  >${unsafeSVG(infoIcon)}</span
                                >
                                ${this.selectAllTooltipText}
                              </kyn-tooltip>
                            `
                          : null}
                      </kyn-overflow-menu-item>
                      <kyn-overflow-menu-item
                        destructive
                        ?disabled=${this.disableClearSelection}
                        @on-click=${() =>
                          this.handleToggleBulkSelection('clear-all')}
                      >
                        ${this.clearSelectionText}
                      </kyn-overflow-menu-item>
                    </kyn-overflow-menu>
                  `
                : null}
            </div>
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
