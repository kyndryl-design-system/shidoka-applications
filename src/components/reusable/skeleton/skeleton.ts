import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
// import { ifDefined } from 'lit/directives/if-defined.js';
//import { classMap } from 'lit/directives/class-map.js';
import SkeletonScss from './skeleton.scss';

/**
 * Skeleton
 */

@customElement('kyn-skeleton')
export class Skeleton extends LitElement {
  static override styles = SkeletonScss;

  /** Loader type. `'normal'` and `'inline'`. Default `'normal'`. */
  @property({ type: Boolean })
  inline = false;

  /** Skeleton type. `'text', `'icon'` & `'placeholder'`, `Default `'placeholder'` */
  @property({ type: String })
  type = 'placeholder';

  override render() {
    return html`<div class="skeleton-placeholder"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-skeleton': Skeleton;
  }
}
