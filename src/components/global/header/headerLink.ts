import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderLinkScss from './headerLink.scss?inline';
import '../../reusable/textInput';
import arrowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import backIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/search.svg';

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

  /** Link open state. */
  @property({ type: Boolean })
  accessor open = false;

  /** Link url. */
  @property({ type: String })
  accessor href = '';

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (default), "_blank", "_parent", "_top" */
  @property({ type: String })
  accessor target = '_self' as const;

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

  /** Text for mobile "Back" button. */
  @property({ type: String })
  accessor backText = 'Back';

  /** Add left padding when icon is not provided to align text with links that do have icons. */
  @property({ type: Boolean })
  accessor leftPadding = false;

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
      open: this.open,
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
          style=${`top: ${this.menuPosition.top}px; left: ${this.menuPosition.left}px;`}
        >
          <button class="go-back" @click=${() => this._handleBack()}>
            <span>${unsafeSVG(backIcon)}</span>
            ${this.backText}
          </button>

          ${Links.length >= this.searchThreshold
            ? html`
                <kyn-text-input
                  hideLabel
                  size="sm"
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

          <slot name="links" @slotchange=${this._handleLinksSlotChange}></slot>
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

  private _handleBack() {
    this.open = false;
  }

  private _handleLinksSlotChange() {
    this.requestUpdate();
  }

  private handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse' && this.slottedEls.length) {
      clearTimeout(this._leaveTimer);

      this._enterTimer = setTimeout(() => {
        this.open = true;
      }, 150);
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (
      e.pointerType === 'mouse' &&
      this.slottedEls.length &&
      this._searchTerm === ''
    ) {
      clearTimeout(this._enterTimer);

      this._leaveTimer = setTimeout(() => {
        this.open = false;
      }, 150);
    }
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
    const ParentNode: any = this.parentNode;
    const GrandparentNode: any = ParentNode.parentNode;

    if (ParentNode.nodeName === 'KYN-HEADER-LINK') {
      this.level = ParentNode.level + 1;
    } else if (
      ParentNode.nodeName === 'KYN-HEADER-CATEGORY' &&
      GrandparentNode.nodeName === 'KYN-HEADER-LINK'
    ) {
      this.level = GrandparentNode.level + 1;
    } else {
      if (
        window.innerWidth < 672 &&
        ParentNode.nodeName === 'KYN-HEADER-FLYOUT'
      ) {
        this.level = 2;
      } else {
        this.level = 1;
      }
    }
  }

  private _positionMenu() {
    // determine submenu positioning
    const LinkBounds: any = this.getBoundingClientRect();
    const MenuBounds: any = this.shadowRoot
      ?.querySelector('.menu__content')
      ?.getBoundingClientRect();
    const Padding = 8;
    const HeaderHeight = 56;

    const LinkHalf = LinkBounds.top + LinkBounds.height / 2;
    const MenuHalf = MenuBounds.height / 2;

    const Top =
      LinkHalf + MenuHalf > window.innerHeight
        ? LinkHalf - MenuHalf - (LinkHalf + MenuHalf - window.innerHeight)
        : LinkHalf - MenuHalf;

    this.menuPosition = {
      top: Top < HeaderHeight ? HeaderHeight : Top,
      left: LinkBounds.right + Padding,
    };
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

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this.handleClickOut(e));

    window?.addEventListener('resize', this._debounceResize);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));

    window?.removeEventListener('resize', this._debounceResize);

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-link': HeaderLink;
  }
}
