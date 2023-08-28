/**
 * Copyright Kyndryl, Inc. 2023
 */

// External library imports
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

// Relative component imports
import stylesheet from './breadcrumbs.scss';

/**
 * Breadcrumbs Component.
 *
 * @description Provides a navigation aid that displays the user's location in a hierarchical structure.
 *
 * @slot - Slot for inserting breadcrumb items, typically links indicating the navigation path.
 */
@customElement('kyn-breadcrumbs')
export class Breadcrumbs extends LitElement {
  static override styles = [stylesheet];

  override render() {
    return html`
      <ul class="breadcrumbs">
        <slot></slot>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-breadcrumbs': Breadcrumbs;
  }
}
