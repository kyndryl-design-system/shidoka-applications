import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import GlobalFilterScss from './globalFilter.scss';

/**
 * Global Filter bar.
 */
@customElement('kyn-global-filter')
export class GlobalFilter extends LitElement {
  static override styles = GlobalFilterScss;

  override render() {
    return html`
      <div class="global-filter">
        <div class="filter-bar">
          <slot></slot>

          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </div>

        <div class="tags">
          <slot name="tags"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-global-filter': GlobalFilter;
  }
}
