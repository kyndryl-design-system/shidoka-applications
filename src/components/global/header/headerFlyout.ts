import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderFlyoutScss from './headerFlyout.scss?inline';
import chevronIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import backIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';

type MobilePresentationConfig = {
  buttonIconSvg?: string;
  summaryIconSvg?: string;
  summaryLabel?: string;
  mobileLabel?: string;
  hideButtonContentOnMobile?: boolean;
};

const _mobilePresentationEvent = 'kyn-internal-flyout-mobile-presentation';

/**
 * Component for header flyout items.
 * @slot unnamed - Slot for flyout menu content.
 * @slot button - Slot for button/toggle content.
 */
@customElement('kyn-header-flyout')
export class HeaderFlyout extends LitElement {
  static override styles = unsafeCSS(HeaderFlyoutScss);

  @state()
  private accessor _mobileButtonIconSvg = '';

  @state()
  private accessor _mobileSummaryIconSvg = '';

  @state()
  private accessor _mobileSummaryLabel = '';

  @state()
  private accessor _mobileLabelOverride = '';

  @state()
  private accessor _hideButtonContentOnMobile = false;

  @state()
  private accessor _isDesktopViewport = true;

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

  private _desktopMediaQuery?: MediaQueryList;

  private get _triggerAssistiveText() {
    if (!this._isDesktopViewport && this._mobileLabelOverride) {
      return this._mobileLabelOverride;
    }

    return this.label || this.assistiveText;
  }

  override render() {
    const mobileLabel =
      this._mobileLabelOverride || this.label || this.assistiveText;
    const showButtonLabel =
      !this.hideButtonLabel || !!this._mobileLabelOverride;

    const classes = {
      menu: true,
      open: this.open,
      'menu--has-mobile-button-icon': !!this._mobileButtonIconSvg,
      'menu--has-mobile-summary': !!this._mobileSummaryLabel,
      'menu--hide-button-content-on-mobile': this._hideButtonContentOnMobile,
    };

    const contentClasses = {
      menu__content: true,
      'menu__content--left': this.anchorLeft,
      slotted: this.slottedElements.length,
      'no-padding': this.noPadding,
    };

    return html`
      <div class="${classMap(classes)}">
        ${this._mobileSummaryLabel
          ? html`
              <div class="mobile-summary">
                ${this._mobileSummaryIconSvg
                  ? html`
                      <span class="mobile-summary__icon" aria-hidden="true">
                        ${unsafeSVG(this._mobileSummaryIconSvg)}
                      </span>
                    `
                  : null}
                <span class="mobile-summary__label">
                  ${this._mobileSummaryLabel}
                </span>
              </div>
            `
          : null}
        ${this.href !== ''
          ? html`
              <a
                class="btn interactive"
                href=${this.href}
                title=${this._triggerAssistiveText}
                aria-label=${this._triggerAssistiveText}
                @click=${this.handleClick}
              >
                ${this._mobileButtonIconSvg
                  ? html`
                      <span class="mobile-button-icon" aria-hidden="true">
                        ${unsafeSVG(this._mobileButtonIconSvg)}
                      </span>
                    `
                  : null}
                <span class="button-slot">
                  <slot name="button"></slot>
                </span>

                ${showButtonLabel
                  ? html` <span class="label"> ${mobileLabel} </span> `
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
                ${this._mobileButtonIconSvg
                  ? html`
                      <span class="mobile-button-icon" aria-hidden="true">
                        ${unsafeSVG(this._mobileButtonIconSvg)}
                      </span>
                    `
                  : null}
                <span class="button-slot">
                  <slot name="button"></slot>
                </span>

                ${showButtonLabel
                  ? html` <span class="label"> ${mobileLabel} </span> `
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

  private _applyMobilePresentation(config: MobilePresentationConfig = {}) {
    this._mobileButtonIconSvg = config.buttonIconSvg ?? '';
    this._mobileSummaryIconSvg = config.summaryIconSvg ?? '';
    this._mobileSummaryLabel = config.summaryLabel ?? '';
    this._mobileLabelOverride = config.mobileLabel ?? '';
    this._hideButtonContentOnMobile = config.hideButtonContentOnMobile ?? false;
  }

  private _clearMobilePresentation() {
    this._mobileButtonIconSvg = '';
    this._mobileSummaryIconSvg = '';
    this._mobileSummaryLabel = '';
    this._mobileLabelOverride = '';
    this._hideButtonContentOnMobile = false;
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

  /** Tracks header mobile/desktop breakpoint so assistive text matches the visible trigger label.
   * @internal
   */
  private readonly _handleBreakpointChange = (e: MediaQueryListEvent) => {
    this._isDesktopViewport = e.matches;
  };

  /** Applies internal mobile presentation updates from child components such as workspace switcher.
   * @internal
   */
  private readonly _handleMobilePresentation = (
    e: CustomEvent<MobilePresentationConfig>
  ) => {
    if (!Object.keys(e.detail ?? {}).length) {
      this._clearMobilePresentation();
      return;
    }

    this._applyMobilePresentation(e.detail);
  };

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

    this._desktopMediaQuery = window.matchMedia('(min-width: 42rem)');
    this._isDesktopViewport = this._desktopMediaQuery.matches;
    this._desktopMediaQuery.addEventListener(
      'change',
      this._handleBreakpointChange
    );
    document.addEventListener('click', this._boundHandleClickOut);
    this.addEventListener(
      _mobilePresentationEvent,
      this._handleMobilePresentation as EventListener
    );
  }

  override disconnectedCallback() {
    this._desktopMediaQuery?.removeEventListener(
      'change',
      this._handleBreakpointChange
    );
    this._desktopMediaQuery = undefined;
    document.removeEventListener('click', this._boundHandleClickOut);
    this.removeEventListener(
      _mobilePresentationEvent,
      this._handleMobilePresentation as EventListener
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-flyout': HeaderFlyout;
  }
}
