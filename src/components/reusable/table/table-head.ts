import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import styles from './table-head.scss';

/**
 * `kyn-thead` Web Component.
 *
 * Represents a custom table head (`<thead>`) for Shidoka's design system tables.
 * Designed to contain and style table header rows (`<tr>`) and header cells (`<th>`).
 *
 * @slot unnamed - The content slot for adding table header rows (`<kyn-header-tr>`).
 */
@customElement('kyn-thead')
export class TableHead extends LitElement {
  static override styles = [styles];

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'rowgroup';

  @property({ type: Boolean, reflect: true })
  stickyHeader = false;

  /**
   * Context consumer for the table context.
   * Updates the cell's dense properties when the context changes.
   * @private
   * @ignore
   * @type {ContextConsumer<TableContextType, TableCell>}
   */
  @state()
  // @ts-expect-error - This is a context consumer
  private _contextConsumer = new ContextConsumer(
    this,
    tableContext,
    (context) => {
      if (context) this.handleContextChange(context);
    },
    true
  );

  /**
   * Update the stickyHeader property when the context changes.
   * @param {TableContextType} context - The updated context.
   */
  handleContextChange = ({ stickyHeader }: TableContextType) => {
    if (typeof stickyHeader == 'boolean') {
      this.stickyHeader = stickyHeader;
    }
  };

  /**
   * @ignore
   */
  @queryAssignedElements()
  unnamedSlotEls!: Array<HTMLElement>;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'on-sort-changed',
      this.handleChildSort as EventListener
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'on-sort-changed',
      this.handleChildSort as EventListener
    );
  }

  private handleChildSort(e: CustomEvent) {
    const sortedColumnKey = e.detail.sortKey;

    // unnamedSlotEls[0] is the kyn-tr element
    const parentRow = this.unnamedSlotEls[0];

    // Get all kyn-th children of that kyn-tr element
    const allHeaders = Array.from(parentRow.querySelectorAll('kyn-th'));

    for (const header of allHeaders) {
      if (header.sortKey !== sortedColumnKey) {
        header.resetSort(); // Reset sort state of non-sorted columns
      }
    }
  }

  override render() {
    return html` <slot></slot> `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-thead': TableHead;
  }
}
