import { LitElement, html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PromptScss from './prompt.scss';

import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark.svg';

/**
 * Prompt.
 * @slot label - Slot for the prompt label content.
 * @fires on-prompt-click - Captures the click event of clickable prompt and emits the original event details.
 * @fires on-selection-change - Fires when the prompt's selected state changes, emitting the new selected state.
 */

@customElement('kyn-prompt')
export class Prompt extends LitElement {
  static override styles = PromptScss;

  /** Prompt is clickable. */
  @property({ type: Boolean })
  isClickable = false;

  /** Hide prompt border. Useful when clickable prompt use inside another component. */
  @property({ type: Boolean })
  hideBorder = false;

  /** Disable individual prompt. */
  @property({ type: Boolean })
  disabled = false;

  /** Sets whether prompt is selected/checked, either from user input or by default. */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /** Sets the size of the prompt. Options: 'sm', 'md', 'lg' */
  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  /** Value associated with this prompt, used for selection tracking in prompt groups */
  @property({ type: String })
  value = '';

  override render() {
    const promptWrapperClasses = {
      'kyn-prompt': true,
      'kyn-prompt--clickable': this.isClickable,
      'kyn-prompt--default': !this.isClickable,
      'prompt-border': this.hideBorder === false,
      'prompt-selected': this.selected,
      [`size--${this.size}`]: true,
      disabled: this.disabled,
    };

    return html`
      ${this.isClickable
        ? html`<button
            part="prompt-wrapper"
            class="${classMap(promptWrapperClasses)}"
            @click=${(e: Event) => this.handleClick(e)}
          >
            <slot name="label"></slot>
            ${this.selected
              ? html`<span class="checkmark-icon"
                  >${unsafeSVG(checkmarkIcon)}</span
                >`
              : ''}
          </button>`
        : html`<div
            part="prompt-wrapper"
            class="${classMap(promptWrapperClasses)}"
          >
            <slot name="label"></slot>
            ${this.selected
              ? html`<span class="checkmark-icon"
                  >${unsafeSVG(checkmarkIcon)}</span
                >`
              : ''}
          </div>`}
    `;
  }

  private handleClick(e: Event) {
    e.preventDefault();

    if (this.isClickable && !this.disabled) {
      this.selected = !this.selected;

      this.dispatchEvent(
        new CustomEvent('on-selection-change', {
          detail: { selected: this.selected },
        })
      );
    }

    const event = new CustomEvent('on-prompt-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-prompt': Prompt;
  }
}
