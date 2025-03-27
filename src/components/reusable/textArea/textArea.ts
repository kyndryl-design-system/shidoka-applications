import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormMixin } from '../../../common/mixins/form-input';
import { deepmerge } from 'deepmerge-ts';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

import TextAreaScss from './textArea.scss';
import { classMap } from 'lit/directives/class-map.js';

const _defaultTextStrings = {
  requiredText: 'Required',
  errorText: 'Error',
};

/**
 * Text area.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot tooltip - Slot for tooltip.
 */
@customElement('kyn-text-area')
export class TextArea extends FormMixin(LitElement) {
  static override styles = TextAreaScss;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Optional text beneath the input. */
  @property({ type: String })
  caption = '';

  /** Input placeholder. */
  @property({ type: String })
  placeholder = '';

  /** Makes the input required. */
  @property({ type: Boolean })
  required = false;

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Input readonly state. */
  @property({ type: Boolean })
  readonly = false;

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength!: number;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength!: number;

  /** Set it to `true`, if text area is not resizeable. */
  @property({ type: Boolean })
  notResizeable = false;

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

  /** textarea rows attribute. The number of visible text lines.
   * **Required** when `aiConnected` is set to `true`.
   */
  @property({ type: Number })
  rows!: number;

  /** Set this to `true` for AI theme. */
  @property({ type: Boolean })
  aiConnected = false;

  /** Maximum number of visible text lines allowed. Default `5` rows. <br />
   * **NOTE**: Applies only when `aiConnected` is set to `true`. <br />
   * `rows` is always less than or equal to `maxRowsVisible` and `rows` is used as minimum number of visible text lines.
   */
  @property({ type: Number })
  maxRowsVisible = 5;

  /** Customizable text strings. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Queries the <textarea> DOM element.
   * @ignore
   */
  @query('textarea')
  textareaEl!: HTMLTextAreaElement;

  override render() {
    return html`
      <div
        class="text-area"
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
      >
        <label
          class="label-text ${this.hideLabel ? 'sr-only' : ''}"
          for=${this.name}
        >
          ${this.required
            ? html`<abbr
                class="required"
                title=${this._textStrings.requiredText}
                role="img"
                aria-label=${this._textStrings?.requiredText}
                >*</abbr
              >`
            : null}
          ${this.label}
          <slot name="tooltip"></slot>
        </label>

        <div
          class=${classMap({
            'input-wrapper': true,
            'ai-connected': this.aiConnected,
            'no-resize': this.notResizeable,
          })}
        >
          <textarea
            id=${this.name}
            class=${this.readonly ? 'is-readonly' : ''}
            name=${this.name}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?invalid=${this._isInvalid}
            aria-invalid=${this._isInvalid}
            aria-describedby=${this._isInvalid ? 'error' : ''}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            rows=${this.rows}
            @input=${(e: any) => this.handleInput(e)}
          >
${this.value}</textarea
          >
        </div>

        <div class="caption-error-count">
          <div>
            ${this.caption !== ''
              ? html`
                  <div
                    class="caption"
                    aria-disabled=${this.disabled}
                    aria-readonly=${this.readonly}
                  >
                    ${this.caption}
                  </div>
                `
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

                    ${this.invalidText || this._internalValidationMsg}
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

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  private handleInput(e: any) {
    if (this.readonly) return;
    this.value = e.target.value;

    if (this.aiConnected) this._updateVisibleRows();

    this._validate(true, false);

    // emit selected value
    const event = new CustomEvent('on-input', {
      detail: {
        value: e.target.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private _updateVisibleRows() {
    const textarea = this.shadowRoot?.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.minHeight = `${this.rows * 24 + 32}px`; // 24 -> line height, 32px -> text area padding
      textarea.style.height = `${textarea.scrollHeight + 2}px`; // 2px -> minor adjustment
      textarea.style.maxHeight = `${this.maxRowsVisible * 24 + 32}px`; // 24 -> line height, 32px -> text area padding
    }
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('value')) {
      this.textareaEl.value = this.value;
    }
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from textareaEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this.textareaEl.validity, customError: true }
        : this.textareaEl.validity;
    // set validationMessage to invalidText if present, otherwise use textareaEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this.textareaEl.validationMessage;

    // set validity on custom element, anchor to textareaEl
    this._internals.setValidity(Validity, ValidationMessage, this.textareaEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = this.textareaEl.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-text-area': TextArea;
  }
}
