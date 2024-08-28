import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import Styles from './repeatInput.scss';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import clearIcon from '@carbon/icons/es/close/24';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '../numberInput/numberInput';

/**
 * Text input.
 * @fires on-input - Captures the input event and emits the selected value and original event details.
 * @prop {string} pattern - RegEx pattern to validate.
 * @prop {number} minLength - Minimum number of characters.
 * @prop {number} maxLength - Maximum number of characters.
 * @slot unnamed - Slot for label text.
 * @slot icon - Slot for contextual icon.
 */
@customElement('kyn-repeat-input')
export class RepeatInput extends LitElement {
  static override styles = Styles;

  /** .component element reference. does not get updated until after Lit update lifecycle completes
   * @internal
   */
  @query('.component')
  _component!: HTMLElement;

  /** Input size. "sm", "md", or "lg". */
  @property({ type: String })
  size = 'md';

  @property({ type: String })
  caption = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  name = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: String })
  value = '';

  /** Input type, limited to options that are "text like". */
  @property({ type: String })
  type = 'text';

  /** RegEx pattern to validate. */
  @property({ type: String })
  pattern!: string;

  /** Maximum number of characters. */
  @property({ type: Number })
  maxLength!: number;

  /** Minimum number of characters. */
  @property({ type: Number })
  minLength!: number;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  invalidText = '';

  @property({ type: Boolean })
  hideLabel = false;

  @state()
  iconSlotted = false;

  /** Place icon on the right. */
  @property({ type: Boolean })
  iconRight = false;

  @query('input')
  inputEl!: HTMLInputElement;

  @state()
  quantity = 0;

  @state()
  numberInputTouched = false;

  /**
   * Queries any slotted icons.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  iconSlot!: Array<HTMLElement>;

  override render() {
    const classes = {
      'size--sm': this.size === 'sm',
      'size--md': this.size === 'md',
    };
    const itemTemplates = [];
    for (let i = 0; i < this.quantity; i++) {
      itemTemplates.push(html`<li>${this.value}</li>`);
    }
    return html`
      <div class="text-input">
        <label class="label-text">
          <slot></slot>
        </label>

        <div
          class="${classMap({
            'input-wrapper': true,
          })}"
        >
          <input
            class="${classMap(classes)}"
            type=${this.type}
            placeholder=${this.placeholder}
            id=${this.name}
            name=${this.name}
            value=${this.value}
            pattern=${ifDefined(this.pattern)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            ?required=${this.required}
            ?disabled=${this.disabled}
            @input=${(e: any) => this._handleInput(e)}
          />
          ${this.value !== ''
            ? html`
                <button class="clear" @click=${() => this._handleClear()}>
                  <kd-icon .icon=${clearIcon}></kd-icon>
                </button>
              `
            : null}
        </div>
      </div>

      <kyn-number-input
        name="numberInput"
        min="0"
        @on-input=${(e: any) => this._handleNumberInput(e)}
      >
      </kyn-number-input>

      ${this.quantity > 0 && this.value !== ''
        ? html` <ul>
            ${itemTemplates}
          </ul>`
        : this.quantity <= 0
        ? this.numberInputTouched
          ? html`<p>Enter non-zero quantity.</p>`
          : null
        : html`<p>Enter input text.</p>`}
    `;
  }

  private _handleInput(e: any) {
    console.log('_handleInput', e);
    this.value = e.target.value;
    this._emitValue(e);
  }

  _emitValue(e?: any) {
    this.dispatchEvent(
      new CustomEvent('on-input', {
        detail: {
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleClear() {
    console.log('_handleClear');
    this.value = '';
    // this.inputEl.value = '';

    // this._validate(true, false);
    this._emitValue();
  }

  private determineIfSlotted() {
    this.iconSlotted = this.iconSlot.length ? true : false;
  }

  override firstUpdated() {
    this.determineIfSlotted();
  }

  override updated(changedProps: any) {
    if (changedProps.has('value')) {
      this.inputEl.value = this.value;
    }
  }

  _handleNumberInput(e: any) {
    console.log('_handleNumberInput', e.target.value);
    this.numberInputTouched = true;
    this.quantity = e.target.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-repeat-input': RepeatInput;
  }
}
