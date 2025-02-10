import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import '../../button';
import exportIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/upload.svg';
import exportIcon16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/upload.svg';
import overflowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/overflow.svg';
import trashCanIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import styles from './batch-actions.scss';
import '../index';

@customElement('batch-actions')
export class BatchActions extends LitElement {
  static override styles = [styles];

  @property({ attribute: false })
  handleDelete = () => {};

  @property({ type: Boolean, reflect: true })
  opened = false;

  /**
   * Determines if the component is being rendered on a mobile device.
   * @ignore
   */
  @state()
  isMobile = window.innerWidth < 768;

  handleClick = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    this.opened = !this.opened;
  };

  override render() {
    return html`
      <div class="action-delete">
        <kyn-button
          kind="primary-app"
          type="button"
          destructive
          size="small"
          @on-click=${this.handleDelete}
          class="delete-button"
        >
          Delete
        </kyn-button>
        <kyn-button
          kind="tertiary"
          type="button"
          destructive
          size="small"
          iconposition="center"
          @on-click=${this.handleDelete}
          class="delete-button__mobile"
        >
          <span slot="icon">${unsafeSVG(trashCanIcon)}</span>
        </kyn-button>
      </div>
      <div class="vertical-overflow-menu">
        <kyn-button
          kind="tertiary"
          type="button"
          size="small"
          iconposition="center"
          @on-click=${() => (this.opened = !this.opened)}
        >
          <span slot="icon">${unsafeSVG(overflowIcon)}</span>
        </kyn-button>
      </div>
      <div class="menu">
        <kyn-table>
          <kyn-tbody>
            <kyn-tr class="menu-item" @click=${this.handleClick}>
              <kyn-td class="menu-item__icon">
                <kyn-button
                  kind="tertiary"
                  type="button"
                  size="small"
                  iconposition="center"
                >
                  <span slot="icon">${unsafeSVG(exportIcon16)}</span>
                </kyn-button>
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
          <kyn-button
            kind="secondary"
            type="button"
            size="small"
            iconposition="left"
          >
            <span slot="icon">${unsafeSVG(exportIcon)}</span>
            Export
          </kyn-button>
        </div>
        <div class="action-item">
          <kyn-button
            kind="secondary"
            type="button"
            size="small"
            iconposition="right"
            description=""
            href=""
          >
            Action
          </kyn-button>
        </div>
      </div>
    `;
  }
}
