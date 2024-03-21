import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-body.scss';

/**
 * `kyn-tbody` Web Component.
 *
 * Represents the body section of Shidoka's design system tables. Designed to provide
 * a consistent look and feel, and can offer striped rows for enhanced readability.
 *
 * @slot unnamed - The content slot for adding rows (`<kyn-tr>`) within the table body.
 */
@customElement('kyn-tbody')
export class TableBody extends LitElement {
  static override styles = [styles];

  /** Determines if the rows in the table body should be striped. */
  @property({ type: Boolean, reflect: true })
  striped = false;

  override render() {
    return html`<slot></slot>`;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-tbody': TableBody;
  }
}
