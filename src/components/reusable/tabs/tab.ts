import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabScss from './tab.scss';

/**
 * Tabs.
 * @slot unnamed - Slot for tab button text.
 */
@customElement('kyn-tab')
export class Tab extends LitElement {
  static override styles = TabScss;

  /** Tab ID, required. */
  @property({ type: String, reflect: true })
  override id = '';

  /** Tab selected state. Must match Tab Panel visible state. */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /** Size of the tab buttons. Inherited.
   * @internal
   */
  @state()
  private _size = 'md';

  /** Vertical orientation. Inherited.
   * @internal
   */
  @state()
  private _vertical = false;

  /** Contained style. Inherited.
   * @internal
   */
  @state()
  private _contained = false;

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override role = 'tab';

  /** Make host tabbable.
   * @internal
   */
  @property({ type: Number, reflect: true })
  override tabIndex = 0;

  /** aria-controls.
   * @internal
   */
  @property({ type: String, reflect: true })
  'aria-selected' = 'false';

  /** aria-controls.
   * @internal
   */
  @property({ type: String, reflect: true })
  'aria-controls' = '';

  override render() {
    const classes = {
      tab: true,
      contained: this._contained,
      'size--sm': this._size === 'sm',
      'size--md': this._size === 'md',
      'size--lg': this._size === 'lg',
      vertical: this._vertical,
      selected: this.selected,
    };

    return html` <div class=${classMap(classes)}><slot></slot></div> `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', (e) => this._handleClick(e));
  }

  override disconnectedCallback() {
    this.removeEventListener('click', (e) => this._handleClick(e));
    super.disconnectedCallback();
  }

  /**
   * Updates the 'aria-controls' and 'aria-selected' attributes based on changes to the
   * 'id' and 'selected' properties, respectively.
   * @param {any} changedProps - The `changedProps` parameter is an object that contains the properties
   * that have changed in the component. It is used to determine which properties have been updated and
   * perform specific actions based on those changes.
   */
  override willUpdate(changedProps: any) {
    if (changedProps.has('id')) {
      this['aria-controls'] = this.id + '-panel';
    }

    if (changedProps.has('selected')) {
      this['aria-selected'] = this.selected.toString();
      this.tabIndex = this.selected ? 0 : -1;
    }
  }

  /**
   * Dispatches a custom event called 'tab-activated' with the original event and tabId as details,
   * if the tab is not selected.
   * @param {any} e - The parameter "e" is an event object that represents the event that triggered the
   * click event handler.
   */
  private _handleClick(e: any) {
    if (!this.selected) {
      const event = new CustomEvent('tab-activated', {
        bubbles: true,
        composed: true,
        detail: { origEvent: e, tabId: this.id },
      });
      this.dispatchEvent(event);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tab': Tab;
  }
}
