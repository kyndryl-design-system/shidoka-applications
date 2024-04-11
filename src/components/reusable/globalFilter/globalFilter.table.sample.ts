import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { action } from '@storybook/addon-actions';
import { repeat } from 'lit/directives/repeat.js';

import './index';
import '../checkbox';
import '../modal';
import '../textInput';
import '../overflowMenu';
import '../tag';
import '../table';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/accordion';

import searchIcon from '@carbon/icons/es/search/24';
import filterIcon from '@carbon/icons/es/filter/20';
import filterEditIcon from '@carbon/icons/es/filter--edit/20';
import filterRemoveIcon from '@carbon/icons/es/close--filled/16';
import refreshIcon from '@carbon/icons/es/renew/20';

/**  Sample Lit component to show global filter pattern applied to a Chart. */
@customElement('sample-filter-table-component')
export class SampleFilterTableComponent extends LitElement {
  static override styles = css`
    .filter-text {
      display: none;
    }

    @media (min-width: 42rem) {
      .filter-text {
        display: inline;
      }
    }
  `;

  /** Array of sample checkbox filter options. */
  @state()
  checkboxOptions: Array<any> = [
    {
      value: 'Stark',
      text: 'Stark',
    },
    {
      value: 'Lannister',
      text: 'Lannister',
    },
    {
      value: 'Taragaryen',
      text: 'Taragaryen',
    },
  ];

  @state()
  houses: Array<string> = ['Stark', 'Lannister', 'Taragaryen'];

 @state()
  filteredHouses: Array<string> = [];

  @state()
  private characters = [
    { name: 'Jon Snow', age: 23, house: 'Stark' },
    { name: 'Daenerys Targaryen', age: 22, house: 'Targaryen' },
    { name: 'Tyrion Lannister', age: 39, house: 'Lannister' },
    { name: 'Cersei Lannister', age: 42, house: 'Lannister' },
    { name: 'Arya Stark', age: 18, house: 'Stark' },
    { name: 'Sansa Stark', age: 20, house: 'Stark' },
    { name: 'Bran Stark', age: 17, house: 'Stark' },
    { name: 'Jaime Lannister', age: 44, house: 'Lannister' },
  ];

  @state()
  private characters_backup = [
    { name: 'Jon Snow', age: 23, house: 'Stark' },
    { name: 'Daenerys Targaryen', age: 22, house: 'Targaryen' },
    { name: 'Tyrion Lannister', age: 39, house: 'Lannister' },
    { name: 'Cersei Lannister', age: 42, house: 'Lannister' },
    { name: 'Arya Stark', age: 18, house: 'Stark' },
    { name: 'Sansa Stark', age: 20, house: 'Stark' },
    { name: 'Bran Stark', age: 17, house: 'Stark' },
    { name: 'Jaime Lannister', age: 44, house: 'Lannister' },
  ];

  @state()
  selectedRows = [];

  @state()
  opened = false;

  private toggleMenu() {
    this.opened = !this.opened;
  }

  /**
   * kynTable: Reference to the kyn-table component.
   * @ignore
   */
  @state()
  private kynTable: any;

  @state()
  private textInput: any;

