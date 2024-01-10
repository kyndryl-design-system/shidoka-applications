import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TooltipScss from './tooltip.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import infoIcon from '@carbon/icons/es/information/20';

/**
 * Tooltip.
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
          @click=${this._handleClick}
        >
          <slot name="anchor"><kd-icon .icon=${infoIcon}></kd-icon></slot>
        </button>

        <div
          id="tooltip"
          aria-hidden=${!this.open}
          role="tooltip"
          class=${classMap(classes)}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _handleClick() {
    this.open = !this.open;
  }

  private _handleClickOut(e: Event) {
    if (this.open && !e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  private _handleEsc(e: KeyboardEvent) {
    if (this.open && e.key === 'Escape') {
      this.open = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', (e) => this._handleClickOut(e));
    document.addEventListener('keydown', (e) => this._handleEsc(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));
    document.removeEventListener('keydown', (e) => this._handleEsc(e));
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tooltip': Tooltip;
  }
}
