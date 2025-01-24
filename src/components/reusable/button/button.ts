/**
 * Copyright Kyndryl, Inc. 2023
 */

import { html, LitElement } from 'lit';
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
} from './defs';

import stylesheet from './button.scss';

/**
 * Button component.
 *
 * @slot unnamed - Slot for button text.
 * @slot icon - Slot for an icon.
 * @fires on-click - Emits the original click event.
 */
@customElement('kyn-button')
export class Button extends LitElement {
  static override styles = [stylesheet];

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
  internals = this.attachInternals();

  /** ARIA label for the button for accessibility. */
  @property({ type: String })
  description = '';

  /** Type for the &lt;button&gt; element. */
  @property({ type: String })
  type: BUTTON_TYPES = BUTTON_TYPES.BUTTON;

  /** Specifies the visual appearance/kind of the button. */
  @property({ type: String })
  kind: BUTTON_KINDS = BUTTON_KINDS.PRIMARY_APP;

  /** Converts the button to an &lt;a&gt; tag if specified. */
  @property({ type: String })
  href = '';

  /** Specifies the size of the button. */
  @property({ type: String })
  size: BUTTON_SIZES = BUTTON_SIZES.MEDIUM;

  /** Specifies the position of the icon relative to any button text. */
  @property({ type: String })
  iconPosition: BUTTON_ICON_POSITION = BUTTON_ICON_POSITION.CENTER;

  /** Determines if the button is disabled.
   * @internal
   */
  @state()
  iconOnly = false;

  /** Determines if the button is disabled. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Determines if the button indicates a destructive action. */
  @property({ type: Boolean, reflect: true })
  destructive = false;

  /** Determines if only the button outline is to be shown */
  @property({ type: Boolean, reflect: true })
  outlineOnly = false;

  /** Ghost style button */
  @property({ type: Boolean, reflect: true })
  ghost = false;

  /** Button value.  */
  @property({ type: String })
  value = '';

  /** Button name. */
  @property({ type: String })
  name = '';

  /** Determines if the button is Floatable */
  @property({ type: Boolean })
  isFloating = false;

  /** Show button after scrolling to 50% of the page*/
  @property({ type: Boolean })
  showOnScroll = false;

  /** Determines showButton state .
   * @internal
   */
  @state()
  _showButton = false;

  /** re-size button to 'medium' at mobile breakpoint.
   * @internal
   */
  @state()
  _reSizeBtn = false;

  /** Button formmethod.  */
  @property({ type: String })
  formmethod!: any;

  /** Queries default slot nodes.
   * @internal
   */
  @queryAssignedNodes()
  _slottedEls!: Array<any>;

  /** Queries icon slot nodes.
   * @internal
   */
  @queryAssignedElements({ slot: 'icon' })
  _iconEls!: Array<any>;

  /** Queries the .button element.
   * @internal
   */
  @query('.button')
  _btnEl!: any;

  override render() {
    const typeClassMap = {
      [BUTTON_KINDS.PRIMARY_APP]: 'primary-app',
      [BUTTON_KINDS.PRIMARY_WEB]: 'primary-web',
      [BUTTON_KINDS.SECONDARY]: 'secondary',
      [BUTTON_KINDS.TERTIARY]: 'tertiary',
    };

    const baseTypeClass = typeClassMap[this.kind];

    let classes = {
      'kd-btn--large': this.size === BUTTON_SIZES.LARGE,
      'kd-btn--small': this.size === BUTTON_SIZES.SMALL,
      'kd-btn--medium': this._reSizeBtn || this.size === BUTTON_SIZES.MEDIUM,
      'kd-btn--icon-align': !!this.iconPosition,
      [`kd-btn--icon-${this.iconPosition}`]:
        !!this.iconPosition && !this.iconOnly,
      [`kd-btn--icon-center`]: this._iconEls?.length && this.iconOnly,
      'icon-only': this._iconEls?.length && this.iconOnly,
      'btn-float': this.isFloating,
      'btn-hidden': this.showOnScroll && !this._showButton,
    };

    const getButtonClasses = () => {
      let cls = `kd-btn--${baseTypeClass}`;
      if (this.destructive || this.outlineOnly || this.ghost) {
        if (this.destructive) {
          if (this.outlineOnly) {
            cls = `kd-btn--${baseTypeClass}-destructive-outline`;
          } else {
            cls = `kd-btn--${baseTypeClass}-destructive`;
          }
        } else {
          if (this.outlineOnly) {
            cls = `kd-btn--${baseTypeClass}-outline`;
          } else if (this.ghost) {
            cls = `kd-btn--${baseTypeClass}-ghost`;
          } else {
            cls = `kd-btn--${baseTypeClass}`;
          }
        }
      }
      classes = { ...classes, [`${cls}`]: true };
      return classes;
    };

    const baseClasses = getButtonClasses();

    return html`
      ${this.href && this.href !== ''
        ? html`
            <a
              part="button"
              class=${classMap(baseClasses)}
              href=${this.href}
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
              class=${classMap(baseClasses)}
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
