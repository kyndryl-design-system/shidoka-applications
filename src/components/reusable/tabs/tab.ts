import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabScss from './tab.scss?inline';

@customElement('kyn-tab')
export class Tab extends LitElement {
  static override styles = unsafeCSS(TabScss);

  // Delegate host focus into shadow's first focusable (.tab)
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  } as const;

  @property({ type: String, reflect: true })
  override accessor id = '';

  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  @property({ type: Boolean })
  accessor disabled = false;

  @state()
  private accessor _size: 'sm' | 'md' = 'md';

  @property({ type: Boolean, reflect: true, attribute: 'vertical' })
  accessor vertical = false;

  private get _vertical(): boolean {
    return this.vertical;
  }

  @property({
    type: Boolean,
    reflect: true,
    attribute: 'data-aiconnected',
    converter: {
      fromAttribute: (value: string | null) => value === 'true',
      toAttribute: (value: boolean) => (value ? 'true' : 'false'),
    },
  })
  accessor aiConnected = false;

  @property({ type: String, reflect: true })
  override accessor role = 'tab';

  // Host remains in the tab order only when selected (roving pattern)
  @property({ type: Number, reflect: true })
  override accessor tabIndex = 0;

  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  override accessor ariaSelected = 'false';

  @property({ type: String, reflect: true, attribute: 'aria-controls' })
  accessor ariaControls = '';

  @property({ type: String, reflect: true, attribute: 'aria-disabled' })
  override accessor ariaDisabled = 'false';

  @query('.tab')
  private accessor _el!: HTMLDivElement;

  override render() {
    const classes = {
      tab: true,
      'size--sm': this._size === 'sm',
      'size--md': this._size === 'md',
      vertical: this._vertical,
      selected: this.selected,
      disabled: this.disabled,
      'ai-connected': this.aiConnected,
    };

    // Mirror ARIA + roving tabindex onto the actual focus target (.tab)
    return html`
      <div
        class=${classMap(classes)}
        role="tab"
        tabindex=${this.selected && !this.disabled ? 0 : -1}
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-controls=${this.ariaControls || `${this.id}-panel`}
        aria-disabled=${this.disabled ? 'true' : 'false'}
      >
        <slot></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._onKeyDown);
  }

  override disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._onKeyDown);
    super.disconnectedCallback();
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    if (changedProps.has('id')) {
      this.ariaControls = `${this.id}-panel`;
    }

    if (changedProps.has('selected')) {
      this.ariaSelected = this.selected.toString();
      // Host is tabbable only for the selected tab (roving pattern)
      this.tabIndex = this.selected && !this.disabled ? 0 : -1;
    }

    if (changedProps.has('disabled')) {
      this.ariaDisabled = this.disabled.toString();
      if (this.disabled) this.tabIndex = -1;
    }
  }

  override updated() {
    // Keep inner .tab in sync with host ARIA/roving settings
    if (this._el) {
      this._el.tabIndex = this.selected && !this.disabled ? 0 : -1;
      this._el.setAttribute('aria-selected', this.selected ? 'true' : 'false');
      this._el.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
      this._el.setAttribute('role', 'tab');
      this._el.setAttribute(
        'aria-controls',
        this.ariaControls || `${this.id}-panel`
      );
      this._el.toggleAttribute('disabled', this.disabled);
    }
  }

  private _handleClick = (e: Event) => {
    if (!this.selected && !this.disabled) {
      const event = new CustomEvent('tab-activated', {
        bubbles: true,
        composed: true,
        detail: { origEvent: e, tabId: this.id },
      });
      this.dispatchEvent(event);
    }
  };

  // Arrow/Home/End roving; parent switches selection and focuses new tab
  private _onKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;

    let intent: 'prev' | 'next' | 'first' | 'last' | null = null;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        intent = 'prev';
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        intent = 'next';
        break;
      case 'Home':
        intent = 'first';
        break;
      case 'End':
        intent = 'last';
        break;
      case 'Enter':
      case ' ':
        this._handleClick(e);
        e.preventDefault();
        return;
      default:
        break;
    }

    if (intent) {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('tab-key-nav', {
          bubbles: true,
          composed: true,
          detail: { intent },
        })
      );
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tab': Tab;
  }
}
