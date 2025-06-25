import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Config } from '../../../../common/helpers/gridstack';
import SampleLayout from './gridstacklayout.sample';
import { action } from '@storybook/addon-actions';
import '../index';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import Styles from './gridstack.newWidget.scss';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import rolesIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/96/roles.svg';
import appsDataIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/96/applications-data-&-Ai.svg';
import securityIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/96/security-&-resiliency.svg';
import trackIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/96/track.svg';
import boxStackedIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/96/box-stacked.svg';
import templateIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/96/template.svg';

import listIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/list.svg';
import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import editIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';
import splitIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/split.svg';
import CheckMarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';

import '../../overflowMenu';
import '../../button';
import '../../textInput';
import '../../search';
import '../../tabs';
import '../../sideDrawer';
import '../../pagetitle';
import '../../fileUploader';
import '../../inlineConfirm';
import '../../checkbox';
import '../../radioButton';
import '../widgetGridstack';
import '../widget';
import '../widgetDragHandle';
import '../../card';
import '../../modal';
import '../../fileUploader/fileUploader.sample';
import { GridStack } from 'gridstack';

type Breakpoint = 'max' | 'xl' | 'lg' | 'md' | 'sm';

const colorSwatchArr = [
  'linear-gradient(180deg, #2F808C 0%, var(--kd-color-background-page-default, #1D2125) 100%)',
  'linear-gradient(180deg, #FF462D 0%, var(--kd-color-background-page-default, #1D2125) 100%)',
  'linear-gradient(180deg, #4CDD84 0%, var(--kd-color-background-page-default, #1D2125) 100%)',
  'linear-gradient(180deg, #101316 0%, var(--kd-color-background-page-default, #1D2125) 100%)',
  'linear-gradient(180deg, #5FBEAC 0%, var(--kd-color-background-page-default, #1D2125) 100%)',
  'linear-gradient(180deg, #E8BA02 0%, var(--kd-colo-background-page-default, #1D2125) 100%)',
];

/**
 * New Widget sample.
 */
@customElement('new-widget-sample')
export class NewWidgetSample extends LitElement {
  static override styles = Styles;

  @state()
  private grid?: GridStack;

  private _handleInit(e: any) {
    e.detail.gridStack.setupDragIn(
      this.shadowRoot?.querySelectorAll('.new-widget'),
      {
        appendTo: 'body',
        helper: 'clone',
      }
    );
    this.grid = e.detail.grid;
    this.grid?.on('added', (_: any, items: any[]) => {
      const breakpoints: Breakpoint[] = ['max', 'xl', 'lg', 'md', 'sm'];
      items.forEach((item) => {
        const widgetEl = item.el;
        const widgetId = widgetEl.getAttribute('gs-id');
        const overflowMenu = widgetEl.querySelector('kyn-overflow-menu');
        if (
          overflowMenu &&
          overflowMenu.classList.contains('overflowmenu_hidden')
        ) {
          overflowMenu.classList.remove('overflowmenu_hidden');
        }
        const contentItemEls = widgetEl.querySelectorAll('.content_item');
        contentItemEls.forEach((el: any) => {
          el.classList.remove('content_item');
        });
        const savedData = this.grid?.save(false);
        const newWidgetData = Array.isArray(savedData)
          ? savedData.find((w: any) => w.id === widgetId)
          : undefined;
        if (newWidgetData) {
          const existingLayout = { ...this.updateLayout };
          breakpoints.forEach((bp) => {
            const existingBreakpoint = existingLayout[bp] || [];
            const cloneLayout = { ...existingBreakpoint[0], id: widgetId };
            existingLayout[bp] = [...existingBreakpoint, cloneLayout];
          });
          this.updateLayout = existingLayout;
        }
      });
    });
  }

