/**
 * Copyright Kyndryl, Inc. 2023
 */

// External library imports
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

// Relative component imports
import styles from './breadcrumbs.scss';

/**
 * Breadcrumbs Component.
 *
 * @slot unnamed - Slot for inserting breadcrumb items, typically kyn-breadcrumb-items indicating the navigation path.
 */
@customElement('kyn-breadcrumbs')
export class Breadcrumbs extends LitElement {
  static override styles = [styles];

  override render() {
    return html`
      <nav aria-label="Breadcrumbs Navigation">
        <div class="breadcrumbs" role="list">
          <slot></slot>
        </div>
      </nav>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'kyn-breadcrumbs': Breadcrumbs;
  }
}
