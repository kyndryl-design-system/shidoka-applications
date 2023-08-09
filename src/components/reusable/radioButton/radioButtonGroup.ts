import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import RadioButtonGroupScss from './radioButtonGroup.scss';

/**
 * Radio button group container.
 * @fires on-radio-group-change - Captures the change event and emits the selected value.
 * @slot unnamed - Slot for individual radio buttons.
 */
@customElement('kyn-radio-button-group')
export class RadioButtonGroup extends LitElement {
  static override styles = RadioButtonGroupScss;

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /** Radio button group label text. */
  @property({ type: String })
  labelText = '';

  /** Radio button input name attribute. */
  @property({ type: String })
  name = '';

  /** Radio button group selected value. */
  @property({ type: String })
  value = '';

  /**
   * Queries for slotted radio buttons.
   * @ignore
   */
  @queryAssignedElements()
  radioButtons!: Array<any>;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  override render() {
    return html`
      <fieldset>
        <legend>${this.labelText}</legend>
        <slot></slot>
      </fieldset>
    `;
  }

  override updated(changedProps: any) {
    if (changedProps.has('name')) {
      // set name for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.name = this.name;
      });
    }

    if (changedProps.has('value')) {
      // set checked state for each radio button
      this.radioButtons.forEach((radio: any) => {
        radio.checked = radio.value === this.value;
      });

      // set form data value
      this.internals.setFormValue(this.value);
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    // capture child radio buttons change event
    this.addEventListener('on-radio-change', (e: any) => {
      // set selected value
      this.value = e.detail.value;

      // emit selected value
      const event = new CustomEvent('on-radio-group-change', {
        detail: { value: e.detail.value },
      });
      this.dispatchEvent(event);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-radio-button-group': RadioButtonGroup;
  }
}
