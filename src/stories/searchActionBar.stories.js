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
                    <kyn-tag label="Clear All" tagColor="default"></kyn-tag>
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

let functionalExampleInitialized = false;

export const FunctionalExample = {
  args: {
    searchValue: '',
    filterSearchTerm: '',
    filter1Value: [],
    filter2Value: [],
  },
  render: () => {
    const [
      { searchValue, filterSearchTerm, filter1Value, filter2Value },
      updateArgs,
    ] = useArgs();

    if (!functionalExampleInitialized) {
      functionalExampleInitialized = true;
      updateArgs({
        searchValue: '',
        filterSearchTerm: '',
      });
    }

    const filter1Options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4' },
    ];

    const filter2Options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4' },
    ];

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

    const handleFilter1OptionClear = (valueToClear) => {
      const next = (filter1Value || []).filter((v) => v !== valueToClear);
      updateArgs({ filter1Value: next });
    };

    const handleFilter2OptionClear = (valueToClear) => {
      const next = (filter2Value || []).filter((v) => v !== valueToClear);
      updateArgs({ filter2Value: next });
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

    const hasSearch = !!filterSearchTerm;
    const hasFilterTags =
      (Array.isArray(filter1Value) && filter1Value.length > 0) ||
      (Array.isArray(filter2Value) && filter2Value.length > 0);
    const showClearAll = hasFilterTags || hasSearch;

    const term = (filterSearchTerm || '').trim().toLowerCase();

    const filterOptionsByTerm = (options) => {
      if (!term) return options;
      return options.filter((opt) => {
        const label = opt.label.toLowerCase();
        const value = String(opt.value).toLowerCase();
        return label.includes(term) || value.includes(term);
      });
    };

    const visibleFilter1Options = filterOptionsByTerm(filter1Options);
    const visibleFilter2Options = filterOptionsByTerm(filter2Options);

    const showFilter1 =
      visibleFilter1Options.length > 0 ||
      (Array.isArray(filter1Value) && filter1Value.length > 0);

    const showFilter2 =
      visibleFilter2Options.length > 0 ||
      (Array.isArray(filter2Value) && filter2Value.length > 0);

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
                    ${Array.isArray(filter1Value)
                      ? filter1Value.map(
                          (v) => html`
                            <kyn-tag
                              filter
                              label=${`Filter 1: Option ${v}`}
                              tagColor="spruce"
                              @on-close=${() => handleFilter1OptionClear(v)}
                            ></kyn-tag>
                          `
                        )
                      : null}
                    ${Array.isArray(filter2Value)
                      ? filter2Value.map(
                          (v) => html`
                            <kyn-tag
                              filter
                              label=${`Filter 2: Option ${v}`}
                              tagColor="spruce"
                              @on-close=${() => handleFilter2OptionClear(v)}
                            ></kyn-tag>
                          `
                        )
                      : null}
                    ${showClearAll
                      ? html`
                          <kyn-tag
                            filter
                            label="Clear All"
                            tagColor="default"
                            persistentTag
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
                          .value=${filter1Value}
                          @on-checkbox-group-change=${handleFilter1Change}
                        >
                          <span slot="label">Filter 1</span>

                          ${visibleFilter1Options.map(
                            (opt) => html`
                              <kyn-checkbox value=${opt.value}>
                                ${opt.label}
                              </kyn-checkbox>
                            `
                          )}
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
                          .value=${filter2Value}
                          @on-checkbox-group-change=${handleFilter2Change}
                        >
                          <span slot="label">Filter 2</span>

                          ${visibleFilter2Options.map(
                            (opt) => html`
                              <kyn-checkbox value=${opt.value}>
                                ${opt.label}
                              </kyn-checkbox>
                            `
                          )}
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
              <kyn-overflow-menu-item> Option 1 </kyn-overflow-menu-item>
              <kyn-overflow-menu-item> Option 2 </kyn-overflow-menu-item>
            </kyn-overflow-menu>
          </div>
        </div>
      </div>
    `;
  },
};
