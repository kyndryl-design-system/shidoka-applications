import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from '@storybook/addon-actions';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import SampleFileUploaderScss from './fileUploader.sample.scss';
import './index';
import '../button';
import '../notification';
import '../progressBar';

const _textStrings = {
  dragAndDropText: 'Drag files here to upload',
  separatorText: 'or',
  buttonText: 'Browse files',
  maxFileSizeText: 'Max file size',
  supportedFileTypeText: 'Supported file type: ',
  fileTypeDisplyText: '.jpeg, .png',
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

@customElement('sample-file-uploader')
export class SampleFileUploader extends LitElement {
  static override styles = SampleFileUploaderScss;

  @property({ type: Boolean })
  multiple = false;

  @state()
  _validFiles: any[] = [];

  @state()
  _invalidFiles: any[] = [];

  @state()
  _showNotification = false;

  @state()
  _notificationStatus = 'default';

  @state()
  _notificationTitle = '';

  @state()
  _notificationMessage = '';

  @state()
  _showProgressBar = false;

  @state()
  _currentFileUploading = '';

  @state()
  _completedFiles = 0;

  @state()
  _totalFiles = 0;

  @state()
  _overallProgress = 0;

  @state()
  _uploadCanceled = false;

  @state()
  _helperText = '';

  @state()
  _disabled = false;

  override render() {
    return html`
      <kyn-file-uploader
        .accept=${['image/jpeg', 'image/png']}
        ?multiple=${this.multiple}
        .validFiles=${this._validFiles}
        .invalidFiles=${this._invalidFiles}
        ?disabled=${this._disabled}
        .textStrings=${_textStrings}
        @selected-files=${(e: any) => {
          action(e.type)(e);
          this._handleFilesToBeUploaded(e);
        }}
      >
        <!-- Upload status -->
        ${this._showNotification
          ? html`
              <kyn-notification
                slot="upload-status"
                .type=${'inline'}
                .tagStatus=${this._notificationStatus}
                .hideCloseButton=${true}
                .notificationTitle=${this._notificationTitle}
              >
                ${this._showProgressBar
                  ? html`
                      <div class="notification-status-body">
                        <kyn-progress-bar
                          .label=${this._currentFileUploading}
                          .value=${this._overallProgress}
                          .max=${100}
                          .status=${this._overallProgress === 100
                            ? 'success'
                            : 'active'}
                          .showInlineLoadStatus=${true}
                          .unit=${'%'}
                          .showActiveHelperText=${true}
                          .helperText=${this._helperText}
                        ></kyn-progress-bar>
                        <kyn-button
                          kind="outline"
                          size="small"
                          @on-click=${this._stopFileUpload}
                        >
                          <span slot="icon">${unsafeSVG(closeIcon)}</span>
                        </kyn-button>
                      </div>
                    `
                  : this._notificationMessage}
              </kyn-notification>
            `
          : ``}
        <div>
          ${this._validFiles.length > 0 || this._invalidFiles.length > 0
            ? html`<kyn-button
                size="small"
                .disabled=${this._disableUploadButton()}
                @on-click=${() => this._startFileUpload()}
                >Start upload</kyn-button
              >`
            : ''}
        </div>
      </kyn-file-uploader>
    `;
  }

  _handleFilesToBeUploaded(e: any) {
    this._validFiles = e.detail.validFiles;
    this._invalidFiles = e.detail.invalidFiles;
    this._totalFiles = this._validFiles.length;
    if (this._totalFiles === 0 && this._invalidFiles.length > 0) {
      this._setNotificationConfig(
        true,
        'error',
        'No valid files selected',
        'Please select valid files to upload.'
      );
    } else {
      this._setNotificationConfig(false, 'default', '', '');
    }
    if (this._totalFiles === 1 && !this.multiple) {
      this._disabled = true;
    } else {
      this._disabled = false;
    }
  }

  private _disableUploadButton() {
    return (
      (this._invalidFiles.length > 0 && this._validFiles.length === 0) ||
      this._validFiles.some((file) => file.state === 'uploading') ||
      this._validFiles.every((file) => file.state === 'uploaded')
    );
  }

  _startFileUpload() {
    this._setNotificationConfig(true, 'default', '', '');
    this._disabled = true;
    this._showProgressBar = true;
    this._currentFileUploading = '';
    this._helperText = '';
    this._uploadCanceled = false;
    this._uploadFiles();
  }

  // This function simulates the file upload process.
  // In an actual implementation, you would replace this with your file upload logic and update the file state accordingly.
  async _uploadFiles() {
    let uploadedFilesCount = 0;
    const totalFiles = this._validFiles.length;
    const invalidFilesCount = this._invalidFiles.length;
    const totalDuration = totalFiles * 1500;
    const incrementInterval = 50;
    const incrementStep = 100 / (totalDuration / incrementInterval);

    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      if (this._uploadCanceled) {
        clearInterval(progressInterval);
        return;
      }

      currentProgress += incrementStep;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }

      this._overallProgress = Math.round(currentProgress);
      this.requestUpdate();
    }, incrementInterval);

    for (let i = 0; i < totalFiles; i++) {
      const file = this._validFiles[i];

      if (this._uploadCanceled) {
        file.state = 'error';
        this._currentFileUploading = `Upload canceled for ${file.file.name}`;
        this.requestUpdate();
        break;
      }

      file.state = 'uploading';
      this._helperText = `Uploading ${i + 1} out of ${
        totalFiles + invalidFilesCount
      } files.`;
      this._currentFileUploading = file.file.name;
      this.requestUpdate();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!this._uploadCanceled) {
        file.state = 'uploaded';
        uploadedFilesCount++;
        this._currentFileUploading = 'upload complete';
        this.requestUpdate();
      }

      this.requestUpdate();

      if (this._uploadCanceled) {
        this._notificationMessage = `Upload partially successful: ${
          totalFiles - uploadedFilesCount
        } out of ${totalFiles} files was not uploaded.`;
        for (let j = i; j < totalFiles; j++) {
          const remainingFile = this._validFiles[j];
          remainingFile.state = 'error';
        }
        break;
      }
    }
    if (!this._uploadCanceled) {
      const invalidFilesCount = this._invalidFiles.length;
      this._notificationStatus = invalidFilesCount > 0 ? 'error' : 'success';
      this._notificationTitle =
        invalidFilesCount > 0
          ? 'Upload partially successful'
          : 'Files uploaded';
      this._showProgressBar = false;
      this._notificationMessage =
        invalidFilesCount > 0
          ? `${invalidFilesCount} out of ${
              invalidFilesCount + totalFiles
            } could not be uploaded.`
          : `Success! ${totalFiles} files have been uploaded.`;
      clearInterval(progressInterval);
      if (this.multiple) this._disabled = false;
    }
  }

  _stopFileUpload() {
    if (this.multiple) this._disabled = false;
    this._uploadCanceled = true;
    this._showProgressBar = false;
    this._setNotificationConfig(
      true,
      'warning',
      'File upload was interrupted',
      ''
    );
    this._currentFileUploading = 'Upload canceled';
  }

  _setNotificationConfig(
    visible: boolean,
    status: string,
    title: string,
    message: string
  ) {
    this._showNotification = visible;
    this._notificationStatus = status;
    this._notificationTitle = title;
    this._notificationMessage = message;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sample-file-uploader': SampleFileUploader;
  }
}
