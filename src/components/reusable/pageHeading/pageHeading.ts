import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

// Relative component imports
import styles from './pageHeading.scss';

/**
 * Page Heading
 *
 * @slot unnamed - Slot for the heading tag.
 * @slot description - Slot for optional description text.
 *
 */
@customElement('kyn-page-heading')
export class PageHeading extends LitElement {
  static override styles = [styles];

  override render() {
    return html`
      <div class="page-heading">
        <div class="page-heading__text">
          <slot></slot>
        </div>
        <slot name="description"></slot>
      </div>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-page-heading': PageHeading;
  }
}
