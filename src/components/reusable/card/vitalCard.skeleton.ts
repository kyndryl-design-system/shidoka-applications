import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';

import vitalCardScss from './vitalCard.scss';
import CardSampleScss from '../../../stories/sampleCardComponents/cardSample.scss';

/**
 * `kyn-vital-card-skeleton` Web Component.
 * A skeleton loading state for the vital card component that mirrors its structure.
 */
@customElement('kyn-vital-card-skeleton')
export class VitalCardSkeleton extends LitElement {
  static override styles = [
    vitalCardScss,
    CardSampleScss,
    css`
      .vital-card-title-label {
        margin: 0 0 4px;
      }
      .vital-card-title-div {
        margin: 16px 0;
      }
      .vital-card-cat-subcat-text {
        margin: 0 0 18px;
      }

      .vital-card-content-wrapper kyn-skeleton {
        width: 100%;
      }
    `,
  ];

  /**  Sets the number of body/description lines to show in the skeleton pattern example. */
  @property({ type: Number })
  lines? = 0;

  override render() {
    return html`
      <div class="vital-card-wrapper">
        <div class="vital-card-title-label">
          <kyn-skeleton width="80px" height="16px"></kyn-skeleton>
        </div>
        <div class="vital-card-content-wrapper">
          <div class="vital-card-mobile-wrapper-subdiv">
            <div class="vital-card-title-div">
              <kyn-skeleton width="150px" height="16px"></kyn-skeleton>
            </div>
            <div class="vital-card-cat-subcat-text">
              <kyn-skeleton width="100px" height="16px"></kyn-skeleton>
            </div>
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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-vital-card-skeleton': VitalCardSkeleton;
  }
}
