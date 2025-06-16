import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../button';
import PopoverScss from './popover.scss';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type Dir = 'top' | 'bottom' | 'left' | 'right';
type AnchorPos = 'start' | 'center' | 'end';

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}
interface Coords {
  top: number;
  left: number;
}
interface PositionResult {
  dir: Dir;
  anchorPos: AnchorPos;
  coords: Coords;
  arrowOffset: number;
}

const GUTTER = 8;
const OFFSET_DIM = 22;
const ARROW_HALF = 6;
const SIZE_RATIO_MAP: Record<
  'mini' | 'narrow' | 'wide',
  {
    gap: number;
    shift: number;
    arrow: number;
  }
> = {
  mini: { gap: 0.15, shift: -0.35, arrow: 0.03 },
  narrow: { gap: 0.025, shift: -0.045, arrow: 0.06 },
  wide: { gap: 0.15, shift: -0.2, arrow: 0.08 },
};

/**
 * Popover component.
 *
 * - anchor: positioned relative to an anchor slot
 * - floating: manually positioned via top/left/bottom/right
 *
 * @slot anchor - The trigger element (icon, button, link, etc.)
 * @slot default - The popover body content
 * @slot footer - Optional custom footer (replaces default buttons)
 *
 * @fires on-close - Emitted when any action closes the popover
 */
