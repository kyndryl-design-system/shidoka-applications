import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../checkbox';
import '../button';

import checkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/check.svg';
import clearIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';

import EnhancedDropdownOptionScss from './enhancedDropdownOption.scss?inline';

/**
 * Enhanced Dropdown option with rich content support.
 * @fires on-click - Emits the option details to the parent dropdown. `detail:{ selected: boolean, value: string, origEvent: PointerEvent }`
 * @fires on-remove-option - Emits the option that is removed. `detail:{ selected: boolean, value: string, origEvent: PointerEvent }`
 * @slot icon - Slot for option icon. Icon size should be 16px only.
 * @slot title - Slot for option title text.
 * @slot tag - Slot for inline tag appended to title.
 * @slot description - Slot for option description text.
 * @slot optionType - Slot for option type label.
 * @slot unnamed - Fallback slot for simple text content.
 */
@customElement('kyn-enhanced-dropdown-option')
export class EnhancedDropdownOption extends LitElement {
  static override styles = unsafeCSS(EnhancedDropdownOptionScss);

  /** Option value. */
  @property({ type: String })
  accessor value = '';

  /** Internal text strings.
   * @internal
   */
  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  /** Option disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Readonly state (from parent). Option stays focusable but not selectable. */
  @property({ type: Boolean, reflect: true })
  accessor readonly = false;

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

  /** Determines whether the checkbox is in an indeterminate state. */
  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  /** ARIA role for the option, defaults to 'option'. */
  @property({ type: String, reflect: true })
  override accessor role = 'option';

  /** ARIA selected must mirror `selected`. */
  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  override accessor ariaSelected = 'false';

  /**
   * Option text, automatically derived.
   * @ignore
   */
  @state()
  accessor text: any = '';

  /**
   * Title text for display purposes, automatically derived.
   * @ignore
   */
  @state()
  accessor displayText: any = '';

  /**
   * Whether the icon slot has content.
   * @ignore
   */
  @state()
  accessor hasIcon = false;

  /** Kind of the item, derived from parent. */
  @state()
  accessor kind: 'ai' | 'default' = 'default';

  override render() {
    const classes = {
      'enhanced-option': true,
      'menu-item': true,
      'option-is-readonly': this.readonly,
      'ai-connected': this.kind === 'ai',
    };

    return html`
      <div
        class=${classMap(classes)}
        role="option"
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-disabled=${this.disabled || this.readonly ? 'true' : 'false'}
        ?highlighted=${this.highlighted}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        ?readonly=${!this.disabled && this.readonly}
        title=${this.text}
        tabindex=${this.disabled || this.readonly ? -1 : 0}
        @mousedown=${(e: MouseEvent) => {
          if (this.readonly) e.preventDefault();
        }}
        @pointerup=${(e: Event) => this.onClick(e as PointerEvent)}
        @blur=${(e: Event) => this.onBlur(e as FocusEvent)}
        @keydown=${(e: KeyboardEvent) => this.onKeyDown(e)}
      >
        ${this.multiple
          ? html`
              <kyn-checkbox
                .checked=${this.selected}
                .indeterminate=${this.indeterminate}
                ?disabled=${this.disabled}
                notFocusable
                value=${this.value}
              ></kyn-checkbox>
            `
          : null}

        <div class="content">
          <div
            class="menu-item-inner-el icon-container"
            style=${this.hasIcon ? '' : 'display:none'}
          >
            <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
          </div>

          <div class="menu-item-inner-el text">
            <div class="title-content">
              <slot name="title" @slotchange=${this.onTitleSlotChange}></slot>
              ${!this.selected
                ? html`<span class="tag-container"
                    ><slot name="tag"></slot
                  ></span>`
                : null}
            </div>
            <div class="description-container">
              <slot name="description"></slot>
            </div>
            <div class="option-type-container">
              <slot name="optionType"></slot>
            </div>
          </div>
        </div>

        <div class="status-icons">
          ${!this.multiple && this.selected
            ? html`<span class="menu-item-inner-el check-icon"
                >${unsafeSVG(checkIcon)}</span
              >`
            : this.allowAddOption && this.removable
            ? html`
                <kyn-button
                  kind=${this.kind === 'ai' ? 'ghost-ai' : 'ghost'}
                  size="small"
                  aria-label="Delete ${this.value}"
                  ?disabled=${this.disabled}
                  @click=${this.onRemove}
                  @mousedown=${(e: Event) => e.stopPropagation()}
                  @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
                  @focus=${(e: FocusEvent) => e.stopPropagation()}
                >
                  <span slot="icon">${unsafeSVG(clearIcon)}</span>
                </kyn-button>
              `
            : null}
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    // derive whether icon slot has content
    this.hasIcon = this.iconSlot.assignedNodes({ flatten: true }).length > 0;

    // sync kind from parent and listen for changes
    const parent = this.closest('kyn-dropdown') as any;
    if (parent) {
      this.kind = parent.kind;
      parent.addEventListener('kind-changed', (e: Event) => {
        this.kind = (e as CustomEvent<'ai' | 'default'>).detail;
      });
    }
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

  override focus(options?: FocusOptions) {
    (this.shadowRoot?.querySelector('.menu-item') as HTMLElement | null)?.focus(
      options
    );
  }

  private onKeyDown(e: KeyboardEvent) {
    e.stopPropagation();
    if (this.disabled || this.readonly) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        this.onClick(e as any);
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
      const tag = node.tagName.toLowerCase();
      if (
        tag === 'kyn-enhanced-dropdown-option' ||
        tag === 'kyn-dropdown-option'
      ) {
        const opt = node as any;
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
    const parent = this.parentElement;
    if (!parent) return;
    const all = parent.querySelectorAll(
      'kyn-enhanced-dropdown-option, kyn-dropdown-option'
    );
    const list = Array.from(all) as any[];
    const candidate = where === 'start' ? list[0] : list[list.length - 1];
    if (candidate && !candidate.disabled && !candidate.readonly) {
      const target = candidate.shadowRoot?.querySelector(
        '.menu-item'
      ) as HTMLElement | null;
      target?.focus();
    }
  }

  private onIconSlotChange() {
    this.hasIcon = this.iconSlot.assignedNodes({ flatten: true }).length > 0;
  }

  private get iconSlot(): HTMLSlotElement {
    return this.shadowRoot!.querySelector(
      'slot[name="icon"]'
    )! as HTMLSlotElement;
  }

  private onTitleSlotChange(e: Event) {
    const titleText = (e.target as HTMLSlotElement)
      .assignedNodes({ flatten: true })
      .map((n) => n.textContent?.trim() ?? '')
      .join(' ');
    this.displayText = titleText;
    this.text = titleText;
  }

  private onClick(e: PointerEvent) {
    if (this.disabled || this.readonly) {
      e.stopPropagation();
      return;
    }
    this.selected = this.multiple ? !this.selected : true;
    this.dispatchEvent(
      new CustomEvent('on-click', {
        bubbles: true,
        composed: true,
        detail: { selected: this.selected, value: this.value, origEvent: e },
      })
    );
  }

  private onRemove(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('on-remove-option', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private onBlur(e: FocusEvent) {
    this.dispatchEvent(
      new CustomEvent('on-blur', {
        bubbles: true,
        composed: true,
        detail: { origEvent: e },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-enhanced-dropdown-option': EnhancedDropdownOption;
  }
}
