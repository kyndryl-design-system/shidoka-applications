import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../button';

import PopoverScss from './popover.scss';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

/**
 * Popover component.
 * @slot anchor      - The trigger element (icon, button, link, etc.).
 * @slot default     - The popover body content.
 * @slot footer      - Optional custom footer (replaces default buttons).
 * @fires on-close   - Emitted when any action closes the popover.
 */
@customElement('kyn-popover')
export class Popover extends LitElement {
  static override styles = [PopoverScss];

  /** trigger slot styling */
  @property({ type: String, reflect: true })
  triggerType: 'icon' | 'link' | 'button' = 'icon';

  /** manual direction or auto */
  @property({ type: String, reflect: true })
  direction: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto';

  /** size variant */
  @property({ type: String })
  popoverSize: 'mini' | 'narrow' | 'wide' = 'mini';

  /** body title text */
  @property({ type: String })
  titleText = '';

  /** Changes the primary button styles to indicate the action is destructive. */
  @property({ type: Boolean })
  destructive = false;

  /** body subtitle/label */
  @property({ type: String })
  labelText = '';

  /** OK button label */
  @property({ type: String })
  okText = 'OK';

  /** Cancel button label */
  @property({ type: String })
  cancelText = 'Cancel';

  /** Secondary button text. */
  @property({ type: String })
  secondaryButtonText = 'Secondary';

  /** Hides the secondary button. */
  @property({ type: Boolean })
  showSecondaryButton = false;

  /** hide entire footer */
  @property({ type: Boolean })
  hideFooter = false;

  /** Whether popover is open */
  @property({ type: Boolean })
  open = false;

  /** Close button text. */
  @property({ type: String })
  closeText = 'Close';

  @state() private _calculatedDirection: 'top' | 'bottom' | 'left' | 'right' =
    'bottom';
  @state() private _anchorPosition: 'start' | 'center' | 'end' = 'center';
  @state() private _coords = { top: 0, left: 0 };

  override render() {
    const hasHeaderText = !!(this.titleText || this.labelText);
    const panelClasses = {
      [`direction--${this._calculatedDirection}`]: true,
      [`anchor--${this._anchorPosition}`]: true,
      [`popover-size--${this.popoverSize}`]: true,
      'popover-inner': true,
      open: this.open,
      'no-header-text': !hasHeaderText,
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
                style="top:${this._coords.top}px; left:${this._coords.left}px;"
              >
                ${this.popoverSize === 'mini'
                  ? html`
                      <div class="mini-header">
                        <div class="mini-content">
                          <slot></slot>
                        </div>
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
                      <div class="body">
                        <slot></slot>
                      </div>
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
                                  value="Secondary"
                                  size="small"
                                  kind=${'secondary'}
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

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open') && this.open) {
      this.updateComplete.then(() => this._position());
    }
  }

  private _toggle() {
    this.open = !this.open;
  }

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('on-close', { detail: { action: 'close' } })
    );
  }

  private _handleAction(action: 'ok' | 'cancel' | 'secondary') {
    this.open = false;
    this.dispatchEvent(new CustomEvent('on-close', { detail: { action } }));
  }

  private _position() {
    const anchor = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
    const panel = this.shadowRoot!.querySelector(
      'div:not(.anchor)'
    ) as HTMLElement;
    if (!anchor || !panel) return;
    const a = anchor.getBoundingClientRect();
    const p = panel.getBoundingClientRect();

    let dir: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    if (this.direction !== 'auto') dir = this.direction;
    else {
      const space = {
        top: a.top,
        bottom: innerHeight - a.bottom,
        left: a.left,
        right: innerWidth - a.right,
      };
      dir = (Object.keys(space) as Array<keyof typeof space>).reduce(
        (b, k) => (space[k] > space[b] ? k : b),
        'bottom'
      );
    }
    this._calculatedDirection = dir;

    let anchorPos: 'start' | 'center' | 'end' = 'center';
    if (dir === 'top' || dir === 'bottom') {
      const cx = a.left + a.width / 2;
      if (cx - a.left < a.width * 0.33) anchorPos = 'start';
      else if (a.right - cx < a.width * 0.33) anchorPos = 'end';
    } else {
      const cy = a.top + a.height / 2;
      if (cy - a.top < a.height * 0.33) anchorPos = 'start';
      else if (a.bottom - cy < a.height * 0.33) anchorPos = 'end';
    }
    this._anchorPosition = anchorPos;

    let top = 0,
      left = 0;
    switch (dir) {
      case 'top':
        top = a.top - p.height;
        left = a.left + a.width / 2 - p.width / 2;
        break;
      case 'bottom':
        top = a.bottom;
        left = a.left + a.width / 2 - p.width / 2;
        break;
      case 'left':
        top = a.top + a.height / 2 - p.height / 2;
        left = a.left - p.width;
        break;
      case 'right':
        top = a.top + a.height / 2 - p.height / 2;
        left = a.right;
        break;
    }
    top = Math.max(8, Math.min(top, innerHeight - p.height - 8));
    left = Math.max(8, Math.min(left, innerWidth - p.width - 8));
    this._coords = { top, left };

    let arrowOffset = 0;
    if (dir === 'top' || dir === 'bottom') {
      const anchorCenterX = a.left + a.width / 2;
      const panelLeft = left;
      const OFFSET = 10;
      arrowOffset = anchorCenterX - panelLeft + OFFSET;
    } else if (dir === 'left' || dir === 'right') {
      const anchorCenterY = a.top + a.height / 2;
      const panelTop = top;
      arrowOffset = anchorCenterY - panelTop;
    }

    panel.style.setProperty('--arrow-offset', `${arrowOffset}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-popover': Popover;
  }
}
