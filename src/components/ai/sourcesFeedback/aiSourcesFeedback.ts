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
  foundSources: '',
  showMore: 'Show more',
  showLess: 'Show less',
};

/**
 * `kyn-ai-sources-feedback` Web Component.
 * This component provides expandable panels for sources and feedback.
 * @fires on-toggle - Emits the `opened` state when the panel item opens/closes.
 * @fires on-limit-toggle - Captures the show more/less click and emits the expanded state.
 * @fires on-feedback-changed - Captures the thumbsUp/thumbsDown click and emits the feedback type.
 * @slot copy - copy button
 * @slot sources - source cards in source panel
 * @slot pos-feedback-form - Positive feedback form
 * @slot pos-feedback-form - Negative feedback form
 *
 */
@customElement('kyn-ai-sources-feedback')
export class AISourcesFeedback extends LitElement {
  static override styles = [stylesheet];

  /** expandable anchor opened state. */
  @property({ type: Object })
  // opened = false;
  opened = { sources: false, 'pos-feedback': false, 'neg-feedback': false };

  /** expandable anchor disabled state. */
  @property({ type: Object })
  disabled = { sources: false, 'pos-feedback': false, 'neg-feedback': false };

  /** Limits visible sources behind a "View more" button. */
  @property({ type: Boolean })
  revealAllSources = false;

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

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  @state()
  sources: Array<any> = [];

  override render() {
    const classesSources: any = classMap({
      'kyn-sources': true,
      opened: this.opened['sources'],
      disabled: this.disabled['sources'],
    });
    const classesFeedback1: any = classMap({
      'kyn-pos-feedback': true,
      opened: this.opened['pos-feedback'],
      disabled: this.disabled['pos-feedback'],
    });
    const classesFeedback2: any = classMap({
      'kyn-neg-feedback': true,
      opened: this.opened['neg-feedback'],
      disabled: this.disabled['neg-feedback'],
    });
    return html`
      <div class="action-bar">
        <div class="left-div">
          <slot name="copy"></slot>

          <div class="${classesSources}">
            <div
              class="kyn-sources-title"
              aria-controls="kyn-sources-body"
              aria-expanded=${this.opened['sources']}
              aria-disabled=${this.disabled['sources']}
              tabindex="0"
              role="button"
              @click="${(e: Event) => this._handleClick(e, 'sources')}"
              @keypress="${(e: KeyboardEvent) =>
                this._handleKeypress(e, 'sources')}"
              id="kyn-sources-title"
            >
              <span class="title">${this._textStrings.sourcesTxt}</span>
              <span class="expand-icon">${unsafeSVG(chevronIcon)}</span>
            </div>

            <div
              class="kyn-sources-body"
              id="kyn-sources-body"
              role="region"
              aria-labelledby="kyn-sources-title"
            >
              <div class="kyn-sources-detail">
                <div>${this._textStrings.foundSources}</div>
                <slot
                  name="sources"
                  @slotchange=${this._handleSlotChange}
                ></slot>
                ${!this.revealAllSources &&
                this.sources.length > this._limitCount
                  ? html`
                      <kyn-button
                        class="reveal-toggle"
                        kind="ghost"
                        @click=${() =>
                          this._toggleLimitRevealed(!this.limitRevealed)}
                      >
                        ${this.limitRevealed
                          ? this._textStrings.showLess
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
        </div>

        <div class="right-div">
          <div class="${classesFeedback1}">
            <div
              class="kyn-pos-feedback-title"
              aria-controls="kyn-pos-feedback-body"
              aria-expanded=${this.opened['pos-feedback']}
              aria-disabled=${this.disabled['pos-feedback']}
              tabindex="0"
              role="button"
              @click="${(e: Event) => this._handleClick(e, 'pos-feedback')}"
              @keypress="${(e: KeyboardEvent) =>
                this._handleKeypress(e, 'pos-feedback')}"
              id="kyn-pos-feedback-title"
            >
              <span @click=${() => this._handleFeedbackSelection('positive')}>
                ${unsafeSVG(thumbsUpIcon)}
              </span>
            </div>

            <div
              class="kyn-pos-feedback-body"
              id="kyn-pos-feedback-body"
              role="region"
              aria-labelledby="kyn-pos-feedback-title"
            >
              <div class="kyn-pos-feedback-detail">
                <slot
                  name="pos-feedback-form"
                  @slotchange=${this._handleSlotChange}
                ></slot>
              </div>
            </div>
          </div>

          <div class="${classesFeedback2}">
            <div
              class="kyn-neg-feedback-title"
              aria-controls="kyn-neg-feedback-body"
              aria-expanded=${this.opened['neg-feedback']}
              aria-disabled=${this.disabled['neg-feedback']}
              tabindex="0"
              role="button"
              @click="${(e: Event) => this._handleClick(e, 'neg-feedback')}"
              @keypress="${(e: KeyboardEvent) =>
                this._handleKeypress(e, 'neg-feedback')}"
              id="kyn-neg-feedback-title"
            >
              <span @click=${() => this._handleFeedbackSelection('negative')}>
                ${unsafeSVG(thumbsDownIcon)}
              </span>
            </div>

            <div
              class="kyn-neg-feedback-body"
              id="kyn-neg-feedback-body"
              role="region"
              aria-labelledby="kyn-neg-feedback-title"
            >
              <div class="kyn-neg-feedback-detail">
                <slot
                  name="neg-feedback-form"
                  @slotchange=${this._handleSlotChange}
                ></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _handleClick(
    e: Event,
    panel: 'sources' | 'pos-feedback' | 'neg-feedback'
  ) {
    e.preventDefault();
    if (!this.disabled[panel]) {
      this._emitToggleEvent(panel);
    }
  }

  private _handleKeypress(
    e: KeyboardEvent,
    panel: 'sources' | 'pos-feedback' | 'neg-feedback'
  ) {
    e.preventDefault();
    if (!this.disabled[panel]) {
      if (e.key == ' ' || e.key == 'Enter') this._emitToggleEvent(panel);
    }
  }

  private _emitToggleEvent(panel: 'sources' | 'pos-feedback' | 'neg-feedback') {
    this.opened = { ...this.opened, [panel]: !this.opened[panel] };

    const event = new CustomEvent('on-toggle', {
      bubbles: true,
      composed: true,
      detail: { opened: this.opened },
    });
    this.dispatchEvent(event);
  }

  protected _handleSlotChange() {
    console.log('_handleSlotChange : this.op', this.opened);
    console.log('_handleSlotChange : this.op', this.disabled);

    this.sources = Array.from(this.querySelectorAll('kyn-card'));
    this._toggleLimitRevealed(this.limitRevealed);
  }

  private _toggleLimitRevealed(revealed: boolean) {
    this.limitRevealed = revealed;

    this.sources.forEach((sourceEl, index) => {
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

    const event = new CustomEvent('on-limit-toggle', {
      detail: { expanded: this.limitRevealed },
    });
    this.dispatchEvent(event);
  }

  private _handleFeedbackSelection(type: 'positive' | 'negative') {
    this.dispatchEvent(
      new CustomEvent('on-feedback-changed', {
        detail: { feedbackType: type },
        bubbles: true,
        composed: true,
      })
    );
  }

  override willUpdate(changedProps: any) {
    console.log('willUpdate : this.op', this.disabled);
    this._textStrings.foundSources = `Found ${this.sources.length} sources :`;
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
