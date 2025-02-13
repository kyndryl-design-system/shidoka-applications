import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PromptGroupScss from './promptGroup.scss';

/**
 * PromptGroup.
 * @fires on-selection-change - Fires when any prompt's selection changes, emitting array of selected values
 * @slot default - Slot for prompt elements
 */
@customElement('kyn-prompt-group')
export class PromptGroup extends LitElement {
  static override styles = PromptGroupScss;

  /** Optionally allow multiple prompts to be selected */
  @property({ type: Boolean })
  multipleSelect = false;

  /** Array of selected values. */
  @property({ type: Array })
  selectedValues: string[] = [];

  /** Sets orientation of prompt group. */
  @property({ type: String })
  promptOrientation: 'horizontal' | 'vertical' = 'horizontal';

  override render() {
    const groupClasses = {
      'prompt-group': true,
      'prompt-group--horizontal': this.promptOrientation === 'horizontal',
      'prompt-group--vertical': this.promptOrientation === 'vertical',
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
      .filter((el) => el.tagName.toLowerCase() === 'kyn-prompt');

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
        .filter((el) => el.tagName.toLowerCase() === 'kyn-prompt');

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
    'kyn-prompt-group': PromptGroup;
  }
}
