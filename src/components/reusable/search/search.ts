import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import Styles from './search.scss?inline';
import '../textInput';
import '../button';
import searchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/search.svg';
import historyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/history.svg';
import { deepmerge } from 'deepmerge-ts';

const _defaultTextStrings = {
  searchSuggestions: 'Search suggestions.',
  noMatches: 'No matches found for',
  selected: 'Selected',
  found: 'Found',
  recentSearches: 'Recent searches',
};

/**
 * Search
 * @fires on-input - Emits the value on text input/clear.`detail:{ origEvent: InputEvent,value: string }`
 */
@customElement('kyn-search')
export class Search extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Input name. */
  @property({ type: String })
  accessor name = '';

  /** Label text. */
  @property({ type: String })
  accessor label = 'Search';

  /** Expandable style search. */
  @property({ type: Boolean })
  accessor expandable = false;

  /** Input value. */
  @property({ type: String })
  accessor value = '';

  /** Input & button size. */
  @property({ type: String })
  accessor size = 'md';

  /** Disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Auto-suggest array of strings that should match the current value. Update this array externally after on-input. */
  @property({ type: Array })
  accessor suggestions: Array<string> = [];

  /** Auto-suggest history array of strings. Update this array externally after on-input. */
  @property({ type: Array })
  accessor searchHistory: Array<string> = [];

  /** Expandable style search button description (Required to support accessibility). */
  @property({ type: String })
  accessor expandableSearchBtnDescription = '';

  /** Assistive text strings. */
  @property({ type: Object })
  accessor assistiveTextStrings = _defaultTextStrings;

  /** To show history searches in suggestion panel */
  @property({ type: Boolean })
  accessor enableSearchHistory = false;

  /**
   * Internal assistive text strings.
   * @internal
   * */
  @state()
  accessor _assistiveTextStrings = _defaultTextStrings;

  /**
   * Assistive text for screen readers.
   * @internal
   */
  @state()
  accessor _assistiveText = 'Search suggestions.';

  /** Input focused state.
   * @internal
   */
  @state()
  accessor _focused = false;

  /** Expanded state.
   * @internal
   */
  @state()
  accessor _expanded = false;

  /** Expanded state.
   * @internal
   */
  @query('kyn-text-input')
  accessor _textInput!: any;

  override render() {
    const classes = {
      search: true,
      expanded: this._expanded,
      expandable: this.expandable,
      focused: this._focused,
      'has-value': this.value !== '' || this.enableSearchHistory,
    };

    return html`
      <div class="${classMap(classes)}">
        <kyn-button
          kind="secondary"
          size=${this._buttonSizeMap()}
          description=${ifDefined(this.expandableSearchBtnDescription)}
          ?disabled=${this.disabled}
          @on-click=${this._handleButtonClick}
        >
          <span slot="icon">${unsafeSVG(searchIcon)}</span>
        </kyn-button>

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
          autoComplete="off"
          @keydown=${(e: any) => this.handleSearchKeydown(e)}
        >
          ${this.label}
          <span slot="icon">${unsafeSVG(searchIcon)}</span>
        </kyn-text-input>

        <div
          class="suggestions"
          @keydown=${(e: any) => this.handleListKeydown(e)}
        >
          ${(() => {
            const isSearchHistory =
              this.value === '' && this.enableSearchHistory;
            const listToRender = isSearchHistory
              ? this.searchHistory
              : this.suggestions;

            return html`
              ${isSearchHistory
                ? html`<div class="suggestion-title">
                    ${this.assistiveTextStrings.recentSearches}
                  </div>`
                : null}
              ${listToRender.map(
                (suggestion) => html`
                  <div
                    class="suggestion"
                    @click=${(e: any) =>
                      this._handleSuggestionClick(e, suggestion)}
                    @mouseup=${() =>
                      this._handleSuggestionWithMouseUp(suggestion)}
                    @mousedown=${(e: any) =>
                      this._handleSuggestionWithMouseDown(e)}
                  >
                    ${this._renderSuggestionContent(
                      suggestion,
                      isSearchHistory
                    )}
                  </div>
                `
              )}
            `;
          })()}
        </div>
        <div
          class="assistive-text"
          role="status"
          aria-live="assertive"
          aria-relevant="additions text"
        >
          ${this._assistiveText}
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

    if (this.enableSearchHistory) {
      this._expanded = true;
    }
  }

  private _handleButtonClick() {
    this._expanded = true;

    setTimeout(() => {
      this.shadowRoot?.querySelector('kyn-text-input')?.focus();
    }, 0);
  }

  private _handleInput(e: CustomEvent) {
    this.value = e.detail.value;
    this._focused = true;

    this._checkForMatchingSuggestions();

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

  private _handleSuggestionClick(e: any, suggestion: string) {
    if (e.type !== 'click') {
      this.value = suggestion;
      this._assistiveText = `${this._assistiveTextStrings.selected} ${this.value}`;
    }
  }

  private _handleSuggestionWithMouseUp(suggestion: string) {
    this.value = suggestion;
    this._assistiveText = `${this._assistiveTextStrings.selected} ${this.value}`;
    this.shadowRoot
      ?.querySelector('kyn-text-input')
      ?.setValueAndNotify(this.value);
    this._focused = false;
  }

  private _handleSuggestionWithMouseDown(e: any) {
    e.preventDefault();
  }

  private handleSearchKeydown(e: any) {
    e.stopPropagation();
    this.handleKeyboard(e, e.keyCode, 'input');
  }

  private handleListKeydown(e: any) {
    const TAB_KEY_CODE = 9;
    if (e.keyCode !== TAB_KEY_CODE) {
      e.preventDefault();
    }

    this.handleKeyboard(e, e.keyCode, 'list');
  }

  private handleKeyboard(e: any, keyCode: number, target: string) {
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
        e.preventDefault();
        const selectedValue = suggestionEls[highlightedIndex].innerText;
        this.shadowRoot
          ?.querySelector('kyn-text-input')
          ?.setValueAndNotify(selectedValue);
        if (target === 'input')
          this._assistiveText = `${this._assistiveTextStrings.selected} ${selectedValue}`;
        this._focused = false;
        this._expanded = false;
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
        this._assistiveText = `${this.suggestions[nextIndex]}`;
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
        this._assistiveText = `${this.suggestions[nextIndex]}`;
        return;
      }
      default: {
        return;
      }
    }
  }

  private _checkForMatchingSuggestions() {
    if (this.value === '') {
      this._assistiveText = this._assistiveTextStrings.searchSuggestions;
      return;
    }
    const Els: any = this.shadowRoot?.querySelectorAll('.suggestion');
    const suggestionEls: any = [...Els];
    const matchedOptionIndex = this.suggestions.findIndex((option) => {
      return option.toLowerCase().includes(this.value.toLowerCase());
    });
    suggestionEls.forEach((option: any) => {
      option.removeAttribute('highlighted');
    });
    if (matchedOptionIndex === -1) {
      this._assistiveText = `${this._assistiveTextStrings.noMatches} ${this.value}`;
      return;
    }
    suggestionEls[matchedOptionIndex].scrollIntoView({ block: 'nearest' });
    this._assistiveText = `${this._assistiveTextStrings.found} ${this.suggestions[matchedOptionIndex]}`;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('assistiveTextStrings')) {
      this._assistiveTextStrings = deepmerge(
        _defaultTextStrings,
        this.assistiveTextStrings
      );
    }
  }

  private _renderSuggestionContent(
    suggestion: string,
    isSearchHistory: boolean
  ) {
    const showHistoryIcon =
      isSearchHistory || this.searchHistory.includes(suggestion);

    const iconTemplate = showHistoryIcon
      ? html`<span style="display:flex">${unsafeSVG(historyIcon)}</span>`
      : null;

    if (isSearchHistory) {
      return html`
        <div class="suggestion-content">
          ${iconTemplate}
          <span>${suggestion}</span>
        </div>
      `;
    }

    const escapedValue = this.value
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const trailingSpace = this.value.endsWith(' ');

    const valueRegex = new RegExp(
      `(${escapedValue.replace(/\s+/g, '\\s+')})`,
      'ig'
    );

    if (!valueRegex.test(suggestion)) {
      return html`
        <div class="suggestion-content">
          ${iconTemplate}
          <span>${suggestion}</span>
        </div>
      `;
    }

    const result = [];
    let lastIndex = 0;

    suggestion.replace(valueRegex, (match, _p1, offset) => {
      if (offset > lastIndex) {
        const textBefore = suggestion.slice(lastIndex, offset);
        result.push(this._wrapTextWithSpaces(textBefore));
      }
      result.push(html`<span class="bold-text">${match}</span>`);
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < suggestion.length) {
      const textAfter = suggestion.slice(lastIndex);
      result.push(this._wrapTextWithSpaces(textAfter));
    }

    if (trailingSpace) {
      result.push(html`<span>&nbsp;</span>`);
    }

    return html`
      <div class="suggestion-content">
        ${iconTemplate}
        <span class="text-parts">${result}</span>
      </div>
    `;
  }

  private _wrapTextWithSpaces(text: string) {
    return html`${text
      .split(/(\s)/)
      .map((part) =>
        part === ' '
          ? html`<span>&nbsp;</span>`
          : html`<span class="light-text">${part}</span>`
      )}`;
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      setTimeout(() => {
        this._focused = false;
        if (this.value === '') {
          this._expanded = false;
        }
      }, 100);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', (e) => this._handleClickOut(e), true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', (e) => this._handleClickOut(e), true);
  }
}
