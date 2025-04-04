import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import FileUploaderListContainerScss from './fileUploaderListContainer.scss';
import '../link';

/**
 * File Uploader List Container
 * @slot unnamed - Slot for individual file uploader items.
 * @slot action-button - Slot for action button.
 */
@customElement('kyn-file-uploader-list-container')
export class FileUploaderListContainer extends LitElement {
  static override styles = FileUploaderListContainerScss;

  /**
   * File details container title.
   */
  @property({ type: String })
  titleText = 'File details';

  /**
   * Show all text.
   */
  // @property({ type: String })
  // showAll = 'Show all files';

  /**
   * Show less text.
   */
  // @property({ type: String })
  // showLess = 'Show less files';

  /**
   * Limit visible file uploader items.
   * @internal
   */
  // @state()
  // _limitRevealed = false;

  /**
   * Queries for all slotted elements.
   * @internal
   */
  @queryAssignedElements()
  _fileItems!: Array<any>;

  /**
   * Queries for the items container element.
   * @internal
   */
  @query('.file-uploader-list-container__items')
  _container!: HTMLElement;

  /**
   * Scroll event handler.
   * @internal
   */
  @state()
  _scrollHandler: EventListener | null = null;

  get hasMoreThanThreeItems() {
    return this._fileItems.length > 3;
  }

  override firstUpdated() {
    if (this.hasMoreThanThreeItems) {
      this._container.classList.add('shadow-bottom');
      this._addScrollListener();
    }
  }

  override render() {
    return html`
      <div class="file-uploader-list-container">
        <div class="file-uploader-list-container__header">
          ${this.titleText}
          <slot name="action-button"></slot>
        </div>
        <div class="file-uploader-list-container__items">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
        <!-- footer would go here, if needed. -->
      </div>
    `;
  }

  private _handleSlotChange() {
    if (this.hasMoreThanThreeItems) this._addScrollListener();
    else {
      setTimeout(() => {
        this._removeScrollListener();
      }, 10);
    }
    this.requestUpdate();
  }

  private _addScrollListener() {
    if (this._container) {
      this._scrollHandler = this._toggleShadowClass.bind(this, this._container);
      this._container.addEventListener('scroll', this._scrollHandler);
      this._container.classList.add('shadow-bottom');
    }
  }

  private _removeScrollListener() {
    if (this._container && this._scrollHandler) {
      this._container.removeEventListener('scroll', this._scrollHandler);
      this._container.classList.remove('shadow-bottom', 'shadow-top');
    }
  }

  private _toggleShadowClass(container: HTMLElement) {
    if (!container) return;

    const isAtTop = container.scrollTop === 0;
    const isAtBottom =
      container.scrollHeight - container.scrollTop === container.clientHeight;

    if (isAtTop) {
      container.classList.add('shadow-bottom');
      container.classList.remove('shadow-top');
    } else if (isAtBottom) {
      container.classList.add('shadow-top');
      container.classList.remove('shadow-bottom');
    } else {
      container.classList.remove('shadow-bottom', 'shadow-top');
    }
  }

  /* 
    ${hasMoreThanThreeItems
    ? html` <div class="file-uploader-list-container__footer">
      <kyn-link
        standalone
        @on-click=${() => this._toggleReveal(!this._limitRevealed)}
        >${this._limitRevealed ? this.showLess : this.showAll}</kyn-link
      >
      </div>`
    : ''}
  */

  /*
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
    if (this._fileItems) {
      this._fileItems.forEach((item: any, index: number) => {
        if (index >= limit) {
          item.style.display = reveal ? 'block' : 'none';
        }
      });
    }
  }
  */
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader-list-container': FileUploaderListContainer;
  }
}
