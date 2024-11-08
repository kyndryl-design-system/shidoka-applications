import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import vitalCardScss from './vitalCard.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/link';
import '../../components/reusable/loaders/skeleton';

/**  Sample Lit component to show vital card skeleton pattern. */
@customElement('vital-card-skeleton-sample-component')
export class VitalCardSkeletonSampleComponent extends LitElement {
  static override styles = vitalCardScss;

  override render() {
    return html`
      <div>
        <div class="vital-card-title-label">
          <kyn-skeleton inline></kyn-skeleton>
        </div>
        <div class="vital-card-content-wrapper">
          <div class="vital-card-mobile-wrapper-subdiv">
            <div class="vital-card-title-div">
              <kyn-skeleton inline></kyn-skeleton>
            </div>
            <div class="vital-card-cat-subcat-text">
              <kyn-skeleton inline></kyn-skeleton>
            </div>
          </div>
          <kyn-skeleton inline></kyn-skeleton>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vital-card-skeleton-sample-component': VitalCardSkeletonSampleComponent;
  }
}
