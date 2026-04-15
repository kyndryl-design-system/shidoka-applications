import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';
import { debounce } from '../../../common/helpers/helpers';

import '../../reusable/button';

import LocalNavScss from './localNav.scss?inline';

import arrowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import pinIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/side-drawer-out.svg';

const DESKTOP_BREAKPOINT = 672;
const MANUAL_TOGGLE_EXPANDED_WIDTH_CSS_VAR =
  '--_local-nav-manual-expanded-width';

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
 * @fires on-toggle - Captures the click event and emits the pinned state and original event details. `detail:{ pinned: boolean, origEvent: Event }`
 */
@customElement('kyn-local-nav')
export class LocalNav extends LitElement {
  static override styles = unsafeCSS(LocalNavScss);

  /** Local nav pinned state. */
  @property({ type: Boolean })
  accessor pinned = false;

  /** Enables the manual-toggle interaction mode.
   * Starts pinned/expanded by default and disables hover expansion.
   */
  @property({ type: Boolean, attribute: 'manual-toggle-variant' })
  accessor manualToggleVariant = false;

  /** Whether the `manual-toggle` variant should start collapsed.
   * By default, `manual-toggle` starts pinned/expanded.
   */
  @property({ type: Boolean, attribute: 'collapsed-by-default' })
  accessor collapsedByDefault = false;

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /** Local nav desktop expanded state.
   * @internal
   */
  @state()
  accessor _expanded = false;

  /** Local nav mobile expanded state.
   * @internal
   */
  @state()
  accessor _mobileExpanded = false;

  /** Active Link text.
   * @internal
   */
  @state()
  accessor _activeLinkText!: string;

  /** Queries top-level slotted links.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-local-nav-link' })
  accessor _navLinks!: HTMLElement[];

  /** Queries top-level slotted dividers.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-local-nav-divider' })
  accessor _dividers!: HTMLElement[];

  /** Timeout function to delay flyout open.
   * @internal
   */
  private _enterTimer: number | null = null;

  /** Timeout function to delay flyout close.
   * @internal
   */
  @state()
  accessor _leaveTimer: number | null = null;

  /** @internal */
  @query('nav')
  accessor _navEl!: HTMLElement;

  /** @ignore */
  private readonly _onDocumentClick = (e: Event) => this._handleClickOut(e);

  /** @ignore */
  private readonly _onLinkActive = (e: Event) =>
    this._handleLinkActive(e as CustomEvent<{ text: string }>);

  /** @ignore */
  private readonly _onWindowResize = () => this._queueManualToggleWidthSync();

  /** @ignore */
  private _manualToggleWidthSyncFrame: number | null = null;

  override render() {
    return html`
      <nav
        class=${classMap({
          'nav--expanded': this._expanded || this.pinned,
          'nav--expanded-mobile': this._mobileExpanded,
          'nav--manual-toggle': this.manualToggleVariant,
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
          ${unsafeSVG(arrowIcon)}
        </button>

        ${this.manualToggleVariant
          ? html`
              <div class="manual-toggle-container">
                <kyn-button
                  kind="ghost"
                  size="small"
                  description=${this.pinned
                    ? this._textStrings.unpin
                    : this._textStrings.pin}
                  @on-click=${(e: Event) => this._handleNavToggle(e)}
                >
                  <span class="pin-icon" slot="icon">
                    ${unsafeSVG(pinIcon)}
                  </span>
                </kyn-button>
              </div>
            `
          : null}

        <div class="search">
          <slot name="search"></slot>
        </div>

        <div class="links">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>

        ${!this.manualToggleVariant
          ? html`
              <div class="toggle-container">
                <kyn-button
                  kind="ghost"
                  size="small"
                  description=${this.pinned
                    ? this._textStrings.unpin
                    : this._textStrings.pin}
                  @on-click=${(e: Event) => this._handleNavToggle(e)}
                >
                  <span class="pin-icon" slot="icon">
                    ${unsafeSVG(pinIcon)}
                  </span>
                </kyn-button>
              </div>
            `
          : null}
      </nav>

      <div class="overlay ${this.pinned ? 'pinned' : ''}"></div>
    `;
  }

