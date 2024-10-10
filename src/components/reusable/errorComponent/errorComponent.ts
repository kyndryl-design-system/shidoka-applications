import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ErrorComponentScss from './errorComponent.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';

/**
 * Error component.
 * @slot image - Slot for error image.
 * @slot description - Slot for error description.
 */

@customElement('kyn-error-component')
export class ErrorComponent extends LitElement {
  static override styles = [ErrorComponentScss];

  /** Title text */
  @property({ type: String })
  titleText = '';

  /** Primary button text */
  @property({ type: String })
  primaryButtonText = 'Primary Action';

  /** Secondary button text */
  @property({ type: String })
  secondaryButtonText = 'Secondary Action';

  override render() {
    return html`
      <div class="error-component-container">
        <div class="error-image">
          <slot name="image"></slot>
        </div>
        <div class="error-title">
          <h1>${this.titleText}</h1>
        </div>
        <div class="error-description">
          <slot name="description"></slot>
        </div>
        <div class="error-action-buttons">
          <slot name="actions"></slot>
        </div>
        <div class="action-buttons">
          <kd-button
            size="medium"
            kind="primary-app"
            description="Primary action"
          >
            ${this.primaryButtonText}
          </kd-button>
          <kd-button
            size="medium"
            kind="secondary"
            description="Secondary action"
          >
            ${this.secondaryButtonText}
          </kd-button>
        </div>
      </div>
    `;
  }
}
