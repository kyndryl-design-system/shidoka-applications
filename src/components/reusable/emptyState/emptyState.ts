import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import EmptyStateScss from './emptyState.scss?inline';

import '../button';

/**
 * Empty state.
 * @slot unnamed - Slot for the error description.
 * @slot image - Slot for the error image.
 * @slot actions - Slot for the action buttons.
 */

@customElement('kyn-empty-state')
export class EmptyState extends LitElement {
  static override styles = unsafeCSS(EmptyStateScss);

  /** Title text */
  @property({ type: String })
  accessor titleText = '';

  /** Empty state orientation. */
  @property({ type: String })
  accessor orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Empty state size. */
  @property({ type: String })
  accessor size: 'small' | 'medium' | 'large' = 'medium';

  override render() {
    const classes: any = classMap({
      'empty-state-wrapper': true,
      'empty-state-horizontal': this.orientation === 'horizontal',
      'empty-state-vertical': this.orientation === 'vertical',
      'empty-state-small': this.size === 'small',
      'empty-state-medium': this.size === 'medium',
      'empty-state-large': this.size === 'large',
    });

    return html`
      <div class="${classes}">
        <div class="empty-state-image">
          <slot name="image"></slot>
        </div>
        <div class="empty-state-title">
          <p>${this.titleText}</p>
        </div>
        <div class="empty-state-description">
          <slot></slot>
        </div>
        <div class="empty-state-cta">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}
