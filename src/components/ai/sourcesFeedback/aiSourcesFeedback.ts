import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { classMap } from 'lit-html/directives/class-map.js';

import stylesheet from './aiSourcesFeedback.scss';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import chevronIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import thumbsUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-up.svg';
import thumbsDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-down.svg';

import '../../reusable/link';
import '../../reusable/card';
import '../../reusable/button';

const _defaultTextStrings = {
  sourcesTxt: 'Sources used',
  foundSources: 'Found sources',
  showMore: 'Show more',
  showLess: 'Show less',
};

/**
 * `kyn-ai-sources-feedback` Web Component.
 * This component provides expandable panels for sources and feedback.
 * @fires on-toggle - Emits the `opened` state when the panel item opens/closes.
 * @fires on-feedback-changed - Captures the thumbsUp/thumbsDown click and emits the feedback type.
 * @slot copy - copy button
 * @slot sources - source cards in source panel
 * @slot pos-feedback-form - Positive feedback form
 * @slot neg-feedback-form - Negative feedback form
 *
 */
@customElement('kyn-ai-sources-feedback')
export class AISourcesFeedback extends LitElement {
  static override styles = [stylesheet];

  /** expandable anchor opened state for Sources used. */
  @property({ type: Boolean })
  sourcesOpened = false;

  /** expandable anchor opened state for Feedback buttons. */
  @property({ type: Boolean })
  feedbackOpened = false;

  /** expandable anchor disabled state for Sources used.. */
  @property({ type: Boolean })
  sourcesDisabled = false;

  /** expandable anchor disabled state for Feedback buttons. */
  @property({ type: Boolean })
  feedbackDisabled = false;

  /** Limits visible sources behind a "Show more" button. */
  @property({ type: Boolean })
  revealAllSources = false;

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Number of sources visible when limited.
   * @internal
   */
  @state()
  _limitCount = 4;

  /** Source limit visibility.
   * @internal
   */
  @state()
  limitRevealed = false;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Selecting Positive or Negative Feedback
   * @internal
   */
  @state()
  _selectedFeedbackType: any = null;

  @state()
  sources: Array<any> = [];

