import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Placement, autoUpdate } from '@floating-ui/dom';

import {
  autoPosition,
  PositionType,
  Coords,
  handleFocusKeyboardEvents,
  removeFocusListener,
  getPanelStyle,
} from '../../../common/helpers/popoverHelper';

import '../button';
import '../link';

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
 * based on the direction property. The position can be fixed or absolute.
 *
 * For floating (manual) mode, set triggerType="none" and use top/left/bottom/right
 * properties to position the popover.
 *
 * @slot unnamed - The main popover slotted body content
 * @slot anchor - The trigger element (icon, button, link, etc.)
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
   * Position type: fixed (default) or absolute
   * - fixed: positions relative to the viewport
   * - absolute: positions relative to the nearest positioned ancestor
   */
  @property({ type: String })
  positionType: PositionType = 'fixed';

  /**
   * Size variants for the popover.
   */
  @property({ type: String })
  size: 'mini' | 'narrow' | 'wide' = 'mini';

  // Following two props map directly to Floating-UI’s offset(), shift(), and arrow() middleware
  /**
   * Distance between anchor and popover (px)
   * Controls how far the popover is positioned from its anchor element
   */
  @property({ type: Number, reflect: true })
  offsetDistance: number | undefined;

  /**
   * Padding from viewport edges (px)
   */
  @property({ type: Number, reflect: true })
  shiftPadding: number | undefined;
  ////**//// */

  /** how we style the anchor slot */
  @property({ type: String, reflect: true })
  triggerType: 'icon' | 'link' | 'button' | 'none' = 'button';

  /** Optional manual offset for tooltip-like triangular shaped arrow.
   * When set, this will override the automatic arrow positioning.
   */
  @property({ type: String, reflect: true })
  arrowPosition?: string;

  /**
   * Controls the popover’s open state.
   *
   * @remarks
   * Setting to `true`:
   * - dispatches `on-open`
   * - starts Floating-UI `autoUpdate` to track repositioning
   * - saves the anchor element for focus restoration
   *
   * Setting to `false`:
   * - dispatches `on-close`
   * - stops floating-ui `autoUpdate`
   * - restores focus to the saved anchor element
   */
  @property({ type: Boolean })
  get open() {
    return this._open;
  }
  set open(value: boolean) {
    const old = this._open;
    this._open = value;
    this.requestUpdate('open', old);

    if (value && !old) {
      const anchorHost = this.shadowRoot!.querySelector(
        '.anchor'
      ) as HTMLElement;
      const slotted = (
        anchorHost.querySelector('slot[name="anchor"]') as HTMLSlotElement
      )?.assignedElements();
      const anchorEl = (
        slotted?.length ? slotted[0] : anchorHost
      ) as HTMLElement;
      this._prevFocused = anchorEl;

      this.dispatchEvent(new CustomEvent('on-open'));

      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;
      this._autoUpdateCleanup = autoUpdate(anchorEl, panel, () =>
        this._position()
      );
    }

    if (!value && old) {
      this.dispatchEvent(new CustomEvent('on-close'));

      if (this._autoUpdateCleanup) {
        this._autoUpdateCleanup();
        this._autoUpdateCleanup = null;
      }

      if (this._prevFocused) {
        this._prevFocused.focus();
        this._prevFocused = null;
      }
    }
  }

  /**
   * Enable full screen mode on mobile devices
   */
  @property({ type: Boolean })
  mobileBreakpoint = false;

  /**
   * Animation duration in milliseconds
   */
  @property({ type: Number })
  animationDuration = 200;

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
  //

  /**
   * Changes the primary button styles to indicate a destructive action
   */
  @property({ type: Boolean })
  destructive = false;

  /**
   * Z-index for the popover.
   */
  @property({ type: Number })
  zIndex?: number;

  /**
   * Responsive breakpoints for adjusting position.
   */
  @property({ type: String })
  responsivePosition?: string;

  /**
   * Body title text
   */
  @property({ type: String })
  titleText = '';

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
   * Close button description text
   */
  @property({ type: String })
  closeText = 'Close';

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
   * Text to display for an optional link in the footer.
   */
  @property({ type: String })
  footerLinkText = '';

  /**
   * URL for the optional footer link.
   */
  @property({ type: String })
  footerLinkHref = '';

  /**
   * Target for the footer link (ex: "_blank" for new tab).
   * If empty, defaults to same tab.
   */
  @property({ type: String })
  footerLinkTarget: '_self' | '_blank' | '_parent' | '_top' = '_self';

  /**
   * Hide the entire footer
   */
  @property({ type: Boolean })
  hideFooter = false;

  /**
   * The computed panel coordinates for positioning.
   * Contains `top` and `left` in pixels.
   * @internal
   */
  @state()
  _panelCoords: Coords = { top: 0, left: 0 };

  /**
   * The computed direction of the popover panel when `direction="auto"`.
   * 'top', 'bottom', 'left', or 'right'.
   * @internal
   */
  @state()
  _calculatedDirection = 'bottom';

  /**
   * The computed anchor alignment relative to the trigger element.
   * 'start', 'center', or 'end'.
   * @internal
   */
  @state()
  _anchorPosition = 'center';

  /**
   * Keyboard event listener attached to trap focus within the popover.
   * @internal
   */
  private _keyboardListener: ((e: Event) => void) | null = null;

  /**
   * Previously focused element before the popover opened, so it can be restored on close.
   * @internal
   */
  private _prevFocused: HTMLElement | null = null;

  /**
   * Cleanup callback for any automatic update routines.
   * @internal
   */
  private _autoUpdateCleanup: (() => void) | null = null;

  /**
   * Popover open state.
   * @internal
   */
  private _open = false;

  override render() {
    const hasHeader = !!(this.titleText || this.labelText);
    const dir =
      this.direction === 'auto' ? this._calculatedDirection : this.direction;

    const panelClasses = {
      [`direction--${dir}`]: true,
      'no-anchor': this.triggerType === 'none',
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

    return html`
      <div class="popover">
        <span class="anchor" @click=${this._toggle}>
          <slot name="anchor"></slot>
        </span>

        ${this.open
          ? html` <div
              part="panel"
              class=${classMap(panelClasses)}
              style=${panelStyles}
            >
              <div part="arrow" class="arrow"></div>
              ${this.size === 'mini'
                ? this._renderMini()
                : this._renderStandard()}
            </div>`
          : null}
      </div>
    `;
  }

  private _renderMini(): TemplateResult {
    return html`
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
    `;
  }

  private _renderStandard(): TemplateResult {
    const hasHeader = !!(this.titleText || this.labelText);
    return html`
      ${hasHeader
        ? html` <header>
            ${this.titleText
              ? html`<h1 id="popover-title">${this.titleText}</h1>`
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
          </header>`
        : null}
      <div class="body" id="popover-content"><slot></slot></div>
      ${!this.hideFooter
        ? html`
            <div class="footer">
              <kyn-button
                class="action-button"
                value="ok"
                size="small"
                kind=${this.destructive ? 'primary-destructive' : 'primary'}
                @click=${() => this._handleAction('ok')}
              >
                ${this.okText}
              </kyn-button>
              ${this.showSecondaryButton
                ? html`<kyn-button
                    class="action-button"
                    value="secondary"
                    size="small"
                    kind="secondary"
                    @click=${() => this._handleAction('secondary')}
                  >
                    ${this.secondaryButtonText}
                  </kyn-button>`
                : null}
              ${this.footerLinkText && this.footerLinkHref
                ? html`<kyn-link
                    href=${this.footerLinkHref}
                    class="footer-link"
                    target=${this.footerLinkTarget}
                  >
                    ${this.footerLinkText}
                  </kyn-link>`
                : null}
            </div>
          `
        : null}
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeyDown as EventListener);

    if (this.open) {
      const anchorHost = this.shadowRoot!.querySelector(
        '.anchor'
      ) as HTMLElement;
      const slotted = (
        anchorHost.querySelector('slot[name="anchor"]') as HTMLSlotElement
      )?.assignedElements();
      const anchorEl = (
        slotted?.length ? slotted[0] : anchorHost
      ) as HTMLElement;
      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;

      this._autoUpdateCleanup = autoUpdate(anchorEl, panel, () =>
        this._position()
      );
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeyDown as EventListener);

    if (this._autoUpdateCleanup) {
      this._autoUpdateCleanup();
      this._autoUpdateCleanup = null;
    }

    this._removeFocusListener();
  }

  override updated(changed: Map<string, unknown>) {
    if (
      (changed.has('open') && this.open) ||
      changed.has('arrowPosition') ||
      changed.has('offsetDistance') ||
      changed.has('shiftPadding') ||
      changed.has('positionType')
    ) {
      this.updateComplete.then(() => {
        this._position();
        this._handleFocusKeyboardEvents();
      });
    }

    if (changed.has('arrowPosition') && this.arrowPosition) {
      this.style.setProperty('--arrow-offset', this.arrowPosition);
    }
  }

  /**
   * @internal
   */
  private _getPanelStyle = (): string => {
    const base = getPanelStyle(
      this.positionType,
      this.zIndex,
      this.triggerType,
      this._panelCoords,
      this.top,
      this.left,
      this.bottom,
      this.right
    );

    const arrowOff = this.arrowPosition
      ? `--arrow-offset: ${this.arrowPosition};`
      : '';

    return `${base}${arrowOff}`;
  };

  /**
   * @internal
   */
  private _onKeyDown = (e: Event) => {
    if ((e as KeyboardEvent).key === 'Escape' && this.open) this._close();
  };

  /**
   * @internal
   */
  private _handleAction = (action: 'ok' | 'cancel' | 'secondary'): void => {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  };

  private _toggle() {
    this.open = !this.open;
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close'));
  }

  private _handleFocusKeyboardEvents() {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    if (!panel) return;
    const res = handleFocusKeyboardEvents(panel);
    this._prevFocused = res.previouslyFocusedElement;
    this._keyboardListener = res.keyboardListener;
  }

  private _removeFocusListener() {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    removeFocusListener(panel, this._keyboardListener, this._prevFocused);
    this._keyboardListener = null;
    this._prevFocused = null;
  }

  private async _position() {
    await this.updateComplete;

    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    if (!panel) return;

    if (this.triggerType === 'none') {
      const baseStyle = this._getPanelStyle();
      const arrowStyle = this.arrowPosition
        ? `; --arrow-offset-x: ${this.arrowPosition}; --arrow-offset-y: ${this.arrowPosition};`
        : '';
      panel.setAttribute('style', baseStyle + arrowStyle);
      this._calculatedDirection =
        this.direction === 'auto' ? 'bottom' : this.direction;
      return;
    }

    const anchorHost = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
    const slotted = (
      anchorHost.querySelector('slot[name="anchor"]') as HTMLSlotElement
    )?.assignedElements();
    const anchorEl = slotted?.length ? (slotted[0] as HTMLElement) : anchorHost;
    const arrowEl = panel.querySelector<HTMLElement>('.arrow')!;

    const override: Placement | undefined =
      this.direction !== 'auto' ? this.direction : undefined;

    const baseOpts = {
      offsetDistance: this.offsetDistance,
      shiftPadding: this.shiftPadding,
      positionType: this.positionType,
    };

    const { x, y, placement, arrowX, arrowY } = await autoPosition(
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
    this._panelCoords = {
      top: Math.round(y) + numericTopOffset,
      left: Math.round(x) + numericLeftOffset,
    };
    panel.style.top = `${this._panelCoords.top}px`;
    panel.style.left = `${this._panelCoords.left}px`;

    if (this.arrowPosition) {
      panel.style.setProperty('--arrow-offset-x', this.arrowPosition);
    } else {
      if (arrowX != null)
        panel.style.setProperty('--arrow-offset-x', `${Math.round(arrowX)}px`);
      if (arrowY != null)
        panel.style.setProperty('--arrow-offset-y', `${Math.round(arrowY)}px`);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
