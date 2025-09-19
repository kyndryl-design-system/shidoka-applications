import { LitElement, html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { customElement, property } from 'lit/decorators.js';
import testingIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/testing.svg';
import Styles from './metaData.scss?inline';

/**
 * MetaData component.
 * @slot icon - Slot for custom icon.
 * @slot unnamed - Slot for other content.
 */
@customElement('kyn-meta-data')
export class MetaData extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Label text. */
  @property({ type: String })
  accessor labelText = '';

  /**
   * Show icon. Default is `true`.
   */
  @property({ type: Boolean })
  accessor showIcon = true;

  /**
   * Show label. Default is `true`.
   */
  @property({ type: Boolean })
  accessor showLabel = true;

  /**
   * Show value content. Default is `true`.
   */
  @property({ type: Boolean })
  accessor showValue = true;

  /** Vertical orientation. Default is `true` */
  @property({ type: Boolean })
  accessor vertical = false;

  override render() {
    return html`
      <div class="meta-container">
        ${this.showIcon
          ? html`<slot name="icon">
              <span class="meta-icon ${this.vertical ? 'v-align' : ''}">
                ${unsafeSVG(testingIcon)}
              </span>
            </slot>`
          : ''}
        ${this.showIcon ? html` <div class="spacer"></div> ` : ''}
        <div class="meta-wrapper ${this.vertical ? 'vertical' : ''}">
          ${this.showLabel
            ? html`
                <div class="meta-label ${!this.vertical ? 'h-align' : ''}">
                  ${this.labelText}
                </div>
              `
            : ''}
          ${this.showValue ? html` <slot></slot> ` : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-meta-data': MetaData;
  }
}
