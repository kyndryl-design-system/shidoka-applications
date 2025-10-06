import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import '../components/reusable/search';
import '../components/reusable/tag';
import '../components/reusable/checkbox';
import '../components/reusable/sideDrawer';
import '../components/reusable/overflowMenu';
import '../components/reusable/button';
import '../components/reusable/dropdown';
import '../components/reusable/accordion';

import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';
import circleDashIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';

export default {
  title: 'Patterns/Search & Action Bar',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const SideDrawer = {
  render: () => {
    return html`
      <style>
        .search-action-bar {
          & .bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 16px;
            background: var(--kd-color-background-container-default);
            border-radius: 4px;
            padding: 16px;

            & .right {
              margin-left: auto;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
        }
      </style>

      <div class="search-action-bar">
        <div class="bar">
          <kyn-search size="sm"></kyn-search>

          <kyn-side-drawer
            size="sm"
            titleText="Filter"
            submitBtnText="Apply (#)"
            hideCancelButton
          >
            <kyn-button
              slot="anchor"
              kind="ghost"
              size="small"
              iconPosition="left"
            >
              <span slot="icon"> ${unsafeSVG(filterIcon)} </span>
              <span class="filter-text">Filter</span>
            </kyn-button>

            <kyn-accordion compact>
              <kyn-accordion-item opened>
                <span slot="icon">${unsafeSVG(filterIcon)}</span>
                <span slot="title"> Filter Results (#) </span>

                <div slot="body">
                  <kyn-tag-group filter limitTags>
                    <kyn-tag label="Tag 1" tagColor="spruce"></kyn-tag>
                    <kyn-tag label="Tag 2" tagColor="spruce"></kyn-tag>
                  </kyn-tag-group>

                  <kyn-search class="kd-spacing--margin-top-16"></kyn-search>
                </div>

                <kyn-button
                  slot="action"
                  kind="ghost"
                  size="small"
                  @click=${(e) => {
                    e.stopPropagation();
                  }}
                >
                  Clear All
                </kyn-button>
              </kyn-accordion-item>

              <kyn-accordion-item>
                <span slot="icon">${unsafeSVG(circleDashIcon)}</span>
                <span slot="title"> Filter 1 </span>

                <div slot="body">
                  <kyn-checkbox-group
                    name="filter1"
                    hideLegend
                    selectAll
                    limitCheckboxes
                    .value=${['1']}
                  >
                    <span slot="label">Filter 1</span>

                    <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
                    <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
                  </kyn-checkbox-group>
                </div>

                <kyn-button
                  slot="action"
                  kind="ghost"
                  size="small"
                  @click=${(e) => {
                    e.stopPropagation();
                  }}
                >
                  Clear (#)
                </kyn-button>
              </kyn-accordion-item>

              <kyn-accordion-item>
                <span slot="icon">${unsafeSVG(circleDashIcon)}</span>
                <span slot="title"> Filter 2 </span>

                <div slot="body">
                  <kyn-checkbox-group
                    name="filter2"
                    hideLegend
                    selectAll
                    limitCheckboxes
                  >
                    <span slot="label">Filter 1</span>

                    <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
                    <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
                  </kyn-checkbox-group>
                </div>
              </kyn-accordion-item>
            </kyn-accordion>
          </kyn-side-drawer>

          <div class="right">
            <kyn-button kind="secondary" size="small"> Button </kyn-button>

            <kyn-overflow-menu anchorRight>
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>
          </div>
        </div>
      </div>
    `;
  },
};

export const Inline = {
  render: () => {
    return html`
      <style>
        .search-action-bar-inline {
          & .bar {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            background: var(--kd-color-background-container-default);
            border-radius: 4px;
            padding: 16px;

            & .right {
              margin-left: auto;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
        }

        @media (min-width: 42rem) {
          .search-action-bar-inline .bar {
            flex-direction: row;
            align-items: center;
          }
        }
      </style>

      <div class="search-action-bar-inline">
        <div class="bar">
          <kyn-search size="sm"></kyn-search>

          <kyn-dropdown
            multiple
            size="sm"
            label="Dropdown 1"
            placeholder="Dropdown 1"
            hideLabel
            hideTags
          >
            <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
            <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          </kyn-dropdown>

          <kyn-dropdown
            multiple
            size="sm"
            label="Dropdown 2"
            placeholder="Dropdown 2"
            hideLabel
            hideTags
          >
            <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
            <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          </kyn-dropdown>

          <div class="right">
            <kyn-button kind="secondary" size="small"> Button </kyn-button>

            <kyn-overflow-menu anchorRight>
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>
          </div>
        </div>

        <kyn-tag-group class="kd-spacing--margin-top-8" filter limitTags>
          <kyn-tag label="Tag 1" tagColor="spruce"></kyn-tag>
          <kyn-tag label="Tag 2" tagColor="spruce"></kyn-tag>
        </kyn-tag-group>
      </div>
    `;
  },
};
