import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import AIPromptGroupScss from './AIPromptGroup.scss';

/**
 * AIPromptGroup.
 * @slot unnamed - default slot for prompt elements
 * @fires on-selection-change - Fires when any prompt's selection changes, emitting array of selected values
 */
@customElement('kyn-ai-prompt-group')
export class AIPromptGroup extends LitElement {
  static override styles = AIPromptGroupScss;

  /** Sets orientation of prompt group. */
  @property({ type: String })
  promptOrientation: 'horizontal' | 'vertical' = 'horizontal';

  override render() {
    const groupClasses = {
      'prompt-group': true,
      [`prompt-group--${this.promptOrientation}`]: this.promptOrientation,
    };

    return html`
      <div class="${classMap(groupClasses)}">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  private _handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const prompts = slot
      .assignedElements()
      .filter((el) => el.tagName.toLowerCase() === 'kyn-ai-prompt');

    prompts.forEach((prompt: any) => {
      prompt.addEventListener('on-selection-change', (e: CustomEvent) => {
        this._handlePromptSelection(prompt, e.detail.selected);
      });
    });
  }

  private _handlePromptSelection(selectedPrompt: any, isSelected: boolean) {
    if (!this.multipleSelect) {
      const slot = this.shadowRoot?.querySelector('slot');
      const prompts = slot
        ?.assignedElements()
        .filter((el) => el.tagName.toLowerCase() === 'kyn-ai-prompt');

      prompts?.forEach((prompt: any) => {
        if (prompt !== selectedPrompt && prompt.selected) {
          prompt.selected = false;
        }
      });
    }

    const value = selectedPrompt.getAttribute('value') || '';
    if (isSelected) {
      this.selectedValues = this.multipleSelect
        ? [...this.selectedValues, value]
        : [value];
    } else {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
    }

    this.dispatchEvent(
      new CustomEvent('on-selection-change', {
        detail: { selectedValues: this.selectedValues },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-prompt-group': AIPromptGroup;
  }
}
