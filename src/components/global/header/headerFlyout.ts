import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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

  /** Anchor flyout menu to the left edge of the button instead of the right edge. */
  @property({ type: Boolean })
  anchorLeft = false;

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
    };

    const contentClasses = {
      menu__content: true,
      'menu__content--left': this.anchorLeft,
    };

    return html`
      <div class="${classMap(classes)}">
        <button class="btn interactive"><slot name="button"></slot></button>
        <div class=${classMap(contentClasses)}><slot></slot></div>
      </div>
    `;
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
    'kyn-header-flyout': HeaderFlyout;
  }
}