@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /**
   * Determines whether popover is anchored to launch element
   */
  @property({ type: Boolean, reflect: true })
  isAnchored = false;

  /**
   * Manual direction or auto (anchor mode only)
   */
  @property({ type: String, reflect: true })
  direction: Dir | 'auto' = 'auto';

  /** how we style the anchor slot */
  @property({ type: String, reflect: true })
  triggerType: 'icon' | 'link' | 'button' = 'button';

  /**
   * Size variant
   */
  @property({ type: String })
  popoverSize: 'mini' | 'narrow' | 'wide' = 'mini';

  /**
   * Body title text
   */
  @property({ type: String })
  titleText = '';

  /**
   * Changes the primary button styles to indicate a destructive action
   */
  @property({ type: Boolean })
  destructive = false;

  /**
   * Body subtitle/label
   */
  @property({ type: String })
  labelText = '';

  /**
   * OK button label
   */
  @property({ type: String })
  okText = 'OK';

  /**
   * Cancel button label
   */
  @property({ type: String })
  cancelText = 'Cancel';

  /**
   * Secondary button text
   */
  @property({ type: String })
  secondaryButtonText = 'Secondary';

  /**
   * Show or hide the secondary button
   */
  @property({ type: Boolean })
  showSecondaryButton = false;

  /**
   * Hide the entire footer
   */
  @property({ type: Boolean })
  hideFooter = false;

  /**
   * Whether popover is open
   */
  @property({ type: Boolean })
  open = false;

  /**
   * Close button description text
   */
  @property({ type: String })
  closeText = 'Close';

  // Floating-only offset props
  /** Top position value. */
  @property({ type: String })
  top?: string;

  /** Left position value. */
  @property({ type: String })
  left?: string;

  /** Bottom position value. */
  @property({ type: String })
  bottom?: string;

  /** Right position value. */
  @property({ type: String })
  right?: string;

  /** Optional manual offset for tooltip-like triangular shaped arrow. */
  @property({ type: String, reflect: true })
  arrowOffset?: string;

  /**
   * Horizontal offset in px for anchored panel.
   */
  @property({ type: Number, attribute: 'offset-x' })
  offsetX = 0;

  /**
   * Vertical offset in px for anchored panel.
   */
  @property({ type: Number, attribute: 'offset-y' })
  offsetY = 0;

  /**
   * The computed direction of the popover panel when `direction="auto"`.
   * One of 'top', 'bottom', 'left', or 'right'.
   * @private
   */
  @state()
  private _calculatedDirection: Dir = 'bottom';

  /**
   * The computed anchor alignment relative to the trigger element.
   * One of 'start', 'center', or 'end'.
   * @private
   */
  @state()
  private _anchorPosition: AnchorPos = 'center';

  /**
   * The computed panel coordinates for positioning.
   * Contains `top` and `left` in pixels.
   * @private
   */
  @state()
  private _coords: Coords = { top: 0, left: 0 };

  override render() {
    const hasHeader = !!(this.titleText || this.labelText);
    const dir =
      this.direction === 'auto' ? this._calculatedDirection : this.direction;

    const panelClasses = {
      [`direction--${dir}`]: true,
      ...(this.isAnchored && { [`anchor--${this._anchorPosition}`]: true }),
      [`popover-size--${this.popoverSize}`]: true,
      'popover-inner': true,
      open: this.open,
      'no-header-text': !hasHeader,
    };

    return html`
      <div class="popover">
        <span class="anchor" @click=${this._toggle}>
          <slot name="anchor"></slot>
        </span>
        ${this.open
          ? html` <div
              class=${classMap(panelClasses)}
              style=${this._getPanelStyle()}
            >
              ${this.popoverSize === 'mini'
                ? html` <div class="mini-header">
                    <div class="mini-content"><slot></slot></div>
                    <kyn-button
                      class="close"
                      kind="ghost"
                      size="small"
                      description=${this.closeText}
                      @click=${() => this._handleAction('cancel')}
                    >
                      ${unsafeSVG(closeIcon)}
                    </kyn-button>
                  </div>`
                : html` <header>
                      ${this.titleText
                        ? html`<h1>${this.titleText}</h1>`
                        : null}
                      ${this.labelText
                        ? html`<span class="label">${this.labelText}</span>`
                        : null}
                      <kyn-button
                        class="close"
                        kind="ghost"
                        size="small"
                        description=${this.closeText}
                        @click=${() => this._handleAction('cancel')}
                      >
                        ${unsafeSVG(closeIcon)}
                      </kyn-button>
                    </header>
                    <div class="body"><slot></slot></div>`}
              ${!this.hideFooter && this.popoverSize !== 'mini'
                ? html` <slot name="footer">
                    <div class="footer">
                      <kyn-button
                        class="action-button"
                        value="ok"
                        size="small"
                        kind=${this.destructive
                          ? 'primary-destructive'
                          : 'primary'}
                        @click=${() => this._handleAction('ok')}
                      >
                        ${this.okText}
                      </kyn-button>
                      ${this.showSecondaryButton
                        ? html` <kyn-button
                            class="action-button"
                            value="secondary"
                            size="small"
                            kind="secondary"
                            @click=${() => this._handleAction('secondary')}
                          >
                            ${this.secondaryButtonText}
                          </kyn-button>`
                        : null}
                    </div>
                  </slot>`
                : null}
            </div>`
          : null}
      </div>
    `;
  }

  private _getPanelStyle = (): string => {
    if (this.isAnchored) {
      return `position: fixed; top: ${this._coords.top}px; left: ${this._coords.left}px;`;
    }
    let s = 'position: fixed;';
    if (this.top) s += `top: ${this.top};`;
    if (this.left) s += `left: ${this.left};`;
    if (this.bottom) s += `bottom: ${this.bottom};`;
    if (this.right) s += `right: ${this.right};`;
    return s;
  };

  override updated(changed: Map<string, unknown>) {
    if (
      this.isAnchored &&
      ((changed.has('open') && this.open) || changed.has('arrowOffset'))
    ) {
      this.updateComplete.then(() => this._position());
    }
  }

  private _toggle = (): void => {
    this.open = !this.open;
  };

  private _handleAction = (action: 'ok' | 'cancel' | 'secondary'): void => {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  };

  private chooseDirection = (a: Rect, p: Rect): Dir => {
    const space = {
      top: a.top,
      bottom: window.innerHeight - a.bottom,
      left: a.left,
      right: window.innerWidth - a.right,
    };
    const sideNeeded = p.width + OFFSET_DIM;

    if (this.popoverSize === 'mini') {
      if (space.bottom >= p.height + OFFSET_DIM) return 'bottom';
      if (space.top >= p.height + OFFSET_DIM) return 'top';
    }

    if (space.left >= sideNeeded) return 'left';
    if (space.right >= sideNeeded) return 'right';

    if (space.bottom >= p.height + OFFSET_DIM) return 'bottom';
    return 'top';
  };

  private chooseAnchorPos = (a: Rect, dir: Dir): AnchorPos => {
    if (dir === 'top' || dir === 'bottom') {
      const cx = a.left + a.width / 2;
      if (cx < a.left + a.width * 0.33) return 'start';
      if (cx > a.left + a.width * 0.67) return 'end';
      return 'center';
    } else {
      const cy = a.top + a.height / 2;
      if (cy < a.top + a.height * 0.33) return 'start';
      if (cy > a.top + a.height * 0.67) return 'end';
      return 'center';
    }
  };

  private calcCoords = (a: Rect, p: Rect, dir: Dir): Coords => {
    let top: number, left: number;
    if (dir === 'top' || dir === 'bottom') {
      const idealLeft = a.left;
      left = Math.min(
        Math.max(idealLeft, GUTTER),
        window.innerWidth - p.width - GUTTER
      );
      const rawTop =
        dir === 'top' ? a.top - p.height - OFFSET_DIM : a.bottom + OFFSET_DIM;
      top = Math.min(
        Math.max(rawTop, GUTTER),
        window.innerHeight - p.height - GUTTER
      );
    } else {
      const idealTop = a.top + a.height / 2 - p.height / 2;
      top = Math.min(
        Math.max(idealTop, GUTTER),
        window.innerHeight - p.height - GUTTER
      );
      const rawLeft =
        dir === 'left'
          ? a.left - p.width - OFFSET_DIM / 2
          : a.right + OFFSET_DIM / 2;
      left = Math.min(
        Math.max(rawLeft, GUTTER),
        window.innerWidth - p.width - GUTTER
      );
    }
    return { top, left };
  };

  private clampArrowOffset = (rawOffset: number, panelSize: number): number =>
    Math.max(ARROW_HALF, Math.min(rawOffset, panelSize - ARROW_HALF));

  private autoPosition = (
    anchorEl: HTMLElement,
    panelEl: HTMLElement,
    forceDir?: Dir,
    manualArrowOffset?: number
  ): PositionResult => {
    const a = anchorEl.getBoundingClientRect() as Rect;
    const p = panelEl.getBoundingClientRect() as Rect;
    const dir = forceDir ?? this.chooseDirection(a, p);

    let coords: Coords;
    let arrowOffset: number;

    if (dir === 'top' || dir === 'bottom') {
      coords = this.calcCoords(a, p, dir);

      const {
        gap: gR,
        shift: sR,
        arrow: aR,
      } = SIZE_RATIO_MAP[this.popoverSize];
      const gap = p.width * gR;
      const shiftX = p.width * sR;
      const rawX = a.left + a.width / 2 - coords.left + shiftX;

      coords.left += dir === 'top' ? 0 : 0;
      arrowOffset = manualArrowOffset ?? this.clampArrowOffset(rawX, p.width);
    } else {
      const {
        gap: gR,
        shift: sR,
        arrow: aR,
      } = SIZE_RATIO_MAP[this.popoverSize];
      const gap = p.height * gR;
      const shiftY = p.height * sR;
      const arrowDy = p.height * aR;

      const desiredTop = a.top + shiftY;
      const top = Math.min(
        Math.max(desiredTop, GUTTER),
        window.innerHeight - p.height - GUTTER
      );
      const left = dir === 'left' ? a.left - p.width - gap : a.right + gap;
      coords = { top, left };

      arrowOffset = manualArrowOffset ?? arrowDy;
    }

    return {
      dir,
      anchorPos: this.chooseAnchorPos(a, dir),
      coords,
      arrowOffset,
    };
  };

  private _position = (): void => {
    requestAnimationFrame(() => {
      const anchor = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;
      if (!anchor || !panel) return;

      const manual = parseFloat(this.arrowOffset ?? '');
      const { dir, anchorPos, coords, arrowOffset } =
        this.direction === 'auto'
          ? this.autoPosition(anchor, panel)
          : this.autoPosition(
              anchor,
              panel,
              this.direction as Dir,
              isNaN(manual) ? undefined : manual
            );

      this._calculatedDirection = dir;
      this._anchorPosition = anchorPos;
      this._coords = coords;

      panel.style.top = `${coords.top}px`;
      panel.style.left = `${coords.left}px`;
      panel.style.setProperty('--arrow-offset', `${arrowOffset}px`);
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
