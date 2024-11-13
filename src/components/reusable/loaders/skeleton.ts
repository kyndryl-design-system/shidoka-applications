import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import skeletonStyles from './skeleton.scss';

/**
 * `kyn-skeleton` Web Component.
 * A skeleton loading state to be utilized across patterns and components.
 */
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
    | 'pagination'
    | 'checkbox'
    | 'subtitle'
    | 'body-text'
    | 'table-cell'
    | 'button'
    | 'link'
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
