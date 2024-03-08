import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';

@customElement('kyn-card-single-select')
export class CardSingleSelect extends LitElement {
  /** Card select type. `single` and `multiple`  */
  @property({ type: String })
  type = 'single';

  /** Card group selected value. */
  @property({ type: String })
  value = '';
  /**
   * Queries for slotted cards.
   * @ignore
   */
  @queryAssignedElements()
  cards!: Array<any>;

  override render() {
    return html`<div><slot></slot></div>`;
  }

  override updated(changedProps: any) {
    if (changedProps.has('value')) {
      // set checked state for each radio button
      if (this.type === 'single') {
        this.cards.forEach((cards: any) => {
          cards.checked = cards.value === this.value;
        });
      }
      if (this.type === 'multiple') {
        this.cards.forEach((cards: any) => {
          cards.checked = this.value.includes(cards.value);
        });
      }
    }
  }

  private _handleCardChange(e: any) {
    if (this.type === 'single') {
      this.value = e.detail.value;
      // emit selected value
      const event = new CustomEvent('on-card-group-change', {
        detail: { value: e.detail.value },
      });
      this.dispatchEvent(event);
    } else {
      const value = e.detail.value;
      const newValues = [...this.value];
      if (newValues.includes(value)) {
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);
      } else {
        newValues.push(value);
      }
      this.value = newValues;
      const event = new CustomEvent('on-card-group-change', {
        detail: { value: this.value },
      });
      this.dispatchEvent(event);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    // capture child card selection event
    this.addEventListener('on-card-change', (e: any) =>
      this._handleCardChange(e)
    );
  }

  override disconnectedCallback(): void {
    this.removeEventListener('on-card-change', (e: any) =>
      this._handleCardChange(e)
    );
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-card-single-select': CardSingleSelect;
  }
}
