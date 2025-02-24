import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './index';
import '../loaders/skeleton';

@customElement('sample-filter-skeleton-component')
export class SampleFilterSkeletonComponent extends LitElement {
  static override styles = css`
    .left-content {
      margin-bottom: 8px;
    }
    @media (min-width: 42rem) {
      .left-wrapper {
        display: flex;
        gap: 16px;
      }
      .left-content {
        margin-bottom: 0;
      }
    }
  `;
  override render() {
    return html`
      <kyn-global-filter>
        <div class="left-wrapper">
          <kyn-skeleton width="122px" class="left-content"></kyn-skeleton>
          <kyn-skeleton width="122px"></kyn-skeleton>
        </div>
        <div slot="actions">
          <kyn-skeleton width="122px"></kyn-skeleton>
        </div>
        <div slot="tags"></div>
      </kyn-global-filter>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sample-filter-skeleton-component': SampleFilterSkeletonComponent;
  }
}
