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

  /** Hide the search input regardless of the number of child links. */
  @property({ type: Boolean })
  accessor hideSearch = false;

  /** Text for mobile "Back" button. */
  @property({ type: String })
  accessor backText = 'Back';

  /** Add left padding when icon is not provided to align text with links that do have icons. */
  @property({ type: Boolean })
  accessor leftPadding = false;

  /** Title attribute for the link, shown as a tooltip on hover. Useful for truncated text. */
  @property({ type: String, attribute: 'link-title' })
  accessor linkTitle = '';

  /** When false (default), the flyout stays open and doesn't auto-close on mouse leave.
   * When true, the flyout will auto-collapse when the mouse leaves.
   */
  @property({ type: Boolean })
  accessor flyoutAutoCollapsed = false;

  /** Indicates whether this link contains categorical navigation (kyn-header-categories).
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-categorical' })
  accessor hasCategorical = false;

  /** Text for mobile "Back" button. */
  @state()
  accessor _searchTerm = '';

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

    const linkClasses = {
      'nav-link': true,
      active: this.isActive,
      interactive: this.level == 1,
      'padding-left': this.leftPadding,
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
          title=${ifDefined(this.linkTitle || undefined)}
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
          @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
        >
          <slot></slot>

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

            <slot
              name="links"
              @slotchange=${this._handleLinksSlotChange}
            ></slot>
          </div>
        </div>
      </div>
    `;
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
    this.hasCategorical =
      this.querySelector('kyn-header-categories') !== null ||
      this.querySelector('kyn-header-category') !== null;
    this.requestUpdate();
  }

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
        const siblingLinks = parent.querySelectorAll<
          HTMLElement & { open?: boolean }
        >(':scope > kyn-header-link[open]');

        siblingLinks.forEach((link) => {
          if (link !== this) {
            link.open = false;
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
        HTMLElement & { open?: boolean; level?: number }
      >('kyn-header-link[open]');

      allLinks.forEach((link) => {
        if (link !== this && (link as any).level === this.level) {
          link.open = false;
        }
      });
    }
  }

  private handlePointerLeave(e: PointerEvent) {
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

  /** check if flyout should auto-collapse based on own prop and parent nav's prop
   * only applies to links containing categorical nav (kyn-header-categories)
   * @internal
   */
  private _shouldAutoCollapse(): boolean {
    // Non-categorical links always auto-collapse (preserve original behavior)
    if (!this.hasCategorical) {
      return true;
    }

    if (this.flyoutAutoCollapsed) {
      return true;
    }

    const parentNav = this.closest('kyn-header-nav') as
      | (HTMLElement & { flyoutAutoCollapsed?: boolean })
      | null;
    if (parentNav && parentNav.flyoutAutoCollapsed) {
      return true;
    }

    return false;
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.slottedEls.length) {
      preventDefault = true;
      e.preventDefault();
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

      this.menuPosition = {
        top: HeaderHeight + 'px',
        left: '0px',
        minHeight: navMenuHeight + 'px',
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

  override willUpdate(changedProps: any) {
    if (changedProps.has('open') && this.open) {
      this._positionMenu();
    }
  }

  private _handleDocumentClick = (e: Event) => this.handleClickOut(e);

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
    window.addEventListener('resize', this._debounceResize);
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

    document.removeEventListener('click', this._handleDocumentClick);
    window.removeEventListener('resize', this._debounceResize);
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-link': HeaderLink;
  }
}