  @state()
  items = [
    {
      id: 1,
      name: 'My Dashboard',
      favourite: true,
    },
    {
      id: 2,
      name: 'My Dashboard',
      favourite: false,
    },
    {
      id: 3,
      name: 'My Dashboard',
      favourite: false,
    },
    {
      id: 4,
      name: 'My Dashboard',
      favourite: false,
    },
    {
      id: 5,
      name: 'My Dashboard',
      favourite: false,
    },
    {
      id: 6,
      name: 'My Dashboard',
      favourite: false,
    },
    {
      id: 7,
      name: 'My Dashboard',
      favourite: false,
    },
    {
      id: 8,
      name: 'My Dashboard',
      favourite: false,
    },
  ];

  @state()
  widgetItems = [
    {
      id: 'w3',
      name: 'Widget Title',
      content: 'Some Description text here...',
      iconName: rolesIcon,
    },
    {
      id: 'w4',
      name: 'Widget Title',
      content: 'Some Description text here...',
      iconName: appsDataIcon,
    },
    {
      id: 'w5',
      name: 'Widget Title',
      content: 'Some Description text here...',
      iconName: securityIcon,
    },
    {
      id: 'w6',
      name: 'Widget Title',
      content: 'Some Description text here...',
      iconName: trackIcon,
    },
    {
      id: 'w7',
      name: 'Widget Title',
      content: 'Some Description text here...',
      iconName: boxStackedIcon,
    },
    {
      id: 'w8',
      name: 'Widget Title',
      content: 'Some Description text here...',
      iconName: templateIcon,
    },
  ];

  @state()
  selectedTabId = 'widgets';

  @state()
  showFilter = false;

  @state()
  addNewDashboard = false;

  @state()
  showFileUploader = false;

  @state()
  showBundles = false;

  @state()
  showCreateBundles = false;

  @state()
  displayTwoPerRow = false;

  @state()
  updateLayout = SampleLayout;

  @state()
  formattedColorSwatches = colorSwatchArr.map((color) => ({
    color: color,
    selected: false,
  }));

