import { html, LitElement, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import type { Button } from './button';

import stylesheet from './buttonGroup.scss?inline';

import chevronLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-left.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

/**
 * Button group kinds
 */
export const BUTTON_GROUP_KINDS = {
  DEFAULT: 'default',
  PAGINATION: 'pagination',
  ICONS: 'icons',
} as const;

export type BUTTON_GROUP_KINDS =
  (typeof BUTTON_GROUP_KINDS)[keyof typeof BUTTON_GROUP_KINDS];

/**
 * Button configuration for array-based rendering
 */
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
 * @fires on-change - detail `{ value: number | string, selectedIndex: number, selectedIndices: Array<number | string> }`
 */
@customElement('kyn-button-group')
export class ButtonGroup extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** Button group kind */
  @property({ type: String })
  accessor kind: BUTTON_GROUP_KINDS = BUTTON_GROUP_KINDS.DEFAULT;

  /** If true, only one button may be selected at a time */
  @property({ type: Boolean })
  accessor singleSelect = true;

  /** Index of the selected button (singleSelect mode) */
  @property({ type: Number })
  accessor selectedIndex = -1;

  /** Indices of selected buttons (multi-select mode) */
  @property({ type: Array })
  accessor selectedIndices: any[] = [];

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

  /** Content for the previous button (can be text or HTML) */
  @property({ type: String })
  accessor prevButtonContent = '';

  /** Content for the next button (can be text or HTML) */
  @property({ type: String })
  accessor nextButtonContent = '';

  /** Starting page for the visible range */
  @property({ type: Number })
  accessor _visibleStart = 1;

  /** All direct <kyn-button> children */
  @queryAssignedElements({ slot: '', flatten: true })
  private accessor _buttons!: Button[];

  override render() {
    switch (this.kind) {
      case BUTTON_GROUP_KINDS.PAGINATION:
        return this._renderPagination();
      case BUTTON_GROUP_KINDS.ICONS:
        return this._renderIcons();
      case BUTTON_GROUP_KINDS.DEFAULT:
      default:
        return this._renderDefault();
    }
  }

  private _renderDefault() {
    const cls = {
      'kd-btn-group': true,
    };

    return html`
      <div
        class=${classMap(cls)}
        role=${this.singleSelect ? 'radiogroup' : 'group'}
      >
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
      <div
        class=${classMap(cls)}
        role=${this.singleSelect ? 'radiogroup' : 'group'}
      >
        <slot @slotchange=${() => this._handleSlotChange()}></slot>
      </div>
    `;
  }

  private _renderPagination() {
    const cls = {
      'kd-btn-group': true,
    };

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
      <div
        class=${classMap(cls)}
        role=${this.singleSelect ? 'radiogroup' : 'group'}
      >
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
          (p) =>
            html`<kyn-button
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

  // disabled prop setting for pagination prev/next buttons
  // ?disabled=${start <= 1}
  // ?disabled=${end >= this.totalPages}

  override firstUpdated() {
    this._attachClickListeners();
    this._syncSelection();
  }

  override willUpdate(changedProperties: Map<string, any>) {
    super.willUpdate(changedProperties);
    if (changedProperties.has('singleSelect')) {
      if (this.singleSelect && this.selectedIndices.length > 1) {
        this.selectedIndices = this.selectedIndices.slice(0, 1);
        this.selectedIndex = this.selectedIndices[0] || -1;
      } else if (!this.singleSelect && this.selectedIndex >= 0) {
        this.selectedIndices = [this.selectedIndex];
        this.selectedIndex = -1;
      }
    }
  }

  override updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('selectedIndex') ||
      changedProperties.has('selectedIndices') ||
      changedProperties.has('singleSelect')
    ) {
      this._syncSelection();
    }
    if (changedProperties.has('_buttons')) {
      this._attachClickListeners();
    }
    if (
      this.kind === BUTTON_GROUP_KINDS.PAGINATION &&
      (changedProperties.has('currentPage') ||
        changedProperties.has('totalPages') ||
        changedProperties.has('maxVisible'))
    ) {
      this._updatePaginationSelection();
    }
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

  private _handlePaginationClick(value: string | number) {
    let newPage = this.currentPage;
    let shouldUpdateVisibleRange = false;

    if (value === 'prev') {
      const newStart = Math.max(1, this._visibleStart - this.incrementBy);
      if (newStart !== this._visibleStart) {
        this._visibleStart = newStart;
        shouldUpdateVisibleRange = true;
      }
    } else if (value === 'next') {
      const maxStart = Math.max(1, this.totalPages - this.maxVisible + 1);
      const newStart = Math.min(
        maxStart,
        this._visibleStart + this.incrementBy
      );
      if (newStart !== this._visibleStart) {
        this._visibleStart = newStart;
        shouldUpdateVisibleRange = true;
      }
    } else if (!isNaN(Number(value))) {
      newPage = Number(value);
    }

    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this._emitChange(value);
    } else if (shouldUpdateVisibleRange) {
      this._emitChange(value);
      this.requestUpdate();
    }
  }

  private _handleSlotChange() {
    setTimeout(() => {
      this._attachClickListeners();
      this._syncSelection();
    }, 0);
  }

  private _attachClickListeners() {
    if (this.kind === BUTTON_GROUP_KINDS.PAGINATION) return;

    this._buttons.forEach((btn, idx) => {
      btn.removeEventListener('click', this._onButtonClick as any);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._onButtonClick(idx);
      });
    });
  }

  private _onButtonClick(idx: number) {
    if (this.singleSelect) {
      this.selectedIndex = idx;
      this._emitChange(this._buttons[idx]?.value || idx);
    } else {
      const existing = this.selectedIndices.indexOf(idx);
      this.selectedIndices =
        existing > -1
          ? this.selectedIndices.filter((i) => i !== idx)
          : [...this.selectedIndices, idx];
      this._emitChange([...this.selectedIndices]);
    }
    this._syncSelection();
  }

  private _syncSelection() {
    const total = this._buttons.length;
    this._buttons.forEach((btn, idx) => {
      btn.selected = this.singleSelect
        ? idx === this.selectedIndex
        : this.selectedIndices.includes(idx);
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
          selectedIndices: this.selectedIndices,
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
