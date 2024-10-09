import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import lockedIcon from '@carbon/icons/es/locked/16';
import unlockedIcon from '@carbon/icons/es/unlocked/16';

import '../../globalFilter';
import '../index';
import '../../checkbox';

@customElement('story-column-setting')
class StoryColumSetting extends LitElement {
  static override styles = css`
    .min-max-width-100 {
      --kyn-td-min-width: 100px;
      --kyn-td-max-width: 100px;
      --kyn-td-width: 100px;
    }
    .min-max-width-th-100 {
      --kyn-th-min-width: 100px;
      --kyn-th-max-width: 100px;
      --kyn-th-width: 100px;
    }
    .unlockedRow kd-button {
      opacity: 0;
    }
    .unlockedRow:hover kd-button {
      opacity: 1;
    }
    .unlockedRow:focus kd-button {
      opacity: 1;
    }

    .freeze-button:focus {
      opacity: 1;
    }
    kyn-global-filter {
      position: sticky;
      top: 0;
      z-index: 3;
    }
    .lockedRow {
      position: sticky;
      background: white;
      top: 124px;
      z-index: 3;
    }
    .first-row-locked {
      border-collapse: initial;
    }
    .t-head {
      top: 72px;
      z-index: 2;
    }
    .seperator-div {
      height: 8px;
      background: white;
      position: sticky;
      top: 64px;
      z-index: 3; // hide column behind scroll
    }
  `;

  @property({ type: Array })
  set rows(value: any[]) {
    const oldValue = this._rows;
    this._rows = JSON.parse(JSON.stringify(value)); // Create a deep copy
    this.requestUpdate('rows', oldValue);
  }
  get rows() {
    return this._rows;
  }
  private _rows: any = [];

  @state()
  showOnlyHiddenCols = false;

  @state()
  showOnlyVisibleCols = false;

  @state()
  showingRows = this._rows;

  @state()
  hoveredButtonId: string | null = null;

  @state()
  buttonIcon = lockedIcon;

  handleLockingRow(event: any, rowId: string, locked: boolean) {
    event.preventDefault();
    event.stopPropagation();

    const row = this._rows.find((row: any) => row.id === rowId);
    if (row) {
      if (locked) {
        row.locked = false;
      } else {
        // Find the previously locked row and unlock it
        const previouslyLockedRow = this._rows.find((row: any) => row.locked);
        if (previouslyLockedRow) {
          previouslyLockedRow.locked = false;
        }

        // Lock the current row
        row.locked = true;
        row.visible = true;
      }
    }

    this.showingRows = this._rows;

    this.requestUpdate();
  }

  handleShowHiddenColsChange(event: CustomEvent) {
    this.showOnlyHiddenCols = event.detail.checked;
  }

  handleShowVisibleColsChange(event: CustomEvent) {
    this.showOnlyVisibleCols = event.detail.checked;
  }

  override updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (
      _changedProperties.has('showOnlyHiddenCols') ||
      _changedProperties.has('showOnlyVisibleCols')
    ) {
      if (this.showOnlyHiddenCols && !this.showOnlyVisibleCols) {
        this.showingRows = this._rows.filter((row: any) => {
          return !row.visible;
        });
      } else if (!this.showOnlyHiddenCols && this.showOnlyVisibleCols) {
        this.showingRows = this._rows.filter((row: any) => {
          return row.visible;
        });
      } else {
        this.showingRows = this._rows;
      }
    }
  }

  handleRowSelectionChange(event: CustomEvent, rowId: string) {
    const { checked } = event.detail;
    const row = this._rows.find((row: any) => row.id === rowId);
    if (row) {
      row.visible = checked;

      if (this.showOnlyHiddenCols && !this.showOnlyVisibleCols) {
        this.showingRows = this._rows.filter((row: any) => !row.visible);
      } else if (this.showOnlyVisibleCols && !this.showOnlyHiddenCols) {
        this.showingRows = this._rows.filter((row: any) => row.visible);
      }
    }

    this.requestUpdate();
  }

  handleMouseOver(rowId: string) {
    this.hoveredButtonId = rowId;
  }

  handleMouseOut() {
    this.hoveredButtonId = null;
  }

  getButtonIcon(rowId: string) {
    if (this.hoveredButtonId === rowId) {
      return unlockedIcon;
    } else {
      return lockedIcon;
    }
  }

  getRows() {
    return this._rows;
  }

  override render() {
    const { showingRows } = this;

    // sort the rows by order
    this.showingRows.sort((a: any, b: any) => a.order - b.order);

    // Find the locked row
    const lockedRow = showingRows.find((row: any) => row.locked);

    if (lockedRow) {
      // Remove the locked row from its current position
      const index = showingRows.indexOf(lockedRow);
      showingRows.splice(index, 1);

      // Add the locked row to the top
      showingRows.unshift(lockedRow);
    }

    return html`
      <kyn-global-filter>
        Show:
        <kyn-checkbox @on-checkbox-change=${this.handleShowHiddenColsChange}>
          Hidden Column
        </kyn-checkbox>
        <kyn-checkbox @on-checkbox-change=${this.handleShowVisibleColsChange}>
          Visible Column
        </kyn-checkbox>
      </kyn-global-filter>
      <div class="seperator-div"></div>
      <div>
        <kyn-table
          role="table"
          stickyHeader
          class="${lockedRow ? 'first-row-locked' : ''}"
        >
          <kyn-thead role="rowgroup" class="t-head">
            <kyn-header-tr role="row">
              <kyn-th .align=${'center'} class="min-max-width-th-100">
                VISIBLE
              </kyn-th>
              <kyn-th> COLUMN NAME </kyn-th>
              <kyn-th .align=${'center'}>FREEZE</kyn-th>
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody role="rowgroup">
            ${repeat(
              showingRows,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr
                  role="row"
                  class="${row.locked ? 'lockedRow' : 'unlockedRow'}"
                  @on-row-select=${(e: CustomEvent) =>
                    this.handleRowSelectionChange(e, row.id)}
                  .rowId=${row.id}
                  key="row-${row.id}"
                  .checkboxSelection=${true}
                  .locked=${row.locked}
                  .selected=${row.selected || row.locked || row.visible}
                  .preventHighlight=${row.visible}
                  .dimmed=${!row.visible}
                >
                  <kyn-td>${row.colName}</kyn-td>
                  <kyn-td .align=${'center'} class="min-max-width-100"
                    ><kd-button
                      class="freeze-button"
                      @mouseover=${() => this.handleMouseOver(row.id)}
                      @mouseout=${this.handleMouseOut}
                      iconposition="center"
                      kind="tertiary"
                      type="button"
                      size="small"
                      @on-click=${(e: CustomEvent) =>
                        this.handleLockingRow(e, row.id, row.locked)}
                      description="freeze column"
                    >
                      <kd-icon
                        slot="icon"
                        .icon=${row.locked && row.id === this.hoveredButtonId
                          ? unlockedIcon
                          : lockedIcon}
                      ></kd-icon>
                    </kd-button>
                  </kyn-td>
                </kyn-tr>
              `
            )}
          </kyn-tbody>
        </kyn-table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'story-column-setting': StoryColumSetting;
  }
}
