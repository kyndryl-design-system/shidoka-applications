import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import AIPromptsContainerScss from './aiPromptsContainer.scss';

/**
 * AIPromptsContainer - Layout container for AI prompts.
 * @slot unnamed - default slot for prompt elements
 */
@customElement('kyn-ai-prompts-container')
export class AIPromptsContainer extends LitElement {
  static override styles = AIPromptsContainerScss;

  /** Sets orientation of prompts layout. */
  @property({ type: String })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** Sets maximum width of the container. Use any valid CSS width value. */
  @property({ type: String })
  maxWidth?: string;

  override render() {
    const containerClasses = {
      'prompt-container': true,
      [`prompt-container--${this.orientation}`]: this.orientation,
    };

    return html`
      <div
        class="${classMap(containerClasses)}"
        style="${this.maxWidth ? `max-width: ${this.maxWidth};` : ''}"
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-prompts-container': AIPromptsContainer;
  }
}
