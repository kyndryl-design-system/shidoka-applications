import { LitElement, html, PropertyValues } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import { classMap } from 'lit/directives/class-map.js';
import downIcon from '@carbon/icons/es/chevron--down/24';

import {
  SPLIT_BTN_KINDS,
  SPLIT_BTN_SIZES,
  SPLIIT_BTN_ICON_POSITION,
} from './defs';
import './splitButtonOption';
import SplitButtonScss from './splitButton.scss';
import { ifDefined } from 'lit/directives/if-defined.js';

// 3 variants - Primary, scondary and destructive
// Reference carbon combo button
// size - same as button sizes
// separate pressed state - like carbon
// event - fire on both button click
// split arrow - on open / close menu item

/**
 * Split Button
 * @slot unnamed - Slot for split button options.
 * @slot icon - Slot for an icon (optional).
 * @fires on-change - Captures the event and emits the selected value and original event details.
 */

@customElement('kyn-split-btn')
export class SplitButton extends LitElement {
  static override styles = SplitButtonScss;

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** ARIA label for the button for accessibility. */
  @property({ type: String })
  description = '';

  /** Button name. */
  @property({ type: String })
  name = '';

  /** Specifies the visual appearance/kind of the split button. */
  @property({ type: String })
  kind: SPLIT_BTN_KINDS = SPLIT_BTN_KINDS.PRIMARY_APP;

  /** Specifies the size of the button. */
  @property({ type: String })
  size: SPLIT_BTN_SIZES = SPLIT_BTN_SIZES.MEDIUM;

  /** Specifies the position of the icon relative to any split button text. Default `'left'`. This is optional and work with icon slot.*/
  @property({ type: String })
  iconPosition: SPLIIT_BTN_ICON_POSITION = SPLIIT_BTN_ICON_POSITION.LEFT;

  /** Split button name (required) */
  @property({ type: String })
  label = '';

  /** Determines if the split button is disabled. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Determines if the split button indicates a destructive action. */
  @property({ type: Boolean, reflect: true })
  destructive = false;

  /** Menu CSS min-width value. */
  @property({ type: String })
  menuMinWidth = 'initial';

  @property({ type: Boolean })
  open = false;

  /**
   * Queries any slotted options.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-splitbutton-option' })
  options!: Array<any>;

  /**
   * Assistive text for screen readers.
   * @ignore
   */
  @state()
  assistiveText = 'Split button menu options.';

  override render() {
    const typeClassMap = {
      [SPLIT_BTN_KINDS.PRIMARY_APP]: 'primary-app',
      [SPLIT_BTN_KINDS.PRIMARY_WEB]: 'primary-web',
      [SPLIT_BTN_KINDS.SECONDARY]: 'secondary',
    };

    const baseTypeClass = typeClassMap[this.kind];
    const destructModifier = this.destructive ? '-destructive' : '';

    const classes = {
      button: true,
      [`kyn-split-btn--${baseTypeClass}${destructModifier}`]: true,
      [`kyn-split-btn--${baseTypeClass}`]: !this.destructive,
      'kyn-split-btn--large': this.size === SPLIT_BTN_SIZES.LARGE,
      'kyn-split-btn--small': this.size === SPLIT_BTN_SIZES.SMALL,
      'kyn-split-btn--medium': this.size === SPLIT_BTN_SIZES.MEDIUM,
      [`kyn-split-btn--icon-${this.iconPosition}`]: !!this.iconPosition,
    };

    return html`
      <div class="split-btn-wrapper ${this.open ? 'open' : ''}">
        <!-- label button UI -->
        <button
          class=${classMap({ ...classes, 'kyn-split-btn-label': true })}
          type="button"
          ?disabled=${this.disabled}
          aria-label=${ifDefined(this.description)}
          title=${ifDefined(this.description)}
          name=${ifDefined(this.name)}
          @click=${(e: Event) => this.handleClick(e)}
        >
          <span>
            ${this.label}
            <slot name="icon"></slot>
          </span>
        </button>
        <!-- menu button UI -->
        <button
          class=${classMap({
            ...classes,
            [`kyn-split-btn--${this.size}-arrow-btn`]: true,
            'kyn-split-btn-icon': true,
          })}
          type="button"
          ?disabled=${this.disabled}
          aria-label=${ifDefined(this.description)}
          title=${ifDefined(this.description)}
          aria-haspopup="true"
          aria-expanded="false"
          @click=${this.toggleDropdown}
          @keydown=${(e: any) => this.handleButtonKeydown(e)}
        >
          <span>
            <kd-icon class="arrow-icon" .icon=${downIcon}></kd-icon>
          </span>
        </button>
        <!-- Split Button Menu UI -->
        <ul
          class=${classMap({
            options: true,
            open: this.open,
          })}
          style="min-width: ${this.menuMinWidth};"
          aria-labelledby="label-${this.name}"
          name=${this.name}
          role="listbox"
          tabindex="0"
          aria-expanded=${this.open}
          aria-hidden=${!this.open}
          @keydown=${(e: any) => this.handleListKeydown(e)}
          @blur=${(e: any) => this.handleListBlur(e)}
        >
          <!-- Can put <kyn-splitbutton-option> component here for each option -->
          <slot id="children"></slot>
        </ul>
      </div>
    `;
  }

