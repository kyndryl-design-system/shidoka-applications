import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import LocalNavLinkScss from './localNavLink.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import chevDownIcon from '@carbon/icons/es/chevron--down/20';

/**
 * Link component for use in the global Side Navigation component.
 * @fires on-click - Captures the click event and emits the original event, level, and if default was prevented.
 * @slot unnamed - The default slot, for the link text.
 * @slot icon - Slot for an icon, level 1 links only.
 * @slot links - Slot for the next level of links, supports three levels.
 */
@customElement('kyn-local-nav-link')
export class LocalNavLink extends LitElement {
  static override styles = LocalNavLinkScss;

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Expanded state. */
  @property({ type: Boolean })
  expanded = false;

  /** Active state. */
  @property({ type: Boolean })
  active = false;

  /** Disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Link level, supports three levels.
   * @ignore
   */
  @state()
  _level = 1;

  /** The local nav expanded state.
   * @internal
   */
  @state()
  _navExpanded = false;

  /**
   * Positioning for the level 3 flyout.
   * @ignore
   */
  @state()
  flyoutStyles = {};

  /**
   * Determines if sub-links are slotted.
   * @ignore
   */
  @state()
  isSlotted = false;

  /**
   * Queries slotted links.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links', selector: 'kyn-local-nav-link' })
  navLinks!: Array<any>;

  override render() {
    const classes = {
      'level--1': this._level == 1,
      'level--2': this._level == 2,
      'level--3': this._level == 3,
      'nav-expanded': this._navExpanded,
      'link-expanded': this.expanded,
      'link-active': this.active,
      'link-disabled': this.disabled,
    };

    return html`
      <li class=${classMap(classes)}>
        <a href=${this.href} @click=${(e: Event) => this.handleClick(e)}>
          <slot name="icon"></slot>
          <span class="text">
            <slot></slot>
          </span>

          ${this.navLinks.length
            ? html`
                <span class="arrow-icon">
                  <kd-icon .icon=${chevDownIcon}></kd-icon>
                </span>
              `
            : null}
        </a>

        <ul style=${styleMap(this.flyoutStyles)}>
          <slot name="links" @slotchange=${this.handleSlotChange}></slot>
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
  }

  private handleSlotChange() {
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

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.disabled) {
      preventDefault = true;
    }

    if (this.navLinks.length) {
      preventDefault = true;
      this.expanded = !this.expanded;
    }

    if (preventDefault) {
      e.preventDefault();
    }

    this.requestUpdate();

    const event = new CustomEvent('on-click', {
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
