import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  SEGMENTED_CONTROL_ICON_POSITION,
  SEGMENTED_CONTROL_SIZES,
} from './defs';
import stylesheet from './segmentedControlItem.scss?inline';

/**
 * One option inside `kyn-segmented-control`.
 * @slot unnamed - Slot for segment text.
 * @slot icon - Slot for an icon..
 * @fires on-segment-select - Emitted when the segment is activated. `detail:{ value: string }`
 */
@customElement('kyn-segmented-control-item')
export class SegmentedControlItem extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Segment value. */
  @property({ type: String })
  accessor value = '';

  /** Determines segment selection. */
  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  /** Disables the segment. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Icon placement relative to the label. `left` or `right`. */
  @property({ type: String, reflect: true })
  accessor iconPosition: SEGMENTED_CONTROL_ICON_POSITION =
    SEGMENTED_CONTROL_ICON_POSITION.LEFT;

  /**
   * Size copied from the parent control.
   * @internal
   */
  @property({ type: String })
  accessor size: SEGMENTED_CONTROL_SIZES = SEGMENTED_CONTROL_SIZES.MEDIUM;

  /**
   * Whether the parent allows more than one selected segment.
   * @internal
   */
  @property({ type: Boolean })
  accessor multiple = false;

  /**
   * Hides segments past the maximum of five. Safer check for future compatibility.
   * @internal
   */
  @property({ type: Boolean, reflect: true })
  accessor suppressed = false;

  /**
   * Whether the segment has an icon.
   * @internal
   */
  @state()
  accessor _hasIcon = false;

  /**
   * Whether the segment has label text.
   * @internal
   */
  @state()
  accessor _hasLabel = false;

  /**
   * Icon with no label text. Keeps a 64px minimum width.
   * @internal
   */
  @property({ type: Boolean })
  accessor iconOnly = false;

  /**
   * Tab index for the segment.
   * @internal
   */
  @state()
  accessor _tabIndex = 0;

  /**
   * The button element for the segment.
   * @internal
   */
  @query('.segment')
  accessor _button!: HTMLButtonElement;

  /**
   * Icon slot.
   * @internal
   */
  @query('slot[name="icon"]')
  accessor _iconSlot!: HTMLSlotElement;

  /**
   * Label slot.
   * @internal
   */
  @query('slot:not([name])')
  accessor _labelSlot!: HTMLSlotElement;

  override render() {
    return html`
      <button
        class=${classMap({
          segment: true,
          'segment--small': this.size === SEGMENTED_CONTROL_SIZES.SMALL,
        })}
        type="button"
        aria-label=${this.value}
        role=${this.multiple ? 'button' : 'radio'}
        aria-checked=${ifDefined(
          this.multiple ? undefined : String(this.selected)
        )}
        aria-pressed=${ifDefined(
          this.multiple ? String(this.selected) : undefined
        )}
        tabindex=${this._tabIndex}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <span>
          <slot name="icon" @slotchange=${this._handleIconSlotChange}></slot>
          <slot @slotchange=${this._handleLabelSlotChange}></slot>
        </span>
      </button>
    `;
  }

  /** Width of the label, icon, and padding, independent of the equalized segment width. */
  getNaturalWidth(): number {
    if (!this._button) return 0;

    const styles = getComputedStyle(this._button);
    const content = this._button.querySelector(':scope > span');
    const contentStyles = content ? getComputedStyle(content) : styles;
    const padding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const gap =
      this._hasIcon && this._hasLabel
        ? parseFloat(contentStyles.columnGap || contentStyles.gap)
        : 0;
    const safeGap = Number.isNaN(gap) ? 0 : gap;
    const width = Math.ceil(
      padding + safeGap + this._getIconWidth() + this._getLabelWidth()
    );

    return this.iconOnly ? Math.max(width, 64) : width;
  }

  private _getIconWidth(): number {
    if (!this._hasIcon) return 0;

    const iconEl = this._iconSlot?.assignedElements({
      flatten: true,
    })[0] as HTMLElement | undefined;
    if (iconEl) return iconEl.getBoundingClientRect().width;

    return this.size === SEGMENTED_CONTROL_SIZES.SMALL ? 14 : 16;
  }

  private _getLabelWidth(): number {
    if (!this._hasLabel || !this._labelSlot) return 0;

    let width = 0;
    for (const node of this._labelSlot.assignedNodes({ flatten: true })) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        width += (node as HTMLElement).scrollWidth;
      } else if (node.textContent?.trim()) {
        const range = document.createRange();
        range.selectNodeContents(node);
        width += range.getBoundingClientRect().width;
      }
    }

    return width;
  }

  /** @internal */
  setTabStop(active: boolean) {
    this._tabIndex = active ? 0 : -1;
  }

  override focus(options?: FocusOptions) {
    this._button?.focus(options);
  }

  private _handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this._hasIcon = this._slotHasContent(slot);
    this._syncIconOnly();
    this._notifyContentChange();
  }

  private _handleLabelSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this._hasLabel = this._slotHasContent(slot);
    this._syncIconOnly();
    this._notifyContentChange();
  }

  private _slotHasContent(slot: HTMLSlotElement) {
    return slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || !!node.textContent?.trim();
    });
  }

  private _syncIconOnly() {
    this.iconOnly = this._hasIcon && !this._hasLabel;
  }

  private _notifyContentChange() {
    this.dispatchEvent(
      new CustomEvent('on-segment-content-change', {
        bubbles: true,
      })
    );
  }

  private _handleClick() {
    if (this.disabled || this.suppressed) return;

    this.dispatchEvent(
      new CustomEvent('on-segment-select', {
        bubbles: true,
        detail: { value: this.value },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-segmented-control-item': SegmentedControlItem;
  }
}
