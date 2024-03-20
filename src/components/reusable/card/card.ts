import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import CardScss from './card.scss';

/**
 * Card.
 * @slot card-logo - Slot for card logo (Required). Size 32 * 32 as per UX guidelines.
 * @slot card-action-button - Slot for Card action button.
 * @slot card-overflow-menu - Slot for overflow menu.
 * @slot card-thumbnail - Slot for card thumbnail image.
 * @slot tags - Slot for the tag component.
 * @slot card-links - Slot for card links.
 * @slot unnamed - Slot for card body content.
 */

@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = CardScss;
  /** Card width. Default 264px. */
  @property({ type: Number })
  cardWidth = 264;

  @property({ type: String })
  cardLink = '/';

  /** Card Type. `'normal'` & `'clickable'` */
  @property({ type: String })
  type = 'normal';

  @property({ type: String })
  cardTitle = '';

  /** Card Subtitle. */
  @property({ type: String })
  subTitle = '';

  /** Card Description. */
  @property({ type: String })
  description = '';

  /** Card's thumbnail image position. `top` & `middle`. */
  @property({ type: String })
  imagePosition = 'top';

  /** Show action button */
  @property({ type: Boolean })
  showActionBtn = false;

  /** Show Option Menu. use only with non-clickable cards */
  showOptionMenu = false;

  /** Card collapse state.
   * @ignore
   */
  @state()
  isCollapse = false;

  override render() {
    return html`${this.type === 'clickable'
      ? html`<a
          href=${this.cardLink}
          target="_blank"
          class="card-wrapper-clickable"
          style="width: ${this.cardWidth}px;"
          >${this.renderInnerCardUI()}</a
        >`
      : html`<div class="card-wrapper" style="width: ${this.cardWidth}px;">
          ${this.renderInnerCardUI()}
        </div>`}`;
  }

  // Load Card UI inside wrapper
  private renderInnerCardUI() {
    const classDescriptionMap = {
      'card-description': true,
      'card-description-align': this.imagePosition === 'middle',
    };

    return html`<div class="card-logo-container">
        <!-- Card logo slot -->
        <div class="card-logo">
          <slot name="card-logo"></slot>
        </div>
        <div class="card-logo-right">
          ${this.isCollapse
            ? html` <h1 class="card-title card-title-collapse">
                ${this.cardTitle}
              </h1>`
            : html`<div class="card-actions">
                <!-- Action button slot-->
                <div class="card-action-btn-class">
                  <slot name="card-action-button"></slot>
                </div>

                <!-- Overflow Menu slot -->
                <div class="card-option-wrapper">
                  <slot name="card-overflow-menu"></slot>
                </div>
              </div>`}
        </div>
      </div>
      <!-- Thumbnail position top -->
      ${this.imagePosition === 'top' ? this.renderThumbnailUI() : null}

      <h1 class="card-title">${this.cardTitle}</h1>
      <div class="card-subtitle">${this.subTitle}</div>
      <!-- Thumbnail position middle -->
      ${this.imagePosition === 'middle' ? this.renderThumbnailUI() : null}

      <!-- Card Description -->
      <div class="${classMap(classDescriptionMap)}">${this.description}</div>

      <!-- Card Tag slot -->
      <div class="tags">
        <slot name="tags"></slot>
      </div>

      <!-- Card body slot -->
      <slot class="body-slot"></slot>

      <!-- Card links slot -->
      <div class="card-link">
        <div class="card-link-elements">
          <slot name="card-links"></slot>
        </div>
      </div> `;
  }

  // Render thumbnail UI slot
  private renderThumbnailUI() {
    return html`
      <div class="card-thumbnail-wrapper">
        <slot name="card-thumbnail"> </slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
