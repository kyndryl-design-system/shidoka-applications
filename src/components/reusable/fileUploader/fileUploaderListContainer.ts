import { LitElement, html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { deepmerge } from 'deepmerge-ts';
import FileUploaderListContainerScss from './fileUploaderListContainer.scss?inline';
import '../link';
import '../button';
import arrowIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';

const _defaultTextStrings = {
  expand: 'Expand',
  collapse: 'Collapse',
};

/**
 * File Uploader List Container
 * @slot unnamed - Slot for individual file uploader items.
 * @slot action-button - Slot for action button.
 */
@customElement('kyn-file-uploader-list-container')
export class FileUploaderListContainer extends LitElement {
  static override styles = unsafeCSS(FileUploaderListContainerScss);

  /**
   * File details container title.
   */
  @property({ type: String })
  accessor titleText = 'File details';

  /** Customizable text strings. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  accessor _expanded = false;

  /**
   * Queries for all slotted elements.
   * @internal
   */
  @queryAssignedElements()
  accessor _fileItems!: Array<any>;

  /**
   * Queries for the items container element.
   * @internal
   */
  @query('.file-uploader-list-container__items')
  accessor _container!: HTMLElement;

  /**
   * Scroll event handler.
   * @internal
   */
  @state()
  accessor _scrollHandler: EventListener | null = null;

  /**
   * Checks if there are more than three items in the list.
   * @internal
   */
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

        <div
          class="file-uploader-list-container__items ${this._expanded
            ? 'expanded'
            : ''}"
          tabindex=${this._expanded ? '-1' : '0'}
        >
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>

        ${this.hasMoreThanThreeItems
          ? html`
              <kyn-button
                class="expand-btn ${this._expanded ? 'expanded' : ''}"
                kind="ghost"
                size="small"
                description=${this._expanded
                  ? this._textStrings.collapse
                  : this._textStrings.expand}
                @on-click=${() => {
                  this._expanded = !this._expanded;
                }}
              >
                <span slot="icon">${unsafeSVG(arrowIcon)}</span>
              </kyn-button>
            `
          : null}

        <!-- footer would go here, if needed. -->
      </div>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  private _handleSlotChange() {
    if (this.hasMoreThanThreeItems) this._addScrollListener();
    else {
      setTimeout(() => {
        this._removeScrollListener();
      }, 20);
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
      setTimeout(() => {
        container.classList.add('shadow-bottom');
        container.classList.remove('shadow-top');
      }, 5);
    } else if (isAtBottom) {
      setTimeout(() => {
        container.classList.add('shadow-top');
        container.classList.remove('shadow-bottom');
      }, 5);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader-list-container': FileUploaderListContainer;
  }
}
