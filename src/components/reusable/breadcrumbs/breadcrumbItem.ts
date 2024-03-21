/**
 * Copyright Kyndryl, Inc. 2023
 */

// External library imports
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Relative component imports
import styles from './breadcrumbItem.scss';

/**
 * Breadcrumb Item
 *
 * @slot unnamed - Slot for the content of the breadcrumb item, usually the label or text.
 *
 */
@customElement('kyn-breadcrumb-item')
export class BreadcrumbItem extends LitElement {
  // Property to hold the URL for the breadcrumb item
  @property({ type: String })
  accessor href = '';

  static override styles = [styles];

  override render() {
    return html`
      <li class="breadcrumb-item">
        <!-- Render as link if href is provided, otherwise render as plain text -->
        ${this.href
          ? html`<a href="${this.href}"><slot></slot></a>`
          : html`<span><slot></slot></span>`}
      </li>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-breadcrumb-item': BreadcrumbItem;
  }
}
