import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderPanelScss from './headerPanel.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import closeIcon from '@carbon/icons/es/close/24';

/**
 * Header fly-out panel.
 * @slot unnamed - Slot for panel content.
 * @slot button - Slot for button icon.
 */
@customElement('kyn-header-panel')
export class HeaderPanel extends LitElement {
  static override styles = HeaderPanelScss;

  /** Panel extends from right instead of left. */
  @property({ type: Boolean })
  right = false;

  /** Panel open state. */
  @property({ type: Boolean })
  open = false;

  /** Panel heading. */
  @property({ type: String })
  heading = '';

  /** Open button assistive text. */
  @property({ type: String })
  openText = 'Open Panel';

  /** Close button assistive text. */
  @property({ type: String })
  closeText = 'Close Panel';

  /**
   * A generated unique id
   * @ignore
   */
  @state() private _id = crypto.randomUUID();

  override render() {
    const buttonClasses = {
      interactive: true,
      open: this.open,
    };

    const panelClasses = {
      panel: true,
      open: this.open,
      right: this.right,
    };

    return html`
      <button
        class="${classMap(buttonClasses)}"
        title=${this.openText}
        aria-label=${this.openText}
        @click=${this.togglePanel}
        aria-controls=${this._id}
        aria-expanded=${this.open}
      >
        <slot name="button"></slot>
      </button>

      <div id=${this._id} class="${classMap(panelClasses)}" tabindex="-1">
        <div class="heading">
          <button
            class="${classMap(buttonClasses)}"
            title=${this.closeText}
            aria-label=${this.closeText}
            @click=${this.togglePanel}
          >
            <kd-icon .icon=${closeIcon}></kd-icon>
          </button>

          <div class="heading__text">${this.heading}</div>
        </div>

        <slot></slot>
      </div>
    `;
  }

  private togglePanel() {
    this.open = !this.open;
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this.handleClickOut(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-panel': HeaderPanel;
  }
}
