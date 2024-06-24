import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
// import { ifDefined } from 'lit/directives/if-defined.js';
//import { classMap } from 'lit/directives/class-map.js';
import LoaderScss from './loader.scss';

/**
 * Loader
 * @slot unnamed - Unnamed slot.
 */

@customElement('kyn-loader')
export class Loader extends LitElement {
  static override styles = LoaderScss;

  /** Loader type. `'normal'` and `'inline'`. Default `'normal'`. */
  @property({ type: Boolean })
  inline = false;

  override render() {
    return html`
      ${this.inline
        ? html`<div class="inline-spinner"></div>`
        : html`<div class="overlay">
            <div class="spinner"></div>
          </div>`}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-loader': Loader;
  }
}
