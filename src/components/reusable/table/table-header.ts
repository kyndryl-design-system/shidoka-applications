import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedNodes,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';
import styles from './table-header.scss?inline';

import { SORT_DIRECTION, TABLE_CELL_ALIGN } from './defs';

/**
 * `kyn-th` Web Component.
 *
 * Represents a custom table header cell (`<th>`) for Shidoka's design system tables.
 * Provides sorting functionality when enabled and allows alignment customization.
 *
 * @fires on-sort-changed - Dispatched when the sort direction is changed. `detail: {sortDirection: string, sortKey: string } `
 * @fires on-column-resize - Dispatched when the column is resized. `detail: { columnIndex: number, newWidth: string }`
 * @slot unnamed - The content slot for adding header text or content.
 * @slot column-filter - slot for column filter.
 */
@customElement('kyn-th')
export class TableHeader extends LitElement {
  static override styles = unsafeCSS(styles);

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor role = 'columnheader';

  /** Determines if the cell should have a denser layout. */
  @property({ type: Boolean, reflect: true })
  accessor dense = false;

  /**
   * Context consumer for the table context.
   * Updates the cell's dense properties when the context changes.
   * @private
   * @ignore
   * @type {ContextConsumer<TableContextType, TableHeader>}
   */
  @state()
  // @ts-expect-error - This is a context consumer
  private accessor _contextConsumer = new ContextConsumer(
    this,
    tableContext,
    (context) => {
      if (context) this.handleContextChange(context);
    },
    true
  );

  /**
   * Updates the cell's dense properties when the context changes.
   * @param {TableContextType} context - The updated context.
   */
  handleContextChange = ({ dense }: TableContextType) => {
    if (typeof dense == 'boolean') {
      this.dense = dense;
    }
  };

  /**
   * Specifies the alignment of the content within the table header.
   * Options: 'left', 'center', 'right'
   */
  @property({ type: String, reflect: true })
  accessor align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.LEFT;

  /**
   * Specifies if the column is sortable.
   * If set to true, an arrow icon will be displayed unpon hover,
   * allowing the user to toggle sort directions.
   */
  @property({ type: Boolean, reflect: true })
  accessor sortable = false;

  /** Specifies the direction of sorting applied to the column. */
  @property({ type: String, reflect: true })
  accessor sortDirection: SORT_DIRECTION = SORT_DIRECTION.DEFAULT;

  /**
   * The textual content associated with this component.
   * Represents the primary content or label that will be displayed.
   */
  @property({ type: String })
  accessor headerLabel = '';

  /**
   * The unique identifier representing this column header.
   * Used to distinguish between different sortable columns and
   * to ensure that only one column is sorted at a time.
   */
  @property({ type: String })
  accessor sortKey = '';

  /**
   * Determines whether the content should be hidden from visual view but remain accessible
   * to screen readers for accessibility purposes. When set to `true`, the content
   * will not be visibly shown, but its content can still be read by screen readers.
   * This is especially useful for providing additional context or information to
   * assistive technologies without cluttering the visual UI.
   */
  @property({ type: Boolean })
  accessor visiblyHidden = false;

  /**
   * Sets a fixed width for the cell.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String, reflect: true })
  accessor width = '';

  /**
   * Sets a maximum width for the cell.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String, reflect: true })
  accessor maxWidth = '';

  /**
   * Sets a minimum width for the cell;
   * Accepts standard CSS width values (e.g., '150px', '50%').
   * @type {string}
   */
  @property({ type: String, reflect: true })
  accessor minWidth = '';

  /**
   * Enables resizing for this column.
   * When true, a resize handle appears on the right edge of the column.
   */
  @property({ type: Boolean, reflect: true })
  accessor resizable = false;

  /**
   * Sets a resize minimum width for the cell;
   * Minimum width constraint for resizing (supports 'px').
   */
  @property({ type: String })
  accessor resizeMinWidth = '100px';

  /**
   * Sets a resize minimum width for the cell;
   * Maximum width constraint for resizing (supports 'px').
   */
  @property({ type: String })
  accessor resizeMaxWidth = '1200px';

  /**
   * @ignore
   */
  @queryAssignedNodes({ flatten: true })
  accessor listItems!: Array<Node>;

  @state()
  private accessor _isResizing = false;

  @state()
  private accessor _resizeStartX = 0;

  @state()
  private accessor _resizeStartWidth = 0;

  @state()
  private accessor _columnWidthsSnapshot: Map<number, number> = new Map();

  /**
   * Resets the sorting direction of the component to its default state.
   * Useful for initializing or clearing any applied sorting on the element.
   */
  resetSort() {
    this.sortDirection = SORT_DIRECTION.DEFAULT;
  }

  /**
   * Assistive text for screen readers.
   * @ignore
   */
  @state()
  accessor assistiveText = '';

