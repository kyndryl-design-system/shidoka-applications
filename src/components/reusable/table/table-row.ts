import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement, PropertyValues } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';

import styles from './table-row.scss';
import '../checkbox/checkbox';

import { TableExpandedRow } from './table-expanded-row';
import { TableCell } from './table-cell';
import { deepmerge } from 'deepmerge-ts';

const _defaultTextStrings = {
  expanded: 'Expanded',
  collapsed: 'Collapsed',
};

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

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'row';

  /** aria-disabled.
   * @internal
   */
  @property({ type: String, reflect: true })
  'aria-disabled' = 'false';

  /**
   * rowId: String - Unique identifier for the row.
   */
  @property({ type: String, reflect: true })
  rowId = '';

  /**
   * selected: Boolean indicating whether the row is selected.
   * Reflects the `selected` attribute.
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * checkboxSelection: Boolean indicating whether rows should be
   * selectable using checkboxes.
   */
  @property({ type: Boolean, reflect: true })
  checkboxSelection = false;

  /**
   * dense: Boolean indicating whether the table should be displayed
   * in dense mode.
   */
  @property({ type: Boolean })
  dense = false;

  /**
   * Unread row state.
   */
  @property({ type: Boolean })
  unread = false;

  /**
   * locked: Boolean indicating whether the row is locked.
   * If a row is selected before it is locked, it remains selected even after being locked.
   * A row can be selected and disabled/locked simultaneously.
   */
  @property({ type: Boolean, reflect: true })
  locked = false;

  /**
   * expandable: Boolean indicating whether the row is expandable.
   */
  @property({ type: Boolean, reflect: true })
  expandable = false;

  /**
   * expanded: Boolean indicating whether the row is expanded.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * disabled: Boolean indicating whether the row is disabled.
   * A disabled row is not allowed to have any user interactions.
   * A row can be selected and disabled/locked simultaneously.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * preventHighlight: Boolean indicating whether the row should not be highlighted.
   */
  @property({ type: Boolean, reflect: true })
  preventHighlight = false;

  /**
   * dimmed: Boolean indicating whether the row is dimmed.
   * A row should not be selected and dimmed simultaneously.
   */
  @property({ type: Boolean, reflect: true })
  dimmed = false;

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * @ignore
   */
  @queryAssignedElements()
  unnamedSlotEls!: Array<HTMLElement>;

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
   * Assistive text for screen readers.
   * @ignore
   */
  @state()
  assistiveText = '';

  /**
   * Updates the cell's dense and ellipsis properties when the context changes.
   * @param {TableContextType} context - The updated context.
   */
  handleContextChange = ({ checkboxSelection }: TableContextType) => {
    if (typeof checkboxSelection == 'boolean') {
      this.checkboxSelection = checkboxSelection;
    }
  };

  /**
   * Handles the change of selection state for a specific row.
   */
  handleRowSelectionChange(event: CustomEvent) {
    this.selected = event.detail.checked;
    // Emit the custom event with the selected row and its new state
    this.dispatchEvent(
      new CustomEvent('on-row-select', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override updated(changedProperties: PropertyValues) {
    // Reflect the expanded state to the next sibling expanded row
    if (changedProperties.has('expanded')) {
      const { expanded, nextElementSibling } = this;
      if (nextElementSibling?.matches('kyn-expanded-tr')) {
        (nextElementSibling as TableExpandedRow).expanded = expanded;
        (nextElementSibling as HTMLElement).style.display = expanded
          ? 'inherit'
          : 'none';
      }
    }

    // Reflect the disabled state to the tabindex attribute
    if (changedProperties.has('disabled')) {
      this['aria-disabled'] = this.disabled.toString();

      if (this.disabled) {
        this.setAttribute('tabindex', '-1');
      } else {
        this.removeAttribute('tabindex');
      }

      this.unnamedSlotEls.forEach((el) => {
        (el as TableCell).disabled = this.disabled;
      });
    }

    // A row can be selected and disabled/locked simultaneously.
    // However, a row should not be both selected and dimmed at the same time.
    if (changedProperties.has('dimmed') || changedProperties.has('selected')) {
      this.unnamedSlotEls.forEach((el) => {
        (el as TableCell).dimmed = this.dimmed && !this.selected;
      });
    }
  }

  _handleUserInitiatedToggleExpando(expanded = !this.expanded) {
    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        expanded,
      },
    };
    if (
      this.dispatchEvent(
        new CustomEvent('table-row-expando-beingtoggled', init)
      )
    ) {
      this.expanded = expanded;
      this.assistiveText = expanded
        ? this._textStrings.expanded
        : this._textStrings.collapsed;
      this.dispatchEvent(new CustomEvent('table-row-expando-toggled', init));
    }
  }

  private _handleExpanding() {
    this._handleUserInitiatedToggleExpando();
  }

  override render() {
    return html`
      ${this.expandable
        ? html`
            <kyn-td .align=${'center'} ?dense=${this.dense}>
              <div class="kyn--table-expand">
                <button
                  class="kyn--table-expand__button"
                  type="button"
                  ?disabled=${this.disabled}
                  title=${this.expanded
                    ? this._textStrings.expanded
                    : this._textStrings.collapsed}
                  aria-label=${this.expanded
                    ? this._textStrings.expanded
                    : this._textStrings.collapsed}
                  @click=${this._handleExpanding}
                >
                  <span slot="icon">${unsafeSVG(chevronDownIcon)}</span>
                </button>
              </div>

              <div
                class="assistive-text"
                role="status"
                aria-live="assertive"
                aria-relevant="additions text"
              >
                ${this.assistiveText}
              </div>
            </kyn-td>
          `
        : null}
      ${this.checkboxSelection
        ? html`
            <kyn-td .align=${'center'} ?dense=${this.dense}>
              <kyn-checkbox
                ?disabled=${this.disabled || this.locked}
                .checked=${this.selected}
                visiblyHidden
                @on-checkbox-change=${this.handleRowSelectionChange}
              >
                ${this.selected ? 'Deselect' : 'Select'} Row ${this.rowId}
              </kyn-checkbox>
            </kyn-td>
          `
        : null}
      <slot></slot>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-tr': TableRow;
  }
}
