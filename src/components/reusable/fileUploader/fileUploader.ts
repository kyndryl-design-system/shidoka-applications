/*
TODO:
- add proper error handling
- check requirement for uploaded files and add requied logic
- remove console logs
*/

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import uploadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/upload.svg';
import FileUploaderScss from './fileUploader.scss';
import '../button';
import './fileUploaderStatus';

const _defaultTextStrings = {
  dragAndDropText: 'Drag files here to upload',
  orText: 'or',
  buttonText: 'Browse files',
  maxFileSizeText: 'Max file size',
  supportedFileTypeText: 'Supported file type',
  fileUploadErrorText: 'File upload error',
  fileDetails: 'File details',
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
  fileTypes: string[] = [];

  /**
   * Set this to `true`, if the component accepts multiple file uploads.
   */
  @property({ type: Boolean })
  multiple = true;

  /**
   * Uploaded files.
   */
  @property({ type: Array })
  uploadedFiles: File[] = [];

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
   * Internal file upload object list.
   * @internal
   */
  @state()
  _fileUploadObjList: Array<object> = [];

  /**
   * Internal invalid files.
   * @internal
   */
  @state()
  _invaliedFiles: File[] = [];

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
    return html`
      <div class="file-uploader-container">
        ${this.renderDragDropContainer()}
        <div class="upload-constraints">
          <p>
            ${this._textStrings.maxFileSizeText}
            <strong>${this.maxFileSizeText}</strong>.
            ${this._textStrings.supportedFileTypeText}
            <strong>${this.renderSupportedFileSizeAndType()}</strong>.
          </p>
        </div>
        <!-- File upload status -->
        ${this.uploadedFiles.length > 0
          ? html`<kyn-file-uploader-status
              .uploadedFiles="${this.uploadedFiles}"
              .invalidFiles="${this._invaliedFiles}"
            ></kyn-file-uploader-status>`
          : ''}
        ${this.uploadedFiles.length > 0
          ? html` <ul class="file-info">
              ${this.uploadedFiles.map(
                (file) => html`<li><strong>${file.name}</strong></li>`
              )}
            </ul>`
          : ''}
      </div>
    `;
  }

  private renderDragDropContainer() {
    const supportedFileTypeText =
      this.fileTypes.length > 0 ? this.fileTypes.join(',') : '*/*';
    const dragDropContainerClasses = {
      'drag-drop-container': true,
      dragging: this._dragging,
    };
    return html`
      <div
        tabindex="0"
        class=${classMap(dragDropContainerClasses)}
        @dragover="${this.handleDragOver}"
        @dragleave="${() => (this._dragging = false)}"
        @drop="${this.handleDrop}"
      >
        <div class="upload-icon-container">
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
          accept="${supportedFileTypeText}"
          ?multiple="${this.multiple}"
        />
      </div>
    `;
  }

  private renderSupportedFileSizeAndType() {
    if (this.fileTypes.length === 0) {
      return;
    } else {
      const displayFileTypes = this.fileTypes.map((fileType) => {
        return '.' + fileType.split('/')[1];
      });
      return html`${displayFileTypes.join(', ')}`;
    }
  }

  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this._resetUploaderState();
      const validFiles = this._validateFiles(files);

      if (validFiles.length > 0) {
        this.uploadedFiles = validFiles;
        this._fileUploadObjList = [];
        this._handleFileUploadSimulation();
        this._emitFileUploadEvent();
      }
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

      this._resetUploaderState();

      if (!this.multiple) {
        if (files.length > 1) {
          alert('Only one file can be uploaded'); // TODO: Add proper error handling
          return;
        }
      }

      const validFiles = this._validateFiles(files);

      if (validFiles.length > 0) {
        this.uploadedFiles = validFiles;
        this._fileUploadObjList = [];
        this._handleFileUploadSimulation();
        this._emitFileUploadEvent();
      }
    }
  }

  private _triggerFileSelect() {
    const fileInputElement = this.shadowRoot?.querySelector(
      '#fileInput'
    ) as HTMLInputElement;
    fileInputElement?.click();
  }

  private _handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._triggerFileSelect();
    }
  }

  // Validate files
  private _validateFiles(files: File[]): File[] {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    // Parse maxFileSizeText to get the max file size in bytes
    const maxFileSizeInBytes = this._parseFileSize(this.maxFileSizeText);

    files.forEach((file) => {
      const fileType = file.type;
      const fileSize = file.size;

      // Check if the file type is valid
      const isValidType =
        this.fileTypes.length === 0 || this.fileTypes.includes(fileType);

      // Check if the file size is valid
      const isValidSize = fileSize <= maxFileSizeInBytes;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    // If there are invalid files, notify the user
    if (invalidFiles.length > 0) {
      this._handleInvalidFiles(invalidFiles);
    }

    return validFiles;
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

  private _handleInvalidFiles(invalidFiles: File[]) {
    this._invaliedFiles = invalidFiles;
    console.log('Invalid files:', invalidFiles);
  }

  private _handleFileUploadSimulation() {
    // Create file upload object list
    this.uploadedFiles.forEach((file: any) => {
      const fileObj = {
        file: file,
        progress: 0,
        statusMessage: 'Uploading...', // TODO: Add proper status message, if required
      };
      this._fileUploadObjList.push(fileObj);
    });

    // Simulate file upload
    this._fileUploadObjList.forEach((fileObj: any) => {
      const fileSize = fileObj.file.size;
      const chunkSize = fileSize / 100;
      let progress = 0;

      const uploadInterval = setInterval(() => {
        progress += chunkSize;
        fileObj.progress = Math.min((progress / fileSize) * 100, 100);
        this.requestUpdate();

        // When the upload reaches 100%
        if (progress >= fileSize) {
          clearInterval(uploadInterval);
          fileObj.progress = 100;
          fileObj.statusMessage = 'Upload Complete!';
          this.requestUpdate();
        }
      }, 30);
    });
  }

  private _resetUploaderState() {
    this.uploadedFiles = [];
    this._invaliedFiles = [];
    this._fileUploadObjList = [];
    this._dragging = false;
  }

  private _emitFileUploadEvent() {
    const event = new CustomEvent('on-file-upload', {
      detail: {
        files: this.uploadedFiles,
        invalidFiles: this._invaliedFiles,
      },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader': FileUploader;
  }
}
