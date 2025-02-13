import { LitElement, html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import PromptScss from './prompt.scss';

import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark.svg';

/**
 * Prompt.
 * @slot label - Slot for the prompt label content.
 * @fires on-prompt-click - Captures the click event of clickable prompt and emits the original event details. Use `e.stopPropogation()` / `e.preventDefault()` for any internal clickable elements when prompt type is `'clickable'` to stop bubbling / prevent event.
 * @fires on-selection-change - Fires when the prompt's selected state changes, emitting the new selected state.
 */

@customElement('kyn-prompt')
export class Prompt extends LitElement {
  static override styles = PromptScss;

  /** Prompt Type. `'normal'` & `'clickable'` */
  @property({ type: String })
  type = 'normal';

  /** Hide prompt border. Useful when clickable prompt use inside `<kyn-notification>` component. */
  @property({ type: Boolean })
  hideBorder = false;

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
      'prompt-wrapper-clickable': this.type === 'clickable',
      'prompt-wrapper': this.type !== 'clickable',
      'prompt-border': this.hideBorder === false,
    };

    return html`
      ${this.type === 'clickable'
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

    if (this.type === 'clickable') {
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
