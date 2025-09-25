import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../checkbox';
import '../button';

import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import DropdownOptionScss from './dropdownOption.scss?inline';

/**
 * Dropdown option.
 * @fires on-click - Emits the option details to the parent dropdown. `detail:{ selected: boolean, value: string, origEvent: PointerEvent }`
 * @fires on-remove-option - Emits the option that is removed. `detail:{ value: string }`
 * @slot unnamed - Slot for option text.
 * @slot icon - Slot for option icon. Icon size should be 16px only.
 */
@customElement('kyn-dropdown-option')
export class DropdownOption extends LitElement {
  static override styles = unsafeCSS(DropdownOptionScss);

  /** Option value. */
  @property({ type: String })
  accessor value = '';

  /** Internal text strings.
   * @internal
   */
  @property({ type: Boolean })
  accessor selected = false;

  /** Option disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Allow Add Option state, derived from parent. */
  @property({ type: Boolean })
  accessor allowAddOption = false;

  /**
   * Option highlighted state for keyboard navigation, automatically derived.
   * @ignore
   */
  @state()
  accessor highlighted = false;

  /** Multi-select state, derived from parent.
   * @ignore
   */
  @property({ type: Boolean })
  accessor multiple = false;

  /** Removable option. */
  @property({ type: Boolean })
  accessor removable = false;

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @state()
  accessor text: any = '';

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  /** Readonly state (from parent). Option stays focusable but not selectable. */
  @property({ type: Boolean, reflect: true })
  accessor readonly = false;

  /**
   * @deprecated Ignored. Always treated as default.
   * Kept temporarily so external code passing it doesn't break.
   */
  @state() accessor kind: 'default' | 'ai' = 'default';

  /** slotted icon added state.
   * @ignore
   */
  @state()
  accessor hasIcon = false;

  @property({ type: String, reflect: true })
  override accessor role = 'option';

  @property({ type: Number, reflect: true })
  override accessor tabIndex = -1;

  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  override accessor ariaSelected = 'false';

  override render() {
    const menuClasses = {
      option: true,
      'menu-item': true,
      'option-is-readonly': this.readonly,
    };

    return html`
      <div
        class=${classMap(menuClasses)}
        role="option"
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        ?readonly=${!this.disabled && this.readonly}
        title=${this.text}
        tabindex=${this.disabled || this.readonly ? -1 : 0}
        @pointerdown=${(e: PointerEvent) => {
          if (this.disabled || this.readonly) return;
          this.setPressed(true);
        }}
        @pointerup=${(e: PointerEvent) => {
          this.setPressed(false);
          if (!this.disabled && !this.readonly) this.handleClick(e);
        }}
        @pointercancel=${() => this.setPressed(false)}
        @pointerleave=${() => this.setPressed(false)}
        @keydown=${(e: KeyboardEvent) => {
          if (this.disabled || this.readonly) return;
          if (e.key === ' ' || e.key === 'Enter') this.setPressed(true);
          this.handleKeyDown(e);
        }}
        @keyup=${(e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') this.setPressed(false);
        }}
        @blur=${(e: FocusEvent) => {
          this.setPressed(false);
          this.handleBlur(e);
        }}
      >
        <span class="menu-item-inner-el text">
          ${this.multiple
            ? html`
                <kyn-checkbox
                  type="checkbox"
                  value=${this.value}
                  .checked=${this.selected}
                  ?checked=${this.selected}
                  ?disabled=${this.disabled}
                  ?readonly=${!this.disabled && this.readonly}
                  notFocusable
                  .indeterminate=${this.indeterminate}
                ></kyn-checkbox>
                <slot
                  @slotchange=${(e: any) => this.handleSlotChange(e)}
                ></slot>
              `
            : html`<slot
                @slotchange=${(e: any) => this.handleSlotChange(e)}
              ></slot>`}
        </span>

        <slot
          name="icon"
          style="display:none"
          @slotchange=${(e: any) => this.handleIconSlotChange(e)}
        ></slot>

        ${this.selected && !this.multiple
          ? html`<span class="menu-item-inner-el check-icon"
              >${unsafeSVG(checkIcon)}</span
            >`
          : this.allowAddOption && this.removable
          ? html`
              <kyn-button
                class="remove-option"
                kind="ghost"
                size="small"
                aria-label="Delete ${this.value}"
                description="Delete ${this.value}"
                ?disabled=${this.disabled}
                @click=${(e: Event) => this.handleRemoveClick(e)}
                @mousedown=${(e: Event) => e.stopPropagation()}
                @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
                @focus=${(e: KeyboardEvent) => e.stopPropagation()}
              >
                <span slot="icon" class="clear-icon"
                  >${unsafeSVG(clearIcon)}</span
                >
              </kyn-button>
            `
          : null}
      </div>
    `;
  }

