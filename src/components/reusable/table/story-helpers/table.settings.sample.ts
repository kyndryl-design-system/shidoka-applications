import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '../../button';

import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/search.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';

import '../index';
import './column-setting.sample';
import '../../sideDrawer';
import '../../textInput';
import { dataForColumns as rows } from './ultils.sample';

import '../../../../common/scss/global.scss';

@customElement('story-table-settings')
class StoryTableSettings extends LitElement {
  static override styles = css`
    .min-max-width-100 {
      --kyn-td-min-width: 100px;
      --kyn-td-max-width: 100px;
      --kyn-td-width: 100px;
    }

    kyn-table {
      overflow-x: auto;
    }

    .table-container {
      overflow-x: auto;
    }
    .first-col-locked {
      border-collapse: initial; // to scroll rest column over the 1st column
    }

    kyn-table.first-col-locked kyn-th:first-child,
    kyn-table.first-col-locked kyn-td:first-child {
      position: sticky;
      left: 0;
      z-index: 3; /* To make sure the sticky cells stay on top of others */
      box-shadow: 0px 2px 8px rgba(61, 60, 60, 0.25);
      border-right-color: transparent;
    }
    kyn-table.first-col-locked kyn-td:first-child {
      background-color: var(--kd-color-background-table-row);
    }
    kyn-global-filter kyn-side-drawer::part(drawer-dialog) {
      overflow-y: hidden;
    }
  `;

  @state()
  private columnSetting: any;

  @state()
  open = false;

  @state()
  columns: any = [
    {
      id: 'col1',
      order: 1,
      colName: 'COLUMN 1',
      locked: true,
      visible: true,
      align: 'center',
    },
    {
      id: 'col2',
      order: 2,
      colName: 'COLUMN 2',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col3',
      order: 3,
      colName: 'COLUMN 3',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col4',
      order: 4,
      colName: 'COLUMN 4',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col5',
      order: 5,
      colName: 'COLUMN 5',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col6',
      order: 6,
      colName: 'COLUMN 6',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col7',
      order: 7,
      colName: 'COLUMN 7',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col8',
      order: 8,
      colName: 'COLUMN 8',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col9',
      order: 9,
      colName: 'COLUMN 9',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col10',
      order: 10,
      colName: 'COLUMN 10',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col11',
      order: 11,
      colName: 'COLUMN 11',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col12',
      order: 12,
      colName: 'COLUMN 12',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col13',
      order: 13,
      colName: 'COLUMN 13',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col14',
      order: 14,
      colName: 'COLUMN 14',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col15',
      order: 15,
      colName: 'COLUMN 15',
      locked: false,
      visible: true,
      align: 'center',
    },
    {
      id: 'col16',
      order: 16,
      colName: 'COLUMN 16',
      locked: false,
      visible: false,
      align: 'center',
    },
    {
      id: 'col17',
      order: 17,
      colName: 'COLUMN 17',
      locked: false,
      visible: false,
      align: 'center',
    },
    {
      id: 'col18',
      order: 18,
      colName: 'COLUMN 18',
      locked: false,
      visible: false,
      align: 'center',
    },
    {
      id: 'col19',
      order: 19,
      colName: 'COLUMN 19',
      locked: false,
      visible: false,
      align: 'center',
    },
    {
      id: 'col20',
      order: 20,
      colName: 'COLUMN 20',
      locked: false,
      visible: false,
      align: 'center',
    },
  ];

  override firstUpdated() {
    this.columnSetting = this.shadowRoot?.querySelector('story-column-setting');
  }

  handleSettingsClick(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.open = !this.open;
    this.requestUpdate();
  }

  handleClose(e: CustomEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.detail.returnValue === 'ok') {
      const updatedColumns = this.columnSetting.getRows();

      // Update the columns
      updatedColumns.forEach((updatedColumn: any) => {
        const originalColumn = this.columns.find(
          (column: any) => column.id === updatedColumn.id
        );
        if (originalColumn) {
          originalColumn.visible = updatedColumn.visible;
          originalColumn.locked = updatedColumn.locked;
        }
      });
      this.requestUpdate();
      return;
    }
  }

  _handleSearch(e: any) {
    console.log('Search for ' + e.target.value);
  }

  override render() {
    // sort the columns by order
    this.columns.sort((a: any, b: any) => a.order - b.order);

    // Find the locked column
    const lockedCol = this.columns.find((col: any) => col.locked);

    if (lockedCol) {
      // Remove the locked col from its current position
      const index = this.columns.indexOf(lockedCol);
      this.columns.splice(index, 1);

      // Add the locked col to the top
      this.columns.unshift(lockedCol);
    }

    return html`
      <kyn-global-filter>
        <kyn-text-input
          type="search"
          placeholder="Search"
          size="sm"
          hideLabel
          @on-input=${(e: any) => this._handleSearch(e)}
        >
          Search
          <span slot="icon" style="display:flex">${unsafeSVG(searchIcon)}</span>
        </kyn-text-input>

        <div slot="actions">
          <kyn-side-drawer
            ?open=${this.open}
            size=${'md'}
            titleText=${'Column Settings'}
            submitBtnText=${'Save'}
            cancelBtnText=${'Cancel'}
            @on-close=${(e: CustomEvent) => this.handleClose(e)}
          >
            <div slot="anchor">
              <kyn-button
                iconposition="left"
                kind="tertiary"
                type="button"
                size="small"
                @on-click=${(e: CustomEvent) => this.handleSettingsClick(e)}
                description="settings button"
              >
                Settings
                <span slot="icon" style="display:flex"
                  >${unsafeSVG(settingsIcon)}</span
                >
              </kyn-button>
            </div>
            <story-column-setting .rows=${this.columns}></story-column-setting>
          </kyn-side-drawer>
        </div>
      </kyn-global-filter>
      <div class="table-container" tabindex="0">
        <kyn-table class=${lockedCol ? 'first-col-locked' : ''}>
          <kyn-thead>
            <kyn-header-tr>
              ${repeat(
                this.columns,
                (col: any) => col.id,
                (col: any) =>
                  col.visible
                    ? html`
                        <kyn-th .align=${col.align}>${col.colName}</kyn-th>
                      `
                    : null
              )}
            </kyn-header-tr>
          </kyn-thead>
          <kyn-tbody>
            ${repeat(
              rows,
              (row: any) => row.id,
              (row: any) => html`
                <kyn-tr .rowId=${row.id} key="row-${row.id}">
                  ${repeat(
                    this.columns,
                    (col: any) => `${row.id}-${col.id}`,
                    (col: any) =>
                      col.visible
                        ? html`
                            <kyn-td class="min-max-width-100" .align=${'center'}
                              >${row[col.id]}</kyn-td
                            >
                          `
                        : null
                  )}
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
    'story-table-settings': StoryTableSettings;
  }
}
