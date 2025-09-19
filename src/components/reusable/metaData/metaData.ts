import { LitElement, html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { customElement, property } from 'lit/decorators.js';
import testingIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/testing.svg';
import { classMap } from 'lit/directives/class-map.js';
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

  /** Horizontal orientation. Default is `false` */
  @property({ type: Boolean })
  accessor horizontal = false;

  /** Adds scrollable overflow to the slot content. Default is `false` */
  @property({ type: Boolean })
  accessor scrollableContent = false;

  /** Truncate long content. Default is `false`. Note: Useful for text content */
  @property({ type: Boolean })
  accessor truncateContent = false;

  override render() {
    const metaIcon = {
      'meta-icon': true,
      'v-align': !this.horizontal,
    };
    const metaWrapper = {
      'meta-wrapper': true,
      'horizontal-align': this.horizontal,
    };
    const metaLabel = {
      'meta-label': true,
      'h-align': this.horizontal,
    };
    const metaValue = {
      'meta-value': true,
      scrollable: this.scrollableContent,
      truncate: this.truncateContent,
    };
    return html`
      <div class="meta-container">
        ${this.showIcon
          ? html`<slot name="icon">
              <span class="${classMap(metaIcon)}">
                ${unsafeSVG(testingIcon)}
              </span>
            </slot>`
          : null}
        ${this.showIcon ? html` <div class="spacer"></div> ` : null}
        <div class="${classMap(metaWrapper)}">
          ${this.showLabel
            ? html`
                <div class="${classMap(metaLabel)}">${this.labelText}</div>
              `
            : null}
          ${this.showValue
            ? html`
                <div
                  class="${classMap(metaValue)}"
                  tabindex=${this.scrollableContent ? '0' : '-1'}
                >
                  <slot></slot>
                </div>
              `
            : null}
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
