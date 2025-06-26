import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import Styles from './component.scss?inline';

/**
 * Example component template.
 * @fires on-click - Captures the click event and emits a custom event.
 * @slot unnamed - Slot for child components.
 */
@customElement('kyn-component')
export class Component extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** exposed reactive string property */
  @property({ type: String })
  accessor stringProp = '';

  /** exposed reactive boolean property */
  @property({ type: Boolean })
  accessor booleanProp = false; // booleans must always default to false

  /** exposed reactive array property */
  @property({ type: Array })
  accessor arrayProp = [];

  /** internal reactive property
   * @internal
   */
  @state()
  accessor _internalProp = 'Internal Prop'; // use an underscore to signify internal variables/methods

  /** .component element reference. does not get updated until after Lit update lifecycle completes
   * @internal
   */
  @query('.component')
  accessor _component!: HTMLElement;

  override render() {
    return html`
      <div class="component">
        ${this.stringProp}
        <br />
        ${this._internalProp}
        <br />
        <slot></slot>
        <button @click=${(e: Event) => this._handleClick(e)}>Button</button>
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
