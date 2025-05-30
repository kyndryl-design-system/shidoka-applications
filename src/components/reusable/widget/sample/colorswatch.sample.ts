import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import ClosedFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-filled.svg';
import CheckMarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';
import Styles from './colorswatch.scss';
import { FormMixin } from '../../../../common/mixins/form-input';

import '../../button';
import '../../textInput';

const colorSwatchArr = [
  '#D9D9D9',
  '#FFFFFF',
  '#E8BA02',
  '#2F808C',
  '#FF462D',
  '#9747FF',
  '#4CDD84',
  '#1D2125',
  '#5FBEAC',
];

/**
 * Color swatch sample.
 */
@customElement('color-swatch')
export class ColorSwatch extends FormMixin(LitElement) {
  static override styles = Styles;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input[type="text"]')
  _inputEl!: HTMLInputElement;

  @state()
  showColorPicker = false;

  @state()
  selected = false;

  @state()
  selectedColor = '#D9D9D9';

  @state()
  addNewColor = true;

  @state()
  formattedColorSwatches = colorSwatchArr.map((color) => ({
    id: color,
    selected: false,
  }));

  override render() {
    return html`
      <div class="bacground-image">
        <div class="bg_title kd-type--body-02">Background Color</div>
        <div class="color-swatch">
          ${this.formattedColorSwatches.map((color) => {
            return html`
              <button
                class="test"
                style="background-color:${color.id};"
                type="button"
                aria-label="Background Color"
                title="Background Color"
                name="Background Color"
                value="hello"
                @click=${(e: Event) => this.handleSelection(e, color.id)}
              >
                ${this.showColorPicker
                  ? html`
                      <span style="display:flex"
                        >${unsafeSVG(ClosedFilledIcon)}</span
                      >
                    `
                  : null}
                ${color.selected && !this.showColorPicker
                  ? html`<span style="display:flex"
                      >${unsafeSVG(CheckMarkFilledIcon)}</span
                    >`
                  : null}
              </button>
            `;
          })}
        </div>
        ${this.addNewColor
          ? html`
              <div>
                <div
                  style="display: flex;align-items: center;gap: 10px;float:left;margin-right: 10px;"
                >
                  <div class="bg_title kd-type--body-02">Pick a color:</div>
                  <input
                    class="custom-color"
                    type="color"
                    name="favcolor"
                    value=${this.selectedColor}
                    @input=${this.handleColorChange}
                    @click=${this.openColorPicker}
                  />
                </div>
                <div style="display: flex;flex-direction: column;">
                  <input
                    type="text"
                    id="inputText"
                    name="inputText"
                    value=${this.value.toString() || this.selectedColor}
                    ?invalid=${this._isInvalid}
                    aria-invalid=${this._isInvalid}
                    aria-describedby=${this._isInvalid ? 'error' : ''}
                    pattern="^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"
                    @input=${(e: any) => this.handleTextInput(e)}
                  />
                  ${this._isInvalid
                    ? html`
                        <div id="error" class="error">
                          <span role="img" class="error-icon" aria-label="Error"
                            >${unsafeSVG(errorIcon)}</span
                          >
                          ${this.invalidText || this._internalValidationMsg}
                        </div>
                      `
                    : null}
                </div>
              </div>
              <div class="add_color">
                <kyn-button
                  style="width:100%"
                  kind="secondary"
                  type="button"
                  size="medium"
                  iconposition="right"
                  description="Save"
                  ?disabled=${this.isSaveDisabled}
                  @on-click=${(e: Event) => this.handleSave(e, 'save')}
                >
                  Save
                </kyn-button>
                <kyn-button
                  style="width:100%"
                  kind="tertiary"
                  type="button"
                  size="medium"
                  iconposition="right"
                  description="Cancel"
                  @on-click=${(e: Event) => this.handleSave(e, 'cancel')}
                >
                  Cancel
                </kyn-button>
              </div>
            `
          : html`
              <kyn-button
                style="width:100%"
                kind="secondary"
                type="button"
                size="medium"
                iconposition="right"
                description="Add new color"
                @on-click=${(e: Event) => this.handleAddNewColor(e)}
              >
                Add New Color
              </kyn-button>
            `}
      </div>
    `;
  }

  private handleSelection(e: any, id: string) {
    this.formattedColorSwatches = this.formattedColorSwatches.map((color) =>
      color.id.toLowerCase() === id.toLowerCase()
        ? { ...color, selected: true }
        : { ...color, selected: false }
    );
    if (this.showColorPicker) {
      this.formattedColorSwatches = this.formattedColorSwatches.filter(
        (color) => color.id.toLowerCase() !== id.toLowerCase()
      );
    }
  }

  private handleColorChange(e: any) {
    this.selectedColor = e.target.value;
    const textInput = this.shadowRoot?.querySelector('kyn-text-input');
    if (textInput) {
      textInput.value = this.selectedColor;
    }
  }

  private handleTextInput(e: any) {
    const inputColor = e.target.value;
    this.selectedColor = inputColor;
    this._validate(true, true);
  }

  private openColorPicker() {
    this.showColorPicker = !this.showColorPicker;
    this.selected = false;
  }

  private handleAddNewColor(e: Event) {
    e.preventDefault();
    this.addNewColor = !this.addNewColor;
    this.showColorPicker = false;
    this.selected = false;
  }
  private handleSave(e: Event, action: string) {
    if (action === 'save') {
      const colorExists = this.formattedColorSwatches.some(
        (color) => color.id.toLowerCase() === this.selectedColor.toLowerCase()
      );
      if (!colorExists) {
        this.formattedColorSwatches.push({
          id: this.selectedColor,
          selected: false,
        });
      }
    }
    this.addNewColor = false;
    this.showColorPicker = false;
    this.selected = false;
  }

  private get isSaveDisabled() {
    const isValidHexColor = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
      this.selectedColor
    );
    return !this.selectedColor || !isValidHexColor;
  }

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from inputEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this._inputEl.validity, customError: true }
        : this._inputEl.validity;
    // set validationMessage to invalidText if present, otherwise use inputEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this._inputEl.validationMessage;

    // set validity on custom element, anchor to inputEl
    this._internals.setValidity(Validity, ValidationMessage, this._inputEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = this._inputEl.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  override updated(changedProps: any) {
    // preserve FormMixin updated function
    this._onUpdated(changedProps);

    if (changedProps.has('value')) {
      // set value on input element
      this._inputEl.value = this.selectedColor;
      this._validate(true, false);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-swatch': ColorSwatch;
  }
}
