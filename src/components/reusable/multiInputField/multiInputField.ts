import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { FormMixin } from '../../../common/mixins/form-input';
import {
  isValidInput,
  defaultTextStrings,
  validateAllTags,
  processTagsFromValue,
  updateInvalidIndexesAfterRemoval,
} from '../../../common/helpers/multiInputValidationsHelper';

import '../tag';

import MultiInputScss from './multiInputField.scss?inline';

import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';

/**
 * Multi-input field component.
 * @slot unnamed - Slot for tag icon.
 * @fires on-input – emits { value, origEvent } on every keystroke
 * @fires on-change – emits string[] after tags are added/removed
 * @prop {string[]} customSuggestions - Optional array of custom suggestions to use instead of the default mock data
 */

@customElement('kyn-multi-input-field')
export class MultiInputField extends FormMixin(LitElement) {
  static override styles = unsafeCSS(MultiInputScss);

  /** Label text. */
  @property({ type: String })
  accessor label = '';

  /** Helper or error caption. */
  @property({ type: String })
  accessor caption = '';

  /** Sets input type to either email or default. */
  @property({ type: String })
  accessor inputType: 'email' | 'default' = 'default';

  /** Makes field required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Placeholder text. */
  @property({ type: String })
  accessor placeholder = '';

  /** Disable the textarea. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Read‐only mode. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Hide visible label (for screen‐reader only). */
  @property({ type: Boolean })
  accessor hideLabel = false;

  /** Whether automatic suggestion is active. */
  @property({ type: Boolean })
  accessor autoSuggestionDisabled = false;

  /** Disable all validations. */
  @property({ type: Boolean })
  accessor validationsDisabled = false;

  /** Custom suggestions data to override default mock data for type-ahead functionality. */
  @property({ type: Array })
  accessor customSuggestions: string[] = [];

  /** Maximum number of tags allowed. */
  @property({ type: Number })
  accessor maxItems: number | undefined = undefined;

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = defaultTextStrings;

  /** Suppress any tag icon (even on email). */
  @property({ type: Boolean })
  accessor hideIcon = false;

  /** Pattern attribute for the input element. */
  @property({ type: String })
  accessor pattern: string | undefined = undefined;

  /** Merged internal text strings.
   * @internal
   */
  private get _textStrings() {
    return { ...defaultTextStrings, ...this.textStrings };
  }

  /** Entered tags.
   * @internal
   */
  @state()
  private accessor _items: string[] = [];

  /** Indexes of invalid items in `_items`.
   * @internal
   */
  @state()
  private accessor _invalids = new Set<number>();

  /** Current type-ahead suggestions.
   * @internal
   */
  @state()
  private accessor suggestions: string[] = [];

  /** Whether the suggestion panel is expanded.
   * @internal
   */
  @state()
  private accessor _expanded = false;

  /** Currently highlighted suggestion index.
   * @internal
   */
  @state()
  private accessor highlightedIndex = -1;

  /** Inline 'top' style for suggestions (px)
   * @internal
   */
  @state()
  private accessor _suggestionTop = '0px';

  /** Inline 'left' style for suggestions (px).
   * @internal
   */
  @state()
  private accessor _suggestionLeft = '0px';

  /** Displayed validation message.
   * @internal
   */
  @state()
  private accessor _validationMessage = '';

  /** Store the slotted icon SVG string.
   * @internal
   */
  @state()
  private accessor _iconSvg = '';

  /** Whether to use the icon.
   * @internal
   */
  @state()
  private accessor _useIcon = false;

  /** Container wrapper for relative positioning
   * @ignore
   */
  @query('.container')
  private accessor _containerEl!: HTMLElement;

  /** The `<input>` element.
   * @ignore
   */
  @query('input')
  private accessor inputEl!: HTMLInputElement;

  /** Mock database of emails to simulate type-ahead suggestions.
   * @ignore
   */
  private static _mockDb: string[] = [
    'alice@example.com',
    'bob.smith@example.com',
    'charlie@example.org',
    'someone@acme.com',
    'evan@example.net',
    'frank@example.io',
    'example@email.com',
    'john.doe@email.com',
    'suzy.example@email.com',
  ];

  private renderLabel() {
    return html`
      <label
        class="label-text ${this.hideLabel ? 'sr-only' : ''}"
        for=${this.name}
      >
        ${this.required
          ? html`<abbr
              class="required"
              title=${this._textStrings.requiredText}
              role="img"
              aria-label=${this._textStrings.requiredText}
              >*</abbr
            >`
          : null}
        ${this.label}
        <slot name="tooltip"></slot>
      </label>
    `;
  }