  override render() {
    const modifiedConfig = {
      ...Config,
      acceptWidgets: (el: any) => {
        const widgetId = el.getAttribute('gs-id');
        const exists = this.grid?.engine.nodes.some(
          (node) => node.id === widgetId // limit duplicate id's being added
        );
        return !exists;
      },
    };

    const submitBtnText =
      this.selectedTabId === 'widgets' && this.showFilter
        ? 'Apply(1)'
        : this.selectedTabId === 'admin' && this.showCreateBundles
        ? 'Create'
        : this.selectedTabId === 'admin' && this.showBundles
        ? 'Create New Bundle'
        : (this.selectedTabId === 'dashboards' && this.addNewDashboard) ||
          (this.selectedTabId === 'settings' && this.showFileUploader)
        ? 'Save'
        : 'Add Dashboard';

    const showSecondaryButton =
      (this.selectedTabId === 'widgets' && this.showFilter) ||
      (this.selectedTabId === 'dashboards' && this.addNewDashboard) ||
      (this.selectedTabId === 'settings' && this.showFileUploader) ||
      (this.selectedTabId === 'admin' && this.showBundles) ||
      (this.selectedTabId === 'admin' && this.showCreateBundles);

    const secondaryButtonText =
      (this.selectedTabId === 'dashboards' && this.addNewDashboard) ||
      (this.selectedTabId === 'settings' && this.showFileUploader)
        ? 'Cancel'
        : (this.selectedTabId === 'admin' && this.showBundles) ||
          (this.selectedTabId === 'admin' && this.showCreateBundles)
        ? 'Go Back'
        : 'Reset All';

    return html`
      <kyn-side-drawer
        style="float:right"
        ?open=${false}
        size="standard"
        titleText="Dashboard Manager"
        hideCancelButton
        ?showSecondaryButton=${showSecondaryButton}
        submitBtnText=${submitBtnText}
        secondaryButtonText=${secondaryButtonText}
        noBackdrop
        @on-close=${(e: any) => action(e.type)(e)}
        @on-open=${(e: any) => action(e.type)(e)}
        .beforeClose=${(returnValue: any) =>
          this.handleBeforeClose(returnValue)}
        ?hideFooter=${this.getHideFooter()}
      >
        <kyn-button slot="anchor">Add Widget</kyn-button>
        <kyn-tabs
          style="height: 100%;"
          tabSize="sm"
          scrollablePanels
          tabStyle="line"
          @on-change=${this.handleTabSelected()}
        >
          <kyn-tab slot="tabs" id="widgets" selected> Widgets </kyn-tab>
          <kyn-tab slot="tabs" id="dashboards"> Dashboards </kyn-tab>
          <kyn-tab slot="tabs" id="settings"> Settings </kyn-tab>
          <kyn-tab slot="tabs" id="admin"> Admin </kyn-tab>
          <kyn-tab-panel tabId="widgets" visible>
            ${this.showFilter
              ? this.getFilterSortTemplate()
              : html`
                  <div>
                    <div class="dashboard-wrapper">
                      <kyn-page-title
                        type="tertiary"
                        pageTitle="Add widgets to your Dashboard"
                        subTitle="Drag widgets to your dashboard. Some widgets have predefined sizing depending on the type of content"
                      >
                      </kyn-page-title>
                      <div class="content-content">
                        <kyn-button
                          kind="outline"
                          size="small"
                          description="list"
                          @on-click=${() => this.toggleList()}
                        >
                          <span style="display:flex;" slot="icon"
                            >${unsafeSVG(listIcon)}</span
                          >
                        </kyn-button>
                        <div class="content-items">
                          <kyn-search
                            name="search"
                            label="Search..."
                            value=""
                            size="sm"
                            expandable
                            expandablesearchbtndescription="Expandable search button"
                          ></kyn-search>
                          <kyn-button
                            slot="anchor"
                            kind="outline"
                            size="small"
                            @on-click=${(e: any) => this.handleFilterClick(e)}
                          >
                            <span style="display:flex;" slot="icon"
                              >${unsafeSVG(filterIcon)}</span
                            ></kyn-button
                          >
                        </div>
                      </div>
                    </div>
                    ${this.displayTwoPerRow
                      ? this.handleListDisplay(this.widgetItems, 2).map(
                          (row) => html`
                            <div class="widget-row">
                              ${row.map((item: any) =>
                                this.getWidgetTemplate(item, false)
                              )}
                            </div>
                          `
                        )
                      : html`
                          <div class="widget-column">
                            ${this.widgetItems.map((item) => {
                              return this.getWidgetTemplate(item, true);
                            })}
                          </div>
                        `}
                  </div>
                `}
          </kyn-tab-panel>
          <kyn-tab-panel tabId="dashboards">
            <div class="dashboard-wrapper">
              <kyn-page-title
                type="tertiary"
                pageTitle="Dashboards"
                subTitle="Add, edit, reorder, and select a default dashboard"
              >
              </kyn-page-title>
              ${this.addNewDashboard
                ? html` <div class="new-dashboard">
                    <div class="bg_title">Add a new Dashboard</div>
                    <kyn-text-input
                      type="text"
                      size="md"
                      name="textInput"
                      value=""
                      placeholder="Enter Dashboard Name"
                      caption=""
                      invalidtext=""
                      label=""
                    >
                    </kyn-text-input>
                  </div>`
                : this.getDashboardTemplate()}
            </div>
          </kyn-tab-panel>
          <kyn-tab-panel tabId="settings">
            <div class="dashboard-wrapper">
              <kyn-page-title
                type="tertiary"
                pageTitle="Settings"
                subTitle="Change the background image or color"
              >
              </kyn-page-title>
              <div class="visual-customizer">
                <div class="bacground-image">
                  <div class="bg_title">Background Image</div>
                  ${this.showFileUploader
                    ? html`
                        <div style="width:100%">
                          <sample-file-uploader multiple></sample-file-uploader>
                        </div>
                      `
                    : this.getImageBackgroundTemplate()}
                </div>

                ${!this.showFileUploader
                  ? html`
                      <div class="bacground-image">
                        <div class="bg_title">Background Color</div>
                        <div class="color-swatch">
                          ${this.formattedColorSwatches.map((color) => {
                            return html`
                              <button
                                class="preset-button"
                                style="background:${color.color};"
                                type="button"
                                aria-label="Background Color"
                                title="Background Color"
                                name="Background Color"
                                @click=${(e: Event) =>
                                  this._handleSelection(e, color.color)}
                              >
                                ${color.selected
                                  ? html`<span style="display:flex"
                                      >${unsafeSVG(CheckMarkFilledIcon)}</span
                                    >`
                                  : null}
                              </button>
                            `;
                          })}
                        </div>
                      </div>
                    `
                  : null}
              </div>
            </div>
          </kyn-tab-panel>
          <kyn-tab-panel tabId="admin">
            <div class="dashboard-wrapper">
              ${this.showCreateBundles
                ? this.getCreateNewBundleTemplate()
                : this.showBundles
                ? this.getBundleTemplate()
                : this.getAdminTemplate()}
            </div>
          </kyn-tab-panel>
        </kyn-tabs>
      </kyn-side-drawer>
      <br />
      <br />
      <br />
      <kyn-widget-gridstack
        .layout=${this.updateLayout}
        .gridstackConfig=${modifiedConfig}
        @on-grid-init=${(e: any) => this._handleInit(e)}
        @on-grid-save=${(e: any) => action(e.type)(e)}
      >
        <div class="grid-stack">
          ${Array(2)
            .fill(null)
            .map((_, i) => {
              const widgetId = `w${i + 1}`;
              return html`
                <div gs-id="${widgetId}" class="grid-stack-item">
                  <div class="grid-stack-item-content">
                    <kyn-widget widgetTitle="Widget Title" subTitle="">
                      <kyn-widget-drag-handle></kyn-widget-drag-handle>
                      <kyn-overflow-menu
                        slot="actions"
                        anchorRight
                        verticalDots
                      >
                        <kyn-overflow-menu-item destructive
                          >Delete</kyn-overflow-menu-item
                        >
                      </kyn-overflow-menu>
                      <div class="test">Widget Content</div>
                    </kyn-widget>
                  </div>
                </div>
              `;
            })}
        </div>
      </kyn-widget-gridstack>
    `;
  }

