import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import skeletonStyles from './skeleton.scss?inline';

@customElement('kyn-skeleton')
export class Skeleton extends LitElement {
  static override styles = unsafeCSS(skeletonStyles);

  /**
   * Defines the shape of the skeleton element.
   */
  @property({ type: String, reflect: true })
  accessor shape: 'rectangle' | 'circle' = 'rectangle';

  /**
   * Optional: Predefined size (small, medium, large).
   */
  @property({ type: String })
  accessor size: 'small' | 'medium' | 'large' | undefined;

  /**
   * Optional: Custom width (overrides size if provided).
   */
  @property({ type: String })
  accessor width: string | undefined;

  /**
   * Optional: Custom height (overrides size if provided).
   */
  @property({ type: String })
  accessor height: string | undefined;

  /**
   * Sets the number of skeleton lines to display.
   */
  @property({ type: Number })
  accessor lines = 1;

  /**
   * Sets whether to display inline or block.
   */
  @property({ type: Boolean, reflect: true })
  accessor inline = false;

  /**
   * Set to `true` for AI theme.
   * This adds the `.ai-connected` class and reflects the host attribute,
   * allowing shidoka-scoped CSS variables to resolve.
   */
  @property({ type: Boolean, reflect: true })
  accessor aiConnected = false;

  override render() {
    const classes = {
      skeleton: true,
      [this.shape]: true,
      [`size-${this.size}`]: Boolean(this.size),
      'multi-line': this.lines > 1,
      inline: this.inline,
      'ai-connected': this.aiConnected,
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

    return html`<div class="container">${skeletonLines}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
