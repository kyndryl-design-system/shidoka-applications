import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabScss from './tab.scss?inline';

@customElement('kyn-tab')
export class Tab extends LitElement {
  static override styles = unsafeCSS(TabScss);

  @property({ type: String, reflect: true })
  override accessor id = '';

  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  @property({ type: Boolean })
  accessor disabled = false;

  @state()
  private accessor _size = 'md';

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

  @property({ type: Number, reflect: true })
  override accessor tabIndex = 0;

  @property({ type: String, reflect: true })
  accessor 'aria-selected' = 'false';

  @property({ type: String, reflect: true })
  accessor 'aria-controls' = '';

  @property({ type: String, reflect: true })
  accessor 'aria-disabled' = 'false';

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

    return html`
      <div
        class=${classMap(classes)}
        tabindex="${this.disabled ? -1 : this.tabIndex}"
      >
        <slot></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);

    this.addEventListener(
      'focus',
      this._handleHostFocus as EventListener,
      true
    );
  }

  override disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener(
      'focus',
      this._handleHostFocus as EventListener,
      true
    );
    super.disconnectedCallback();
  }

  public override focus(): void {
    const inner = (this.renderRoot as ShadowRoot | null)?.querySelector(
      '.tab'
    ) as HTMLElement | null;
    if (inner) {
      inner.focus();
    } else {
      super.focus();
    }
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    if (changedProps.has('id')) {
      this['aria-controls'] = `${this.id}-panel`;
    }

    if (changedProps.has('selected')) {
      this['aria-selected'] = this.selected.toString();

      this.tabIndex = this.disabled ? -1 : 0;
    }

    if (changedProps.has('disabled')) {
      this['aria-disabled'] = this.disabled.toString();

      this.tabIndex = this.disabled ? -1 : 0;
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

  private _handleHostFocus = (e: FocusEvent) => {
    const inner = (this.renderRoot as ShadowRoot | null)?.querySelector(
      '.tab'
    ) as HTMLElement | null;
    if (inner && !this.disabled) {
      inner.focus();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tab': Tab;
  }
}
