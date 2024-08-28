import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import Styles from './details.scss';

/**
 * Example component template.
 * @fires on-click - Captures the click event and emits a custom event.
 * @slot unnamed - Slot for child components.
 */
@customElement('kyn-details')
export class Details extends LitElement {
  static override styles = Styles;

  /** exposed reactive string property */
  @property({ type: String })
  summary = '';

  /** exposed reactive array property */
  @property({ type: Array })
  details: Array<any> = [];

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
      <details>
        <summary @click=${(e: Event) => this._handleClick(e)}>
          ${this.summary ? this.summary : this._internalProp}
        </summary>
        <ol>
          ${this.details &&
          this.details.map((e: any) => {
            return html`<li
              class="gradient-text"
              @click=${() => this.handleClickItem(e)}
            >
              ${e}
            </li>`;
          })}
        </ol>
      </details>
    `;
  }

  /** click event handler */
  private _handleClick(e: Event) {
    const Event = new CustomEvent('on-click', {
      detail: {
        origEvent: e,
      },
    });
    console.log('_handleClick : click event', Event);
    this.dispatchEvent(Event);
  }

  private handleClickItem(e: Event) {
    console.log('handleClickItem : click event', e);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-details': Details;
  }
}
