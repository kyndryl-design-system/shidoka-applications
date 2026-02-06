import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import IconSelectorScss from './iconSelector.scss?inline';

import defaultUncheckedIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend.svg';
import defaultCheckedIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/recommend-filled.svg';

/**
 * Icon Selector - A checkbox-style toggle using icons for visual states.
 * Primarily designed for favorite/unfavorite functionality.
 *
 * @fires on-change - Emits when the checked state changes. Detail includes checked (boolean), value (string), and origEvent.
 * @slot icon-unchecked - Optional icon for unchecked state. Defaults to star outline.
 * @slot icon-checked - Optional icon for checked state. Defaults to filled star.
 */
@customElement('kyn-icon-selector')
export class IconSelector extends LitElement {
  static override styles = unsafeCSS(IconSelectorScss);

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Checked/selected state. */
  @property({ type: Boolean, reflect: true })
  accessor checked = false;

  /** Value associated with this selector, useful for identifying the item. */
  @property({ type: String })
  accessor value = '';

  /** Accessible label when checked. */
  @property({ type: String })
  accessor checkedLabel = 'Remove from favorites';

  /** Accessible label when unchecked. */
  @property({ type: String })
  accessor uncheckedLabel = 'Add to favorites';

  /** Disabled state. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /**
   * When true, the icon is only visible when the parent element is hovered.
   * Visibility is controlled via CSS on the parent component.
   * Can also be set via `--kyn-icon-selector-only-visible-on-hover: 1` on an ancestor.
   */
  @property({ type: Boolean, reflect: true })
  accessor onlyVisibleOnHover = false;

  /**
   * When true, checked items remain visible even when onlyVisibleOnHover is enabled.
   * Useful for showing users which items they've already favorited.
   * Can also be set via `--kyn-icon-selector-persist-when-checked: 1` on an ancestor.
   */
  @property({ type: Boolean })
  accessor persistWhenChecked = false;

  /**
   * Enables a subtle pop/crossfade animation when toggling checked state.
   * Can also be enabled for all descendants by setting the CSS custom property
   * `--kyn-icon-selector-animate-selection: 1` on any ancestor element.
   */
  @property({ type: Boolean })
  accessor animateSelection = false;

  /** @internal Resolved flags (prop OR inherited CSS custom property). */
  private _shouldAnimate = false;
  private _shouldOnlyVisibleOnHover = false;
  private _shouldPersistWhenChecked = false;

  override render() {
    const classes = {
      'icon-selector': true,
      'icon-selector--checked': this.checked,
      'only-visible-on-hover': this._shouldOnlyVisibleOnHover,
      'persist-when-checked': this._shouldPersistWhenChecked,
      'animate-selection': this._shouldAnimate,
    };

    const currentLabel = this.checked ? this.checkedLabel : this.uncheckedLabel;

    return html`
      <button
        type="button"
        class=${classMap(classes)}
        role="checkbox"
        aria-checked=${this.checked}
        aria-label=${currentLabel}
        title=${currentLabel}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <span class="icon icon--unchecked">
          <slot name="icon-unchecked">${unsafeSVG(defaultUncheckedIcon)}</slot>
        </span>
        <span class="icon icon--checked">
          <slot name="icon-checked">${unsafeSVG(defaultCheckedIcon)}</slot>
        </span>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled) return;

    e.preventDefault();
    e.stopPropagation();

    this.checked = !this.checked;
    this._emitChange(e);
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.checked = !this.checked;
      this._emitChange(e);
    }
  }

  private _emitChange(origEvent: Event) {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        bubbles: true,
        composed: true,
        detail: {
          checked: this.checked,
          value: this.value,
          origEvent,
        },
      })
    );
  }

  /**
   * Stop click events from bubbling up to parent elements (e.g., anchor tags).
   * This ensures clicking the icon-selector doesn't trigger navigation.
   * @internal
   */
  private _handleHostClick = (e: Event) => {
    e.stopPropagation();
  };

  override firstUpdated() {
    // Resolve again after first paint in case connectedCallback was too early.
    if (!this._cssResolved) {
      this._readCSSFlags();
      this._resolveFlags();
      this.requestUpdate();
    }
  }

  private _cssResolved = false;

  private _readCSSFlags() {
    const styles = getComputedStyle(this);
    const cssFlag = (prop: string) => {
      const val = styles.getPropertyValue(prop).trim();
      return val === '1' || val === 'true';
    };
    this._cssAnimate = cssFlag('--kyn-icon-selector-animate-selection');
    this._cssOnlyVisibleOnHover = cssFlag(
      '--kyn-icon-selector-only-visible-on-hover'
    );
    this._cssPersistWhenChecked = cssFlag(
      '--kyn-icon-selector-persist-when-checked'
    );
    this._cssResolved = true;
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    if (
      changedProps.has('animateSelection') ||
      changedProps.has('onlyVisibleOnHover') ||
      changedProps.has('persistWhenChecked')
    ) {
      this._resolveFlags();
    }
  }

  /** @internal Cached CSS custom property values (read once in firstUpdated). */
  private _cssAnimate = false;
  private _cssOnlyVisibleOnHover = false;
  private _cssPersistWhenChecked = false;

  private _resolveFlags() {
    this._shouldAnimate = this.animateSelection || this._cssAnimate;
    this._shouldOnlyVisibleOnHover =
      this.onlyVisibleOnHover || this._cssOnlyVisibleOnHover;
    this._shouldPersistWhenChecked =
      this.persistWhenChecked || this._cssPersistWhenChecked;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleHostClick);
    // Read CSS custom properties early so the first render has correct classes.
    // Prevents blink where icons are briefly visible before only-visible-on-hover applies.
    this._readCSSFlags();
    this._resolveFlags();
  }

  override disconnectedCallback() {
    this.removeEventListener('click', this._handleHostClick);
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-icon-selector': IconSelector;
  }
}
