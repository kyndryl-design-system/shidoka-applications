import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';

import PageTitleOptionScss from './pageTitleOption.scss?inline';

/**
 * Page title contextual dropdown option.
 * @slot unnamed - Slot for option text.
 */

@customElement('kyn-pagetitle-option')
export class PageTitleOption extends LitElement {
  static override styles = unsafeCSS(PageTitleOptionScss);

  /** Option value. */
  @property({ type: String })
  accessor value = '';

  /** Option selected state. */
  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @state()
  accessor text = '';

  override render() {
    return html`
      <div
        role="option"
        aria-selected="${this.selected}"
        tabindex="0"
        @click="${this._handleClick}"
        @keydown="${this._handleKeydown}"
      >
        <span class="option-text">
          <slot @slotchange="${this._handleSlotChange}"></slot>
        </span>
        ${this.selected
          ? html`<span class="check-icon">${unsafeSVG(checkIcon)}</span>`
          : null}
      </div>
    `;
  }

  private _handleSlotChange(e: Event) {
    const target = e.target as HTMLSlotElement;
    const nodes = target.assignedNodes({ flatten: true });
    let text = '';

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent?.trim() ?? '';
    }

    this.text = text;
  }

  private _handleClick() {
    const event = new CustomEvent('on-option-click', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        text: this.text,
      },
    });
    this.dispatchEvent(event);
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    } else if (e.key === 'Escape') {
      // Bubble naturally — parent handles close
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-pagetitle-option': PageTitleOption;
  }
}
