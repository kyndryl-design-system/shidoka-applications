import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TooltipScss from './tooltip.scss';

import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/information.svg';

/**
 * Tooltip.
 * @fires on-tooltip-toggle - Emits the open state of the tooltip on open/close.
 * @slot unnamed - Slot for tooltip content.
 * @slot anchor - Slot for custom anchor button content.
 */
@customElement('kyn-tooltip')
export class Tooltip extends LitElement {
  static override styles = TooltipScss;

  /** Assistive text for anchor button. */
  @property({ type: String })
  assistiveText = 'Tooltip';

  /** Tooltip open state.
   * @internal
   */
  @state()
  _open = false;

  /** Tooltip anchor position. `'start'`, `'end'`, or `'center'`.
   * @internal
   */
  @state()
  _anchorPosition = 'center';

  /** Tooltip direction. `'top'`, `'bottom'`, `'left'`, or `'right'`.
   * @internal
   */
  @state()
  _direction = 'top';

  /** Timeout function to delay modal close.
   * @internal
   */
  @state()
  _timer: any;

  /** Anchor element
   * @internal
   */
  @query('.anchor')
  _anchorEl!: any;

  /** Content element
   * @internal
   */
  @query('.content')
  _contentEl!: any;

  override render() {
    const classes = {
      content: true,
      open: this._open,
      'anchor--start': this._anchorPosition === 'start',
      'anchor--end': this._anchorPosition === 'end',
      'anchor--center': this._anchorPosition === 'center',
      'direction--top': this._direction === 'top',
      'direction--bottom': this._direction === 'bottom',
      'direction--left': this._direction === 'left',
      'direction--right': this._direction === 'right',
    };

    return html`
      <div class="tooltip">
        <button
          class="anchor"
          aria-label=${this.assistiveText}
          title=${this.assistiveText}
          aria-describedby="tooltip"
          @mouseenter=${this._handleOpen}
          @mouseleave=${this._handleMouseLeave}
          @focus=${this._handleOpen}
          @blur=${this._handleClose}
        >
          <slot name="anchor"
            ><span class="info-icon">${unsafeSVG(infoIcon)}</span></slot
          >
        </button>

        <div
          id="tooltip"
          aria-hidden=${!this._open}
          role="tooltip"
          class=${classMap(classes)}
          @mouseenter=${this._handleOpen}
          @mouseleave=${this._handleMouseLeave}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _positionTooltip() {
    const AnchorTop = this._anchorEl.getBoundingClientRect().top;
    const AnchorMiddle =
      this._anchorEl.getBoundingClientRect().top +
      this._anchorEl.getBoundingClientRect().height / 2;
    const AnchorBottom =
      this._anchorEl.getBoundingClientRect().top +
      this._anchorEl.getBoundingClientRect().height;
    const AnchorLeft = this._anchorEl.getBoundingClientRect().left;
    const AnchorCenter =
      this._anchorEl.getBoundingClientRect().left +
      this._anchorEl.getBoundingClientRect().width / 2;
    const AnchorRight =
      this._anchorEl.getBoundingClientRect().left +
      this._anchorEl.getBoundingClientRect().width;
    const ViewportHeight = window.innerHeight;
    const ViewportWidth = window.innerWidth;

    let vertical = 'down';
    let horizontal = 'right';

    if (AnchorTop > ViewportHeight * 0.67) {
      vertical = 'up';
    } else if (AnchorTop > ViewportHeight * 0.33) {
      vertical = 'middle';
    }

    if (AnchorLeft > ViewportWidth * 0.67) {
      horizontal = 'left';
    } else if (AnchorLeft > ViewportWidth * 0.33) {
      horizontal = 'center';
    }

    if (vertical === 'down') {
      if (horizontal === 'right') {
        if (ViewportWidth < 672) {
          this._direction = 'bottom';
          this._anchorPosition = 'start';

          this._contentEl.style.top = AnchorBottom + 'px';
          this._contentEl.style.left = AnchorCenter + 'px';
        } else {
          this._direction = 'right';
          this._anchorPosition = 'start';

          this._contentEl.style.top = AnchorMiddle + 'px';
          this._contentEl.style.left = AnchorRight + 'px';
        }
      } else if (horizontal === 'center') {
        this._direction = 'bottom';
        this._anchorPosition = 'center';

        this._contentEl.style.top = AnchorBottom + 'px';
        this._contentEl.style.left = AnchorCenter + 'px';
      } else {
        if (ViewportWidth < 672) {
          this._direction = 'bottom';
          this._anchorPosition = 'end';

          this._contentEl.style.top = AnchorBottom + 'px';
          this._contentEl.style.left = AnchorCenter + 'px';
        } else {
          this._direction = 'left';
          this._anchorPosition = 'start';

          this._contentEl.style.top = AnchorMiddle + 'px';
          this._contentEl.style.left = AnchorLeft + 'px';
        }
      }
    } else if (vertical === 'middle') {
      if (horizontal === 'right') {
        if (ViewportWidth < 672) {
          this._direction = 'top';
          this._anchorPosition = 'start';

          this._contentEl.style.top = AnchorTop + 'px';
          this._contentEl.style.left = AnchorCenter + 'px';
        } else {
          this._direction = 'right';
          this._anchorPosition = 'center';

          this._contentEl.style.top = AnchorMiddle + 'px';
          this._contentEl.style.left = AnchorRight + 'px';
        }
      } else if (horizontal === 'center') {
        this._direction = 'top';
        this._anchorPosition = 'center';

        this._contentEl.style.top = AnchorTop + 'px';
        this._contentEl.style.left = AnchorCenter + 'px';
      } else {
        if (ViewportWidth < 672) {
          this._direction = 'top';
          this._anchorPosition = 'end';

          this._contentEl.style.top = AnchorTop + 'px';
          this._contentEl.style.left = AnchorCenter + 'px';
        } else {
          this._direction = 'left';
          this._anchorPosition = 'center';

          this._contentEl.style.top = AnchorMiddle + 'px';
          this._contentEl.style.left = AnchorLeft + 'px';
        }
      }
    } else {
      if (horizontal === 'right') {
        if (ViewportWidth < 672) {
          this._direction = 'top';
          this._anchorPosition = 'start';

          this._contentEl.style.top = AnchorTop + 'px';
          this._contentEl.style.left = AnchorCenter + 'px';
        } else {
          this._direction = 'right';
          this._anchorPosition = 'end';

          this._contentEl.style.top = AnchorMiddle + 'px';
          this._contentEl.style.left = AnchorRight + 'px';
        }
      } else if (horizontal === 'center') {
        this._direction = 'top';
        this._anchorPosition = 'center';

        this._contentEl.style.top = AnchorTop + 'px';
        this._contentEl.style.left = AnchorCenter + 'px';
      } else {
        if (ViewportWidth < 672) {
          this._direction = 'top';
          this._anchorPosition = 'end';

          this._contentEl.style.top = AnchorTop + 'px';
          this._contentEl.style.left = AnchorCenter + 'px';
        } else {
          this._direction = 'left';
          this._anchorPosition = 'end';

          this._contentEl.style.top = AnchorMiddle + 'px';
          this._contentEl.style.left = AnchorLeft + 'px';
        }
      }
    }
  }

  private _handleOpen() {
    clearTimeout(this._timer);
    this._positionTooltip();

    setTimeout(() => {
      this._open = true;
    }, 100);
  }

  private _handleClose() {
    this._open = false;
  }

  private _handleMouseLeave() {
    this._timer = setTimeout(() => {
      this._open = false;
      clearTimeout(this._timer);
    }, 500);
  }

  private _handleEsc(e: KeyboardEvent) {
    if (this._open && e.key === 'Escape') {
      this._open = false;
    }
  }

  private _emitToggle() {
    const event = new CustomEvent('on-tooltip-toggle', {
      detail: { open: this._open },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('_open') && changedProps.get('_open') !== undefined) {
      this._emitToggle();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', (e) => this._handleEsc(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('keydown', (e) => this._handleEsc(e));
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tooltip': Tooltip;
  }
}
