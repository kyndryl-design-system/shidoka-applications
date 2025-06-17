import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../button';
import PopoverScss from './popover.scss';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

type Dir = 'top' | 'bottom' | 'left' | 'right';
type AnchorPosition = 'start' | 'center' | 'end';
type AnchorPoint =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
type PositionType = 'fixed' | 'absolute';

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
  anchorPos: AnchorPosition;
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
 * Two positioning modes are available:
 * - anchor: positioned relative to an anchor slot element
 * - floating: manually positioned via top/left/bottom/right properties
 *
 * For anchor mode, the popover will be positioned relative to the anchor element
 * based on the direction and anchorPoint properties. The position can be fixed or absolute.
 *
 * For floating (manual) mode, set anchorType="none" and use top/left/bottom/right
 * properties to position the popover.
 *
 * @slot anchor - The trigger element (icon, button, link, etc.)
 * @slot default - The popover body content
 * @slot header - Optional custom header (replaces default title/label)
 * @slot footer - Optional custom footer (replaces default buttons)
 *
 * @fires on-close - Emitted when any action closes the popover
 * @fires on-open - Emitted when popover opens
 */
@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /**
   * Manual direction or auto (anchor mode only)
   */
  @property({ type: String, reflect: true })
  direction: Dir | 'auto' = 'auto';

  /**
   * The anchor point for positioning the popover
   */
  @property({ type: String })
  anchorPoint: AnchorPoint = 'center';

  /**
   * Use modern positioning API when available
   */
  @property({ type: Boolean })
  useModernPositioning = true;

  /**
   * Position type: fixed (default) or absolute
   * - fixed: positions relative to the viewport
   * - absolute: positions relative to the nearest positioned ancestor
   */
  @property({ type: String })
  positionType: PositionType = 'fixed';

  /** how we style the anchor slot */
  @property({ type: String, reflect: true })
  anchorType: 'icon' | 'link' | 'button' | 'none' = 'button';

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
   * Hide the header (title and label)
   */
  @property({ type: Boolean })
  hideHeader = false;

  /**
   * Whether popover is open
   */
  @property({ type: Boolean })
  open = false;

  /**
   * Enable full screen mode on mobile devices
   */
  @property({ type: Boolean })
  fullScreenOnMobile = false;

  /**
   * Auto focus the first focusable element when opened
   */
  @property({ type: Boolean })
  autoFocus = true;

  /**
   * Maximum height of the popover body (e.g., "300px", "50vh")
   */
  @property({ type: String, attribute: 'max-height' })
  maxHeight?: string;

  /**
   * Animation duration in milliseconds
   */
  @property({ type: Number, attribute: 'animation-duration' })
  animationDuration = 200;

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
   * Z-index for the popover.
   */
  @property({ type: Number, attribute: 'z-index' })
  zIndex?: number;

  /**
   * Responsive breakpoints for adjusting position.
   * Format: "breakpoint:prop:value|breakpoint:prop:value"
   * Example: "768:top:10%|480:left:5%"
   */
  @property({ type: String, attribute: 'responsive-position' })
  responsivePosition?: string;

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
  private _anchorPosition: AnchorPosition = 'center';

  /**
   * The computed panel coordinates for positioning.
   * Contains `top` and `left` in pixels.
   * @private
   */
  @state()
  private _coords: Coords = { top: 0, left: 0 };

  private _resizeObserver: ResizeObserver | null = null;
  private _keyboardListener: ((e: Event) => void) | null = null;
  private _previouslyFocusedElement: HTMLElement | null = null;
  private _focusableElements: NodeListOf<HTMLElement> | null = null;
  private _positionDebounceTimeout: number | null = null;
  private _debounceDelay = 100;

  /**
   * Opens the popover programmatically
   */
  public openPopover(): void {
    this.open = true;
  }

  /**
   * Closes the popover programmatically
   */
  public closePopover(): void {
    this.open = false;
  }

  override render() {
    const hasHeader = !!(this.titleText || this.labelText);
    const dir =
      this.direction === 'auto' ? this._calculatedDirection : this.direction;

    const panelClasses = {
      [`direction--${dir}`]: true,
      ...(this.anchorType !== 'none' && {
        [`anchor--${this._anchorPosition}`]: true,
      }),
      [`popover-size--${this.popoverSize}`]: true,
      'popover-inner': true,
      open: this.open,
      'no-header-text': !hasHeader,
      'fullscreen-mobile': this.fullScreenOnMobile,
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
                : html` ${!this.hideHeader
                      ? html`<header>
                          <slot name="header">
                            ${this.titleText
                              ? html`<h1 id="popover-title">
                                  ${this.titleText}
                                </h1>`
                              : null}
                            ${this.labelText
                              ? html`<span class="label"
                                  >${this.labelText}</span
                                >`
                              : null}
                          </slot>
                          <kyn-button
                            class="close"
                            kind="ghost"
                            size="small"
                            description=${this.closeText}
                            @click=${() => this._handleAction('cancel')}
                          >
                            ${unsafeSVG(closeIcon)}
                          </kyn-button>
                        </header>`
                      : null}
                    <div class="body" id="popover-content"><slot></slot></div>`}
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

  /**
   * Gets a new z-index value for stacking popovers
   * @returns incremented z-index value
   */
  private _getZIndex(): number {
    return this.zIndex ?? 1000;
  }

  private _getPanelStyle = (): string => {
    let style = '';
    const position = this.positionType || 'fixed';

    if (this.zIndex !== undefined) {
      style += `z-index: ${this.zIndex};`;
    }

    if (this.anchorType !== 'none') {
      return `position: ${position}; top: ${this._coords.top}px; left: ${this._coords.left}px; ${style}`;
    }

    let panelPosition = `position: ${position};`;
    if (this.top) panelPosition += `top: ${this.top};`;
    if (this.left) panelPosition += `left: ${this.left};`;
    if (this.bottom) panelPosition += `bottom: ${this.bottom};`;
    if (this.right) panelPosition += `right: ${this.right};`;

    return panelPosition + style;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeyDown as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(
      'keydown',
      this._handleKeyDown as EventListener
    );
    this._removeResizeObserver();
    this._removeFocusTrap();

    if (this._positionDebounceTimeout !== null) {
      window.clearTimeout(this._positionDebounceTimeout);
      this._positionDebounceTimeout = null;
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        if (this.anchorType !== 'none') {
          this.updateComplete.then(() => this._position());
        }
        this._setupFocusTrap();
        this._addResizeObserver();
        this._applyResponsivePosition();
        this.dispatchEvent(new CustomEvent('on-open'));
      } else {
        this._removeFocusTrap();
        this._removeResizeObserver();
      }
    } else if (
      this.anchorType !== 'none' &&
      this.open &&
      (changed.has('arrowOffset') ||
        changed.has('anchorPoint') ||
        changed.has('positionType'))
    ) {
      this.updateComplete.then(() => this._position());
    } else if (changed.has('animationDuration') && this.animationDuration) {
      this.style.setProperty(
        '--kyn-popover-animation-duration',
        `${this.animationDuration}ms`
      );
    } else if (changed.has('maxHeight') && this.maxHeight) {
      const body = this.shadowRoot?.querySelector('.body') as HTMLElement;
      if (body) {
        body.style.maxHeight = this.maxHeight;
      }
    } else if (changed.has('responsivePosition') && this.open) {
      this._applyResponsivePosition();
    }
  }

  private _handleKeyDown = (e: Event): void => {
    const keyEvent = e as KeyboardEvent;
    if (keyEvent.key === 'Escape' && this.open) {
      this._handleAction('cancel');
    }
  };

  private _toggle = (): void => {
    this.open = !this.open;
  };

  private _handleAction = (action: 'ok' | 'cancel' | 'secondary'): void => {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  };

  private chooseDirection = (anchor: Rect, panel: Rect): Dir => {
    const space = {
      top: anchor.top,
      bottom: window.innerHeight - anchor.bottom,
      left: anchor.left,
      right: window.innerWidth - anchor.right,
    };
    const sideNeeded = panel.width + OFFSET_DIM;

    const verticalSpaceNeeded =
      this.popoverSize === 'mini'
        ? panel.height + 10
        : panel.height + OFFSET_DIM;

    if (this.popoverSize === 'mini') {
      if (space.bottom >= verticalSpaceNeeded) return 'bottom';
      if (space.top >= verticalSpaceNeeded) return 'top';
    }

    if (space.left >= sideNeeded) return 'left';
    if (space.right >= sideNeeded) return 'right';

    if (space.bottom >= panel.height + OFFSET_DIM) return 'bottom';
    return 'top';
  };

  private chooseAnchorPos = (anchor: Rect, dir: Dir): AnchorPosition => {
    if (dir === 'top' || dir === 'bottom') {
      const anchorHorizontalCenter = anchor.left + anchor.width / 2;
      if (anchorHorizontalCenter < anchor.left + anchor.width * 0.33)
        return 'start';
      if (anchorHorizontalCenter > anchor.left + anchor.width * 0.67)
        return 'end';
      return 'center';
    } else {
      const anchorVerticalCenter = anchor.top + anchor.height / 2;
      if (anchorVerticalCenter < anchor.top + anchor.height * 0.33)
        return 'start';
      if (anchorVerticalCenter > anchor.top + anchor.height * 0.67)
        return 'end';
      return 'center';
    }
  };

  private calcCoords = (anchor: Rect, panel: Rect, dir: Dir): Coords => {
    let top: number, left: number;
    if (dir === 'top' || dir === 'bottom') {
      const verticalOffset = 10;

      const idealLeft = anchor.left;
      left = Math.min(
        Math.max(idealLeft, GUTTER),
        window.innerWidth - panel.width - GUTTER
      );
      const rawTop =
        dir === 'top'
          ? anchor.top - panel.height - verticalOffset
          : anchor.bottom + verticalOffset;
      top = Math.min(
        Math.max(rawTop, GUTTER),
        window.innerHeight - panel.height - GUTTER
      );
    } else {
      const anchorVerticalCenter = anchor.top + anchor.height / 2;
      const topOffset = 30;
      const calcTop = anchorVerticalCenter - topOffset;

      top = Math.min(
        Math.max(calcTop, GUTTER),
        window.innerHeight - panel.height - GUTTER
      );
      const rawLeft =
        dir === 'left'
          ? anchor.left - panel.width - OFFSET_DIM / 2
          : anchor.right + OFFSET_DIM / 2;
      left = Math.min(
        Math.max(rawLeft, GUTTER),
        window.innerWidth - panel.width - GUTTER
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
    const anchor = anchorEl.getBoundingClientRect() as Rect;
    const panel = panelEl.getBoundingClientRect() as Rect;
    const dir = forceDir ?? this.chooseDirection(anchor, panel);

    let coords: Coords;
    let arrowOffset: number;

    if (dir === 'top' || dir === 'bottom') {
      coords = this.calcCoords(anchor, panel, dir);

      const { shift: sR } = SIZE_RATIO_MAP[this.popoverSize];
      const shiftX = panel.width * sR;
      const rawX = anchor.left + anchor.width / 2 - coords.left + shiftX;

      coords.left += dir === 'top' ? 0 : 0;
      arrowOffset =
        manualArrowOffset ?? this.clampArrowOffset(rawX, panel.width);
    } else {
      const {
        gap: gR,
        shift: sR,
        arrow: aR,
      } = SIZE_RATIO_MAP[this.popoverSize];
      const gap = panel.height * gR;
      const shiftY = panel.height * sR;
      const arrowDy = panel.height * aR;

      const desiredTop = anchor.top + shiftY;
      const top = Math.min(
        Math.max(desiredTop, GUTTER),
        window.innerHeight - panel.height - GUTTER
      );
      const left =
        dir === 'left' ? anchor.left - panel.width - gap : anchor.right + gap;
      coords = { top, left };

      arrowOffset = manualArrowOffset ?? arrowDy;
    }

    return {
      dir,
      anchorPos: this.chooseAnchorPos(anchor, dir),
      coords,
      arrowOffset,
    };
  };

  private _setupFocusTrap(): void {
    if (!this.open) return;

    const panel = this.shadowRoot!.querySelector('.popover-inner');
    if (!panel) return;

    this._previouslyFocusedElement = document.activeElement as HTMLElement;

    this._focusableElements = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (this._focusableElements.length) {
      if (this.autoFocus) {
        (this._focusableElements[0] as HTMLElement).focus();
      }

      this._keyboardListener = (e: Event) => {
        const keyEvent = e as KeyboardEvent;

        if (keyEvent.key === 'Tab') {
          const firstFocusable = this._focusableElements![0] as HTMLElement;
          const lastFocusable = this._focusableElements![
            this._focusableElements!.length - 1
          ] as HTMLElement;

          if (keyEvent.shiftKey && document.activeElement === firstFocusable) {
            keyEvent.preventDefault();
            lastFocusable.focus();
          } else if (
            !keyEvent.shiftKey &&
            document.activeElement === lastFocusable
          ) {
            keyEvent.preventDefault();
            firstFocusable.focus();
          }
          return;
        }

        if (
          [
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End',
          ].includes(keyEvent.key)
        ) {
          keyEvent.preventDefault();

          if (!this._focusableElements || this._focusableElements.length === 0)
            return;

          const currentIndex = Array.from(this._focusableElements).findIndex(
            (el) => el === document.activeElement
          );

          let nextIndex = currentIndex;

          switch (keyEvent.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
              nextIndex =
                currentIndex > 0
                  ? currentIndex - 1
                  : this._focusableElements.length - 1;
              break;
            case 'ArrowDown':
            case 'ArrowRight':
              nextIndex =
                currentIndex < this._focusableElements.length - 1
                  ? currentIndex + 1
                  : 0;
              break;
            case 'Home':
              nextIndex = 0;
              break;
            case 'End':
              nextIndex = this._focusableElements.length - 1;
              break;
          }

          if (nextIndex !== currentIndex) {
            (this._focusableElements[nextIndex] as HTMLElement).focus();
          }
        }
      };

      panel.addEventListener('keydown', this._keyboardListener);
    }
  }

  private _removeFocusTrap(): void {
    if (this._keyboardListener) {
      const panel = this.shadowRoot!.querySelector('.popover-inner');
      if (panel) {
        panel.removeEventListener('keydown', this._keyboardListener);
      }
      this._keyboardListener = null;
    }

    if (this._previouslyFocusedElement) {
      this._previouslyFocusedElement.focus();
      this._previouslyFocusedElement = null;
    }

    this._focusableElements = null;
  }

  private _debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      if (this._positionDebounceTimeout !== null) {
        window.clearTimeout(this._positionDebounceTimeout);
      }
      this._positionDebounceTimeout = window.setTimeout(() => {
        fn.apply(this, args);
        this._positionDebounceTimeout = null;
      }, delay);
    };
  }

  private _addResizeObserver() {
    if (this._resizeObserver) return;

    const debouncedPosition = this._debounce(() => {
      if (this.open && this.anchorType !== 'none') this._position();
    }, this._debounceDelay);

    this._resizeObserver = new ResizeObserver(debouncedPosition);

    const panel = this.shadowRoot!.querySelector('.popover-inner');
    if (panel) this._resizeObserver.observe(panel);

    const anchor = this.shadowRoot!.querySelector('.anchor');
    if (anchor) this._resizeObserver.observe(anchor);
  }

  private _removeResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    if (this._positionDebounceTimeout !== null) {
      window.clearTimeout(this._positionDebounceTimeout);
      this._positionDebounceTimeout = null;
    }
  }

  private _getAnchorPoint(anchorRect: Rect): { x: number; y: number } {
    const { left, right, top, bottom, width, height } = anchorRect;

    switch (this.anchorPoint) {
      case 'top':
        return { x: left + width / 2, y: top };
      case 'bottom':
        return { x: left + width / 2, y: bottom };
      case 'left':
        return { x: left, y: top + height / 2 };
      case 'right':
        return { x: right, y: top + height / 2 };
      case 'top-left':
        return { x: left, y: top };
      case 'top-right':
        return { x: right, y: top };
      case 'bottom-left':
        return { x: left, y: bottom };
      case 'bottom-right':
        return { x: right, y: bottom };
      case 'center':
      default:
        return { x: left + width / 2, y: top + height / 2 };
    }
  }

  private _position = (): void => {
    if (
      this.useModernPositioning &&
      typeof window !== 'undefined' &&
      'ResizeObserver' in window
    ) {
      this._positionWithModernAPI();
    } else {
      this._positionWithLegacy();
    }
  };

  private _positionWithModernAPI = (): void => {
    requestAnimationFrame(() => {
      const anchor = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;
      if (!anchor || !panel) return;

      let anchorElement: HTMLElement;
      const slottedElements = (
        anchor.querySelector('slot[name="anchor"]') as HTMLSlotElement | null
      )?.assignedElements();

      if (slottedElements && slottedElements.length > 0) {
        anchorElement = slottedElements[0] as HTMLElement;
      } else {
        anchorElement = anchor;
      }

      const anchorRect = anchorElement.getBoundingClientRect() as Rect;
      const panelRect = panel.getBoundingClientRect() as Rect;

      const wasHidden = panel.style.visibility === 'hidden';
      if (wasHidden) {
        panel.style.visibility = 'visible';
        panel.style.opacity = '0';
      }

      const dir =
        this.direction === 'auto'
          ? this.chooseDirection(anchorRect, panelRect)
          : (this.direction as Dir);

      const anchorPoint = this._getAnchorPoint(anchorRect);

      const manualArrowOffset = parseFloat(this.arrowOffset ?? '');
      let arrowOffset: number;

      if (!isNaN(manualArrowOffset)) {
        arrowOffset = manualArrowOffset;
      } else if (dir === 'top' || dir === 'bottom') {
        const panelLeft = panel.getBoundingClientRect().left;
        arrowOffset = Math.max(
          ARROW_HALF,
          Math.min(anchorPoint.x - panelLeft, panelRect.width - ARROW_HALF)
        );
      } else {
        const panelTop = panel.getBoundingClientRect().top;

        if (this.anchorType === 'link' || this.anchorType === 'button') {
          const linkCenterY = anchorRect.top + anchorRect.height / 2;
          arrowOffset = Math.max(
            ARROW_HALF,
            Math.min(linkCenterY - panelTop, panelRect.height - ARROW_HALF)
          );
        } else {
          arrowOffset = Math.max(
            ARROW_HALF,
            Math.min(anchorPoint.y - panelTop, panelRect.height - ARROW_HALF)
          );
        }
      }

      this._calculatedDirection = dir;

      const coords = this.calcCoords(anchorRect, panelRect, dir);
      coords.top += this.offsetY;
      coords.left += this.offsetX;

      this._coords = coords;

      panel.style.top = `${coords.top}px`;
      panel.style.left = `${coords.left}px`;
      panel.style.setProperty('--arrow-offset', `${arrowOffset}px`);

      if (wasHidden) {
        panel.style.opacity = '';
      }

      let transformOrigin = 'center';
      switch (dir) {
        case 'top':
          transformOrigin = 'bottom center';
          break;
        case 'bottom':
          transformOrigin = 'top center';
          break;
        case 'left':
          transformOrigin = 'right center';
          break;
        case 'right':
          transformOrigin = 'left center';
          break;
      }
      panel.style.setProperty('--transform-origin', transformOrigin);
    });
  };

  private _positionWithLegacy = (): void => {
    requestAnimationFrame(() => {
      const anchor = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;
      if (!anchor || !panel) return;

      const manual = parseFloat(this.arrowOffset ?? '');
      let manualOffset = undefined;
      if (!isNaN(manual)) {
        manualOffset = manual;
      }

      const { dir, anchorPos, coords, arrowOffset } =
        this.direction === 'auto'
          ? this.autoPosition(anchor, panel, undefined, manualOffset)
          : this.autoPosition(
              anchor,
              panel,
              this.direction as Dir,
              manualOffset
            );

      this._calculatedDirection = dir;
      this._anchorPosition = anchorPos;
      this._coords = coords;

      panel.style.top = `${coords.top}px`;
      panel.style.left = `${coords.left}px`;
      panel.style.setProperty('--arrow-offset', `${arrowOffset}px`);
    });
  };

  private _applyResponsivePosition(): void {
    if (!this.responsivePosition || !this.open) return;

    requestAnimationFrame(() => {
      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;
      if (!panel) return;

      const viewportWidth = window.innerWidth;
      const rules = this.responsivePosition?.split('|') || [];
      const sortedRules = rules
        .map((rule) => {
          const [breakpoint, prop, value] = rule.split(':');
          return {
            breakpoint: parseInt(breakpoint, 10),
            prop,
            value,
          };
        })
        .sort((a, b) => b.breakpoint - a.breakpoint);

      for (const rule of sortedRules) {
        if (viewportWidth <= rule.breakpoint) {
          switch (rule.prop) {
            case 'top':
            case 'left':
            case 'bottom':
            case 'right':
              panel.style[rule.prop] = rule.value;
              break;
            case 'offset-x':
              if (this.anchorType !== 'none') {
                const offsetX = parseInt(rule.value, 10);
                if (!isNaN(offsetX)) {
                  this._coords.left += offsetX;
                  panel.style.left = `${this._coords.left}px`;
                }
              }
              break;
            case 'offset-y':
              if (this.anchorType !== 'none') {
                const offsetY = parseInt(rule.value, 10);
                if (!isNaN(offsetY)) {
                  this._coords.top += offsetY;
                  panel.style.top = `${this._coords.top}px`;
                }
              }
              break;
          }
        }
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
