import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import HeaderScss from './header.scss';
import logo from '@kyndryl-design-system/shidoka-foundation/assets/svg/kyndryl-logo.svg';

/**
 * The global Header component.
 * @fires on-menu-toggle - Captures the menu toggle click event and emits the menu open state in the detail.
 * @fires on-root-link-click - Captures the logo link click event and emits the original event details.
 * @slot unnamed - The default slot for all empty space right of the logo/title.
 * @slot logo - Slot for the logo, will overwrite the default logo.
 * @slot left - Slot left of the logo, intended for the header nav.
 * @slot center - Slot between logo/title and right flyouts.
 */
@customElement('kyn-header')
export class Header extends LitElement {
  static override styles = HeaderScss;

  /** URL for the header logo link. Should target the application home page. */
  @property({ type: String })
  rootUrl = '/';

  /** App title text next to logo.  Hidden on smaller screens. */
  @property({ type: String })
  appTitle = '';

  /** Queries for slotted header-nav.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-header-nav' })
  navEls!: any;

  /** Queries for all slotted elements.
   * @internal
   */
  @queryAssignedElements()
  assignedElements!: any;

  /** Queries for elements in left slot.
   * @internal
   */
  @queryAssignedElements({ slot: 'left' })
  leftEls!: any;

  /** header-nav open state
   * @internal
   */
  @state()
  _navOpen = false;

  /** header-flyouts open state
   * @internal
   */
  @state()
  _flyoutsOpen = false;

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
          @click="${(e: Event) => this.handleRootLinkClick(e)}"
        >
          <slot name="logo" @slotchange=${this.handleSlotChange}>
            ${unsafeHTML(logo)}
          </slot>

          <span class="title">${this.appTitle}</span>
        </a>

        <slot name="center"></slot>

        <div class="header__right">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </header>
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
    this._flyoutsOpen = e.detail.open;
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('on-nav-toggle', (e: Event) =>
      this._handleNavToggle(e)
    );
    document.addEventListener('on-flyouts-toggle', (e: Event) =>
      this._handleFlyoutsToggle(e)
    );
  }

  override disconnectedCallback() {
    document.removeEventListener('on-nav-toggle', (e: Event) =>
      this._handleNavToggle(e)
    );
    document.removeEventListener('on-flyouts-toggle', (e: Event) =>
      this._handleFlyoutsToggle(e)
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header': Header;
  }
}
