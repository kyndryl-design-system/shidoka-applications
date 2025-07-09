import { html, LitElement, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import './button';
import type { Button } from './button';
import { BUTTON_KINDS } from './defs';

import stylesheet from './buttonGroup.scss?inline';

import chevronLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-left.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export const BUTTON_GROUP_KINDS = {
  DEFAULT: 'default',
  PAGINATION: 'pagination',
  ICONS: 'icons',
} as const;

export type BUTTON_GROUP_KINDS =
  (typeof BUTTON_GROUP_KINDS)[keyof typeof BUTTON_GROUP_KINDS];

export interface ButtonConfig {
  value: string | number;
  icon?: any;
  text?: string;
  description?: string;
  disabled?: boolean;
  kind?: string;
}

/**
 * ButtonGroup component.
 *
 * @slot unnamed - Slot for <kyn-button> elements.
 * @fires on-change - Captures the click event button selection in button group.
 */
@customElement('kyn-button-group')
export class ButtonGroup extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** Button group kind */
  @property({ type: String })
  accessor kind: BUTTON_GROUP_KINDS = BUTTON_GROUP_KINDS.DEFAULT;

  /** Index of the selected button */
  @property({ type: Number })
  accessor selectedIndex = -1;

  /** Current page number for pagination mode */
  @property({ type: Number })
  accessor currentPage = 1;

  /** Total number of pages for pagination mode */
  @property({ type: Number })
  accessor totalPages = 1;

  /** Maximum number of visible page buttons */
  @property({ type: Number })
  accessor maxVisible = 5;

  /** Number of pages to increment/decrement when clicking next/previous buttons in pagination */
  @property({ type: Number })
  accessor incrementBy = 1;

  /** Starting page for the visible range (internal state) */
  @state()
  private accessor _visibleStart: number = 1;

  static override get properties() {
    return {
      ...super.properties,
      visibleStart: { type: Number, attribute: false },
      visibleEnd: { type: Number, attribute: false },
    };
  }

  /** Current first page in the visible window (read-only) */
  public get visibleStart(): number {
    return this._visibleStart;
  }

  /** Current last page in the visible window (read-only) */
  public get visibleEnd(): number {
    return Math.min(this.totalPages, this._visibleStart + this.maxVisible - 1);
  }

  /** Access <kyn-button> children */
  @queryAssignedElements({ slot: '', flatten: true })
  private accessor _buttons!: Button[];

  override render() {
    switch (this.kind) {
      case BUTTON_GROUP_KINDS.PAGINATION:
        return this._renderPagination();
      case BUTTON_GROUP_KINDS.ICONS:
        return this._renderIcons();
      default:
        return this._renderDefault();
    }
  }

  private _renderDefault() {
    const cls = { 'kd-btn-group': true };
    return html`
      <div class=${classMap(cls)} role="radiogroup">
        <slot @slotchange=${() => this._handleSlotChange()}></slot>
      </div>
    `;
  }

  private _renderIcons() {
    const cls = {
      'kd-btn-group': true,
      'kd-btn-group--icons': true,
    };
    return html`
      <div class=${classMap(cls)} role="radiogroup">
        <slot @slotchange=${() => this._handleSlotChange()}></slot>
      </div>
    `;
  }

  private _renderPagination() {
    const cls = { 'kd-btn-group': true };
    let start = this._visibleStart;
    const end = Math.min(this.totalPages, start + this.maxVisible - 1);

    if (end === this.totalPages && this.totalPages > this.maxVisible) {
      start = Math.max(1, this.totalPages - this.maxVisible + 1);
      this._visibleStart = start;
    }

    const visiblePages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    const rel = visiblePages.indexOf(this.currentPage);
    this.selectedIndex = rel >= 0 ? rel + 1 : -1;

    return html`
      <div class=${classMap(cls)} role="radiogroup">
        <kyn-button
          kind="tertiary"
          value="prev"
          class="kd-btn--group-first"
          description="Previous page"
          @click=${() => this._handlePaginationClick('prev')}
        >
          ${unsafeSVG(chevronLeftIcon)}
        </kyn-button>

        ${visiblePages.map(
          (p) => html`<kyn-button
            kind="tertiary"
            value="${p}"
            class="kd-btn--group-middle"
            ?selected=${p === this.currentPage}
            description="Page ${p}"
            @click=${() => this._handlePaginationClick(p)}
          >
            ${p}
          </kyn-button>`
        )}

        <kyn-button
          kind="tertiary"
          value="next"
          class="kd-btn--group-last"
          description="Next page"
          @click=${() => this._handlePaginationClick('next')}
        >
          ${unsafeSVG(chevronRightIcon)}
        </kyn-button>
      </div>
    `;
  }

  override firstUpdated() {
    this._attachClickListeners();
    this._syncSelection();
  }

  override updated(changedProps: Map<string, any>) {
    if (changedProps.has('selectedIndex')) this._syncSelection();
    if (changedProps.has('_buttons')) this._attachClickListeners();
    if (
      this.kind === BUTTON_GROUP_KINDS.PAGINATION &&
      (changedProps.has('currentPage') ||
        changedProps.has('totalPages') ||
        changedProps.has('maxVisible'))
    ) {
      this._updatePaginationSelection();
    }
  }

  private _attachClickListeners() {
    if (this.kind === BUTTON_GROUP_KINDS.PAGINATION) return;
    this._buttons.forEach((btn, idx) => {
      btn.removeEventListener('click', this._onButtonClick as any);
      btn.addEventListener('click', () => this._onButtonClick(idx));
    });
  }

  private _handleSlotChange() {
    requestAnimationFrame(() => {
      this._buttons.forEach((btn, idx) => {
        if (this.kind === BUTTON_GROUP_KINDS.DEFAULT)
          btn.kind = BUTTON_KINDS.PRIMARY;
        else if (this.kind === BUTTON_GROUP_KINDS.ICONS)
          btn.kind = BUTTON_KINDS.SECONDARY;
        else btn.kind = BUTTON_KINDS.TERTIARY;
        btn.removeEventListener('click', this._onButtonClick as any);
        btn.addEventListener('click', () => this._onButtonClick(idx));
      });
      this._syncSelection();
    });
  }

  private _onButtonClick(idx: number) {
    if (this.kind === BUTTON_GROUP_KINDS.PAGINATION)
      return this._handlePaginationClick(this._buttons[idx].value);
    this.selectedIndex = idx;
    this._emitChange(this._buttons[idx]?.value);
    this._syncSelection();
  }

  private _syncSelection() {
    const total = this._buttons.length;
    this._buttons.forEach((btn, idx) => {
      btn.selected = idx === this.selectedIndex;
      btn.classList.remove(
        'kd-btn--group-single',
        'kd-btn--group-first',
        'kd-btn--group-middle',
        'kd-btn--group-last'
      );
      if (total === 1) btn.classList.add('kd-btn--group-single');
      else if (idx === 0) btn.classList.add('kd-btn--group-first');
      else if (idx === total - 1) btn.classList.add('kd-btn--group-last');
      else btn.classList.add('kd-btn--group-middle');
    });
  }

  private _updatePaginationSelection() {
    if (this.kind !== BUTTON_GROUP_KINDS.PAGINATION) return;
    const half = Math.floor(this.maxVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    const end = Math.min(this.totalPages, start + this.maxVisible - 1);
    if (end === this.totalPages && this.totalPages > this.maxVisible) {
      start = Math.max(1, this.totalPages - this.maxVisible + 1);
    }
    const visiblePages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
    const rel = visiblePages.indexOf(this.currentPage);
    this.selectedIndex = rel >= 0 ? rel + 1 : -1;
  }

  private _handlePaginationClick(value: any) {
    let newPage = this.currentPage;
    let shouldUpdate = false;
    if (value === 'prev') {
      const nextStart = Math.max(1, this._visibleStart - this.incrementBy);
      if (nextStart !== this._visibleStart) {
        this._visibleStart = nextStart;
        shouldUpdate = true;
      }
    } else if (value === 'next') {
      const maxStart = Math.max(1, this.totalPages - this.maxVisible + 1);
      const nextStart = Math.min(
        maxStart,
        this._visibleStart + this.incrementBy
      );
      if (nextStart !== this._visibleStart) {
        this._visibleStart = nextStart;
        shouldUpdate = true;
      }
    } else if (!isNaN(Number(value))) {
      newPage = Number(value);
    }
    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this._emitChange(value);
    } else if (shouldUpdate) {
      this._emitChange(value);
      this.requestUpdate();
    }
  }

  private _emitChange(value: any) {
    let visibleStart = this._visibleStart;
    let visibleEnd = Math.min(
      this.totalPages,
      visibleStart + this.maxVisible - 1
    );
    if (visibleEnd === this.totalPages && this.totalPages > this.maxVisible) {
      visibleStart = Math.max(1, this.totalPages - this.maxVisible + 1);
      visibleEnd = this.totalPages;
    }
    this.dispatchEvent(
      new CustomEvent('on-change', {
        bubbles: true,
        composed: true,
        detail: {
          value,
          selectedIndex: this.selectedIndex,
          currentPage: this.currentPage,
          visibleStart,
          visibleEnd,
        },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-button-group': ButtonGroup;
  }
}
