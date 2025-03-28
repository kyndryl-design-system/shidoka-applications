import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import FileUploaderItemScss from './fileUploaderItem.scss';

/**
 * File Uploader Item
 * @slot status-icon - Slot for status icon.
 * @slot unnamed - Slot for file details.
 * @slot actions - Slot for actions.
 */
@customElement('kyn-file-uploader-item')
export class FileUploaderItem extends LitElement {
  static override styles = FileUploaderItemScss;

  override render() {
    return html`
      <div class="file-uploader-item-container">
        <div class="status-icon">
          <slot name="status-icon"></slot>
        </div>
        <div class="file-details">
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader-item': FileUploaderItem;
  }
}
