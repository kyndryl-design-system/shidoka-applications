import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-row.scss';

/**
 * `kyn-tr` Web Component.
 *
 * Represents a table row (`<tr>`) equivalent for custom tables created with Shidoka's design system.
 * It primarily acts as a container for individual table cells and behaves similarly to a native `<tr>` element.
 *
 * @slot unnamed - The content slot for adding table cells (`kyn-td` or other relevant cells).
 */
@customElement('kyn-tr')
export class TableRow extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  selected = false;

  // @property({ type: Boolean, reflect: true })
  // disabled = false;

  @property({ type: Boolean, reflect: true })
  clickable = false;

  @property({ type: Boolean, reflect: true })
  expanded = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleClick as EventListener);
  }

  handleClick() {
    const event = new CustomEvent('on-row-clicked', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-tr': TableRow;
  }
}
