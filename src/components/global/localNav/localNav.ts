import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import LocalNavScss from './localNav.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import arrowIcon from '@carbon/icons/es/chevron--down/16';
import pinIcon from '@carbon/icons/es/side-panel--open/24';

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

  /** Pin open button assistive text. */
  @property({ type: String })
  pinText = 'Pin';

  /** Unpin button assistive text. */
  @property({ type: String })
  unpinText = 'Unpin';

  /** Menu toggle button assistive text. */
  @property({ type: Object })
  textStrings = {
    toggleMenu: 'Toggle Menu',
    collapse: 'Collapse',
    menu: 'Menu',
  };

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
          title=${this.textStrings.toggleMenu}
          aria-label=${this.textStrings.toggleMenu}
          @click=${this._handleMobileNavToggle}
        >
          ${this._mobileExpanded
            ? this.textStrings.collapse
            : this._activeLinkText || this.textStrings.menu}
          <kd-icon .icon=${arrowIcon}></kd-icon>
        </button>

        <div class="search">
          <slot name="search"></slot>
        </div>

        <div class="links">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>

        <div class="toggle-container">
          <button
            class="nav-toggle"
            @click=${(e: Event) => this._handleNavToggle(e)}
            title="${this.pinned ? this.unpinText : this.pinText}"
            aria-label="${this.pinned ? this.unpinText : this.pinText}"
          >
            <kd-icon class="pin-icon" .icon=${pinIcon}></kd-icon>
          </button>
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
