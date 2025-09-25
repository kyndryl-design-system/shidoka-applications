import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import CheckboxScss from './checkbox.scss?inline';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Checkbox.
 * @fires on-checkbox-change - Captures the change event and emits the selected value and original event details.
 * @slot unnamed - Slot for label text.
 */
@customElement('kyn-checkbox')
export class Checkbox extends LitElement {
  static override styles = unsafeCSS(CheckboxScss);

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Checkbox value. */
  @property({ type: String })
  accessor value = '';

  /**
   * Checkbox name, inherited from the parent group.
   * @ignore
   */
  @property({ type: String })
  accessor name = '';

  /**
   * Checkbox checked state, inherited from the parent group if value matches.
   * @internal
   */
  @property({ type: Boolean, reflect: true })
  accessor checked = false;

  /**
   * Makes the input required, inherited from the parent group.
   * @internal
   */
  @property({ type: Boolean })
  accessor required = false;

  /**
   * Checkbox disabled state, inherited from the parent group.
   */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * Checkbox readonly state, inherited from the parent group.
   */
  @property({ type: Boolean })
  accessor readonly = false;

  /**
   * Prevent checkbox from being focusable. Disables it functionally but not visually.
   */
  @property({ type: Boolean })
  accessor notFocusable = false;

  /**
   * Checkbox group invalid state, inherited from the parent group.
   * @internal
   */
  @property({ type: Boolean })
  accessor invalid = false;

  /**
   * Determines whether the label should be hidden from visual view but remain accessible
   * to screen readers for accessibility purposes.
   */
  @property({ type: Boolean })
  accessor visiblyHidden = false;

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean })
  accessor indeterminate = false;

  override render() {
    const classes = {
      disabled: this.disabled,
      readonly: this.readonly,
      'label-hidden': this.visiblyHidden,
    };

    return html`
      <label
        ?disabled=${this.disabled}
        ?readonly=${!this.disabled && this.readonly}
        ?invalid=${this.invalid}
        class=${classMap(classes)}
      >
        <span class=${classMap({ 'sr-only': this.visiblyHidden })}>
          <slot></slot>
        </span>

        <input
          class=${classMap(classes)}
          type="checkbox"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?required=${this.required}
          ?disabled=${this.disabled || this.notFocusable}
          ?readonly=${!this.disabled && this.readonly}
          data-readonly=${ifDefined(this.readonly ? '' : undefined)}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          tabindex=${this.disabled || this.notFocusable ? -1 : 0}
          @change=${this.handleChange}
          @click=${this.blockIfReadonly}
          @keydown=${this.blockToggleIfReadonly}
          .indeterminate=${this.indeterminate}
        />
      </label>
    `;
  }

  private blockIfReadonly = (e: Event) => {
    if (!this.readonly) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const input = e.currentTarget as HTMLInputElement;
    input.checked = this.checked;
  };

  private blockToggleIfReadonly = (e: KeyboardEvent) => {
    if (!this.readonly) return;
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;

    if (this.readonly) {
      e.preventDefault();
      input.checked = this.checked;
      return;
    }

    this.checked = input.checked;

    this.dispatchEvent(
      new CustomEvent('on-checkbox-change', {
        bubbles: true,
        composed: true,
        detail: {
          checked: this.checked,
          value: this.value,
          origEvent: e,
        },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-checkbox': Checkbox;
  }
}
