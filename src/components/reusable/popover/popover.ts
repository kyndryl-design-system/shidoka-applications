import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, TemplateResult, unsafeCSS } from 'lit';
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

import PopoverScss from './popover.scss?inline';

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
 * @slot footerLink - Optional link to be displayed in the footer
 *
 * @fires on-close - Emitted when any action closes the popover.`detail:{ action: string }`
 * @fires on-open - Emitted when popover opens. `detail:{ origEvent: Event }`
 */
@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = unsafeCSS(PopoverScss);

  /**
   * Manual direction or auto (anchor mode only)
   */
  @property({ type: String, reflect: true })
  accessor direction: 'top' | 'right' | 'bottom' | 'left' | 'auto' = 'auto';

  /**
   * Position type: fixed (default) or absolute
   * - fixed: positions relative to the viewport
   * - absolute: positions relative to the nearest positioned ancestor
   */
  @property({ type: String })
  accessor positionType: PositionType = 'fixed';

  /**
   * Popover launch behavior.
   * - default: click to launch/open popover
   * - hover: opens on hover and closes on mouse leave
   * - link: click to navigate to an externally linked URL + hover to open
   */
  @property({ type: String })
  accessor launchBehavior: 'default' | 'hover' | 'link' = 'default';

  /**
   * URL for link behavior (when launchBehavior is 'link')
   */
  @property({ type: String })
  accessor linkHref = '';

  /**
   * When true, render only the footer link/slot and hide all footer buttons.
   */
  @property({ type: Boolean })
  accessor footerLinkOnly = false;

  /**
   * Target for link behavior (when launchBehavior is 'link')
   */
  @property({ type: String })
  accessor linkTarget: '_self' | '_blank' | '_parent' | '_top' = '_self';

  /**
   * Size variants for the popover.
   */
  @property({ type: String })
  accessor size: 'mini' | 'narrow' | 'wide' = 'mini';

  // Following two props map directly to Floating-UI's offset(), shift(), and arrow() middleware
  /**
   * Distance between anchor and popover (px)
   * Controls how far the popover is positioned from its anchor element
   */
  @property({ type: Number, reflect: true })
  accessor offsetDistance: number | undefined;

  /**
   * Padding from viewport edges (px)
   */
  @property({ type: Number, reflect: true })
  accessor shiftPadding: number | undefined;
  ////**//// */

  /** how we style the anchor slot */
  @property({ type: String, reflect: true })
  accessor triggerType: 'icon' | 'link' | 'button' | 'none' = 'button';

  /** Optional manual offset for tooltip-like triangular shaped arrow.
   * When set, this will override the automatic arrow positioning.
   */
  @property({ type: String, reflect: true })
  accessor arrowPosition: string | undefined;

  /**
   * Controls the popover's open state.
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
  get open() {
    return this._open;
  }
  set open(value: boolean) {
    const old = this._open;
    this._open = value;
    this.requestUpdate('open', old);

    if (value && !old) {
      const anchorHost = this.shadowRoot?.querySelector(
        '.anchor'
      ) as HTMLElement;

      if (!anchorHost) return;

      const slot = anchorHost.querySelector(
        'slot[name="anchor"]'
      ) as HTMLSlotElement;
      const slotted = slot?.assignedElements();
      const anchorEl = (
        slotted?.length ? slotted[0] : anchorHost
      ) as HTMLElement;

      if (!anchorEl) return;

      this.dispatchEvent(new CustomEvent('on-open'));

      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;

      if (!panel) return;

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
    }
  }

  /**
   * Animation duration in milliseconds
   */
  @property({ type: Number })
  accessor animationDuration = 200;

  // Floating-only offset props
  /** Top position value. */
  @property({ type: String })
  accessor top: string | undefined;

  /** Left position value. */
  @property({ type: String })
  accessor left: string | undefined;

  /** Bottom position value. */
  @property({ type: String })
  accessor bottom: string | undefined;

  /** Right position value. */
  @property({ type: String })
  accessor right: string | undefined;
  //

  /**
   * Changes the primary button styles to indicate a destructive action
   */
  @property({ type: Boolean })
  accessor destructive = false;

  /**
   * Z-index for the popover.
   */
  @property({ type: Number })
  accessor zIndex: number | undefined;

  /**
   * Responsive breakpoints for adjusting position.
   */
  @property({ type: String })
  accessor responsivePosition: string | undefined;

  /**
   * Body title text
   */
  @property({ type: String })
  accessor titleText = '';

  /**
   * Body subtitle/label
   */
  @property({ type: String })
  accessor labelText = '';

  /**
   * OK button label
   */
  @property({ type: String })
  accessor okText = 'OK';

  /**
   * Cancel button label
   */
  @property({ type: String })
  accessor cancelText = 'Cancel';

  /**
   * Close button description text
   */
  @property({ type: String })
  accessor closeText = 'Close';

  /**
   * Accessible name for the popover dialog
   * Used as aria-label when no title is present
   */
  @property({ type: String })
  accessor popoverAriaLabel = 'Popover';

  /**
   * Secondary button text
   */
  @property({ type: String })
  accessor secondaryButtonText = 'Secondary';

  /**
   * Show or hide the secondary button
   */
  @property({ type: Boolean })
  accessor showSecondaryButton = false;

  /**
   * Tertiary button text
   */
  @property({ type: String })
  accessor tertiaryButtonText = 'Tertiary';

  /**
   * Show or hide the tertiary button
   */
  @property({ type: Boolean })
  accessor showTertiaryButton = false;

  /**
   * Text to display for an optional link in the footer.
   */
  @property({ type: String })
  accessor footerLinkText = '';

  /**
   * URL for the optional footer link.
   */
  @property({ type: String })
  accessor footerLinkHref = '';

  /**
   * Target for the footer link (ex: "_blank" for new tab).
   * If empty, defaults to same tab.
   */
  @property({ type: String })
  accessor footerLinkTarget: '_self' | '_blank' | '_parent' | '_top' = '_self';

  /**
   * Hide the entire footer
   */
  @property({ type: Boolean })
  accessor hideFooter = false;

  /**
   * The computed panel coordinates for positioning.
   * Contains `top` and `left` in pixels.
   * @internal
   */
  @state()
  accessor _panelCoords: Coords = { top: 0, left: 0 };

  /**
   * The computed direction of the popover panel when `direction="auto"`.
   * 'top', 'bottom', 'left', or 'right'.
   * @internal
   */
  @state()
  accessor _calculatedDirection = 'bottom';

  /**
   * The computed anchor alignment relative to the trigger element.
   * 'start', 'center', or 'end'.
   * @internal
   */
  @state()
  accessor _anchorPosition = 'center';

  /**
   * Keyboard event listener attached to trap focus within the popover.
   * @internal
   */
  private _keyboardListener: ((e: Event) => void) | null = null;

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

  /**
   * Timer for delayed hover close to prevent flickering
   * @internal
   */
  private _hoverCloseTimer: number | null = null;

  /**
   * Flag to track if mouse is over the popover area (anchor or panel)
   * @internal
   */
  private _isMouseOverPopover = false;

  override render(): TemplateResult {
    const isLinkMode = this.launchBehavior === 'link';
    const isHoverMode = this.launchBehavior === 'hover';
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
      'fullscreen-mobile': true,
      [`position-type--${this.positionType}`]: true,
    };

    const panelStyles = this._getPanelStyle();
    const overlayStyles = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    z-index: ${this.zIndex ? this.zIndex - 1 : 999};
    pointer-events: none;
  `;

    return html`
      <div class="popover">
        ${isLinkMode
          ? html`
              <a
                class="anchor ${this.triggerType}-anchor launch-behavior-link"
                href=${this.linkHref}
                target=${this.linkTarget}
                tabindex="0"
                aria-haspopup="dialog"
                @mouseenter=${this._handleMouseEnter}
                @mouseleave=${this._handleMouseLeave}
                style="text-decoration: none; color: inherit; display: inline-block; cursor: pointer !important;"
              >
                <slot name="anchor"></slot>
              </a>
            `
          : html`
              <span
                class="anchor ${this.triggerType}-anchor launch-behavior-${this
                  .launchBehavior}"
                tabindex="0"
                aria-haspopup="dialog"
                @click=${this._handleAnchorClick}
                @keydown=${this._handleAnchorKeydown}
                @mouseenter=${this._handleMouseEnter}
                @mouseleave=${this._handleMouseLeave}
                style="${this.launchBehavior === 'hover'
                  ? 'cursor: pointer !important;'
                  : ''}"
              >
                <slot name="anchor"></slot>
              </span>
            `}
        ${this.open
          ? html`
              ${!isLinkMode && !isHoverMode
                ? html`
                    <div
                      class="popover-overlay"
                      style=${overlayStyles}
                      @click=${this._close}
                    ></div>
                  `
                : ''}
              <div
                id="popover-panel"
                part="panel"
                role="dialog"
                aria-modal="false"
                aria-label="${hasHeader && this.titleText
                  ? this.titleText
                  : this.popoverAriaLabel}"
                aria-describedby="${this.size === 'mini'
                  ? 'mini-popover-content'
                  : 'popover-content'}"
                title="${this.size === 'mini' ? this.popoverAriaLabel : ''}"
                class=${classMap(panelClasses)}
                style=${panelStyles}
                @mouseenter=${this._handlePanelMouseEnter}
                @mouseleave=${this._handlePanelMouseLeave}
              >
                <div part="arrow" class="arrow"></div>
                ${this.size === 'mini'
                  ? this._renderMini()
                  : this._renderStandard()}
              </div>
            `
          : null}
      </div>
    `;
  }

  private _renderMini(): TemplateResult {
    return html`
      <div class="mini-header">
        <div id="mini-popover-content" class="mini-content">
          <slot></slot>
        </div>
        <kyn-button
          class="close"
          kind="ghost"
          size="small"
          description=${this.closeText}
          @on-click=${() => this._handleAction('cancel')}
        >
          ${unsafeSVG(closeIcon)}
        </kyn-button>
      </div>
    `;
  }

  private _renderStandard(): TemplateResult {
    const hasHeader = !!(this.titleText || this.labelText);

    const hasFooterLinkSlot = !!this.querySelector('[slot="footerLink"]');
    const hasFooterLinkProps = !!this.footerLinkText || !!this.footerLinkHref;
    const hasFooterLink = hasFooterLinkSlot || hasFooterLinkProps;

    const hasFooterSlot = !!this.querySelector('[slot="footer"]');

    const shouldRenderPrimary = !this.footerLinkOnly;
    const shouldRenderSecondary =
      !this.footerLinkOnly && this.showSecondaryButton;
    const shouldRenderTertiary =
      !this.footerLinkOnly && this.showTertiaryButton;

    const hasAnyFooterButtons =
      shouldRenderPrimary || shouldRenderSecondary || shouldRenderTertiary;

    const shouldRenderFooter =
      !this.hideFooter &&
      (hasAnyFooterButtons || hasFooterLink || hasFooterSlot);

    return html`
      ${hasHeader
        ? html`
            <header>
              ${this.titleText ? html`<h2>${this.titleText}</h2>` : null}
              ${this.labelText
                ? html`<span class="label">${this.labelText}</span>`
                : null}
              <kyn-button
                class="close"
                kind="ghost"
                size="small"
                description=${this.closeText}
                @on-click=${() => this._handleAction('cancel')}
              >
                ${unsafeSVG(closeIcon)}
              </kyn-button>
            </header>
          `
        : null}
      <div class="body" id="popover-content"><slot></slot></div>

      ${shouldRenderFooter
        ? html`
            <div class="footer">
              ${hasFooterSlot
                ? html`<slot name="footer"></slot>`
                : html`
                    ${shouldRenderPrimary
                      ? html`
                          <kyn-button
                            class="action-button"
                            value="ok"
                            size="small"
                            kind=${this.destructive
                              ? 'primary-destructive'
                              : 'primary'}
                            @on-click=${() => this._handleAction('ok')}
                          >
                            ${this.okText}
                          </kyn-button>
                        `
                      : null}
                    ${shouldRenderSecondary
                      ? html`
                          <kyn-button
                            class="action-button"
                            value="secondary"
                            size="small"
                            kind="secondary"
                            @on-click=${() => this._handleAction('secondary')}
                          >
                            ${this.secondaryButtonText}
                          </kyn-button>
                        `
                      : null}
                    ${shouldRenderTertiary
                      ? html`
                          <kyn-button
                            class="action-button"
                            value="tertiary"
                            size="small"
                            kind="tertiary"
                            @on-click=${() => this._handleAction('tertiary')}
                          >
                            ${this.tertiaryButtonText}
                          </kyn-button>
                        `
                      : null}
                    ${hasFooterLink
                      ? hasFooterLinkSlot
                        ? html`<slot name="footerLink"></slot>`
                        : html`
                            <kyn-link
                              class="footer-link"
                              href=${this.footerLinkHref}
                              target=${this.footerLinkTarget}
                            >
                              ${this.footerLinkText}
                            </kyn-link>
                          `
                      : null}
                  `}
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

    if (this._hoverCloseTimer) {
      clearTimeout(this._hoverCloseTimer);
      this._hoverCloseTimer = null;
    }

    this._isMouseOverPopover = false;
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
  private _handleAction = (
    action: 'ok' | 'cancel' | 'secondary' | 'tertiary'
  ): void => {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  };

  private _toggle() {
    this.open = !this.open;
  }

  private _close() {
    this.open = false;
  }

  /**
   * @internal
   */
  private _handleAnchorClick(e: MouseEvent) {
    if (this.launchBehavior === 'default') {
      this._toggle();
    }
  }

  /**
   * @internal
   */
  private _handleMouseEnter() {
    if (this.launchBehavior === 'hover' || this.launchBehavior === 'link') {
      this._isMouseOverPopover = true;
      if (this._hoverCloseTimer) {
        clearTimeout(this._hoverCloseTimer);
        this._hoverCloseTimer = null;
      }
      this.open = true;
    }
  }

  /**
   * @internal
   */
  private _handleMouseLeave() {
    if (this.launchBehavior === 'hover' || this.launchBehavior === 'link') {
      this._isMouseOverPopover = false;
      this._hoverCloseTimer = setTimeout(() => {
        if (!this._isMouseOverPopover) {
          this.open = false;
          this._hoverCloseTimer = null;
        }
      }, 300) as unknown as number;
    }
  }

  /**
   * @internal
   */
  private _handlePanelMouseEnter() {
    if (this.launchBehavior === 'hover' || this.launchBehavior === 'link') {
      this._isMouseOverPopover = true;
      if (this._hoverCloseTimer) {
        clearTimeout(this._hoverCloseTimer);
        this._hoverCloseTimer = null;
      }
    }
  }

  /**
   * @internal
   */
  private _handlePanelMouseLeave() {
    if (this.launchBehavior === 'hover' || this.launchBehavior === 'link') {
      this._isMouseOverPopover = false;
      this._hoverCloseTimer = setTimeout(() => {
        if (!this._isMouseOverPopover) {
          this.open = false;
          this._hoverCloseTimer = null;
        }
      }, 300) as unknown as number;
    }
  }

  /**
   * @internal
   */
  private _handleAnchorKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (this.launchBehavior === 'link' && this.linkHref) {
        if (this.linkTarget === '_blank') {
          window.open(this.linkHref, '_blank');
        } else {
          window.location.href = this.linkHref;
        }
      } else if (this.launchBehavior === 'default') {
        this._toggle();
      } else if (this.launchBehavior === 'hover') {
        this._toggle();
      }
    }
  }

  private _handleFocusKeyboardEvents() {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    if (!panel) return;
    const res = handleFocusKeyboardEvents(panel);
    this._keyboardListener = res.keyboardListener;
  }

  private _removeFocusListener() {
    const panel = this.shadowRoot!.querySelector(
      '.popover-inner'
    ) as HTMLElement;
    removeFocusListener(panel, this._keyboardListener, null);
    this._keyboardListener = null;
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

    if (this.size === 'wide') {
      panel.style.maxWidth = 'var(--kyn-popover-wide-max-width)';
    } else if (this.size === 'narrow') {
      panel.style.maxWidth = 'var(--kyn-popover-narrow-max-width)';
    } else if (this.size === 'mini') {
      panel.style.maxWidth = 'var(--kyn-popover-mini-max-width)';
    }

    if (this.arrowPosition) {
      panel.style.setProperty('--arrow-offset-x', this.arrowPosition);
    } else {
      requestAnimationFrame(() => {
        const anchorRect = anchorEl.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();

        if (dir === 'top' || dir === 'bottom') {
          const anchorCenterX = anchorRect.left + anchorRect.width / 2;
          const panelLeftX = panelRect.left;
          const arrowOffsetX = anchorCenterX - panelLeftX - 8;
          const arrowPadding = 16;
          const minOffsetX = arrowPadding;
          const maxOffsetX = panelRect.width - arrowPadding - 16;
          const clampedArrowX = Math.max(
            minOffsetX,
            Math.min(maxOffsetX, arrowOffsetX)
          );

          panel.style.setProperty(
            '--arrow-offset',
            `${Math.round(clampedArrowX)}px`
          );
        } else if (dir === 'left' || dir === 'right') {
          const anchorCenterY = anchorRect.top + anchorRect.height / 2;
          const panelTopY = panelRect.top;
          const arrowOffsetY = anchorCenterY - panelTopY - 8;
          const arrowPadding = 16;
          const minOffsetY = arrowPadding;
          const maxOffsetY = panelRect.height - arrowPadding - 16;
          const clampedArrowY = Math.max(
            minOffsetY,
            Math.min(maxOffsetY, arrowOffsetY)
          );

          panel.style.setProperty(
            '--arrow-offset',
            `${Math.round(clampedArrowY)}px`
          );
        }
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
