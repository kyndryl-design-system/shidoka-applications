import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderLinkScss from './headerLink.scss?inline';
import '../../reusable/textInput';
import arrowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import backIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';

export type HeaderLinkTarget = '_self' | '_blank' | '_parent' | '_top';

/**
 * Component for navigation links within the Header.
 * @fires on-click - Captures the click event and emits the original event details. `detail:{ origEvent: Event ,defaultPrevented: boolean}`
 * @slot unnamed - Slot for link text/content.
 * @slot links - Slot for sublinks (up to two levels).
 * @slot icon - Slot for icon.
 */
@customElement('kyn-header-link')
export class HeaderLink extends LitElement {
  static override styles = unsafeCSS(HeaderLinkScss);

  /** Link open state.
   * @internal
   */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Link url. */
  @property({ type: String })
  accessor href = '';

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (default), "_blank", "_parent", "_top" */
  @property({ type: String })
  accessor target: HeaderLinkTarget = '_self';

  /** Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship */
  @property({ type: String })
  accessor rel = '';

  /** Link active state, for example when URL path matches link href. */
  @property({ type: Boolean })
  accessor isActive = false;

  /** Link level, supports two levels.
   * @ignore
   */
  @state()
  accessor level = 1;

  /** DEPRECATED. Adds a 1px shadow to the bottom of the link. */
  @property({ type: Boolean })
  accessor divider = false;

  /** Label for sub-menu link search input, which is visible with > 5 sub-links. */
  @property({ type: String })
  accessor searchLabel = 'Search';

  /** Number of child links required to show search input. */
  @property({ type: Number })
  accessor searchThreshold = 6;

  /** Maximum number of links per column in plain (non-categorical) flyouts.
   * When set to a positive number and the slotted link count exceeds this value,
   * additional columns are created automatically. Default 0 (auto — no column splitting).
   */
  @property({ type: Number })
  accessor linksPerColumn = 0;

  /** Hide the search input regardless of the number of child links. */
  @property({ type: Boolean })
  accessor hideSearch = false;

  /** Text for mobile "Back" button. */
  @property({ type: String })
  accessor backText = 'Back';

  /** Add left padding when icon is not provided to align text with links that do have icons. */
  @property({ type: Boolean })
  accessor leftPadding = false;

  /** Title attribute for the link, shown as a tooltip on hover. Useful for truncated text.
   * @internal
   */
  @property({ type: String, attribute: 'link-title' })
  accessor linkTitle = '';

  /** When true, long text truncates with ellipsis. Default: false (text wraps normally). */
  @property({ type: Boolean, reflect: true })
  accessor truncate = false;

  /** Auto-derived title from slot content, used if linkTitle is not set.
   * @internal
   */
  @state()
  accessor _autoTitle = '';

  /** Indicates whether this link contains categorical navigation (kyn-header-categories or kyn-header-category).
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-categorical' })
  accessor hasCategorical = false;

  /** Indicates whether this link contains multi-column categorical navigation (kyn-header-categories wrapper).
   * Used to distinguish multi-column flyouts from single-column category lists.
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-multi-column' })
  accessor hasMultiColumn = false;

  /** Number of columns in the categorical flyout (for width adjustment).
   * @internal
   */
  @property({ type: Number, reflect: true, attribute: 'data-flyout-columns' })
  accessor flyoutColumns = 0;

  /** Current search term for filtering links in the flyout.
   * @internal
   */
  @state()
  accessor _searchTerm = '';

  /** Number of slotted plain links (non-categorical), used for column calculation.
   * @internal
   */
  @state()
  accessor _slottedLinkCount = 0;

  /**
   * Queries any slotted HTML elements.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links' })
  accessor slottedEls!: Array<HTMLElement>;

  /** Timeout function to delay flyout open.
   * @internal
   */
  _enterTimer: any;

  /** Timeout function to delay flyout close.
   * @internal
   */
  @state()
  accessor _leaveTimer: any;

  /** Suppresses pointer-leave close during internal view transitions (e.g. "More" click).
   * @internal
   */
  private _viewChangeInProgress = false;
  private _viewChangeTimer: any;

  /** Cached truncation state from parent nav
   * @internal
   */
  @state()
  accessor _inheritedTruncate = false;

  /** Observer for `truncate-links` changes on the owning nav.
   * @internal
   */
  private _truncateObserver?: MutationObserver;
  private _observedNav: HTMLElement | null = null;

  /** Menu positioning
   * @internal
   */
  @state()
  accessor menuPosition: any = {};

