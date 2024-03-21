import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderLinkScss from './headerLink.scss';
import '../../reusable/textInput';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import arrowIcon from '@carbon/icons/es/chevron--right/16';
import backIcon from '@carbon/icons/es/arrow--left/16';

/**
 * Component for navigation links within the Header.
 * @fires on-click - Captures the click event and emits the original event details.
 * @slot unnamed - Slot for link text/content.
 * @slot links - Slot for sublinks (up to two levels).
 */
@customElement('kyn-header-link')
export class HeaderLink extends LitElement {
  static override styles = HeaderLinkScss;

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

  /** Text for mobile "Back" button. */
  @property({ type: String })
  accessor backText = 'Back';

  /**
   * Queries any slotted HTML elements.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links', selector: 'kyn-header-link' })
  accessor slottedLinks!: Array<HTMLElement>;

  /** Timeout function to delay modal close.
   * @internal
   */
  @state()
  accessor timer: any;

  /** Menu positioning
   * @internal
   */
  @state()
  accessor menuPosition: any = {};

  override render() {
    const classes = {
      menu: this.slottedLinks.length,
      'level--1': this.level == 1,
      'level--2': this.level == 2,
      divider: this.divider,
      open: this.open,
    };

    const linkClasses = {
      'nav-link': true,
      active: this.isActive,
      interactive: this.level == 1,
    };

    const menuClasses = {
      menu__content: true,
      slotted: this.slottedLinks.length,
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
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
          @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
        >
          <slot></slot>

          ${this.slottedLinks.length
            ? html` <kd-icon class="arrow" .icon=${arrowIcon}></kd-icon> `
            : null}
        </a>

        <div
          class=${classMap(menuClasses)}
          style=${`top: ${this.menuPosition.top}px; left: ${this.menuPosition.left}px;`}
        >
          <button class="go-back" @click=${() => this._handleBack()}>
            <kd-icon .icon=${backIcon}></kd-icon>
            ${this.backText}
          </button>

          ${this.slottedLinks.length > 5
            ? html`
                <kyn-text-input
                  hideLabel
                  placeholder=${this.searchLabel}
                  @on-input=${(e: Event) => this._handleSearch(e)}
                >
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
    const SearchTerm = e.detail.value.toLowerCase();

    this.slottedLinks.forEach((link) => {
      // get link text
      const nodes: any = link.shadowRoot?.querySelector('slot')?.assignedNodes({
        flatten: true,
      });
      let linkText = '';
      for (let i = 0; i < nodes.length; i++) {
        linkText += nodes[i].textContent.trim();
      }

      if (linkText.toLowerCase().includes(SearchTerm)) {
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
    if (e.pointerType === 'mouse') {
      clearTimeout(this.timer);
      this.open = true;
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && document.activeElement !== this) {
      this.timer = setTimeout(() => {
        this.open = false;
        clearTimeout(this.timer);
      }, 200);
    }
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.slottedLinks.length) {
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
    }
  }

  private determineLevel() {
    const parentTagName = this.shadowRoot!.host.parentNode!.nodeName;

    if (parentTagName === 'KYN-HEADER-LINK') {
      this.level = 2;
    } else {
      if (window.innerWidth < 672 && parentTagName === 'KYN-HEADER-FLYOUT') {
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

    const LinkHalf = LinkBounds.top + LinkBounds.height / 2;
    const MenuHalf = MenuBounds.height / 2;

    const Top =
      LinkHalf + MenuHalf > window.innerHeight
        ? LinkHalf - MenuHalf - (LinkHalf + MenuHalf - window.innerHeight)
        : LinkHalf - MenuHalf;

    // const Top =
    //   LinkBounds.top + MenuBounds.height - Padding > window.innerHeight
    //     ? LinkBounds.top -
    //       (LinkBounds.top + MenuBounds.height - window.innerHeight)
    //     : LinkBounds.top - Padding;

    this.menuPosition = {
      top: Top,
      left: LinkBounds.right + Padding,
    };
  }

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

    window?.addEventListener(
      'resize',
      debounce(() => {
        this.determineLevel();
      })
    );
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));

    window?.removeEventListener(
      'resize',
      debounce(() => {
        this.determineLevel();
      })
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav-link': HeaderLink;
  }
}
