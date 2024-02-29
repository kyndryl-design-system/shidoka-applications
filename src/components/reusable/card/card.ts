import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import rightIcon24 from '@carbon/icons/es/arrow--right/24';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import CardScss from './card.scss';
import '../overflowMenu';
// import '../tag';

/**
 * Card.
 * @fires on-card-change - Captures the change event and emits the selected values.
 * @slot tags - Slot for the tags.
 * @slot unnamed - Slot for Card body content.
 */

@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = CardScss;

  /** Card Title. */
  @property({ type: String })
  cardTitle = '';

  /** Card Subtitle. */
  @property({ type: String })
  subTitle = '';

  /** Card Description. */
  @property({ type: String })
  description = '';

  /** Checkbox group selected values. */
  @property({ type: Array })
  value: Array<any> = [];

  /** Card's thumbnail image position. `'top'` & `middle`. */
  @property({ type: String })
  imagePosition = 'top';

  /** Whether show tags inside card */
  @property({ type: Boolean })
  showTags = false;

  /** Whether to show logo */
  @property({ type: Boolean })
  showLogo = false;

  /** Thumbnail image with size of 216 * 128px.*/
  @property({ type: String })
  thumbnailSrc = '';

  /** logo image size of 56 * 56 px.*/
  @property({ type: String })
  productLogo = '';

  /** Navigation link on arrow icon */
  @property({ type: String })
  iconLink = '#';

  /** Card options. `overflowMenu`, `multiSelect` & `singleSelect`  */
  @property({ type: String })
  options = 'overflowMenu';

  /** Setting tag group properties if showTags is true */
  @property({ type: Object })
  tagGroupObject = {
    filter: false,
    limitTags: false,
    tagSize: 'md',
    textStrings: {
      showAll: 'Show all',
      showLess: 'Show less',
    },
  };

  override render() {
    return html`
      <div class="card-wrapper">
        <!-- Options UI -->
        <!-- <div class="card-option-wrapper">
          <div>
            <kyn-overflow-menu verticalDots>
              <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
              <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
            </kyn-overflow-menu>
          </div>
        </div> -->

        <!-- thumbnail UI Top -->
        ${this.imagePosition === 'top' ? this.renderThumbnailUI() : null}

        <!-- logo ,title and subtitle UI -->
        <div class="card-title-logo-wrapper">
          ${this.showLogo
            ? html`<div class="product-logo">
                <img src="${this.productLogo}" alt="product logo" />
              </div>`
            : null}

          <div class="card-title" title="${this.cardTitle}">
            ${this.cardTitle}
          </div>
          <div class="card-subtitle">${this.subTitle}</div>
        </div>
        <!-- thumbnail UI Center -->
        ${this.imagePosition === 'middle' ? this.renderThumbnailUI() : null}
        <!--  Description -->
        <div class="card-description">${this.description}</div>

        <!-- Tag Group UI if showTags is true -->
        ${this.showTags
          ? html`
              <div class="tags">
                <slot name="tags"></slot>
              </div>
            `
          : null}

        <slot></slot>

        <!-- right arrow -->
        <div class="card-icon-wrapper">
          <a class="card-icon-arrow" href="${this.iconLink}" target="_blank">
            <kd-icon .icon=${rightIcon24}></kd-icon>
          </a>
        </div>
      </div>
    `;
  }

  private renderThumbnailUI() {
    return html`
      <div class="card-thumbnail-wrapper">
        <img
          class="card-thumbnail-image"
          alt="Card thumbnail"
          src="${this.thumbnailSrc}"
        />
      </div>
    `;
  }

  override updated(changedProps: any) {}
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
