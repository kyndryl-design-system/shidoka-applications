import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '../../reusable/card';

import PromptScss from './aiPrompt.scss';

/**
 * AI Prompt.
 * @fires on-ai-prompt-click - Captures the click event of clickable prompt and emits the original event details. Use `e.stopPropogation()` / `e.preventDefault()` for any internal clickable elements when prompt type is `'clickable'` to stop bubbling / prevent event.
 * @slot title - Slot for prompt title text.
 * @slot description - slot for prompt body text.
 */

@customElement('kyn-ai-prompt')
export class AIPrompt extends LitElement {
  static override styles = [PromptScss];

  /** Card link url for clickable cards. */
  @property({ type: String })
  href = '';

  /** Use for Card type `'clickable'`. Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship. */
  @property({ type: String })
  rel = '';

  /** Defines a target attribute for where to load the URL in case of clickable card. Possible options include `'_self'` (deafult), `'_blank'`, `'_parent`', `'_top'` */
  @property({ type: String })
  target: any = '_self';

  /** Set this to `true` for highlight */
  @property({ type: Boolean })
  highlight = false;

  override render() {
    return html`
      <kyn-card
        type=${'clickable'}
        href=${ifDefined(this.href || undefined)}
        target=${ifDefined(this.target || undefined)}
        rel=${ifDefined(this.rel || undefined)}
        ?highlight=${this.highlight}
        ?aiConnected=${true}
        @on-card-click=${(e: Event) => this.handleClick(e)}
      >
        <slot name="title"></slot>
        <slot name="description"></slot>
      </kyn-card>
    `;
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-ai-prompt-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-prompt': AIPrompt;
  }
}
