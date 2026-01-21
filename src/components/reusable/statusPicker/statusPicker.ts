import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import StatusPickerScss from './statusPicker.scss?inline';

enum STATUS_KINDS {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  AI = 'ai',
}

/**
 * Status Picker.
 * @fires on-click - Captures the click event and emits the Status Picker value. `detail:{ origEvent: PointerEvent,value: string }`
 * @slot unnamed - Slot for icon.
 */

@customElement('kyn-status-picker')
export class StatusPicker extends LitElement {
  static override styles = unsafeCSS(StatusPickerScss);

  /**
   * Status label (Required).
   */
  @property({ type: String })
  accessor label = '';

  /**
   * Specify disabled state.
   */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * Specify selected state.
   */
  @property({ type: Boolean })
  accessor selected = false;

  /**
   * Removes label text truncation.
   */
  @property({ type: Boolean })
  accessor noTruncation = false;

  /**
   * Specifies the visual appearance/kind of the status.
   */
  @property({ type: String })
  accessor kind: STATUS_KINDS = STATUS_KINDS.SUCCESS;

  /**
   * Determine if contains icon only.
   * @internal
   */
  @state()
  accessor _iconOnly = false;

  override render() {
    const newBaseColorClass = `status-picker__state-${this.kind}`;

    const Classes = {
      'status-picker': true,
      'no-truncation': this.noTruncation,
      'status-picker__state-interactive': true,
      [`status-picker__state-interactive-${this.kind}`]: true,
      'status-picker__state-disable': this.disabled,
      [`${newBaseColorClass}`]: true,
      selected: this.selected,
    };

    return html`<button
      class="${classMap(Classes)}"
      ?disabled="${this.disabled}"
      kind=${this.kind}
      title="${this.label}"
      tabindex=${this.disabled ? -1 : 0}
      @click=${(e: any) => this.handleStatusClick(e, this.label)}
    >
      <slot></slot>
      ${!this._iconOnly
        ? html` <span
            class="status-picker__label"
            aria-disabled=${this.disabled}
            >${this.label}</span
          >`
        : ''}
    </button>`;
  }

  private handleStatusClick(e: any, value: string) {
    if (!this.disabled) {
      const event = new CustomEvent('on-click', {
        detail: {
          value,
          origEvent: e,
        },
      });
      this.dispatchEvent(event);
    }
  }

  override updated(changedProperties: PropertyValues) {
    this.label = this.label.trim();
    super.updated(changedProperties);

    if (this.label.length === 0) {
      this._iconOnly = true;
    } else {
      this._iconOnly = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-status-picker': StatusPicker;
  }
}
