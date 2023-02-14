import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { debounce } from '../../../common/helpers/helpers';
import HeaderNavLinkScss from './headerNavLink.scss';
import '../../reusable/icon';
import downIcon from '@carbon/icons/es/chevron--down/16';

/**
 * Component for navigation links within the Header.
 * @fires on-click - Captures the click event and emits the original event details.
 */
@customElement('kyn-header-nav-link')
export class HeaderNavLink extends LitElement {
  static override styles = HeaderNavLinkScss;

  /** Link text. */
  @property({ type: String })
  text = '';

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Link level, supports two levels.
   * @ignore
   */
  @state()
  level = 1;

  /**
   * Evaluates to true if level 2 links are slotted inside to generate a flyout menu.
   * @ignore
   */
  @state()
  isSlotted = false;

  /**
   * Determines if menu should be a flyout or inline depending on screen size.
   * @ignore
   */
  @state()
  breakpointHit = false;

  override render() {
    const linkClasses = {
      'nav-link': true,
      'level--1': this.level == 1,
      'level--2': this.level == 2,
      interactive: this.breakpointHit,
    };

    const slotClasses = {
      menu__content: this.breakpointHit,
      static: !this.breakpointHit,
    };

    return html`
      <div class="menu">
        <a
          href=${this.href}
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
        >
          ${this.text}
          ${this.isSlotted && this.breakpointHit
            ? html` <kyn-icon .icon=${downIcon}></kyn-icon> `
            : null}
        </a>
        <slot class=${classMap(slotClasses)}></slot>
      </div>
    `;
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private determineIfSlotted() {
    let hasHtmlElement = false;

    const slotNodes =
      this.shadowRoot!.querySelectorAll('slot')[0].assignedNodes();

    slotNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        hasHtmlElement = true;
      }
    });

    this.isSlotted = hasHtmlElement;
  }

  private determineLevel() {
    const parentTagName = this.shadowRoot!.host.parentNode!.nodeName;
    if (parentTagName == 'KYN-HEADER-NAV') {
      this.level = 1;
    } else {
      this.level = 2;
    }
  }

  override firstUpdated() {
    this.determineIfSlotted();
    this.determineLevel();
  }

  override connectedCallback() {
    super.connectedCallback();

    this.testBreakpoint();
    window.addEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );
  }

  private testBreakpoint() {
    const nav = document.querySelector('kyn-header');
    if (nav) {
      this.breakpointHit = nav!.breakpointHit;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav-link': HeaderNavLink;
  }
}
