import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { getAttributes, toString } from '@carbon/icon-helpers';
import IconScss from './icon.scss';

@customElement('kyn-icon')
export class Icon extends LitElement {
  static override styles = IconScss;

  @property({ type: Object })
  icon: any = {};

  @property({ type: String })
  fill = 'currentColor';

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