  /**
   * Toggles the sort direction between ascending, descending, and default states.
   * It also dispatches an event to notify parent components of the sorting change.
   */
  private toggleSortDirection() {
    if (!this.sortKey) {
      console.error('sortKey is missing for a sortable column.');
      return;
    }

    switch (this.sortDirection) {
      case SORT_DIRECTION.DEFAULT:
      case SORT_DIRECTION.DESC: {
        this.sortDirection = SORT_DIRECTION.ASC;
        const assistiveText1 = `Column header ${this.sortKey} sorted in ascending order`;
        this.assistiveText =
          this.assistiveText === '' || this.assistiveText === assistiveText1
            ? `${assistiveText1}.`
            : assistiveText1;
        break;
      }
      case SORT_DIRECTION.ASC: {
        this.sortDirection = SORT_DIRECTION.DESC;
        const assistiveText2 = `Column header ${this.sortKey} sorted in descending order`;
        this.assistiveText =
          this.assistiveText === '' || this.assistiveText === assistiveText2
            ? `${assistiveText2}.`
            : assistiveText2;
        break;
      }
    }

    // Dispatch event to notify parent components of the sorting change
    this.dispatchEvent(
      new CustomEvent('on-sort-changed', {
        bubbles: true,
        composed: true,
        detail: { sortDirection: this.sortDirection, sortKey: this.sortKey },
      })
    );
  }

  override updated(changedProperties: PropertyValues) {
    this.getTextContent();

    super.updated(changedProperties);
    if (this.maxWidth && changedProperties.has('maxWidth')) {
      this.style.setProperty('--kyn-th-max-width', this.maxWidth);
    }

    if (this.width && changedProperties.has('width')) {
      this.style.setProperty('--kyn-th-width', this.width);
    }

    if (this.minWidth && changedProperties.has('minWidth')) {
      this.style.setProperty('--kyn-th-min-width', this.minWidth);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    // Resize listener is attached directly to the resize-handle in the template
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // No cleanup needed as event listener is in the template
  }

  getTextContent() {
    const nonWhitespaceNodes = this.listItems.filter((node) => {
      return (
        node?.nodeType !== Node.TEXT_NODE || node?.textContent?.trim() !== ''
      );
    });

    this.headerLabel = nonWhitespaceNodes[0]?.textContent || '';
  }

  private _handleResizeStart = (e: MouseEvent) => {
    if (!this.resizable) return;

    e.preventDefault();
    e.stopPropagation();

    this._isResizing = true;
    this._resizeStartX = e.clientX;
    this._resizeStartWidth = this.offsetWidth;

    // Mark as resizing (hides sort icon, locks handle position)
    this.setAttribute('data-resizing', 'true');

    const table = this.closest('kyn-table') as any;
    if (table) {
      // const columnIndex = this._getColumnIndex();
      //  Lock ALL columns to their exact current widths - this freezes the layout completely
      this._lockAllColumnsExactly();
      // Force reflow to apply the lock immediately - prevents jump on first mousemove
      void this.offsetWidth;
      // Lock table width during resize
      table.lockTableWidth();
      // Disable pointer events on all other headers to prevent layout thrashing
      // this._disableOtherHeadersPointerEvents(columnIndex);
    }

    // Add event listeners
    document.addEventListener('mousemove', this._handleResizeMove);
    document.addEventListener('mouseup', this._handleResizeEnd);

    // Lock cursor and prevent text selection
    // this._lockResizeCursor();
  };

  private _handleResizeMove = (e: MouseEvent) => {
    if (!this._isResizing) return;

    e.preventDefault();
    const deltaX = e.clientX - this._resizeStartX;
    let newWidth = this._resizeStartWidth + deltaX;

    // Parse constraint values (support px)
    const minWidth = this._parseConstraintValue(
      this.minWidth ? this.minWidth : this.resizeMinWidth
    );
    const maxWidth = this._parseConstraintValue(
      this.maxWidth ? this.maxWidth : this.resizeMaxWidth
    );

    // Apply constraints
    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

    // Apply width ONLY to the resized column - nothing else changes
    this._applyWidthToAllCells(newWidth);

    // Calculate table width = sum of all locked columns + new resized column width
    this._updateTableWidthFromSnapshot(newWidth);

    // Dispatch event with new width
    this.dispatchEvent(
      new CustomEvent('on-column-resize', {
        bubbles: true,
        composed: true,
        detail: {
          columnIndex: this._getColumnIndex(),
          // newWidth: `${Math.round(newWidth)}px`,
          newWidth: `${newWidth}px`,
        },
      })
    );
  };

  private _handleResizeEnd = (e: MouseEvent) => {
    if (!this._isResizing) return;

    e.preventDefault();
    this._isResizing = false;

    // Remove event listeners
    document.removeEventListener('mousemove', this._handleResizeMove);
    document.removeEventListener('mouseup', this._handleResizeEnd);

    // Remove resizing state (shows sort icon again)
    this.removeAttribute('data-resizing');

    // Re-enable pointer events on all headers
    // this._enableAllHeadersPointerEvents();

    // Unlock cursor
    // this._unlockResizeCursor();
  };

  private _applyWidthToAllCells = (width: number) => {
    const roundedWidth = Math.round(width);
    const widthStr = `${roundedWidth}px`;

    // Apply width to this header cell only - body cells have their own styles
    this.style.width = widthStr;
    this.style.minWidth = widthStr;
    this.style.maxWidth = widthStr;
  };

  // private _lockResizeCursor = () => {
  //   (document.body as any).style.cursor = 'col-resize';
  //   (document.body as any).style.userSelect = 'none';
  //   (document.body as any).style.webkitUserSelect = 'none';
  // };

  // private _unlockResizeCursor = () => {
  //   (document.body as any).style.cursor = 'auto';
  //   (document.body as any).style.userSelect = 'auto';
  //   (document.body as any).style.webkitUserSelect = 'auto';
  // };

  private _parseConstraintValue = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const numValue = parseFloat(value);
    return numValue;
  };

