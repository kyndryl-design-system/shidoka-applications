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
  tableTitle = '';

  /**The subtitle for the toolbar */
  @property({ type: String })
  tableSubtitle = '';

  override render() {
    return html`
      <div class="title-wrapper">
        ${this.tableTitle
          ? html`<div class="title">${this.tableTitle}</div>`
          : ''}
        ${this.tableSubtitle
          ? html`<div class="subtitle">${this.tableSubtitle}</div>`
          : ''}
      </div>

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
