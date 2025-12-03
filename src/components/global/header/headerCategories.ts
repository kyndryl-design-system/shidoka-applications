import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  LitElement,
  html,
  unsafeCSS,
  PropertyValueMap,
  TemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './headerCategories.scss?inline';

import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

export interface HeaderCategoryLinkType {
  label: string;
  href?: string;
}

export interface HeaderCategoryType {
  id: string;
  heading: string;
  links: HeaderCategoryLinkType[];
}

export interface MegaTabConfig {
  categories: HeaderCategoryType[];
}

export type MegaTabsConfig = Record<string, MegaTabConfig>;

export interface HeaderMegaChangeDetail {
  activeMegaTabId: string;
  activeMegaCategoryId: string | null;
}

/**
 * Hook for rendering the *entire* link content that goes into <kyn-header-link>.
 * Consumers can override this to change icon/text/badge/etc per link.
 */
export type HeaderMegaLinkRenderer = (
  link: HeaderCategoryLinkType,
  context?: { tabId: string; categoryId: string; view: 'detail' | 'root' }
) => TemplateResult | null;

/**
 * Header categories wrapper for mega menu.
 * Controlled via `activeMegaTabId` / `activeMegaCategoryId` but
 * encapsulates all mega-nav view behavior (root/detail, "More", "Back").
 *
 * Emits `on-nav-change` so parents can mirror state for tabs, routing, etc.
 */
