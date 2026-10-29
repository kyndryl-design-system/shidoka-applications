import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import './segmentedControlItem';
import { SegmentedControlItem } from './segmentedControlItem';
import { SEGMENTED_CONTROL_MAX_ITEMS, SEGMENTED_CONTROL_SIZES } from './defs';
import stylesheet from './segmentedControl.scss?inline';

/**
 * Segmented control. Shows up to five options in one track.
 * Each segment is as wide as the longest label.
 * Use `multiple` to allow more than one selected segment.
 * @slot unnamed - Slot for up to five `kyn-segmented-control-item` elements.
 * @fires on-change - Emits the original change event. `detail:{ origEvent: Event }`
 */
@customElement('kyn-segmented-control')
export class SegmentedControl extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** Segment size. `medium` or `small`. */
  @property({ type: String, reflect: true })
  accessor size: SEGMENTED_CONTROL_SIZES = SEGMENTED_CONTROL_SIZES.MEDIUM;

  /**
   * Allows more than one selected segment.
   */
  @property({ type: Boolean, reflect: true })
  accessor multiple = false;

  /**
   * Selected value. A string for single select, or a string array for multi select.
   */
  @property({ attribute: false })
  accessor value: string | string[] = '';

  /** `aria-label` for the control. Used for accessibility. */
  @property({ type: String })
  accessor description = 'Segmented control';

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-segmented-control-item' })
  accessor _assigned!: SegmentedControlItem[];

  /** @ignore */
  @state()
  accessor _items: SegmentedControlItem[] = [];

  /** @ignore */
  @state()
  accessor _focusItem: SegmentedControlItem | null = null;

  /** @ignore */
  @state()
  accessor _initialized = false;

  /** @ignore */
  @state()
  accessor _warnedMax = false;

  override render() {
    return html`
      <div
        class="track"
        role=${this.multiple ? 'group' : 'radiogroup'}
        aria-label=${ifDefined(this.description || undefined)}
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('on-segment-select', this._handleSegmentSelect);
    this.addEventListener(
      'on-segment-content-change',
      this._handleContentChange
    );
    this.addEventListener('keydown', this._handleKeydown);
    document.fonts?.ready.then(() => this._measure());
  }

  override disconnectedCallback() {
    this.removeEventListener('on-segment-select', this._handleSegmentSelect);
    this.removeEventListener(
      'on-segment-content-change',
      this._handleContentChange
    );
    this.removeEventListener('keydown', this._handleKeydown);
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('value') ||
      changed.has('multiple') ||
      changed.has('size')
    ) {
      this._applyToItems();
    }

    if (changed.has('size')) {
      this.updateComplete.then(() => this._measure());
    }
  }

  private _handleSlotChange() {
    const assigned = this._assigned ?? [];
    this._items = assigned.slice(0, SEGMENTED_CONTROL_MAX_ITEMS);
    assigned.forEach((item, index) => {
      item.suppressed = index >= SEGMENTED_CONTROL_MAX_ITEMS;
    });

    if (assigned.length > SEGMENTED_CONTROL_MAX_ITEMS && !this._warnedMax) {
      this._warnedMax = true;
      console.warn(
        `kyn-segmented-control supports a maximum of ${SEGMENTED_CONTROL_MAX_ITEMS} segments. Extra segments are hidden.`
      );
    }

    this._captureInitialValue();
    this._applyToItems();
    this.updateComplete.then(() => this._measure());
  }

  private _captureInitialValue() {
    if (this._initialized) return;
    this._initialized = true;

    if (this.multiple) {
      const current = this._selectedList();
      if (!current.length) {
        this.value = this._items
          .filter((item) => item.selected)
          .map((item) => item.value);
      }
      return;
    }

    if (!this.value) {
      const selected = this._items.find((item) => item.selected);
      if (selected) this.value = selected.value;
    }
  }

  private _applyToItems() {
    const enabled = this._enabledItems();
    let tabIndex = enabled.findIndex((item) => item === this._focusItem);
    if (tabIndex < 0)
      tabIndex = enabled.findIndex((item) => this._isSelected(item.value));
    if (tabIndex < 0) tabIndex = 0;

    this._items.forEach((item) => {
      item.size = this.size;
      item.multiple = this.multiple;
      item.selected = this._isSelected(item.value);
    });

    enabled.forEach((item, index) => item.setTabStop(index === tabIndex));
    this._items
      .filter((item) => !enabled.includes(item))
      .forEach((item) => item.setTabStop(false));
  }

  /** @internal */
  private _handleSegmentSelect = (event: Event) => {
    const item = event.target as SegmentedControlItem;
    if (
      !(item instanceof SegmentedControlItem) ||
      item.disabled ||
      item.suppressed
    ) {
      return;
    }

    event.stopPropagation();
    this._focusItem = item;
    this._commitValue(item.value);
    this._applyToItems();

    this.dispatchEvent(
      new CustomEvent('on-change', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          origEvent: event,
        },
      })
    );
  };

  /** @internal */
  private _handleContentChange = () => {
    this.updateComplete.then(() => this._measure());
  };

  /** @internal */
  private _handleKeydown = (event: KeyboardEvent) => {
    const key = event.key;
    if (
      ![
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(key)
    ) {
      return;
    }

    const items = this._enabledItems();
    if (!items.length) return;

    const path = event.composedPath();
    const index = items.findIndex((item) => path.includes(item));
    if (index < 0) return;

    event.preventDefault();
    let next = index;
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      next = (index + 1) % items.length;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      next = (index - 1 + items.length) % items.length;
    } else if (key === 'Home') {
      next = 0;
    } else if (key === 'End') {
      next = items.length - 1;
    }

    const nextItem = items[next];
    this._focusItem = nextItem;
    if (!this.multiple && nextItem.value !== this.value) {
      this._commitValue(nextItem.value);
      this.dispatchEvent(
        new CustomEvent('on-change', {
          bubbles: true,
          composed: true,
          detail: {
            value: this.value,
            origEvent: event,
          },
        })
      );
    }
    this._applyToItems();
    nextItem.focus();
  };

  private _commitValue(itemValue: string) {
    if (this.multiple) {
      const current = this._selectedList();
      const exists = current.includes(itemValue);
      this.value = exists
        ? current.filter((entry) => entry !== itemValue)
        : [...current, itemValue];
      return;
    }

    this.value = itemValue;
  }

  private _selectedList(): string[] {
    if (Array.isArray(this.value)) return this.value.map(String);
    if (typeof this.value === 'string' && this.value) return [this.value];
    return [];
  }

  private _isSelected(itemValue: string): boolean {
    if (this.multiple) return this._selectedList().includes(itemValue);
    return this.value === itemValue;
  }

  private _enabledItems(): SegmentedControlItem[] {
    return this._items.filter((item) => !item.suppressed && !item.disabled);
  }

  private async _measure() {
    await this.updateComplete;
    await Promise.all(this._items.map((item) => item.updateComplete));

    const widths = this._items
      .filter((item) => !item.suppressed)
      .map((item) => item.getNaturalWidth())
      .filter((width) => width > 0);

    if (!widths.length) return;

    const next = `${Math.max(...widths)}px`;
    if (this.style.getPropertyValue('--kyn-segment-width') !== next) {
      this.style.setProperty('--kyn-segment-width', next);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-segmented-control': SegmentedControl;
  }
}
