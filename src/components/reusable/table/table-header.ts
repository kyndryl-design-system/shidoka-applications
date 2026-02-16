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
import { debounce } from '../../..';

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

  /** Assistive resize handle text for screen readers. */
  @property({ type: String })
  accessor assistiveResizeText = 'Column resize';

  /**
   * Sets a resize minimum width for the cell(supports 'px'.e.g., '150px');
   */
  @property({ type: String })
  accessor resizeMinWidth = '0px';

  /**
   * Sets a resize maximum width for the cell (supports 'px'e.g., '150px');
   */
  @property({ type: String })
  accessor resizeMaxWidth = '';

  /**
   * @ignore
   */
  @queryAssignedNodes({ flatten: true })
  accessor listItems!: Array<Node>;

  /**
   * Indicates whether the column is currently being resized. Used to manage state during the resize operation.
   * @internal
   */
  @state()
  private accessor _isResizing = false;

  /**
   * Table height for extending resize handle during drag
   * @ignore
   */
  @state()
  private accessor _tableHeightDuringResize = 0;

  /**
   * The initial X-coordinate of the mouse when the resize operation starts. Used to calculate the change in width during resizing.
   * @ignore
   */
  @state()
  private accessor _resizeStartX = 0;

  /**
   * The initial width of the column when the resize operation starts. Used as a reference point to calculate the new width during resizing.
   * @ignore
   */
  @state()
  private accessor _resizeStartWidth = 0;

  /**
   * For keeping track of the initial widths of all columns before resizing starts.
   * @ignore
   */
  @state()
  private accessor _columnWidthsSnapshot: Map<number, number> = new Map();

  /**
   * Stores the current resized column width during drag
   * @ignore
   */
  @state()
  private accessor _resizedColumnWidth = 0;

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

  getTextContent() {
    const nonWhitespaceNodes = this.listItems.filter((node) => {
      return (
        node?.nodeType !== Node.TEXT_NODE || node?.textContent?.trim() !== ''
      );
    });

    this.headerLabel = nonWhitespaceNodes[0]?.textContent || '';
  }

  /**
   * The group label text when this header is inside a kyn-th-group.
   * Set by the parent kyn-th-group component.
   * @ignore
   */
  @state()
  private accessor _groupLabel = '';

  /**
   * Whether this is the first child in a stacked header group.
   * @ignore
   */
  @state()
  private accessor _isGroupFirst = false;

  override connectedCallback() {
    super.connectedCallback();
    // Detect if this header is inside a stacked header group
    if (this.closest('kyn-th-group')) {
      this.setAttribute('stacked-child', '');

      // Only set data-header-not-expandable on stacked children
      const headerRow = this.closest('kyn-header-tr') as any;
      if (headerRow && !headerRow.hasAttribute('expandable')) {
        this.setAttribute('data-header-not-expandable', '');
      }

      // Check if header row has checkboxSelection
      if (headerRow && headerRow.hasAttribute('checkboxSelection')) {
        this.setAttribute('data-checkbox-selection', '');
      }
    }

    // Check if this is the first kyn-th in the entire header row
    const headerRow = this.closest('kyn-header-tr') as any;
    if (headerRow) {
      this._updateHeaderRowAttributes(headerRow);
    }

    // Read any group attributes already set by kyn-th-group
    this._syncGroupAttributes();

    // Watch for attribute changes set by kyn-th-group
    this._groupAttrObserver = new MutationObserver(() => {
      this._syncGroupAttributes();
    });
    this._groupAttrObserver.observe(this, {
      attributes: true,
      attributeFilter: [
        'data-group-label',
        'stacked-child-first',
        'stacked-child-last',
        'stacked-child',
      ],
    });
  }

  /**
   * Syncs internal state from group attributes and triggers measurement.
   * @ignore
   */
  private _syncGroupAttributes() {
    this._groupLabel = this.getAttribute('data-group-label') || '';
    this._isGroupFirst = this.hasAttribute('stacked-child-first');

    if (this._isGroupFirst && this._groupLabel) {
      // Measure the spanning width after render
      requestAnimationFrame(() => this._measureGroupSpanWidth());
    }

    // For ALL stacked children (not just first), set up observer to update group dimensions on resize
    if (this.hasAttribute('stacked-child') && this._groupLabel) {
      this._setupGroupResizeObserver();
    }

    // Update header row attributes whenever group attributes change
    const headerRow = this.closest('kyn-header-tr');
    if (headerRow) {
      this._updateHeaderRowAttributes(headerRow);
    }
  }

  /**
   * Updates header row attributes like data-first-in-row, and data-last-group.
   * Should be called whenever the DOM structure changes.
   * @ignore
   */
  private _updateHeaderRowAttributes(headerRow: Element) {
    const allHeaders = Array.from(
      headerRow.querySelectorAll('kyn-th')
    ) as Element[];

    // Only set data-first-in-row on stacked children
    if (allHeaders[0] === this && this.hasAttribute('stacked-child')) {
      this.setAttribute('data-first-in-row', '');
    } else {
      this.removeAttribute('data-first-in-row');
    }

    // Only set data-last-in-row on stacked children
    // if (
    //   allHeaders[allHeaders.length - 1] === this &&
    //   this.hasAttribute('stacked-child')
    // ) {
    //   this.setAttribute('data-last-in-row', '');
    // } else {
    //   this.removeAttribute('data-last-in-row');
    // }

    // Mark the first child of the last stacked group
    const stackedFirstChildren = allHeaders.filter((h) =>
      h.hasAttribute('stacked-child-first')
    );
    if (stackedFirstChildren.length > 0) {
      const lastGroupFirst =
        stackedFirstChildren[stackedFirstChildren.length - 1];
      if (this === lastGroupFirst) {
        this.setAttribute('data-last-group', '');
      } else {
        this.removeAttribute('data-last-group');
      }
    } else {
      this.removeAttribute('data-last-group');
    }
  }

  /**
   * Sets up a ResizeObserver for all stacked children to trigger group dimension updates.
   * @ignore
   */
  private _setupGroupResizeObserver() {
    if (this._groupLabelResizeObserver) {
      return;
    }

    this._groupLabelResizeObserver = new ResizeObserver(() => {
      this._updateGroupLabelDimensions();
    });
    this._groupLabelResizeObserver.observe(this);

    // listen for window resize to catch viewport changes
    window.addEventListener('resize', this._handleWindowResize);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._groupAttrObserver?.disconnect();
    this._groupLabelResizeObserver?.disconnect();
    window.removeEventListener('resize', this._handleWindowResize);
  }

  /**
   * Handle window resize to update group label dimensions.
   * @ignore
   */
  private _handleWindowResize = () => {
    const headerRow = this.closest('kyn-header-tr');
    if (headerRow && this.hasAttribute('stacked-child')) {
      this._updateGroupLabelDimensions();
    }
  };

  /**
   * MutationObserver for group attribute changes.
   * @ignore
   */
  private _groupAttrObserver?: MutationObserver;

  /**
   * ResizeObserver for the group label bar to react to text wrapping.
   * @ignore
   */
  private _groupLabelResizeObserver?: ResizeObserver;

  /**
   * Measures the total width of all kyn-th children in the same group
   * and sets CSS custom properties so the first child's label can span
   * across all sibling columns, centered.
   * @ignore
   */
  private _measureGroupSpanWidth() {
    const group = this.closest('kyn-th-group');
    if (!group) return;

    const siblings = Array.from(
      group.querySelectorAll(':scope > kyn-th')
    ) as HTMLElement[];
    let totalWidth = 0;
    siblings.forEach((el) => {
      totalWidth += el.getBoundingClientRect().width;
    });

    if (totalWidth > 0) {
      group.style.setProperty('--kyn-group-label-width', `${totalWidth}px`);
    }

    // Measure the label bar height for consistent spacing across all siblings
    const labelBar = this.shadowRoot?.querySelector(
      '.group-label-bar'
    ) as HTMLElement;
    if (labelBar) {
      const labelHeight = labelBar.getBoundingClientRect().height;
      // Set on parent group so all children inherit it
      group.style.setProperty('--kyn-group-label-height', `${labelHeight}px`);
    }
  }

  /**
   * Called by ResizeObserver when the host cell resizes (on viewport change).
   * Measures ALL group label heights in the same header row and applies
   * the maximum height to all groups, ensuring uniform row height.
   * rAF calls to ensure layout fully settles before measuring.
   * @ignore
   */
  private _updateGroupLabelDimensions() {
    const headerRow = this.closest('kyn-header-tr');
    if (!headerRow) return;

    // Find all groups in this header row
    const allGroups = Array.from(
      headerRow.querySelectorAll('kyn-th-group')
    ) as HTMLElement[];

    if (allGroups.length === 0) return;

    //Update widths for all groups
    requestAnimationFrame(() => {
      allGroups.forEach((grp) => {
        const siblings = Array.from(
          grp.querySelectorAll(':scope > kyn-th')
        ) as HTMLElement[];
        let totalWidth = 0;
        siblings.forEach((el) => {
          totalWidth += el.getBoundingClientRect().width;
        });
        if (totalWidth > 0) {
          grp.style.setProperty('--kyn-group-label-width', `${totalWidth}px`);
        }
      });
    });
  }

  /** Handle Resize Start
   * @ignore
   */
  private _handleResizeStart = (e: MouseEvent) => {
    if (!this.resizable) return;

    e.preventDefault();
    e.stopPropagation();

    this._isResizing = true;
    this._resizeStartX = e.clientX;
    this._resizeStartWidth = this.getBoundingClientRect().width;

    // Mark as resizing (hides sort icon, locks handle position)
    this.setAttribute('data-resizing', 'true');

    const table = this.closest('kyn-table') as any;
    if (table) {
      // Store table height to extend resize handle
      this._handleResizeHandleHeight(table);

      //  Lock ALL columns to their exact current widths - this freezes the layout completely
      this._lockAllColumnsExactly();

      // Force reflow to apply the lock immediately - prevents jump on first mousemove
      void this.offsetWidth;
    }

    // Add event listeners, when resize starts
    document.addEventListener('mousemove', this._handleResizeMove);
    document.addEventListener('mouseup', this._handleResizeEnd);
  };

  /** Handle Resize Move
   * @internal
   */
  private _handleResizeMove = (e: MouseEvent) => {
    if (!this._isResizing) return;

    e.preventDefault();

    // Check if cursor is still within table bounds
    const table = this.closest('kyn-table') as any;
    if (table) {
      const tableRect = table.getBoundingClientRect();
      const resizingColumnIndex = this._getColumnIndex();
      const headerRow = table.querySelector('kyn-header-tr');
      const columns = headerRow
        ? Array.from(headerRow.querySelectorAll('kyn-th'))
        : [];
      const isLastColumn = resizingColumnIndex === columns.length - 1;

      // If cursor moved outside table bounds, stop resize
      // Exception: Allow last column to expand right beyond table bounds
      if (
        e.clientX < tableRect.left ||
        (e.clientX > tableRect.right && !isLastColumn) ||
        e.clientY < tableRect.top ||
        e.clientY > tableRect.bottom
      ) {
        // End resize operation
        this._handleResizeEnd(e);
        return;
      }
    }

    const deltaX = e.clientX - this._resizeStartX;
    let newWidth = this._resizeStartWidth + deltaX;

    // Parse constraint values - minWidth takes precedence over resizeMinWidth
    const minWidthValue = this.minWidth
      ? this._parseConstraintValue(this.minWidth)
      : this._parseConstraintValue(this.resizeMinWidth);
    const maxWidthValue = this.maxWidth
      ? this._parseConstraintValue(this.maxWidth)
      : this._parseConstraintValue(this.resizeMaxWidth) || Infinity;

    // Apply constraints
    newWidth = Math.max(minWidthValue, Math.min(newWidth, maxWidthValue));

    // Update resize handle height as table height changes during drag
    if (table) {
      this._handleResizeHandleHeight(table);
    }

    // Apply width ONLY to the resized column - nothing else changes
    this._applyWidthToAllCells(newWidth);

    // Calculate table width = sum of all locked columns + new resized column width
    this._updateTableWidthFromSnapshot(newWidth);

    // Update group label dimensions during resize to prevent gaps
    if (this.hasAttribute('stacked-child')) {
      this._updateGroupLabelDimensions();
    }

    // Store the current resized column width for use in the debounced resize end handler
    this._resizedColumnWidth = newWidth;
  };

  /** @internal */
  private _debounceResize = debounce(() => {
    // Dispatch event with new column width
    this.dispatchEvent(
      new CustomEvent('on-column-resize', {
        bubbles: true,
        composed: true,
        detail: {
          columnIndex: this._getColumnIndex(),
          newWidth: `${this._resizedColumnWidth.toFixed(2)}px`,
        },
      })
    );
  });

  private _handleResizeHandleHeight(table: any) {
    const tableRect = table.getBoundingClientRect();
    this._tableHeightDuringResize = tableRect.height;

    // For stacked children, only extend handle if not overlapping with group label
    // to prevent flickering during resize - EXCEPT for the last column in the group
    let handleHeight = tableRect.height;
    if (this.hasAttribute('stacked-child')) {
      // Check if this is the last column in the stacked group
      const isLastInGroup = this.hasAttribute('stacked-child-last');

      // Allow full height for last column, constrain others to avoid flicker
      if (!isLastInGroup) {
        const groupLabelHeightStr = getComputedStyle(this).getPropertyValue(
          '--kyn-group-label-height'
        );
        const groupLabelHeight = parseFloat(groupLabelHeightStr) || 42;
        // Limit handle height to table height minus group label to avoid flicker
        handleHeight = Math.max(
          tableRect.height - groupLabelHeight,
          tableRect.height
        );
      }
    }

    this.style.setProperty('--kyn-resize-handle-height', `${handleHeight}px`);
  }

  /** Handle Resize End
   * @internal
   */
  private _handleResizeEnd = (e: MouseEvent) => {
    if (!this._isResizing) return;

    e.preventDefault();
    this._isResizing = false;
    this._tableHeightDuringResize = 0;
    this.style.removeProperty('--kyn-resize-handle-height');

    this._debounceResize(e);

    // Remove event listeners, when resize ends
    document.removeEventListener('mousemove', this._handleResizeMove);
    document.removeEventListener('mouseup', this._handleResizeEnd);

    // Remove resizing state (shows sort icon again)
    this.removeAttribute('data-resizing');
  };

  /**
   * Apply width to all header column cells based on the resized width.
   * @ignore
   */
  private _applyWidthToAllCells = (width: number) => {
    const widthStr = `${width}px`;

    // Apply width to this header cell only - body cells have their own styles
    this.style.width = widthStr;
    this.style.minWidth = widthStr;
    this.style.maxWidth = widthStr;
  };

  /**
   * Utility function to parse constraint values (min/max width) from string to number.
   * @ignore
   */
  private _parseConstraintValue = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const numValue = parseFloat(value);
    return numValue;
  };

  /**
   * Get the index of the current column when resize.
   * @ignore
   */
  private _getColumnIndex = (): number => {
    const parent = this.closest('kyn-header-tr');
    if (!parent) return -1;
    return Array.from(parent.querySelectorAll('kyn-th')).indexOf(this);
  };

  /**
   * Lock every column to its exact current width to prevent any layout shifts during resizing.
   * @ignore
   */
  private _lockAllColumnsExactly = () => {
    const table = this.closest('kyn-table') as any;
    if (!table) return;

    const headerRow = table.querySelector('kyn-header-tr');
    if (!headerRow) return;

    const columns = Array.from(headerRow.querySelectorAll('kyn-th'));

    // Lock EVERY column to exact pixel width to prevent layout shifts
    columns.forEach((col, index) => {
      const width = (col as HTMLElement).getBoundingClientRect().width;

      // Store the width for later calculation
      this._columnWidthsSnapshot.set(index, width);

      // Apply the lock immediately to prevent any layout shifts
      (col as any).style.width = `${width}px`;
      (col as any).style.minWidth = `${width}px`;
      (col as any).style.maxWidth = `${width}px`;
    });
  };

  /**
   *
   * @ignore
   */
  private _updateTableWidthFromSnapshot = (resizedColumnWidth: number) => {
    const table = this.closest('kyn-table') as any;
    if (!table) return;

    const resizingColumnIndex = this._getColumnIndex();

    // To updated table component width
    table.updateTableWidthFromResize(
      this._columnWidthsSnapshot,
      resizingColumnIndex,
      resizedColumnWidth
    );
  };

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

    // Show group-label-bar for ALL stacked children
    const isStacked = this.hasAttribute('stacked-child');

    return html`
      ${isStacked
        ? html`<div class="group-label-bar">
            ${this._groupLabel || html`&nbsp;`}
          </div>`
        : null}
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
            title=${this.assistiveResizeText}
            aria-label=${this.assistiveResizeText}
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
