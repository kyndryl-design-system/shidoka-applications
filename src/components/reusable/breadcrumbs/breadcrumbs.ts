import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

// Relative component imports
import styles from './breadcrumbs.scss?inline';

/**
 * Breadcrumbs Component.
 *
 * @slot unnamed - Slot for inserting links.
 */
@customElement('kyn-breadcrumbs')
export class Breadcrumbs extends LitElement {
  static override styles = unsafeCSS(styles);

  override render() {
    return html`
      <nav class="breadcrumbs">
        <slot></slot>
      </nav>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-breadcrumbs': Breadcrumbs;
  }
}
