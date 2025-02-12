import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';
import '../../reusable/button';
import LocalNavScss from './localNav.scss';

import arrowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import pinIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/side-drawer-out.svg';

const _defaultTextStrings = {
  pin: 'Pin',
  unpin: 'Unpin',
  toggleMenu: 'Toggle Menu',
  collapse: 'Collapse',
  menu: 'Menu',
};

/**
 * The global Side Navigation component.
 * @slot unnamed - The default slot, for local nav links.
 * @slot search - Slot for a search input
 * @fires on-toggle - Captures the click event and emits the pinned state and original event details.
 */
@customElement('kyn-local-nav')
export class LocalNav extends LitElement {
  static override styles = LocalNavScss;

  /** Local nav pinned state. */
  @property({ type: Boolean })
  pinned = false;

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Local nav desktop expanded state.
   * @internal
   */
  @state()
  _expanded = false;

  /** Local nav mobile expanded state.
   * @internal
   */
  @state()
  _mobileExpanded = false;

  /** Active Link text.
   * @internal
   */
  @state()
  _activeLinkText!: string;

  /** Queries top-level slotted links.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-local-nav-link' })
  _navLinks!: any;

  /** Queries top-level slotted dividers.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-local-nav-divider' })
  _dividers!: any;

  /** Timeout function to delay flyout open.
   * @internal
   */
  _enterTimer: any;

  /** Timeout function to delay flyout close.
   * @internal
   */
  @state()
  _leaveTimer: any;

  override render() {
    return html`
      <nav
        class=${classMap({
          'nav--expanded': this._expanded || this.pinned,
          'nav--expanded-mobile': this._mobileExpanded,
          pinned: this.pinned,
        })}
        @pointerleave=${(e: PointerEvent) => this.handlePointerLeave(e)}
        @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
      >
        <button
          class="mobile-toggle"
          title=${this._textStrings.toggleMenu}
          aria-label=${this._textStrings.toggleMenu}
          @click=${this._handleMobileNavToggle}
        >
          ${this._mobileExpanded
            ? this._textStrings.collapse
            : this._activeLinkText || this._textStrings.menu}
          <span>${unsafeSVG(arrowIcon)}</span>
        </button>

        <div class="search">
          <slot name="search"></slot>
        </div>

        <div class="links">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>

        <div class="toggle-container">
          <kyn-button
            kind="tertiary"
            size="small"
            description=${this.pinned
              ? this._textStrings.unpin
              : this._textStrings.pin}
            @on-click=${(e: Event) => this._handleNavToggle(e)}
          >
            <span class="pin-icon" slot="icon"> ${unsafeSVG(pinIcon)} </span>
          </kyn-button>
        </div>
      </nav>

      <div class="overlay ${this.pinned ? 'pinned' : ''}"></div>
    `;
  }

  private _handleNavToggle(e: Event) {
    this.pinned = !this.pinned;

    const event = new CustomEvent('on-toggle', {
      detail: { pinned: this.pinned, origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private _handleMobileNavToggle() {
    this._mobileExpanded = !this._mobileExpanded;
  }

  private handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      clearTimeout(this._leaveTimer);

      this._enterTimer = setTimeout(() => {
        this._expanded = true;
      }, 150);
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      clearTimeout(this._enterTimer);

      this._leaveTimer = setTimeout(() => {
        this._expanded = false;
      }, 150);
    }
  }

  private _updateChildren() {
    this._navLinks.forEach((link: any) => {
      link._navExpanded = this._expanded || this.pinned;
      link._navExpandedMobile = this._mobileExpanded;
    });

    this._dividers.forEach((divider: any) => {
      divider._navExpanded = this._expanded || this.pinned;
    });
  }

  private handleSlotChange() {
    this._updateChildren();
    this.requestUpdate();
  }

  private _handleLinkActive(e: any) {
    this._activeLinkText = e.detail.text;
  }

  override willUpdate(changedProps: any) {
    if (
      changedProps.has('_expanded') ||
      changedProps.has('pinned') ||
      changedProps.has('_mobileExpanded')
    ) {
      this._updateChildren();
    }

    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this._expanded = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this._handleClickOut(e));
    this.addEventListener('on-link-active', (e) => this._handleLinkActive(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));
    this.removeEventListener('on-link-active', (e) =>
      this._handleLinkActive(e)
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav': LocalNav;
  }
}
