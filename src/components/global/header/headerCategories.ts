import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import {
  LitElement,
  html,
  unsafeCSS,
  type PropertyValueMap,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './headerCategories.scss?inline';

import './headerCategory';
import '../../reusable/button/button';
import './headerLink';

import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

const _defaultTextStrings = {
  back: 'Back',
  more: 'More',
};

type HeaderTextStrings = typeof _defaultTextStrings;

export interface HeaderCategoryLinkType {
  id: string;
  label: string;
  href?: string;
  iconId?: string;
}

export interface HeaderLinkRendererContext {
  tabId: string;
  categoryId: string;
  view: 'root' | 'detail';
}

export interface HeaderCategoryType {
  id: string;
  heading: string;
  links: HeaderCategoryLinkType[];
}

export interface MegaTabConfig {
  categories: HeaderCategoryType[];
}

export interface MegaTabsConfig {
  [tabId: string]: MegaTabConfig;
}

export interface HeaderMegaChangeDetail {
  activeMegaTabId: string;
  activeMegaCategoryId: string | null;
}

export type HeaderMegaLinkRenderer = (
  link: HeaderCategoryLinkType,
  context?: HeaderLinkRendererContext
) => TemplateResult | null;

type HeaderView = 'root' | 'detail';

const ROOT_VIEW: HeaderView = 'root';
const DETAIL_VIEW: HeaderView = 'detail';

const VOID_HREF = 'javascript:void(0)';

interface SlottedLinkData {
  href: string;
  inner: string;
}

interface SlottedCategoryData {
  id: string;
  heading: string;
  links: SlottedLinkData[];
}

/**
 * Header categories wrapper for mega menu.
 * @slot unnamed - Slot for header category elements.
 * Controlled via `activeMegaTabId` / `activeMegaCategoryId` but
 * encapsulates all categorical/mega-nav view behavior (root/detail, "More", "Back").
 *
 * Emits `on-nav-change` so parents can mirror state for tabs, routing, etc.
 *
 * Modes:
 * - JSON mode: provide `tabsConfig` and categories/links are rendered from config.
 * - Slotted/manual mode: omit `tabsConfig` and slot <kyn-header-category> /
 *   <kyn-header-link> will:
 *    - truncate visible links per category at `maxRootLinks`
 *    - inject a "More" link when there are additional links
 *    - switch to a detail view for a category when "More" is clicked
 *    - show a Back button to return to the root view
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

  /**
   * Optional text overrides, merged with defaults.
   * e.g. <kyn-header-categories .textStrings=${{ more: 'More items' }}>
   */
  @property({ type: Object })
  accessor textStrings: Partial<HeaderTextStrings> | null = null;

  /** Resolved text strings (defaults + overrides). */
  @state()
  accessor _textStrings: HeaderTextStrings = _defaultTextStrings;

  /** Number of links per column in the detail view (JSON mode only). */
  @property({ type: Number })
  accessor detailLinksPerColumn = 6;

  /**
   * Current visual view for styling ('root' | 'detail').
   * Derived from `activeMegaCategoryId` but reflected for CSS hooks.
   */
  @property({ type: String, reflect: true })
  accessor view: HeaderView = ROOT_VIEW;

  /**
   * optional hook to render the entire link content slotted into <kyn-header-link>.
   * if not provided, a simple circle-icon + label placeholder is used.
   */
  @property({ attribute: false })
  accessor linkRenderer: HeaderMegaLinkRenderer | null = null;

  /** Internal representation of slotted categories */
  @state()
  accessor _slottedCategories: SlottedCategoryData[] = [];

  private _buildSlottedTimeout?: number;

  private readonly _boundHandleNavToggle = (e: Event): void =>
    this._handleNavToggle(e as CustomEvent<{ open?: boolean }>);

  private readonly _boundBackClick = (e?: Event): void =>
    this.handleBackClick(e);

  private get _isJsonMode(): boolean {
    return this.tabsConfig != null;
  }

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
   * force root view for a given tab.
   * consumer can call via element ref if needed.
   */
  setRootView(tabId?: string): void {
    this.activeMegaTabId = tabId ?? this.activeMegaTabId;
    this.activeMegaCategoryId = null;
    this.view = ROOT_VIEW;
    this._emitChange();

    if (!this._isJsonMode) this._buildSlottedCategories();
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
    if (!this._isJsonMode) this._buildSlottedCategories();
  }

  handleBackClick(e?: Event): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setRootView(this.activeMegaTabId);

    // restore focus to the tab/link that opened the mega
    this.updateComplete.then(() => {
      const hostLinks = Array.from(
        this.querySelectorAll<HTMLElement>('kyn-header-link')
      );
      const activeLink = hostLinks.find((l) => l.hasAttribute('isactive'));
      if (activeLink && (activeLink as HTMLElement).focus) {
        (activeLink as HTMLElement).focus();
      }
    });
  }

  private _handleNavToggle(e: CustomEvent<{ open?: boolean }>): void {
    const isOpen = Boolean(e.detail?.open);

    // when the nav closes, always reset to root view on the next open
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
  }

  override updated(changed: PropertyValueMap<this>): void {
    if (changed.has('activeMegaCategoryId') || changed.has('activeMegaTabId')) {
      const nextView: HeaderView =
        this.activeMegaCategoryId == null ? ROOT_VIEW : DETAIL_VIEW;

      if (this.view !== nextView) {
        this.view = nextView;
      }
    }

    const backButton = this.shadowRoot?.querySelector(
      '.header-categories__back-slot kyn-button'
    ) as HTMLElement | null;

    if (backButton) {
      backButton.removeEventListener(
        'click',
        this._boundBackClick as EventListener
      );
      if (this.view === DETAIL_VIEW) {
        backButton.addEventListener(
          'click',
          this._boundBackClick as EventListener
        );
      }
    }
  }

  private renderLinkContent(
    link: HeaderCategoryLinkType,
    ctx: HeaderLinkRendererContext
  ): TemplateResult {
    if (this.linkRenderer) {
      const result = this.linkRenderer(link, ctx);
      return result ?? html``;
    }

    // default placeholder: circle icon + label, for simple JSON configs.
    return html`
      <span>${unsafeSVG(circleIcon)}</span>
      ${link.label}
    `;
  }

  private renderCategoryColumn(
    tabId: string,
    category: HeaderCategoryType | undefined
  ): TemplateResult | null {
    if (!category) return null;

    const links = category.links ?? [];

    return html`
      <kyn-header-category heading=${category.heading}>
        ${links.slice(0, this.maxRootLinks).map(
          (link) => html`
            <kyn-header-link href=${link.href ?? VOID_HREF}>
              ${this.renderLinkContent(link, {
                tabId,
                categoryId: category.id,
                view: ROOT_VIEW,
              })}
            </kyn-header-link>
          `
        )}
        ${links.length > this.maxRootLinks
          ? html`
              <kyn-header-link
                href=${VOID_HREF}
                role="button"
                aria-expanded=${this.activeMegaCategoryId === category.id
                  ? 'true'
                  : 'false'}
                aria-controls=${`detail-${category.id}`}
                @click=${(e: Event) =>
                  this.openCategoryDetail(tabId, category.id, e)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openCategoryDetail(tabId, category.id, e);
                  }
                }}
              >
                <span style="margin-right: 8px;">
                  ${unsafeSVG(chevronRightIcon)}
                </span>
                <span>${this._textStrings.more}</span>
              </kyn-header-link>
            `
          : null}
      </kyn-header-category>
    `;
  }

  private renderRootView(): TemplateResult {
    const categories: HeaderCategoryType[] = this._tabConfig?.categories ?? [];
    return html`${categories.map((category) =>
      this.renderCategoryColumn(this.activeMegaTabId, category)
    )}`;
  }

  private renderDetailView(): TemplateResult | null {
    const categories: HeaderCategoryType[] = this._tabConfig?.categories ?? [];
    const category =
      categories.find((cat) => cat.id === this.activeMegaCategoryId) ??
      categories[0];

    if (!category) return null;

    const linkColumns = this.chunkBy(
      category.links ?? [],
      this.detailLinksPerColumn
    );
    const isSingleColumn = linkColumns.length === 1;

    return html`
      <kyn-header-category
        heading=${`${category.heading} – ${this._textStrings.more}`}
      >
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
                ${column.map(
                  (link) => html`
                    <kyn-header-link href=${link.href ?? VOID_HREF}>
                      ${this.renderLinkContent(link, {
                        tabId: this.activeMegaTabId,
                        categoryId: category.id,
                        view: DETAIL_VIEW,
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

  /**
   * Build an internal, read-only representation of slotted categories.
   * Avoids mutating the dev consumer's light DOM and allows declarative rendering.
   */
  private _buildSlottedCategories(): void {
    if (this._isJsonMode) return;

    const categories = Array.from(
      this.querySelectorAll<HTMLElement>('kyn-header-category')
    );

    if (!categories.length) {
      this._slottedCategories = [];
      return;
    }

    const data = categories.map((categoryEl, index) => {
      const id = categoryEl.getAttribute('id') ?? `category-${index + 1}`;
      const heading = categoryEl.getAttribute('heading') ?? '';

      const allLinks = Array.from(
        categoryEl.querySelectorAll<HTMLElement>('kyn-header-link')
      ).filter((link) => link.parentElement === categoryEl) as HTMLElement[];

      const regularLinks = allLinks.filter(
        (l) => l.dataset.kynMoreLink !== 'true'
      );

      const links = regularLinks.map((l) => ({
        href: l.getAttribute('href') ?? VOID_HREF,
        inner: l.innerHTML,
      }));

      return {
        id,
        heading,
        links,
      } as SlottedCategoryData;
    });

    this._slottedCategories = data;
  }

  private renderSlottedRoot(): TemplateResult | null {
    const categories = this._slottedCategories;
    if (!categories.length) return null;

    return html`${categories.map(
      (category) => html`
        <kyn-header-category heading=${category.heading}>
          ${category.links
            .slice(0, this.maxRootLinks)
            .map(
              (link) => html`
                <kyn-header-link href=${link.href}>
                  ${unsafeHTML(link.inner)}
                </kyn-header-link>
              `
            )}
          ${category.links.length > this.maxRootLinks
            ? html`
                <kyn-header-link
                  href=${VOID_HREF}
                  role="button"
                  aria-expanded=${this.activeMegaCategoryId === category.id
                    ? 'true'
                    : 'false'}
                  aria-controls=${`detail-${category.id}`}
                  @click=${(e: Event) =>
                    this.openCategoryDetail(
                      this.activeMegaTabId,
                      category.id,
                      e
                    )}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      this.openCategoryDetail(
                        this.activeMegaTabId,
                        category.id,
                        e as unknown as Event
                      );
                    }
                  }}
                >
                  <span style="margin-right: 8px;"
                    >${unsafeSVG(chevronRightIcon)}</span
                  >
                  <span>${this._textStrings.more}</span>
                </kyn-header-link>
              `
            : null}
        </kyn-header-category>
      `
    )}`;
  }

  private renderSlottedDetail(): TemplateResult | null {
    const categories = this._slottedCategories;
    if (!categories.length) return null;

    const categoryItem =
      categories.find((c) => c.id === this.activeMegaCategoryId) ??
      categories[0];
    if (!categoryItem) return null;

    const columns = this.chunkBy(categoryItem.links, this.detailLinksPerColumn);
    const isSingleColumn = columns.length === 1;

    return html`
      <kyn-header-category
        heading=${`${categoryItem.heading} – ${this._textStrings.more}`}
      >
        <div
          id=${`detail-${categoryItem.id}`}
          class="header-detail-columns ${isSingleColumn
            ? 'header-detail-columns--single'
            : ''}"
          role="region"
          aria-label=${`${categoryItem.heading} – ${this._textStrings.more}`}
        >
          ${columns.map(
            (col) => html`
              <div>
                ${col.map(
                  (link) => html`
                    <kyn-header-link href=${link.href}>
                      ${unsafeHTML(link.inner)}
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

  private _scheduleBuildSlottedCategories(): void {
    if (typeof window === 'undefined') {
      this._buildSlottedCategories();
      return;
    }

    if (this._buildSlottedTimeout) {
      window.clearTimeout(this._buildSlottedTimeout);
    }
    this._buildSlottedTimeout = window.setTimeout(() => {
      this._buildSlottedCategories();
      this._buildSlottedTimeout = undefined;
    }, 40);
  }

  override render(): TemplateResult {
    const view = this.view;

    let inner: TemplateResult | null;
    if (this._isJsonMode) {
      inner =
        view === ROOT_VIEW ? this.renderRootView() : this.renderDetailView();
    } else {
      inner =
        view === ROOT_VIEW
          ? this.renderSlottedRoot()
          : this.renderSlottedDetail();
    }

    return html`
      <div class="header-categories" data-view=${view}>
        <div class="header-categories__inner">${inner ?? html``}</div>

        <!-- hidden slot used only to observe dev consumer light DOM changes (edge case) -->
        <slot
          class="header-categories__slot"
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

    this.ownerDocument?.addEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );

    // initial build for slotted mode
    this._buildSlottedCategories();
  }

  override disconnectedCallback(): void {
    this.ownerDocument?.removeEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );

    if (this._buildSlottedTimeout) {
      window.clearTimeout(this._buildSlottedTimeout);
      this._buildSlottedTimeout = undefined;
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-categories': HeaderCategories;
  }
}
