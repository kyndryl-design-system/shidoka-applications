import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import exportIcon from '@carbon/icons/es/export/20';
import overflowIcon from '@carbon/icons/es/overflow-menu--vertical/20';

import styles from './batch-actions.scss';

@customElement('batch-actions')
export class BatchActions extends LitElement {
  static override styles = [styles];

  @property({ type: Function })
  handleDelete = () => {};

  /**
   * Determines if the component is being rendered on a mobile device.
   * @ignore
   */
  @state()
  isMobile = window.innerWidth < 768;

  override render() {
    return html`
      <kd-button
        kind="primary-app"
        type="button"
        destructive
        size="small"
        @on-click=${this.handleDelete}
      >
        Delete
      </kd-button>
      <div class="actions-container">
        <span style="margin-left: 0.5rem; margin-right: 0.5rem"></span>
        <kd-button
          kind="secondary"
          type="button"
          size="small"
          iconposition="left"
        >
          <kd-icon slot="icon" .icon=${exportIcon}></kd-icon>
          Export
        </kd-button>
        <span style="margin-left: 0.5rem; margin-right: 0.5rem"></span>
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
      <div class="vertical-overflow-menu">
        <kd-button
          kind="tertiary"
          type="button"
          size="small"
          iconposition="center"
        >
          <kd-icon slot="icon" .icon=${overflowIcon}></kd-icon>
        </kd-button>
      </div>
    `;
  }
}