  private renderTag(item: string, index: number) {
    const isInvalid =
      !this.validationsDisabled &&
      !isValidInput(item, this.inputType, this.pattern);

    const isOverLimit =
      !this.validationsDisabled &&
      this.maxItems !== undefined &&
      index >= this.maxItems;

    const firstIndex = this._items.indexOf(item);
    const isDuplicate = !this.validationsDisabled && firstIndex !== index;

    const tagColor = isInvalid || isOverLimit || isDuplicate ? 'red' : 'spruce';

    const showIcon =
      !this.hideIcon && (this._useIcon || this.inputType === 'email');
    const iconSvg = this._iconSvg || userIcon;

    return html`
      <kyn-tag
        class="indiv-tag"
        tagColor=${tagColor}
        noTruncation
        ?clickable=${!this.readonly && !this.disabled}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        @on-close=${() => this.removeAt(index)}
      >
        ${showIcon ? html`${unsafeSVG(iconSvg)}` : ''}
        <span>${item}</span>
      </kyn-tag>
    `;
  }

  private renderInput(stateMgmtClasses: any, placeholderText: string) {
    return html`
      <input
        class="${classMap({
          ...stateMgmtClasses,
        })}"
        type=${this.inputType === 'email' ? 'email' : 'text'}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        name=${ifDefined(this.name || undefined)}
        id=${ifDefined(this.name || undefined)}
        placeholder=${ifDefined(placeholderText)}
        pattern=${ifDefined(this.pattern)}
        @focus=${() => this._handleFocus()}
        @blur=${() => {
          this._validateAllTags();
          this._handleBlur();
        }}
        @input=${(e: InputEvent) => this.handleInput(e)}
        @paste=${(e: ClipboardEvent) => this.handlePaste(e)}
        @keydown=${(e: KeyboardEvent) => this.onKeydown(e)}
      />
    `;
  }

  private renderTagsAndInput(stateMgmtClasses: any, placeholderText: string) {
    return html`
      <div
        class="${classMap({ container: true, ...stateMgmtClasses })}"
        @click=${() => this.inputEl.focus()}
        ?invalid=${this._isInvalid}
        aria-invalid=${this._isInvalid}
        aria-describedby=${ifDefined(this._isInvalid ? 'error' : undefined)}
      >
        <kyn-tag-group
          class="tag-group"
          ?filter=${!this.readonly && !this.disabled}
        >
          ${this._items.map((item, i) => this.renderTag(item, i))}
          ${this.renderInput(stateMgmtClasses, placeholderText)}
        </kyn-tag-group>

        ${this.renderSuggestions()}
      </div>
    `;
  }

  private renderSuggestions() {
    if (this.autoSuggestionDisabled) return null;
    const query = this.inputEl?.value.trim() || '';
    return html`
      <div
        class="suggestions"
        role="listbox"
        style="top: ${this._suggestionTop}; left: ${this._suggestionLeft};"
        ?hidden=${!this._expanded}
      >
        ${query && this.suggestions.length === 0
          ? html`<div class="no-suggestions">
              ${this._textStrings.noSuggestionsMsg}
            </div>`
          : this.suggestions.map(
              (sugg, idx) => html`
                <div
                  class=${classMap({
                    suggestion: true,
                    highlighted: idx === this.highlightedIndex,
                  })}
                  role="option"
                  aria-selected=${idx === this.highlightedIndex}
                  @mousedown=${(e: MouseEvent) => e.preventDefault()}
                  @click=${() => this._selectSuggestion(sugg)}
                >
                  ${sugg}
                </div>
              `
            )}
      </div>
    `;
  }

  private renderCaptionAndError(error: boolean, validCount: number) {
    return html`
      <div class="caption-count-container">
        <div>
          ${this.caption
            ? html`<div class="caption" aria-disabled=${this.disabled}>
                ${this.caption}
              </div>`
            : null}
          ${error
            ? html`<div id="error" class="error">
                <span role="img" class="error-icon" aria-label="error">
                  ${unsafeSVG(errorIcon)}
                </span>
                ${this._validationMessage}
              </div>`
            : null}
        </div>
        ${this.maxItems
          ? html`<div class="validated-count" disabled=${this.disabled}>
              ${validCount}/${this.maxItems}
            </div>`
          : null}
      </div>
    `;
  }

