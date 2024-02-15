import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { action } from '@storybook/addon-actions';

import './index';
import '../checkbox';
import '../modal';
import '../textInput';
import '../overflowMenu';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/accordion';

import searchIcon from '@carbon/icons/es/search/24';
import filterIcon from '@carbon/icons/es/filter/20';
import refreshIcon from '@carbon/icons/es/renew/20';

export default {
  title: 'Patterns/Global Filter',
  component: 'kyn-global-filter',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6AovH7Iay9Y7BkpoL5975s/Applications-Specs-for-Devs?node-id=3101%3A467&mode=dev',
    },
  },
};

export const GlobalFilter = {
  render: () => {
    return html`
      <sample-filter-component></sample-filter-component>

      <br />

      This example shows a standalone Global Filter pattern. It will update the
      selected Tags automatically when changing checkbox selections. For
      client-side filtering, you may want to perform the filtering immediately.
      For server-side filtering, you may want to perform this on the modal close
      event instead. There are example event handler functions for each of the
      controls contained within.
    `;
  },
};

/**  Sample Lit component to show global filter pattern. */
@customElement('sample-filter-component')
export class SampleFilterComponent extends LitElement {
  /** Array of selected filters to output as Tags. */
  @property({ type: Array })
  selectedCheckboxFilters: Array<any> = [];

  /** Array of sample checkbox filter options. */
  @property({ type: Array })
  checkboxOptions: Array<any> = [
    {
      value: 'f1o1',
      text: 'Filter 1 Option 1',
    },
    {
      value: 'f1o2',
      text: 'Filter 1 Option 2',
    },
    {
      value: 'f1o3',
      text: 'Filter 1 Option 3',
    },
    {
      value: 'f1o4',
      text: 'Filter 1 Option 4',
    },
    {
      value: 'f1o5',
      text: 'Filter 1 Option 5',
    },
    {
      value: 'f1o6',
      text: 'Filter 1 Option 6',
    },
  ];

  override render() {
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
            size="sm"
            iconPosition="left"
          >
            <kd-icon slot="icon" .icon=${filterIcon}></kd-icon>
            Filter
          </kd-button>

          <kd-accordion filledHeaders compact>
            <kd-accordion-item>
              <span slot="title">Filter 1</span>
              <div slot="body">
                <kyn-checkbox-group
                  name="filter1"
                  hideLegend
                  selectAll
                  filterable
                  limitCheckboxes
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
              <span slot="title">Filter 2</span>
              <div slot="body">Some other filter control here.</div>
            </kd-accordion-item>
          </kd-accordion>
        </kyn-modal>

        <kd-button
          slot="actions"
          kind="tertiary"
          size="sm"
          iconPosition="left"
          @on-click=${(e: any) => this._handleCustomAction(e)}
        >
          <kd-icon slot="icon" .icon=${refreshIcon}></kd-icon>
          Custom Action
        </kd-button>

        <kyn-overflow-menu slot="actions" anchorRight verticalDots>
          <kyn-overflow-menu-item
            @on-click=${(e: any) => this._handleOverflowClick(e)}
          >
            Option 1
          </kyn-overflow-menu-item>
          <kyn-overflow-menu-item
            @on-click=${(e: any) => this._handleOverflowClick(e)}
          >
            Option 2
          </kyn-overflow-menu-item>
        </kyn-overflow-menu>

        <div slot="tags">
          ${this.selectedCheckboxFilters.map(
            (filter) => html`<span>${filter.text}</span>`
          )}
        </div>
      </kyn-global-filter>
    `;
  }

  private _handleSearch(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // handle search here
  }

  private _handleCheckboxes(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // handle checkbox filters here

    const Value = e.detail.value;
    const NewFilters: Array<any> = [];

    // add items from checkbox value output
    Value.forEach((value: string) => {
      // get full option details from value
      const Option = this.checkboxOptions.find(
        (option: any) => option.value === value
      );

      NewFilters.push(Option);
    });

    // update tags
    this.selectedCheckboxFilters = NewFilters;

    // perform filtering here (client-side scenario)
  }

  private _handleModalClose(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // handle modal close here

    if (e.detail.returnValue === 'ok') {
      // modal was closed with OK/primary action, logic to apply filters here (server-side scenario)
    } else {
      // modal was closed with cancel/secondary action, logic to revert filters here
    }
  }

  private _handleCustomAction(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // custom action logic here
  }

  private _handleOverflowClick(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // overflow link click logic here
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'sample-filter-component': SampleFilterComponent;
  }
}
