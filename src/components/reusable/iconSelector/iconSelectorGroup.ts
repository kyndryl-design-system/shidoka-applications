import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import IconSelectorGroupScss from './iconSelectorGroup.scss?inline';

import type { IconSelector } from './iconSelector';

/**
 * Icon Selector Group - A container for managing multiple icon selectors with multi-select functionality.
 *
 * @fires on-change - Emits when any icon selector's state changes.
 *   `detail: { value: string[], origEvent: Event }`
 * @slot unnamed - Slot for icon-selector elements.
 */
@customElement('kyn-icon-selector-group')
export class IconSelectorGroup extends LitElement {
  static override styles = unsafeCSS(IconSelectorGroupScss);

  /** Selected values array. */
  @property({ type: Array })
  accessor value: string[] = [];

  /** Disabled state for all selectors. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Stack direction: 'vertical' or 'horizontal'. */
  @property({ type: String, reflect: true })
  accessor direction: 'vertical' | 'horizontal' = 'vertical';

  /**
   * When true, all child icon-selectors are only visible when the parent element is hovered.
   * This propagates the onlyVisibleOnHover attribute to all children.
   */
  @property({ type: Boolean, reflect: true })
  accessor onlyVisibleOnHover = false;

  /** Slotted icon selectors.
   * @internal
   */
  @state()
  private accessor _selectors: IconSelector[] = [];

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'on-change',
      this._handleChildChange as EventListener
    );
  }

  override disconnectedCallback() {
    this.removeEventListener(
      'on-change',
      this._handleChildChange as EventListener
    );
    super.disconnectedCallback();
  }

  override render() {
    return html`
      <div class="icon-selector-group icon-selector-group--${this.direction}">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  /**
   * @internal
   */
  private _handleSlotChange() {
    this._selectors = Array.from(
      this.querySelectorAll('kyn-icon-selector')
    ) as IconSelector[];
    this._syncChildrenState();
  }

  private _syncChildrenState() {
    this._selectors.forEach((selector) => {
      if (this.disabled) {
        selector.disabled = true;
      }
      if (this.onlyVisibleOnHover) {
        selector.onlyVisibleOnHover = true;
      }
      selector.checked = this.value.includes(selector.value);
    });
  }

  /**
   * @internal
   */
  private _handleChildChange = (e: CustomEvent) => {
    // Stop the child event from bubbling further
    e.stopPropagation();

    const { checked, value: selectorValue } = e.detail;
    let newValue = [...this.value];

    if (checked && !newValue.includes(selectorValue)) {
      newValue.push(selectorValue);
    } else if (!checked) {
      newValue = newValue.filter((v) => v !== selectorValue);
    }

    this.value = newValue;

    // Emit group change event
    this.dispatchEvent(
      new CustomEvent('on-change', {
        composed: true,
        detail: {
          value: this.value,
          origEvent: e,
        },
      })
    );
  };

  override updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('value') ||
      changedProperties.has('disabled') ||
      changedProperties.has('onlyVisibleOnHover')
    ) {
      this._syncChildrenState();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-icon-selector-group': IconSelectorGroup;
  }
}
