import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { deepmerge } from 'deepmerge-ts';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import uploadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/upload.svg';
import errorFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/checkmark.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/error.svg';
import { FormMixin } from '../../../common/mixins/form-input';
import FileUploaderScss from './fileUploader.scss';
import './fileUploaderListContainer';
import '../button';
import '../loaders';
import '../inlineConfirm';
import '../notification';

const _defaultTextStrings = {
  dragAndDropText: 'Drag files here to upload',
  separatorText: 'or',
  buttonText: 'Browse files',
  maxFileSizeText: 'Max file size',
  supportedFileTypeText: 'Supported file type: ',
  fileTypeDisplyText: 'Any file type',
  invalidFileListLabel: 'Some files could not be added:',
  validFileListLabel: 'Files added:',
  clearListText: 'Clear list',
  fileTypeErrorText: 'Invaild file type',
  fileSizeErrorText: 'Max file size exceeded',
  customFileErrorText: 'Custom file error',
  inlineConfirmAnchorText: 'Delete',
  inlineConfirmConfirmText: 'Confirm',
  inlineConfirmCancelText: 'Cancel',
  validationNotificationTitle: 'Multiple files not allowed',
  validationNotificationMessage: 'Please select only one file.',
};

/**
 * File Uploader
 * @fires selected-files - Emits the uploaded files.
 * @slot upload-status - Slot for upload status/notification.
 */
@customElement('kyn-file-uploader')
export class FileUploader extends FormMixin(LitElement) {
  static override styles = FileUploaderScss;

  /**
   * Set the file types that the component accepts. By default, it accepts all file types.
   * @example
   * ['image/jpeg', 'image/png']
   * ['image/*']
   * ['audio/*']
   * ['application/pdf', 'text/plain']
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
   * Set the maximum file size in bytes. Default value is `1048576` (1MB).
   * @example
   * 1048576 // 1MB
   * 5242880 // 5MB
   * 1073741824 // 1GB
   */
  @property({ type: Number })
  maxFileSize = 1048576; // 1MB

  /**
   * Disable the file uploader. Default value is `false`.
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Valid files. This property is used to set the initial or updated state of the valid files.
   */
  @property({ type: Array })
  validFiles: {
    id: string;
    file: File;
    status: 'new' | 'uploading' | 'uploaded' | 'error';
  }[] = [];

  /**
   * Invalid files. This property is used to set the initial state of the invalid files.
   */
  @property({ type: Array })
  invalidFiles: {
    id: string;
    file: File;
    status: 'sizeError' | 'typeError' | 'unknownError';
  }[] = [];

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

  /**
   * Internal valid files.
   * @internal
   */
  @state()
  _validFiles: Object[] = [];

