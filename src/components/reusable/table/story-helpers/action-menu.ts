import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import overflowMenu from '@carbon/icons/es/overflow-menu--horizontal/16';

import styles from './action.menu.scss';

@customElement('action-menu')
export class ActionMenu extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  opened = false;

  @property({ type: Function })
  handleDelete = (id: number) => {
    console.log('Delete action triggered', id);
  };

  @property({ type: Number })
  itemId = 0;

  toggleMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.opened = !this.opened;
  }

  deleteHandler = (itemId: number, e: Event) => {
    e.stopPropagation();
    this.handleDelete(itemId);
    this.toggleMenu(e);
  };

  actionHandler = (itemId: number, e: Event) => {
    e.stopPropagation();
    console.log('View Details action triggered', itemId);
    this.toggleMenu(e);
  };

  override render() {
    return html`
      <kd-button
        kind="tertiary"
        type="button"
        size="small"
        iconposition="center"
        @on-click=${(e: Event) => this.toggleMenu(e)}
      >
        <kd-icon slot="icon" .icon=${overflowMenu}></kd-icon>
      </kd-button>

      <div class="menu">
        <div
          class="menu-item"
          @click=${(e: Event) => this.deleteHandler(this.itemId, e)}
        >
          Delete
        </div>
        <div
          class="menu-item"
          @click=${(e: Event) => this.actionHandler(this.itemId, e)}
        >
          Action
        </div>
        <div
          class="menu-item"
          @click=${(e: Event) => this.actionHandler(this.itemId, e)}
        >
          Action
        </div>
      </div>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'action-menu': ActionMenu;
  }
}
