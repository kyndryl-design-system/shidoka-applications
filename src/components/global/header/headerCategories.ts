import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import {
  LitElement,
  html,
  unsafeCSS,
  PropertyValueMap,
  TemplateResult,
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

export interface HeaderCategoryLinkType {
  label: string;
  href?: string;
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

/**
 * Map of tab id to mega nav configuration.
 */
export interface MegaTabsConfig {
  [tabId: string]: MegaTabConfig;
}

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
  context?: HeaderLinkRendererContext
) => TemplateResult | null;

type HeaderView = 'root' | 'detail';

const ROOT_VIEW: HeaderView = 'root';
const DETAIL_VIEW: HeaderView = 'detail';

const VOID_HREF = 'javascript:void(0)';
const MORE_LABEL = 'More';
const MORE_ATTR = 'data-kyn-more-link';

/**
 * Header categories wrapper for mega menu.
 * @slot unnamed - Slot for header category elements.
 * Controlled via `activeMegaTabId` / `activeMegaCategoryId` but
 * encapsulates all mega-nav view behavior (root/detail, "More", "Back").
 *
 * Emits `on-nav-change` so parents can mirror state for tabs, routing, etc.
 *
 * Modes:
 * - JSON mode: provide `tabsConfig` and categories/links are rendered from config.
 * - Slotted/manual mode: omit `tabsConfig` and slot <kyn-header-category> /
 *   <kyn-header-link> similar to the original API; this component will:
 *    - Truncate visible links per category at `maxRootLinks`
 *    - Inject a "More" link when there are additional links
 *    - Switch to a detail view for a category when "More" is clicked
 *    - Show a Back button to return to the root view
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

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

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
   * Optional hook to render the entire link content slotted into <kyn-header-link>.
   * If not provided, a simple circle-icon + label placeholder is used.
   */
  @property({ attribute: false })
  accessor linkRenderer: HeaderMegaLinkRenderer | null = null;

  private readonly _boundHandleNavToggle = (e: Event): void =>
    this._handleNavToggle(e as CustomEvent<{ open?: boolean }>);

  // Bound slotchange handler so we can re-sync slotted content when it changes
  private readonly _boundHandleSlotChange = (): void =>
    this._syncSlottedCategories();

  // bound back-click handler for direct DOM listener
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
   * Public API to force root view for a given tab.
   * Consumer can call via element ref if needed.
   */
  setRootView(tabId?: string): void {
    this.activeMegaTabId = tabId ?? this.activeMegaTabId;
    this.activeMegaCategoryId = null;
    this.view = ROOT_VIEW;
    this._emitChange();

    if (!this._isJsonMode) this._syncSlottedCategories();
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
    if (!this._isJsonMode) this._syncSlottedCategories();
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
      const nextView: HeaderView =
        this.activeMegaCategoryId == null ? ROOT_VIEW : DETAIL_VIEW;

      if (this.view !== nextView) {
        this.view = nextView;
      }
    }

    // In manual/slotted mode, keep the DOM in sync with view + maxRootLinks.
    if (!this._isJsonMode) {
      this._syncSlottedCategories();
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

    // Default placeholder: circle icon + label, for simple JSON configs.
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
                @click=${(e: Event) =>
                  this.openCategoryDetail(tabId, category.id, e)}
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

    return html`
      <kyn-header-category
        heading=${`${category.heading} – ${this._textStrings.more}`}
      >
        <div class="header-detail-columns">
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
   * Slotted/manual mode helper:
   * - Finds <kyn-header-category> elements from the light DOM.
   * - Applies root vs detail visibility.
   * - Truncates links at `maxRootLinks` in root view.
   * - Ensures a "More" link is injected / wired up for categories with extra links.
   */
  private _syncSlottedCategories(): void {
    const categories = Array.from(
      this.querySelectorAll<HTMLElement>('kyn-header-category')
    );

    if (!categories.length) return;

    const view = this.view;
    const activeId = this.activeMegaCategoryId;

    const moreLinksStripped = (allLinks: HTMLElement[]): HTMLElement[] =>
      allLinks.filter((link) => link.dataset.kynMoreLink !== 'true');

    categories.forEach((categoryEl, index) => {
      const existingId = categoryEl.getAttribute('id');
      const categoryId = existingId ?? `category-${index + 1}`;
      if (!existingId) {
        categoryEl.id = categoryId;
      }

      let allLinks: HTMLElement[] = [];
      const slotEl = categoryEl.querySelector('slot');
      if (
        slotEl &&
        typeof (slotEl as HTMLSlotElement).assignedElements === 'function'
      ) {
        allLinks = (slotEl as HTMLSlotElement)
          .assignedElements({ flatten: true })
          .filter(
            (el) => el.tagName.toLowerCase() === 'kyn-header-link'
          ) as HTMLElement[];
      } else {
        allLinks = Array.from(
          categoryEl.querySelectorAll<HTMLElement>('kyn-header-link')
        ) as HTMLElement[];
      }

      allLinks = allLinks.filter((link) => link.parentElement === categoryEl);

      const moreLink = allLinks.find((link) => link.hasAttribute(MORE_ATTR));

      const regularLinks = moreLinksStripped(allLinks);

      if (view === ROOT_VIEW) {
        categoryEl.hidden = false;

        regularLinks.forEach((linkEl, linkIndex) => {
          const hide = linkIndex >= this.maxRootLinks;
          linkEl.hidden = hide;
          linkEl.style.display = hide ? 'none' : '';
        });

        const needsMore = regularLinks.length > this.maxRootLinks;

        let effectiveMoreLink = moreLink;

        if (needsMore && !effectiveMoreLink) {
          const link = document.createElement('kyn-header-link') as HTMLElement;
          link.setAttribute('href', VOID_HREF);
          link.setAttribute(MORE_ATTR, 'true');
          link.innerHTML = `<span style="margin-right: 8px;">${chevronRightIcon}</span><span>${this._textStrings.more}</span>`;
          categoryEl.appendChild(link);
          effectiveMoreLink = link;
        }

        if (effectiveMoreLink) {
          effectiveMoreLink.hidden = !needsMore;
          effectiveMoreLink.onclick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.openCategoryDetail(this.activeMegaTabId, categoryId, e);
          };
        }
      } else {
        const isActive = categoryId === activeId;
        categoryEl.hidden = !isActive;

        if (isActive) {
          regularLinks.forEach((linkEl) => {
            linkEl.hidden = false;
          });
          if (moreLink) {
            moreLink.hidden = true;
          }
        } else {
          regularLinks.forEach((linkEl) => {
            linkEl.hidden = true;
          });
          if (moreLink) {
            moreLink.hidden = true;
          }
        }
      }
    });
  }

  private renderSlottedDetail(): TemplateResult | null {
    const categories = Array.from(
      this.querySelectorAll<HTMLElement>('kyn-header-category')
    );
    if (!categories.length) return null;

    const categoriesWithId = categories.map((el, idx) => ({
      el,
      id: el.getAttribute('id') ?? `category-${idx + 1}`,
    }));

    const categoryItem =
      categoriesWithId.find((c) => c.id === this.activeMegaCategoryId) ??
      categoriesWithId[0];
    if (!categoryItem) return null;

    const categoryEl = categoryItem.el;
    const heading = categoryEl.getAttribute('heading') ?? '';

    const allLinks = Array.from(
      categoryEl.querySelectorAll<HTMLElement>('kyn-header-link')
    ).filter((link) => link.parentElement === categoryEl) as HTMLElement[];

    const regularLinks = allLinks.filter(
      (l) => l.dataset.kynMoreLink !== 'true'
    );

    const linkData = regularLinks.map((l) => ({
      href: l.getAttribute('href') ?? VOID_HREF,
      inner: l.innerHTML,
    }));

    const columns = this.chunkBy(linkData, this.detailLinksPerColumn);

    return html`
      <kyn-header-category heading=${`${heading} – ${this._textStrings.more}`}>
        <div class="header-detail-columns">
          ${columns.map(
            (col) => html`
              <div>
                ${col.map(
                  (link) => html`
                    <kyn-header-link href=${link.href}
                      >${unsafeHTML(link.inner)}</kyn-header-link
                    >
                  `
                )}
              </div>
            `
          )}
        </div>
      </kyn-header-category>
    `;
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
          ? html`<slot class="header-categories__slot"></slot>`
          : this.renderSlottedDetail();
    }

    return html`
      <div class="header-categories" data-view=${view}>
        <div class="header-categories__inner">${inner ?? html``}</div>

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
    this.addEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );

    const slot = this.shadowRoot?.querySelector(
      'slot.header-categories__slot'
    ) as HTMLSlotElement | null;
    slot?.addEventListener('slotchange', this._boundHandleSlotChange);
  }

  override disconnectedCallback(): void {
    this.removeEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );
    const slot = this.shadowRoot?.querySelector(
      'slot.header-categories__slot'
    ) as HTMLSlotElement | null;
    slot?.removeEventListener('slotchange', this._boundHandleSlotChange);
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-categories': HeaderCategories;
  }
}
