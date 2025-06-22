import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import MultiInputScss from './multiInputEmailInvite.scss';

import '../tag';
import '../textArea';

const _defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Not in allowed list',
};

/**
 * Multi‐email invite input.
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

  override willUpdate(changed: Map<string, any>) {
    if (changed.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
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

        <div class="container" @click=${() => this.inputEl.focus()}>
          <kyn-tag-group class="tag-group"
            >${this.emails.map(
              (email, i) => html`
                <kyn-tag
                  class="chip ${this.invalids.has(i) ? 'error' : 'success'}"
                  filter
                  clickable
                  @on-close=${() => this.removeAt(i)}
                >
                  ${unsafeSVG(userIcon)} <span>${email}</span>
                </kyn-tag>
              `
            )}</kyn-tag-group
          >

          <textarea
            id=${this.name}
            placeholder=${ifDefined(this.placeholder || undefined)}
            @input=${this.handleInput}
            @keydown=${this.onKeydown}
          >
${this.value}</textarea
          >
        </div>

        <div class="caption-error-count">
          <div>
            ${this.caption
              ? html`<div class="caption" aria-disabled=${this.disabled}>
                  ${this.caption}
                </div>`
              : null}
            ${this._isInvalid
              ? html`
                  <div id="error" class="error">
                    <span
                      role="img"
                      class="error-icon"
                      aria-label=${this._textStrings.errorText}
                      >${unsafeSVG(errorIcon)}</span
                    >
                    ${this._internals.validationMessage}
                  </div>
                `
              : null}
          </div>
          ${this.maxLength
            ? html`
                <div class="count">${this.value.length}/${this.maxLength}</div>
              `
            : null}
        </div>
      </div>
    `;
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

    if (interacted) {
      this._internalValidationMsg = this.inputEl.validationMessage;
    }

    if (report) {
      this._internals.reportValidity();
    }
  }

  private addTagsFromValue(): void {
    const parts = this.inputEl.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    parts.forEach((email) => {
      const idx = this.emails.length;
      this.emails = [...this.emails, email];

      if (!this.allowedEmails.includes(email)) {
        this.invalids.add(idx);
      }
    });

    this.inputEl.value = '';
    this.dispatchEvent(
      new CustomEvent<string[]>('emails-changed', {
        detail: this.emails,
      })
    );
  }

  private onKeydown(e: KeyboardEvent) {
    if ((e.key === 'Enter' && !e.shiftKey) || e.key === ',') {
      e.preventDefault();
      this.addTagsFromValue();
    }
  }

  private removeAt(idx: number) {
    this.emails = this.emails.filter((_, i) => i !== idx);
    this.invalids.delete(idx);
    this.dispatchEvent(
      new CustomEvent<string[]>('emails-changed', {
        detail: this.emails,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-email-invite-input': MultiInputEmailInvite;
  }
}
