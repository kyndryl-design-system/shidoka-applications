import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import vitalCardScss from './vitalCard.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
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
          <h1 class="vital-card-title">9,999.99k</h1>
          <h3 class="vital-card-category-text">Category</h3>
          <h3 class="vital-card-subcategory-text">Subcategory</h3>
          <div class="vital-card-cta">
            <button
              class="vital-card-btn"
              @click=${(e: Event) => e.preventDefault()}
            >
              CTA Title
              <kd-icon class="vital-card-btn-icon" slot="icon" .icon=${chevronRightIcon}></kd-icon>
            </kd-button>
          </div>
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
