import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import uploadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/upload.svg';
import FileUploaderScss from './fileUploader.scss';
import '../button';

const _defaultTextStrings = {
  dragAndDropText: 'Drag files here to upload',
  orText: 'or',
  buttonText: 'Browse files',
  maxFileSizeText: 'Max file size',
  supportedFileTypeText: 'Supported file type: ',
  fileTypeDisplyText: 'Any file type',
};

/**
 * File Uploader
 * @fires on-file-upload - Emits the uploaded files.
 */
@customElement('kyn-file-uploader')
export class FileUploader extends LitElement {
  static override styles = FileUploaderScss;

  /**
   * Set the file types that the component accepts. By default, it accepts all file types.
   */
  @property({ type: Array })
  accept: string[] = [];

  /**
   * Accept multiple files. Default value is `false`.
   */
  @property({ type: Boolean })
  multiple = false;

  /**
   * Customizable text strings.
   */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /**
   * Set the maximum file size. Default value is `1MB`.
   */
  @property({ type: String })
  maxFileSizeText = '1MB';

  /**
   * Internal uploaded files.
   * @internal
   */
  @state()
  _uploadedFiles: Object[] = [];

  /**
   * Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  /**
   * Internal dragging state.
   * @internal
   */
  @state()
  _dragging = false;

  /**
   * Internal invalid files.
   * @internal
   */
  @state()
  _invalidFiles: Object[] = [];

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
    return html`
      <div class="file-uploader-container">
        <div class="drag-drop-container-wrapper">
          ${this.renderDragDropContainer()}
          <div class="upload-constraints">
            <p>
              ${this._textStrings.maxFileSizeText}
              <strong>${this.maxFileSizeText}</strong>.
              ${this._textStrings.supportedFileTypeText}
              <strong>${this._textStrings.fileTypeDisplyText}</strong>.
            </p>
          </div>
        </div>
        <div class="file-info-container">
          <slot name="file-details"></slot>
        </div>
        <div class="upload-status-container">
          <slot name="upload-status"></slot>
        </div>
      </div>
    `;
  }

  private renderDragDropContainer() {
    const dragDropContainerClasses = {
      'drag-drop-container': true,
      dragging: this._dragging,
    };
    return html`
      <div
        class=${classMap(dragDropContainerClasses)}
        @dragover="${this.handleDragOver}"
        @dragleave="${() => (this._dragging = false)}"
        @drop="${this.handleDrop}"
      >
        <div class="status-icon">
          <span>${unsafeSVG(uploadIcon)}</span>
        </div>
        <p class="drag-drop-text">${this._textStrings.dragAndDropText}</p>
        <p class="or-text">${this._textStrings.orText}</p>
        <kyn-button
          kind="outline"
          size="small"
          @on-click="${this._triggerFileSelect}"
        >
          ${this._textStrings.buttonText}
        </kyn-button>
        <input
          class="file-input"
          type="file"
          @change="${(e: any) => this.handleFileChange(e)}"
          id="fileInput"
          accept=${this.accept.length > 0 ? this.accept.join(',') : '*/*'}
          ?multiple=${this.multiple}
        />
      </div>
    `;
  }

  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);

      this._validateFiles(files);
      this._emitFileUploadEvent();
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._dragging = true;
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._dragging = false;

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);

      this._validateFiles(files);
      this._emitFileUploadEvent();
    }
  }

  private _triggerFileSelect() {
    const fileInputElement = this.shadowRoot?.querySelector(
      '#fileInput'
    ) as HTMLInputElement;
    fileInputElement?.click();
  }

  // Validate files
  private _validateFiles(files: File[]) {
    // Check if multiple files are uploaded
    if (!this.multiple && files.length > 1) {
      return; // need to add error message
    }

    const validFiles: Object[] = [];
    const invalidFiles: Object[] = [];

    // Parse maxFileSizeText to get the max file size in bytes
    const maxFileSizeInBytes = this._parseFileSize(this.maxFileSizeText);

    files.forEach((file) => {
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size;

      // Check if the file type is valid
      const imageWildcard = this.accept.includes('image/*');
      const audioWildcard = this.accept.includes('audio/*');
      const videoWildcard = this.accept.includes('video/*');

      const fileExtension = (fileName.split('.').pop() || '').replace(/^/, '.');
      this.accept.includes(fileType);

      const isValidType =
        this.accept.length === 0 ||
        (imageWildcard && fileType.includes('image')) ||
        (audioWildcard && fileType.includes('audio')) ||
        (videoWildcard && fileType.includes('video')) ||
        this.accept.includes(fileType) ||
        this.accept.includes(fileExtension);

      // Check if the file size is valid
      const isValidSize = fileSize <= maxFileSizeInBytes;

      if (isValidType && isValidSize) {
        validFiles.push({ file, id: this._generateUniqueFileId() });
      } else {
        let errorMsg = '';
        if (!isValidType) {
          errorMsg = 'typeError';
        } else if (!isValidSize) {
          errorMsg = 'sizeError';
        } else {
          errorMsg = 'unknownError';
        }
        invalidFiles.push({
          id: this._generateUniqueFileId(),
          name: file.name,
          size: file.size,
          errorMsg: errorMsg,
        });
      }
    });

    // Update valid files
    if (validFiles.length > 0) {
      this._uploadedFiles = validFiles;
    }

    // Update invalid files
    if (invalidFiles.length > 0) {
      this._invalidFiles = invalidFiles;
    }
  }

  private _generateUniqueFileId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  private _parseFileSize(size: string): number {
    const sizeUnit = size.slice(-2).toUpperCase();
    const sizeValue = parseFloat(size.slice(0, -2));

    switch (sizeUnit) {
      case 'KB':
        return sizeValue * 1024; // KB to bytes
      case 'MB':
        return sizeValue * 1024 * 1024; // MB to bytes
      case 'GB':
        return sizeValue * 1024 * 1024 * 1024; // GB to bytes
      default:
        return sizeValue; // Default to bytes if no unit provided
    }
  }

  private _emitFileUploadEvent() {
    const event = new CustomEvent('on-file-upload', {
      detail: {
        validFiles: this._uploadedFiles,
        invalidFiles: this._invalidFiles,
      },
    });
    this.dispatchEvent(event);
    // Reset uploaded files
    this._uploadedFiles = [];
    this._invalidFiles = [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader': FileUploader;
  }
}