  override render() {
    const SelectedOptions = this.checkboxOptions.filter(
      (option) => option.checked
    );

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
          <kd-icon slot="icon" .icon=${searchIcon}></kd-icon>
        </kyn-text-input>

        <kyn-modal
          size="lg"
          titleText="Filter"
          @on-close=${(e: any) => this._handleModalClose(e)}
        >
          <kd-button
            slot="anchor"
            kind="tertiary"
            size="small"
            iconPosition="left"
            tabindex="-1"
          >
            <kd-icon
              slot="icon"
              .icon=${SelectedOptions.length ? filterEditIcon : filterIcon}
            ></kd-icon>
            <span class="filter-text">Filter</span>
          </kd-button>

          <kd-accordion filledHeaders compact>
            <kd-accordion-item>
              <span slot="title">
                Houses:
                ${SelectedOptions.length
                  ? SelectedOptions.length + ' items'
                  : 'Any'}
              </span>
              <div slot="body">
                <kyn-checkbox-group
                  name="colors"
                  hideLegend
                  selectAll
                  filterable
                  limitCheckboxes
                  .value=${SelectedOptions.map((option) => {
                    return option.value;
                  })}
                  @on-checkbox-group-change=${(e: any) =>
                    this._handleCheckboxes(e)}
                >
                  <span slot="label">Filter 1</span>

                  ${this.checkboxOptions.map(
                    (option: any) => html`
                      <kyn-checkbox value=${option.value}>
                        ${option.text}
                      </kyn-checkbox>
                    `
                  )}
                </kyn-checkbox-group>
              </div>
            </kd-accordion-item>

            <kd-accordion-item>
              <span slot="title">Filter 2: Any</span>
              <div slot="body">Some other filter control here.</div>
            </kd-accordion-item>
          </kd-accordion>
        </kyn-modal>

        <kd-button
          slot="actions"
          kind="tertiary"
          size="small"
          iconPosition="left"
          @on-click=${(e: any) => this._handleCustomAction(e)}
        >
          <kd-icon slot="icon" .icon=${refreshIcon}></kd-icon>
          <span class="filter-text">Refresh</span>
        </kd-button>

        <kyn-overflow-menu
          slot="actions"
          anchorRight
          verticalDots
          ?open=${this.opened}
        >
          <kyn-overflow-menu-item
            @on-click=${(e: any) => this._handleOverflowClick(e)}
          >
            Option 1
          </kyn-overflow-menu-item>
          <kyn-overflow-menu-item @on-click=${this._deleteSelectedRows}>
            Delete
          </kyn-overflow-menu-item>
        </kyn-overflow-menu>

        <kyn-tag-group slot="tags" filter limitTags>
          ${SelectedOptions.map(
            (filter) =>
              html`
                <kyn-tag
                  label=${filter.text}
                  tagColor="grey"
                  @on-close=${(e: any) => this._handleTagClick(e, filter)}
                ></kyn-tag>
              `
          )}
        </kyn-tag-group>

        ${SelectedOptions.length
          ? html`
              <kd-button
                slot="tags"
                kind="tertiary"
                size="small"
                iconPosition="right"
                @on-click=${(e: any) => this._handleClearTags(e)}
              >
                <kd-icon slot="icon" .icon=${filterRemoveIcon}></kd-icon>
                Clear All
              </kd-button>
            `
          : null}
      </kyn-global-filter>

      <kyn-table
        checkboxSelection
        @on-row-selection-change=${this._handleSelectedRowsChange}
        @on-all-rows-selection-change=${this._handleSelectedRowsChange}
      >
        <kyn-thead>
          <kyn-header-tr>
            <kyn-th>Character</kyn-th>
            <kyn-th>Age</kyn-th>
            <kyn-th>House</kyn-th>
          </kyn-header-tr>
        </kyn-thead>
        <kyn-tbody>
          ${repeat(
           this.characters,
            (row: any) => row.name,
            (row: any) => html`
              <kyn-tr .rowId=${row.name}>
                <kyn-td>${row.name}</kyn-td>
                <kyn-td>${row.age}</kyn-td>
                <kyn-td>${row.house}</kyn-td>
              </kyn-tr>
            `
          )}
        </kyn-tbody>
      </kyn-table>
    `;
  }

  private _handleSearch(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // perform filtering here
    this._filter(e.detail.value);
  }

  private _handleCheckboxes(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    const Value = e.detail.value;

    // update checked state for each option
    this.checkboxOptions = this.checkboxOptions.map((option) => {
      return { ...option, checked: Value.includes(option.value) };
    });

    // perform filtering here (client-side scenario)
    this._filter('');
  }

  private _handleModalClose(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // handle modal close here

    if (e.detail.returnValue === 'ok') {
      // modal was closed with OK/primary action, logic to perform filtering here (server-side scenario)
    } else {
      // modal was closed with cancel/secondary action/x, logic to revert filters here
    }
  }

  private _handleTagClick(e: any, option: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // remove tag by setting checkbox option checked value to false
    option.checked = false;

    // perform filtering here
    this._filter('');

    // force update/render, since objects are updated by reference
    this.requestUpdate();
  }

  private _handleClearTags(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // update checked state for each option
    this.checkboxOptions = this.checkboxOptions.map((option) => {
      return { ...option, checked: false };
    });

    // perform filtering here
    this._filter('');
  }

  private _filter(query: string) {
    //get selected filters
    const SelectedOptions = this.checkboxOptions.filter(
      (option) => option.checked
    );

    if (SelectedOptions.length) {
      // filter the labels based on selected checkboxes
      this.filteredHouses = this.houses.filter((label) => {
        return this.checkboxOptions.some(
          (option) => option.value === label && option.checked
        );
      });
    } else {
      // show all labels if no filters applied
      this.filteredHouses = this.houses;
    }

    // perform search query filtering
    if (query !== '') {
      this.filteredHouses = this.filteredHouses.filter((label) => {
        return label.toLowerCase().includes(query.toLowerCase());
      });
    }

    this.characters = this.characters_backup.filter((character) => {
      return this.filteredHouses.includes(character.house);
    })
  }

  override firstUpdated() {
    // perform initial filtering on first update/render
    this._filter('');

    this.kynTable = this.shadowRoot?.querySelector('kyn-table');
    this.textInput = this.shadowRoot?.querySelector('kyn-text-input');
  }

  private _handleOverflowClick(e: any) {
    action(e.type)(e);
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.detail);

    // overflow link click logic here

    this.toggleMenu();
  }

  private async _deleteSelectedRows() {
    const selectedRowIdsSet = new Set(
      this.selectedRows.map((row: any) => row.rowId)
    );
    this.characters = this.characters.filter(
      (row: any) => !selectedRowIdsSet.has(row.name)
    );

    this.selectedRows = [];
    await this.updateComplete;

    // have to wait for the update to finish before calling this
    this.kynTable?.updateAfterExternalChanges();

    this.toggleMenu();
  }

  private _handleSelectedRowsChange(e: CustomEvent) {
    const { selectedRows } = e.detail;
    this.selectedRows = selectedRows;
    this.requestUpdate();
  }

  private _handleCustomAction(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.characters = this.characters_backup;
    this.checkboxOptions = this.checkboxOptions.map((option) => {
      return { ...option, checked: false };
    });

    this.textInput.value = '';

    this._filter('');

    this.toggleMenu();

    // custom action logic here
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'sample-filter-table-component': SampleFilterTableComponent;
  }
}
