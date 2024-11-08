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

  override render() {
    const skeletonLines = Array.from(
      { length: this.lines },
      () => html` <div class="skeleton"></div> `
    );
    return html` ${skeletonLines}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
