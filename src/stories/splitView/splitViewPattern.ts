import { LitElement, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, state } from 'lit/decorators.js';

import '../../components/reusable/divider/divider';

const MIN_PANE_PX = 120;
const MIN_CENTER_PX = 160;
const DIVIDER_PX = 8;

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
    accessor panes: 2 | 3 = 3;

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

    @state()
    private accessor _leftPx = 0;

    @state()
    private accessor _rightPx = 0;

    @state()
    private accessor _activeDivider: 0 | 1 | 2 = 0;

    private _trackWidth = 0;
    private _pointerStartX = 0;
    private _dragStartLeft = 0;
    private _dragStartRight = 0;
    private _resizeObserver: ResizeObserver | null = null;
    private _captureEl: HTMLElement | null = null;
    private _activePointerId: number | null = null;

    private _boundMove = (e: PointerEvent) => this._onPointerMove(e);
    private _boundEnd = (e: PointerEvent) => this._onPointerEnd(e);

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
      if (changed.has('panes')) {
        this._leftPx = 0;
        this._rightPx = 0;
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
      if (this._leftPx === 0 && this._rightPx === 0) {
        const startW = this.defaultStartPaneWidthPx;
        const startFrac = this.defaultStartPaneFraction;
        if (startW != null && !Number.isNaN(startW)) {
          this._leftPx = startW;
        } else if (
          startFrac != null &&
          !Number.isNaN(startFrac) &&
          startFrac > 0 &&
          startFrac < 1
        ) {
          this._leftPx = w * startFrac;
        } else if (this.panes === 2) {
          this._leftPx = w * 0.36;
        } else {
          this._leftPx = w * 0.34;
        }
        if (this.panes === 3) {
          const endW = this.defaultEndPaneWidthPx;
          this._rightPx = endW != null && !Number.isNaN(endW) ? endW : w * 0.28;
        }
      }
      this._leftPx = this._clampLeft(this._leftPx);
      if (this.panes === 3) {
        this._rightPx = this._clampRight(this._rightPx);
      }
    }

    private _clampLeft(left: number) {
      const total = this._trackWidth || this.offsetWidth;
      if (this.panes === 2) {
        const maxLeft = Math.max(
          MIN_PANE_PX,
          total - DIVIDER_PX - MIN_CENTER_PX
        );
        return Math.min(Math.max(MIN_PANE_PX, left), maxLeft);
      }
      const maxLeft = Math.max(
        MIN_PANE_PX,
        total - 2 * DIVIDER_PX - this._rightPx - MIN_CENTER_PX
      );
      return Math.min(Math.max(MIN_PANE_PX, left), maxLeft);
    }

    private _clampRight(right: number) {
      const total = this._trackWidth || this.offsetWidth;
      const maxRight = Math.max(
        MIN_PANE_PX,
        total - 2 * DIVIDER_PX - this._leftPx - MIN_CENTER_PX
      );
      return Math.min(Math.max(MIN_PANE_PX, right), maxRight);
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
        this._leftPx = this._clampLeft(this._dragStartLeft + delta);
      } else if (this._activeDivider === 2 && this.panes === 3) {
        this._rightPx = this._clampRight(this._dragStartRight - delta);
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

      this.dispatchEvent(
        new CustomEvent('on-resize', {
          bubbles: true,
          composed: true,
          detail: {
            leftPx: this._leftPx,
            rightPx: this.panes === 3 ? this._rightPx : undefined,
          },
        })
      );
    }

    override render() {
      const d1 = this._activeDivider === 1;
      const d2 = this._activeDivider === 2;
      return html`
        <div class="split-view" part="split-view">
          <div
            class="pane pane--start"
            part="pane-start"
            style="flex-basis: ${this._leftPx}px; width: ${this._leftPx}px;"
          >
            <slot name="pane-1"></slot>
          </div>
          <div
            class="split-view__divider split-view__divider--after-start"
            @pointerdown=${(e: PointerEvent) =>
              this._onDividerPointerDown(1, e)}
          >
            <kyn-divider
              vertical
              drag-handle
              class=${classMap({
                'right-inverted-handle': this.invertStartDividerGrip,
              })}
              ?hideHairline=${true}
              ?dragging=${d1}
            ></kyn-divider>
          </div>
          <div
            class="pane pane--primary ${this.panes === 3
              ? 'pane--primary--flanked'
              : ''}"
          >
            <slot name="pane-2"></slot>
          </div>
          ${this.panes === 3
            ? html`
                <div
                  class="split-view__divider split-view__divider--before-end"
                  @pointerdown=${(e: PointerEvent) =>
                    this._onDividerPointerDown(2, e)}
                >
                  <kyn-divider
                    vertical
                    drag-handle
                    class=${classMap({
                      'right-inverted-handle': this.invertEndDividerGrip,
                    })}
                    ?hideHairline=${true}
                    ?dragging=${d2}
                  ></kyn-divider>
                </div>
                <div
                  class="pane pane--end"
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
