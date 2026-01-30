import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import StatusBtnScss from './statusButton.scss?inline';

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
 * Status Button.
 * @fires on-click - Captures the click event and emits the Status Button value. `detail:{ origEvent: PointerEvent,value: string }`
 * @slot unnamed - Slot for icon.
 */

@customElement('kyn-status-btn')
export class StatusButton extends LitElement {
  static override styles = unsafeCSS(StatusBtnScss);

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

  /**
   * Determine if label is truncated.
   * @internal
   */
  @state()
  accessor _isTruncated = false;

  /**
   * Queries the .label element.
   * @internal
   */
  @query('.status-btn__label')
  accessor _labelEl!: HTMLSpanElement;

  override render() {
    const newBaseColorClass = `status-btn__state-${this.kind}`;

    const Classes = {
      'status-btn': true,
      'no-truncation': this.noTruncation,
      'status-btn__state-interactive': true,
      [`status-btn__state-interactive-${this.kind}`]: true,
      'status-btn__state-disable': this.disabled,
      [`${newBaseColorClass}`]: true,
      selected: this.selected,
    };

    return html`<button
      type="button"
      class="${classMap(Classes)}"
      ?disabled="${this.disabled}"
      kind=${this.kind}
      title="${this._isTruncated && !this.noTruncation ? this.label : ''}"
      @click=${(e: any) => this.handleBtnClick(e, this.label)}
    >
      <slot></slot>
      ${!this._iconOnly
        ? html` <span class="status-btn__label" aria-disabled=${this.disabled}
            >${this.label}</span
          >`
        : ''}
    </button>`;
  }

  private handleBtnClick(e: any, value: string) {
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
    // Check if label is truncated
    if (this._labelEl && !this.noTruncation) {
      this._isTruncated = this._labelEl.scrollWidth > this._labelEl.clientWidth;
    }
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
    'kyn-status-btn': StatusButton;
  }
}
