import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../overflowMenu';
import overflowMenu from '@carbon/icons/es/overflow-menu--horizontal/16';

import styles from './action-menu.scss';

@customElement('action-menu')
export class ActionMenu extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean })
  opened = false;

  @property({ type: Function })
  handleDelete = (id: number) => {
    console.log('Delete action triggered', id);
  };

  @property({ type: Number })
  itemId = 0;

  toggleMenu(e: Event) {
    this.opened = !this.opened;
    console.log(this.opened);
  }

  deleteHandler = (itemId: number, e: any) => {
    e.detail.origEvent.stopPropagation();
    this.handleDelete(itemId);
    this.toggleMenu(e);
  };

  actionHandler = (itemId: number, e: any) => {
    e.detail.origEvent.stopPropagation();
    console.log('Action triggered', itemId);
    this.toggleMenu(e);
  };

  _handleToggle = (e: any) => {
    this.opened = e.detail.open;
  };

  override render() {
    return html`
      <kyn-overflow-menu
        ?open=${this.opened}
        anchorRight
        assistiveText="Actions"
        @on-toggle=${(e: Event) => this._handleToggle(e)}
        @click=${(e: Event) => e.stopPropagation()}
      >
        <kyn-overflow-menu-item
          @on-click=${(e: Event) => this.actionHandler(this.itemId, e)}
        >
          Action 1
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          href="javascript:void(0);"
          @on-click=${(e: Event) => this.actionHandler(this.itemId, e)}
        >
          Action 2
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          disabled
          @on-click=${(e: Event) => this.actionHandler(this.itemId, e)}
        >
          Action 3
        </kyn-overflow-menu-item>
        <kyn-overflow-menu-item
          destructive
          @on-click=${(e: Event) => this.deleteHandler(this.itemId, e)}
        >
          Delete
        </kyn-overflow-menu-item>
      </kyn-overflow-menu>
    `;
  }
}

// Define the custom element in the global namespace
declare global {
  interface HTMLElementTagNameMap {
    'action-menu': ActionMenu;
  }
}
