import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import SideNavLinkScss from './sideNavLink.scss';
import '../../reusable/icon/icon';

import chevDownIcon from '@carbon/icons/es/chevron--down/16';
import chevRightIcon from '@carbon/icons/es/chevron--right/16';

/**
 * Link component for use in the global Side Navigation component.
 * @fires on-click - Captures the click event and emits the original event, level, and if default was prevented.
 * @slot unnamed - The default slot, for the link text.
 * @slot icon - Slot for an icon, level 1 links only.
 * @slot links - Slot for the next level of links, supports three levels.
 */
@customElement('kyn-side-nav-link')
export class SideNavLink extends LitElement {
  static override styles = SideNavLinkScss;

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Level 1 link expanded state. */
  @property({ type: Boolean })
  expanded = false;

  /** Link level, supports three levels.
   * @ignore
   */
  @state()
  level = 1;

  /** The side nav collapsed state.
   * @ignore
   */
  @state()
  collapsed = false;

  /**
   * Determines if sub-links are slotted.
   * @ignore
   */
  @state()
  isSlotted = false;

  /**
   * Number of slotted links.
   * @ignore
   */
  @state()
  numSublinks = 0;

  /**
   * Positioning for the level 3 flyout.
   * @ignore
   */
  @state()
  flyoutStyles = {};

  override render() {
    const classes = {
      'level--1': this.level == 1,
      'level--2': this.level == 2,
      'level--3': this.level == 3,
      'nav-collapsed': this.collapsed,
      'link-expanded': this.expanded,
    };

    return html`
      <li class=${classMap(classes)}>
        <a
          href=${this.href}
          @click=${(e: Event) => this.handleClick(e)}
          @mouseover="${(e: Event) => this.onNavLinkHover(e)}"
          @focus="${(e: Event) => this.onNavLinkHover(e)}"
        >
          <slot name="icon"></slot>
          <span class="text"><slot></slot></span>

          ${this.isSlotted
            ? html`
                <span class="arrow-icon">
                  ${this.level == 1
                    ? html`<kyn-icon .icon=${chevDownIcon}></kyn-icon>`
                    : null}
                  ${this.level == 2
                    ? html`<kyn-icon .icon=${chevRightIcon}></kyn-icon>`
                    : null}
                </span>
              `
            : null}
        </a>

        <ul style=${styleMap(this.flyoutStyles)}>
          <slot name="links"></slot>
        </ul>
      </li>
    `;
  }

  override firstUpdated() {
    this.determineIfSlotted();
    this.determineLevel();
  }

  private determineIfSlotted() {
    let hasHtmlElement = false;
    let nodeCount = 0;

    const slotNodes =
      this.shadowRoot!.querySelectorAll('slot')[2].assignedNodes();

    slotNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        hasHtmlElement = true;
        nodeCount++;
      }
    });

    this.isSlotted = hasHtmlElement;
    this.numSublinks = nodeCount;
  }

  private determineLevel() {
    const parentNode = this.shadowRoot!.host.parentNode;
    if (parentNode!.nodeName == 'KYN-SIDE-NAV') {
      this.level = 1;
    } else if (parentNode!.parentNode!.nodeName == 'KYN-SIDE-NAV') {
      this.level = 2;
    } else {
      this.level = 3;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document
      .querySelector('kyn-side-nav')!
      .addEventListener('on-toggle', (e: any = {}) => {
        this.collapsed = e.detail.collapsed;
      });
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.level == 1 && this.isSlotted) {
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
        level: this.level,
        defaultPrevented: preventDefault,
      },
    });
    this.dispatchEvent(event);
  }

  private onNavLinkHover(e: Event) {
    const target: any = e.currentTarget;
    const headerHeight = 48,
      linkHeight = 38,
      scrollTop = document
        .querySelector('kyn-side-nav')!
        .shadowRoot?.querySelector('nav ul')!.scrollTop;
    const flyoutHeight = this.isSlotted ? linkHeight * this.numSublinks : 0;

    // calculate flyout menu positioning and max height for overflow
    let top =
      target!.offsetTop - scrollTop! + headerHeight + flyoutHeight >
      window.innerHeight
        ? window.innerHeight - flyoutHeight - headerHeight
        : target!.offsetTop - scrollTop!;
    top = top < 0 ? 0 : top;
    const maxHeight = window.innerHeight - headerHeight;

    this.flyoutStyles = {
      top: top + 'px',
      'max-height': maxHeight + 'px',
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-side-nav-link': SideNavLink;
  }
}
