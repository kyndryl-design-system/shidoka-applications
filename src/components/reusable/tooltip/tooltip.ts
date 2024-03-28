import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TooltipScss from './tooltip.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import infoIcon from '@carbon/icons/es/information/20';

/**
 * Tooltip.
 * @fires on-tooltip-toggle - Emits the open state of the tooltip on open/close.
 * @slot unnamed - Slot for tooltip content.
 * @slot anchor - Slot for custom anchor button content.
 */
@customElement('kyn-tooltip')
export class Tooltip extends LitElement {
  static override styles = TooltipScss;

  @property({ type: Boolean })
  open = false;

  /** Tooltip anchor position. `'start'`, `'end'`, or `'center'`. */
  @property({ type: String })
  anchorPosition = 'center';

  /** Tooltip direction. `'top'`, `'bottom'`, `'left'`, or `'right'`. */
  @property({ type: String })
  direction = 'top';

  /** Assistive text for anchor button. */
  @property({ type: String })
  assistiveText = 'Toggle Tooltip';

  /** Timeout function to delay modal close.
   * @internal
   */
  @state()
  timer: any;

  override render() {
    const classes = {
      content: true,
      open: this.open,
      'anchor--start': this.anchorPosition === 'start',
      'anchor--end': this.anchorPosition === 'end',
      'anchor--center': this.anchorPosition === 'center',
      'direction--top': this.direction === 'top',
      'direction--bottom': this.direction === 'bottom',
      'direction--left': this.direction === 'left',
      'direction--right': this.direction === 'right',
    };

    return html`
      <div class="tooltip">
        <button
          aria-label=${this.assistiveText}
          title=${this.assistiveText}
          aria-describedby="tooltip"
          @mouseenter=${this._handleOpen}
          @mouseleave=${this._handleMouseLeave}
          @focus=${this._handleOpen}
          @blur=${this._handleClose}
        >
          <slot name="anchor"><kd-icon .icon=${infoIcon}></kd-icon></slot>
        </button>

        <div
          id="tooltip"
          aria-hidden=${!this.open}
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

  private _handleOpen() {
    clearTimeout(this.timer);
    this.open = true;
  }

  private _handleClose() {
    this.open = false;
  }

  private _handleMouseLeave() {
    this.timer = setTimeout(() => {
      this.open = false;
      clearTimeout(this.timer);
    }, 500);
  }

  private _handleEsc(e: KeyboardEvent) {
    if (this.open && e.key === 'Escape') {
      this.open = false;
    }
  }

  private _emitToggle() {
    const event = new CustomEvent('on-tooltip-toggle', {
      detail: { open: this.open },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('open') && changedProps.get('open') !== undefined) {
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
