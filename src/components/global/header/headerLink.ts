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

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (deafult), "_blank", "_parent", "_top" */
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
      <div class="${classMap(classes)}">
        <a
          target=${this.target}
          rel=${this.rel}
          href=${this.href}
          class=${classMap(linkClasses)}
          @click=${(e: Event) => this.handleClick(e)}
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
    window?.addEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );
  }

  override disconnectedCallback() {
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
