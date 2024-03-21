import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import CardSampleScss from './cardSample.scss';
import logoImg from './placeholder-logo.png';

/**  Sample Lit component to show card pattern. */
@customElement('sample-card-component')
export class SampleCardComponent extends LitElement {
  static override styles = CardSampleScss;

  override render() {
    return html`
      <div class="card-logo-container">
        <div class="card-logo">
          <img class="card-logo-img" src="${logoImg}" alt="product logo" />
        </div>
      </div>
      <h1 class="card-title">
        This is a card title with a maximum sentence limit of 2 lines
      </h1>
      <div class="card-subtitle">This is card subtitle</div>
      <div class="card-description">
        Amazon EC2 Auto Scaling ensures that your application always has the
        right amount of compute capacity by dynamically adjusting the number of
        Amazon EC2 instances based on demand.
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'sample-card-component': SampleCardComponent;
  }
}
