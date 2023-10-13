import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import HeaderFlyoutScss from './headerFlyout.scss';

/**
 * Component for header flyout items.
 * @slot unnamed - Slot for flyout menu content.
 * @slot button - Slot for button/toggle content.
 */
@customElement('kyn-header-flyout')
export class HeaderFlyout extends LitElement {
  static override styles = HeaderFlyoutScss;

  /** Flyout open state. */
  @property({ type: Boolean })
  open = false;

  /** Anchor flyout menu to the left edge of the button instead of the right edge. */
  @property({ type: Boolean })
  anchorLeft = false;

  /** Button assistive text, title + aria-label. */
  @property({ type: String })
  assistiveText = '';

  /**
   * Determines if menu should be a small flyout or large flyout for small screens.
   * @ignore
   */
  @state()
  breakpointHit = false;

  override render() {
    const classes = {
      menu: true,
      'breakpoint-hit': this.breakpointHit,
      open: this.open,
    };

    const contentClasses = {
      menu__content: true,
      'menu__content--left': this.anchorLeft,
    };

    return html`
      <div class="${classMap(classes)}" @mouseleave=${this.handleMouseleave}>
        <button
          class="btn interactive"
          title=${this.assistiveText}
          aria-label=${this.assistiveText}
          @click=${this.handleClick}
          @mouseenter=${this.handleMouseenter}
        >
          <slot name="button"></slot>
        </button>
        <div class=${classMap(contentClasses)}><slot></slot></div>
      </div>
    `;
  }

  private handleMouseenter() {
    this.open = true;
  }

  private handleMouseleave() {
    this.open = false;
  }

  private handleClick() {
    this.open = !this.open;
  }

  private handleClickOut(e: any) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
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
    'kyn-header-flyout': HeaderFlyout;
  }
}
