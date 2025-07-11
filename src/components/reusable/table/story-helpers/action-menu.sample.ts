import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../overflowMenu';

import styles from './action-menu.scss?inline';

@customElement('action-menu')
export class ActionMenu extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean })
  accessor opened = false;

  @property({ attribute: false })
  accessor handleDelete = (id: number) => {
    console.log('Delete action triggered', id);
  };

  @property({ type: Number })
  accessor itemId = 0;

  toggleMenu() {
    this.opened = !this.opened;
  }

  deleteHandler = (itemId: number, e: any) => {
    this.dispatchEvent(
      new CustomEvent('on-delete', {
        bubbles: true,
        composed: true,
      })
    );
    e.detail.origEvent.stopPropagation();
    this.handleDelete(itemId);
    this.toggleMenu();
  };

  actionHandler = (itemId: number, e: any) => {
    e.detail.origEvent.stopPropagation();
    console.log('Action triggered', itemId);
    this.toggleMenu();
  };

  _handleToggle = (e: any) => {
    this.opened = e.detail.open;
  };

  override render() {
    return html`
      <kyn-overflow-menu
        ?open=${this.opened}
        anchorRight
        fixed
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
