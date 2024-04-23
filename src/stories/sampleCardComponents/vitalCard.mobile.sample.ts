import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import vitalCardScss from './vitalCard.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import chevronRightIcon from '@carbon/icons/es/chevron--right/20';

/**  Sample Lit component to show vital card mobile pattern. */
@customElement('vital-card-mobile-sample-component')
export class VitalCardMobileSampleComponent extends LitElement {
  static override styles = vitalCardScss;
  override render() {
    return html`
      <div>
        <div class="vital-card-title-label-mobile">Title</div>
        <div class="vital-card-mobile-wrapper">
          <div class="vital-card-mobile-wrapper-subdiv">
            <div class="vital-card-title-div">
              <h1 class="vital-card-mobile-title">9,999.99k</h1>
            </div>
            <div class="vital-card-cat-subcat-text">
              <h2 class="vital-card-category-text">Category</h2>
              <h2 class="vital-card-subcategory-text">Subcategory</h2>
            </div>
          </div>
          <kd-button
            iconposition="center"
            kind="tertiary"
            size="small"
            description="cta button"
            @click=${(e: Event) => e.preventDefault()}
          >
            <kd-icon slot="icon" .icon=${chevronRightIcon}></kd-icon>
          </kd-button>
        </div>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'vital-card-mobile-sample-component': VitalCardMobileSampleComponent;
  }
}