  override render() {
    const error = this._isInvalid;

    const stateMgmtClasses = {
      disabled: this.disabled,
      'is-readonly': this.readonly,
      'error-state': error,
    };
    const validCount = this.validationsDisabled
      ? this._items.length
      : this._items.filter((item: string) =>
          isValidInput(item, this.inputType, this.pattern)
        ).length;
    const hasValidItem = this._items.some((item) =>
      isValidInput(item, this.inputType, this.pattern)
    );
    const placeholderText = hasValidItem
      ? this._textStrings.placeholderSecondary
      : this.placeholder;

    return html`
      <div style="display: none">
        <slot></slot>
      </div>

      <div ?disabled=${this.disabled} ?readonly=${this.readonly}>
        ${this.renderLabel()}
        ${this.renderTagsAndInput(stateMgmtClasses, placeholderText)}
        ${this.renderCaptionAndError(error, validCount)}
      </div>
    `;
  }

  override updated(_changed: Map<string, any>) {
    this._validateAllTags();

    this.value = this._items.join(', ');
    this._internals.setFormValue(this.value);

    if (this._internals.form) {
      this._internals.form.setAttribute(`data-${this.name}-items`, 'true');
      (this._internals.form as any)[`${this.name}Items`] = [...this._items];
    }
  }

  override willUpdate(changed: Map<string, any>) {
    if (changed.has('value') && typeof this.value === 'string') {
      const newVal = this.value.trim();
      const currentVal = this._items.join(', ');
      if (newVal !== currentVal) {
        const hasComma = newVal.includes(',');
        if (hasComma) {
          const itemsFromValue = newVal
            .split(',')
            .map((item: string) => item.trim())
            .filter(Boolean);
          if (itemsFromValue.length > 0) {
            this._items = itemsFromValue;
          }
        } else {
          this._items = [newVal];
        }
      }
    }
  }

