import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';

import '../divider/divider';
import '../tabs';

import SplitViewScss from './splitView.scss?inline';

const DIVIDER_PX = 8;
const KEYBOARD_RESIZE_STEP_PX = 16;

const _defaultTextStrings = {
  resizePanes: 'Resize panes',
};

/**
 * Split View — resizable multi-pane layout.
 *
 * Slot content into `start`, the default (primary), and optionally `end` panes.
 * Three-pane mode activates automatically when the `end` slot has content.
 * At narrow container widths the layout collapses to a tabbed compact view
 * using `kyn-tabs`.
 *
 * @fires on-resize - Fires when a pane is resized via drag or keyboard.
 *   `detail: { pane: 'start' | 'end', width: number }`
 * @slot start - Content for the start (left) pane.
 * @slot unnamed - Content for the primary (center) pane.
 * @slot end - Content for the end (right) pane. Presence of content enables three-pane mode.
 */
@customElement('kyn-split-view')
export class SplitView extends LitElement {
  static override styles = unsafeCSS(SplitViewScss);

  /** Initial width of the start pane. Accepts any CSS length value. */
  @property({ type: String })
  accessor startPaneSize = '39%';

  /** Initial width of the end pane (three-pane mode only). Accepts any CSS length value. */
  @property({ type: String })
  accessor endPaneSize = '28%';

  /** Container width (px) below which the layout switches to compact tabbed mode. Set to `0` to disable. */
  @property({ type: Number })
  accessor compactBreakpoint = 900;

  /** Minimum width (px) for start and end panes during drag resize. */
  @property({ type: Number })
  accessor minPaneSize = 120;

  /** Minimum width (px) for the primary (center) pane during drag resize. */
  @property({ type: Number })
  accessor minCenterSize = 160;

  /** Label for the start pane tab in compact mode. */
  @property({ type: String })
  accessor startPaneLabel = 'Start';

  /** Label for the primary pane tab in compact mode. */
  @property({ type: String })
  accessor primaryPaneLabel = 'Primary';

  /** Label for the end pane tab in compact mode. */
  @property({ type: String })
  accessor endPaneLabel = 'End';

  /** Invert one grip line on the start divider for contrast against a dark adjacent pane. `'left'` or `'right'`. */
  @property({ type: String })
  accessor startDividerInverted: 'none' | 'left' | 'right' = 'none';

  /** Invert one grip line on the end divider for contrast against a dark adjacent pane. `'left'` or `'right'`. */
  @property({ type: String })
  accessor endDividerInverted: 'none' | 'left' | 'right' = 'none';

  /** Removes the default border, border-radius, and box-shadow from the component. */
  @property({ type: Boolean, reflect: true })
  accessor hideBorder = false;

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /** Reflects the current compact state. Read-only; driven by `compactBreakpoint`.
   * @internal
   */
  @property({ type: Boolean, reflect: true })
  accessor compact = false;

  /** @internal */
  @state()
  private accessor _hasEndPane = false;

  /** @internal */
  @state()
  private accessor _dragWhich: 0 | 1 | 2 = 0;

  /** @internal */
  @queryAssignedElements({ slot: 'end' })
  private accessor _endSlotEls!: HTMLElement[];

  /** @internal */
  @query('.pane--start')
  private accessor _startPaneEl!: HTMLElement;

  /** @internal */
  @query('.pane--end')
  private accessor _endPaneEl!: HTMLElement;

  /** @internal */
  @query('.split-view')
  private accessor _splitViewEl!: HTMLElement;

