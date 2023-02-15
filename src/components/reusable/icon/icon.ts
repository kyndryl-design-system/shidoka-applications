import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { getAttributes, toString } from '@carbon/icon-helpers';
import IconScss from './icon.scss';

/**
 * Wrapper for vanilla Carbon icons to simplify usage.
 * @slot unnamed - The default slot for button content.
 */
@customElement('kyn-icon')
export class Icon extends LitElement {
  static override styles = IconScss;

  /** The imported Carbon icon. */
  @property({ type: Object })
  icon: any = {};

  /** Icon fill color. */
  @property({ type: String })
  fill = 'currentColor';

  /** Specify a size in pixels to override the imported Carbon icon's original size. */
  @property({ type: Number })
  sizeOverride = null;

  override render() {
    const attributes = JSON.parse(JSON.stringify(this.icon.attrs));
    attributes.fill = this.fill;

    if (this.sizeOverride) {
      attributes.width = this.sizeOverride;
      attributes.height = this.sizeOverride;
    }

    const iconString = toString({
      ...this.icon,
      attrs: getAttributes(attributes),
    });

    return html` ${unsafeHTML(iconString)} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-icon': Icon;
  }
}
