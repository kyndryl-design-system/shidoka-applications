import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './search.scss';
import '../textInput';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import searchIcon from '@carbon/icons/es/search/24';

/**
 * Search
 * @fires on-input - Emits the value on text input/clear.
 */
@customElement('kyn-search')
export class Search extends LitElement {
  static override styles = Styles;

  /** Input name. */
  @property({ type: String })
  name = '';

  /** Label text. */
  @property({ type: String })
  label = 'Search';

  /** Expandable style search. */
  @property({ type: Boolean })
  expandable = false;

  /** Input value. */
  @property({ type: String })
  value = '';

  /** Input & button size. */
  @property({ type: String })
  size = 'md';

  /** Disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Auto-suggest array of strings that should match the current value. Update this array externally after on-input. */
  @property({ type: Array })
  suggestions: Array<string> = [];

  /** Input focused state.
   * @internal
   */
  @state()
  _focused = false;

  /** Expanded state.
   * @internal
   */
  @state()
  _expanded = false;

  override render() {
    const classes = {
      search: true,
      expanded: this._expanded,
      expandable: this.expandable,
      focused: this._focused,
      'has-value': this.value !== '',
    };

    return html`
      <div class="${classMap(classes)}">
        <kd-button
          kind="secondary"
          size=${this._buttonSizeMap()}
          ?disabled=${this.disabled}
          @on-click=${this._handleButtonClick}
        >
          <kd-icon slot="icon" .icon=${searchIcon}></kd-icon>
        </kd-button>

        <kyn-text-input
          name=${this.name}
          type="search"
          placeholder=${this.label}
          hideLabel
          value=${this.value}
          size=${this.size}
          ?disabled=${this.disabled}
          @on-input=${(e: CustomEvent) => this._handleInput(e)}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @keydown=${(e: any) => this.handleSearchKeydown(e)}
        >
          ${this.label}
          <kd-icon slot="icon" .icon=${searchIcon}></kd-icon>
        </kyn-text-input>

        <div
          class="suggestions"
          @keydown=${(e: any) => this.handleListKeydown(e)}
        >
          ${this.suggestions.map(
            (suggestion) =>
              html`
                <div
                  class="suggestion"
                  @click=${() => this._handleSuggestionClick(suggestion)}
                >
                  ${suggestion}
                </div>
              `
          )}
        </div>
      </div>
    `;
  }

  private _buttonSizeMap() {
    switch (this.size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      case 'md':
      default:
        return 'medium';
    }
  }

  private _handleFocus() {
    this._focused = true;
  }

  private _handleBlur() {
    setTimeout(() => {
      this._focused = false;

      if (this.value === '') {
        this._expanded = false;
      }
    }, 100);
  }

  private _handleButtonClick() {
    this._expanded = true;

    setTimeout(() => {
      this.shadowRoot?.querySelector('kyn-text-input')?.focus();
    }, 0);
  }

  private _handleInput(e: CustomEvent) {
    this.value = e.detail.value;

    const Detail: any = {
      value: e.detail.value,
    };

    if (e.detail.origEvent) {
      Detail.origEvent = e.detail.origEvent;
    }

    const event = new CustomEvent('on-input', {
      detail: Detail,
    });
    this.dispatchEvent(event);
  }

  private _handleSuggestionClick(suggestion: string) {
    this.value = suggestion;
  }

  private handleSearchKeydown(e: any) {
    e.stopPropagation();

    this.handleKeyboard(e.keyCode);
  }

  private handleListKeydown(e: any) {
    const TAB_KEY_CODE = 9;

    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }

    this.handleKeyboard(e.keyCode);
  }

  private handleKeyboard(keyCode: number) {
    // const SPACEBAR_KEY_CODE = [0, 32];
    const ENTER_KEY_CODE = 13;
    const DOWN_ARROW_KEY_CODE = 40;
    const UP_ARROW_KEY_CODE = 38;

    // get highlighted element + index and selected element
    const Els: any = this.shadowRoot?.querySelectorAll('.suggestion');
    const suggestionEls: any = [...Els];
    const highlightedEl = suggestionEls.find((option: any) =>
      option.getAttribute('highlighted')
    );
    const highlightedIndex = highlightedEl
      ? suggestionEls.indexOf(highlightedEl)
      : 0;

    // prevent page scroll on spacebar press
    // if (SPACEBAR_KEY_CODE.includes(keyCode)) {
    //   e.preventDefault();
    // }

    switch (keyCode) {
      case ENTER_KEY_CODE: {
        // select highlighted option
        this.value = suggestionEls[highlightedIndex].innerText;
        return;
      }
      case DOWN_ARROW_KEY_CODE: {
        // go to next option
        const nextIndex = !highlightedEl
          ? 0
          : highlightedIndex === suggestionEls.length - 1
          ? 0
          : highlightedIndex + 1;

        suggestionEls[highlightedIndex].removeAttribute('highlighted');
        suggestionEls[nextIndex].setAttribute('highlighted', true);

        // scroll to option
        suggestionEls[nextIndex].scrollIntoView({ block: 'nearest' });
        return;
      }
      case UP_ARROW_KEY_CODE: {
        // go to previous option
        const nextIndex =
          highlightedIndex === 0
            ? suggestionEls.length - 1
            : highlightedIndex - 1;

        suggestionEls[highlightedIndex].removeAttribute('highlighted');
        suggestionEls[nextIndex].setAttribute('highlighted', true);

        // scroll to option
        suggestionEls[nextIndex].scrollIntoView({ block: 'nearest' });
        return;
      }
      default: {
        return;
      }
    }
  }
}
