import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../button';
import PopoverScss from './popover.scss';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import {
  Dir,
  AnchorPosition,
  AnchorPoint,
  PositionType,
  Coords,
  Rect,
  getPanelStyle,
  setupFocusTrap,
  removeFocusTrap,
  debounce,
  applyResponsivePosition,
  chooseDirection,
  calcCoords,
  autoPosition,
  getAnchorPoint,
} from '../../../common/helpers/popoverHelper';

const ARROW_HALF = 6;

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

  private _getPanelStyle = (): string => {
    return getPanelStyle(
      this.positionType,
      this.zIndex,
      this.anchorType,
      this._coords,
      this.top,
      this.left,
      this.bottom,
      this.right
    );
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

  private _setupFocusTrap(): void {
    if (!this.open) return;

    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    if (!panel) return;

    const result = setupFocusTrap(panel, this.autoFocus);
    this._previouslyFocusedElement = result.previouslyFocusedElement;
    this._keyboardListener = result.keyboardListener;
  }

  private _removeFocusTrap(): void {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    removeFocusTrap(
      panel,
      this._keyboardListener,
      this._previouslyFocusedElement
    );

    this._keyboardListener = null;
    this._previouslyFocusedElement = null;
  }

  private _debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    const debouncedFn = debounce(fn, delay);
    return (...args: Parameters<T>) => {
      this._positionDebounceTimeout = window.setTimeout(() => {}, 0);
      debouncedFn(...args);
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
    return getAnchorPoint(anchorRect, this.anchorPoint);
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
          ? chooseDirection(anchorRect, panelRect, this.popoverSize)
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

      const coords = calcCoords(anchorRect, panelRect, dir);
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
          ? autoPosition(
              anchor,
              panel,
              this.popoverSize,
              undefined,
              manualOffset
            )
          : autoPosition(
              anchor,
              panel,
              this.popoverSize,
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

      applyResponsivePosition(
        panel,
        this.responsivePosition,
        this._coords,
        this.anchorType
      );
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
