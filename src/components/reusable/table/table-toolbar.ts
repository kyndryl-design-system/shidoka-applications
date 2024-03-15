import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-toolbar.scss';

/**
 * `kyn-table-toolbar` Web Component.
 *
 * This component provides a toolbar for tables, primarily featuring a title and additional content.
 * The title is rendered prominently, while the slot can be used for controls, buttons, or other interactive elements.
 *
 * @slot unnamed - The primary content slot for controls, buttons, or other toolbar content.
 */
@customElement('kyn-table-toolbar')
export class TableToolbar extends LitElement {
  static override styles = [styles];

  /**The title for the toolbar */
  @property({ type: String })
  accessor tableTitle = '';

  override render() {
    return html`
      ${this.tableTitle
        ? html`<span class="title">${this.tableTitle}</span>`
        : ''}
      <div class="slot-wrapper">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-table-toolbar': TableToolbar;
  }
}