  //   override updated(changedProps: any) {}

  private handleListBlur(e: any) {
    this.options.forEach((option) => (option.highlighted = false));
    // don't blur if clicking an option inside
    if (
      e.relatedTarget &&
      e.relatedTarget.localName !== 'kyn-splitbutton-option'
    ) {
      this.open = false;
    }
    this.assistiveText = 'Split button menu options.';
  }

  private handleButtonKeydown(e: any) {
    this.handleKeyboard(e, e.keyCode, 'button');
  }

  private handleListKeydown(e: any) {
    const TAB_KEY_CODE = 9;
    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }
    this.handleKeyboard(e, e.keyCode, 'list');
  }

  private handleKeyboard(e: any, keyCode: number, target: string) {
    const SPACEBAR_KEY_CODE = [0, 32];
    const ENTER_KEY_CODE = 13;
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;
    const ESCAPE_KEY_CODE = 27;

    // get highlighted element + index and selected element
    const highlightedEl = this.options.find(
      (option: any) => option.highlighted
    );
    console.log(highlightedEl);
    const selectedEl = this.options.find((option: any) => option.selected);
    const highlightedIndex = highlightedEl
      ? this.options.indexOf(highlightedEl)
      : this.options.find((option: any) => option.selected)
      ? this.options.indexOf(selectedEl)
      : 0;

    // prevent page scroll on spacebar press
    if (SPACEBAR_KEY_CODE.includes(keyCode)) {
      e.preventDefault();
    }

    // open the listbox
    if (target === 'button') {
      const openDropdown =
        SPACEBAR_KEY_CODE.includes(keyCode) ||
        keyCode === ENTER_KEY_CODE ||
        keyCode == DOWN_ARROW_KEY_CODE ||
        keyCode == UP_ARROW_KEY_CODE;

      if (openDropdown) {
        this.open = true;
        this.options[highlightedIndex].highlighted = true;

        // scroll to highlighted option
        // if (!this.multiple && this.value !== '') {
        //   this.options[highlightedIndex].scrollIntoView({ block: 'nearest' });
        // }
      }
    }
    switch (keyCode) {
      case ENTER_KEY_CODE: {
        this.assistiveText = 'Selected an item.';
        return;
      }
      case DOWN_ARROW_KEY_CODE: {
        // go to next option
        let nextIndex =
          !highlightedEl && !selectedEl
            ? 0
            : highlightedIndex === this.options.length - 1
            ? 0
            : highlightedIndex + 1;

        // skip disabled options
        if (this.options[nextIndex].disabled) {
          nextIndex = nextIndex === this.options.length - 1 ? 0 : nextIndex + 1;
        }

        this.options[highlightedIndex].highlighted = false;
        this.options[nextIndex].highlighted = true;

        // scroll to option
        this.options[nextIndex].scrollIntoView({ block: 'nearest' });

        this.assistiveText = this.options[nextIndex].text;
        return;
      }
      case UP_ARROW_KEY_CODE: {
        // go to previous option
        let nextIndex =
          highlightedIndex === 0
            ? this.options.length - 1
            : highlightedIndex - 1;

        // skip disabled options
        if (this.options[nextIndex].disabled) {
          nextIndex = nextIndex === 0 ? this.options.length - 1 : nextIndex - 1;
        }

        this.options[highlightedIndex].highlighted = false;
        this.options[nextIndex].highlighted = true;

        // scroll to option
        this.options[nextIndex].scrollIntoView({ block: 'nearest' });

        this.assistiveText = this.options[nextIndex].text;
        return;
      }
      case ESCAPE_KEY_CODE: {
        // close listbox
        this.open = false;
        this.assistiveText = 'Split button menu options.';
        return;
      }
      default: {
        return;
      }
    }
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private toggleDropdown = () => {
    this.open = !this.open;
  };

  // When click outside, then menu close
  private _handleClickOut(e: Event): void {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }
  // handle child blur event
  private _handleBlur(e: any): void {
    const relatedTarget = e.detail.origEvent.relatedTarget;

    if (
      !relatedTarget ||
      (relatedTarget.localName !== 'kyn-splitbutton-option' &&
        relatedTarget.localName !== 'kyn-split-btn')
    ) {
      this.open = false;
    }
  }

  private _handleClick(e: any) {
    this.open = false;
    // emit selected value
    this.emitValue(e);
  }

  private emitValue(e: any) {
    const event = new CustomEvent('on-change', {
      detail: {
        value: e.detail.value,
        text: e.detail.text,
      },
    });
    this.dispatchEvent(event);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', (e) => this._handleClickOut(e));
    // capture split button options click event
    this.addEventListener('on-click', (e: any) => this._handleClick(e));
    // capture split button options blur event
    this.addEventListener('on-blur', (e: any) => this._handleBlur(e));
  }

  override disconnectedCallback(): void {
    document.removeEventListener('click', (e) => this._handleClickOut(e));
    this.addEventListener('on-click', (e: any) => this._handleClick(e));
    this.addEventListener('on-blur', (e: any) => this._handleBlur(e));
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-split-btn': SplitButton;
  }
}