  /** @internal */
  private _ro: ResizeObserver | null = null;
  /** @internal */
  private _resizeStartX = 0;
  /** @internal */
  private _resizeStartWidth = 0;
  /** @internal */
  private _boundDragMove!: (e: PointerEvent) => void;
  /** @internal */
  private _boundDragEnd!: (e: PointerEvent) => void;
  /** @internal */
  private _startWidthOverride: string | null = null;
  /** @internal */
  private _endWidthOverride: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(() => this._updateCompactState());
    this._ro.observe(this);
    this._updateCompactState();
  }

  override disconnectedCallback() {
    this._ro?.disconnect();
    this._ro = null;
    super.disconnectedCallback();
  }

  override render() {
    return this.compact ? this._renderCompact() : this._renderDesktop();
  }

  private _renderDesktop() {
    const startBasis = this._startWidthOverride ?? this.startPaneSize;
    const endBasis = this._endWidthOverride ?? this.endPaneSize;

    return html`
      <div
        class="split-view ${this._hasEndPane
          ? 'split-view--three'
          : 'split-view--two'}"
      >
        <section class="pane pane--start" style="flex-basis:${startBasis}">
          <slot name="start"></slot>
        </section>

        <div
          class="divider-track"
          role="separator"
          aria-orientation="vertical"
          aria-label=${this._textStrings.resizePanes}
          tabindex="0"
          @pointerdown=${(e: PointerEvent) => this._onDividerDown(1, e)}
          @keydown=${(e: KeyboardEvent) => this._onDividerKeyDown(1, e)}
        >
          <kyn-divider
            vertical
            drag-handle
            ?dragging=${this._dragWhich === 1}
            decorative
            inverted-handle=${this.startDividerInverted}
          ></kyn-divider>
        </div>

        <section class="pane pane--primary">
          <slot></slot>
        </section>

        <div
          class="divider-track divider-track--end"
          role="separator"
          aria-orientation="vertical"
          aria-label=${this._textStrings.resizePanes}
          tabindex="0"
          @pointerdown=${(e: PointerEvent) => this._onDividerDown(2, e)}
          @keydown=${(e: KeyboardEvent) => this._onDividerKeyDown(2, e)}
        >
          <kyn-divider
            vertical
            drag-handle
            ?dragging=${this._dragWhich === 2}
            decorative
            inverted-handle=${this.endDividerInverted}
          ></kyn-divider>
        </div>

        <section class="pane pane--end" style="flex-basis:${endBasis}">
          <slot name="end" @slotchange=${this._handleEndSlotChange}></slot>
        </section>
      </div>
    `;
  }

  private _renderCompact() {
    return html`
      <div class="compact">
        <kyn-tabs tabSize="md" scrollablePanels>
          <kyn-tab slot="tabs" id="sv-start" selected>
            ${this.startPaneLabel}
          </kyn-tab>
          <kyn-tab slot="tabs" id="sv-primary">
            ${this.primaryPaneLabel}
          </kyn-tab>
          ${this._hasEndPane
            ? html`<kyn-tab slot="tabs" id="sv-end">
                ${this.endPaneLabel}
              </kyn-tab>`
            : null}

          <kyn-tab-panel tabId="sv-start" visible noPadding>
            <slot name="start"></slot>
          </kyn-tab-panel>
          <kyn-tab-panel tabId="sv-primary" noPadding>
            <slot></slot>
          </kyn-tab-panel>
          <kyn-tab-panel tabId="sv-end" noPadding ?hidden=${!this._hasEndPane}>
            <slot name="end" @slotchange=${this._handleEndSlotChange}></slot>
          </kyn-tab-panel>
        </kyn-tabs>
      </div>
    `;
  }

  private _handleEndSlotChange() {
    this._hasEndPane = this._endSlotEls.length > 0;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('compactBreakpoint')) {
      this._updateCompactState();
    }
  }

  // -- Resize logic (follows kyn-side-drawer pattern) --

  private _updateCompactState() {
    if (this.compactBreakpoint <= 0) {
      this.compact = false;
      return;
    }

    const width = this.getBoundingClientRect().width;
    this.compact = width > 0 && width < this.compactBreakpoint;
  }

  private _getPaneEl(which: 1 | 2) {
    return which === 1 ? this._startPaneEl : this._endPaneEl;
  }

  private _getPaneWidth(which: 1 | 2) {
    return this._getPaneEl(which)?.getBoundingClientRect().width ?? 0;
  }

  private _getPaneMaxWidth(which: 1 | 2) {
    const trackWidth = this._splitViewEl.getBoundingClientRect().width;
    const startWidth = this._getPaneWidth(1);
    const endWidth = this._getPaneWidth(2);

    if (which === 1) {
      return this._hasEndPane
        ? Math.max(
            this.minPaneSize,
            trackWidth - 2 * DIVIDER_PX - endWidth - this.minCenterSize
          )
        : Math.max(
            this.minPaneSize,
            trackWidth - DIVIDER_PX - this.minCenterSize
          );
    }

    return Math.max(
      this.minPaneSize,
      trackWidth - 2 * DIVIDER_PX - startWidth - this.minCenterSize
    );
  }

  private _applyPaneWidth(which: 1 | 2, width: number) {
    const pane = this._getPaneEl(which);
    if (!pane) return null;

    const currentWidth = pane.getBoundingClientRect().width;
    const next = Math.min(
      Math.max(this.minPaneSize, width),
      this._getPaneMaxWidth(which)
    );

    if (Math.abs(next - currentWidth) < 0.5) return null;

    pane.style.flexBasis = `${next}px`;

    if (which === 1) {
      this._startWidthOverride = `${next}px`;
    } else {
      this._endWidthOverride = `${next}px`;
    }

    return next;
  }

  private _emitResize(which: 1 | 2) {
    const pane = this._getPaneEl(which);
    if (!pane) return;

    this.dispatchEvent(
      new CustomEvent('on-resize', {
        detail: {
          pane: which === 1 ? 'start' : 'end',
          width: pane.getBoundingClientRect().width,
        },
        composed: true,
      })
    );
  }

  private _onDividerDown(which: 1 | 2, e: PointerEvent) {
    if (e.button !== 0) return;

    const pane = this._getPaneEl(which);
    if (!pane) return;

    this._dragWhich = which;
    this._resizeStartX = e.clientX;
    this._resizeStartWidth = pane.getBoundingClientRect().width;

    this._splitViewEl.style.userSelect = 'none';
    this._splitViewEl.style.cursor = 'ew-resize';

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }

    this._boundDragMove = this._onDragMove.bind(this);
    this._boundDragEnd = this._onDragEnd.bind(this);

    window.addEventListener('pointermove', this._boundDragMove);
    window.addEventListener('pointerup', this._boundDragEnd);
    window.addEventListener('pointercancel', this._boundDragEnd);
  }

  private _onDragMove(e: PointerEvent) {
    e.preventDefault();
    const delta = e.clientX - this._resizeStartX;

    if (this._dragWhich === 1) {
      this._applyPaneWidth(1, this._resizeStartWidth + delta);
    } else if (this._dragWhich === 2) {
      this._applyPaneWidth(2, this._resizeStartWidth - delta);
    }
  }

  private _onDividerKeyDown(which: 1 | 2, e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    e.preventDefault();

    const delta =
      e.key === 'ArrowLeft'
        ? -KEYBOARD_RESIZE_STEP_PX
        : KEYBOARD_RESIZE_STEP_PX;
    const currentWidth = this._getPaneWidth(which);
    const nextWidth = which === 1 ? currentWidth + delta : currentWidth - delta;

    if (this._applyPaneWidth(which, nextWidth) !== null) {
      this._emitResize(which);
    }
  }

  private _onDragEnd() {
    const which = this._dragWhich;
    this._dragWhich = 0;

    this._splitViewEl.style.userSelect = '';
    this._splitViewEl.style.cursor = '';

    window.removeEventListener('pointermove', this._boundDragMove);
    window.removeEventListener('pointerup', this._boundDragEnd);
    window.removeEventListener('pointercancel', this._boundDragEnd);

    if (which !== 0) {
      this._emitResize(which);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-split-view': SplitView;
  }
}
