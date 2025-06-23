import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import MultiInputScss from './multiInputEmailInvite.scss';

import '../tag';
import '../textArea';

const _defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Not in allowed list',
  placeholderAdd: 'Add another email address',
};

/**
 * Multi-input email invite.
 * @fires on-input – emits { value, origEvent } on every keystroke
 * @fires emails-changed – emits string[] after tags are added/removed
 */
@customElement('kyn-email-invite-input')
export class MultiInputEmailInvite extends FormMixin(LitElement) {
  static override styles = [MultiInputScss];

  /** List of emails deemed “valid” for success tags. */
  @property({ type: Array })
  allowedEmails: string[] = [];

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Helper or error caption. */
  @property({ type: String })
  caption = '';

  /** Makes field required. */
  @property({ type: Boolean })
  required = false;

  /** Placeholder text. */
  @property({ type: String })
  placeholder = '';

  /** Disable the textarea. */
  @property({ type: Boolean })
  disabled = false;

  /** Read‐only mode. */
  @property({ type: Boolean })
  readonly = false;

  /** Hide visible label (for screen‐reader only). */
  @property({ type: Boolean })
  hideLabel = false;

  /** Maximum number of email tags allowed. */
  @property({ type: Number })
  maxEmailAddresses?: number;

  /** Name attribute (for form‐internals). */
  @property({ type: String })
  override name = '';

  /** Maximum character count. */
  @property({ type: Number })
  maxLength?: number;

  /** Minimum character count. */
  @property({ type: Number })
  minLength?: number;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Merged internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /** Entered email tags.
   * @internal
   */
  @state()
  emails: string[] = [];

  /** Indexes of invalid emails in `emails`.
   * @internal
   */
  @state()
  invalids = new Set<number>();

  /** Current type-ahead suggestions.
   * @internal
   */
  @state()
  suggestions: string[] = [];

  /** Whether the suggestion panel is expanded.
   * @internal
   */
  @state()
  _expanded = false;

  /** Currently highlighted suggestion index.
   * @internal
   */
  @state()
  highlightedIndex = -1;

  /** Inline ‘top’ style for suggestions (px)
   * @internal
   */
  @state()
  private _suggestionTop = '0px';

  /** Inline ‘left’ style for suggestions (px)
   * @internal
   */
  @state()
  private _suggestionLeft = '0px';

  /** Container wrapper for relative positioning */
  @query('.container')
  private _containerEl!: HTMLElement;

  /** The `<textarea>` element.
   * @ignore
   */
  @query('textarea')
  inputEl!: HTMLTextAreaElement;

  private static _mockDb: string[] = [
    'alice@example.com',
    'bob.smith@example.com',
    'charlie@example.org',
    'someone@acme.com',
    'evan@example.net',
    'frank@example.io',
    'example@email.com',
    'john.doe@email.com',
    'suzy.example@email.com',
  ];

