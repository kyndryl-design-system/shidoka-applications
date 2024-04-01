import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

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

  /**
   * Context consumer for the table context.
   * Updates the cell's dense and ellipsis properties when the context changes.
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
   * Updates the row's striped property when the context changes.
   * @param {TableContextType} context - The updated context.
   */
  handleContextChange = ({ striped }: TableContextType) => {
    if (typeof striped == 'boolean') {
      this.striped = striped;
    }
  };

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
