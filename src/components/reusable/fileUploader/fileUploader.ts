/*
TODO:
- add proper error handling
- check requirement for uploaded files and add requied logic
- check for required scenario
- remove console logs
- check if uploaded files can be removed
*/

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';
import FileUploaderScss from './fileUploader.scss';
import '../button';

const _defaultTextStrings = {
  buttonLabel: 'Choose Files',
  acceptedFileTypes: 'Accepted file types',
  dragAndDrop: 'Drag and drop files here',
  or: 'OR',
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
  multiple = false;

  /**
   * Uploaded files.
   */
  @property({ type: Array })
  uploadedFiles: File[] = [];

  /**
   * Set the type of file uploader needed. Accepted values
   * are `button`, `drag-drop` or `both`. Default value is `button`.
   */
  @property({ type: String })
  fileUploderType = 'button';

  /**
   * Customizable text strings.
   */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /**
   * Set the maximum file size that the component accepts. Default value is `5MB`.
   */
  @property({ type: String })
  maxFileSize = '5MB';

  /**
   * Set this to `true`, if the component is disabled.
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
    return html`
      <div class="file-uploader-container">
        <div class="accepted-file-types-container">
          <p
            class=${classMap({
              'accepted-file-types-text': true,
              disabled: this.disabled,
            })}
          >
            ${this._textStrings.acceptedFileTypes}:
            ${this.renderAcceptedFileTypes()}
          </p>
        </div>
        ${this.fileUploderType === 'drag-drop' ||
        this.fileUploderType === 'both'
          ? this.renderDagDropContainer()
          : null}
        ${this.fileUploderType === 'both'
          ? html`
              <p
                class=${classMap({ 'or-text': true, disabled: this.disabled })}
              >
                ${this._textStrings.or}
              </p>
            `
          : null}
        ${this.fileUploderType === 'button' || this.fileUploderType === 'both'
          ? this.renderButton()
          : null}
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

  private renderAcceptedFileTypes() {
    if (this.fileTypes.length === 0) {
      return html`All file types are accepted.`;
    } else {
      const displayFileTypes = this.fileTypes.map((fileType) => {
        return '.' + fileType.split('/')[1];
      });
      return html`${displayFileTypes.join(', ')}`;
    }
  }

  private renderDagDropContainer() {
    const acceptedFileTypes =
      this.fileTypes.length > 0 ? this.fileTypes.join(',') : '*/*';
    return html`
      <div
        tabindex="0"
        class=${classMap({
          'drag-drop-container': true,
          disabled: this.disabled,
        })}
        @dragover="${this.handleDragOver}"
        @drop="${this.handleDrop}"
        @click="${this._triggerFileSelect}"
        @keydown="${this._handleKeyboardEvent}"
      >
        <p>${this._textStrings.dragAndDrop}</p>
        <input
          class="file-input"
          type="file"
          @change="${(e: any) => this.handleFileChange(e)}"
          id="fileInput"
          accept="${acceptedFileTypes}"
          ?multiple="${this.multiple}"
          ?disabled="${this.disabled}"
        />
      </div>
    `;
  }

  private renderButton() {
    const acceptedFileTypes =
      this.fileTypes.length > 0 ? this.fileTypes.join(',') : '*/*';
    return html` <div class="file-input-wrapper">
      <kyn-button
        kind="secondary"
        size="medium"
        @on-click="${this._triggerFileSelect}"
        ?disabled="${this.disabled}"
      >
        ${this._textStrings.buttonLabel}
      </kyn-button>
      <input
        class="file-input"
        type="file"
        @change="${(e: any) => this.handleFileChange(e)}"
        id="fileInput"
        accept="${acceptedFileTypes}"
        ?multiple="${this.multiple}"
        ?disabled="${this.disabled}"
      />
    </div>`;
  }

  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.uploadedFiles = Array.from(target.files);
    }
    this._emitFileUploadEvent();
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);

      if (!this.multiple) {
        if (files.length > 1) {
          alert('Only one file can be uploaded'); // TODO: Add proper error handling
          return;
        }
      }

      const validFiles = this._validateFiles(files);

      if (validFiles.length > 0) {
        this.uploadedFiles = validFiles;
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
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      const fileType = file.type;
      const fileSize = file.size;
      const fileName = file.name;

      // Check if the file type is valid
      const isValidType =
        this.fileTypes.length === 0 || this.fileTypes.includes(fileType);

      // Check if the file size is valid
      const fileSizeUnit = this.maxFileSize.slice(-2);
      let maxFileSize = 0;
      switch (fileSizeUnit) {
        case 'KB':
          maxFileSize = fileSize * 1024;
          break;
        case 'MB':
          maxFileSize = fileSize * 1024 * 1024;
          break;
        case 'GB':
          maxFileSize = fileSize * 1024 * 1024 * 1024;
          break;
        default: // TODO: Check for deafult case
          maxFileSize = fileSize;
      }
      const isValidSize = fileSize <= maxFileSize;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push(fileName);
      }
    });

    // if (invalidFiles.length > 0) {
    //   console.log(`Invalid files: ${invalidFiles.join(', ')}`);
    // }
    return validFiles;
  }

  private _emitFileUploadEvent() {
    const event = new CustomEvent('on-file-upload', {
      detail: {
        files: this.uploadedFiles,
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
