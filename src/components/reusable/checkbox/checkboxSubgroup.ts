import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import Styles from './checkboxSubgroup.scss';

/**
 * Checkbox subgroup
 * @slot unnamed - Slot for child kyn-checkboxes.
 * @slot parent - Slot for parent kyn-checkbox.
 */
@customElement('kyn-checkbox-subgroup')
export class CheckboxSubgroup extends LitElement {
  static override styles = Styles;

  /** @internal */
  @queryAssignedElements({ slot: 'parent', selector: 'kyn-checkbox' })
  _parent!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-checkbox' })
  _children: Array<any> = [];

  override render() {
    return html`
      <div class="toggle-button">
        <slot name="parent" @slotchange=${this._handleSlotchange}></slot>
        <div class="children">
          <slot @slotchange=${this._handleSlotchange}></slot>
        </div>
      </div>
    `;
  }

  private _handleSlotchange() {
    const CheckedBoxesCount = this._children.filter(
      (checkbox) => checkbox.checked
    ).length;

    this._syncParent(CheckedBoxesCount);
  }

  private _syncParent(count: number) {
    // sync Parent indeterminate state
    this._parent[0].indeterminate = count < this._children.length && count > 0;
  }

  private _handleCheckboxChange(e: any) {
    e.stopPropagation();

    const isParent = e
      .composedPath()
      .find(
        (el: HTMLElement) =>
          el.nodeName === 'SLOT' && el.getAttribute('name') === 'parent'
      );
    let checkedBoxesCount = this._children.filter(
      (checkbox) => checkbox.checked
    ).length;

    if (isParent) {
      checkedBoxesCount = e.detail.checked ? this._children.length : 0;
    } else {
      if (e.detail.checked) {
        checkedBoxesCount += 1;
      } else {
        checkedBoxesCount -= 1;
      }
    }

    this._syncParent(checkedBoxesCount);

    const ChildValues = this._children.map((checkbox) => {
      return checkbox.value;
    });

    const ParentChecked =
      this._children.length > 0 && checkedBoxesCount === this._children.length;

    const event = new CustomEvent('on-checkbox-subgroup-change', {
      bubbles: true,
      composed: true,
      detail: {
        isParent: isParent,
        parentChecked: ParentChecked,
        parentValue: this._parent[0].value,
        checked: e.detail.checked,
        value: e.detail.value,
        childValues: ChildValues,
      },
    });
    this.dispatchEvent(event);
  }

  override connectedCallback() {
    super.connectedCallback();

    // capture child checkboxes change event
    this.addEventListener('on-checkbox-change', (e: any) =>
      this._handleCheckboxChange(e)
    );
  }

  override disconnectedCallback() {
    this.removeEventListener('on-checkbox-change', (e: any) =>
      this._handleCheckboxChange(e)
    );

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox-subgroup': CheckboxSubgroup;
  }
}
