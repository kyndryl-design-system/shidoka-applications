import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import vitalCardScss from './vitalCard.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/link';

import chevronRightIcon from '@carbon/icons/es/chevron--right/20';

/**  Sample Lit component to show vital card pattern. */
@customElement('vital-card-sample-component')
export class VitalCardSampleComponent extends LitElement {
  static override styles = vitalCardScss;
  override render() {
    return html`
      <div>
        <div class="vital-card-title-label">Title</div>
        <div class="vital-card-content-wrapper">
          <div class="vital-card-mobile-wrapper-subdiv">
            <div class="vital-card-title-div">
              <h1 class="vital-card-title">9,999.99k</h1>
            </div>
            <div class="vital-card-cat-subcat-text">
              <h2 class="vital-card-category-text">Category</h2>
              <h2 class="vital-card-subcategory-text">Subcategory</h2>
            </div>
          </div>

          <kd-link
            class="vital-card-link"
            standalone
            href="#"
            @on-click=${(e: Event) => e.preventDefault()}
          >
            <span class="vital-card-link-text">CTA Title</span>
            <kd-icon
              slot="icon"
              sizeoverride="16"
              .icon=${chevronRightIcon}
            ></kd-icon>
          </kd-link>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vital-card-sample-component': VitalCardSampleComponent;
  }
}