  private _getColumnIndex = (): number => {
    const parent = this.closest('kyn-header-tr');
    if (!parent) return -1;
    return Array.from(parent.querySelectorAll('kyn-th')).indexOf(this);
  };

  private _lockAllColumnsExactly = () => {
    const table = this.closest('kyn-table') as any;
    if (!table) return;

    const headerRow = table.querySelector('kyn-header-tr');
    if (!headerRow) return;

    const columns = Array.from(headerRow.querySelectorAll('kyn-th'));

    // Lock EVERY column to exact pixel width
    columns.forEach((col, index) => {
      const width = (col as any).offsetWidth;

      // Store the width for later calculation
      this._columnWidthsSnapshot.set(index, width);

      // Locking header cell
      // (col as any).style.width = `${width}px`;
      // (col as any).style.minWidth = `${width}px`;
      // (col as any).style.maxWidth = `${width}px`;
      // (col as any).style.flexGrow = '0';
      // (col as any).style.flexShrink = '0';
      // (col as any).style.flex = 'none';
    });
  };

  private _updateTableWidthFromSnapshot = (resizedColumnWidth: number) => {
    const table = this.closest('kyn-table') as any;
    if (!table) return;

    const resizingColumnIndex = this._getColumnIndex();

    // Delegate to table component to update its width
    table.updateTableWidthFromResize(
      this._columnWidthsSnapshot,
      resizingColumnIndex,
      resizedColumnWidth
    );
  };

  // private _enableAllHeadersPointerEvents = () => {
  //   const table = this.closest('kyn-table') as any;
  //   if (!table) return;

  //   const headerRow = table.querySelector('kyn-header-tr');
  //   if (!headerRow) return;

  //   const columns = Array.from(headerRow.querySelectorAll('kyn-th'));
  //   columns.forEach((col) => {
  //     (col as any).style.pointerEvents = '';
  //   });
  // };

  override render() {
    const iconClasses = {
      'sort-icon': true,
      'sort-icon--sorting': this.sortDirection !== SORT_DIRECTION.DEFAULT,
      'sort-icon--sorting-asc': this.sortDirection === SORT_DIRECTION.ASC,
      'sort-icon--sorting-desc': this.sortDirection === SORT_DIRECTION.DESC,
    };

    const slotClasses = {
      'slot-wrapper': true,
      'sr-only': this.visiblyHidden,
    };

    /**
     * Accessibility Enhancements:
     * - role: Sets the appropriate role for interactive headers (e.g., when sortable).
     * - ariaSort: Indicates the sorting direction to assistive technologies.
     * - ariaLabel: Provides a descriptive label to assistive technologies for sortable headers.
     * - tabIndex: Enables keyboard interaction for sortable headers.
     * - onKeyDown: Handles keyboard events for sortable headers to allow sorting via the keyboard.
     */
    const role = this.sortable ? 'button' : undefined;
    // const arialSort = this.sortable ? this.sortDirection : undefined;
    const ariaLabel =
      this.sortable && this.headerLabel
        ? `Sort by ${this.headerLabel}`
        : undefined;
    const tabIndex = this.sortable ? 0 : undefined;
    const onKeyDown = this.sortable
      ? (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            this.toggleSortDirection();
          }
        }
      : undefined;

    return html`
      <div
        class="container"
        role=${ifDefined(role)}
        @click=${this.sortable ? () => this.toggleSortDirection() : undefined}
        aria-label=${ifDefined(ariaLabel)}
        tabindex=${ifDefined(tabIndex)}
        @keydown=${onKeyDown}
      >
        <div class=${classMap(slotClasses)}>
          <slot></slot>
        </div>
        ${this.sortable
          ? html`<span class=${classMap(iconClasses)}
              >${unsafeSVG(arrowUpIcon)}</span
            >`
          : null}

        <div
          class="assistive-text"
          role="status"
          aria-live="polite"
          aria-relevant="additions text"
        >
          ${this.assistiveText}
        </div>
      </div>
      ${this.resizable
        ? html`<div
            class="resize-handle"
            @mousedown=${this._handleResizeStart}
            role="separator"
            aria-label="Resize column"
            aria-orientation="vertical"
          ></div>`
        : null}
      <slot name="column-filter"> </slot>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-th': TableHeader;
  }
}
