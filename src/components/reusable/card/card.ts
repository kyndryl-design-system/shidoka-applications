import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import CardScss from './card.scss?inline';

/**
 * Card.
 * @fires on-card-click - Captures the click event of clickable card and emits the original event details. Use `e.stopPropogation()` / `e.preventDefault()` for any internal clickable elements when card type is `'clickable'` to stop bubbling / prevent event. `detail:{ origEvent: PointerEvent }`
 * @slot unnamed - Slot for card contents.
 * @part card-wrapper - The wrapper element of the card. Use this part to customize its styles such as padding . Ex: kyn-card::part(card-wrapper)

 */

@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = unsafeCSS(CardScss);

  /** Card Type. `'normal'` & `'clickable'` */
  @property({ type: String })
  accessor type = 'normal';

  /** Card link url for clickable cards. */
  @property({ type: String })
  accessor href = '';

  /** Use for Card type `'clickable'`. Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship. */
  @property({ type: String })
  accessor rel = '';

  /** Defines a target attribute for where to load the URL in case of clickable card. Possible options include `'_self'` (deafult), `'_blank'`, `'_parent`', `'_top'` */
  @property({ type: String })
  accessor target: any = '_self';

  /** Hide card border. Useful when clickable card use inside `<kyn-notification>` component. */
  @property({ type: Boolean })
  accessor hideBorder = false;

  /** Set this to `true` for AI theme. */
  @property({ type: Boolean })
  accessor aiConnected = false;
  /** Set this to `true` for highlight */
  @property({ type: Boolean })
  accessor highlight = false;

  override render() {
    const cardWrapperClasses = {
      'card-wrapper-clickable': true,
      'card-border': this.hideBorder === false,
      'ai-Connected': this.aiConnected,
      'card-highlight': this.highlight,
      'ai-highlight': this.aiConnected && this.highlight,
    };

    const cardWrapperDefaultClasses = {
      'card-wrapper': true,
      'ai-Connected': this.aiConnected,
      'card-highlight': this.highlight,
      'ai-highlight': this.aiConnected && this.highlight,
    };

    return html`${this.type === 'clickable'
      ? html`<a
          part="card-wrapper"
          class="${classMap(cardWrapperClasses)}"
          href=${this.href}
          target=${this.target}
          rel=${this.rel}
          @click=${(e: Event) => this.handleClick(e)}
        >
          <slot></slot>
        </a>`
      : html`<div
          part="card-wrapper"
          class="${classMap(cardWrapperDefaultClasses)}"
        >
          <slot></slot>
        </div>`} `;
  }

  private handleClick(e: Event) {
    const custom = new CustomEvent('on-card-click', {
      detail: { origEvent: e },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const dispatchResult = this.dispatchEvent(custom);
    if (!dispatchResult || custom.defaultPrevented) {
      e.preventDefault();
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
