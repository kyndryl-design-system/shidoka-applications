import { LitElement, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, state } from 'lit/decorators.js';

import '../../components/reusable/divider/divider';

import {
  COMPACT_BREAKPOINT_PX,
  clampLeftWidth,
  clampRightWidth,
  clampSplitViewWidths,
  getDefaultWidths,
  getKeyboardResizeResult,
  normalizeCompactActivePane,
  normalizePaneCount,
  shouldUseCompactMode,
  type SplitViewPane,
} from './splitViewLayout';

let splitViewInstanceCount = 0;

/**
 * Registers `<split-view-pattern>` with shadow styles supplied by the consumer (e.g.
 * `splitView.stories.js` so the full pattern CSS appears in the Storybook Code tab).
 */
export function registerSplitViewPattern(css: string) {
  if (customElements.get('split-view-pattern')) return;

  class SplitViewPattern extends LitElement {
    static override styles = unsafeCSS(css);

    /** Two columns (start + primary) or three (start + primary + end). */
    @property({ type: Number })
    accessor panes: 2 | 3 = 2;

    /**
     * Per-line grip on the divider **after the start pane** (between start and primary). Use when
     * the primary pane is a dark surface (e.g. code) next to a light start pane — required for
     * two-pane layouts; in three-pane stories with light–light start/primary, leave off.
     */
    @property({
      type: Boolean,
      reflect: true,
      attribute: 'invert-start-divider-grip',
    })
    accessor invertStartDividerGrip = false;

    /**
     * Per-line grip on the divider **before the end pane** (between primary and end). Use when
     * `panes` is `3` and the end pane is dark (e.g. code rail).
     */
    @property({
      type: Boolean,
      reflect: true,
      attribute: 'invert-end-divider-grip',
    })
    accessor invertEndDividerGrip = false;

    /**
     * Initial width in **px** for **pane-1** (start). Takes precedence over **`defaultStartPaneFraction`**
     * and built-in ratios. Clamped on first layout.
     */
    @property({ type: Number, attribute: 'default-start-pane-width' })
    accessor defaultStartPaneWidthPx: number | undefined = undefined;

    /**
     * Initial start width as a **fraction** of the track width (e.g. `0.45` for 45%). Used when
     * **`defaultStartPaneWidthPx`** is not set. If omitted, built-in ratios apply (~36% two-pane,
     * ~34% three-pane).
     */
    @property({ type: Number, attribute: 'default-start-pane-fraction' })
    accessor defaultStartPaneFraction: number | undefined = undefined;

    /**
     * Initial width in **px** for **pane-3** (end) when **`panes` is `3`**. If omitted, ~28% of the
     * track. Ignored when **`panes` is `2`**.
     */
    @property({ type: Number, attribute: 'default-end-pane-width' })
    accessor defaultEndPaneWidthPx: number | undefined = undefined;

    /** Labels for compact-mode tab buttons. */
    @property({ type: String, attribute: 'pane-1-label' })
    accessor pane1Label = 'Start';

    @property({ type: String, attribute: 'pane-2-label' })
    accessor pane2Label = 'Primary';

    @property({ type: String, attribute: 'pane-3-label' })
    accessor pane3Label = 'End';

    /** Accessible labels for keyboard-resizable separators. */
    @property({ type: String, attribute: 'start-resize-label' })
    accessor startResizeLabel = 'Resize start pane';

    @property({ type: String, attribute: 'end-resize-label' })
    accessor endResizeLabel = 'Resize end pane';

    /** Accessible label for the compact pane switcher. */
    @property({ type: String, attribute: 'compact-nav-label' })
    accessor compactNavLabel = 'Switch visible pane';

    /** Width threshold where split view switches into compact single-pane mode. */
    @property({ type: Number, attribute: 'compact-breakpoint' })
    accessor compactBreakpointPx = COMPACT_BREAKPOINT_PX;

    /** Visible pane while in compact mode. */
    @property({ type: Number, attribute: 'compact-active-pane' })
    accessor compactActivePane: SplitViewPane = 2;

    @state()
    private accessor _leftPx = 0;

    @state()
    private accessor _rightPx = 0;

    @state()
    private accessor _activeDivider: 0 | 1 | 2 = 0;

    @state()
    private accessor _isCompact = false;

    private _trackWidth = 0;
    private _pointerStartX = 0;
    private _dragStartLeft = 0;
    private _dragStartRight = 0;
    private _resizeObserver: ResizeObserver | null = null;
    private _captureEl: HTMLElement | null = null;
    private _activePointerId: number | null = null;

    private _boundMove = (e: PointerEvent) => this._onPointerMove(e);
    private _boundEnd = (e: PointerEvent) => this._onPointerEnd(e);
    private readonly _instanceId = `split-view-${++splitViewInstanceCount}`;

    override connectedCallback() {
      super.connectedCallback();
      this._resizeObserver = new ResizeObserver(() =>
        this._syncFromContainer()
      );
      this._resizeObserver.observe(this);
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this._resizeObserver?.disconnect();
      this._resizeObserver = null;
      this._activeDivider = 0;
      this._activePointerId = null;
      this._captureEl = null;
      this._detachWindowListeners();
    }

    override firstUpdated() {
      this._syncFromContainer();
    }

    override updated(changed: Map<PropertyKey, unknown>) {
      super.updated(changed);

      const shouldResetWidths =
        changed.has('panes') ||
        changed.has('defaultStartPaneWidthPx') ||
        changed.has('defaultStartPaneFraction') ||
        changed.has('defaultEndPaneWidthPx');

      if (changed.has('compactActivePane') || changed.has('panes')) {
        const normalizedPane = normalizeCompactActivePane(
          this.compactActivePane,
          this._paneCount
        );
        if (normalizedPane !== this.compactActivePane) {
          this.compactActivePane = normalizedPane;
          return;
        }
      }

      if (shouldResetWidths) {
        this._leftPx = 0;
        this._rightPx = 0;
        queueMicrotask(() => this._syncFromContainer());
      } else if (changed.has('compactBreakpointPx')) {
        queueMicrotask(() => this._syncFromContainer());
      }
    }

    private _detachWindowListeners() {
      window.removeEventListener('pointermove', this._boundMove);
      window.removeEventListener('pointerup', this._boundEnd);
      window.removeEventListener('pointercancel', this._boundEnd);
    }

    private _syncFromContainer() {
      const w = this.offsetWidth;
      if (!w) return;
      this._trackWidth = w;
      this._isCompact = shouldUseCompactMode(w, this.compactBreakpointPx);

      if (
        this.compactActivePane !==
        normalizeCompactActivePane(this.compactActivePane, this._paneCount)
      ) {
        this.compactActivePane = normalizeCompactActivePane(
          this.compactActivePane,
          this._paneCount
        );
      }

      if (this._leftPx === 0 && this._rightPx === 0) {
        const defaults = getDefaultWidths({
          panes: this._paneCount,
          trackWidth: w,
          defaultStartPaneWidthPx: this.defaultStartPaneWidthPx,
          defaultStartPaneFraction: this.defaultStartPaneFraction,
          defaultEndPaneWidthPx: this.defaultEndPaneWidthPx,
        });
        this._leftPx = defaults.leftPx;
        this._rightPx = defaults.rightPx;
      }

      const widths = clampSplitViewWidths({
        panes: this._paneCount,
        trackWidth: w,
        leftPx: this._leftPx,
        rightPx: this._paneCount === 3 ? this._rightPx : 0,
      });
      this._leftPx = widths.leftPx;
      this._rightPx = widths.rightPx;
    }

    private _onDividerPointerDown(which: 1 | 2, e: PointerEvent) {
      if (this._activeDivider !== 0) return;
      if (e.button !== 0) return;

      e.preventDefault();

      const el = e.currentTarget as HTMLElement;
      this._captureEl = el;
      this._activePointerId = e.pointerId;

      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      this._trackWidth = this.offsetWidth;
      this._pointerStartX = e.clientX;
      this._dragStartLeft = this._leftPx;
      this._dragStartRight = this._rightPx;
      this._activeDivider = which;

      window.addEventListener('pointermove', this._boundMove);
      window.addEventListener('pointerup', this._boundEnd);
      window.addEventListener('pointercancel', this._boundEnd);
    }

    private _onPointerMove(e: PointerEvent) {
      if (this._activeDivider === 0) return;
      if (
        this._activePointerId !== null &&
        e.pointerId !== this._activePointerId
      ) {
        return;
      }

      e.preventDefault();
      const delta = e.clientX - this._pointerStartX;
      if (this._activeDivider === 1) {
        this._leftPx = clampLeftWidth(
          this._dragStartLeft + delta,
          this._trackWidth,
          this._paneCount,
          this._paneCount === 3 ? this._rightPx : 0
        );
      } else if (this._activeDivider === 2 && this._paneCount === 3) {
        this._rightPx = clampRightWidth(
          this._dragStartRight - delta,
          this._trackWidth,
          this._leftPx
        );
      }
    }

    private _onPointerEnd(e: PointerEvent) {
      if (this._activeDivider === 0) return;
      if (
        this._activePointerId !== null &&
        e.pointerId !== this._activePointerId
      ) {
        return;
      }

      if (this._captureEl) {
        try {
          this._captureEl.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        this._captureEl = null;
      }

      this._activePointerId = null;
      this._detachWindowListeners();

      this._activeDivider = 0;
      this._emitResizeEvent('pointer');
    }

    private _emitResizeEvent(source: 'pointer' | 'keyboard') {
      const detail = {
        leftPx: this._leftPx,
        rightPx: this._paneCount === 3 ? this._rightPx : undefined,
        source,
      };

      for (const eventName of ['split-view-resize', 'on-resize']) {
        this.dispatchEvent(
          new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail,
          })
        );
      }
    }

    private _emitCompactPaneChangeEvent() {
      this.dispatchEvent(
        new CustomEvent('split-view-pane-change', {
          bubbles: true,
          composed: true,
          detail: {
            activePane: this.compactActivePane,
            compact: this._isCompact,
          },
        })
      );
    }

    private _setCompactActivePane(
      pane: SplitViewPane,
      options?: { focusTab?: boolean; emit?: boolean }
    ) {
      const nextPane = normalizeCompactActivePane(pane, this._paneCount);
      if (nextPane === this.compactActivePane) {
        if (options?.focusTab) {
          queueMicrotask(() => this._focusCompactTab(nextPane));
        }
        return;
      }

      this.compactActivePane = nextPane;

      if (options?.emit !== false) {
        this._emitCompactPaneChangeEvent();
      }

      if (options?.focusTab) {
        queueMicrotask(() => this._focusCompactTab(nextPane));
      }
    }

    private _focusCompactTab(pane: SplitViewPane) {
      const tab = this.shadowRoot?.getElementById(this._tabId(pane));
      if (tab instanceof HTMLButtonElement) {
        tab.focus();
      }
    }

    private _onCompactTabKeyDown(e: KeyboardEvent, pane: SplitViewPane) {
      const panes = this._paneDefinitions;
      const currentIndex = panes.findIndex(({ pane: value }) => value === pane);
      if (currentIndex === -1) return;

      let targetIndex = currentIndex;
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          targetIndex =
            currentIndex === 0 ? panes.length - 1 : currentIndex - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          targetIndex =
            currentIndex === panes.length - 1 ? 0 : currentIndex + 1;
          break;
        case 'Home':
          targetIndex = 0;
          break;
        case 'End':
          targetIndex = panes.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      this._setCompactActivePane(panes[targetIndex].pane, {
        focusTab: true,
        emit: true,
      });
    }

    private _onDividerKeyDown(which: 1 | 2, e: KeyboardEvent) {
      const next = getKeyboardResizeResult({
        panes: this._paneCount,
        trackWidth: this._trackWidth || this.offsetWidth,
        leftPx: this._leftPx,
        rightPx: this._rightPx,
        divider: which,
        key: e.key,
        shiftKey: e.shiftKey,
      });

      if (!next) return;

      e.preventDefault();
      this._leftPx = next.leftPx;
      this._rightPx = next.rightPx;
      this._emitResizeEvent('keyboard');
    }

    private _paneId(pane: SplitViewPane) {
      return `${this._instanceId}-pane-${pane}`;
    }

    private _tabId(pane: SplitViewPane) {
      return `${this._instanceId}-tab-${pane}`;
    }

    private _dividerLabel(which: 1 | 2) {
      const label = which === 1 ? this.startResizeLabel : this.endResizeLabel;
      const paneLabel =
        which === 1
          ? this._paneLabel(1)
          : this._paneLabel(this._paneCount === 3 ? 3 : 2);
      return `${label}. Use left and right arrow keys to resize ${paneLabel}. Hold Shift for larger steps.`;
    }

    private _paneLabel(pane: SplitViewPane) {
      switch (pane) {
        case 1:
          return this.pane1Label;
        case 2:
          return this.pane2Label;
        case 3:
          return this.pane3Label;
      }
    }

    private get _paneCount(): 2 | 3 {
      return normalizePaneCount(this.panes);
    }

    private get _paneDefinitions() {
      return [
        { pane: 1 as const, label: this.pane1Label, part: 'pane-start' },
        { pane: 2 as const, label: this.pane2Label, part: 'pane-primary' },
        ...(this._paneCount === 3
          ? [{ pane: 3 as const, label: this.pane3Label, part: 'pane-end' }]
          : []),
      ];
    }

    private _renderCompactView() {
      return html`
        <div
          class=${classMap({
            'split-view': true,
            'split-view--compact': true,
          })}
          part="split-view"
        >
          <div
            class="split-view__tabs"
            part="compact-tabs"
            role="tablist"
            aria-label=${this.compactNavLabel}
          >
            ${this._paneDefinitions.map(
              ({ pane, label }) => html`
                <button
                  id=${this._tabId(pane)}
                  class=${classMap({
                    'split-view__tab': true,
                    'split-view__tab--active': this.compactActivePane === pane,
                  })}
                  part="compact-tab"
                  type="button"
                  role="tab"
                  aria-selected=${this.compactActivePane === pane}
                  aria-controls=${this._paneId(pane)}
                  tabindex=${this.compactActivePane === pane ? '0' : '-1'}
                  @click=${() =>
                    this._setCompactActivePane(pane, { emit: true })}
                  @keydown=${(e: KeyboardEvent) =>
                    this._onCompactTabKeyDown(e, pane)}
                >
                  ${label}
                </button>
              `
            )}
          </div>
          <div class="split-view__compact-panels">
            ${this._paneDefinitions.map(
              ({ pane, part }) => html`
                <section
                  id=${this._paneId(pane)}
                  class=${classMap({
                    pane: true,
                    'pane--compact': true,
                    'pane--start': pane === 1,
                    'pane--primary': pane === 2,
                    'pane--end': pane === 3,
                  })}
                  part=${part}
                  role="tabpanel"
                  aria-labelledby=${this._tabId(pane)}
                  ?hidden=${this.compactActivePane !== pane}
                >
                  <slot name=${`pane-${pane}`}></slot>
                </section>
              `
            )}
          </div>
        </div>
      `;
    }

    override render() {
      if (this._isCompact) {
        return this._renderCompactView();
      }

      const d1 = this._activeDivider === 1;
      const d2 = this._activeDivider === 2;
      return html`
        <div class="split-view" part="split-view">
          <div
            class="pane pane--start"
            id=${this._paneId(1)}
            part="pane-start"
            style="flex-basis: ${this._leftPx}px; width: ${this._leftPx}px;"
          >
            <slot name="pane-1"></slot>
          </div>
          <div
            class="split-view__divider split-view__divider--after-start"
            role="separator"
            tabindex="0"
            aria-orientation="vertical"
            aria-controls=${`${this._paneId(1)} ${this._paneId(2)}`}
            aria-label=${this._dividerLabel(1)}
            @pointerdown=${(e: PointerEvent) =>
              this._onDividerPointerDown(1, e)}
            @keydown=${(e: KeyboardEvent) => this._onDividerKeyDown(1, e)}
          >
            <kyn-divider
              vertical
              drag-handle
              decorative
              class=${classMap({
                'right-inverted-handle': this.invertStartDividerGrip,
              })}
              ?hideHairline=${true}
              ?dragging=${d1}
            ></kyn-divider>
          </div>
          <div
            class="pane pane--primary ${this._paneCount === 3
              ? 'pane--primary--flanked'
              : ''}"
            id=${this._paneId(2)}
          >
            <slot name="pane-2"></slot>
          </div>
          ${this._paneCount === 3
            ? html`
                <div
                  class="split-view__divider split-view__divider--before-end"
                  role="separator"
                  tabindex="0"
                  aria-orientation="vertical"
                  aria-controls=${`${this._paneId(2)} ${this._paneId(3)}`}
                  aria-label=${this._dividerLabel(2)}
                  @pointerdown=${(e: PointerEvent) =>
                    this._onDividerPointerDown(2, e)}
                  @keydown=${(e: KeyboardEvent) => this._onDividerKeyDown(2, e)}
                >
                  <kyn-divider
                    vertical
                    drag-handle
                    decorative
                    class=${classMap({
                      'right-inverted-handle': this.invertEndDividerGrip,
                    })}
                    ?hideHairline=${true}
                    ?dragging=${d2}
                  ></kyn-divider>
                </div>
                <div
                  class="pane pane--end"
                  id=${this._paneId(3)}
                  part="pane-end"
                  style="flex-basis: ${this._rightPx}px; width: ${this
                    ._rightPx}px;"
                >
                  <slot name="pane-3"></slot>
                </div>
              `
            : null}
        </div>
      `;
    }
  }

  customElements.define('split-view-pattern', SplitViewPattern);
}