  /**
   * Internal notification message flag.
   * @internal
   */
  @state()
  _showValidationNotification = false;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  _inputEl!: HTMLInputElement;

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
    if (changedProps.has('validFiles')) {
      this._validFiles = this.validFiles;
      this._setFormValue();
    }
    if (changedProps.has('invalidFiles')) {
      this._invalidFiles = this.invalidFiles;
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('validFiles')) {
      this._validFiles = this.validFiles;
      this._setFormValue();
    }
    if (changedProps.has('invalidFiles')) {
      this._invalidFiles = this.invalidFiles;
    }
  }

  override render() {
    const dragDropContainerClasses = {
      'drag-drop-container': true,
      dragging: this._dragging,
      disabled: this.disabled,
    };
    return html`
      <div class="file-uploader-container">
        <!-- Drag and drop container -->
        <div class="drag-drop-container-wrapper">
          <div
            class=${classMap(dragDropContainerClasses)}
            @dragover="${this.handleDragOver}"
            @dragleave="${() => (this._dragging = false)}"
            @drop="${this.handleDrop}"
          >
            <div class="uploader-status-icon">
              <span>${unsafeSVG(uploadIcon)}</span>
            </div>
            <p class="drag-drop-text">${this._textStrings.dragAndDropText}</p>
            <p class="or-text">${this._textStrings.separatorText}</p>
            <kyn-button
              kind="outline"
              size="small"
              ?disabled=${this.disabled}
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
          <div
            class=${classMap({
              'upload-constraints': true,
              disabled: this.disabled,
            })}
          >
            <p>
              ${this._textStrings.maxFileSizeText}
              <strong>${this._getFilesSize(this.maxFileSize)}</strong>.
              ${this._textStrings.supportedFileTypeText}
              <strong>${this._textStrings.fileTypeDisplyText}</strong>.
            </p>
          </div>
        </div>
        <!-- File list -->
        <div class="file-info-container">
          <!-- Invalid files -->
          ${this._invalidFiles.length > 0
            ? html`
                <kyn-file-uploader-list-container
                  id="invalidFiles"
                  .titleText=${this._textStrings.invalidFileListLabel}
                >
                  ${this._invalidFiles.length > 0
                    ? this._invalidFiles.map(
                        (file: any) => html`
                          <div class="file-uploader-item-container">
                            <span class="error-filled-icon"
                              >${unsafeSVG(errorFilledIcon)}</span
                            >
                            <div class="file-details-container">
                              <p class="file-name">${file.file.name}</p>
                              <div class="error-info-container">
                                <p class="file-size">
                                  ${this._getFilesSize(file.file.size)}
                                </p>
                                ·
                                <p class="file-size error">
                                  ${file.status === 'unknownError'
                                    ? this._textStrings.customFileErrorText
                                    : file.status === 'typeError'
                                    ? this._textStrings.fileTypeErrorText
                                    : this._textStrings.fileSizeErrorText}
                                </p>
                              </div>
                            </div>
                          </div>
                        `
                      )
                    : ''}
                  <kyn-button
                    slot="action-button"
                    kind="ghost"
                    size="small"
                    @on-click=${this._clearInvalidFiles}
                  >
                    ${this._textStrings.clearListText}
                  </kyn-button>
                </kyn-file-uploader-list-container>
              `
            : ''}
          <!-- Valid files -->
          ${this._validFiles.length > 0
            ? html`
                <kyn-file-uploader-list-container
                  .titleText=${this._textStrings.validFileListLabel}
                  id="validFiles"
                >
                  ${this._validFiles.length > 0
                    ? this._validFiles.map(
                        (file: any) => html`
                          <div class="file-uploader-item-container">
                            <div class="file-details-container">
                              <p class="file-name success">${file.file.name}</p>
                              <p class="file-size">
                                ${this._getFilesSize(file.file.size)}
                              </p>
                            </div>
                            <div class="actions">
                              ${this._displayActions(file)}
                            </div>
                          </div>
                        `
                      )
                    : ''}
                </kyn-file-uploader-list-container>
              `
            : ''}
        </div>
        ${this._showValidationNotification
          ? html` <kyn-notification
              slot="upload-status"
              .type=${'inline'}
              .tagStatus=${'error'}
              .notificationTitle=${this._textStrings
                .validationNotificationTitle}
              @on-close=${() => {
                this._showValidationNotification = false;
              }}
            >
              ${this._textStrings.validationNotificationMessage}
            </kyn-notification>`
          : ''}
        <div class="upload-status-container">
          <slot name="upload-status"></slot>
        </div>
      </div>
    `;
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
    this._showValidationNotification = false;

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);

      this._validateFiles(files);
      this._validate(true, false);
      this._setFormValue();
      this._emitFileUploadEvent();
    }
  }

  private _triggerFileSelect() {
    const fileInputElement = this.shadowRoot?.querySelector(
      '#fileInput'
    ) as HTMLInputElement;
    fileInputElement?.click();
  }

  handleFileChange(event: Event) {
    this._showValidationNotification = false;
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);

      this._validateFiles(files);
      this._validate(true, false);
      this._setFormValue();
      this._emitFileUploadEvent();
    }
  }

  private _getFilesSize(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} Bytes`;
    } else if (bytes < 1024 * 1024) {
      const kb = bytes / 1024;
      return kb % 1 === 0 ? `${Math.floor(kb)} KB` : `${kb.toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      const mb = bytes / (1024 * 1024);
      return mb % 1 === 0 ? `${Math.floor(mb)} MB` : `${mb.toFixed(2)} MB`;
    } else {
      const gb = bytes / (1024 * 1024 * 1024);
      return gb % 1 === 0 ? `${Math.floor(gb)} GB` : `${gb.toFixed(2)} GB`;
    }
  }

  private _clearInvalidFiles() {
    this._invalidFiles = [];
    this._emitFileUploadEvent();
  }

  // Validate files
  private _validateFiles(files: File[]) {
    // Check if multiple files are uploaded
    if (!this.multiple && files.length > 1) {
      this._showValidationNotification = true;
      return;
    }

    const validFiles: Object[] = [...this._validFiles];
    const invalidFiles: Object[] = [...this._invalidFiles];

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
      const isValidSize = fileSize <= this.maxFileSize;

      if (isValidType && isValidSize) {
        validFiles.push({
          file,
          id: this._generateUniqueFileId(),
          state: 'new',
        });
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
          file,
          id: this._generateUniqueFileId(),
          status: errorMsg,
        });
      }
    });

    // Update valid files
    if (validFiles.length > 0) {
      this._validFiles = validFiles;
    }

    // Update invalid files
    if (invalidFiles.length > 0) {
      this._invalidFiles = invalidFiles;
    }
  }

  private _generateUniqueFileId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  private _validate(interacted: Boolean, report: Boolean) {
    const Validity =
      this.invalidText !== ''
        ? { ...this._inputEl.validity, customError: true }
        : this._inputEl.validity;

    let InternalMsg = '';
    if (this._invalidFiles.length > 0) {
      const hasTypeError = this._invalidFiles.some(
        (file: any) => file.status === 'typeError'
      );
      const hasSizeError = this._invalidFiles.some(
        (file: any) => file.status === 'sizeError'
      );
      InternalMsg =
        hasTypeError && hasSizeError
          ? 'Invalid file type and Exceeds maximum file size'
          : hasTypeError
          ? 'Invalid file type'
          : 'Exceeds maximum file size';
    }

    const ValidationMessage =
      this.invalidText !== '' ? this.invalidText : InternalMsg;

    if (interacted || this.invalidText !== '') {
      this._internals.setValidity(Validity, ValidationMessage);

      // set internal validation message if value was changed by user input
      if (interacted) {
        this._internalValidationMsg = InternalMsg;
      }
    }

    // focus the first checkbox to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }

  private _setFormValue() {
    const formData = new FormData();
    this._validFiles.forEach((fileObj: any) => {
      const { file } = fileObj;
      formData.append(this.name, file);
    });
    this._internals.setFormValue(formData);
  }

  private _displayActions(file: any) {
    if (file.status === 'uploading') {
      return html` <kyn-loader-inline></kyn-loader-inline> `;
    } else if (file.status === 'uploaded') {
      return html`
        <span class="success-icon">${unsafeSVG(checkmarkIcon)}</span>
      `;
    } else if (file.status === 'error') {
      return html` <span class="error-icon">${unsafeSVG(errorIcon)}</span> `;
    } else {
      return html` <kyn-inline-confirm
        ?destructive=${true}
        .anchorText=${this._textStrings.inlineConfirmAnchorText}
        .confirmText=${this._textStrings.inlineConfirmConfirmText}
        .cancelText=${this._textStrings.inlineConfirmCancelText}
        @on-confirm=${() => this._deleteFile(file.id)}
      >
        <span>${unsafeSVG(deleteIcon)}</span>
        <span slot="confirmIcon">${unsafeSVG(deleteIcon)}</span>
      </kyn-inline-confirm>`;
    }
  }

  private _deleteFile(fileId: string) {
    this._validFiles = this._validFiles.filter(
      (file: any) => file.id !== fileId
    );
    this._setFormValue();
    this._emitFileUploadEvent();
  }

  private _emitFileUploadEvent() {
    const event = new CustomEvent('selected-files', {
      detail: {
        validFiles: this._validFiles,
        invalidFiles: this._invalidFiles,
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
