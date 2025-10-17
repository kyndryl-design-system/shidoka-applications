import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import GlobalFilterScss from './globalFilter.scss?inline';

/**
 * DEPRECATED. See [Patterns/Search & Action Bar](/docs/patterns-search-action-bar--docs).
 * @slot unnamed - Left slot, intended for search input and modal.
 * @slot actions - Right slot, intended for action buttons and overflow menu.
 * @slot tags - Slot below the filter bar, for tag group.
 */
@customElement('kyn-global-filter')
export class GlobalFilter extends LitElement {
  static override styles = unsafeCSS(GlobalFilterScss);

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
