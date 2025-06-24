import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';
import {
  isValidEmail,
  maxEmailsExceededCheck,
  isEmailDuplicate,
  defaultTextStrings,
  validateAllEmailTags,
} from '../../../common/helpers/multiInputValidationsHelper';

import '../tag';

import MultiInputScss from './multiInputEmailInvite.scss';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';

/**
 * Multi-input email invite.
 * @fires on-input – emits { value, origEvent } on every keystroke
 * @fires on-change – emits string[] after tags are added/removed
 */
@customElement('kyn-email-invite-input')
export class MultiInputEmailInvite extends FormMixin(LitElement) {
  static override styles = [MultiInputScss];

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

  /** Whether automatic suggestion is active. */
  @property({ type: Boolean })
  autoSuggestionDisabled = false;

  /** Maximum number of email tags allowed. */
  @property({ type: Number })
  maxEmailAddresses?: number;

  /** Name attribute (for form‐internals). */
  @property({ type: String })
  override name = '';

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = defaultTextStrings;

  /** Custom override error message. */
  @property({ type: String })
  override invalidText = '';

  /** Force the component into error state (for stories). */
  @property({ type: Boolean, reflect: true })
  invalid = false;

  /** Disable all validations. */
  @property({ type: Boolean })
  validationsDisabled = false;

  /** Merged internal text strings.
   * @internal
   */
  @state()
  private _textStrings = defaultTextStrings;

  /** Entered email tags.
   * @internal
   */
  @state()
  private _emails: string[] = [];

  /** Flag to track if initial value has been processed
   * @internal
   */
  private _initialValueProcessed = false;

  /** Indexes of invalid emails in `_emails`.
   * @internal
   */
  @state()
  private _invalids = new Set<number>();

  /** Current type-ahead suggestions.
   * @internal
   */
  @state()
  private suggestions: string[] = [];

  /** Whether the suggestion panel is expanded.
   * @internal
   */
  @state()
  private _expanded = false;

  /** Currently highlighted suggestion index.
   * @internal
   */
  @state()
  private highlightedIndex = -1;

  /** Inline 'top' style for suggestions (px)
   * @internal
   */
  @state()
  private _suggestionTop = '0px';

  /** Inline 'left' style for suggestions (px).
   * @internal
   */
  @state()
  private _suggestionLeft = '0px';

  /** Displayed validation message.
   * @internal
   */
  @state()
  private _validationMessage = '';

  /** Container wrapper for relative positioning
   * @ignore
   */
  @query('.container')
  private _containerEl!: HTMLElement;

  /** The `<input>` element.
   * @ignore
   */
  @query('input')
  private inputEl!: HTMLTextAreaElement;

  /** Mock database of emails to simulate type-ahead suggestions.
   * @ignore
   */
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
    const error = this._isInvalid;

    const stateMgmtClasses = {
      disabled: this.disabled,
      'is-readonly': this.readonly,
      'error-state': error,
    };

    const validCount = this.validationsDisabled
      ? this._emails.length
      : this._emails.filter((email: string) => isValidEmail(email)).length;

    const placeholderText =
      this._emails.length > 0
        ? this._textStrings.placeholderAdditional
        : this.placeholder;