  handleListDisplay(items: any, size: number) {
    const list = [];
    for (let i = 0; i < items.length; i += size) {
      list.push(items.slice(i, i + size));
    }
    return list;
  }

  async toggleList() {
    this.displayTwoPerRow = !this.displayTwoPerRow;
    await this.updateComplete;
    setTimeout(() => {
      const gridStackElement = this.shadowRoot?.querySelector(
        'kyn-widget-gridstack'
      );
      if (gridStackElement && gridStackElement.gridStack) {
        const draggableElements =
          this.shadowRoot?.querySelectorAll('.new-widget');
        gridStackElement.gridStack.setupDragIn(draggableElements, {
          appendTo: 'body',
          helper: 'clone',
        });
      }
    }, 0);
  }

  private getCreateNewBundleTemplate() {
    return html`<kyn-page-title
        type="tertiary"
        pageTitle="Create and Edit New Bundles"
        subTitle="Assign a name and Widgets of the bundle"
      >
      </kyn-page-title>
      <div class="new-dashboard">
        <div class="bg_title">Create a Bundle Name</div>
        <kyn-text-input
          type="text"
          size="md"
          name="textInput"
          value=""
          placeholder="Enter Bundle Name"
          caption=""
          invalidtext=""
          label=""
        >
        </kyn-text-input>
        <div class="bg_title" style="margin-bottom: 32px;">
          Select the Widgets that are part of this bundle
        </div>
        <div>
          <div class="dashboard-wrapper">
            <div class="content-content">
              <kyn-button
                kind="outline"
                size="small"
                description="list"
                @on-click=${() => this.toggleList()}
              >
                <span style="display:flex;" slot="icon"
                  >${unsafeSVG(listIcon)}</span
                >
              </kyn-button>
              <div class="content-items">
                <kyn-search
                  name="search"
                  label="Search..."
                  value=""
                  size="sm"
                  expandable
                  expandablesearchbtndescription="Expandable search button"
                ></kyn-search>
                <kyn-button
                  slot="anchor"
                  kind="outline"
                  size="small"
                  @on-click=${(e: any) => this.handleFilterClick(e)}
                >
                  <span style="display:flex;" slot="icon"
                    >${unsafeSVG(filterIcon)}</span
                  ></kyn-button
                >
              </div>
            </div>
          </div>
          ${this.displayTwoPerRow
            ? this.handleListDisplay(this.widgetItems, 2).map(
                (row) => html`
                  <div class="widget-row">
                    ${row.map((item: any) =>
                      this.getWidgetTemplate(item, false, 'admin')
                    )}
                  </div>
                `
              )
            : html`
                <div class="widget-column">
                  ${this.widgetItems.map((item) => {
                    return this.getWidgetTemplate(item, true, 'admin');
                  })}
                </div>
              `}
        </div>
      </div>`;
  }

