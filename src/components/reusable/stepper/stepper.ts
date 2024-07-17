import { LitElement, html, css } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import stepperStyles from './stepper.scss';

/**
 * Stepper
 * @slot unnamed - Slot for step items.
 */

@customElement('kyn-stepper')
export class Stepper extends LitElement {
  static override styles = stepperStyles;

  /** Wheter the stepper is in vertical type. */
  @property({ type: Boolean })
  vertical = false;

  /** Stepper size `'large'` & `'small'`. Bydefault `'large'`. Use small size only for status stepper.  */
  @property({ type: String })
  size = 'large';

  /**
   * Queries any slotted step items.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-stepper-item' })
  steps!: Array<any>;

  override render() {
    return html`
      <div
        class="${this.vertical
          ? 'vertical-stepper-wrapper'
          : 'horizontal-stepper-wrapper'}"
      >
        <slot></slot>
      </div>
    `;
  }

  // when firstmost load component
  override firstUpdated(): void {}

  override updated(changedProps: any) {}
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper': Stepper;
  }
}
