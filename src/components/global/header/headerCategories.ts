import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { LitElement, html, unsafeCSS, type PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './headerCategories.scss?inline';

import './headerCategory';
import '../../reusable/button/button';
import './headerLink';

import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';
import { ifDefined } from 'lit/directives/if-defined.js';
import { debounce } from '../../../common/helpers/helpers';
import type { HeaderCategory } from './headerCategory';
import type { HeaderLinkTarget } from './headerLink';

const _defaultTextStrings = {
  back: 'Back',
  more: 'More',
};

type HeaderTextStrings = typeof _defaultTextStrings;

export interface HeaderCategoryLinkType {
  id: string;
  label: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export interface HeaderCategoryType {
  id: string;
  heading: string;
  links: HeaderCategoryLinkType[];
}

export interface HeaderLinkRendererContext {
  tabId: string;
  categoryId: string;
  view: 'root' | 'detail';
}

export type HeaderMegaLinkRenderer = (
  link: HeaderCategoryLinkType,
  context?: HeaderLinkRendererContext
) => string | null;

export interface MegaTabConfig {
  categories: HeaderCategoryType[];
}

export interface MegaTabsConfig {
  [tabId: string]: MegaTabConfig;
}

export interface HeaderMegaChangeDetail {
  activeMegaTabId: string;
  activeMegaCategoryId: string | null;
  view: HeaderView;
}

type HeaderView = 'root' | 'detail';

const ROOT_VIEW: HeaderView = 'root';
const DETAIL_VIEW: HeaderView = 'detail';

const VOID_HREF = '#';

/**
 * Pixel tolerance for grouping categories into visual columns.
 * Accounts for sub-pixel rendering differences across browsers.
 */
const COLUMN_GROUPING_TOLERANCE_PX = 10;

interface SlottedCategoryData {
  id: string;
  slotKey: string;
  heading: string;
  categoryEl: HeaderCategory;
  noAutoDivider: boolean;
}

/**
 * Header categories wrapper for mega menu.
 *
 * @slot unnamed - Slot for header category elements.
 *
 * Controlled via `activeMegaTabId` / `activeMegaCategoryId` but encapsulates
 * all categorical/mega-nav view behavior (root/detail, "More", "Back").
 *
 * Emits `on-nav-change` so parents can mirror state for tabs, routing, etc.
 *
 * Modes:
 * - JSON mode
 *   - Provide `tabsConfig` and categories/links are rendered from config.
 *   - Each link may specify `href`, `target`, and `rel`.
 *   - Optional `linkRenderer` hook can be supplied to fully control the
 *     slotted content inside each `<kyn-header-link>`.
 *
 * - Slotted/manual mode
 *   - Omit `tabsConfig` and slot `<kyn-header-category>` / `<kyn-header-link>`
 *     elements directly in the light DOM.
 *   - Slotted `<kyn-header-link>` `href`, `target`, and `rel` attributes are
 *     preserved.
 *   - Root view will:
 *       - limit visible links per category at `maxRootLinks`
 *       - inject a "More" link when there are additional links
 *   - "More" switches to a detail view for that category, and the Back button
 *     returns to the root view.
 *
 * @fires on-nav-change - Fires when the active category/tab view changes. Detail: `{ activeMegaTabId, activeMegaCategoryId, view }`.
 * @cssprop [--kyn-header-category-column-width=300px] - Width of each column. Applies to 1 and 2 column layouts. Also used for 3+ when `fixed-column-widths` is enabled.
 * @cssprop [--kyn-header-category-column-gap=32px] - Horizontal gap between columns.
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

  /** Controls whether root-view categories are limited by `maxRootLinks` before showing "More". */
  @property({ type: Boolean, attribute: 'limit-root-links' })
  accessor limitRootLinks = true;

  /**
   * Layout mode for categories.
   * - "" (default): Legacy responsive column-width layout for standard mega-nav
   * - "masonry": CSS multi-column with fixed column-count based on category count
   * - "grid": CSS Grid with fixed columns and row-based wrapping
   */
  @property({ type: String, reflect: true })
  accessor layout: 'masonry' | 'grid' | '' = '';

  /** Max number of columns to display when layout="grid" or layout="masonry". */
  @property({ type: Number })
  accessor maxColumns = 3;

  /**
   * When true, 3+ columns use fixed column widths instead of stretching to fill
   * the full flyout width. The flyout remains constrained by viewport max-width.
   */
  @property({ type: Boolean, reflect: true, attribute: 'fixed-column-widths' })
  accessor fixedColumnWidths = false;

  /** When true, category headings render with the default design-system icon when none is provided. */
  @property({ type: Boolean, attribute: 'show-category-icons' })
  accessor showCategoryIcons = false;

  /** When true, hide dividers in root-view categories. */
  @property({ type: Boolean, attribute: 'hide-category-dividers' })
  accessor hideCategoryDividers = false;

  /**
   * Optional text overrides, merged with defaults.
   * e.g. <kyn-header-categories .textStrings=${{ more: 'More items' }}>
   */
  @property({ type: Object })
  accessor textStrings: Partial<HeaderTextStrings> | null = null;

  /** Resolved text strings (defaults + overrides).
   * @internal
   */
  @state()
  accessor _textStrings: HeaderTextStrings = _defaultTextStrings;

  /** Number of links per column in the detail view (JSON mode only). */
  @property({ type: Number })
  accessor detailLinksPerColumn = 6;

  /**
   * Current visual view for styling ('root' | 'detail').
   * Derived from `activeMegaCategoryId` but reflected for CSS hooks.
   * @internal
   */
  @property({ type: String, reflect: true })
  accessor view: HeaderView = ROOT_VIEW;

  /**
   * Optional hook to render the entire link content slotted into <kyn-header-link>.
   *
   * IMPORTANT:
   * - This must return an HTML string or null.
   * - The string is rendered via unsafeHTML; consumers are responsible for sanitizing
   *   any dynamic content they inject here.
   *
   * This API is intentionally framework-agnostic: React, Vue, Angular, etc. can all
   * build a string and pass it in.
   *
   * If not provided, a simple circle-icon + label placeholder is used.
   */
  @property({ attribute: false })
  accessor linkRenderer: HeaderMegaLinkRenderer | null = null;

  /** Internal representation of slotted categories
   * @internal
   */
  @state()
  accessor _slottedCategories: SlottedCategoryData[] = [];

  /** @internal */
  private _buildSlottedRaf?: number;

  /** @internal */
  private _resizeObserver?: ResizeObserver;

  /** Owning nav used for scoped on-nav-toggle subscription.
   * @internal
   */
  private _owningNav: HTMLElement | null = null;

  /** Debounced divider update to prevent jank during rapid resize (grid and masonry modes)
   * @internal
   */
  private _debouncedUpdateDividers = debounce((_e: Event) => {
    if (
      this.view === ROOT_VIEW &&
      (this.layout === 'grid' || this.layout === 'masonry')
    ) {
      this._updateDividers();
    }
  }, 100);

  /** Tracks the last emitted column count to avoid duplicate events
   * @internal
   */
  private _lastEmittedColumnCount = 0;

  /** Wrapper for ResizeObserver callback
   * @internal
   */
  private _handleResize = (): void => {
    // Create a synthetic event for the debounced function
    this._debouncedUpdateDividers(new Event('resize'));
    // Category count doesn't change on resize, so no need to re-emit
  };

  /**
   * Update category count and emit event if changed.
   * Emits for grid and masonry layouts so the parent flyout can adjust width.
   * @internal
   */
  private _updateAndEmitColumnCount(): void {
    if (this.layout !== 'grid' && this.layout !== 'masonry') return;

    // Only emit when visible. Multiple kyn-header-categories may exist inside
    // the same flyout (one per tab panel). Without this guard, a hidden tab's
    // smaller column count overwrites the visible tab's count, preventing the
    // flyout from stretching.
    const tabPanel = this.closest('kyn-tab-panel');
    if (tabPanel && !tabPanel.hasAttribute('visible')) return;

    const columnCount = this._getColumnCount();

    if (columnCount !== this._lastEmittedColumnCount) {
      this._lastEmittedColumnCount = columnCount;

      this.dispatchEvent(
        new CustomEvent('on-column-count-change', {
          detail: {
            columnCount,
            fixedColumnWidths: this.fixedColumnWidths,
          },
          composed: true,
          bubbles: true,
        })
      );
    }
  }

  /** @internal */
  private readonly _boundHandleNavToggle = (e: Event): void =>
    this._handleNavToggle(e as CustomEvent<{ open?: boolean }>);

  /** Find the closest owning header nav across shadow boundaries.
   * @internal
   */
  private _resolveOwningNav(): HTMLElement | null {
    const parentNav = this.closest('kyn-header-nav');
    if (parentNav) return parentNav as HTMLElement;

    let root = this.getRootNode();
    while (root instanceof ShadowRoot) {
      const nav = root.host.closest?.('kyn-header-nav');
      if (nav) {
        return nav as HTMLElement;
      }
      root = root.host.getRootNode();
    }

    return null;
  }

  /** @internal */
  private get _isJsonMode(): boolean {
    return this.tabsConfig != null;
  }

  /** @internal */
  private get _tabConfig(): MegaTabConfig | null {
    if (!this.tabsConfig) return null;
    return this.tabsConfig[this.activeMegaTabId] ?? null;
  }

  private chunkBy<T>(items: T[] | undefined, size: number): T[][] {
    if (!items || size <= 0) return [[]];
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }

  private normalizeHeaderLinkTarget(target?: string | null): HeaderLinkTarget {
    if (target === '_blank' || target === '_parent' || target === '_top') {
      return target;
    }
    return '_self';
  }

  /** Resolve max root links. Disabling limiting, or using non-positive values, means "no limit". */
  private get _rootLinksLimit(): number {
    return !this.limitRootLinks || this.maxRootLinks <= 0
      ? Number.POSITIVE_INFINITY
      : this.maxRootLinks;
  }

  private _sanitizeSlotKey(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  private _resolveCategoryId(
    categoryEl: HeaderCategory,
    index: number
  ): string {
    return categoryEl.getAttribute('id')?.trim() || `category-${index + 1}`;
  }

  private _getRootSlotName(category: SlottedCategoryData): string {
    return `manual-root-${category.slotKey}`;
  }

  private _getDetailSlotName(category: SlottedCategoryData): string {
    return `manual-detail-${category.slotKey}`;
  }

  private _getActiveSlottedCategory(): SlottedCategoryData | null {
    if (!this._slottedCategories.length) return null;

    return (
      this._slottedCategories.find((c) => c.id === this.activeMegaCategoryId) ??
      this._slottedCategories[0]
    );
  }

  private _findSlottedCategoryFromEvent(e: Event): SlottedCategoryData | null {
    const categoryEl = e
      .composedPath()
      .find(
        (node): node is HeaderCategory =>
          node instanceof HTMLElement && node.tagName === 'KYN-HEADER-CATEGORY'
      );

    if (!categoryEl) return null;

    return (
      this._slottedCategories.find(
        (category) => category.categoryEl === categoryEl
      ) ?? null
    );
  }

  private _resolveSlottedMoreCategoryId(
    e: CustomEvent<{ categoryId: string }>
  ): string {
    const emittedCategoryId = e.detail.categoryId?.trim();
    if (emittedCategoryId) return emittedCategoryId;

    const categoryFromEvent = this._findSlottedCategoryFromEvent(e);
    if (categoryFromEvent) return categoryFromEvent.id;

    return this.view === DETAIL_VIEW
      ? this.activeMegaCategoryId?.trim() ?? ''
      : '';
  }

  private _syncSlottedCategoryPresentation(): void {
    if (this._isJsonMode) return;

    const activeCategory = this._getActiveSlottedCategory();

    this._slottedCategories.forEach((category) => {
      const { categoryEl, heading, noAutoDivider } = category;
      const isDetailCategory =
        this.view === DETAIL_VIEW && activeCategory?.id === category.id;

      categoryEl.maxVisibleLinks =
        this.view === ROOT_VIEW
          ? this._rootLinksLimit
          : Number.POSITIVE_INFINITY;
      categoryEl.categoryId = category.id;
      categoryEl.moreLabel = this._textStrings.more;
      categoryEl.detailView = isDetailCategory;
      categoryEl.detailHeading = isDetailCategory
        ? `${heading} – ${this._textStrings.more}`
        : '';
      categoryEl.detailLinksPerColumn = this.detailLinksPerColumn;
      categoryEl.slot =
        this.view === ROOT_VIEW
          ? this._getRootSlotName(category)
          : isDetailCategory
          ? this._getDetailSlotName(category)
          : 'manual-hidden';

      if (this.view === ROOT_VIEW && !this.hideCategoryDividers) {
        categoryEl.setAttribute('showdivider', '');

        if (noAutoDivider) {
          categoryEl.setAttribute('noautodivider', '');
        } else {
          categoryEl.removeAttribute('noautodivider');
        }
      } else {
        categoryEl.removeAttribute('showdivider');
        categoryEl.setAttribute('noautodivider', '');
      }
    });
  }

  private _resetSlottedCategoryPresentation(): void {
    this._slottedCategories.forEach(({ categoryEl }) => {
      categoryEl.categoryId = '';
      categoryEl.maxVisibleLinks = Number.POSITIVE_INFINITY;
      categoryEl.detailView = false;
      categoryEl.detailHeading = '';
      categoryEl.removeAttribute('slot');
    });
  }

  private _handleSlottedMoreClick(
    e: CustomEvent<{ categoryId: string }>
  ): void {
    const categoryId = this._resolveSlottedMoreCategoryId(e);

    if (!categoryId) return;

    this.openCategoryDetail(this.activeMegaTabId, categoryId, e);
  }

  private _emitChange(): void {
    const detail: HeaderMegaChangeDetail = {
      activeMegaTabId: this.activeMegaTabId,
      activeMegaCategoryId: this.activeMegaCategoryId,
      view: this.view,
    };

    this.dispatchEvent(
      new CustomEvent<HeaderMegaChangeDetail>('on-nav-change', {
        detail,
        composed: true,
        bubbles: true,
      })
    );
  }

  setRootView(tabId?: string): void {
    this.activeMegaTabId = tabId ?? this.activeMegaTabId;
    this.activeMegaCategoryId = null;
    this.view = ROOT_VIEW;
    this._emitChange();

    if (!this._isJsonMode) {
      this._buildSlottedCategories();
      this._syncSlottedCategoryPresentation();
    }
  }

  openCategoryDetail(tabId: string, categoryId: string, e?: Event): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.activeMegaTabId = tabId;
    this.activeMegaCategoryId = categoryId;
    this.view = DETAIL_VIEW;
    this._emitChange();
    if (!this._isJsonMode) {
      this._buildSlottedCategories();
      this._syncSlottedCategoryPresentation();
    }
  }

  handleBackClick(e?: Event): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setRootView(this.activeMegaTabId);

    this.updateComplete.then(() => {
      const hostLinks = Array.from(
        this.querySelectorAll<HTMLElement>('kyn-header-link')
      );
      const activeLink = hostLinks.find((l) => l.hasAttribute('isactive'));
      if (activeLink && activeLink.focus) {
        activeLink.focus();
      }
    });
  }

  private _handleNavToggle(e: CustomEvent<{ open?: boolean }>): void {
    const isOpen = Boolean(e.detail?.open);

    if (isOpen) {
      if (
        this.view === ROOT_VIEW &&
        (this.layout === 'grid' || this.layout === 'masonry')
      ) {
        // Recompute once visible; hidden measurements can be stale/zero.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.setAttribute('data-columns', String(this._getColumnCount()));
            this._updateDividers();
            this._updateAndEmitColumnCount();
          });
        });
      }
      return;
    }

    if (!isOpen) {
      this.setRootView(this.activeMegaTabId);
    }
  }

  override willUpdate(changed: PropertyValueMap<this>): void {
    if (changed.has('textStrings')) {
      this._textStrings = {
        ..._defaultTextStrings,
        ...(this.textStrings ?? {}),
      };
    }

    if (changed.has('activeMegaCategoryId') || changed.has('activeMegaTabId')) {
      this.view = this.activeMegaCategoryId == null ? ROOT_VIEW : DETAIL_VIEW;
    }

    // Keep data-columns in sync before render so layout CSS has the
    // correct column count on first paint.
    if (this.layout === 'grid' || this.layout === 'masonry') {
      this.setAttribute('data-columns', String(this._getColumnCount()));
    }

    if (!this._isJsonMode) {
      this._syncSlottedCategoryPresentation();
    }
  }

  override updated(_changed: PropertyValueMap<this>): void {
    if (this.layout === 'grid' || this.layout === 'masonry') {
      // Update dividers after render when in root view (grid and masonry modes).
      // Masonry dividers are layout-free (absolute positioned via CSS custom properties)
      // so post-render correction won't cause reflow.
      if (this.view === ROOT_VIEW) {
        // Use double requestAnimationFrame to ensure layout is fully computed
        // The first rAF runs after the browser paints, the second ensures layout reflow is complete
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this._updateDividers());
        });
      }
    }

    // Always emit column count after render (for flyout width adjustment)
    if (this.view === ROOT_VIEW) {
      this._updateAndEmitColumnCount();
    }
  }

  private renderLinkContent(
    link: HeaderCategoryLinkType,
    ctx: HeaderLinkRendererContext
  ) {
    if (this.linkRenderer) {
      const rendered = this.linkRenderer(link, ctx);

      if (typeof rendered === 'string' && rendered.trim().length > 0) {
        return html`${unsafeHTML(rendered)}`;
      }

      if (rendered != null && typeof rendered !== 'string') {
        console.warn(
          '[kyn-header-categories] linkRenderer must return a string or null. ' +
            `Received: ${typeof rendered}`
        );
      }
    }

    return html`${link.label}`;
  }

  private renderCategoryColumn(
    tabId: string,
    category: HeaderCategoryType | undefined
  ) {
    if (!category) return null;

    const links = category.links ?? [];
    const rootLinksLimit = this._rootLinksLimit;

    return html`
      <kyn-header-category
        heading=${category.heading}
        ?showDivider=${!this.hideCategoryDividers}
        ?data-auto-divider=${!this.hideCategoryDividers}
      >
        ${this.showCategoryIcons
          ? html`<span slot="icon">${unsafeSVG(circleIcon)}</span>`
          : null}
        ${links.slice(0, rootLinksLimit).map((link) => {
          const target = this.normalizeHeaderLinkTarget(link.target);
          return html`
            <kyn-header-link
              href=${link.href ?? VOID_HREF}
              target=${target}
              rel=${ifDefined(link.rel)}
              .linkTitle=${link.label}
            >
              ${this.renderLinkContent(link, {
                tabId,
                categoryId: category.id,
                view: ROOT_VIEW,
              })}
            </kyn-header-link>
          `;
        })}
        ${links.length > rootLinksLimit
          ? html`
              <kyn-header-link
                slot="more"
                href=${VOID_HREF}
                @click=${(e: Event) =>
                  this.openCategoryDetail(tabId, category.id, e)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openCategoryDetail(tabId, category.id, e);
                  }
                }}
              >
                <span
                  style="display: inline-flex; align-items: center; gap: 8px;"
                >
                  ${this._textStrings.more} ${unsafeSVG(chevronRightIcon)}
                </span>
              </kyn-header-link>
            `
          : null}
      </kyn-header-category>
    `;
  }

  private renderRootView() {
    const categories: HeaderCategoryType[] = this._tabConfig?.categories ?? [];
    return html`${categories.map((category) =>
      this.renderCategoryColumn(this.activeMegaTabId, category)
    )}`;
  }

  private renderDetailView() {
    const categories: HeaderCategoryType[] = this._tabConfig?.categories ?? [];
    const category =
      categories.find((cat) => cat.id === this.activeMegaCategoryId) ??
      categories[0];

    if (!category) return null;

    const linkColumns = this.computeDetailColumns(category.links);
    const isSingleColumn = linkColumns.length === 1;

    return html`
      <kyn-header-category
        heading=${`${category.heading} – ${this._textStrings.more}`}
      >
        ${this.showCategoryIcons
          ? html`<span slot="icon">${unsafeSVG(circleIcon)}</span>`
          : null}
        <div
          id=${`detail-${category.id}`}
          class="header-detail-columns ${isSingleColumn
            ? 'header-detail-columns--single'
            : ''}"
          role="region"
          aria-label=${`${category.heading} – ${this._textStrings.more}`}
        >
          ${linkColumns.map(
            (column) => html`
              <div>
                ${column.map((link) => {
                  const target = this.normalizeHeaderLinkTarget(link.target);
                  return html`
                    <kyn-header-link
                      href=${link.href ?? VOID_HREF}
                      target=${target}
                      rel=${ifDefined(link.rel)}
                      .linkTitle=${link.label}
                    >
                      ${this.renderLinkContent(link, {
                        tabId: this.activeMegaTabId,
                        categoryId: category.id,
                        view: DETAIL_VIEW,
                      })}
                    </kyn-header-link>
                  `;
                })}
              </div>
            `
          )}
        </div>
      </kyn-header-category>
    `;
  }

  private _buildSlottedCategories(): void {
    if (this._isJsonMode) return;

    const categories = Array.from(this.children).filter(
      (child): child is HeaderCategory =>
        child.tagName === 'KYN-HEADER-CATEGORY'
    );

    if (!categories.length) {
      this._slottedCategories = [];
      return;
    }

    const data = categories.map((categoryEl, index) => {
      const id = this._resolveCategoryId(categoryEl, index);
      const heading = categoryEl.getAttribute('heading') ?? '';

      return {
        id,
        slotKey: `${index + 1}-${this._sanitizeSlotKey(id)}`,
        heading,
        categoryEl,
        noAutoDivider: categoryEl.hasAttribute('noautodivider'),
      } as SlottedCategoryData;
    });

    this._slottedCategories = data;
  }

  private renderSlottedRoot() {
    const categories = this._slottedCategories;
    if (!categories.length) return null;

    return html`${categories.map(
      (category) => html`
        <slot
          class="header-categories__projected"
          name=${this._getRootSlotName(category)}
        ></slot>
      `
    )}`;
  }

  private computeDetailColumns<T>(links: T[] | undefined): T[][] {
    const list = links ?? [];
    if (!list.length) return [];

    const minPerColumn = Math.max(this.detailLinksPerColumn, 1);
    const maxColumns = 4;

    const idealColumns = Math.ceil(list.length / minPerColumn);
    const columnCount = Math.min(maxColumns, Math.max(1, idealColumns));

    const size = Math.ceil(list.length / columnCount);
    return this.chunkBy(list, size);
  }

  private renderSlottedDetail() {
    const categoryItem = this._getActiveSlottedCategory();
    if (!categoryItem) return null;

    return html`
      <div
        id=${`detail-${categoryItem.id}`}
        class="header-detail-category"
        role="region"
        aria-label=${`${categoryItem.heading} – ${this._textStrings.more}`}
      >
        <slot
          class="header-categories__projected"
          name=${this._getDetailSlotName(categoryItem)}
        ></slot>
      </div>
    `;
  }

  private _scheduleBuildSlottedCategories(): void {
    if (typeof window === 'undefined') {
      this._buildSlottedCategories();
      this._syncSlottedCategoryPresentation();
      return;
    }

    if (this._buildSlottedRaf != null) {
      window.cancelAnimationFrame(this._buildSlottedRaf);
    }
    this._buildSlottedRaf = window.requestAnimationFrame(() => {
      this._buildSlottedCategories();
      this._syncSlottedCategoryPresentation();
      this._buildSlottedRaf = undefined;
    });
  }

  /**
   * After render, detect which categories are in the last visual row
   * and disable their dividers. CSS Grid determines row breaks dynamically,
   * so we must inspect rendered positions.
   * @internal
   */
  private _updateDividers(): void {
    if (this.view !== ROOT_VIEW) return;
    if (this.layout !== 'grid' && this.layout !== 'masonry') return;
    if (this.hideCategoryDividers) return;
    const hostRect = this.getBoundingClientRect();
    if (hostRect.width === 0 || hostRect.height === 0) return;

    const inner = this.shadowRoot?.querySelector('.header-categories__inner');
    if (!inner) return;

    const categories = this._isJsonMode
      ? Array.from(
          inner.querySelectorAll<HTMLElement>(
            'kyn-header-category[data-auto-divider]'
          )
        )
      : this._slottedCategories.map(({ categoryEl, noAutoDivider }) => {
          categoryEl.setAttribute('showdivider', '');

          if (noAutoDivider) {
            categoryEl.setAttribute('noautodivider', '');
          } else {
            categoryEl.removeAttribute('noautodivider');
          }

          return categoryEl;
        });

    if (!categories.length) return;

    // Get bounding rects
    const categoryData = categories.map((cat) => ({
      el: cat,
      rect: cat.getBoundingClientRect(),
    }));

    if (this.layout === 'grid') {
      // Grid: group by row (Y-position), hide dividers on the last row
      const rowMap = new Map<number, typeof categoryData>();

      for (const item of categoryData) {
        const y = item.rect.top;
        let foundRow = false;

        for (const [rowY] of rowMap) {
          if (Math.abs(y - rowY) <= COLUMN_GROUPING_TOLERANCE_PX) {
            rowMap.get(rowY)!.push(item);
            foundRow = true;
            break;
          }
        }

        if (!foundRow) {
          rowMap.set(y, [item]);
        }
      }

      let lastRowY = -Infinity;
      for (const [rowY] of rowMap) {
        if (rowY > lastRowY) {
          lastRowY = rowY;
        }
      }

      const lastRowCategories = rowMap.get(lastRowY);
      if (lastRowCategories) {
        for (const item of lastRowCategories) {
          item.el.removeAttribute('showdivider');
          item.el.setAttribute('noautodivider', '');
        }
      }
    } else {
      // Masonry: group by column (X-position), hide dividers on the last item in each column.
      // Masonry dividers are layout-free (absolute positioned via CSS custom properties)
      // so this correction won't cause reflow.
      const colMap = new Map<number, typeof categoryData>();

      for (const item of categoryData) {
        const x = item.rect.left;
        let foundCol = false;

        for (const [colX] of colMap) {
          if (Math.abs(x - colX) <= COLUMN_GROUPING_TOLERANCE_PX) {
            colMap.get(colX)!.push(item);
            foundCol = true;
            break;
          }
        }

        if (!foundCol) {
          colMap.set(x, [item]);
        }
      }

      for (const [, colItems] of colMap) {
        let lastItem = colItems[0];
        for (const item of colItems) {
          if (item.rect.bottom > lastItem.rect.bottom) {
            lastItem = item;
          }
        }
        lastItem.el.removeAttribute('showdivider');
        lastItem.el.setAttribute('noautodivider', '');
      }
    }
  }

  /**
   * Get the number of columns to display (grid and masonry modes).
   * Returns the minimum of category count and maxColumns.
   * @internal
   */
  private _getColumnCount(): number {
    if (
      this.view !== ROOT_VIEW ||
      (this.layout !== 'grid' && this.layout !== 'masonry')
    )
      return 1;

    const categoryCount = this._isJsonMode
      ? this._tabConfig?.categories?.length ?? 0
      : this._slottedCategories.length ||
        this.querySelectorAll(':scope > kyn-header-category').length;

    // Return the minimum of actual category count and maxColumns
    return Math.min(Math.max(1, categoryCount), this.maxColumns);
  }

  override render() {
    const view = this.view;
    const columnCount =
      this.layout === 'grid' || this.layout === 'masonry'
        ? this._getColumnCount()
        : null;

    const inner = this._isJsonMode
      ? view === ROOT_VIEW
        ? this.renderRootView()
        : this.renderDetailView()
      : view === ROOT_VIEW
      ? this.renderSlottedRoot()
      : this.renderSlottedDetail();

    return html`
      <div
        class="header-categories"
        data-view=${view}
        @on-more-click=${(e: Event) =>
          this._handleSlottedMoreClick(
            e as CustomEvent<{ categoryId: string }>
          )}
      >
        <div
          class="header-categories__inner"
          data-columns=${ifDefined(columnCount ?? undefined)}
        >
          ${inner ?? html``}
        </div>

        <slot
          name="manual-hidden"
          class="header-categories__observer"
          style="display: none;"
        ></slot>
        <!-- hidden slot used only to observe light DOM changes (edge case) -->
        <slot
          class="header-categories__observer"
          style="display: none;"
          @slotchange=${() => this._scheduleBuildSlottedCategories()}
        ></slot>

        ${view === DETAIL_VIEW
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
                  ${this._textStrings.back}
                </kyn-button>
              </div>
            `
          : null}
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this._owningNav = this._resolveOwningNav();
    this._owningNav?.addEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );

    // initial build for slotted mode
    this._buildSlottedCategories();
    this._syncSlottedCategoryPresentation();

    // Set up ResizeObserver to update dividers when columns reflow (grid mode only, debounced)
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(this._handleResize);
      this._resizeObserver.observe(this);
    }
  }

  override disconnectedCallback(): void {
    this._owningNav?.removeEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );
    this._owningNav = null;

    if (this._buildSlottedRaf != null) {
      window.cancelAnimationFrame(this._buildSlottedRaf);
      this._buildSlottedRaf = undefined;
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }

    this._resetSlottedCategoryPresentation();

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-categories': HeaderCategories;
  }
}
