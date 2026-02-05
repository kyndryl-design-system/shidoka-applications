import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedNodes,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import arrowUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-up.svg';
import styles from './table-header.scss?inline';

import { SORT_DIRECTION, TABLE_CELL_ALIGN, RESIZE_MIN_WIDTH } from './defs';

/**
 * `kyn-th` Web Component.
 *
 * Represents a custom table header cell (`<th>`) for Shidoka's design system tables.
 * Provides sorting functionality when enabled, allows alignment customization, and supports column resizing.
 *
 * @fires on-sort-changed - Dispatched when the sort direction is changed. `detail: {sortDirection: string, sortKey: string } `
 * @fires on-column-resize - Dispatched when a column is resized. `detail: { columnIndex: number, newWidth: string, columnHeader: TableHeader } `
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
   * Specifies if the column is resizable.
   * When enabled, users can drag the right edge of the column header to resize the column.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  accessor resizable = false;

  /**
   * Specifies the maximum width allowed when resizing the column.
   * Accepts standard CSS width values (e.g., '500px'). If not set, no maximum is enforced.
   * @type {string}
   */
  @property({ type: String })
  accessor resizeMaxWidth = '';

  /**
   * Specifies the minimum width allowed when resizing the column.
   * Accepts standard CSS width values (e.g., '50px'). Defaults to RESIZE_MIN_WIDTH constant.
   * @type {string}
   */
  @property({ type: String })
  accessor resizeMinWidth = RESIZE_MIN_WIDTH;

  /**
   * List of assigned nodes from the default slot.
   * @ignore
   */
  @queryAssignedNodes({ flatten: true })
  accessor listItems!: Array<Node>;

  /**
   * Resets the sorting direction of the component to its default state.
   * Useful for initializing or clearing any applied sorting on the element.
   */
  resetSort() {
    this.sortDirection = SORT_DIRECTION.DEFAULT;
  }

  /**
   * Internal state for tracking resize operations.
   * @ignore
   * @private
   */
  @state()
  private accessor _isResizing = false;

  /**
   * Stores the starting X position during resize operation.
   * @ignore
   * @private
   */
  private _resizeStartX = 0;

  /**
   * Stores the starting width before resize operation.
   * @ignore
   * @private
   */
  private _resizeStartWidth = 0;

  /**
   * Assistive text for screen readers.
   * @ignore
   */
  @state()
  accessor assistiveText = '';

  /**
   * Parses a CSS width value and returns the numeric value in pixels.
   * @param width - The width value (e.g., '150px', '100')
   * @returns The width in pixels as a number
   * @private
   */
  private _parseWidth(width: string): number {
    if (!width) return 0;
    return parseInt(width.replace(/[^0-9]/g, ''), 10) || 0;
  }

  /**
   * Gets the current width of the column header element.
   * @returns The width in pixels as a number
   * @private
   */
  private _getCurrentWidth(): number {
    return this.offsetWidth;
  }

  private _resizeStartTableWidth = 0;

  // private _hasResizeMoved = false;
  // private _lastClientX = 0;
  /**
   * Handles the start of a column resize operation.
   * Sets up the initial state for tracking the resize.
   * @param event - The mouse event
   * @private
   */
  private _handleResizeStart = (event: MouseEvent) => {
    if (!this.resizable) return;

    event.preventDefault();
    event.stopPropagation();

    this._isResizing = true;

    // this._hasResizeMoved = false;

    this._resizeStartX = event.clientX;

    // this._lastClientX = event.clientX;

    const rect = this.getBoundingClientRect();
    this._resizeStartWidth = rect.width;

    //Freeze external width into px
    this._applyWidth(this._resizeStartWidth);

    // FORCE layout flush so future reads are correct
    void this.offsetWidth;

    const table = this.closest('kyn-table') as HTMLElement;
    this._resizeStartTableWidth = table?.offsetWidth || 0;

    // 🔒 IMPORTANT: reset mouse baseline AFTER freeze
    // this._lastClientX = event.clientX;

    this._lockResizeCursor();

    document.addEventListener('mousemove', this._handleResizeMove);
    document.addEventListener('mouseup', this._handleResizeEnd);
    document.addEventListener('selectstart', this._preventSelection);
  };

  private _applyWidth(width: number) {
    const px = `${Math.round(width)}px`;
    this.width = px;

    this.style.setProperty('width', px, 'important');
    this.style.setProperty('min-width', px, 'important');
    this.style.setProperty('max-width', px, 'important');
  }

  private _lockResizeCursor() {
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  private _unlockResizeCursor() {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  /**
   * Handles the mouse move event during column resize.
   * Updates the column width based on mouse movement.
   * @param event - The mouse event
   * @private
   */
  private _handleResizeMove = (event: MouseEvent) => {
    if (!this._isResizing) return;

    if (event.clientX === this._resizeStartX) return;

    const deltaX = event.clientX - this._resizeStartX;

    if (deltaX === 0) return;

    // this._lastClientX = event.clientX;

    let newWidth = this._resizeStartWidth + deltaX;

    const min = this._parseWidth(this.resizeMinWidth);
    if (newWidth < min) newWidth = min;

    if (this.resizeMaxWidth) {
      const max = this._parseWidth(this.resizeMaxWidth);
      if (newWidth > max) newWidth = max;
    }
    // ✅ Column only
    this._applyWidth(newWidth);

    // ✅ Table only grows/shrinks by delta
    const table = this.closest('kyn-table') as HTMLElement;
    if (table && this._resizeStartTableWidth) {
      const tableWidth = this._resizeStartTableWidth + deltaX;
      table.style.setProperty('width', `${tableWidth}px`, 'important');
      table.style.setProperty('min-width', `${tableWidth}px`, 'important');
    }

    // Event stays the same (but now reliable)
    this.dispatchEvent(
      new CustomEvent('on-column-resize', {
        bubbles: true,
        composed: true,
        detail: {
          columnIndex: Array.from(
            this.parentElement?.querySelectorAll('kyn-th') || []
          ).indexOf(this),
          newWidth: `${Math.round(newWidth)}px`,
          deltaX: deltaX,
          columnHeader: this,
          source: 'resize',
        },
      })
    );
  };

  /**
   * Handles the end of a column resize operation.
   * Cleans up event listeners and resets the resizing state.
   * @param event - The mouse event
   * @private
   */
  private _handleResizeEnd = (event: MouseEvent) => {
    event.preventDefault();
    this._isResizing = false;

    // this._hasResizeMoved = false;

    this._unlockResizeCursor();

    document.removeEventListener('mousemove', this._handleResizeMove);
    document.removeEventListener('mouseup', this._handleResizeEnd);
    document.removeEventListener('selectstart', this._preventSelection);

    // // Update the table width only after resize is complete
    // this._updateTableWidth();
  };

  /**
   * Prevents text selection during resize operation.
   * @param event - The selection event
   * @private
   */
  private _preventSelection = (event: Event) => {
    if (this._isResizing) {
      event.preventDefault();
    }
  };

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

    // Attach resize handle listener after render
    if (this.resizable && changedProperties.has('resizable')) {
      const resizeHandle = this.shadowRoot?.querySelector(
        '.resize-handle'
      ) as HTMLElement;
      if (resizeHandle) {
        resizeHandle.addEventListener(
          'mousedown',
          this._handleResizeStart as EventListener
        );
      }
    }
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up resize handle listener
    const resizeHandle = this.shadowRoot?.querySelector(
      '.resize-handle'
    ) as HTMLElement;
    if (resizeHandle) {
      resizeHandle.removeEventListener(
        'mousedown',
        this._handleResizeStart as EventListener
      );
    }
    // Clean up any lingering event listeners
    document.removeEventListener(
      'mousemove',
      this._handleResizeMove as EventListener
    );
    document.removeEventListener(
      'mouseup',
      this._handleResizeEnd as EventListener
    );
    document.removeEventListener(
      'selectstart',
      this._preventSelection as EventListener
    );
  }

  getTextContent() {
    const nonWhitespaceNodes = this.listItems.filter((node) => {
      return (
        node?.nodeType !== Node.TEXT_NODE || node?.textContent?.trim() !== ''
      );
    });

    this.headerLabel = nonWhitespaceNodes[0]?.textContent || '';
  }

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
        class=${classMap({
          container: true,
          'is-resizing': this._isResizing,
        })}
        role=${ifDefined(role)}
        @click=${this.sortable && !this._isResizing
          ? () => this.toggleSortDirection()
          : undefined}
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

      <slot name="column-filter"> </slot>
      ${this.resizable
        ? html`<div
            class="resize-handle"
            title="Drag to resize column"
            aria-label="Resize column ${this.headerLabel}"
            role="slider"
            aria-valuenow=${this._getCurrentWidth()}
            aria-valuemin=${this._parseWidth(this.resizeMinWidth)}
            aria-valuemax=${this.resizeMaxWidth
              ? this._parseWidth(this.resizeMaxWidth)
              : 9999}
            tabindex="0"
          ></div>`
        : null}
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-th': TableHeader;
  }
}
