import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import skeletonStyles from './skeleton.scss';

@customElement('kyn-skeleton')
export class Skeleton extends LitElement {
  static override styles = skeletonStyles;

  /**
   * Defines the shape of the skeleton element.
   */
  @property({ type: String, reflect: true })
  shape: 'rectangle' | 'circle' = 'rectangle';

  /**
   * Optional: Predefined size (small, medium, large).
   */
  @property({ type: String })
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional: Custom width (overrides size if provided).
   */
  @property({ type: String })
  width?: string;

  /**
   * Optional: Custom height (overrides size if provided).
   */
  @property({ type: String })
  height?: string;

  /**
   * Sets the number of skeleton lines to display.
   */
  @property({ type: Number })
  lines = 1;

  /**
   * Sets whether to display inline or block.
   */
  @property({ type: Boolean })
  inline = false;

  /**
   * Defines the shade of the skeleton.
   */
  @property({ type: String })
  shade: 'light' | 'dark' | string = 'light';

  override render() {
    const classes = {
      skeleton: true,
      [this.shape]: true,
      [`size-${this.size}`]: Boolean(this.size),
      'multi-line': this.lines > 1,
      inline: this.inline,
      [`shade-${this.shade}`]: this.shade,
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