  override render() {
    const validCount = this.emails.filter((email) =>
      this.allowedEmails.includes(email)
    ).length;

    const placeholderText =
      this.emails.length > 0
        ? this._textStrings.placeholderAdd
        : this.placeholder;

    return html`
      <div>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                role="img"
                aria-label=${this._textStrings.requiredText}
                >*</abbr
              >`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div
          class="${classMap({
            container: true,
            'error-state': this._isInvalid,
          })}"
          @click=${() => this.inputEl.focus()}
          ?invalid=${this._isInvalid}
          aria-invalid=${this._isInvalid}
          aria-describedby=${this._isInvalid ? 'error' : ''}
        >
          <kyn-tag-group class="tag-group" filter>
            ${this.emails.map((email, i) => {
              const isInvalid = !this.allowedEmails.includes(email);
              return html`
                <kyn-tag
                  class="indiv-tag"
                  tagColor=${isInvalid ? 'lilac' : 'spruce'}
                  noTruncation
                  @on-close=${() => this.removeAt(i)}
                >
                  ${unsafeSVG(userIcon)}<span>${email}</span>
                </kyn-tag>
              `;
            })}
            <textarea
              id=${this.name}
              .value=${this.value}
              placeholder=${ifDefined(placeholderText)}
              @focus=${() => this._handleFocus()}
              @blur=${() => this._handleBlur()}
              @input=${(e: InputEvent) => this.handleInput(e)}
              @keydown=${(e: KeyboardEvent) => this.onKeydown(e)}
            ></textarea>
          </kyn-tag-group>

          <div
            class="suggestions"
            style="top: ${this._suggestionTop}; left: ${this._suggestionLeft};"
            ?hidden=${!this._expanded || this.suggestions.length === 0}
          >
            ${this.suggestions.map(
              (sugg, suggIndex) => html`
                <div
                  class=${classMap({
                    suggestion: true,
                    highlighted: suggIndex === this.highlightedIndex,
                  })}
                  @mousedown=${(e: MouseEvent) => e.preventDefault()}
                  @click=${() => this._selectSuggestion(sugg)}
                >
                  ${sugg}
                </div>
              `
            )}
          </div>
        </div>

        <div class="caption-count-container">
          <div class="caption-error-count">
            <div>
              ${this.caption
                ? html`<div class="caption" aria-disabled=${this.disabled}>
                    ${this.caption}
                  </div>`
                : null}
              ${this._isInvalid
                ? html`<div id="error" class="error">
                    <span
                      role="img"
                      class="error-icon"
                      aria-label=${this._textStrings.errorText}
                      >${unsafeSVG(errorIcon)}</span
                    >
                    ${this._internals.validationMessage}
                  </div>`
                : null}
            </div>
          </div>
          ${this.maxEmailAddresses
            ? html`<div class="validated-count">
                ${validCount}/${this.maxEmailAddresses}
              </div>`
            : null}
        </div>
      </div>
    `;
  }

  override willUpdate(changed: Map<string, any>) {
    if (changed.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  private handleInput(e: InputEvent) {
    if (this.readonly) return;
    this.value = (e.target as HTMLTextAreaElement).value;
    this._validate(true, false);

    this._expanded = true;

    this.dispatchEvent(
      new CustomEvent('on-input', {
        detail: { value: this.value, origEvent: e },
      })
    );

    this._fetchSuggestions();
  }

  private _handleFocus() {
    this._expanded = true;
    this.highlightedIndex = -1;
  }

  private _handleBlur() {
    setTimeout(() => {
      this._expanded = false;
    }, 100);
  }

  private async _fetchSuggestions() {
    const query = this.inputEl.value.trim();
    if (!query) {
      this.suggestions = [];
      return;
    }
    this.suggestions = await this._queryEmails(query);
    this.highlightedIndex = -1;

    this._updateSuggestionPosition();
  }

  private async _queryEmails(query: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const lower = query.toLowerCase();
    return MultiInputEmailInvite._mockDb.filter((email) =>
      email.toLowerCase().includes(lower)
    );
  }

  private _selectSuggestion(suggestion: string) {
    const idx = this.emails.length;
    this.emails = [...this.emails, suggestion];
    const invalidSet =
      this.invalids instanceof Set
        ? new Set(this.invalids)
        : new Set<number>(this.invalids as unknown as number[]);
    if (!this.allowedEmails.includes(suggestion)) invalidSet.add(idx);
    this.invalids = invalidSet;

    this.suggestions = [];
    this._expanded = false;
    this.inputEl.value = '';
    this.value = '';

    this.dispatchEvent(
      new CustomEvent<string[]>('emails-changed', { detail: this.emails })
    );

    this.inputEl.focus();
    this._expanded = true;
    this._fetchSuggestions();
  }

  private onKeydown(e: KeyboardEvent): void {
    const UP = 'ArrowUp',
      DOWN = 'ArrowDown',
      ENTER = 'Enter';
    if (
      this._expanded &&
      this.suggestions.length > 0 &&
      [UP, DOWN, ENTER].includes(e.key)
    ) {
      e.preventDefault();
      if (e.key === DOWN) {
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          this.suggestions.length - 1
        );
      } else if (e.key === UP) {
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      } else if (e.key === ENTER && this.highlightedIndex >= 0) {
        this._selectSuggestion(this.suggestions[this.highlightedIndex]);
      }
      return;
    }

    if ((e.key === 'Enter' && !e.shiftKey) || e.key === ',') {
      e.preventDefault();
      this.addTagsFromValue();
    }
  }

  private _updateSuggestionPosition() {
    const textarea = this.inputEl;
    const container = this._containerEl;
    const selEnd = textarea.selectionEnd ?? textarea.value.length;

    const mirror = document.createElement('div');
    const style = getComputedStyle(textarea);
    for (const prop of [
      'font-size',
      'font-family',
      'font-weight',
      'line-height',
      'padding',
      'border',
      'box-sizing',
      'white-space',
      'word-wrap',
      'width',
    ]) {
      mirror.style.setProperty(prop, style.getPropertyValue(prop));
    }
    mirror.style.position = 'absolute';
    mirror.style.top = `${textarea.offsetTop}px`;
    mirror.style.left = `${textarea.offsetLeft}px`;
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';
    mirror.textContent = textarea.value.slice(0, selEnd);

    container.appendChild(mirror);

    const span = document.createElement('span');
    span.textContent = textarea.value.slice(selEnd) || '.';
    mirror.appendChild(span);

    const spanLeft = span.offsetLeft;
    const spanTop = span.offsetTop;
    const lh = parseFloat(style.lineHeight) || span.offsetHeight;

    const topPx = textarea.offsetTop + spanTop + lh;
    const leftPx = textarea.offsetLeft + spanLeft;

    this._suggestionTop = `${topPx}px`;
    this._suggestionLeft = `${leftPx}px`;

    container.removeChild(mirror);
  }

  private _validate(interacted: boolean, report: boolean): void {
    const validityState = this.invalidText
      ? { ...this.inputEl.validity, customError: true }
      : this.inputEl.validity;
    const validationMessage = this.invalidText
      ? this.invalidText
      : this.inputEl.validationMessage;
    this._internals.setValidity(validityState, validationMessage, this.inputEl);
    if (interacted)
      this._internalValidationMsg = this.inputEl.validationMessage;
    if (report) this._internals.reportValidity();
  }

  private addTagsFromValue(): void {
    const parts = this.inputEl.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const invalidSet =
      this.invalids instanceof Set
        ? new Set(this.invalids)
        : new Set<number>(this.invalids as unknown as number[]);
    parts.forEach((email) => {
      const idx = this.emails.length;
      this.emails = [...this.emails, email];
      if (!this.allowedEmails.includes(email)) invalidSet.add(idx);
    });
    this.invalids = invalidSet;
    this.inputEl.value = '';
    this.value = '';
    this.dispatchEvent(
      new CustomEvent<string[]>('emails-changed', { detail: this.emails })
    );
  }

  private removeAt(idx: number) {
    this.emails = this.emails.filter((_, i) => i !== idx);

    const invalidSet =
      this.invalids instanceof Set
        ? new Set(this.invalids)
        : new Set<number>(this.invalids as unknown as number[]);
    invalidSet.delete(idx);
    const shifted = new Set<number>(
      [...invalidSet].map((i) => (i > idx ? i - 1 : i))
    );
    this.invalids = shifted;

    this.dispatchEvent(
      new CustomEvent<string[]>('emails-changed', { detail: this.emails })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-email-invite-input': MultiInputEmailInvite;
  }
}
