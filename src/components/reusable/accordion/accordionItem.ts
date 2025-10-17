/**
 * Copyright Kyndryl, Inc. 2022
 */

import { html, LitElement, unsafeCSS } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import stylesheet from './accordionItem.scss?inline';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import chevronIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/chevron-down.svg';

/**
 * Accordion Item component. *
 * @fires on-toggle - Emits the `opened` state when the accordion item opens/closes. `detail:{ opened: boolean }`.
 * @slot icon - Optional leading icon. 24px, or 16px for compact.
 * @slot body - Body of the accordion item.
 * @slot title - Title of the accordion item.
 * @slot subtitle - Optional subtitle of the accordion item.
 *
 */
@customElement('kyn-accordion-item')
export class AccordionItem extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** Accordion item opened state. */
  @property({ type: Boolean })
  accessor opened = false;

  /** Accordion item disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * The index of this item. Passed from the Accordion.
   * @ignore
   */
  @state() private accessor _index = 1;

  /**
   * Whether the number should be shown. Passed from the Accordion.
   * @ignore
   */
  @state() private accessor _showNumber = false;

  /**
   * Whether this item displays a filled header. Passed from the Accordion.
   * @ignore
   */
  @state() private accessor _filledHeader = false;

  /**
   * Whether this item is compact. Passed from the Accordion.
   * @ignore
   */
  @state() private accessor _compact = false;

  setIndex(index: number) {
    this._index = index;
  }

  setShowNumbers(value: boolean) {
    this._showNumber = value;
  }

  setFilledHeader(value: boolean) {
    this._filledHeader = value;
  }

  setCompact(value: boolean) {
    this._compact = value;
  }

  open() {
    if (!this.opened) this._toggleOpenState();
  }

  close() {
    if (this.opened) this._toggleOpenState();
  }

  private _handleClick(e: Event) {
    e.preventDefault();
    this._toggleOpenState();
  }

  private _handleKeypress(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key == ' ' || e.key == 'Enter') this._toggleOpenState();
  }

  private _toggleOpenState() {
    if (!this.disabled) {
      this.opened = !this.opened;

      this._emitToggleEvent();
    }
  }

  private _emitToggleEvent() {
    const event = new CustomEvent('on-toggle', {
      bubbles: true,
      composed: true,
      detail: { opened: this.opened },
    });
    this.dispatchEvent(event);
  }

  override render() {
    const classes: any = classMap({
      'kyn-accordion-item': true,
      opened: this.opened,
      disabled: this.disabled,
      'filled-header': this._filledHeader,
      compact: this._compact,
    });

    return html`
      <div class="${classes}">
        <div
          class="kyn-accordion-item-title"
          aria-controls="kyn-accordion-item-body-${this._index}"
          aria-expanded=${this.opened}
          aria-disabled=${this.disabled}
          tabindex="0"
          role="button"
          @click="${(e: Event) => this._handleClick(e)}"
          @keypress="${(e: KeyboardEvent) => this._handleKeypress(e)}"
          id="kyn-accordion-item-title-${this._index}"
        >
          <div class="icon">
            <slot name="icon"></slot>
          </div>

          ${this._showNumber
            ? html` <div class="number">${this._index}</div> `
            : null}

          <div>
            <div class="title">
              <slot name="title"></slot>
            </div>

            <div class="kyn-accordion-item-subtitle">
              <slot name="subtitle"></slot>
            </div>
          </div>

          <div class="right">
            <div class="expand-icon">${unsafeSVG(chevronIcon)}</div>
          </div>
        </div>

        <div
          class="kyn-accordion-item-body"
          id="kyn-accordion-item-body-${this._index}"
          role="region"
          aria-labelledby="kyn-accordion-item-title-${this._index}"
        >
          <div class="kyn-accordion-item-detail">
            <slot name="body"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-accordion-item': AccordionItem;
  }
}
