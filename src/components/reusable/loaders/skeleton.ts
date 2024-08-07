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

  override render() {
    return html` <div class="skeleton"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
