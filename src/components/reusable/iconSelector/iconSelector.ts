import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
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
 * @fires on-change - Emits when the checked state changes.
 *   `detail: { checked: boolean, value: string, origEvent: Event }`
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
   */
  @property({ type: Boolean })
  accessor onlyVisibleOnHover = false;

  /**
   * When true, checked items remain visible even when onlyVisibleOnHover is enabled.
   * Useful for showing users which items they've already favorited.
   */
  @property({ type: Boolean })
  accessor persistWhenChecked = false;

  /** Size of the icon: 'sm' (16px), 'md' (24px), or 'lg' (32px). */
  @property({ type: String, reflect: true })
  accessor size: 'sm' | 'md' | 'lg' = 'sm';

  override render() {
    const classes = {
      'icon-selector': true,
      'icon-selector--checked': this.checked,
      [`icon-selector--${this.size}`]: true,
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
   */
  private _handleHostClick = (e: Event) => {
    e.stopPropagation();
  };

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    // Manage host classes for CSS styling
    this.classList.toggle('only-visible-on-hover', this.onlyVisibleOnHover);
    this.classList.toggle('persist-when-checked', this.persistWhenChecked);
    this.classList.toggle('is-checked', this.checked);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleHostClick);
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
