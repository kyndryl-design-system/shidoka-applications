import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ErrorScss from './errorBlock.scss?inline';

import '../button';

/**
 * Error block.
 * @slot unnamed - Slot for the error description.
 * @slot image - Slot for the error image.
 * @slot actions - Slot for the action buttons.
 */

@customElement('kyn-error-block')
export class ErrorBlock extends LitElement {
  static override styles = unsafeCSS(ErrorScss);

  /** Title text */
  @property({ type: String })
  accessor titleText = '';

  override render() {
    return html`
      <div class="error-container">
        <div class="error-image">
          <slot name="image"></slot>
        </div>
        <div class="error-title">
          <p>${this.titleText}</p>
        </div>
        <div class="error-description">
          <slot></slot>
        </div>
        <div class="error-action-buttons">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}
