import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { useArgs } from 'storybook/preview-api';

import '../components/reusable/search';
import '../components/reusable/tag';
import '../components/reusable/checkbox';
import '../components/reusable/sideDrawer';
import '../components/reusable/overflowMenu';
import '../components/reusable/button';
import '../components/reusable/dropdown';
import '../components/reusable/accordion';

import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';
import filterActiveIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter-active.svg';
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
            border-radius: 8px;
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
        <div class="bar kd-elevation--level-1">
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
              <span id="filterAnchorIcon" slot="icon">
                ${unsafeSVG(filterIcon)}
              </span>
              <span class="filter-text">Filter</span>
            </kyn-button>

            <kyn-accordion compact>
              <kyn-accordion-item opened>
                <span slot="icon">${unsafeSVG(filterIcon)}</span>
                <span slot="title"> Results (#) </span>

                <div slot="body">
                  <kyn-tag-group filter limitTags>
                    <kyn-tag label="Tag 1" tagColor="spruce"></kyn-tag>
                    <kyn-tag label="Tag 2" tagColor="spruce"></kyn-tag>
                    <kyn-tag label="Clear All" tagColor="spruce"></kyn-tag>
                  </kyn-tag-group>

                  <kyn-search class="kd-spacing--margin-top-16"></kyn-search>
                </div>
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
        <div class="bar kd-elevation--level-1">
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

export const FunctionalExample = {
  args: {
    searchValue: '',
    filterSearchTerm: '',
    filter1Value: ['1'],
    filter2Value: [],
  },
  render: () => {
    const [
      { searchValue, filterSearchTerm, filter1Value, filter2Value },
      updateArgs,
    ] = useArgs();

    const getSearchValue = (event) => {
      if (event && event.detail && typeof event.detail.value === 'string') {
        return event.detail.value;
      }
      if (event && event.target && typeof event.target.value === 'string') {
        return event.target.value;
      }
      return '';
    };

    const handleTopSearchInput = (event) => {
      const value = getSearchValue(event);
      updateArgs({ searchValue: value || '' });
    };

    const handleFilterSearchInput = (event) => {
      const value = getSearchValue(event);
      updateArgs({ filterSearchTerm: value || '' });
    };

    const handleFilter1Change = (event) => {
      const value = (event.detail && event.detail.value) || [];
      updateArgs({ filter1Value: value });
    };

    const handleFilter2Change = (event) => {
      const value = (event.detail && event.detail.value) || [];
      updateArgs({ filter2Value: value });
    };

    const handleTag1Clear = () => {
      updateArgs({ filter1Value: [] });
    };

    const handleTag2Clear = () => {
      updateArgs({ filter2Value: [] });
    };

    const handleClearAllClick = () => {
      updateArgs({
        filter1Value: [],
        filter2Value: [],
        filterSearchTerm: '',
      });
    };

    const total =
      ((filter1Value && filter1Value.length) || 0) +
      ((filter2Value && filter2Value.length) || 0);

    const currentFilterIcon =
      total > 0 ? unsafeSVG(filterActiveIcon) : unsafeSVG(filterIcon);

    const hasTag1 = filter1Value && filter1Value.length > 0;
    const hasTag2 = filter2Value && filter2Value.length > 0;
    const hasSearch = !!filterSearchTerm;
    const showClearAll = hasTag1 || hasTag2 || hasSearch;

    const term = (filterSearchTerm || '').trim().toLowerCase();
    const showFilter1 =
      term === '' || 'filter 1'.includes(term) || term === '1';
    const showFilter2 =
      term === '' || 'filter 2'.includes(term) || term === '2';

    return html`
      <style>
        .search-action-bar {
          & .bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 16px;
            background: var(--kd-color-background-container-default);
            border-radius: 8px;
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
        <div class="bar kd-elevation--level-1">
          <kyn-search
            size="sm"
            .value=${searchValue || ''}
            @on-input=${handleTopSearchInput}
          ></kyn-search>

          <kyn-side-drawer
            size="sm"
            titleText="Filter"
            submitBtnText=${`Apply (${total})`}
            hideCancelButton
          >
            <kyn-button
              slot="anchor"
              kind="ghost"
              size="small"
              iconPosition="left"
            >
              <span id="filterAnchorIconDynamic" slot="icon">
                ${currentFilterIcon}
              </span>
              <span class="filter-text">Filter</span>
            </kyn-button>

            <kyn-accordion compact>
              <kyn-accordion-item opened>
                <span slot="icon">${unsafeSVG(filterIcon)}</span>
                <span slot="title"> Results (${total}) </span>

                <div slot="body">
                  <kyn-tag-group filter limitTags>
                    ${hasTag1
                      ? html`
                          <kyn-tag
                            filter
                            label="Filter 1"
                            tagColor="spruce"
                            @on-close=${handleTag1Clear}
                          ></kyn-tag>
                        `
                      : null}
                    ${hasTag2
                      ? html`
                          <kyn-tag
                            filter
                            label="Filter 2"
                            tagColor="spruce"
                            @on-close=${handleTag2Clear}
                          ></kyn-tag>
                        `
                      : null}
                    ${showClearAll
                      ? html`
                          <kyn-tag
                            filter
                            label="Clear All"
                            tagColor="spruce"
                            @on-close=${handleClearAllClick}
                          ></kyn-tag>
                        `
                      : null}
                  </kyn-tag-group>

                  <kyn-search
                    class="kd-spacing--margin-top-16"
                    size="sm"
                    .value=${filterSearchTerm || ''}
                    @on-input=${handleFilterSearchInput}
                  ></kyn-search>
                </div>
              </kyn-accordion-item>

              ${showFilter1
                ? html`
                    <kyn-accordion-item>
                      <span slot="icon">${unsafeSVG(circleDashIcon)}</span>
                      <span slot="title"> Filter 1 </span>

                      <div slot="body">
                        <kyn-checkbox-group
                          name="filter1"
                          hideLegend
                          selectAll
                          limitCheckboxes
                          .searchTerm=${filterSearchTerm || ''}
                          .value=${filter1Value}
                          @on-checkbox-group-change=${handleFilter1Change}
                        >
                          <span slot="label">Filter 1</span>

                          <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
                          <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
                        </kyn-checkbox-group>
                      </div>
                    </kyn-accordion-item>
                  `
                : null}
              ${showFilter2
                ? html`
                    <kyn-accordion-item>
                      <span slot="icon">${unsafeSVG(circleDashIcon)}</span>
                      <span slot="title"> Filter 2 </span>

                      <div slot="body">
                        <kyn-checkbox-group
                          name="filter2"
                          hideLegend
                          selectAll
                          limitCheckboxes
                          .searchTerm=${filterSearchTerm || ''}
                          .value=${filter2Value}
                          @on-checkbox-group-change=${handleFilter2Change}
                        >
                          <span slot="label">Filter 2</span>

                          <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
                          <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
                        </kyn-checkbox-group>
                      </div>
                    </kyn-accordion-item>
                  `
                : null}
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
