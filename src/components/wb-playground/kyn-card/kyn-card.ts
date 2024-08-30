import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import KynCardStyles from './kyn-card.scss';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Card item -- to be used as a standalone component or included in a carousel.
 * @slot unnamed -- Slot for body text
 */
@customElement('kyn-card-item')
export class KynCard extends LitElement {
  static override styles = KynCardStyles;

  /**
   * Card theme, required.
   */
  @property({ type: String })
  theme = 'simple';

  /**
   * Card title text.
   */
  @property({ type: String })
  cardTitle = '';

  /**
   * Card subheader.
   */
  @property({ type: String })
  cardSubheader = '';

  /**
   * Card body, optional.
   */
  @property({ type: String })
  body = '';

  @property({ type: String })
  cardImgSrc = '';

  /**
   * Card link text-- card link will not show if this property is not set, optional.
   */
  @property({ type: String })
  cardLinkText = '';

  /**
   * Card link href, optional.
   */
  @property({ type: String })
  cardLinkHref = '';

  override render() {
    const classes = {
      'card--simple': this.theme === 'simple',
      'card--vertical': this.theme === 'vertical',
      'card--horizontal': this.theme === 'horizontal',
      'card--page': this.theme === 'page',
    };

    return html`<div id="card" class="${classMap(classes)}">
      ${['horizontal', 'vertical'].includes(this.theme) && this.cardImgSrc
        ? html`<div
            class="card-img-wrapper"
            style="background-image: url(${this.cardImgSrc})"
          ></div>`
        : null}
      <div class="card-body">
        <div id="card-header">
          <h3 id="card-title">${this.cardTitle}</h3>
          <h2 id="card-subheader">${this.cardSubheader}</h2>
        </div>
        <div id="body-text">
          <slot></slot>
        </div>
      </div>
      <div class="card-footer">
        ${this.cardLinkText
          ? html`<kd-link href=${this.cardLinkHref} id="card-link"
              >${this.cardLinkText}</kd-link
            >`
          : null}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-card-item': KynCard;
  }
}
