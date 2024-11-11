import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../../components/reusable/loaders/skeleton';
import '../../components/reusable/card';

import CardSampleScss from '../sampleCardComponents/cardSample.scss';

/**  Sample Lit component to show inoformational card skeleton pattern. */
@customElement('info-card-simple-skeleton-sample')
export class InformationalCardSkeletonComponent extends LitElement {
  static override styles = CardSampleScss;

  /**  Sets the number of body/description lines to show in the skeleton pattern example. */
  @property({ type: Number })
  lines = 0;

  override render() {
    return html`
      <div>
        <div class="card-logo">
          <kyn-skeleton elementType="card-logo"></kyn-skeleton>
        </div>
        <div class="card-title">
          <kyn-skeleton elementType="title"></kyn-skeleton>
        </div>
        <div class="card-subtitle">
          <kyn-skeleton elementType="subtitle"></kyn-skeleton>
        </div>
          ${Array(this.lines)
            .fill(null)
            .map(
              () => html`
                <div class="card-description">
                  <kyn-skeleton elementType="body-text"></kyn-skeleton>
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
    'info-card-simple-skeleton-sample': InformationalCardSkeletonComponent;
  }
}
