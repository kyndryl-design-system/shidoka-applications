import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './localNavDivider.scss';

/**
 * Local Nav divider
 */
@customElement('kyn-local-nav-divider')
export class LocalNavDivider extends LitElement {
  static override styles = Styles;

  /** Optional heading text. */
  @property({ type: String })
  heading = '';

  /** The local nav desktop expanded state.
   * @internal
   */
  @state()
  _navExpanded = false;

  override render() {
    return html`
      <div class="divider ${this._navExpanded ? 'nav-expanded' : ''}">
        ${this.heading !== ''
          ? html` <div class="heading">${this.heading}</div> `
          : null}
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav-divider': LocalNavDivider;
  }
}