  private getWidgetTemplate(
    item: any,
    contentShown = true,
    type = 'dashboard'
  ) {
    return html`
      <div
        class="grid-stack-item ${type === 'dashboard' ? 'new-widget' : ''}"
        gs-id="${item.id}"
      >
        <div class="grid-stack-item-content">
          <kyn-widget widgetTitle=${item.name} subTitle="">
            ${type === 'dashboard'
              ? html` <kyn-widget-drag-handle></kyn-widget-drag-handle>`
              : null}
            <kyn-overflow-menu
              class="overflowmenu_hidden"
              slot="actions"
              anchorRight
              verticalDots
            >
              <kyn-overflow-menu-item destructive
                >Delete</kyn-overflow-menu-item
              >
            </kyn-overflow-menu>
            <div
              class="test widget-content ${contentShown
                ? 'widget-content-wdDescription'
                : ''}"
            >
              <div slot="icon">${unsafeSVG(item.iconName)}</div>
              <div
                class="widget-content-description ${!contentShown
                  ? 'content_item'
                  : ''}"
              >
                ${item.content}
              </div>
            </div>
          </kyn-widget>
        </div>
      </div>
    `;
  }

  private getFilterSortTemplate() {
    return html` <div class="dashboard-wrapper">
      <div class="bacground-image">
        <kyn-page-title
          type="tertiary"
          pageTitle="Filter & Sort Results"
          subTitle=""
        >
        </kyn-page-title>
        <div class="bacground-image">
          <kyn-radio-button value="1" checked>
            Alphabetically (A-Z)</kyn-radio-button
          >
          <kyn-radio-button value="2"> Alphabetically (Z-A) </kyn-radio-button>
        </div>
      </div>
      <div class="bacground-image">
        <kyn-page-title type="tertiary" pageTitle="Applications" subTitle="">
        </kyn-page-title>
        <div class="bacground-image">
          <kyn-checkbox value="1">
            Kyndryl IT Support Services (0)</kyn-checkbox
          >
          <kyn-checkbox value="2">
            Kyndryl Modern Device Management Services (1)</kyn-checkbox
          >
          <kyn-checkbox value="3"> Common Discovery (0)</kyn-checkbox>
        </div>
      </div>
      <div class="bacground-image">
        <kyn-page-title type="tertiary" pageTitle="Bundles" subTitle="">
        </kyn-page-title>
        <div class="bacground-image">
          <kyn-checkbox value="1"
            >Kyndryl IT Support Services Call Logs (0)</kyn-checkbox
          >
          <kyn-checkbox value="2"
            >Kyndryl Modern Device Management Services (1)</kyn-checkbox
          >
        </div>
      </div>
    </div>`;
  }

