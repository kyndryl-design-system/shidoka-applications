import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import CardSampleScss from './cardSample.scss';

/**  Sample Lit component to show card pattern. */
@customElement('sample-card-component')
export class SampleCardComponent extends LitElement {
  static override styles = CardSampleScss;

  /** Show or hide the card logo container */
  @property({ type: Boolean })
  showLogo = true;

  /** Optional subtitle text. If undefined, subtitle will not be shown */
  @property({ type: String })
  subtitle = 'This is card subtitle';

  /** Optional logo image source */
  @property({ type: String })
  logoSrc =
    'https://fastly.picsum.photos/id/163/32/32.jpg?hmac=6Ev67xrdofIgcyzhr8G7E_OCYUUziK4DoqoH3XZ4I08';

  override render() {
    return html`
      ${this.showLogo
        ? html`
            <div class="card-logo-container">
              <div class="card-logo">
                <img
                  class="card-logo-img"
                  src=${ifDefined(this.logoSrc)}
                  alt="product logo"
                />
              </div>
            </div>
          `
        : ''}
      <h1 class="card-title">
        <slot name="title"></slot>
      </h1>
      ${this.subtitle
        ? html` <div class="card-subtitle">${this.subtitle}</div> `
        : ''}
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
