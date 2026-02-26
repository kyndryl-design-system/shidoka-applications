import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabScss from './tab.scss?inline';

@customElement('kyn-tab')
export class Tab extends LitElement {
  static override styles = unsafeCSS(TabScss);

  /** Matching Tab ID, required. */
  @property({ type: String, reflect: true })
  override accessor id = '';

  /** Determines selected state. */
  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  /** Determines disabled state. */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * Tab size.
   * @ignore
   */
  @state()
  private accessor _size = 'md';

  /** Determines vertical state. */
  @property({ type: Boolean, reflect: true, attribute: 'vertical' })
  accessor vertical = false;

  // Keep private state for backward compatibility
  /** Get vertical state.
   * @internal
   */
  private get _vertical(): boolean {
    return this.vertical;
  }

  /** AI connected state. */
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

  /** aria role. */
  @property({ type: String, reflect: true })
  override accessor role = 'tab';

  /** Tab index. */
  @property({ type: Number, reflect: true })
  override accessor tabIndex = 0;

  /** Aria selected state. */
  @property({ type: String, reflect: true })
  accessor 'aria-selected' = 'false';

  /** Aria controls state. */
  @property({ type: String, reflect: true })
  accessor 'aria-controls' = '';

  /** Aria disabled state. */
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
      <div class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
  }

  override disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    super.disconnectedCallback();
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    if (changedProps.has('id')) {
      this['aria-controls'] = `${this.id}-panel`;
    }

    if (changedProps.has('selected')) {
      this['aria-selected'] = this.selected.toString();
      this.tabIndex = this.selected ? 0 : -1;
    }

    if (changedProps.has('disabled')) {
      this['aria-disabled'] = this.disabled.toString();
    }
  }

  /** Handle click on tab selected
   * @internal
   */
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tab': Tab;
  }
}
