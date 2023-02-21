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
import '../../reusable/icon/icon';
import downIcon from '@carbon/icons/es/chevron--down/16';

/**
 * Component for navigation links within the Header.
 * @fires on-click - Captures the click event and emits the original event details.
 * @slot unnamed - Slot for link text/content.
 * @slot links - Slot for sublinks (up to two levels).
 */
@customElement('kyn-header-link')
export class HeaderLink extends LitElement {
  static override styles = HeaderLinkScss;

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Link level, supports two levels.
   * @ignore
   */
  @state()
  level = 1;

  /**
   * Determines if menu should be a flyout or inline depending on screen size.
   * @ignore
   */
  @state()
  breakpointHit = false;

  /**
   * Evaluates to true if level 2 links are slotted inside to generate a flyout menu.
   * @ignore
   */
  @state()
  isSlotted = false;

  /**
   * Queries any slotted HTML elements.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links' })
  slottedElements!: Array<HTMLElement>;

  override render() {
    const classes = {
      menu: true,
      'breakpoint-hit': this.breakpointHit,
    };

    const linkClasses = {
      'nav-link': true,
      'level--1': this.level == 1,
      'level--2': this.level == 2,
      interactive: this.level == 1 && this.breakpointHit,
    };

    const slotClasses = {
      menu__content: this.breakpointHit,
      static: !this.breakpointHit,
    };

    return html`
      <div class="${classMap(classes)}">
        <a
          href=${this.href}
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
        >
          <slot></slot>

          ${this.slottedElements.length && this.breakpointHit
            ? html` <kyn-icon .icon=${downIcon}></kyn-icon> `
            : null}
        </a>
        <slot name="links" class=${classMap(slotClasses)}></slot>
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
    this.isSlotted = this.slottedElements.length ? true : false;
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
    'kyn-header-nav-link': HeaderLink;
  }
}