    return html`
      <div ?disabled=${this.disabled} ?readonly=${this.readonly}>
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${
            this.required
              ? html`<abbr
                  class="required"
                  title=${this._textStrings.requiredText}
                  role="img"
                  aria-label=${this._textStrings.requiredText}
                  >*</abbr
                >`
              : null
          }
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div
          class="${classMap({
            container: true,
            ...stateMgmtClasses,
          })}"
          @click=${() => this.inputEl.focus()}
          ?invalid=${this._isInvalid}
          aria-invalid=${this._isInvalid}
          aria-describedby=${this._isInvalid ? 'error' : ''}
        >
          <kyn-tag-group
            class="tag-group"
            ?filter=${!this.readonly && !this.disabled}
          >
            ${this._emails.map((email: string, i: number) => {
              const isInvalid =
                !this.validationsDisabled && !isValidEmail(email);
              return html`
                <kyn-tag
                  class="indiv-tag"
                  tagColor=${isInvalid ? 'lilac' : 'spruce'}
                  noTruncation
                  ?clickable=${!this.readonly && !this.disabled}
                  ?disabled=${this.disabled}
                  ?readonly=${this.readonly}
                  @on-close=${() => this.removeAt(i)}
                >
                  ${unsafeSVG(userIcon)}<span>${email}</span>
                </kyn-tag>
              `;
            })}
            <input
              class="${classMap({
                ...stateMgmtClasses,
              })}"
              type="email"
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              id=${this.name}
              borderless
              placeholder=${ifDefined(placeholderText)}
              @focus=${() => this._handleFocus()}
              @blur=${() => {
                this._validateAllTags();
                this._handleBlur();
              }}
              @input=${(e: InputEvent) => this.handleInput(e)}
              @keydown=${(e: KeyboardEvent) => this.onKeydown(e)}
            ></input>
          </kyn-tag-group>

          ${
            !this.autoSuggestionDisabled
              ? html`<div
                  class="suggestions"
                  style="top: ${this._suggestionTop}; left: ${this
                    ._suggestionLeft};"
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
                </div>`
              : null
          }
        </div>

        <div class="caption-count-container">
          <div>
            ${
              this.caption
                ? html`<div class="caption" aria-disabled=${this.disabled}>
                    ${this.caption}
                  </div>`
                : null
            }
            ${
              error
                ? html`<div id="error" class="error">
                    <span role="img" class="error-icon" aria-label="error">
                      ${unsafeSVG(errorIcon)}
                    </span>
                    ${this.invalidText || this._validationMessage}
                  </div>`
                : null
            }
          </div>
          ${
            this.maxEmailAddresses
              ? html`<div class="validated-count">
                  ${validCount}/${this.maxEmailAddresses}
                </div>`
              : null
          }
        </div>
      </div>
    `;
  }

  override updated(_changed: Map<string, any>) {
    this._validateAllTags();

    if (this._emails.length > 0 && !this.validationsDisabled) {
      this._validate(true);

      const invalidTagIndexes = this._emails
        .map((e: string, i: number) => (!isValidEmail(e) ? i : -1))
        .filter((i: number) => i >= 0);
      const hasInvalidTags = invalidTagIndexes.length > 0;

      const isMaxExceeded =
        this.maxEmailAddresses !== undefined &&
        this._emails.length > this.maxEmailAddresses;

      const uniqueEmails = new Set(this._emails);
      const hasDuplicates = uniqueEmails.size < this._emails.length;

      if (hasInvalidTags || isMaxExceeded || hasDuplicates) {
        this._isInvalid = true;
      }
    }

    this.value = this._emails.join(', ');

    this._internals.setFormValue(this.value);

    if (this._internals.form) {
      this._internals.form.setAttribute(`data-${this.name}-emails`, 'true');

      (this._internals.form as any)[`${this.name}Emails`] = [...this._emails];
    }
  }

  override willUpdate(changed: Map<string, any>) {
    if (changed.has('textStrings')) {
      this._textStrings = deepmerge(defaultTextStrings, this.textStrings);
    }

    if (
      !this._initialValueProcessed &&
      changed.has('value') &&
      typeof this.value === 'string' &&
      this.value &&
      this._emails.length === 0
    ) {
      const emailsFromValue = this.value.includes(',')
        ? this.value
            .split(',')
            .map((email: string) => email.trim())
            .filter(Boolean)
        : [this.value.trim()].filter(Boolean);

      if (emailsFromValue.length > 0) {
        this._emails = emailsFromValue;
        this._initialValueProcessed = true;
      }
    }
  }

  override firstUpdated(): void {
    if (this._emails.length > 0) {
      if (this.inputEl && this.inputEl.value) {
        this.inputEl.value = '';
      }
      this._validateAllTags();
    }
  }

  private handleInput(e: InputEvent) {
    if (this.readonly) return;

    const inputValue = (e.target as HTMLTextAreaElement).value;

    if (
      inputValue.length === 1 &&
      this._emails.length > 0 &&
      this._emails[this._emails.length - 1] === inputValue
    ) {
      return;
    }

    this._validate(true);

    this._expanded = true;

    this.dispatchEvent(
      new CustomEvent('on-input', {
        detail: { value: inputValue, origEvent: e },
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
    if (!this.validationsDisabled) {
      if (
        maxEmailsExceededCheck(this._emails.length, 1, this.maxEmailAddresses)
      ) {
        const state = { ...this._internals.validity };
        state.customError = true;
        const msg = this._textStrings.emailMaxExceededError;
        this._validationMessage = msg;
        this._internals.setValidity(state, msg, this.inputEl);

        this.suggestions = [];
        this._expanded = false;
        this.inputEl.focus();
        return;
      }

      if (isEmailDuplicate(suggestion, this._emails)) {
        const state = { ...this._internals.validity };
        state.customError = true;
        const msg = this._textStrings.duplicateEmail;
        this._validationMessage = msg;
        this._internals.setValidity(state, msg, this.inputEl);

        this.suggestions = [];
        this._expanded = false;
        this.inputEl.focus();
        return;
      }
    }

    const idx = this._emails.length;
    this._emails = [...this._emails, suggestion];
    const invalidSet =
      this._invalids instanceof Set
        ? new Set(this._invalids)
        : new Set<number>(this._invalids as unknown as number[]);
    if (!this.validationsDisabled && !isValidEmail(suggestion))
      invalidSet.add(idx);
    this._invalids = invalidSet;

    this._validateAllTags();

    this.suggestions = [];
    this._expanded = false;
    this.inputEl.value = '';

    this.dispatchEvent(
      new CustomEvent<string[]>('on-change', { detail: this._emails })
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
      'width',
    ]) {
      mirror.style.setProperty(prop, style.getPropertyValue(prop));
    }
    mirror.style.position = 'absolute';
    mirror.style.top = `${textarea.offsetTop}px`;
    mirror.style.left = `${textarea.offsetLeft}px`;
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
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

  private _validate(_interacted: boolean): void {
    this._validateAllTags();
  }

  private _validateAllTags(): void {
    const validationResult = validateAllEmailTags(
      this._emails,
      this.required,
      this.maxEmailAddresses,
      this.invalidText,
      this._textStrings,
      this.validationsDisabled,
      this.invalid
    );

    const state = { ...this._internals.validity, ...validationResult.state };

    this._validationMessage = validationResult.message;
    this._isInvalid = validationResult.hasError;

    if (this.inputEl) {
      this._internals.setValidity(
        state,
        validationResult.message,
        this.inputEl
      );
    } else {
      this._internals.setValidity(state, validationResult.message);
    }
  }

  private addTagsFromValue(): void {
    const parts = this.inputEl.value
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (
      !this.validationsDisabled &&
      maxEmailsExceededCheck(
        this._emails.length,
        parts.length,
        this.maxEmailAddresses
      )
    ) {
      const state = { ...this._internals.validity };
      state.customError = true;
      const msg = this._textStrings.emailMaxExceededError;
      this._validationMessage = msg;
      this._internals.setValidity(state, msg, this.inputEl);
      return;
    }

    const invalidSet =
      this._invalids instanceof Set
        ? new Set(this._invalids)
        : new Set<number>(this._invalids as unknown as number[]);

    const existingEmails = new Set(this._emails);
    const newEmails: string[] = [];
    let duplicateFound = false;

    for (const email of parts) {
      if (
        !this.validationsDisabled &&
        isEmailDuplicate(email, existingEmails)
      ) {
        const state = { ...this._internals.validity };
        state.customError = true;
        const msg = this._textStrings.duplicateEmail;
        this._validationMessage = msg;
        this._internals.setValidity(state, msg, this.inputEl);
        duplicateFound = true;
        break;
      }

      existingEmails.add(email);
      newEmails.push(email);

      const idx = this._emails.length + newEmails.length - 1;
      if (!this.validationsDisabled && !isValidEmail(email)) {
        invalidSet.add(idx);
      }
    }

    if (duplicateFound) {
      return;
    }

    this._emails = [...this._emails, ...newEmails];
    this._invalids = invalidSet;

    this._validateAllTags();

    this.inputEl.value = '';
    this.dispatchEvent(
      new CustomEvent<string[]>('on-change', { detail: this._emails })
    );
  }

  private removeAt(idx: number) {
    this._emails = this._emails.filter((_: string, i: number) => i !== idx);

    const invalidSet =
      this._invalids instanceof Set
        ? new Set(this._invalids)
        : new Set<number>(this._invalids as unknown as number[]);
    invalidSet.delete(idx);
    const shifted = new Set<number>(
      [...invalidSet].map((i: number) => (i > idx ? i - 1 : i))
    );
    this._invalids = shifted;

    if (this._emails.length === 0) {
      this._isInvalid = false;
      this._validationMessage = '';
      const state = { ...this._internals.validity };
      state.customError = false;
      state.valueMissing = false;
      this._internals.setValidity(state, '', this.inputEl);
    } else {
      this._validateAllTags();
    }

    this.dispatchEvent(
      new CustomEvent<string[]>('on-change', { detail: this._emails })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-email-invite-input': MultiInputEmailInvite;
  }
}
