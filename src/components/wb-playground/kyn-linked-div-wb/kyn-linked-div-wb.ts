import { html, LitElement } from 'lit';
import Styles from './kyn-linked-div-wb.scss';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import { customElement, property } from 'lit/decorators.js';

/**
 * Linked div.
 * @slot body -- slot for body text
 */
@customElement('kyn-linked-div-wb')
export class KynLinkedDivWb extends LitElement {
  static override styles = [Styles];

  /**
   * Item size, required.
   */
  @property({ type: String })
  size = 'auto';

  /**
   * Title text, required.
   */
  @property({ type: String })
  divTitle = '';

  /**
   * Main header text, required.
   */
  @property({ type: String })
  mainHeader = '';

  /**
   * Background hover color.
   */
  @property({ type: String })
  hoverColor = '#23564d';

  /**
   * External/internal url for kd-link, required.
   */
  @property({ type: String })
  linkHref = '';

  override render() {
    return html`
      <div
        id="linked-div"
        class=${this.size}
        style="--hover-color: ${this.hoverColor}"
      >
        <kd-link standalone href=${this.linkHref}>
          <div id="linked-div-content">
            <h3 id="secondary-header">${this.divTitle}</h3>
            <h2 id="main-header">${this.mainHeader}</h2>
            <br />
            <slot id="body-slot-wrapper"></slot>
          </div>
        </kd-link>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-linked-div-wb': KynLinkedDivWb;
  }
}
