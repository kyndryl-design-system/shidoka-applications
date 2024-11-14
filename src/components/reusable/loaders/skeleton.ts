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
   * Optional: Predefined size or custom size value (e.g., 'small', '100px').
   */
  @property({ type: String })
  size?: 'small' | 'medium' | 'large' | string;

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

  override render() {
    const isPredefinedSize = ['small', 'medium', 'large'].includes(
      this.size ?? ''
    );
    const classes = {
      skeleton: true,
      [this.shape]: true,
      [`size-${this.size}`]: isPredefinedSize,
      'multi-line': this.lines > 1,
      inline: this.inline,
    };

    let computedWidth = this.width?.includes('%') ? undefined : this.width;
    let computedHeight = this.height;

    if (!this.width && !this.height && this.size) {
      computedWidth = this.size;
      computedHeight = this.size;
    }

    const styles = {
      ...(computedWidth && { width: computedWidth }),
      ...(computedHeight && { height: computedHeight }),
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
