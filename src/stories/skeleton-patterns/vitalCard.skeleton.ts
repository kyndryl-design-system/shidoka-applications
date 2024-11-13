import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../../components/reusable/loaders/skeleton';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/link';

import vitalCardScss from '../sampleCardComponents/vitalCard.scss';

/**  Sample Lit component to show vital card skeleton pattern. */
@customElement('kyn-vital-card-skeleton')
export class VitalCardSkeleton extends LitElement {
  static override styles = [
    vitalCardScss,
    css`
      .vital-card-title-label {
        margin-bottom: 16px;
      }
      .vital-card-title-div {
        margin-bottom: 8px;
      }
      .vital-card-cat-subcat-text {
        margin-bottom: 16px;
      }

      .vital-card-content-wrapper kyn-skeleton {
        width: 100%;
      }
    `,
  ];

  override render() {
    return html`
      <div>
        <div class="vital-card-title-label">
          <kyn-skeleton elementType="title" inline></kyn-skeleton>
        </div>
        <div class="vital-card-content-wrapper">
          <div class="vital-card-mobile-wrapper-subdiv">
            <div class="vital-card-title-div">
              <kyn-skeleton elementType="title" inline></kyn-skeleton>
            </div>
            <div class="vital-card-cat-subcat-text">
              <kyn-skeleton elementType="subtitle" inline></kyn-skeleton>
            </div>
          </div>
          <div class="card-body">
            <kyn-skeleton elementType="body-text" inline></kyn-skeleton>
          </div>
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
