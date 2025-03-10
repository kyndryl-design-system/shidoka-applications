import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { classMap } from 'lit-html/directives/class-map.js';

import stylesheet from './aiSourcesFeedback.scss';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import chevronIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import thumbsUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-up.svg';
import thumbsDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-down.svg';
import thumbsUpFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-up-filled.svg';
import thumbsDownFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-down-filled.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import '../../reusable/link';
import '../../reusable/card';
import '../../reusable/button';

const _defaultTextStrings = {
  sourcesText: 'Sources used',
  foundSources: 'Found sources',
  showMore: 'Show more',
  showLess: 'Show less',
  positiveFeedback: 'Share what you liked',
  negativeFeedback: 'Help us improve',
};

/**
 * AISourcesFeedback Component.
 *
 * @slot copy - copy button
 * @slot sources - source cards in source panel.
 * @slot feedback-form - Positive feedback form.
 * @fires on-toggle - Emits the `opened` state when the panel item opens/closes.
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

  /** Close button text. */
  @property({ type: String })
  closeText = 'Close';

  /** Number of sources visible when limited.
   * @internal
   */
  @state()
  _limitCount = 4;

  /** Sources limit visibility.
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

  /**
   * Queries slotted sources.
   * @ignore
   */
  @queryAssignedElements({ slot: 'sources' })
  _sourceEls!: any;

  /**  Sources anchor text
   * @internal
   */
  @state()
  sourcesOriginalText: any;

  /**  Tracks the number of clicks on thumbs up icon
   * @internal
   */
  @state() thumbsUpClickCount = 0;

  /**  Tracks the number of clicks on thumbs down icon
   * @internal
   */
  @state() thumbsDownClickCount = 0;

  override render() {
    const classesSources: any = classMap({
      'kyn-sources': true,
      opened: this.sourcesOpened,
      disabled: this.sourcesDisabled,
    });
    const classesFeedback1: any = classMap({
      'kyn-pos-feedback': true,
      disabled:
        this.feedbackDisabled && this._selectedFeedbackType === 'positive',
    });
    const classesFeedback2: any = classMap({
      'kyn-neg-feedback': true,
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
              size="small"
              class="kyn-sources-title"
              iconPosition="right"
              aria-controls="kyn-sources-body"
              aria-expanded=${this.sourcesOpened}
              ?disabled=${this.sourcesDisabled}
              @on-click="${(e: Event) => this._handleClick(e, 'sources')}"
              id="kyn-sources-title"
            >
              ${this._textStrings.sourcesText}
              <span class="expand-icon" slot="icon"
                >${unsafeSVG(chevronIcon)}</span
              >
            </kyn-button>
          </div>
        </div>

        <div class="right-div">
          <div class="${classesFeedback1}">
            <kyn-button
              kind="ghost"
              size="small"
              id="kyn-feedback-title-positive"
              class="kyn-feedback-title"
              aria-controls="kyn-feedback-body"
              aria-expanded=${this.feedbackOpened}
              ?disabled=${this.feedbackDisabled}
              description=${this._textStrings.positiveFeedback}
              @on-click=${(e: Event) =>
                this._handleClick(e, 'feedback', 'positive')}
            >
              <span slot="icon">
                ${unsafeSVG(
                  this.thumbsUpClickCount % 2 === 0
                    ? thumbsUpIcon
                    : thumbsUpFilledIcon
                )}
              </span>
            </kyn-button>
          </div>

          <div class="${classesFeedback2}">
            <kyn-button
              kind="ghost"
              size="small"
              id="kyn-feedback-title-negative"
              class="kyn-feedback-title"
              aria-controls="kyn-feedback-body"
              aria-expanded=${this.feedbackOpened}
              ?disabled=${this.feedbackDisabled}
              description=${this._textStrings.negativeFeedback}
              @on-click="${(e: Event) =>
                this._handleClick(e, 'feedback', 'negative')}"
            >
              <span slot="icon"
                >${unsafeSVG(
                  this.thumbsDownClickCount % 2 === 0
                    ? thumbsDownIcon
                    : thumbsDownFilledIcon
                )}
              </span>
            </kyn-button>
          </div>
        </div>
      </div>

      <div
        class="${classMap({
          opened: this.sourcesOpened,
          'kyn-sources-body': true,
        })}"
        id="kyn-sources-body"
        role="region"
        aria-labelledby="kyn-sources-title"
      >
        <div class="close-container">
          <kyn-button
            class="close"
            @on-click=${(e: Event) => this._handleClick(e, 'sources')}
            }}
            kind="ghost"
            size="small"
            description=${this.closeText}
          >
            <span slot="icon">${unsafeSVG(closeIcon)}</span>
          </kyn-button>
        </div>

        <div class="found-sources">
          ${this._textStrings.foundSources} (${this._sourceEls.length}) :
        </div>
        <div class="card-container">
          <slot name="sources" @slotchange=${this._handleSlotChange}></slot>
        </div>
        ${!this.revealAllSources && this._sourceEls.length > this._limitCount
          ? html`
              <kyn-button
                class="reveal-toggle"
                kind="ghost"
                size="small"
                @on-click=${() =>
                  this._toggleLimitRevealed(!this.limitRevealed)}
              >
                ${this.limitRevealed
                  ? html`${this._textStrings.showLess}`
                  : html`
                      ${this._textStrings.showMore}
                      (${this._sourceEls.length - this._limitCount})
                    `}
              </kyn-button>
            `
          : null}
      </div>

      <div
        class="${classMap({
          opened: this.feedbackOpened,
          'kyn-feedback-body': true,
        })}"
        id="kyn-feedback-body"
        role="region"
        aria-labelledby="kyn-feedback-title-${this._selectedFeedbackType
          ? 'positive'
          : 'negative'}"
      >
        <div class="close-container">
          <kyn-button
            class="close"
            description=${this.closeText}
            @on-click=${(e: Event) =>
              this._handleClick(e, 'feedback', this._selectedFeedbackType)}
            }}
            kind="ghost"
            size="small"
          >
            <span slot="icon">${unsafeSVG(closeIcon)}</span>
          </kyn-button>
        </div>

        <slot name="feedback-form"></slot>
      </div>
    `;
  }
  private _handleClick(
    e: Event,
    panel: 'sources' | 'feedback',
    feedbackType?: 'positive' | 'negative'
  ) {
    e.preventDefault();

    if (
      (panel === 'sources' && this.sourcesDisabled) ||
      (panel === 'feedback' && this.feedbackDisabled)
    ) {
      return;
    }

    const target = e.target as HTMLElement;
    const isFeedbackButton = target.id?.includes('kyn-feedback-title');

    if (isFeedbackButton && feedbackType) {
      this._updateFeedbackCounts(feedbackType);
    }

    if (panel === 'sources' || this._shouldEmitFeedbackEvent(feedbackType)) {
      console.log('EMIITING');
      this._emitToggleEvent(panel, feedbackType);
    }
  }

  private _updateFeedbackCounts(feedbackType: 'positive' | 'negative') {
    if (feedbackType === 'positive') {
      this.thumbsUpClickCount++;
      this.thumbsDownClickCount -= this.thumbsDownClickCount % 2;
    } else {
      this.thumbsDownClickCount++;
      this.thumbsUpClickCount -= this.thumbsUpClickCount % 2;
    }
  }

  private _shouldEmitFeedbackEvent(
    feedbackType?: 'positive' | 'negative'
  ): boolean {
    if (!feedbackType) return false;
    const isOddClick = (count: number) => count % 2 !== 0;

    return (
      (feedbackType === 'positive' &&
        (isOddClick(this.thumbsUpClickCount) ||
          (this.feedbackOpened && !isOddClick(this.thumbsUpClickCount)))) ||
      (feedbackType === 'negative' &&
        (isOddClick(this.thumbsDownClickCount) ||
          (this.feedbackOpened && !isOddClick(this.thumbsDownClickCount))))
    );
  }

  private _emitToggleEvent(
    panel: 'sources' | 'feedback',
    feedbackType?: 'positive' | 'negative'
  ) {
    if (panel === 'sources') {
      this.sourcesOpened = !this.sourcesOpened;
      this.feedbackOpened = false;
    } else if (panel === 'feedback') {
      this.sourcesOpened = false;
      this._toggleFeedbackPanel(feedbackType);
    }

    this.dispatchEvent(
      new CustomEvent('on-toggle', {
        detail: {
          sourcesOpened: this.sourcesOpened,
          feedbackOpened: this.feedbackOpened,
          selectedFeedbackType: this._selectedFeedbackType,
        },
      })
    );
  }

  private _toggleFeedbackPanel(feedbackType?: 'positive' | 'negative') {
    if (!feedbackType) return;

    if (this._selectedFeedbackType === feedbackType && this.feedbackOpened) {
      this.feedbackOpened = false;
      this._selectedFeedbackType = null;
    } else {
      this.feedbackOpened = true;
      this._selectedFeedbackType = feedbackType;
    }
  }

  protected _handleSlotChange() {
    this._toggleLimitRevealed(this.limitRevealed);
  }

  private _toggleLimitRevealed(revealed: boolean) {
    this.limitRevealed = revealed;

    this._sourceEls.forEach((sourceEl: any, index: any) => {
      if (this.revealAllSources || this.limitRevealed) {
        sourceEl.style.display = 'block';
      } else {
        if (index < this._limitCount) {
          sourceEl.style.display = 'block';
        } else {
          sourceEl.style.display = 'none';
        }
      }
    });
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
      this.sourcesOriginalText = this._textStrings.sourcesText;
    }
  }

  protected override updated(changedProps: any): void {
    if (
      changedProps.has('revealAllSources') &&
      changedProps.get('revealAllSources') !== undefined
    ) {
      this._toggleLimitRevealed(false);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', () => this.updateSourcesText());
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', () => this.updateSourcesText());
    super.disconnectedCallback();
  }

  private updateSourcesText() {
    this._textStrings.sourcesText =
      window.innerWidth > 672
        ? this.sourcesOriginalText
        : this.sourcesOriginalText.split(' ')[0];
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-sources-feedback': AISourcesFeedback;
  }
}
