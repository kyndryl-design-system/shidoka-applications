/**
 * Copyright Kyndryl, Inc. 2023
 */

import { html, LitElement } from 'lit';
import {
  property,
  state,
  customElement,
  queryAssignedElements,
} from 'lit/decorators.js';
import stylesheet from './accordion.scss';

/**
 * Accordion component.
 *
 * @slot unnamed - Holds Accordion Items (kyn-accordion-item) that make up the accordion
 *
 */
@customElement('kyn-accordion')
export class Accordion extends LitElement {
  static override styles = [stylesheet];

  /** Specifies whether to show numbers on the list items. */
  @property({ type: Boolean })
  showNumbers = false;

  /** Specifies the number to start at if the list has numbers. */
  @property({ type: Number })
  startNumber = 1;

  /** Specifies whether to show the accordion items with filled headers. */
  @property({ type: Boolean })
  filledHeaders = false;

  /** Display the accordion as compact or the default large size. */
  @property({ type: Boolean })
  compact = false;

  /** The string that displays on the toggle to expand all the accordion items. */
  @property({ type: String })
  expandLabel = 'Expand all items';

  /** The string that displays on the toggle to collapse all the accordion items. */
  @property({ type: String })
  collapseLabel = 'Collapse all items';

  /**
   * The state of the toggle controlling the "expand all" functionality
   * @ignore
   */
  @state() private _allOpenState = false;

  /** Slotted children kyn-accordion-item
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-accordion-item' })
  _accordionItems!: Array<any>;

  protected _handleSlotChange() {
    this._updateChildren();
    this._checkOpenItems();
  }

  override willUpdate(changedProps: any) {
    if (
      changedProps.has('filledHeaders') ||
      changedProps.has('compact') ||
      changedProps.has('startNumber') ||
      changedProps.has('showNumbers')
    ) {
      this._updateChildren();
    }
  }

  protected _updateChildren() {
    this._accordionItems?.forEach((item, index) => {
      item.setFilledHeader(this.filledHeaders);
      item.setCompact(this.compact);
      item.setIndex(this.startNumber + index);
      item.setShowNumbers(this.showNumbers);
    });
  }

  protected _openAllItems() {
    this._accordionItems?.map((item) => {
      item.open();
    });
  }

  protected _closeAllItems() {
    this._accordionItems?.map((item) => {
      item.close();
    });
  }

  private _toggleExpandAll() {
    if (this._allOpenState) {
      this._closeAllItems();
      this._allOpenState = false;
    } else {
      this._openAllItems();
      this._allOpenState = true;
    }
  }

  override render() {
    let itemContainerClasses = '';
    if (this.filledHeaders) itemContainerClasses += ' filled-headers';

    return html`
      <div class="kyn-accordion">
        <div class="toggle-container">
          <a href="javascript:void(0)" @click="${this._toggleExpandAll}">
            ${this._allOpenState ? this.collapseLabel : this.expandLabel}
          </a>
        </div>

        <div class="accordion-item-container${itemContainerClasses}">
          <slot @slotchange="${this._handleSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  private _handleToggle(e: any) {
    e.stopPropagation();
    this._checkOpenItems();
  }

  private _checkOpenItems() {
    const OpenItems = this._accordionItems.filter((item) => item.opened);
    const TotalItems = this._accordionItems.filter((item) => !item.disabled);

    this._allOpenState = OpenItems.length === TotalItems.length;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener('on-toggle', (e: any) => this._handleToggle(e));
  }

  override disconnectedCallback() {
    this.removeEventListener('on-toggle', (e: any) => this._handleToggle(e));

    super.disconnectedCallback();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-accordion': Accordion;
  }
}
