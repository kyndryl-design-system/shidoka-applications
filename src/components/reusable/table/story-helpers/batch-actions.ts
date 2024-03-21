import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import exportIcon from '@carbon/icons/es/export/20';
import exportIcon16 from '@carbon/icons/es/export/16';
import overflowIcon from '@carbon/icons/es/overflow-menu--vertical/20';
import trashCanIcon from '@carbon/icons/es/trash-can/20';
import styles from './batch-actions.scss';
import '../index';

@customElement('batch-actions')
export class BatchActions extends LitElement {
  static override styles = [styles];

  @property({ attribute: false })
  accessor handleDelete = () => {};

  @property({ type: Boolean, reflect: true })
  accessor opened = false;

  /**
   * Determines if the component is being rendered on a mobile device.
   * @ignore
   */
  @state()
  accessor isMobile = window.innerWidth < 768;

  handleClick = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    this.opened = !this.opened;
  };

  override render() {
    return html`
      <div class="action-delete">
        <kd-button
          kind="primary-app"
          type="button"
          destructive
          size="small"
          @on-click=${this.handleDelete}
          class="delete-button"
        >
          Delete
        </kd-button>
        <kd-button
          kind="tertiary"
          type="button"
          destructive
          size="small"
          iconposition="center"
          @on-click=${this.handleDelete}
          class="delete-button__mobile"
        >
          <kd-icon slot="icon" .icon=${trashCanIcon}></kd-icon>
        </kd-button>
      </div>
      <div class="vertical-overflow-menu">
        <kd-button
          kind="tertiary"
          type="button"
          size="small"
          iconposition="center"
          @on-click=${() => (this.opened = !this.opened)}
        >
          <kd-icon slot="icon" .icon=${overflowIcon}></kd-icon>
        </kd-button>
      </div>
      <div class="menu">
        <kyn-table>
          <kyn-tbody>
            <kyn-tr class="menu-item" @click=${this.handleClick}>
              <kyn-td class="menu-item__icon">
                <kd-button
                  kind="tertiary"
                  type="button"
                  size="small"
                  iconposition="center"
                >
                  <kd-icon slot="icon" .icon=${exportIcon16}></kd-icon>
                </kd-button>
              </kyn-td>
              <kyn-td class="menu-item__label">Export</kyn-td>
            </kyn-tr>
            <kyn-tr class="menu-item" @click=${this.handleClick}>
              <kyn-td class="menu-item__icon"></kyn-td>
              <kyn-td class="menu-item__label">Action</kyn-td>
            </kyn-tr>
          </kyn-tbody>
        </kyn-table>
      </div>
      <div class="actions-container">
        <div class="action-item">
          <kd-button
            kind="secondary"
            type="button"
            size="small"
            iconposition="left"
          >
            <kd-icon slot="icon" .icon=${exportIcon}></kd-icon>
            Export
          </kd-button>
        </div>
        <div class="action-item">
          <kd-button
            kind="secondary"
            type="button"
            size="small"
            iconposition="right"
            description=""
            href=""
          >
            Action
          </kd-button>
        </div>
      </div>
    `;
  }
}