  override firstUpdated() {
    const parent = this.closest('kyn-dropdown') as HTMLElement | null;
    if (parent) {
      parent.addEventListener('kind-changed', () => {
        this.kind = 'default';
      });
    }
  }

  private setPressed(on: boolean) {
    const el = this.shadowRoot?.querySelector(
      '.menu-item'
    ) as HTMLElement | null;
    if (!el) return;
    if (on) el.setAttribute('data-pressed', '');
    else el.removeAttribute('data-pressed');
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has('selected')) {
      this.ariaSelected = this.selected.toString();
    }
    if (changed.has('disabled') || changed.has('readonly')) {
      const el = this.shadowRoot?.querySelector(
        '.menu-item'
      ) as HTMLElement | null;
      if (el) el.tabIndex = this.disabled || this.readonly ? -1 : 0;
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.disabled || this.readonly) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        this.handleClick(e);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.moveFocus(1);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        this.moveFocus(-1);
        break;
      }
      case 'Home': {
        e.preventDefault();
        this.moveToEdge('start');
        break;
      }
      case 'End': {
        e.preventDefault();
        this.moveToEdge('end');
        break;
      }
    }
  }

  private moveFocus(delta: number) {
    let node: Element | null =
      delta > 0 ? this.nextElementSibling : this.previousElementSibling;
    while (node) {
      if (node.tagName.toLowerCase() === 'kyn-dropdown-option') {
        const opt = node as DropdownOption;
        if (!opt.disabled && !opt.readonly) {
          const target = opt.shadowRoot?.querySelector(
            '.menu-item'
          ) as HTMLElement | null;
          target?.focus();
          break;
        }
      }
      node = delta > 0 ? node.nextElementSibling : node.previousElementSibling;
    }
  }

  private moveToEdge(where: 'start' | 'end') {
    const all =
      this.parentElement?.querySelectorAll('kyn-dropdown-option') ?? [];
    const list = Array.from(all) as DropdownOption[];
    const candidate = where === 'start' ? list[0] : list[list.length - 1];
    if (candidate && !candidate.disabled && !candidate.readonly) {
      const target = candidate.shadowRoot?.querySelector(
        '.menu-item'
      ) as HTMLElement | null;
      target?.focus();
    }
  }

  private handleRemoveClick(e: Event) {
    e.stopPropagation();
    const event = new CustomEvent('on-remove-option', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
      },
    });
    this.dispatchEvent(event);
  }

  private handleSlotChange(e: any) {
    // set text prop from slotted text, for ease of access
    const nodes = e.target.assignedNodes({ flatten: true });
    let text = '';

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent.trim();
    }

    this.text = text;
  }

  private handleClick(e: Event) {
    // block interaction when disabled or readonly
    if (this.disabled || this.readonly) {
      e.stopPropagation();
      return;
    }

    if (this.multiple) {
      this.selected = !this.selected;
    } else {
      this.selected = true;
    }

    this.dispatchEvent(
      new CustomEvent('on-click', {
        bubbles: true,
        composed: true,
        detail: { selected: this.selected, value: this.value, origEvent: e },
      })
    );
  }

  private handleBlur(e: any) {
    // emit blur event, bubble so it can be captured by the parent dropdown
    const event = new CustomEvent('on-blur', {
      bubbles: true,
      composed: true,
      detail: {
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private handleIconSlotChange(e: any) {
    const nodes = e.target.assignedNodes({ flatten: true });
    this.hasIcon = nodes.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-dropdown-option': DropdownOption;
  }
}
