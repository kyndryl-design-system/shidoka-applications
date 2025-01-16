import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import vitalCardScss from './vitalCard.scss';
import '../../components/reusable/link';

import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import '../../components/reusable/loaders/skeleton';

/**  Sample Lit component to show vital card pattern. */
@customElement('vital-card-sample-component')
export class VitalCardSampleComponent extends LitElement {
  static override styles = vitalCardScss;

  /** loading state control */
  @property({ type: Boolean })
  skeleton = false;

  override render() {
    return html`
      <div>
        <div class="vital-card-title-label">
          ${this.skeleton
            ? html`<kyn-skeleton lines="1" inline></kyn-skeleton>`
            : 'Title'}
        </div>
        <div class="vital-card-content-wrapper">
          <div class="vital-card-mobile-wrapper-subdiv">
            <div class="vital-card-title-div">
              ${this.skeleton
                ? html`<kyn-skeleton inline></kyn-skeleton>`
                : html`<h1 class="vital-card-title">9,999.99k</h1>`}
            </div>
            <div class="vital-card-cat-subcat-text">
              ${this.skeleton
                ? html` <kyn-skeleton inline></kyn-skeleton>`
                : html`
                    <h2 class="vital-card-category-text">Category</h2>
                    <h2 class="vital-card-subcategory-text">Subcategory</h2>
                  `}
            </div>
          </div>
          ${this.skeleton
            ? html`<kyn-skeleton inline></kyn-skeleton>`
            : html`
                <kyn-link
                  class="vital-card-link"
                  standalone
                  href="#"
                  @on-click=${(e: Event) => e.preventDefault()}
                >
                  <span class="vital-card-link-text">CTA Title</span>
                  <span slot="icon">${unsafeSVG(chevronRightIcon)}</span>
                </kyn-link>
              `}
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
