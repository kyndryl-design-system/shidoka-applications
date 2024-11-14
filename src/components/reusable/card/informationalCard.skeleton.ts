import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';

import CardSampleScss from '../../../stories/sampleCardComponents/cardSample.scss';

/**  Sample Lit component to show inoformational card skeleton pattern. */
@customElement('kyn-info-card-skeleton')
export class InformationalCardSkeleton extends LitElement {
  static override styles = CardSampleScss;

  /**  Sets the number of body/description lines to show in the skeleton pattern example. */
  @property({ type: Number })
  lines? = 0;

  /**  Show or hide thumbnail in example. */
  @property({ type: Boolean })
  thumbnailVisible?: boolean = false;

  override render() {
    return html`
      <div>
        <div class="card-logo">
          <kyn-skeleton shape="circle" size="small"></kyn-skeleton>
        </div>
        ${this.thumbnailVisible
          ? html`
              <kyn-skeleton
                shape="rectangle"
                width="95%"
                height="128px"
                class="card-thumbnail-img"
                alt="Card thumbnail"
              ></kyn-skeleton>
            `
          : ''}
        <div class="card-title">
          <kyn-skeleton width="80px" height="16px"></kyn-skeleton>
        </div>
        <div class="card-subtitle">
          <kyn-skeleton shape="rectangle" width="120px"></kyn-skeleton>
        </div>
        ${Array(this.lines)
          .fill(null)
          .map(
            () => html`
              <div class="card-description">
                <kyn-skeleton width="95%" height="16px"></kyn-skeleton>
              </div>
            `
          )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-info-card-skeleton': InformationalCardSkeleton;
  }
}
