import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabScss from './tab.scss';

@customElement('kyn-tab')
export class Tab extends LitElement {
  static override styles = TabScss;

  @property({ type: String, reflect: true })
  override id = '';

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean })
  disabled = false;

  @state()
  private _size = 'md';

  @state()
  private _vertical = false;

  @property({
    type: Boolean,
    reflect: true,
    attribute: 'data-aiconnected',
    converter: {
      fromAttribute: (value: string | null) => value === 'true',
      toAttribute: (value: boolean) => (value ? 'true' : 'false'),
    },
  })
  aiConnected = false;

  @property({ type: String, reflect: true, attribute: 'data-tab-style' })
  tabStyle = 'contained';

  @property({ type: String, reflect: true })
  override role = 'tab';

  @property({ type: Number, reflect: true })
  override tabIndex = 0;

  @property({ type: String, reflect: true })
  'aria-selected' = 'false';

  @property({ type: String, reflect: true })
  'aria-controls' = '';

  @property({ type: String, reflect: true })
  'aria-disabled' = 'false';

  override render() {
    const classes = {
      tab: true,
      contained: this.tabStyle === 'contained',
      line: this.tabStyle === 'line',
      'size--sm': this._size === 'sm',
      'size--md': this._size === 'md',
      vertical: this._vertical,
      selected: this.selected,
      disabled: this.disabled,
      [`ai-connected--${this.aiConnected}`]: true,
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
