/**
 * Copyright Kyndryl, Inc. 2023
 */

import { html, LitElement, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedNodes,
  queryAssignedElements,
} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { debounce } from '../../../common/helpers/helpers';

import {
  BUTTON_KINDS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_ICON_POSITION,
  BUTTON_KINDS_SOLID,
  BUTTON_KINDS_OUTLINE,
} from './defs';

import stylesheet from './button.scss?inline';

/**
 * Button component.
 *
 * @slot unnamed - Slot for button text.
 * @slot icon - Slot for an icon.
 * @fires on-click - Emits the original click event.
 */
@customElement('kyn-button')
export class Button extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  accessor internals = this.attachInternals();

  /** ARIA label for the button for accessibility. */
  @property({ type: String })
  accessor description = '';

  /** Type for the &lt;button&gt; element. */
  @property({ type: String })
  accessor type: BUTTON_TYPES = BUTTON_TYPES.BUTTON;

  /** Specifies the visual appearance/kind of the button. */
  @property({ type: String })
  accessor kind: BUTTON_KINDS = BUTTON_KINDS.PRIMARY;

  /** Converts the button to an &lt;a&gt; tag if specified. */
  @property({ type: String })
  accessor href = '';

  /** Link target, only valid if href is supplied. */
  @property({ type: String })
  accessor target = '_self';

  /** Specifies the size of the button. */
  @property({ type: String })
  accessor size: BUTTON_SIZES = BUTTON_SIZES.MEDIUM;

  /** Specifies the position of the icon relative to any button text. */
  @property({ type: String })
  accessor iconPosition: BUTTON_ICON_POSITION = BUTTON_ICON_POSITION.CENTER;

  /** Determines if the button is disabled.
   * @internal
   */
  @state()
  accessor iconOnly = false;

  /** Determines if the button is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Button value.  */
  @property({ type: String })
  accessor value = '';

  /** Button name. */
  @property({ type: String })
  accessor name = '';

  /** Determines if the button is Floatable */
  @property({ type: Boolean })
  accessor isFloating = false;

  /** Show button after scrolling to 50% of the page */
  @property({ type: Boolean })
  accessor showOnScroll = false;

  /** Button selected state. */
  @property({ type: Boolean })
  accessor selected = false;

  /** Determines showButton state .
   * @internal
   */
  @state()
  accessor _showButton = false;

  /** re-size button to 'medium' at mobile breakpoint.
   * @internal
   */
  @state()
  accessor _reSizeBtn = false;

  /** Button formmethod.  */
  @property({ type: String })
  accessor formmethod!: any;

  /** Queries default slot nodes.
   * @internal
   */
  @queryAssignedNodes()
  accessor _slottedEls!: Array<any>;

  /** Queries icon slot nodes.
   * @internal
   */
  @queryAssignedElements({ slot: 'icon' })
  accessor _iconEls!: Array<any>;

  /** Queries the .button element.
   * @internal
   */
  @query('.button')
  accessor _btnEl!: any;

  /** Aligns button text and icon at the edges when `kyn-button` has a set width.*/
  @property({ type: Boolean })
  accessor fullWidth = false;

  /** Determines _hasIcon state
   * @internal
   */
  @state()
  accessor _hasIcon = false;

  /** Determines _hasText state
   * @internal
   */
  @state()
  accessor _hasText = false;

  override render() {
    const BtnClasses = {
      'kd-btn': true,
      [`kd-btn--${this.kind}`]: true,
      'kd-btn--solid-styles': BUTTON_KINDS_SOLID.includes(this.kind),
      'kd-btn--outline-styles': BUTTON_KINDS_OUTLINE.includes(this.kind),
      'kd-btn--large': this.size === BUTTON_SIZES.LARGE,
      'kd-btn--small': this.size === BUTTON_SIZES.SMALL,
      'kd-btn--medium': this._reSizeBtn || this.size === BUTTON_SIZES.MEDIUM,
      'kd-btn--icon-align': !!this.iconPosition,
      [`kd-btn--icon-${this.iconPosition}`]:
        !!this.iconPosition && !this.iconOnly,
      [`kd-btn--icon-center`]: this._iconEls?.length && this.iconOnly,
      'kd-btn--float': this.isFloating,
      'kd-btn--hidden': this.showOnScroll && !this._showButton,
      'icon-only': this._iconEls?.length && this.iconOnly,
      selected: this.selected,
      'kd-btn--fullWidth': this.fullWidth && this._hasIcon && this._hasText,
    };

    return html`
      ${this.href && this.href !== ''
        ? html`
            <a
              part="button"
              class=${classMap(BtnClasses)}
              href=${this.href}
              target=${this.target}
              ?disabled=${this.disabled}
              aria-label=${ifDefined(this.description)}
              title=${ifDefined(this.description)}
              @click=${(e: Event) => this.handleClick(e)}
            >
              <span>
                <slot @slotchange=${() => this._handleSlotChange()}></slot>
                <slot
                  name="icon"
                  @slotchange=${() => this._handleSlotChange()}
                ></slot>
              </span>
            </a>
          `
        : html`
            <button
              part="button"
              class=${classMap(BtnClasses)}
              type=${this.type}
              ?disabled=${this.disabled}
              aria-label=${ifDefined(this.description)}
              title=${ifDefined(this.description)}
              name=${ifDefined(this.name)}
              value=${ifDefined(this.value)}
              formmethod=${ifDefined(this.formmethod)}
              @click=${(e: Event) => this.handleClick(e)}
            >
              <span>
                <slot @slotchange=${() => this._handleSlotChange()}></slot>
                <slot
                  name="icon"
                  @slotchange=${() => this._handleSlotChange()}
                ></slot>
              </span>
            </button>
          `}
    `;
  }

  private handleClick(e: Event) {
    if (this.internals.form) {
      if (this.type === 'submit') {
        this.internals.form.requestSubmit();
      } else if (this.type === 'reset') {
        this.internals.form.reset();
      }
    }

    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private _testIconOnly() {
    if (!this._iconEls?.length) {
      return false;
    }

    const TextNodes = this._slottedEls?.filter((node: any) => {
      return node.textContent.trim() !== '';
    });

    const VisibleTextNodes = TextNodes.filter((node: any) => {
      if (node.tagName) {
        const Styles = getComputedStyle(node);
        return Styles.display !== 'none' && Styles.visibility !== 'hidden';
      } else {
        return true;
      }
    });

    return !VisibleTextNodes.length;
  }

  private _handleSlotChange() {
    this.iconOnly = this._testIconOnly();
    this._hasIcon = !!this._iconEls?.length;

    const TextNodes = this._slottedEls?.filter((node: any) => {
      return node.textContent.trim() !== '';
    });
    this._hasText = TextNodes.length > 0;
    this.requestUpdate();
  }

  /** @internal */
  private _debounceResize = debounce(() => {
    this._reSizeButton();
    this.iconOnly = this._testIconOnly();
  });

  /** @internal */
  private _reSizeButton() {
    // Resize button to medium at mobile breakpoint
    if ((this.isFloating || this.showOnScroll) && window.innerWidth <= 672) {
      this._reSizeBtn = true;
    } else {
      this._reSizeBtn = false;
    }
  }

  /** @internal */
  private _debounceScroll = debounce(() => {
    if (this.showOnScroll) {
      this._handleScroll();
    }
  });

  /** @internal */
  private _handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    // Show the button if scrolled 50% of the page
    this._showButton = scrollPosition > (pageHeight - windowHeight) / 2;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._debounceResize);
    if (this.showOnScroll) {
      window.addEventListener('scroll', this._debounceScroll);
    }
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this._debounceResize);
    if (this.showOnScroll) {
      window.removeEventListener('scroll', this._debounceScroll);
    }
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-button': Button;
  }
}
