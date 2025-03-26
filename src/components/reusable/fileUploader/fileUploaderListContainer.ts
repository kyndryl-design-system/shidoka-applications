import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import FileUploaderListContainerScss from './fileUploaderListContainer.scss';
import '../link';

/**
 * File Uploader List Container
 * @slot unnamed - Slot for individual file uploader items.
 */
@customElement('kyn-file-uploader-list-container')
export class FileUploaderListContainer extends LitElement {
  static override styles = FileUploaderListContainerScss;

  /** File details container title. */
  @property({ type: String })
  titleText = 'File details';

  /** Show all text. */
  @property({ type: String })
  showAll = 'Show all files';

  /** Show less text. */
  @property({ type: String })
  showLess = 'Show less files';

  /** Limit visible file uploader items.
   * @internal
   */
  @state()
  _limitRevealed = false;

  /** Queries for all slotted elements.
   * @internal
   */
  @queryAssignedElements()
  fileItems!: Array<any>;

  override render() {
    const hasMoreThanThreeItems = this.fileItems.length > 3;

    return html`
      <div class="file-uploader-list-container">
        <div class="file-uploader-list-container__label">${this.titleText}</div>
        <div class="file-uploader-list-container__items">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
        ${hasMoreThanThreeItems
          ? html` <div>
              <kyn-link
                standalone
                @on-click=${() => this._toggleReveal(!this._limitRevealed)}
                >${this._limitRevealed ? this.showLess : this.showAll}</kyn-link
              >
            </div>`
          : ''}
      </div>
    `;
  }

  override firstUpdated() {
    this._applyLimit(true);
  }

  private _handleSlotChange() {
    this._applyLimit(this._limitRevealed);
    this.requestUpdate();
  }

  private _toggleReveal(reveal: boolean) {
    this._limitRevealed = reveal;
    this._applyLimit(reveal);
  }

  private _applyLimit(reveal: boolean) {
    const limit = 3;
    if (this.fileItems) {
      this.fileItems.forEach((item: any, index: number) => {
        if (index >= limit) {
          item.style.display = reveal ? 'block' : 'none';
        }
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader-list-container': FileUploaderListContainer;
  }
}
