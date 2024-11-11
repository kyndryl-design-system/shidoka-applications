import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../../components/reusable/loaders/skeleton';
import '../../components/reusable/card';

/**  Sample Lit component to show inoformational card skeleton pattern. */
@customElement('informational-card-skeleton-sample-component')
export class InformationalCardSkeletonComponent extends LitElement {
  override render() {
    return html`
      <div>
        <kyn-skeleton size="card-logo"></kyn-skeleton>
        <kyn-skeleton size="title" aria-hidden="true"></kyn-skeleton>
        <kyn-skeleton size="subtitle" aria-hidden="true"></kyn-skeleton>
        <div class="card-body">
          <kyn-skeleton size="body-text" aria-hidden="true"></kyn-skeleton>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'informational-card-skeleton-sample-component': InformationalCardSkeletonComponent;
  }
}
