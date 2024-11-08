import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './skeleton.scss';

/**
 * Skeleton block
 */
@customElement('kyn-skeleton')
export class Skeleton extends LitElement {
  static override styles = Styles;

  /** Use inline style instead of block. */
  @property({ type: Boolean })
  inline = false;

  /** Number of skeleton lines to show. */
  @property({ type: Number })
  lines = 1;

  /** Minimum width for random skeleton lines. */
  @property({ type: Number })
  minWidth = 100; // Minimum width in percentage

  /** Maximum width for random skeleton lines. */
  @property({ type: Number })
  maxWidth = 100; // Maximum width in percentage

  private getRandomWidth() {
    return (
      Math.floor(Math.random() * (this.maxWidth - this.minWidth + 1)) +
      this.minWidth
    );
  }

  override render() {
    const skeletonLines = Array.from({ length: this.lines }, () => {
      const width = this.getRandomWidth();
      return html` <div class="skeleton" style="width: ${width}%"></div> `;
    });
    return html` ${skeletonLines}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
