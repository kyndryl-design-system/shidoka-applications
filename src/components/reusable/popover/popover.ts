import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Placement } from '@floating-ui/dom';

import {
  autoPosition,
  PositionType,
  Coords,
  handleFocusKeyboardEvents,
  removeFocusTrap,
  getPanelStyle,
  applyResponsivePosition,
} from '../../../common/helpers/popoverHelper';

import '../button';
import PopoverScss from './popover.scss';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

/**
 * Popover component.
 *
 * Two positioning modes are available:
 * - anchor: positioned relative to an anchor slot element
 * - floating: manually positioned via top/left/bottom/right properties
 *
 * For anchor mode, the popover will be positioned relative to the anchor element
 * based on the direction and anchorAlign properties. The position can be fixed or absolute.
 *
 * For floating (manual) mode, set triggerType="none" and use top/left/bottom/right
 * properties to position the popover.
 *
 * @slot anchor - The trigger element (icon, button, link, etc.)
 * @slot unnamed - The popover body content
 * @slot header - Optional custom header (replaces default title/label)
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
  direction: 'top' | 'right' | 'bottom' | 'left' | 'auto' = 'auto';

  /**
   * The anchor point for positioning the popover
   */
  @property({ type: String })
  anchorAlign:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right' = 'center';

  /**
   * Use modern positioning API when available
   */
  @property({ type: Boolean })
  useModernPositioning = true;

  /**
   * Distance between anchor and popover (px)
   * Controls how far the popover is positioned from its anchor element
   */
  @property({ type: Number })
  anchorDistance: number | undefined;

  /**
   * Padding from viewport edges (px)
   */
  @property({ type: Number, attribute: 'viewport-padding' })
  edgeShift: number | undefined;

  /**
   * Arrow position padding (px)
   * Controls minimum distance of arrow from popover edges
   */
  @property({ type: Number, attribute: 'arrow-distance' })
  arrowMinPadding: number | undefined;

  /**
   * Position type: fixed (default) or absolute
   * - fixed: positions relative to the viewport
   * - absolute: positions relative to the nearest positioned ancestor
   */
  @property({ type: String })
  positionType: PositionType = 'fixed';

  /** how we style the anchor slot */
  @property({ type: String, reflect: true })
  triggerType: 'icon' | 'link' | 'button' | 'none' = 'button';

  /**
   * Size variants for the popover.
   */
  @property({ type: String })
  size: 'mini' | 'narrow' | 'wide' = 'mini';

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
   * Enable full screen mode on mobile devices
   */
  @property({ type: Boolean })
  mobileBreakpoint = false;

  /**
   * Auto focus the first focusable element when opened
   */
  @property({ type: Boolean })
  autoFocus = true;

  /**
   * The computed panel coordinates for positioning.
   * Contains `top` and `left` in pixels.
   * @private
   */
  @state()
  private _coords: Coords = { top: 0, left: 0 };

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

  /** Optional manual offset for tooltip-like triangular shaped arrow.
   * When set, this will override the automatic arrow positioning.
   */
  @property({ type: String, reflect: true })
  arrowPosition?: string;

  /**
   * The computed direction of the popover panel when `direction="auto"`.
   * One of 'top', 'bottom', 'left', or 'right'.
   * @private
   */
  @state()
  private _calculatedDirection = 'bottom';

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
   * The computed anchor alignment relative to the trigger element.
   * One of 'start', 'center', or 'end'.
   * @private
   */
  @state()
  private _anchorPosition = 'center';

  private _resizeObserver: ResizeObserver | null = null;
  private _keyboardListener: ((e: Event) => void) | null = null;
  private _prevFocused: HTMLElement | null = null;
  private _debounceTimeout: number | null = null;

  override render() {
    const hasHeader = !!(this.titleText || this.labelText);
    const dir =
      this.direction === 'auto' ? this._calculatedDirection : this.direction;

    const panelClasses = {
      [`direction--${dir}`]: true,
      ...(this.triggerType !== 'none' && {
        [`anchor--${this._anchorPosition}`]: true,
      }),
      [`popover-size--${this.size}`]: true,
      'popover-inner': true,
      open: this.open,
      'no-header-text': !hasHeader,
      [`has-footer-${!this.hideFooter}`]: true,
      'fullscreen-mobile': this.mobileBreakpoint,
    };

    const panelStyles = this._getPanelStyle();
    const style = this.arrowPosition
      ? `${panelStyles}; --arrow-offset: ${this.arrowPosition};`
      : panelStyles;

    return html`
      <div class="popover">
        <span class="anchor" @click=${this._toggle}>
          <slot name="anchor"></slot>
        </span>
        ${this.open
          ? html`
              <div class=${classMap(panelClasses)} style=${style}>
                <div class="arrow"></div>
                ${this.size === 'mini'
                  ? html`
                      <div class="mini-header">
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
                      </div>
                    `
                  : html`
                      ${hasHeader
                        ? html`
                            <header>
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
                            </header>
                          `
                        : null}
                      <div class="body" id="popover-content"><slot></slot></div>
                    `}
                ${!this.hideFooter && this.size !== 'mini'
                  ? html`
                      <slot name="footer">
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
                            ? html`
                                <kyn-button
                                  class="action-button"
                                  value="secondary"
                                  size="small"
                                  kind="secondary"
                                  @click=${() =>
                                    this._handleAction('secondary')}
                                >
                                  ${this.secondaryButtonText}
                                </kyn-button>
                              `
                            : null}
                        </div>
                      </slot>
                    `
                  : null}
              </div>
            `
          : null}
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeyDown as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeyDown as EventListener);
    this._removeObservers();
    this._removeFocusTrap();
  }

  override updated(changed: Map<string, unknown>) {
    if (
      (changed.has('open') && this.open) ||
      changed.has('arrowPosition') ||
      changed.has('anchorDistance') ||
      changed.has('edgeShift') ||
      changed.has('arrowMinPadding')
    ) {
      this.updateComplete.then(() => {
        this._position();
        this._handleFocusKeyboardEvents();
        this._addObservers();
      });
    }
  }

  private _getPanelStyle = (): string => {
    return getPanelStyle(
      this.positionType,
      this.zIndex,
      this.triggerType,
      this._coords,
      this.top,
      this.left,
      this.bottom,
      this.right
    );
  };

  private _toggle() {
    const wasOpen = this.open;
    this.open = !wasOpen;

    if (!wasOpen) {
      this.dispatchEvent(new CustomEvent('on-open'));
    }
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close'));
  }

  private _onKeyDown = (e: Event) => {
    if ((e as KeyboardEvent).key === 'Escape' && this.open) this._close();
  };

  private _handleFocusKeyboardEvents() {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    if (!panel) return;
    const res = handleFocusKeyboardEvents(panel, this.autoFocus);
    this._prevFocused = res.previouslyFocusedElement;
    this._keyboardListener = res.keyboardListener;
  }

  private _removeFocusTrap() {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    removeFocusTrap(panel, this._keyboardListener, this._prevFocused);
    this._keyboardListener = null;
    this._prevFocused = null;
  }

  private _addObservers() {
    if (this._resizeObserver) return;
    this._resizeObserver = new ResizeObserver(() => this._positionDebounced());
    const panel = this.shadowRoot!.querySelector('.popover-inner');
    const anchor = this.shadowRoot!.querySelector('.anchor');
    if (panel) this._resizeObserver.observe(panel);
    if (anchor) this._resizeObserver.observe(anchor);
  }

  private _removeObservers() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._debounceTimeout != null) {
      clearTimeout(this._debounceTimeout);
      this._debounceTimeout = null;
    }
  }

  private _positionDebounced() {
    if (this._debounceTimeout != null) clearTimeout(this._debounceTimeout);
    this._debounceTimeout = window.setTimeout(() => {
      this._position();
      this._debounceTimeout = null;
    }, 100);
  }

  private _handleAction = (action: 'ok' | 'cancel' | 'secondary'): void => {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  };

  private async _position() {
    await this.updateComplete;

    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    if (!panel) return;

    if (this.triggerType === 'none') {
      const baseStyle = this._getPanelStyle();
      const arrowStyle = this.arrowPosition
        ? `; --arrow-offset: ${this.arrowPosition}`
        : '';
      panel.setAttribute('style', baseStyle + arrowStyle);

      const dir = this.direction === 'auto' ? 'bottom' : this.direction;
      this._calculatedDirection = dir as 'top' | 'bottom' | 'left' | 'right';

      if (this.responsivePosition) {
        applyResponsivePosition(
          panel,
          this.responsivePosition,
          this._coords,
          this.triggerType
        );
      }
      return;
    }

    const anchorHost = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
    const slotted = (
      anchorHost.querySelector('slot[name="anchor"]') as HTMLSlotElement | null
    )?.assignedElements();
    const anchorEl = slotted?.length ? (slotted[0] as HTMLElement) : anchorHost;
    const arrowEl = panel.querySelector<HTMLElement>('.arrow')!;

    const override: Placement | undefined =
      this.direction !== 'auto' ? this.direction : undefined;

    const baseOpts = {
      anchorDistance: this.anchorDistance,
      edgeShift: this.edgeShift,
      arrowMinPadding: this.arrowMinPadding,
    };

    const { x, y, placement, arrowX } = await autoPosition(
      anchorEl,
      panel,
      arrowEl,
      override,
      baseOpts
    );
    const [dir, anchorPos] = (
      placement.includes('-') ? placement.split('-') : [placement, 'center']
    ) as ['top' | 'bottom' | 'left' | 'right', 'start' | 'center' | 'end'];
    this._calculatedDirection = dir;
    this._anchorPosition = anchorPos;

    const numericTopOffset = this.top
      ? parseInt(this.top.replace(/[^0-9-]/g, ''), 10)
      : 0;
    const numericLeftOffset = this.left
      ? parseInt(this.left.replace(/[^0-9-]/g, ''), 10)
      : 0;

    this._coords = {
      top: Math.round(y) + numericTopOffset,
      left: Math.round(x) + numericLeftOffset,
    };

    panel.style.top = `${this._coords.top}px`;
    panel.style.left = `${this._coords.left}px`;

    if (this.arrowPosition) {
      const arrowElement = panel.querySelector('.arrow');
      if (arrowElement) {
        arrowElement.removeAttribute('style');
      }
      panel.style.setProperty('--arrow-offset', this.arrowPosition);
    } else if (arrowX != null) {
      panel.style.setProperty('--arrow-offset', `${Math.round(arrowX)}px`);
    }

    if (this.responsivePosition) {
      applyResponsivePosition(
        panel,
        this.responsivePosition,
        this._coords,
        this.triggerType
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
