import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { action } from '@storybook/addon-actions';

import './index';
import '../checkbox';
import '../modal';
import '../textInput';
import '../overflowMenu';
import '../tag';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/accordion';

import searchIcon from '@carbon/icons/es/search/24';
import filterIcon from '@carbon/icons/es/filter/20';
import filterEditIcon from '@carbon/icons/es/filter--edit/20';
import filterRemoveIcon from '@carbon/icons/es/close--filled/16';
import refreshIcon from '@carbon/icons/es/renew/20';

/**  Sample Lit component to show global filter pattern. */
@customElement('sample-filter-component')
export class SampleFilterComponent extends LitElement {
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
  @property({ type: Array })
  checkboxOptions: Array<any> = [
    {
      value: '1',
      text: 'Option 1',
    },
    {
      value: '2',
      text: 'Option 2',
    },
    {
      value: '3',
      text: 'Option 3',
    },
    {
      value: '4',
      text: 'Option 4',
    },
    {
      value: '5',
      text: 'Option 5',
    },
    {
      value: '6',
      text: 'Option 6',
    },
  ];

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
                Filter 1:
                ${SelectedOptions.length
                  ? SelectedOptions.length + ' items'
                  : 'Any'}
              </span>
              <div slot="body">
                <kyn-checkbox-group
                  name="filter1"
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
          <span class="filter-text">Custom Action</span>
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
    `;
  }

  private _handleSearch(e: any) {
    action(e.type)(e);
    // console.log(e.detail);

    // perform filtering here
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
