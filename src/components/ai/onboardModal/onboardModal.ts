import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../../reusable/button';
import Styles from './onboardModal.scss?inline';

/**
 * AI Chat Onboard Content component.
 * Renders onboarding carousel content that can be placed inside any modal or container.
 * @fires on-slide-change - Emits when the slide changes. Detail: { currentSlide: number }
 * @fires on-complete - Emits when the user completes all slides (clicks Next on last slide).
 * @fires on-back - Emits when the user clicks Back on the first slide.
 * @slot - Default slot for custom slide content.
 */
@customElement('kyn-chat-onboard-content')
export class ChatOnboardContent extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Total number of slides. */
  @property({ type: Number, attribute: 'total-slides' })
  set totalSlides(value: number) {
    this._totalSlides = Math.max(1, value);
    // Ensure current slide is still valid
    if (this.currentSlide >= this._totalSlides) {
      this.currentSlide = this._totalSlides - 1;
    }
    this.requestUpdate();
  }
  get totalSlides() {
    return this._totalSlides;
  }
  private _totalSlides = 1;

  /** Current active slide (0-indexed). */
  @property({ type: Number, attribute: 'current-slide' })
  set currentSlide(value: number) {
    const validValue = Math.max(0, Math.min(value, this.totalSlides - 1));
    this._currentSlide = validValue;
    this.requestUpdate();
  }
  get currentSlide() {
    return this._currentSlide;
  }
  private _currentSlide = 0;

  /** Main title text (supports HTML for styling). */
  @property({ type: String, attribute: 'title-text' })
  accessor titleText = 'Welcome!';

  /** Back button text. */
  @property({ type: String, attribute: 'back-text' })
  accessor backText = 'Back';

  /** Next button text. */
  @property({ type: String, attribute: 'next-text' })
  accessor nextText = 'Next';

  /** Hide navigation buttons. */
  @property({ type: Boolean, attribute: 'hide-navigation' })
  accessor hideNavigation = false;

  /** Hide carousel indicators. */
  @property({ type: Boolean, attribute: 'hide-indicators' })
  accessor hideIndicators = false;

  /** Back button kind/type. */
  @property({ type: String, attribute: 'back-button-kind' })
  accessor backButtonKind = 'tertiary';

  /** Next button kind/type. */
  @property({ type: String, attribute: 'next-button-kind' })
  accessor nextButtonKind = 'tertiary';

  /** Back button size. */
  @property({ type: String, attribute: 'back-button-size' })
  accessor backButtonSize = 'small';

  /** Next button size. */
  @property({ type: String, attribute: 'next-button-size' })
  accessor nextButtonSize = 'small';

  /** Fixed width for the component. */
  @property({ type: String, attribute: 'width' })
  accessor width = '';

  /** Fixed height for the component. */
  @property({ type: String, attribute: 'height' })
  accessor height = '';

  override render() {
    const showPagination = !this.hideIndicators && this.totalSlides > 1;
    const showNavigation = !this.hideNavigation;
    const isSingleSlide = this.totalSlides === 1;

    const style = `${this.width ? `width: ${this.width};` : ''}${
      this.height ? `height: ${this.height};` : ''
    }`;

    return html`
      <div class="onboard-content" style="${style}">
        <h1 class="onboard-title">${this.titleText}</h1>

        <div class="onboard-body">
          <slot></slot>
        </div>

        <div class="onboard-footer">
          ${showNavigation
            ? html`
                <div class="onboard-navigation">
                  ${!isSingleSlide
                    ? html`
                        <kyn-button
                          kind="${this.backButtonKind}"
                          size="${this.backButtonSize}"
                          @click=${this._handleBack}
                        >
                          <span class="nav-btn-content">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path
                                d="M10.5 12L6.5 8L10.5 4"
                                stroke="currentColor"
                                stroke-width="1.5"
                                fill="none"
                              />
                            </svg>
                            ${this.backText}
                          </span>
                        </kyn-button>
                      `
                    : ''}

                  <kyn-button
                    kind="${this.nextButtonKind}"
                    size="${this.nextButtonSize}"
                    @click=${this._handleNext}
                  >
                    <span class="nav-btn-content">
                      ${isSingleSlide ? 'Get Started' : this.nextText}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path
                          d="M5.5 4L9.5 8L5.5 12"
                          stroke="currentColor"
                          stroke-width="1.5"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </kyn-button>
                </div>
              `
            : ''}
          ${showPagination
            ? html`
                <div class="onboard-pagination">
                  ${Array.from(
                    { length: this.totalSlides },
                    (_, i) => html`
                      <button
                        class="pagination-bullet ${i === this.currentSlide
                          ? 'active'
                          : ''} ${!showNavigation ? 'clickable' : ''}"
                        aria-label="Go to slide ${i + 1}"
                        @click=${!showNavigation
                          ? () => this._handleBulletClick(i)
                          : null}
                      ></button>
                    `
                  )}
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }

  private _handleBulletClick(slideIndex: number) {
    if (slideIndex !== this.currentSlide) {
      this.currentSlide = slideIndex;
      this._emitSlideChange();
    }
  }

  private _handleBack() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this._emitSlideChange();
    } else {
      this.dispatchEvent(
        new CustomEvent('on-back', { bubbles: true, composed: true })
      );
    }
  }

  private _handleNext() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this._emitSlideChange();
    } else {
      this.dispatchEvent(
        new CustomEvent('on-complete', { bubbles: true, composed: true })
      );
    }
  }

  private _emitSlideChange() {
    this.dispatchEvent(
      new CustomEvent('on-slide-change', {
        detail: { currentSlide: this.currentSlide },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-chat-onboard-content': ChatOnboardContent;
  }
}