  override firstUpdated(): void {
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name])'
    ) as HTMLSlotElement;
    if (slot) {
      const assigned = slot.assignedNodes({ flatten: true });
      const iconNode = assigned.find(
        (n) => n.nodeType === Node.ELEMENT_NODE
      ) as Element | undefined;

      if (iconNode && iconNode.outerHTML.trim().startsWith('<svg')) {
        this._useIcon = true;
        this._iconSvg = iconNode.outerHTML;
      } else if (this.inputType === 'email') {
        this._useIcon = true;
        this._iconSvg = userIcon;
      } else {
        this._useIcon = false;
        this._iconSvg = '';
      }
    }

    if (this._items.length > 0) {
      if (this.inputEl && this.inputEl.value) {
        this.inputEl.value = '';
      }
      this._validateAllTags();
    }
  }

  private handleInput(e: InputEvent) {
    if (this.readonly) return;
    const inputValue = (e.target as HTMLInputElement).value;

    this._validate(true);
    this._expanded = true;
    this.dispatchEvent(
      new CustomEvent('on-input', {
        detail: { value: inputValue, origEvent: e },
      })
    );
    this._fetchSuggestions();
  }

  private _handleFocus() {
    this._expanded = true;
    this.highlightedIndex = -1;
  }

  private _handleBlur() {
    setTimeout(() => {
      this._expanded = false;
    }, 100);
  }

  private async _fetchSuggestions() {
    const query = this.inputEl.value.trim();
    if (!query) {
      this.suggestions = [];
      return;
    }
    this.suggestions = await this._queryEmails(query);
    this.highlightedIndex = -1;

    this._updateSuggestionPosition();
  }

  private async _queryEmails(query: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.inputType !== 'email') {
      return [];
    }

    const dataSource = this.customSuggestions || MultiInputField._mockDb;

    const lower = query.toLowerCase();
    return dataSource.filter((item) => item.toLowerCase().includes(lower));
  }

  private _selectSuggestion(suggestion: string) {
    const result = processTagsFromValue(
      suggestion,
      this._items,
      this.maxItems,
      this.validationsDisabled,
      this._textStrings,
      this.inputType,
      this.pattern
    );

    if (result.hasError) {
      const state = { ...this._internals.validity, ...result.validationState };
      this._validationMessage = result.validationMessage;
      this._internals.setValidity(
        state,
        result.validationMessage,
        this.inputEl
      );

      this.suggestions = [];
      this._expanded = false;
      this.inputEl.focus();
      return;
    }

    this._items = [...this._items, suggestion];

    const invalidSet =
      this._invalids instanceof Set
        ? new Set(this._invalids)
        : new Set<number>(this._invalids as unknown as number[]);

    if (!this.validationsDisabled) {
      if (!isValidInput(suggestion, this.inputType, this.pattern)) {
        invalidSet.add(this._items.length - 1);
      }
    }

    this._invalids = invalidSet;
    this._validateAllTags();

    this.suggestions = [];
    this._expanded = false;
    this.inputEl.value = '';

    this.dispatchEvent(
      new CustomEvent<string[]>('on-change', { detail: this._items })
    );

    this.inputEl.focus();
    this._expanded = true;
    this._fetchSuggestions();
  }

  private handleSuggestionNavigation(e: KeyboardEvent): boolean {
    if (!this._expanded || this.suggestions.length === 0) {
      return false;
    }

    const { key } = e;
    const UP = 'ArrowUp';
    const DOWN = 'ArrowDown';
    const ENTER = 'Enter';
    const HOME = 'Home';
    const END = 'End';
    const PGUP = 'PageUp';
    const PGDN = 'PageDown';
    const TAB = 'Tab';

    if (![UP, DOWN, ENTER, HOME, END, PGUP, PGDN, TAB].includes(key)) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();

    if (key === TAB) {
      if (this.highlightedIndex === -1 && this.suggestions.length > 0) {
        this.highlightedIndex = 0;
      } else if (this.highlightedIndex >= 0) {
        this._selectSuggestion(this.suggestions[this.highlightedIndex]);
      }
    } else if (key === DOWN) {
      if (this.highlightedIndex === this.suggestions.length - 1) {
        this.highlightedIndex = 0;
      } else {
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          this.suggestions.length - 1
        );
      }
    } else if (key === UP) {
      if (this.highlightedIndex === 0) {
        this.highlightedIndex = this.suggestions.length - 1;
      } else {
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      }
    } else if (key === HOME || key === PGUP) {
      this.highlightedIndex = 0;
    } else if (key === END || key === PGDN) {
      this.highlightedIndex = this.suggestions.length - 1;
    } else if (key === ENTER && this.highlightedIndex >= 0) {
      this._selectSuggestion(this.suggestions[this.highlightedIndex]);
    }

    this.updateComplete.then(() => {
      const suggestionsContainer = this.shadowRoot?.querySelector(
        '.suggestions'
      ) as HTMLElement;
      const highlightedElement = this.shadowRoot?.querySelector(
        '.suggestion.highlighted'
      ) as HTMLElement;

      if (suggestionsContainer && highlightedElement) {
        const containerRect = suggestionsContainer.getBoundingClientRect();
        const elementRect = highlightedElement.getBoundingClientRect();

        const isInView =
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom;

        if (!isInView) {
          highlightedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    });

    return true;
  }

  private handleTagCreation(e: KeyboardEvent): boolean {
    if ((e.key === 'Enter' && !e.shiftKey) || e.key === ',') {
      e.preventDefault();
      this.addTagsFromValue();
      return true;
    }

    return false;
  }

  private onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this._expanded = false;
      this.inputEl.focus();
      return;
    }

    if (this.handleSuggestionNavigation(e)) {
      return;
    }

    this.handleTagCreation(e);
  }

  private handlePaste(e: ClipboardEvent): void {
    if (this.readonly || this.disabled) return;

    const clipboardData = e.clipboardData;

    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text');

    if (pastedText.includes(',')) {
      e.preventDefault();

      const currentValue = this.inputEl.value;

      const valueToProcess = currentValue
        ? currentValue + (currentValue.endsWith(',') ? ' ' : ', ') + pastedText
        : pastedText;

      const result = processTagsFromValue(
        valueToProcess,
        this._items,
        this.maxItems,
        this.validationsDisabled,
        this._textStrings,
        this.inputType,
        this.pattern
      );

      if (result.hasError) {
        const state = {
          ...this._internals.validity,
          ...result.validationState,
        };
        this._validationMessage = result.validationMessage;
        this._internals.setValidity(
          state,
          result.validationMessage,
          this.inputEl
        );
        return;
      }

      if (result.newItems.length > 0) {
        this._items = [...this._items, ...result.newItems];

        const invalidSet =
          this._invalids instanceof Set
            ? new Set(this._invalids)
            : new Set<number>(this._invalids as unknown as number[]);

        for (const idx of result.invalidIndexes) {
          invalidSet.add(idx);
        }

        this._invalids = invalidSet;

        this._validateAllTags();

        this.inputEl.value = '';

        this.dispatchEvent(
          new CustomEvent<string[]>('on-change', { detail: this._items })
        );
      }
    }
  }

  private createPositionMirror(
    input: HTMLInputElement,
    selEnd: number
  ): HTMLElement {
    const mirror = document.createElement('div');
    const style = getComputedStyle(input);

    const stylesToCopy = [
      'font-size',
      'font-family',
      'font-weight',
      'line-height',
      'padding',
      'border',
      'box-sizing',
      'white-space',
      'width',
    ];

    for (const prop of stylesToCopy) {
      mirror.style.setProperty(prop, style.getPropertyValue(prop));
    }

    mirror.style.position = 'absolute';
    mirror.style.top = `${input.offsetTop}px`;
    mirror.style.left = `${input.offsetLeft}px`;
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';

    mirror.textContent = input.value.slice(0, selEnd);

    return mirror;
  }

  private calculateSuggestionPosition(
    input: HTMLInputElement,
    mirror: HTMLElement,
    selEnd: number
  ): { top: string; left: string } {
    const span = document.createElement('span');
    span.textContent = input.value.slice(selEnd) || '.';
    mirror.appendChild(span);

    const spanLeft = span.offsetLeft;
    const spanTop = span.offsetTop;
    const style = getComputedStyle(input);
    const lh = parseFloat(style.lineHeight) || span.offsetHeight;

    const topPx = input.offsetTop + spanTop + lh;
    const leftPx = input.offsetLeft + spanLeft;

    return {
      top: `${topPx}px`,
      left: `${leftPx}px`,
    };
  }

  private _updateSuggestionPosition() {
    const input = this.inputEl;
    const container = this._containerEl;
    const selEnd = input.selectionEnd ?? input.value.length;

    const mirror = this.createPositionMirror(input, selEnd);
    container.appendChild(mirror);

    const position = this.calculateSuggestionPosition(input, mirror, selEnd);

    this._suggestionTop = position.top;
    this._suggestionLeft = position.left;

    container.removeChild(mirror);
  }

  private _validate(_interacted: boolean): void {
    this._validateAllTags();
  }

  private _validateAllTags(): void {
    const validationResult = validateAllTags(
      this._items,
      this.required,
      this.maxItems,
      this._textStrings,
      this.validationsDisabled,
      this.inputType,
      this.pattern
    );

    const state = { ...this._internals.validity, ...validationResult.state };

    this._validationMessage = validationResult.message;
    this._isInvalid = validationResult.hasError;

    if (this.inputEl) {
      this._internals.setValidity(
        state,
        validationResult.message,
        this.inputEl
      );
    } else {
      this._internals.setValidity(state, validationResult.message);
    }
  }

  private addTagsFromValue(): void {
    const inputValue = this.inputEl.value;

    const result = processTagsFromValue(
      inputValue,
      this._items,
      this.maxItems,
      this.validationsDisabled,
      this._textStrings,
      this.inputType,
      this.pattern
    );

    if (result.hasError) {
      const state = { ...this._internals.validity, ...result.validationState };
      this._validationMessage = result.validationMessage;
      this._internals.setValidity(
        state,
        result.validationMessage,
        this.inputEl
      );
      return;
    }

    if (result.newItems.length > 0) {
      this._items = [...this._items, ...result.newItems];

      const invalidSet =
        this._invalids instanceof Set
          ? new Set(this._invalids)
          : new Set<number>(this._invalids as unknown as number[]);

      for (const idx of result.invalidIndexes) {
        invalidSet.add(idx);
      }

      this._invalids = invalidSet;

      this._validateAllTags();

      this.inputEl.value = '';
      this.dispatchEvent(
        new CustomEvent<string[]>('on-change', { detail: this._items })
      );
    }
  }

  private removeAt(idx: number) {
    this._items = this._items.filter((_: string, i: number) => i !== idx);

    const invalidSet =
      this._invalids instanceof Set
        ? new Set(this._invalids)
        : new Set<number>(this._invalids as unknown as number[]);

    this._invalids = updateInvalidIndexesAfterRemoval(invalidSet, idx);

    if (this._items.length === 0) {
      this._isInvalid = false;
      this._validationMessage = '';
      const state = { ...this._internals.validity };
      state.customError = false;
      state.valueMissing = false;
      this._internals.setValidity(state, '', this.inputEl);
    } else {
      this._validateAllTags();
    }

    this.dispatchEvent(
      new CustomEvent<string[]>('on-change', { detail: this._items })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-multi-input-field': MultiInputField;
  }
}
