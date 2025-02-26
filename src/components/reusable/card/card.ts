import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import CardScss from './card.scss';

/**
 * Card.
 * @fires on-card-click - Captures the click event of clickable card and emits the original event details. Use `e.stopPropogation()` / `e.preventDefault()` for any internal clickable elements when card type is `'clickable'` to stop bubbling / prevent event.
 * @slot unnamed - Slot for card contents.
 */

@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = CardScss;

  /** Card Type. `'normal'` & `'clickable'` */
  @property({ type: String })
  type = 'normal';

  /** Card link url for clickable cards. */
  @property({ type: String })
  href = '';

  /** Use for Card type `'clickable'`. Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship. */
  @property({ type: String })
  rel = '';

  /** Defines a target attribute for where to load the URL in case of clickable card. Possible options include `'_self'` (deafult), `'_blank'`, `'_parent`', `'_top'` */
  @property({ type: String })
  target: any = '_self';

  /** Hide card border. Useful when clickable card use inside `<kyn-notification>` component. */
  @property({ type: Boolean })
  hideBorder = false;

  override render() {
    const cardWrapperClasses = {
      'card-wrapper-clickable': true,
      'card-border': this.hideBorder === false,
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
      : html`<div part="card-wrapper" class="card-wrapper">
          <slot></slot>
        </div>`} `;
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-card-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
