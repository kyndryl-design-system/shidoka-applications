import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import LocalNavLinkScss from './localNavLink.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import arrowIcon from '@carbon/icons/es/chevron--right/16';
import backIcon from '@carbon/icons/es/arrow--left/16';

/**
 * Link component for use in the global Side Navigation component.
 * @fires on-click - Captures the click event and emits the original event, level, and if default was prevented.
 * @slot unnamed - The default slot, for the link text.
 * @slot icon - Slot for an icon. Use 16px size.
 * @slot links - Slot for the next level of links, supports three levels.
 */
@customElement('kyn-local-nav-link')
export class LocalNavLink extends LitElement {
  static override styles = LocalNavLinkScss;

  /** Link url. */
  @property({ type: String })
  accessor href = '';

  /** Expanded state. */
  @state()
  accessor _expanded = false;

  /** Active state. */
  @property({ type: Boolean, reflect: true })
  accessor active = false;

  /** Disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Text for mobile "Back" button. */
  @property({ type: String })
  accessor backText = 'Back';

  /** Link level, supports three levels.
   * @ignore
   */
  @state()
  accessor _level = 1;

  /** The local nav expanded state.
   * @internal
   */
  @state()
  accessor _navExpanded = false;

  /** The slotted text.
   * @internal
   */
  @state()
  accessor _text = '';

  /**
   * Queries slotted links.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links', selector: 'kyn-local-nav-link' })
  accessor navLinks!: Array<any>;

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
      'level--1': this._level == 1,
      'level--2': this._level == 2,
      'level--3': this._level == 3,
      'nav-expanded': this._navExpanded,
      'link-expanded': this._expanded,
      'link-active': this.active,
      'link-disabled': this.disabled,
    };

    return html`
      <li
        class=${classMap(classes)}
        @pointerleave=${(e: PointerEvent) => this.handlePointerLeave(e)}
        @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
      >
        <a href=${this.href} @click=${(e: Event) => this.handleClick(e)}>
          <slot name="icon"></slot>
          <span class="text">
            <slot
              @slotchange=${(e: Event) => this._handleTextSlotChange(e)}
            ></slot>
          </span>

          ${this.navLinks.length
            ? html`
                <span class="arrow-icon">
                  <kd-icon .icon=${arrowIcon}></kd-icon>
                </span>
              `
            : null}
        </a>

        <ul
          class="${this.navLinks.length ? 'has-links' : ''}"
          style=${this.navLinks.length
            ? `top: ${this.menuPosition.top}px; left: ${this.menuPosition.left}px;`
            : ''}
        >
          ${this.navLinks.length
            ? html`
                <button class="go-back" @click=${() => this._handleBack()}>
                  <kd-icon .icon=${backIcon}></kd-icon>
                  ${this.backText}
                </button>
              `
            : null}

          <div class="category">${this._text}</div>

          <slot name="links" @slotchange=${this._handleSlotChange}></slot>
        </ul>
      </li>
    `;
  }

  override firstUpdated() {
    this.determineLevel();
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('_navExpanded')) {
      this.updateChildren();
    }

    if (
      changedProps.has('_expanded') &&
      this._expanded &&
      this.navLinks.length
    ) {
      this._positionMenu();
    }
  }

  private _handleTextSlotChange(e: Event) {
    const Slot: any = e.target;
    let text = '';

    const nodes = Slot.assignedNodes({
      flatten: true,
    });

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent.trim();
    }

    this._text = text;

    this.requestUpdate();
  }

  private _handleSlotChange() {
    this.updateChildren();
    this.requestUpdate();
  }

  private updateChildren() {
    this.navLinks.forEach((link: any) => {
      link._navExpanded = this._navExpanded;
    });
  }

  private determineLevel() {
    const parentNode = this.shadowRoot!.host.parentNode;
    if (parentNode!.nodeName === 'KYN-LOCAL-NAV') {
      this._level = 1;
    } else if (parentNode!.parentNode!.nodeName === 'KYN-LOCAL-NAV') {
      this._level = 2;
    } else {
      this._level = 3;
    }
  }

  private handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse' && this.navLinks.length) {
      clearTimeout(this.timer);
      this._expanded = true;
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (
      e.pointerType === 'mouse' &&
      document.activeElement !== this &&
      this.navLinks.length
    ) {
      this.timer = setTimeout(() => {
        this._expanded = false;
        clearTimeout(this.timer);
      }, 300);
    }
  }

  private _positionMenu() {
    // determine submenu positioning
    const LinkBounds: any = this.getBoundingClientRect();
    const MenuBounds: any = this.shadowRoot
      ?.querySelector('ul')
      ?.getBoundingClientRect();
    const Padding = 8;

    const LinkHalf = LinkBounds.top + LinkBounds.height / 2;
    const MenuHalf = MenuBounds.height / 2;

    const Top =
      LinkHalf + MenuHalf > window.innerHeight
        ? LinkHalf - MenuHalf - (LinkHalf + MenuHalf - window.innerHeight)
        : LinkHalf - MenuHalf;
    const Left = LinkBounds.right + Padding;

    this.menuPosition = {
      top: Top,
      left: Left < 320 ? 320 : Left,
    };
  }

  private _handleBack() {
    this._expanded = false;
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.disabled) {
      preventDefault = true;
    }

    if (this.navLinks.length) {
      preventDefault = true;
      this._expanded = !this._expanded;
    }

    if (preventDefault) {
      e.preventDefault();
    }

    this.requestUpdate();

    const event = new CustomEvent('on-click', {
      composed: true,
      bubbles: true,
      detail: {
        origEvent: e,
        level: this._level,
        defaultPrevented: preventDefault,
      },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav-link': LocalNavLink;
  }
}
