import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import CardSampleScss from './cardSample.scss';

/**  Sample Lit component to show card pattern. */
@customElement('sample-card-component')
export class SampleCardComponent extends LitElement {
  static override styles = CardSampleScss;

  override render() {
    return html`
      <div class="card-logo-container">
        <div class="card-logo">
          <img
            class="card-logo-img"
            src="https://fastly.picsum.photos/id/163/32/32.jpg?hmac=6Ev67xrdofIgcyzhr8G7E_OCYUUziK4DoqoH3XZ4I08"
            alt="product logo"
          />
        </div>
      </div>
      <h1 class="card-title">
        <slot name="title"></slot>
      </h1>
      <div class="card-subtitle">This is card subtitle</div>
      <div class="card-description">
        <slot name="description"></slot>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'sample-card-component': SampleCardComponent;
  }
}
