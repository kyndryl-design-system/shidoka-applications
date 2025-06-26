import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabPanelScss from './tabPanel.scss?inline';

/**
 * Tabs.
 * @slot unnamed - Slot for tab content.
 */
@customElement('kyn-tab-panel')
export class TabPanel extends LitElement {
  static override styles = unsafeCSS(TabPanelScss);

  /** Matching Tab ID, required. */
  @property({ type: String })
  accessor tabId = '';

  /** Tab Panel visible state.  Must match Tab selected state. */
  @property({ type: Boolean, reflect: true })
  accessor visible = false;

  /** Remove side padding (left/right) on tab panel. */
  @property({ type: Boolean })
  accessor noPadding = false;

  /** Vertical orientation. Inherited.
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'vertical' })
  accessor vertical = false;

  /**
   * @internal
   * Kept for backward compatibility
   */
  private get _vertical(): boolean {
    return this.vertical;
  }

  /** Tab Panel ID.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor id = '';

  /** aria role.
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor role = 'tabpanel';

  /** aria-labelledby, derived from tabId.
   * @internal
   */
  @property({ type: String, reflect: true })
  accessor 'aria-labelledby' = '';

  override render() {
    const classes = {
      'tab-panel': true,
      vertical: this._vertical,
      'no-padding': this.noPadding,
    };

    return html` <div class=${classMap(classes)}><slot></slot></div> `;
  }

  /**
   * Updates the id and aria-labelledby properties based on the changed tabId property.
   * @param {any} changedProps - The `changedProps` parameter is an object that contains the properties
   * that have changed in the component. It is used to determine which properties have been updated and
   * perform specific actions based on those changes.
   */
  override willUpdate(changedProps: any) {
    if (changedProps.has('tabId')) {
      this.id = this.tabId + '-panel';
      this['aria-labelledby'] = this.tabId;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tab-panel': TabPanel;
  }
}
