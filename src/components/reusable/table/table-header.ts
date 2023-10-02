import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import arrowUpIcon from '@carbon/icons/es/arrow--up/16';
import styles from './table-header.scss';

import { SORT_DIRECTION, TABLE_CELL_ALIGN } from './defs';

/**
 * `kyn-th` Web Component.
 *
 * Represents a custom table header cell (`<th>`) for Shidoka's design system tables.
 * Provides sorting functionality when enabled and allows alignment customization.
 *
 * @fires on-sort-changed - Dispatched when the sort direction is changed.
 * @slot unnamed - The content slot for adding header text or content.
 */
@customElement('kyn-th')
export class TableHeader extends LitElement {
  static override styles = [styles];

  /**
   * Specifies the alignment of the content within the table header.
   * Options: 'left', 'center', 'right'
   */
  @property({ type: String, reflect: true })
  align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.LEFT;

  /**
   * Specifies if the column is sortable.
   * If set to true, an arrow icon will be displayed unpon hover,
   * allowing the user to toggle sort directions.
   */
  @property({ type: Boolean, reflect: true })
  sortable = false;

  /** Specifies the direction of sorting applied to the column. */
  @property({ type: String })
  sortDirection: SORT_DIRECTION = SORT_DIRECTION.DEFAULT;

  /** Specifies if the header slot is empty. */
  @property({ type: Boolean })
  noHeader = false;

  /**
   * Toggles the sort direction between ascending, descending, and default states.
   * It also dispatches an event to notify parent components of the sorting change.
   */
  private toggleSortDirection() {
    switch (this.sortDirection) {
      case SORT_DIRECTION.DEFAULT:
      case SORT_DIRECTION.DESC:
        this.sortDirection = SORT_DIRECTION.ASC;
        break;
      case SORT_DIRECTION.ASC:
        this.sortDirection = SORT_DIRECTION.DESC;
        break;
    }

    // Dispatch event to notify parent components of the sorting change
    this.dispatchEvent(
      new CustomEvent('on-sort-changed', {
        detail: { sortDirection: this.sortDirection },
      })
    );
  }

  /**
   * Invoked after the component is updated. This lifecycle method is
   * from LitElement's API. In this override, we check if the header's
   * slot is empty after each update.
   */
  override updated() {
    this.checkIfHeaderSlotIsEmpty();
  }

  /**
   * Checks if the content slot for the table header is empty. If it is,
   * the `noHeader` property is set to `true`. This check is essential to
   * ensure proper rendering and accessibility.
   */
  checkIfHeaderSlotIsEmpty() {
    // Retrieve the slot from the shadow DOM.
    const slot = this.shadowRoot!.querySelector('slot');

    // Get all nodes assigned to the slot.
    const nodes = slot!.assignedNodes({ flatten: true });

    // Filter out nodes that are just whitespace.
    const nonWhitespaceNodes = nodes.filter((node) => {
      return node?.nodeType !== Node.TEXT_NODE || node?.textContent?.trim() !== '';
    });

    // If there are no meaningful nodes in the slot, set `noHeader` to true.
    this.noHeader = nonWhitespaceNodes.length === 0;
  }

  override render() {
    const iconClasses = {
      'sort-icon': true,
      'sort-icon--sorting': this.sortDirection !== SORT_DIRECTION.DEFAULT,
      'sort-icon--sorting-asc': this.sortDirection === SORT_DIRECTION.ASC,
      'sort-icon--sorting-desc': this.sortDirection === SORT_DIRECTION.DESC,
    };

    return html`
      <div
        class="container"
        @click=${this.sortable ? () => this.toggleSortDirection() : undefined}
      >
        <div class="slot-wrapper">
          <slot></slot>
          ${this.noHeader
            ? html`<span class="sr-only">Empty Header</span>`
            : null}
        </div>
        ${this.sortable
          ? html`<kd-icon
              class=${classMap(iconClasses)}
              .icon=${arrowUpIcon}
            ></kd-icon>`
          : null}
      </div>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-th': TableHeader;
  }
}