  private getAdminTemplate() {
    return html`<kyn-page-title
        type="tertiary"
        pageTitle="Administer Widgets"
        subTitle="This is a place to perform additional tasks on the dashboard"
      >
      </kyn-page-title>
      <kyn-button
        style="width:100%"
        kind="tertiary"
        @on-click=${this.handleBundleClick}
      >
        Bundles
        <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
      </kyn-button>`;
  }

  private getBundleTemplate() {
    return html`
      <kyn-page-title
        type="tertiary"
        pageTitle="Bundles"
        subTitle="This is a place to perform additional tasks on the dashboard"
      >
      </kyn-page-title>
      <div class="content-wrapper">
        ${Array(3)
          .fill(null)
          .map((_, i) => {
            return html`
              <kyn-card
                type="normal"
                role="article"
                aria-label="card content"
                style="width:100%"
              >
                <div class="content-container">
                  <div class="content-items">
                    <div class="content-items">Bundle ${i + 1}</div>
                  </div>
                  <div class="content-item">
                    <kyn-modal
                      size="auto"
                      titletext="Delete Dashboard"
                      labeltext=""
                      oktext="OK"
                      canceltext="Cancel"
                      closetext="Close"
                      destructive
                      secondarybuttontext="Secondary"
                    >
                      <kyn-button slot="anchor" kind="ghost" size="small">
                        <span slot="icon">${unsafeSVG(deleteIcon)}</span>
                      </kyn-button>

                      Are you sure you want to delete "Bundle ${i + 1}"?
                    </kyn-modal>
                    <kyn-button
                      kind="ghost"
                      size="small"
                      description="edit"
                      @on-click=${(e: any) => action(e.type)(e)}
                    >
                      <span style="display:flex;" slot="icon"
                        >${unsafeSVG(editIcon)}</span
                      >
                    </kyn-button>
                  </div>
                </div>
              </kyn-card>
            `;
          })}
      </div>
    `;
  }

  private getDashboardTemplate() {
    return html`
      <div class="content-wrapper">
        ${this.items.map((item, i) => {
          return html`
            <kyn-card
              type="normal"
              role="article"
              aria-label="card content"
              style="width:100%"
            >
              <div class="content-container">
                <div class="content-items">
                  <div class="content-item">
                    <kyn-button
                      kind="ghost"
                      size="small"
                      description="reorder"
                      @on-click=${(e: any) => action(e.type)(e)}
                    >
                      <span style="display:flex;" slot="icon"
                        >${unsafeSVG(splitIcon)}</span
                      >
                    </kyn-button>
                    <kyn-button
                      kind="ghost"
                      size="small"
                      description="recommended"
                      @on-click=${(e: any) => this.handleRecommendClick(e, i)}
                    >
                      <span
                        class=${item.favourite ? 'star-filled' : ''}
                        style="display:flex;"
                        slot="icon"
                      >
                        ${unsafeSVG(
                          item.favourite ? recommendFilledIcon : recommendIcon
                        )}
                      </span>
                    </kyn-button>
                  </div>
                  <div class="content-items">${item.name}</div>
                </div>
                <div class="content-item">
                  <kyn-modal
                    size="auto"
                    titletext="Delete Dashboard"
                    labeltext=""
                    oktext="OK"
                    canceltext="Cancel"
                    closetext="Close"
                    destructive
                    secondarybuttontext="Secondary"
                  >
                    <kyn-button slot="anchor" kind="ghost" size="small">
                      <span slot="icon">${unsafeSVG(deleteIcon)}</span>
                    </kyn-button>

                    Are you sure you want to delete "My dashboard"?
                  </kyn-modal>
                  <kyn-button
                    kind="ghost"
                    size="small"
                    description="edit"
                    @on-click=${(e: any) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(editIcon)}</span
                    >
                  </kyn-button>
                </div>
              </div>
            </kyn-card>
          `;
        })}
      </div>
    `;
  }
  private getImageBackgroundTemplate() {
    return html`
      <div class="image-grid">
        <div class="image-row">
          <img
            class="image-content"
            src="/visuals/VisualSelector.png"
            alt="Logo"
          />
          <img
            class="image-content"
            src="/visuals/VisualSelector1.png"
            alt="Logo"
          />
        </div>
        <div class="image-row">
          <img
            class="image-content"
            src="/visuals/VisualSelector2.png"
            alt="Logo"
          />
          <img
            class="image-content"
            src="/visuals/VisualSelector3.png"
            alt="Logo"
          />
        </div>
      </div>
      <kyn-button
        style="width:100%"
        slot="anchor"
        kind="secondary"
        type="button"
        size="medium"
        @on-click=${(e: any) => this.handleUploadImageClick(e)}
        >Upload Image</kyn-button
      >
    `;
  }

