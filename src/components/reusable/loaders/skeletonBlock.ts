import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import Styles from './skeletonBlock.scss';

/**
 * Skeleton block
 */
@customElement('kyn-skeleton-block')
export class SkeletonBlock extends LitElement {
  static override styles = Styles;

  override render() {
    return html` <div class="skeleton-block"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton-block': SkeletonBlock;
  }
}
