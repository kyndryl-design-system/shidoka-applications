import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import ResponseScss from './response.scss';

@customElement('kyn-response')
export class Response extends LitElement {
  static override styles = ResponseScss;

  override render() {
    return html` <div class="response-wrapper">
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-response': Response;
  }
}
