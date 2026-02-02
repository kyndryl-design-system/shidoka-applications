import { html, LitElement, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import { classMap } from 'lit-html/directives/class-map.js';

import stylesheet from './aiReportIssueFeedback.scss?inline';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import thumbsUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-up.svg';
import thumbsDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-down.svg';
import thumbsUpFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-up-filled.svg';
import thumbsDownFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/thumbs-down-filled.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import '../../reusable/link';
import '../../reusable/card';
import '../../reusable/button';

const _defaultTextStrings = {
  sourcesText: 'Sources',
  foundSources: 'Found sources',
  showMore: 'Show more',
  showLess: 'Show less',
  positiveFeedback: 'Share what you liked',
  negativeFeedback: 'Help us improve',
};

/**
 * AIReportIssueFeedback Component.
 *
 * @slot copy - copy button
 * @slot sources - source cards in source panel.
 * @slot report-issue-form - Positive feedback form.
 * @fires on-toggle - Emits the `opened` state when the panel item opens/closes.
 * <pre><code>
 * detail: {
 *   sourcesOpened: boolean,
 *   selectedFeedbackType: string
 * }
 * </code></pre>
 * @fires on-feedback-selected - Emits when thumbs-up or thumbs-down button is selected. `detail:{ feedbackType: string }`
 * @fires on-feedback-deselected - Emits when thumbs-up or thumbs-down button is deselected. `detail:{ feedbackType: string }`
 * @fires sources-used-toggle - Emits when sources used is clicked. `detail:{ sourcesOpened: boolean }`
 */

@customElement('kyn-ai-report-issue-feedback')
export class AIReportIssueFeedback extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** expandable anchor opened state for Sources used. */
  // @property({ type: Boolean })
  accessor sourcesOpened = false;

  /** expandable anchor opened state for Feedback buttons. */
  // @property({ type: Boolean })
  // accessor feedbackOpened = false;

  /** expandable anchor opened state for Report Issue buttons. */
  @property({ type: Boolean })
  accessor reportIssueOpened = false;

  /** expandable anchor disabled state for Sources used.. */
  @property({ type: Boolean })
  accessor sourcesDisabled = false;

  /** expandable anchor disabled state for Report Issue buttons. */
  @property({ type: Boolean })
  accessor reportIssueDisabled = false;

  /** expandable anchor disabled state for Feedback buttons. */
  @property({ type: Boolean })
  accessor feedbackDisabled = false;

  /** Limits visible sources behind a "Show more" button. */
  @property({ type: Boolean })
  accessor revealAllSources = false;

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Close button text. */
  @property({ type: String })
  accessor closeText = 'Close';

  /** Number of sources visible when limited.
   * @internal
   */
  @state()
  accessor _limitCount = 4;

  /** Sources limit visibility.
   * @internal
   */
  @state()
  accessor limitRevealed = false;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /**
   * Internal reportIssue text.
   * @internal
   */
  @property({ type: String })
  accessor _reportIssueText = 'Report Issue';

  /** Selecting Positive or Negative Feedback
   * @internal
   */
  @state()
  accessor _selectedFeedbackType: any = null;

  /**
   * Queries slotted sources.
   * @ignore
   */
  @queryAssignedElements({ slot: 'sources' })
  accessor _sourceEls!: any;

  /**  Tracks the number of clicks on thumbs up icon
   * @internal
   */
  @state() accessor thumbsUpClickCount = 0;

  /**  Tracks the number of clicks on thumbs down icon
   * @internal
   */
  @state() accessor thumbsDownClickCount = 0;

  override render() {
    const classesReportIssue: any = classMap({
      'kyn-report-issue': true,
      opened: this.reportIssueOpened,
      disabled: this.reportIssueDisabled,
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

          <div class="thumb-feedback-div">
            <div class="${classesFeedback1}">
              <kyn-button
                kind="ghost-ai"
                size="small"
                id="kyn-feedback-title-positive"
                class="kyn-feedback-title"
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
                kind="ghost-ai"
                size="small"
                id="kyn-feedback-title-negative"
                class="kyn-feedback-title"
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

          <div class="${classesReportIssue}">
            <kyn-button
              kind="ghost-ai"
              size="small"
              class="kyn-report-issue-title"
              iconPosition="right"
              ?disabled=${this.reportIssueDisabled}
              @on-click="${(e: Event) => this._handleClick(e, 'reportIssue')}"
              id="kyn-report-issue-title"
            >
              <span>${this._reportIssueText}</span>              
            </kyn-button>
          </div>

          <div>
            <kyn-button
              kind="ghost-ai"
              size="small"
              class="kyn-sources-title"
              iconPosition="right"
              ?disabled=${this.sourcesDisabled}
              @on-click="${(e: Event) => this._handleClick(e, 'sources')}"
              id="kyn-sources-title"
            >
              <span>${this._textStrings.sourcesText}</span>
            </kyn-button>
          </div>
        </div>
      </div>

      <div
        class="${classMap({
          opened: this.reportIssueOpened,
          'kyn-report-issue-body': true,
        })}"
        id="kyn-report-issue-body"
        role="region"
        aria-labelledby="kyn-report-issue-title"
          ? 'positive'
          : 'negative'}"
      >
        <div class="close-container">
          <kyn-button
            class="close"
            description=${this.closeText}
            @on-click=${(e: Event) => this._handleClick(e, 'reportIssue')}
            kind="ghost-ai"
            size="small"
          >
            <span slot="icon">${unsafeSVG(closeIcon)}</span>
          </kyn-button>
        </div>

        <slot name="report-issue-form"></slot>
      </div>
    `;
  }
  private _handleClick(
    e: Event,
    panel: 'sources' | 'feedback' | 'reportIssue',
    feedbackType?: 'positive' | 'negative'
  ) {
    e.preventDefault();

    if (
      (panel === 'sources' && this.sourcesDisabled) ||
      (panel === 'feedback' && this.feedbackDisabled) ||
      (panel === 'reportIssue' && this.reportIssueDisabled)
    ) {
      return;
    }

    const target = e.target as HTMLElement;
    const isFeedbackButton = target.id?.includes('kyn-feedback-title');

    if (isFeedbackButton && feedbackType) {
      this._updateFeedbackCounts(feedbackType);
    }

    if (panel === 'reportIssue') {
      this._emitToggleEvent(panel);
      return;
    }

    if (panel === 'sources') {
      this.dispatchEvent(
        new CustomEvent('sources-used-toggle', {
          detail: { sourcesOpened: !this.sourcesOpened },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _updateFeedbackCounts(feedbackType: 'positive' | 'negative') {
    // Checks if the feedbackType was already selected before updating the counts.
    const wasSelected =
      (feedbackType === 'positive' && this.thumbsUpClickCount % 2 !== 0) ||
      (feedbackType === 'negative' && this.thumbsDownClickCount % 2 !== 0);

    if (feedbackType === 'positive') {
      this.thumbsUpClickCount++;
      this.thumbsDownClickCount -= this.thumbsDownClickCount % 2;
    } else {
      this.thumbsDownClickCount++;
      this.thumbsUpClickCount -= this.thumbsUpClickCount % 2;
    }

    if (wasSelected) {
      this.dispatchEvent(
        new CustomEvent('on-feedback-deselected', {
          detail: { feedbackType },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('on-feedback-selected', {
          detail: { feedbackType },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _emitToggleEvent(panel: 'sources' | 'feedback' | 'reportIssue') {
    if (panel === 'reportIssue') {
      this.reportIssueOpened = !this.reportIssueOpened;
      this.sourcesOpened = false;
    }

    this.dispatchEvent(
      new CustomEvent('on-toggle', {
        detail: {
          sourcesOpened: this.sourcesOpened,
          reportIssueOpened: this.reportIssueOpened,
          selectedFeedbackType: this._selectedFeedbackType,
        },
        bubbles: true,
        composed: true,
      })
    );
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-report-issue-feedback': AIReportIssueFeedback;
  }
}