  private _handleNavToggle(e: Event) {
    this.pinned = !this.pinned;
    this._expanded = false;

    const event = new CustomEvent('on-toggle', {
      detail: { pinned: this.pinned, origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private _handleMobileNavToggle() {
    this._mobileExpanded = !this._mobileExpanded;
  }

  private handlePointerEnter(e: PointerEvent) {
    if (this.manualToggleVariant) {
      return;
    }

    if (e.pointerType === 'mouse') {
      if (this._leaveTimer !== null) clearTimeout(this._leaveTimer);

      this._enterTimer = window.setTimeout(() => {
        this._expanded = true;
      }, 150);
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (this.manualToggleVariant) {
      return;
    }

    if (e.pointerType === 'mouse') {
      if (this._enterTimer !== null) clearTimeout(this._enterTimer);

      this._leaveTimer = window.setTimeout(() => {
        this._expanded = false;
      }, 150);
    }
  }

  private _updateChildren() {
    (this._navLinks ?? []).forEach((link: HTMLElement) => {
      (link as any)._navExpanded = this._expanded || this.pinned;
      (link as any)._navExpandedMobile = this._mobileExpanded;
      (link as any)._manualToggleVariant = this.manualToggleVariant;
    });

    (this._dividers ?? []).forEach((divider: HTMLElement) => {
      (divider as any)._navExpanded =
        this._expanded || this.pinned || this._mobileExpanded;
    });
  }

  private handleSlotChange() {
    this._updateChildren();
    this._queueManualToggleWidthSync();
    this.requestUpdate();
  }

  private _handleLinkActive(e: CustomEvent<{ text: string }>) {
    this._activeLinkText = e.detail.text;
  }

  /** @ignore */
  private get _isDesktopViewport(): boolean {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  private _queueManualToggleWidthSync() {
    if (this._manualToggleWidthSyncFrame !== null) {
      cancelAnimationFrame(this._manualToggleWidthSyncFrame);
    }

    this._manualToggleWidthSyncFrame = requestAnimationFrame(() => {
      this._manualToggleWidthSyncFrame = null;
      this._syncManualToggleExpandedWidth();
    });
  }

  private _syncManualToggleExpandedWidth() {
    if (
      !this.manualToggleVariant ||
      !this.pinned ||
      !this._isDesktopViewport ||
      !this._navEl
    ) {
      if (!this.manualToggleVariant) {
        this.style.removeProperty(MANUAL_TOGGLE_EXPANDED_WIDTH_CSS_VAR);
      }
      return;
    }

    const previousWidth = this.style.getPropertyValue(
      MANUAL_TOGGLE_EXPANDED_WIDTH_CSS_VAR
    );

    this.style.removeProperty(MANUAL_TOGGLE_EXPANDED_WIDTH_CSS_VAR);
    const measuredWidth = Number.parseFloat(
      getComputedStyle(this._navEl).width
    );

    if (Number.isNaN(measuredWidth) || measuredWidth <= 0) {
      if (previousWidth) {
        this.style.setProperty(
          MANUAL_TOGGLE_EXPANDED_WIDTH_CSS_VAR,
          previousWidth
        );
      }
      return;
    }

    this.style.setProperty(
      MANUAL_TOGGLE_EXPANDED_WIDTH_CSS_VAR,
      `${Math.ceil(measuredWidth)}px`
    );
  }

  override willUpdate(changedProps: Map<string | number | symbol, unknown>) {
    if (
      this.manualToggleVariant &&
      (changedProps.has('manualToggleVariant') ||
        changedProps.has('collapsedByDefault'))
    ) {
      this.pinned = !this.collapsedByDefault;
      this._expanded = false;
    }

    if (
      changedProps.has('_expanded') ||
      changedProps.has('pinned') ||
      changedProps.has('_mobileExpanded') ||
      changedProps.has('manualToggleVariant')
    ) {
      this._updateChildren();
    }

    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override updated(changedProps: Map<string | number | symbol, unknown>) {
    if (
      changedProps.has('pinned') ||
      changedProps.has('manualToggleVariant') ||
      changedProps.has('_expanded')
    ) {
      this._queueManualToggleWidthSync();
    }
  }

  private _handleClickOut(e: Event) {
    if (this.manualToggleVariant) {
      return;
    }

    if (!e.composedPath().includes(this)) {
      this._expanded = false;
    }
  }

  /** Morph header on scroll.
   * @internal */
  private _handleScroll() {
    if (window.scrollY > 0) {
      this._navEl.classList.add('scrolled');
    } else {
      this._navEl.classList.remove('scrolled');
    }
  }

  /** @internal */
  private _debounceScroll = debounce(() => {
    this._handleScroll();
  });

  override firstUpdated() {
    this._handleScroll();
    this._queueManualToggleWidthSync();
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', this._onDocumentClick);
    this.addEventListener('on-link-active', this._onLinkActive);
    window.addEventListener('scroll', this._debounceScroll);
    window.addEventListener('resize', this._onWindowResize);
  }

  override disconnectedCallback() {
    if (this._manualToggleWidthSyncFrame !== null) {
      cancelAnimationFrame(this._manualToggleWidthSyncFrame);
      this._manualToggleWidthSyncFrame = null;
    }
    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('on-link-active', this._onLinkActive);
    window.removeEventListener('scroll', this._debounceScroll);
    window.removeEventListener('resize', this._onWindowResize);

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav': LocalNav;
  }
}
