import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import HeaderLinkScss from './headerLink.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import downIcon from '@carbon/icons/es/caret--down/16';

/**
 * Component for navigation links within the Header.
 * @fires on-click - Captures the click event and emits the original event details.
 * @slot unnamed - Slot for link text/content.
 * @slot links - Slot for sublinks (up to two levels).
 */
@customElement('kyn-header-link')
export class HeaderLink extends LitElement {
  static override styles = HeaderLinkScss;

  /** Link open state. */
  @property({ type: Boolean })
  open = false;

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (default), "_blank", "_parent", "_top" */
  @property({ type: String })
  target = '_self' as const;

  /** Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship */
  @property({ type: String })
  rel = '';

  /** Link active state, for example when URL path matches link href. */
  @property({ type: Boolean })
  isActive = false;

  /** Link level, supports two levels.
   * @ignore
   */
  @state()
  level = 1;

  /** Adds a 1px shadow to the bottom of the link for small screens/full-size menu view. */
  @property({ type: Boolean })
  divider = false;

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
      menu: this.isSlotted,
      'breakpoint-hit': this.breakpointHit,
      divider: this.divider,
      open: this.open,
    };

    const linkClasses = {
      'nav-link': true,
      active: this.isActive,
      'level--1': this.level == 1,
      'level--2': this.level == 2,
      interactive: this.level == 1 && this.breakpointHit,
    };

    const slotClasses = {
      menu__content: this.breakpointHit,
      static: !this.breakpointHit,
    };

    return html`
      <div
        class="${classMap(classes)}"
        @pointerleave=${(e: PointerEvent) => this.handlePointerLeave(e)}
      >
        <a
          target=${this.target}
          rel=${this.rel}
          href=${this.href}
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
          @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
        >
          <slot></slot>

          ${this.slottedElements.length && this.breakpointHit
            ? html` <kd-icon .icon=${downIcon}></kd-icon> `
            : null}
        </a>
        <slot name="links" class=${classMap(slotClasses)}></slot>
      </div>
    `;
  }

  private handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      this.open = true;
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      this.open = false;
    }
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.slottedElements.length) {
      preventDefault = true;
      e.preventDefault();
      this.open = !this.open;
    }

    const event = new CustomEvent('on-click', {
      detail: { origEvent: e, defaultPrevented: preventDefault },
    });
    this.dispatchEvent(event);
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
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

    document.addEventListener('click', (e) => this.handleClickOut(e));

    this.testBreakpoint();
    window?.addEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));

    window?.removeEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );

    super.disconnectedCallback();
  }

  private testBreakpoint() {
    const nav = querySelectorDeep('kyn-header');
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
