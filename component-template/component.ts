import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import Styles from './component.scss';

/**
 * Example component template.
 * @fires on-click - Captures the click event and emits a custom event.
 * @slot unnamed - Slot for child components.
 */
@customElement('kyn-component')
export class Component extends LitElement {
  static override styles = Styles;

  /** exposed reactive string property */
  @property({ type: String })
  stringProp = '';

  /** exposed reactive boolean property */
  @property({ type: Boolean })
  booleanProp = false; // booleans must always default to false

  /** exposed reactive array property */
  @property({ type: Array })
  arrayProp = [];

  /** internal reactive property
   * @internal
   */
  @state()
  _internalProp = 'Internal Prop'; // use an underscore to signify internal variables/methods

  /** .component element reference. does not get updated until after Lit update lifecycle completes
   * @internal
   */
  @query('.component')
  _component!: HTMLElement;

  override render() {
    return html`
      <div class="component" @click=${(e: Event) => this._handleClick(e)}>
        ${this.stringProp}
        <br />
        ${this._internalProp}
        <br />
        <slot></slot>
      </div>
    `;
  }

  /** click event handler */
  private _handleClick(e: Event) {
    const Event = new CustomEvent('on-click', {
      detail: {
        origEvent: e,
      },
    });
    this.dispatchEvent(Event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-component': Component;
  }
}