  private handleRecommendClick(e: any, index: number) {
    const updatedItems = [...this.items].map((item, i) => ({
      ...item,
      favourite: i === index,
    }));
    this.items = updatedItems;
    action(e.type)(e);
  }

  private handleTabSelected() {
    return (e: any) => {
      this.selectedTabId = e.detail.selectedTabId;
      this.showFilter = false;
      this.addNewDashboard = false;
      this.showFileUploader = false;
      this.showBundles = false;
      this.showCreateBundles = false;
      action(e.type)(e);
    };
  }

  private getHideFooter() {
    return (
      !this.selectedTabId ||
      (this.selectedTabId === 'widgets' && !this.showFilter) ||
      (this.selectedTabId === 'settings' && !this.showFileUploader) ||
      (this.selectedTabId === 'admin' &&
        !this.showBundles &&
        !this.showCreateBundles)
    );
  }

  private handleBeforeClose(returnValue: any) {
    if (returnValue === 'ok' || returnValue === 'secondary') {
      switch (this.selectedTabId) {
        case 'widgets':
          this.showFilter = !this.showFilter;
          break;
        case 'dashboards':
          this.addNewDashboard = !this.addNewDashboard;
          break;
        case 'settings':
          this.showFileUploader = !this.showFileUploader;
          break;
        case 'admin':
          if (returnValue === 'ok') {
            this.showCreateBundles = !this.showCreateBundles;
            this.showBundles = !this.showBundles;
          }
          if (returnValue === 'secondary') {
            if (this.showCreateBundles) {
              this.showCreateBundles = false;
              this.showBundles = true;
            } else {
              this.showBundles = !this.showBundles;
            }
          }
          break;
      }
      return false;
    } else {
      this.showFilter = false;
      this.addNewDashboard = false;
      this.showFileUploader = false;
      this.showBundles = false;
      this.showCreateBundles = false;
      return true;
    }
  }

  private handleFilterClick(e: any) {
    this.showFilter = !this.showFilter;
    action(e.type)(e);
  }

  private handleUploadImageClick(e: any) {
    this.showFileUploader = !this.showFileUploader;
    action(e.type)(e);
  }

  private _handleSelection(e: Event, colorSelected: string) {
    const button = e.target as HTMLButtonElement;
    const isSelected = button.classList.contains('selected');
    this.formattedColorSwatches = this.formattedColorSwatches.map((color) => {
      return {
        ...color,
        selected: color.color === colorSelected ? !isSelected : false,
      };
    });
    const event = new CustomEvent('on-click', {
      detail: { value: colorSelected, origEvent: e },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private handleBundleClick(e: any) {
    this.showBundles = !this.showBundles;
    action(e.type)(e);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-widget-sample': NewWidgetSample;
  }
}
