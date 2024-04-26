import { html, LitElement, PropertyValues } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import { tableContext, TableContextType } from './table-context';

import chevronDownIcon from '@carbon/icons/es/chevron--down/20';

import styles from './table-row.scss';
import '../checkbox/checkbox';

import { TableExpandedRow } from './table-expanded-row';
import { TableCell } from './table-cell';

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
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * @ignore
   */
  @queryAssignedElements()
  unnamedSlotEls!: Array<HTMLElement>;

  /**
   * Context consumer for the table context.
   * Updates the cell's dense and ellipsis properties when the context changes.
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

  override updated(changedProperties: PropertyValues) {
    // Reflect the expanded state to the next sibling expanded row
    if (changedProperties.has('expanded')) {
      const { expanded, nextElementSibling } = this;
      if (nextElementSibling?.matches('kyn-expanded-tr')) {
        (nextElementSibling as TableExpandedRow).expanded = expanded;
      }
    }

    // Reflect the disabled state to the tabindex attribute
    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this.setAttribute('tabindex', '-1');
      } else {
        this.removeAttribute('tabindex');
      }

      this.unnamedSlotEls.forEach((el) => {
        (el as TableCell).disabled = this.disabled;
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
                <kd-button
                  class="kyn--table-expand__button"
                  kind="tertiary"
                  type="button"
                  ?disabled=${this.disabled}
                  size="small"
                  iconPosition="center"
                  description="Expand row"
                  @on-click=${this._handleExpanding}
                >
                  <kd-icon slot="icon" .icon=${chevronDownIcon}></kd-icon>
                </kd-button>
              </div>
            </kyn-td>
          `
        : null}
      ${this.checkboxSelection
        ? html`
            <kyn-td .align=${'center'} ?dense=${this.dense}>
              <kyn-checkbox
                ?disabled=${this.disabled}
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
