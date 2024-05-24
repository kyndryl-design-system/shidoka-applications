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
 * @fires on-click - Captures the click event and emits the original event details.
 * @slot unnamed - Slot for the content of the breadcrumb item, usually the label or text.
 */
@customElement('kyn-breadcrumb-item')
export class BreadcrumbItem extends LitElement {
  // Property to hold the URL for the breadcrumb item
  @property({ type: String })
  href = '';

  static override styles = [styles];

  /** role
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'listitem';

  override render() {
    return html`
      <div class="breadcrumb-item">
        <!-- Render as link if href is provided, otherwise render as plain text -->
        ${this.href
          ? html`
              <a
                href="${this.href}"
                @click=${(e: Event) => this._handleClick(e)}
                ><slot></slot
              ></a>
            `
          : html` <span><slot></slot></span> `}
      </div>
    `;
  }

  private _handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-breadcrumb-item': BreadcrumbItem;
  }
}
