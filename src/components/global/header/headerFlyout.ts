import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderFlyoutScss from './headerFlyout.scss';
import chevronIcon from '@carbon/icons/es/chevron--right/16';
import backIcon from '@carbon/icons/es/arrow--left/16';

import '@kyndryl-design-system/shidoka-foundation/components/icon';

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

  /** Hides the arrow. */
  @property({ type: Boolean })
  hideArrow = false;

  /** Menu & button label. */
  @property({ type: String })
  label = '';

  /** Hide the label at the top of the flyout menu. */
  @property({ type: Boolean })
  hideMenuLabel = false;

  /** Hide the label in the mobile button. */
  @property({ type: Boolean })
  hideButtonLabel = false;

  /**
   * DEPRECATED. Use `label` instead.
   * Button assistive text, title + aria-label.
   */
  @property({ type: String })
  assistiveText = '';

  /** Turns the button into a link. */
  @property({ type: String })
  href = '';

  /** Text for mobile "Back" button. */
  @property({ type: String })
  backText = 'Back';

  /**
   * Queries any slotted HTML elements.
   * @ignore
   */
  @queryAssignedElements()
  slottedElements!: Array<HTMLElement>;

  /** Timeout function to delay modal close.
   * @internal
   */
  @state()
  timer: any;

  override render() {
    const classes = {
      menu: true,
      open: this.open,
    };

    const contentClasses = {
      menu__content: true,
      'menu__content--left': this.anchorLeft,
      slotted: this.slottedElements.length,
    };

    return html`
      <div
        class="${classMap(classes)}"
        @pointerleave=${(e: PointerEvent) => this.handlePointerLeave(e)}
        @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
      >
        ${this.href !== ''
          ? html`
              <a
                class="btn interactive"
                href=${this.href}
                title=${this.label || this.assistiveText}
                aria-label=${this.label || this.assistiveText}
                @click=${this.handleClick}
                @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
              >
                <slot name="button"></slot>

                ${!this.hideButtonLabel
                  ? html`
                      <span class="label">
                        ${this.label || this.assistiveText}
                      </span>
                    `
                  : null}

                <kd-icon
                  slot="button"
                  class="arrow"
                  .icon="${chevronIcon}"
                ></kd-icon>
              </a>
            `
          : html`
              <button
                class="btn interactive"
                title=${this.label || this.assistiveText}
                aria-label=${this.label || this.assistiveText}
                @click=${this.handleClick}
                @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
              >
                <slot name="button"></slot>

                ${!this.hideButtonLabel
                  ? html`
                      <span class="label">
                        ${this.label || this.assistiveText}
                      </span>
                    `
                  : null}

                <kd-icon
                  slot="button"
                  class="arrow"
                  .icon="${chevronIcon}"
                ></kd-icon>
              </button>
            `}

        <div class=${classMap(contentClasses)}>
          ${!this.hideMenuLabel
            ? html`
                <div class="menu-label">
                  ${this.label || this.assistiveText}
                </div>
              `
            : null}

          <button class="go-back" @click=${() => this._handleBack()}>
            <kd-icon .icon=${backIcon}></kd-icon>
            ${this.backText}
          </button>
          <slot></slot>
        </div>
      </div>
      <div class="overlay"></div>
    `;
  }

  private _handleBack() {
    this.open = false;
  }

  private handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      clearTimeout(this.timer);
      this.open = true;
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.relatedTarget !== null) {
      this.timer = setTimeout(() => {
        this.open = false;
        clearTimeout(this.timer);
      }, 100);
    }
  }

  private handleClick() {
    this.open = !this.open;
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this.handleClickOut(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyout': HeaderFlyout;
  }
}
