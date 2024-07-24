import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import Styles from './skeletonInline.scss';

/**
 * Skeleton inline
 */
@customElement('kyn-skeleton-inline')
export class SkeletonInline extends LitElement {
  static override styles = Styles;

  override render() {
    return html` <div class="skeleton-inline"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton-inline': SkeletonInline;
  }
}
