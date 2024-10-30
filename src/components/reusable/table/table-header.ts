import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement, PropertyValues } from 'lit';
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

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'columnheader';

  /** Determines if the cell should have a denser layout. */
  @property({ type: Boolean, reflect: true })
  dense = false;

  /**
   * Context consumer for the table context.
   * Updates the cell's dense properties when the context changes.
   * @private
   * @ignore
   * @type {ContextConsumer<TableContextType, TableHeader>}
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
  align: TABLE_CELL_ALIGN = TABLE_CELL_ALIGN.LEFT;

  /**
   * Specifies if the column is sortable.
   * If set to true, an arrow icon will be displayed unpon hover,
   * allowing the user to toggle sort directions.
   */
  @property({ type: Boolean, reflect: true })
  sortable = false;

  /** Specifies the direction of sorting applied to the column. */
  @property({ type: String, reflect: true })
  sortDirection: SORT_DIRECTION = SORT_DIRECTION.DEFAULT;

  /**
   * The textual content associated with this component.
   * Represents the primary content or label that will be displayed.
   */
  @property({ type: String })
  headerLabel = '';

  /**
   * The unique identifier representing this column header.
   * Used to distinguish between different sortable columns and
   * to ensure that only one column is sorted at a time.
   */
  @property({ type: String })
  sortKey = '';

  /**
   * Determines whether the content should be hidden from visual view but remain accessible
   * to screen readers for accessibility purposes. When set to `true`, the content
   * will not be visibly shown, but its content can still be read by screen readers.
   * This is especially useful for providing additional context or information to
   * assistive technologies without cluttering the visual UI.
   */
  @property({ type: Boolean })
  visiblyHidden = false;

  /**
   * Sets a fixed width for the cell.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String, reflect: true })
  width = '';

  /**
   * Sets a maximum width for the cell; contents exceeding this limit will be truncated with ellipsis.
   * Accepts standard CSS width values (e.g., '150px', '50%').
   */
  @property({ type: String, reflect: true })
  maxWidth = '';

  /**
   * Sets a minimum width for the cell;
   * Accepts standard CSS width values (e.g., '150px', '50%').
   * @type {string}
   */
  @property({ type: String, reflect: true })
  minWidth = '';

  /**
   * @ignore
   */
  @queryAssignedNodes({ flatten: true })
  listItems!: Array<Node>;

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
  assistiveText = '';

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
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-th': TableHeader;
  }
}
