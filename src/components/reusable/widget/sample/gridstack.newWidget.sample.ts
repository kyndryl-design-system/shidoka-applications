import { LitElement, html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { customElement } from 'lit/decorators.js';
import { Config } from '../../../../common/helpers/gridstack';
import sampleLayout from './newlayout.sample';
import { action } from '@storybook/addon-actions';
import '../index';
import '@kyndryl-design-system/shidoka-charts/components/chart';
import Styles from './gridstack.newWidget.scss';
import '../../sideDrawer';
import '../../button';
import '../../tabs';
import '../../pagetitle';
import '../../overflowMenu';
import '../../card';
import '../../inlineConfirm';
import rolesIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/roles.svg';
import listIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/list.svg';
import filterIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/filter.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
import arrowsVerticalIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrows-vertical.svg';
import arrowDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-down.svg';
import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';
import recommendFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';
import recommendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import editIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';
import { WidgetGridstack } from '../widgetGridstack';

/**
 * New Widget sample.
 */
@customElement('new-widget-sample')
export class NewWidgetSample extends LitElement {
  static override styles = Styles;

  items = [
    {
      id: 1,
      name: 'My Dashboard',
      favourite: true,
    },
    {
      id: 2,
      name: 'My Dashboard Test',
      favourite: false,
    },
    {
      id: 3,
      name: 'My Dashboard Test 1',
      favourite: false,
    },
    {
      id: 4,
      name: 'My Dashboard Test 2 ',
      favourite: false,
    },
  ];

  private _handleInit(e: any) {
    e.detail.gridStack.setupDragIn(
      this.shadowRoot?.querySelectorAll('.new-widget'),
      {
        appendTo: 'body',
        helper: 'clone',
      }
    );
  }

  private _handleDeleteWidget(widgetId: string) {
    const gridstackElement = this.shadowRoot?.querySelector(
      'kyn-widget-gridstack'
    ) as WidgetGridstack;

    if (gridstackElement) {
      gridstackElement.removeWidgetById(widgetId);
    } else {
      console.error('GridStack element not found.');
    }
  }

  _getArrowIcon(index: number, totalItems: number) {
    if (index === 0) {
      return arrowDownIcon;
    } else if (index === totalItems - 1) {
      return arrowUpIcon;
    }
    return arrowsVerticalIcon;
  }

  _handleRecommendClick(e: any, index: number) {
    const updatedItems = [...this.items].map((item, i) => ({
      ...item,
      favourite: i === index,
    }));
    this.items = updatedItems;
    this.requestUpdate();
  }

  _handleReorderClick(e: any, index: number) {
    const updatedItems = [...this.items];
    if (index === this.items.length - 1) {
      const temp = updatedItems[index];
      updatedItems[index] = updatedItems[index - 1];
      updatedItems[index - 1] = temp;
    } else {
      const temp = updatedItems[index];
      updatedItems[index] = updatedItems[index + 1];
      updatedItems[index + 1] = temp;
    }
    this.items = updatedItems;
    this.requestUpdate();
  }

  override render() {
    const modifiedConfig = {
      ...Config,
      acceptWidgets: true,
    };

    return html`
      <kyn-side-drawer
        ?open=${false}
        size="standard"
        titleText="Dashboard Manager"
        ?hideFooter=${true}
        noBackdrop
        @on-close=${(e: any) => action(e.type)(e)}
        @on-open=${(e: any) => action(e.type)(e)}
      >
        <kyn-button slot="anchor">+ Widget</kyn-button>
        <kyn-tabs
          style="height: 100%;"
          tabSize="sm"
          scrollablePanels
          tabStyle="line"
          @on-change=${(e: any) => action(e.type)(e)}
        >
          <kyn-tab slot="tabs" id="widgets" selected> Widgets </kyn-tab>
          <kyn-tab slot="tabs" id="dashboards"> Dashboards </kyn-tab>
          <kyn-tab-panel tabId="widgets" visible>
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
                  @on-click=${(e: any) => action(e.type)(e)}
                >
                  <span style="display:flex;" slot="icon"
                    >${unsafeSVG(listIcon)}</span
                  >
                </kyn-button>
                <div class="content-items">
                  <kyn-button
                    kind="outline"
                    size="small"
                    description="search"
                    @on-click=${(e: any) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(searchIcon)}</span
                    >
                  </kyn-button>
                  <kyn-button
                    kind="outline"
                    size="small"
                    description="filter"
                    @on-click=${(e: any) => action(e.type)(e)}
                  >
                    <span style="display:flex;" slot="icon"
                      >${unsafeSVG(filterIcon)}</span
                    >
                  </kyn-button>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column;gap: 16px">
              ${Array(5)
                .fill(null)
                .map((_, i) => {
                  const widgetId = `w${i + 3}`;
                  return html`
                    <div class="grid-stack-item new-widget" gs-id="${widgetId}">
                      <div class="grid-stack-item-content">
                        <kyn-widget
                          widgetTitle="New Widget Title ${i + 3}"
                          subTitle=""
                        >
                          <kyn-widget-drag-handle></kyn-widget-drag-handle>
                          <kyn-button
                            slot="actions"
                            kind="tertiary"
                            size="small"
                            description="External link"
                          >
                            <span slot="icon" style="display:flex"
                              >${unsafeSVG(launchIcon)}</span
                            >
                          </kyn-button>
                          <kyn-overflow-menu
                            class="hidden"
                            slot="actions"
                            anchorRight
                            verticalDots
                          >
                            <kyn-overflow-menu-item destructive
                              >Delete</kyn-overflow-menu-item
                            >
                          </kyn-overflow-menu>
                          <div class="test widget-content">
                            <span style="display:flex;" slot="icon"
                              >${unsafeSVG(rolesIcon)}</span
                            >
                            <div
                              class="kd-type--ui-01"
                              style="font-weight: 500"
                            >
                              Description text
                            </div>
                          </div>
                        </kyn-widget>
                      </div>
                    </div>
                  `;
                })}
            </div>
          </kyn-tab-panel>
          <kyn-tab-panel tabId="dashboards">
            <div class="dashboard-wrapper">
              <kyn-page-title
                type="tertiary"
                pageTitle="Dashboards"
                subTitle="Add, edit, reorder, and select a default dashboard"
              >
              </kyn-page-title>
              <div class="content-wrapper">
                ${this.items.map((item, i) => {
                  const arrowIcon = this._getArrowIcon(i, this.items.length);
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
                              @on-click=${(e: any) =>
                                this._handleReorderClick(e, i)}
                            >
                              <span style="display:flex;" slot="icon"
                                >${unsafeSVG(arrowIcon)}</span
                              >
                            </kyn-button>
                            <kyn-button
                              kind="ghost"
                              size="small"
                              description="recommended"
                              @on-click=${(e: any) =>
                                this._handleRecommendClick(e, i)}
                            >
                              <span
                                class=${item.favourite ? 'star-filled' : ''}
                                style="display:flex;"
                                slot="icon"
                              >
                                ${unsafeSVG(
                                  item.favourite
                                    ? recommendFilledIcon
                                    : recommendIcon
                                )}
                              </span>
                            </kyn-button>
                          </div>
                          <div class="content-items">${item.name}</div>
                        </div>
                        <div class="content-item">
                          <kyn-inline-confirm
                            destructive
                            anchorText="Delete"
                            confirmText="Confirm"
                            cancelText="Cancel"
                            @on-confirm=${(e: any) => action('on-confirm')(e)}
                          >
                            ${unsafeSVG(deleteIcon)}
                            <span slot="confirmIcon"
                              >${unsafeSVG(deleteIcon)}</span
                            >
                          </kyn-inline-confirm>

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
            </div>
          </kyn-tab-panel>
        </kyn-tabs>
      </kyn-side-drawer>

      <br />
      <br />

      <kyn-widget-gridstack
        .layout=${sampleLayout}
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
                    <kyn-widget
                      widgetTitle="Widget${i + 1}"
                      subTitle="Widget Subtitle"
                    >
                      <kyn-widget-drag-handle></kyn-widget-drag-handle>
                      <kyn-button
                        slot="actions"
                        kind="tertiary"
                        size="small"
                        description="External link"
                      >
                        <span slot="icon" style="display:flex"
                          >${unsafeSVG(launchIcon)}</span
                        >
                      </kyn-button>
                      <kyn-overflow-menu
                        slot="actions"
                        anchorRight
                        verticalDots
                      >
                        <kyn-overflow-menu-item
                          destructive
                          @click=${() => this._handleDeleteWidget(widgetId)}
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
}

declare global {
  interface HTMLElementTagNameMap {
    'new-widget-sample': NewWidgetSample;
  }
}