  override render() {
    const classes = {
      menu: this.slottedEls.length,
      [`level--${this.level}`]: true,
      divider: this.divider,
      open: this.open || (this.level === 1 && this.isActive),
    };

    // Check if truncation should be applied (individual prop or inherited from nav)
    const shouldTruncate = this.truncate || this._inheritedTruncate;

    const linkClasses = {
      'nav-link': true,
      active: this.isActive,
      interactive: this.level == 1,
      'padding-left': this.leftPadding,
      truncate: shouldTruncate,
    };

    const menuClasses = {
      menu__content: true,
      slotted: this.slottedEls.length,
    };

    const Links = this.querySelectorAll(
      ':scope > kyn-header-link, :scope > kyn-header-category > kyn-header-link'
    );

    const showSearch = !this.hideSearch && Links.length >= this.searchThreshold;

    const wrapperClasses = {
      wrapper: true,
      'no-search': !showSearch,
    };

    return html`
      <div
        class="${classMap(classes)}"
        @pointerleave=${(e: PointerEvent) => this.handlePointerLeave(e)}
        @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
      >
        <a
          target=${this.target}
          rel=${this.rel}
          href=${this.href}
          title=${ifDefined(
            this.linkTitle ||
              (this.slottedEls.length === 0 ? this._autoTitle : '') ||
              undefined
          )}
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
          @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
        >
          <slot @slotchange=${this._handleDefaultSlotChange}></slot>

          ${this.slottedEls.length
            ? html` <span class="arrow">${unsafeSVG(arrowIcon)}</span> `
            : null}
        </a>

        <div
          class=${classMap(menuClasses)}
          style=${styleMap(this.menuPosition)}
        >
          <div class=${classMap(wrapperClasses)}>
            <button
              class="go-back"
              type="button"
              @click=${(e: Event) => this._handleBack(e)}
            >
              <span>${unsafeSVG(backIcon)}</span>
              ${this.backText}
            </button>
            ${showSearch
              ? html`
                  <kyn-text-input
                    hideLabel
                    size="sm"
                    type="search"
                    label=${this.searchLabel}
                    placeholder=${this.searchLabel}
                    value=${this._searchTerm}
                    @on-input=${(e: Event) => this._handleSearch(e)}
                  >
                    <span slot="icon" class="search-icon">
                      ${unsafeSVG(searchIcon)}
                    </span>
                    ${this.searchLabel}
                  </kyn-text-input>
                `
              : null}

            <div
              class="links-columns"
              style=${styleMap(this._linksColumnStyles)}
            >
              <slot
                name="links"
                @slotchange=${this._handleLinksSlotChange}
              ></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /** Compute inline styles for the links-columns wrapper.
   * Only applies multi-column layout for plain (non-categorical) flyouts
   * when the number of links exceeds linksPerColumn.
   * @internal
   */
  private get _linksColumnStyles() {
    if (
      !this.hasCategorical &&
      this.linksPerColumn > 0 &&
      this._slottedLinkCount > this.linksPerColumn
    ) {
      const columnCount = Math.ceil(
        this._slottedLinkCount / this.linksPerColumn
      );
      return { 'column-count': columnCount.toString() };
    }
    return {};
  }

  private _handleSearch(e: any) {
    this._searchTerm = e.detail.value.toLowerCase();
    this._searchFilter();
  }

  private _searchFilter() {
    const Links: any = this.querySelectorAll(
      ':scope > kyn-header-link, :scope > kyn-header-category > kyn-header-link'
    );

    Links.forEach((link: any) => {
      // get link text
      const nodes: any = link.shadowRoot?.querySelector('slot')?.assignedNodes({
        flatten: true,
      });
      let linkText = '';
      for (let i = 0; i < nodes.length; i++) {
        linkText += nodes[i].textContent.trim();
      }

      if (linkText.toLowerCase().includes(this._searchTerm)) {
        link.style.display = 'block';
      } else {
        link.style.display = 'none';
      }
    });

    this._positionMenu();
  }

  /** Extract text content from the default slot to use as auto-title */
  private _handleDefaultSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    let textContent = '';
    for (const node of nodes) {
      textContent += node.textContent?.trim() ?? '';
    }
    this._autoTitle = textContent.trim();
  }

  private _handleBack(e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // detect if we're inside the categorized/mega nav variant
    const headerCategories = this.closest('kyn-header-categories') as
      | (HTMLElement & { handleBackClick?: (evt?: Event) => void })
      | null;

    if (headerCategories?.handleBackClick) {
      headerCategories.handleBackClick(e);

      // Close any open header links under this nav
      const navRoot =
        (this.closest('kyn-header-nav') as HTMLElement | null) ??
        headerCategories;

      const links = navRoot.querySelectorAll<HTMLElement & { open?: boolean }>(
        'kyn-header-link[open]'
      );

      links.forEach((link) => {
        link.removeAttribute('open');
        if ('open' in link) {
          (link as any).open = false;
        }
      });

      // Clear local search for this column
      this._searchTerm = '';
      this._searchFilter();

      return;
    }

    // BASIC NAV:
    // Preserve original behavior: go up one level
    this.open = false;
    this._searchTerm = '';
    this._searchFilter();
  }

  private _handleLinksSlotChange() {
    // Detect if this link contains categorical navigation
    const hasCategories = this.querySelector('kyn-header-categories') !== null;
    const hasCategory = this.querySelector('kyn-header-category') !== null;

    this.hasCategorical = hasCategories || hasCategory;
    this.hasMultiColumn = hasCategories; // Only true for multi-column wrapper

    // Count direct child plain links for column wrapping
    const plainLinks = this.querySelectorAll(':scope > kyn-header-link');
    this._slottedLinkCount = plainLinks.length;

    this.requestUpdate();
  }

  /** Handle column count changes from slotted kyn-header-categories
   * @internal
   */
  private _handleColumnCountChange = (e: Event) => {
    const detail = (e as CustomEvent<{ columnCount: number }>).detail;
    if (detail?.columnCount !== undefined) {
      this.flyoutColumns = detail.columnCount;
    }
  };

  private get _isDesktopViewport(): boolean {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 672;
  }

  private handlePointerEnter(e: PointerEvent) {
    if (
      e.pointerType === 'mouse' &&
      this.slottedEls.length &&
      this._isDesktopViewport
    ) {
      clearTimeout(this._leaveTimer);

      // close other open sibling links immediately when entering any link with submenus
      this._closeOtherOpenLinks();

      this._enterTimer = setTimeout(() => {
        // Close siblings again right before opening to prevent race conditions
        this._closeOtherOpenLinks();
        this.open = true;
      }, 150);
    }
  }

  /** close other open header links at the same level
   * @internal
   */
  private _closeOtherOpenLinks(): void {
    // Strategy: Close all sibling header-links that are currently open
    // This handles the sidebar nav where links are direct children of header-nav

    // For level 1 links (main sidebar), find siblings via parent
    if (this.level === 1) {
      const parent = this.parentElement;
      if (parent) {
        // Find ALL level 1 links (not just open ones) to clear pending timers
        const siblingLinks = parent.querySelectorAll<
          HTMLElement & { open?: boolean; _enterTimer?: any }
        >(':scope > kyn-header-link');

        siblingLinks.forEach((link) => {
          if (link !== this) {
            // Clear any pending timers
            if ((link as any)._enterTimer) {
              clearTimeout((link as any)._enterTimer);
              (link as any)._enterTimer = undefined;
            }
            if ((link as any)._leaveTimer) {
              clearTimeout((link as any)._leaveTimer);
              (link as any)._leaveTimer = undefined;
            }
            // Force close - set property, remove attribute, and force re-render
            if ((link as any).open) {
              (link as any).open = false;
              link.removeAttribute('open');
              (link as any).requestUpdate?.();
            }
          }
        });
      }
      return;
    }

    // For nested links, find the nearest container and close same-level links
    const navContainer =
      this.closest('kyn-header-nav') ||
      this.closest('kyn-tab-panel') ||
      this.closest('.menu__content');

    if (navContainer) {
      const allLinks = navContainer.querySelectorAll<
        HTMLElement & { open?: boolean; level?: number; _enterTimer?: any }
      >('kyn-header-link');

      allLinks.forEach((link) => {
        if (link !== this && (link as any).level === this.level) {
          // Clear any pending timers
          if ((link as any)._enterTimer) {
            clearTimeout((link as any)._enterTimer);
            (link as any)._enterTimer = undefined;
          }
          if ((link as any)._leaveTimer) {
            clearTimeout((link as any)._leaveTimer);
            (link as any)._leaveTimer = undefined;
          }
          // Force close - set property, remove attribute, and force re-render
          if ((link as any).open) {
            (link as any).open = false;
            link.removeAttribute('open');
            (link as any).requestUpdate?.();
          }
        }
      });
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    // Suppress close during internal view transitions (e.g. "More" → detail view).
    // The flyout resizes and the cursor may end up outside, but the user's intent
    // was to drill in — not to leave.
    if (this._viewChangeInProgress) {
      return;
    }

    // check both the link's own prop and parent nav's prop
    // if either is false, don't auto-close the flyout
    const shouldAutoCollapse = this._shouldAutoCollapse();
    if (!shouldAutoCollapse) {
      return;
    }

    if (
      e.pointerType === 'mouse' &&
      this.slottedEls.length &&
      this._searchTerm === '' &&
      this._isDesktopViewport
    ) {
      clearTimeout(this._enterTimer);
      this._leaveTimer = setTimeout(() => {
        this.open = false;
      }, 150);
    }
  }

  /** Check if flyout should auto-collapse based on parent nav's autoOpenFlyout.
   * Only applies to links containing categorical nav (kyn-header-categories).
   * @internal
   */
  private _shouldAutoCollapse(): boolean {
    // Non-categorical links always auto-collapse (preserve original behavior)
    if (!this.hasCategorical) {
      return true;
    }

    const parentNav = this.closest('kyn-header-nav') as
      | (HTMLElement & { autoOpenFlyout?: string })
      | null;

    // If parent nav has autoOpenFlyout set (truthy), don't auto-collapse
    if (parentNav?.autoOpenFlyout) {
      return false;
    }

    return true;
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.slottedEls.length) {
      preventDefault = true;
      e.preventDefault();
      // Close other open links before toggling this one
      if (!this.open) {
        this._closeOtherOpenLinks();
      }
      this.open = !this.open;
    }

    const event = new CustomEvent('on-click', {
      detail: { origEvent: e, defaultPrevented: preventDefault },
    });
    this.dispatchEvent(event);
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
      this._searchTerm = '';
      this._searchFilter();
    }
  }

  private determineLevel() {
    let level = 1;
    let node: any = this.parentNode;

    // Traverse up the DOM tree
    while (node) {
      if (node.nodeName === 'KYN-HEADER-LINK') {
        level = (node.level ?? 1) + 1;
        break;
      } else if (
        node.nodeName === 'KYN-HEADER-CATEGORY' &&
        node.parentNode?.nodeName === 'KYN-HEADER-LINK'
      ) {
        level = (node.parentNode.level ?? 1) + 1;
        break;
      } else if (
        window.innerWidth < 672 &&
        node.nodeName === 'KYN-HEADER-FLYOUT'
      ) {
        level = 2;
        break;
      }
      node = node.parentNode;
    }

    this.level = level;
  }

  /** Threshold in pixels - if flyout is within this distance of nav width, stretch to match */
  private static readonly STRETCH_THRESHOLD = 150;

  private _positionMenu() {
    const linkBounds = this.getBoundingClientRect?.();
    const menuEl =
      this.shadowRoot?.querySelector<HTMLElement>('.menu__content');
    const menuBounds = menuEl?.getBoundingClientRect?.();

    if (!linkBounds || !menuBounds) {
      return;
    }

    const Padding = 12;
    const HeaderHeight = 64;

    const linkHalf = linkBounds.top + linkBounds.height / 2;
    const menuHalf = menuBounds.height / 2;

    const topCandidate =
      linkHalf + menuHalf > window.innerHeight
        ? linkHalf - menuHalf - (linkHalf + menuHalf - window.innerHeight) - 16
        : linkHalf - menuHalf;

    if (this.level === 1) {
      // get the height of the level 1 menu to use as submenu min-height
      let navMenuHeight = 0;
      const headerNav = this.closest('kyn-header-nav') as HTMLElement | null;
      if (headerNav) {
        const navMenu = headerNav.shadowRoot?.querySelector(
          '.menu__content'
        ) as HTMLElement | null;
        if (navMenu) {
          navMenuHeight = navMenu.offsetHeight;
        }
      }

      // Only enforce min-height for multi-column mega nav flyouts
      // (kyn-header-categories), not simple category lists
      const hasMegaNav = this.querySelector('kyn-header-categories') !== null;

      // Calculate if flyout should stretch to fill available viewport width
      // Clamp oversized flyouts to the viewport and optionally stretch
      // near-edge flyouts for cleaner right alignment.
      let stretchWidth: string | undefined;
      if (hasMegaNav) {
        const flyoutNaturalWidth = menuBounds.width;
        const rightMargin = 16; // Margin from viewport edge
        const availableWidth = window.innerWidth - rightMargin;
        const widthDifference = availableWidth - flyoutNaturalWidth;

        if (flyoutNaturalWidth > availableWidth) {
          // Prevent right-side clipping on smaller viewports.
          stretchWidth = availableWidth + 'px';
        } else if (
          this.flyoutColumns !== 2 &&
          widthDifference > 0 &&
          widthDifference <= HeaderLink.STRETCH_THRESHOLD
        ) {
          // Stretch flyout to fill available width
          stretchWidth = availableWidth + 'px';
        }
      }

      this.menuPosition = {
        top: HeaderHeight + 'px',
        left: '0px',
        minHeight: navMenuHeight + 'px',
        ...(stretchWidth ? { width: stretchWidth } : {}),
      };
    } else {
      const top = topCandidate < HeaderHeight ? HeaderHeight : topCandidate;
      this.menuPosition = {
        top: top + 'px',
        left: linkBounds.right + Padding + 'px',
      };
    }
  }

  /** @internal */
  private _debounceResize = debounce(() => {
    this.determineLevel();
  });

  override firstUpdated() {
    this.determineLevel();
  }

  override updated(changedProps: any) {
    // Re-position after render when the menu has its actual dimensions
    if (changedProps.has('open') && this.open) {
      // Use rAF to ensure the DOM has painted
      requestAnimationFrame(() => {
        this._positionMenu();
      });
    }
  }

  private _handleDocumentClick = (e: Event) => this.handleClickOut(e);

  /** Suppress pointer-leave close when categories switch views (root ↔ detail).
   * @internal
   */
  private _handleNavChange = () => {
    this._viewChangeInProgress = true;
    clearTimeout(this._viewChangeTimer);
    // Allow enough time for the flyout to finish resizing before re-enabling close
    this._viewChangeTimer = setTimeout(() => {
      this._viewChangeInProgress = false;
    }, 500);
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
    window.addEventListener('resize', this._debounceResize);
    // Listen for column count changes from slotted kyn-header-categories
    this.addEventListener(
      'on-column-count-change',
      this._handleColumnCountChange
    );
    // Suppress flyout close during internal view transitions (e.g. "More" click)
    this.addEventListener('on-nav-change', this._handleNavChange);
    // Check for truncation inheritance after DOM is ready
    queueMicrotask(() => {
      this._observeParentNavTruncate();
    });
  }

  /** Find the closest owning nav across shadow boundaries.
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

  /** Sync inherited truncate state with the owning nav.
   * @internal
   */
  private _syncInheritedTruncate = (): void => {
    this._inheritedTruncate = this._isInTruncatingNav();
  };

  /** Observe `truncate-links` changes on the owning nav.
   * @internal
   */
  private _observeParentNavTruncate(): void {
    const nav = this._resolveOwningNav();

    if (this._observedNav === nav) {
      this._syncInheritedTruncate();
      return;
    }

    if (this._truncateObserver) {
      this._truncateObserver.disconnect();
      this._truncateObserver = undefined;
    }

    this._observedNav = nav;

    if (nav) {
      this._truncateObserver = new MutationObserver(() => {
        this._syncInheritedTruncate();
      });
      this._truncateObserver.observe(nav, {
        attributes: true,
        attributeFilter: ['truncate-links'],
      });
    }

    this._syncInheritedTruncate();
  }

  /** Check if this link is inside a nav with truncate-links attribute
   * Uses getRootNode to traverse up through shadow DOM boundaries
   * @internal
   */
  private _isInTruncatingNav(): boolean {
    return this._resolveOwningNav()?.hasAttribute('truncate-links') ?? false;
  }

  override disconnectedCallback() {
    // clear timers to avoid callbacks after unmount
    if (this._enterTimer) {
      clearTimeout(this._enterTimer);
      this._enterTimer = undefined;
    }
    if (this._leaveTimer) {
      clearTimeout(this._leaveTimer);
      this._leaveTimer = undefined;
    }

    if (this._viewChangeTimer) {
      clearTimeout(this._viewChangeTimer);
      this._viewChangeTimer = undefined;
    }

    document.removeEventListener('click', this._handleDocumentClick);
    window.removeEventListener('resize', this._debounceResize);
    this.removeEventListener(
      'on-column-count-change',
      this._handleColumnCountChange
    );
    this.removeEventListener('on-nav-change', this._handleNavChange);
    if (this._truncateObserver) {
      this._truncateObserver.disconnect();
      this._truncateObserver = undefined;
    }
    this._observedNav = null;
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-link': HeaderLink;
  }
}