@customElement('kyn-header-categories')
export class HeaderCategories extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Configuration object for the mega nav (tab id -> categories/links). */
  @property({ attribute: false })
  accessor tabsConfig: MegaTabsConfig | null = null;

  /** Currently active tab id. */
  @property({ type: String })
  accessor activeMegaTabId = '';

  /** Currently active category id in detail view, or null for root view (controlled). */
  @property({ type: String })
  accessor activeMegaCategoryId: string | null = null;

  /** Max number of links to render in root columns before showing "More". */
  @property({ type: Number })
  accessor maxRootLinks = 4;

  /** Number of links per column in the detail view. */
  @property({ type: Number })
  accessor detailLinksPerColumn = 6;

  /**
   * Current visual view for styling ('root' | 'detail').
   * Derived from `activeMegaCategoryId` but reflected for CSS hooks.
   */
  @property({ type: String, reflect: true })
  accessor view: 'root' | 'detail' = 'root';

  /**
   * Optional hook to render the entire link content slotted into <kyn-header-link>.
   * If not provided, a simple circle-icon + label placeholder is used.
   */
  @property({ attribute: false })
  accessor linkRenderer: HeaderMegaLinkRenderer | null = null;

  private readonly _boundHandleNavToggle = (e: Event) =>
    this._handleNavToggle(e as CustomEvent<{ open?: boolean }>);

  private chunkBy<T>(items: T[] | undefined, size: number): T[][] {
    if (!items || size <= 0) return [[]];
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }

  private _emitChange(): void {
    const detail: HeaderMegaChangeDetail = {
      activeMegaTabId: this.activeMegaTabId,
      activeMegaCategoryId: this.activeMegaCategoryId,
    };

    this.dispatchEvent(
      new CustomEvent<HeaderMegaChangeDetail>('on-nav-change', {
        detail,
        composed: true,
        bubbles: true,
      })
    );
  }

  /**
   * Public API to force root view for a given tab.
   * Consumer can call via element ref if needed.
   */
  setRootView(tabId?: string): void {
    this.activeMegaTabId = tabId ?? this.activeMegaTabId;
    this.activeMegaCategoryId = null;
    this._emitChange();
  }

  openCategoryDetail(tabId: string, categoryId: string, e?: Event): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.activeMegaTabId = tabId;
    this.activeMegaCategoryId = categoryId;
    this._emitChange();
  }

  handleBackClick(e?: Event): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setRootView(this.activeMegaTabId);
  }

  private _handleNavToggle(e: CustomEvent<{ open?: boolean }>): void {
    if (e.detail?.open) {
      // When the nav opens, always reset to root view.
      this.setRootView(this.activeMegaTabId);
    }
  }

  override updated(changed: PropertyValueMap<this>): void {
    if (changed.has('activeMegaCategoryId') || changed.has('activeMegaTabId')) {
      const nextView: 'root' | 'detail' =
        this.activeMegaCategoryId == null ? 'root' : 'detail';
      if (this.view !== nextView) {
        this.view = nextView;
      }
    }
  }

  override render() {
    const view = this.view;

    const inner = this.tabsConfig
      ? view === 'root'
        ? this.renderRootView()
        : this.renderDetailView()
      : html`<slot class="header-categories__slot"></slot>`; // manual HTML mode

    return html`
      <div class="header-categories" data-view=${view}>
        <div class="header-categories__inner">${inner}</div>

        ${view === 'detail'
          ? html`
              <div class="header-categories__back-slot">
                <kyn-button
                  size="small"
                  kind="tertiary"
                  @click=${(e: Event) => this.handleBackClick(e)}
                  style="display: inline-flex; align-items: center;"
                >
                  <span
                    style="display: inline-flex; align-items: center; margin-right: 8px;"
                  >
                    ${unsafeSVG(arrowLeftIcon)}
                  </span>
                  Back
                </kyn-button>
              </div>
            `
          : null}
      </div>
    `;
  }

  private get _tabConfig(): MegaTabConfig | null {
    if (!this.tabsConfig) return null;
    return this.tabsConfig[this.activeMegaTabId] ?? null;
  }

  private renderRootView() {
    const categories: HeaderCategoryType[] = this._tabConfig?.categories ?? [];

    return html`${categories.map((category) =>
      this.renderCategoryColumn(this.activeMegaTabId, category)
    )}`;
  }

  private renderLinkContent(
    link: HeaderCategoryLinkType,
    ctx: { tabId: string; categoryId: string; view: 'root' | 'detail' }
  ): TemplateResult {
    if (this.linkRenderer) {
      const result = this.linkRenderer(link, ctx);
      return result ?? html``;
    }

    // Default placeholder: circle icon + label, for simple JSON configs.
    return html`
      <span>${unsafeSVG(circleIcon)}</span>
      ${link.label}
    `;
  }

  private renderCategoryColumn(tabId: string, category: HeaderCategoryType) {
    if (!category) return null;

    const links = category.links ?? [];

    return html`
      <kyn-header-category heading=${category.heading}>
        ${links.slice(0, this.maxRootLinks).map(
          (link) => html`
            <kyn-header-link href=${link.href ?? 'javascript:void(0)'}>
              ${this.renderLinkContent(link, {
                tabId,
                categoryId: category.id,
                view: 'root',
              })}
            </kyn-header-link>
          `
        )}
        ${links.length > this.maxRootLinks
          ? html`
              <kyn-header-link
                href="javascript:void(0)"
                @click=${(e: Event) =>
                  this.openCategoryDetail(tabId, category.id, e)}
              >
                <span style="margin-right: 8px;">
                  ${unsafeSVG(chevronRightIcon)}
                </span>
                <span>More</span>
              </kyn-header-link>
            `
          : null}
      </kyn-header-category>
    `;
  }

  private renderDetailView() {
    const categories: HeaderCategoryType[] = this._tabConfig?.categories ?? [];
    const category =
      categories.find((cat) => cat.id === this.activeMegaCategoryId) ??
      categories[0];

    if (!category) return null;

    const linkColumns = this.chunkBy(
      category.links ?? [],
      this.detailLinksPerColumn
    );

    return html`
      <kyn-header-category heading=${`${category.heading} – More`}>
        <div
          class="header-detail-columns"
          style="display: flex; align-items: flex-start; gap: 0 32px;"
        >
          ${linkColumns.map(
            (column) => html`
              <div>
                ${column.map(
                  (link) => html`
                    <kyn-header-link href=${link.href ?? 'javascript:void(0)'}>
                      ${this.renderLinkContent(link, {
                        tabId: this.activeMegaTabId,
                        categoryId: category.id,
                        view: 'detail',
                      })}
                    </kyn-header-link>
                  `
                )}
              </div>
            `
          )}
        </div>
      </kyn-header-category>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );
  }

  override disconnectedCallback(): void {
    this.removeEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-categories': HeaderCategories;
  }
}
