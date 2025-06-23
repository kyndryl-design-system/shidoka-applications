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

  /** The `<textarea>` element.
   * @ignore
   */
  @query('textarea')
  inputEl!: HTMLTextAreaElement;

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
              @input=${(e: InputEvent) => this.handleInput(e)}
              @keydown=${(e: KeyboardEvent) => this.onKeydown(e)}
            ></textarea>
          </kyn-tag-group>
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
    this.dispatchEvent(
      new CustomEvent('on-input', {
        detail: { value: this.value, origEvent: e },
      })
    );
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

  private onKeydown(e: KeyboardEvent) {
    if ((e.key === 'Enter' && !e.shiftKey) || e.key === ',') {
      e.preventDefault();
      this.addTagsFromValue();
    }
  }

  private removeAt(idx: number) {
    // 1) remove the tag from the array
    this.emails = this.emails.filter((_, i) => i !== idx);

    // 2) normalize invalids to a Set, delete the removed index, and shift higher indexes down
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
