import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../../reusable/card';

import PromptScss from './aiPrompt.scss';

/**
 * AI Prompt component.
 * @fires on-click - Captures the click event of clickable prompt and emits the action type. Event bubbles and crosses shadow DOM boundaries.
 * @slot title - Slot for prompt title text.
 * @slot description - slot for prompt body text.
 */

@customElement('kyn-ai-prompt')
export class AIPrompt extends LitElement {
  static override styles = [PromptScss];

  /** Set highlighted state with unique styles. */
  @property({ type: Boolean })
  highlight = false;

  /** Sets border to hidden when true. */
  @property({ type: Boolean })
  hideBorder = false;

  /** Sets maximum width of the prompt. Use any valid CSS width value. */
  @property({ type: String })
  maxWidth?: string;

  /** Sets width of the prompt. Use any valid CSS width value. */
  @property({ type: String })
  width?: string;

  override render() {
    return html`
      <kyn-card
        type=${'clickable'}
        ?highlight=${this.highlight}
        ?aiConnected=${true}
        @on-card-click=${(e: Event) => this._handleClick(e)}
      >
        <slot name="title"></slot>
        <slot name="description"></slot>
      </kyn-card>
    `;
  }

  override willUpdate() {
    if (!this.width && !this.maxWidth) {
      this.style.width = '100%';
      this.style.maxWidth = 'none';
    } else {
      if (this.width) {
        this.style.width = this.width;
      }
      if (this.maxWidth) {
        this.style.maxWidth = this.maxWidth;
      }
    }
  }

  private _handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { action: e.type },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-prompt': AIPrompt;
  }
}
