import { html, LitElement, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import '../button/button';
import type { Button } from '../button/button';
import { BUTTON_KINDS } from '../button/defs';

import ButtonGroupStyles from './buttonGroup.scss?inline';

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

const _defaultTextStrings = {
  prevButtonDescription: 'Previous Page',
  nextButtonDescription: 'Next Page',
  indivGroupItemDescription: '',
};

/**
 * ButtonGroup component.
 *
 * @slot unnamed - Slot for <kyn-button> elements.
 * @fires on-change - Captures the click event button selection in button group. `detail:{ value: string | number, selectedIndex: number, visibleStart: number, visibleEnd: number }`
 */
@customElement('kyn-button-group')
export class ButtonGroup extends LitElement {
  static override styles = unsafeCSS(ButtonGroupStyles);

  /** Button group kind. Valid values: 'default', 'pagination', 'icons' */
  @property({ type: String })
  accessor kind: 'default' | 'pagination' | 'icons' =
    BUTTON_GROUP_KINDS.DEFAULT;

  /** zero-based: default button index; for pagination, page-1 */
  @property({ type: Number })
  accessor selectedIndex = -1;

  /**
   * @category pagination
   * @remarks only used when `kind === BUTTON_GROUP_KINDS.PAGINATION (`pagination`)`
   * Total number of pages for pagination mode
   */
  @property({ type: Number })
  accessor totalPages = 1;

  /**
   * @category pagination
   * @remarks only used when `kind === BUTTON_GROUP_KINDS.PAGINATION (`pagination`)`
   * Maximum number of visible page buttons
   */
  @property({ type: Number })
  accessor maxVisible = 5;

  /**
   * @category pagination
   * @remarks only used when `kind === BUTTON_GROUP_KINDS.PAGINATION (`pagination`)`
   * Number of pages to increment/decrement when clicking next/previous
   */
  @property({ type: Number })
  accessor clickIncrementBy = 1;

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

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /** Target <kyn-button> children */
  @queryAssignedElements({ slot: '', flatten: true })
  private accessor _buttons!: Button[];

  override render() {
    return this.kind === BUTTON_GROUP_KINDS.PAGINATION
      ? this._renderPagination()
      : this.kind === BUTTON_GROUP_KINDS.ICONS
      ? this._renderIcons()
      : this._renderDefault();
  }

  override firstUpdated() {
    this._attachClickListeners();
    this._syncSelection();
  }

  override updated(changed: Map<string, any>) {
    if (this.kind === BUTTON_GROUP_KINDS.PAGINATION) {
      if (
        changed.has('totalPages') ||
        changed.has('maxVisible') ||
        changed.has('clickIncrementBy')
      ) {
        this._updateWindow();
      }
    } else {
      if (changed.has('selectedIndex')) {
        this._syncSelection();
      }
    }

    if (changed.has('kind')) {
      this._attachClickListeners();
      this._syncSelection();
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
    const cls = { 'kd-btn-group': true, 'kd-btn-group--icons': true };
    return html`
      <div class=${classMap(cls)} role="radiogroup">
        <slot @slotchange=${() => this._handleSlotChange()}></slot>
      </div>
    `;
  }

  private _renderPagination() {
    const currentPage = this.selectedIndex + 1;
    let start = this._visibleStart;
    const end = Math.min(this.totalPages, start + this.maxVisible - 1);

    if (end === this.totalPages && this.totalPages > this.maxVisible) {
      start = this.totalPages - this.maxVisible + 1;
      this._visibleStart = start;
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const rel = pages.indexOf(currentPage);

    return html`
      <div class="kd-btn-group" role="radiogroup">
        <kyn-button
          kind="tertiary"
          class="kd-btn--group-first"
          description=${this.textStrings.prevButtonDescription ||
          `Previous Page`}
          @click=${() => this._onPage('prev')}
        >
          ${unsafeSVG(chevronLeftIcon)}
        </kyn-button>

        ${pages.map(
          (p, i) => html`
            <kyn-button
              kind="tertiary"
              description=${this.textStrings.indivGroupItemDescription ||
              `Page ${p} of ${this.totalPages}`}
              class="kd-btn--group-middle"
              ?selected=${i === rel}
              @click=${() => this._onPage(p)}
              data-page=${p}
            >
              ${p}
            </kyn-button>
          `
        )}

        <kyn-button
          kind="tertiary"
          class="kd-btn--group-last"
          description=${this.textStrings.nextButtonDescription || `Next Page`}
          @click=${() => this._onPage('next')}
        >
          ${unsafeSVG(chevronRightIcon)}
        </kyn-button>
      </div>
    `;
  }

  private _updateWindow() {
    const currentPage = this.selectedIndex + 1;
    const half = Math.floor(this.maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(this.totalPages, start + this.maxVisible - 1);

    if (end === this.totalPages && this.totalPages > this.maxVisible) {
      start = this.totalPages - this.maxVisible + 1;
    }

    this._visibleStart = start;
  }

  private _onPage(cmd: 'prev' | 'next' | number) {
    if (cmd === 'prev') {
      const newStart = Math.max(1, this._visibleStart - this.clickIncrementBy);
      this._visibleStart = newStart;
      this.requestUpdate();
    } else if (cmd === 'next') {
      const maxStart = Math.max(1, this.totalPages - this.maxVisible + 1);
      const newStart = Math.min(
        maxStart,
        this._visibleStart + this.clickIncrementBy
      );
      this._visibleStart = newStart;
      this.requestUpdate();
    } else {
      this.selectedIndex = cmd - 1;
    }

    this.dispatchEvent(
      new CustomEvent('on-change', {
        bubbles: true,
        composed: true,
        detail: {
          value: typeof cmd === 'number' ? cmd : null,
          selectedIndex: this.selectedIndex,
          visibleStart: this.visibleStart,
          visibleEnd: this.visibleEnd,
        },
      })
    );
  }

  private _boundHandlers = new Map<Button, () => void>();

  private _attachClickListeners() {
    if (this.kind === BUTTON_GROUP_KINDS.PAGINATION) return;
    this._buttons.forEach((btn, idx) => {
      const existingHandler = this._boundHandlers.get(btn);
      if (existingHandler) {
        btn.removeEventListener('on-click', existingHandler);
      }

      const handler = () => this._onButtonClick(idx);
      this._boundHandlers.set(btn, handler);
      btn.addEventListener('on-click', handler);
    });
  }

  private _handleSlotChange() {
    requestAnimationFrame(() => {
      this._buttons.forEach((btn) => {
        btn.kind =
          this.kind === BUTTON_GROUP_KINDS.ICONS
            ? BUTTON_KINDS.SECONDARY
            : BUTTON_KINDS.PRIMARY;
      });
      this._syncSelection();

      this._attachClickListeners();
    });
  }

  private _onButtonClick(idx: number) {
    if (this.kind === BUTTON_GROUP_KINDS.PAGINATION) {
      const raw = this._buttons[idx].value;
      return this._onPage(typeof raw === 'string' ? Number(raw) : raw);
    }
    this.selectedIndex = idx;
    this._emitChange(this._buttons[idx].value);
    this._syncSelection();
  }

  private _emitChange(value: unknown) {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        bubbles: true,
        composed: true,
        detail: { value },
      })
    );
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

  override disconnectedCallback() {
    this._boundHandlers.forEach((handler, btn) => {
      btn.removeEventListener('click', handler);
    });
    this._boundHandlers.clear();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-button-group': ButtonGroup;
  }
}
