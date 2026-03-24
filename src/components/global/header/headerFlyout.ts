import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderFlyoutScss from './headerFlyout.scss?inline';
import chevronIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import backIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

/**
 * Component for header flyout items.
 * @slot unnamed - Slot for flyout menu content.
 * @slot button - Slot for button/toggle content.
 */
@customElement('kyn-header-flyout')
export class HeaderFlyout extends LitElement {
  static override styles = unsafeCSS(HeaderFlyoutScss);

  /** Flyout open state. */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /** Anchor flyout menu to the left edge of the button instead of the right edge. */
  @property({ type: Boolean })
  accessor anchorLeft = false;

  /** Hides the arrow. */
  @property({ type: Boolean })
  accessor hideArrow = false;

  /**
   * Menu label, trigger `title`, and trigger `aria-label` (e.g. current account name).
   * Truncate visually in the slot with CSS if needed; keep this value complete for tooltips and SR.
   */
  @property({ type: String })
  accessor label = '';

  /** Hide the label at the top of the flyout menu. */
  @property({ type: Boolean })
  accessor hideMenuLabel = false;

  /** Hide the label in the mobile button. */
  @property({ type: Boolean })
  accessor hideButtonLabel = false;

  /**
   * @deprecated Use `label` instead.
   */
  @property({ type: String, attribute: 'assistive-text' })
  accessor assistiveText = '';

  /** Turns the button into a link. */
  @property({ type: String })
  accessor href = '';

  /** Text for mobile "Back" button. */
  @property({ type: String })
  accessor backText = 'Back';

  /** Removes padding from the flyout menu. */
  @property({ type: Boolean })
  accessor noPadding = false;

  /**
   * Queries any slotted HTML elements.
   * @ignore
   */
  @queryAssignedElements()
  accessor slottedElements!: Array<HTMLElement>;

  private get _triggerAssistiveText() {
    return this.label || this.assistiveText;
  }

  override render() {
    const classes = {
      menu: true,
      open: this.open,
    };

    const contentClasses = {
      menu__content: true,
      'menu__content--left': this.anchorLeft,
      slotted: this.slottedElements.length,
      'no-padding': this.noPadding,
    };

    return html`
      <div class="${classMap(classes)}">
        ${this.href !== ''
          ? html`
              <a
                class="btn interactive"
                href=${this.href}
                title=${this._triggerAssistiveText}
                aria-label=${this._triggerAssistiveText}
                @click=${this.handleClick}
              >
                <slot name="button"></slot>

                ${!this.hideButtonLabel
                  ? html`
                      <span class="label">
                        ${this.label || this.assistiveText}
                      </span>
                    `
                  : null}

                <span slot="button" class="arrow">
                  ${unsafeSVG(chevronIcon)}
                </span>
              </a>
            `
          : html`
              <button
                class="btn interactive"
                title=${this._triggerAssistiveText}
                aria-label=${this._triggerAssistiveText}
                @click=${this.handleClick}
              >
                <slot name="button"></slot>

                ${!this.hideButtonLabel
                  ? html`
                      <span class="label">
                        ${this.label || this.assistiveText}
                      </span>
                    `
                  : null}

                <span slot="button" class="arrow">
                  ${unsafeSVG(chevronIcon)}
                </span>
              </button>
            `}

        <div class=${classMap(contentClasses)}>
          <button class="go-back" @click=${() => this._handleBack()}>
            <span>${unsafeSVG(backIcon)}</span>
            ${this.backText}
          </button>

          ${!this.hideMenuLabel
            ? html`
                <div class="menu-label">
                  ${this.label || this.assistiveText}
                </div>
              `
            : null}

          <slot></slot>
        </div>
      </div>
    `;
  }

  private _handleBack() {
    this.open = false;
  }

  private handleClick() {
    this.open = !this.open;
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  /** Bound outside-click handler for add/remove symmetry.
   * @internal
   */
  private readonly _boundHandleClickOut = (e: Event) => this.handleClickOut(e);

  override willUpdate(changedProps: any) {
    if (changedProps.has('open')) {
      const event = new CustomEvent('on-flyout-toggle', {
        composed: true,
        bubbles: true,
        detail: { open: this.open },
      });
      this.dispatchEvent(event);
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', this._boundHandleClickOut);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this._boundHandleClickOut);

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyout': HeaderFlyout;
  }
}
