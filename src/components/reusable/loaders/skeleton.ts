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

  /**
   * Optional: Predefined skeleton types with default styling
   */
  @property({ type: String, reflect: true })
  elementType?:
    | 'default'
    | 'thumbnail'
    | 'title'
    | 'tag'
    | 'tabs'
    | 'pagination'
    | 'subtitle'
    | 'body-text'
    | 'table-cell'
    | 'button'
    | 'link'
    | 'card-logo' = 'default';

  /**
   *  Sets number of skeleton lines to display
   */
  @property({ type: Number })
  lines = 1;

  /**
   * Sets whether to display inline or block
   */
  @property({ type: Boolean })
  inline = false;

  /**
   * Optional: Sets custom width (e.g., '100px', '50%')
   */
  @property({ type: String })
  width?: string;

  /**
   * Optional: Custom height (e.g., '20px', '100px')
   */
  @property({ type: String })
  height?: string;

  override render() {
    const classes = {
      skeleton: true,
      [`element-type-${this.elementType}`]: true,
      'multi-line': this.lines > 1,
      inline: this.inline,
    };

    const styles = {
      ...(this.width && { width: this.width }),
      ...(this.height && { height: this.height }),
    };

    const skeletonLines = Array.from(
      { length: this.lines },
      () => html`
        <div
          class=${classMap(classes)}
          style=${Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join(';')}
          aria-hidden="true"
        ></div>
      `
    );

    return html` ${skeletonLines} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
