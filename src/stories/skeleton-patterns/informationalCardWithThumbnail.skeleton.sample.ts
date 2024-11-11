import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../../components/reusable/loaders/skeleton';
import '../../components/reusable/card';

/**  Sample Lit component to show informational card with logo skeleton pattern. */
@customElement('informational-card-w-thumbnail-skeleton-sample-component')
export class InformationalCardWithThumbnail extends LitElement {
  override render() {
    return html`
      <div>
        <kyn-skeleton size="card-logo"></kyn-skeleton>
        <kyn-skeleton
          size="thumbnail"
          class="card-thumbnail-img"
          alt="Card thumbnail"
          aria-hidden="true"
        ></kyn-skeleton>
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
    'informational-card-w-thumbnail-skeleton-sample-component': InformationalCardWithThumbnail;
  }
}