  override render() {
    const classesSources: any = classMap({
      'kyn-sources': true,
      opened: this.sourcesOpened,
      disabled: this.sourcesDisabled,
    });
    const classesFeedback1: any = classMap({
      'kyn-pos-feedback': true,
      opened: this.feedbackOpened && this._selectedFeedbackType === 'positive',
      disabled:
        this.feedbackDisabled && this._selectedFeedbackType === 'positive',
    });
    const classesFeedback2: any = classMap({
      'kyn-neg-feedback': true,
      opened: this.feedbackOpened && this._selectedFeedbackType === 'negative',
      disabled:
        this.feedbackDisabled && this._selectedFeedbackType === 'positive',
    });
    return html`
      <div class="action-bar">
        <div class="left-div">
          <slot name="copy"></slot>

          <div class="${classesSources}">
            <kyn-button
              kind="ghost"
              class="kyn-sources-title"
              aria-controls="kyn-sources-body"
              aria-expanded=${this.sourcesOpened}
              aria-disabled=${this.sourcesDisabled}
              tabindex="0"
              role="button"
              @click="${(e: Event) => this._handleClick(e, 'sources')}"
              id="kyn-sources-title"
            >
              <span class="title">${this._textStrings.sourcesTxt}</span>
              <span class="expand-icon">${unsafeSVG(chevronIcon)}</span>
            </kyn-button>

            <div
              class="kyn-sources-body"
              id="kyn-sources-body"
              role="region"
              aria-labelledby="kyn-sources-title"
            >
              <div>
                ${this._textStrings.foundSources} (${this.sources.length}) :
              </div>
              <slot name="sources" @slotchange=${this._handleSlotChange}></slot>
              ${!this.revealAllSources && this.sources.length > this._limitCount
                ? html`
                    <kyn-button
                      class="reveal-toggle"
                      kind="ghost"
                      @click=${() =>
                        this._toggleLimitRevealed(!this.limitRevealed)}
                    >
                      ${this.limitRevealed
                        ? html`${this._textStrings.showLess}`
                        : html`
                            ${this._textStrings.showMore}
                            (${this.sources.length - this._limitCount})
                          `}
                    </kyn-button>
                  `
                : null}
            </div>
          </div>
        </div>

        <div class="right-div">
          <div class="${classesFeedback1}">
            <kyn-button
              kind="ghost"
              class="kyn-pos-feedback-title"
              aria-controls="kyn-pos-feedback-body"
              aria-expanded=${this.feedbackOpened}
              aria-disabled=${this.feedbackDisabled}
              aria-label="Give positive feedback"
              tabindex="0"
              id="kyn-pos-feedback-title"
              @click=${(e: Event) =>
                this._handleClick(e, 'feedback', 'positive')}
            >
              <span slot="icon"> ${unsafeSVG(thumbsUpIcon)} </span>
            </kyn-button>

            <div
              class="kyn-pos-feedback-body"
              id="kyn-pos-feedback-body"
              role="region"
              aria-labelledby="kyn-pos-feedback-title"
            >
              <slot
                name="pos-feedback-form"
                @slotchange=${this._handleSlotChange}
              ></slot>
            </div>
          </div>

          <div class="${classesFeedback2}">
            <kyn-button
              kind="ghost"
              class="kyn-neg-feedback-title"
              aria-controls="kyn-neg-feedback-body"
              aria-expanded=${this.feedbackOpened}
              aria-disabled=${this.feedbackDisabled}
              aria-label="Give negative feedback"
              tabindex="0"
              @click="${(e: Event) =>
                this._handleClick(e, 'feedback', 'negative')}"
              id="kyn-neg-feedback-title"
            >
              <span slot="icon"> ${unsafeSVG(thumbsDownIcon)} </span>
            </kyn-button>

            <div
              class="kyn-neg-feedback-body"
              id="kyn-neg-feedback-body"
              role="region"
              aria-labelledby="kyn-neg-feedback-title"
            >
              <slot
                name="neg-feedback-form"
                @slotchange=${this._handleSlotChange}
              ></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _handleClick(
    e: Event,
    panel: 'sources' | 'feedback',
    feedbackType?: any
  ) {
    e.preventDefault();
    if (
      (panel === 'sources' && !this.sourcesDisabled) ||
      (panel === 'feedback') === !this.feedbackDisabled
    ) {
      this._emitToggleEvent(panel, feedbackType);
    }
  }

  private _emitToggleEvent(
    panel: 'sources' | 'feedback',
    _selectedFeedbackType?: any
  ) {
    this.sourcesOpened = panel === 'sources' && !this.sourcesOpened;
    if (
      this._selectedFeedbackType === _selectedFeedbackType &&
      this.feedbackOpened
    ) {
      this.feedbackOpened = false;
      this._selectedFeedbackType = null;
    } else {
      this.feedbackOpened = true;
      this._selectedFeedbackType = _selectedFeedbackType;
    }

    const event = new CustomEvent('on-toggle', {
      bubbles: true,
      composed: true,
      detail: {
        sourcesOpened: this.sourcesOpened,
        feedbackOpened: this.feedbackOpened,
        selectedFeedbackType: this._selectedFeedbackType,
      },
    });
    this.dispatchEvent(event);
  }

  protected _handleSlotChange() {
    this.sources = Array.from(this.querySelectorAll('kyn-card'));
    this._toggleLimitRevealed(this.limitRevealed);
  }

  private _toggleLimitRevealed(revealed: boolean) {
    this.limitRevealed = revealed;

    this.sources.forEach((sourceEl, index) => {
      if (this.revealAllSources || this.limitRevealed) {
        sourceEl.parentElement.style.display = 'block';
      } else {
        if (index < this._limitCount) {
          sourceEl.parentElement.style.display = 'block';
        } else {
          sourceEl.parentElement.style.display = 'none';
        }
      }
    });
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-sources-feedback': AISourcesFeedback;
  }
}
