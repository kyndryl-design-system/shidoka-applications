import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../loaders/aiLoader';
import '../loaders/spinner';
import pdfIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/document-pdf.svg';
import pptIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/document-ppt.svg';
import wordIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/document-doc.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-filled.svg';
import ThumbnailScss from './thumbnail.scss?inline';

/**
 * Thumbnail component for displaying file previews.
 * @slot icon - Slot for custom file type icon.
 */
@customElement('kyn-thumbnail')
export class Thumbnail extends LitElement {
  static override styles = unsafeCSS(ThumbnailScss);

  /**
   * File name to display.
   */
  @property({ type: String })
  accessor fileName = '';

  /**
   * File type for icon selection.
   */
  @property({ type: String })
  accessor fileType = 'document';

  /**
   * Whether thumbnail is in loading state.
   */
  @property({ type: Boolean })
  accessor loading = false;

  override render() {
    const thumbnailClasses = {
      thumbnail: true,
      loading: this.loading,
    };

    return html`
      <div class=${classMap(thumbnailClasses)}>
        <div class="thumbnail-content">
          <div class="file-type">
            <slot name="icon"> ${unsafeSVG(this._getFileTypeIcon())} </slot>
          </div>
          <div class="file-name" title="${this.fileName}">${this.fileName}</div>
          <button
            class="close-button"
            @click=${this._handleClose}
            aria-label="Remove file"
            type="button"
          >
            ${unsafeSVG(closeIcon)}
          </button>
          ${this.loading
            ? html`
                <div class="loading-overlay">
                  <kyn-spinner
                    variant="ai"
                    size="mini"
                    role="status"
                    aria-label="Loading file preview"
                  ></kyn-spinner>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }

  private _getFileTypeIcon() {
    switch (this.fileType.toLowerCase()) {
      case 'pdf':
        return pdfIcon;
      case 'ppt':
      case 'pptx':
      case 'powerpoint':
        return pptIcon;
      case 'doc':
      case 'docx':
      case 'word':
      case 'document':
        return wordIcon;
      default:
        return wordIcon; // Default to word icon
    }
  }

  private _handleClose(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('thumbnail-close', {
        detail: { fileName: this.fileName, fileType: this.fileType },
        bubbles: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-thumbnail': Thumbnail;
  }
}
