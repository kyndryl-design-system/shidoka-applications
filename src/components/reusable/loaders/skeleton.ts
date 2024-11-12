import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import skeletonStyles from './skeleton.scss';

@customElement('kyn-skeleton')
export class Skeleton extends LitElement {
  static override styles = skeletonStyles;

  @property({ type: String, reflect: true })
  elementType:
    | 'default'
    | 'thumbnail'
    | 'title'
    | 'tag'
    | 'tabs'
    | 'subtitle'
    | 'body-text'
    | 'table-cell'
    | 'card-logo' = 'default';

  @property({ type: Number })
  lines = 1;

  @property({ type: Boolean })
  inline = false;

  override render() {
    const classes = {
      skeleton: true,
      [`element-type-${this.elementType}`]: true,
      'multi-line': this.lines > 1,
      inline: this.inline,
    };

    return html` <div class=${classMap(classes)} aria-hidden="true"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
