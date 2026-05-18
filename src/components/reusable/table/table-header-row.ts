import { customElement, state, property } from 'lit/decorators.js';
import { TableRow } from './table-row';
import { html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import '../../reusable/overflowMenu';

import styles from './table-header-row.scss?inline';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

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

  /**
   * Total number of items available (used for "Select all items" display)
   * @type {number}
   */
  @property({ type: Number })
  accessor totalItems: number | undefined;

  /**
   * Handles select menu item click
   */
  private handleSelectMenuClick(action: 'visible' | 'all' | 'clear') {
    this.dispatchEvent(
      new CustomEvent('on-select-all-menu', {
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
    const { headerCheckboxIndeterminate, headerCheckboxChecked, totalItems } =
      this;

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
            <div style="display: flex; align-items: center; gap: 4px;">
              <kyn-checkbox
                ?disabled=${this.disabled}
                .indeterminate=${headerCheckboxIndeterminate}
                .checked=${headerCheckboxChecked}
                visiblyHidden
                @on-checkbox-change=${this.handleToggleSelectionAll}
              ></kyn-checkbox>
              <kyn-overflow-menu
                anchorLeft
                fixed
                verticalDots
                assistiveText="Select rows options"
              >
                <kyn-overflow-menu-item
                  @on-click=${() => this.handleSelectMenuClick('visible')}
                >
                  Select visible rows
                  <kyn-tooltip slot="tooltip">
                    <span slot="anchor" style="display:flex"
                      >${unsafeSVG(infoIcon)}</span
                    >
                    Add your tooltip text
                  </kyn-tooltip>
                </kyn-overflow-menu-item>
                <kyn-overflow-menu-item
                  @on-click=${() => this.handleSelectMenuClick('all')}
                >
                  Select all
                  items${totalItems ? html`&nbsp;(${totalItems})` : ''}
                  <kyn-tooltip slot="tooltip">
                    <span slot="anchor" style="display:flex"
                      >${unsafeSVG(infoIcon)}</span
                    >
                    Add your tooltip text
                  </kyn-tooltip>
                </kyn-overflow-menu-item>
                <kyn-overflow-menu-item
                  destructive
                  @on-click=${() => this.handleSelectMenuClick('clear')}
                >
                  Clear selection
                </kyn-overflow-menu-item>
              </kyn-overflow-menu>
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
