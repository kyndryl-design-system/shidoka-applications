import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../button';
import PopoverScss from './popover.scss';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

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
  direction: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto';

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
   * The calculated direction for the popover panel, used when direction is set to 'auto'.
   * @private
   */
  @state()
  _calculatedDirection: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * The calculated anchor alignment position ('start', 'center', or 'end').
   * @private
   */
  @state()
  _anchorPosition: 'start' | 'center' | 'end' = 'center';

  /**
   * The calculated coordinates for the popover panel (top and left in pixels).
   * @private
   */
  @state()
  _coords = { top: 0, left: 0 };

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
          ? html`
              <div
                class=${classMap(panelClasses)}
                style=${this._getPanelStyle()}
              >
                ${this.popoverSize === 'mini'
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
                      <header>
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
                      <div class="body"><slot></slot></div>
                    `}
                ${!this.hideFooter && this.popoverSize !== 'mini'
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

  private _getPanelStyle() {
    if (this.isAnchored) {
      return `position: fixed; top: ${this._coords.top}px; left: ${this._coords.left}px;`;
    }
    let s = 'position: fixed;';
    if (this.top) s += `top: ${this.top};`;
    if (this.left) s += `left: ${this.left};`;
    if (this.bottom) s += `bottom: ${this.bottom};`;
    if (this.right) s += `right: ${this.right};`;
    return s;
  }

  override updated(changed: Map<string, unknown>) {
    if (
      this.isAnchored &&
      ((changed.has('open') && this.open) || changed.has('arrowOffset'))
    ) {
      this.updateComplete.then(() => this._position());
    }
  }

  private _toggle() {
    this.open = !this.open;
  }

  private _handleAction(action: 'ok' | 'cancel' | 'secondary') {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  }

  private _position() {
    requestAnimationFrame(() => {
      const anchor = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
      const panel = this.shadowRoot!.querySelector(
        '.popover-inner'
      ) as HTMLElement;
      if (!anchor || !panel) return;

      const a = anchor.getBoundingClientRect();
      const p = panel.getBoundingClientRect();

      let dir: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
      if (this.direction === 'auto') {
        const space = {
          top: a.top,
          bottom: window.innerHeight - a.bottom,
          left: a.left,
          right: window.innerWidth - a.right,
        };
        if (space.bottom >= p.height + 16) dir = 'bottom';
        else if (space.top >= p.height + 16) dir = 'top';
        else if (space.right >= p.width + 16) dir = 'right';
        else dir = 'left';
        this._calculatedDirection = dir;
      } else {
        dir = this.direction;
        this._calculatedDirection = dir;
      }

      const GUTTER = 8;
      const OFFSET = 20;
      const ARROW_HALF = 6;

      panel.style.transform = '';

      let topPos: number;
      let leftPos: number;
      let rawOffset: number;

      if (dir === 'top' || dir === 'bottom') {
        const cx = a.left + a.width / 2;
        const idealLeft = cx - p.width / 2;
        leftPos = Math.min(
          Math.max(idealLeft, GUTTER),
          window.innerWidth - p.width - GUTTER
        );

        const rawTop =
          dir === 'top' ? a.top - p.height - OFFSET : a.bottom + OFFSET;
        topPos = Math.min(
          Math.max(rawTop, GUTTER),
          window.innerHeight - p.height - GUTTER
        );

        rawOffset = cx - leftPos;
      } else {
        const cy = a.top + a.height / 2;
        const idealTop = cy - p.height / 2;
        topPos = Math.min(
          Math.max(idealTop, GUTTER),
          window.innerHeight - p.height - GUTTER
        );

        const rawLeft =
          dir === 'left' ? a.left - p.width - OFFSET : a.right + OFFSET;
        leftPos = Math.min(
          Math.max(rawLeft, GUTTER),
          window.innerWidth - p.width - GUTTER
        );

        rawOffset = cy - topPos;
      }

      const maxOffset =
        dir === 'top' || dir === 'bottom'
          ? p.width - ARROW_HALF
          : p.height - ARROW_HALF;

      const arrowOffsetVal = this.arrowOffset
        ? parseFloat(this.arrowOffset)
        : Math.max(ARROW_HALF, Math.min(rawOffset, maxOffset));

      panel.style.top = `${topPos}px`;
      panel.style.left = `${leftPos}px`;
      panel.style.setProperty('--arrow-offset', `${arrowOffsetVal}px`);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
