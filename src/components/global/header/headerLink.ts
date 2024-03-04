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
  open = false;

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (default), "_blank", "_parent", "_top" */
  @property({ type: String })
  target = '_self' as const;

  /** Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship */
  @property({ type: String })
  rel = '';

  /** Link active state, for example when URL path matches link href. */
  @property({ type: Boolean })
  isActive = false;

  /** Link level, supports two levels.
   * @ignore
   */
  @state()
  level = 1;

  /** Adds a 1px shadow to the bottom of the link. */
  @property({ type: Boolean })
  divider = false;

  /** Label for sub-menu link search input, which is visible with > 5 sub-links. */
  @property({ type: String })
  searchLabel = 'Search';

  /**
   * Queries any slotted HTML elements.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links', selector: 'kyn-header-link' })
  slottedLinks!: Array<HTMLElement>;

  /** Timeout function to delay modal close.
   * @internal
   */
  @state()
  timer: any;

  /** Menu positioning
   * @internal
   */
  @state()
  menuPosition: any = {};

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
            Back
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
    if (e.pointerType === 'mouse') {
      this.timer = setTimeout(() => {
        this.open = false;
        clearTimeout(this.timer);
      }, 300);
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

    console.log(parentTagName);
    if (parentTagName === 'KYN-HEADER-LINK') {
      this.level = 2;
    } else {
      if (window.innerWidth < 672 && parentTagName !== 'KYN-HEADER-NAV') {
        this.level = 2;
      } else {
        this.level = 1;
      }
    }
  }

  override firstUpdated() {
    this.determineLevel();
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('open') && this.open) {
      // determine submenu positioning
      const LinkBounds: any = this.getBoundingClientRect();
      const MenuBounds: any = this.shadowRoot
        ?.querySelector('.menu__content')
        ?.getBoundingClientRect();
      const Padding = 8;

      const Top =
        LinkBounds.top + MenuBounds.height > window.innerHeight
          ? LinkBounds.top -
            Padding -
            (LinkBounds.top + MenuBounds.height - window.innerHeight)
          : LinkBounds.top - Padding;

      this.menuPosition = {
        top: Top,
        left: LinkBounds.right + 8,
      };
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
