import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderScss from './header.scss?inline';
import logo from '@kyndryl-design-system/shidoka-foundation/assets/svg/kyndryl-logo.svg';

/**
 * The global Header component.
 * @fires on-menu-toggle - Captures the menu toggle click event and emits the menu open state in the detail. `detail:{ origEvent: Event}`
 * @fires on-root-link-click - Captures the logo link click event and emits the original event details. `detail:{ origEvent: Event}`
 * @slot unnamed - The default slot for all empty space right of the logo/title.
 * @slot logo - Slot for the logo, will overwrite the default logo.
 * @slot left - Slot left of the logo, intended for the header nav.
 * @slot center - Slot between logo/title and right flyouts.
 */
@customElement('kyn-header')
export class Header extends LitElement {
  static override styles = unsafeCSS(HeaderScss);

  /** URL for the header logo link. Should target the application home page. */
  @property({ type: String })
  accessor rootUrl = '/';

  /** App title text next to logo.  Hidden on smaller screens. */
  @property({ type: String })
  accessor appTitle = '';

  /** Queries for slotted header-nav.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-header-nav' })
  accessor navEls!: any;

  /** Queries for all slotted elements.
   * @internal
   */
  @queryAssignedElements()
  accessor assignedElements!: any;

  /** Queries for elements in left slot.
   * @internal
   */
  @queryAssignedElements({ slot: 'left' })
  accessor leftEls!: any;

  /** header-nav open state
   * @internal
   */
  @state()
  accessor _navOpen = false;

  /** header-flyouts open state
   * @internal
   */
  @state()
  accessor _flyoutsOpen = false;

  /** @internal */
  @query('header')
  accessor _headerEl!: HTMLElement;

  override render() {
    const classes = {
      header: true,
      'left-slotted': this.leftEls.length,
      'child-open': this._navOpen || this._flyoutsOpen,
    };

    return html`
      <header class="${classMap(classes)}">
        <slot name="left" @slotchange=${this.handleSlotChange}></slot>

        <a
          href="${this.rootUrl}"
          class="logo-link interactive"
          aria-label="${this.rootUrl}"
          @click="${(e: Event) => this.handleRootLinkClick(e)}"
        >
          <slot name="logo" @slotchange=${this.handleSlotChange}>
            ${unsafeHTML(logo)}
          </slot>
        </a>

        <span class="title">${this.appTitle}</span>

        <slot name="center"></slot>

        <div class="header__right">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>

        <div class="background"></div>
      </header>

      <div class="overlay"></div>
    `;
  }

  private handleSlotChange() {
    this.requestUpdate();
  }

  private handleRootLinkClick(e: Event) {
    const event = new CustomEvent('on-root-link-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private _handleNavToggle(e: any) {
    this._navOpen = e.detail.open;
  }

  private _handleFlyoutsToggle(e: any) {
    this._flyoutsOpen = e.detail.open || e.detail.childrenOpen;
  }

  /** Bound nav toggle handler for add/remove symmetry.
   * @internal
   */
  private readonly _boundHandleNavToggle = (e: Event) =>
    this._handleNavToggle(e);

  /** Bound flyouts toggle handler for add/remove symmetry.
   * @internal
   */
  private readonly _boundHandleFlyoutsToggle = (e: Event) =>
    this._handleFlyoutsToggle(e);

  /** Morph header on scroll.
   * @internal */
  private _handleScroll() {
    if (window.scrollY > 0) {
      this._headerEl.classList.add('scrolled');
    } else {
      this._headerEl.classList.remove('scrolled');
    }
  }

  /** @internal */
  private _debounceScroll = debounce(() => {
    this._handleScroll();
  });

  override firstUpdated() {
    this._handleScroll();
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );
    this.addEventListener(
      'on-flyouts-toggle',
      this._boundHandleFlyoutsToggle as EventListener
    );

    window.addEventListener('scroll', this._debounceScroll);
  }

  override disconnectedCallback() {
    this.removeEventListener(
      'on-nav-toggle',
      this._boundHandleNavToggle as EventListener
    );
    this.removeEventListener(
      'on-flyouts-toggle',
      this._boundHandleFlyoutsToggle as EventListener
    );

    window.removeEventListener('scroll', this._debounceScroll);

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header': Header;
  }
}
