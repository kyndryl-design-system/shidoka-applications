import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from '@storybook/addon-actions';
import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import errorFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import uploadIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/upload.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import SampleFileUploaderScss from './fileUploader.sample.scss';
import './index';
import '../inlineConfirm';
import '../link';
import '../notification';
import '../button';
import '../progressBar';

@customElement('sample-file-uploader')
export class SampleFileUploader extends LitElement {
  static override styles = SampleFileUploaderScss;

  @property({ type: Object })
  textStrings = {
    dragAndDropText: 'Drag files here to upload',
    orText: 'or',
    buttonText: 'Browse files',
    maxFileSizeText: 'Max file size',
    supportedFileTypeText: 'Supported file type: ',
    // fileTypeDisplyText: 'Any image type, .pdf',
    fileTypeDisplyText: '.jpeg, .png',
  };

  @property({ type: Boolean })
  multiple = true;

  @property({ type: Array })
  // accept = ['image/*', '.pdf'];
  accept = ['image/jpeg', 'image/png'];

  @state()
  _validFiles: any[] = [];

  @state()
  _invalidFiles: any[] = [];

  @state()
  _notificationTitle = '';

  @state()
  _notificationMessage = '';

  @state()
  _notificationStatus = '';

  @state()
  _showNotification = false;

  @state()
  _uploadCancelled = false;

  @state()
  _uploadedFilesStatus: {
    fileNames: string[];
    filesSizes: number[];
    totalFileSize: number;
    progress: number;
    status: 'active' | 'success' | 'error';
    currentFileIndex: number;
  } = {
    fileNames: [],
    filesSizes: [],
    totalFileSize: 0,
    progress: 0,
    status: 'active',
    currentFileIndex: 0,
  };

  @state()
  _uploadInterval: any = null;

  override render() {
    return html`
      <!-- File uploader -->
      <kyn-file-uploader
        .accept=${this.accept}
        .multiple=${this.multiple}
        .textStrings=${this.textStrings}
        @on-file-upload=${(e: any) => {
          action(e.type)(e);
          this._handleFilesToBeUploaded(e);
        }}
      >
        <span slot="uploader-status-icon">${unsafeSVG(uploadIcon)}</span>
        <!-- File details list -->
        <div slot="file-details" class="file-details-wrapper">
          ${this._invalidFiles.length > 0
            ? html`
                <kyn-file-uploader-list-container
                  .titleText=${'Some files could not be added:'}
                >
                  <!-- Invalid files -->
                  ${this._invalidFiles.length > 0
                    ? this._invalidFiles.map(
                        (file) => html`
                          <kyn-file-uploader-item>
                            <span slot="status-icon" class="error-icon"
                              >${unsafeSVG(errorFilledIcon)}</span
                            >
                            <div class="file-details-container">
                              <p class="file-name">${file.name}</p>
                              <div class="error-info-container">
                                <p class="file-size">
                                  ${this._getFilesSize(file.size)}
                                </p>
                                ·
                                <p class="file-size error">
                                  ${file.errorMsg === 'typeError'
                                    ? 'Invaild file type'
                                    : 'Max file size exceeded'}
                                </p>
                              </div>
                            </div>
                          </kyn-file-uploader-item>
                        `
                      )
                    : ''}
                  <kyn-button
                    slot="action-button"
                    kind="ghost"
                    size="small"
                    @on-click=${() => (this._invalidFiles = [])}
                  >
                    Clear list
                  </kyn-button>
                </kyn-file-uploader-list-container>
              `
            : ''}
          ${this._validFiles.length > 0
            ? html`
                <kyn-file-uploader-list-container .titleText=${'Files added:'}>
                  <!-- Valid files -->
                  ${this._validFiles.length > 0
                    ? this._validFiles.map(
                        (file) => html`
                          <kyn-file-uploader-item>
                            <span slot="status-icon" class="success-icon"
                              >${unsafeSVG(checkmarkFilledIcon)}</span
                            >
                            <div class="file-details-container">
                              <p class="file-name success">${file.file.name}</p>
                              <p class="file-size">
                                ${this._getFilesSize(file.file.size)}
                              </p>
                            </div>
                            <div slot="actions">
                              <kyn-inline-confirm
                                ?destructive=${true}
                                .anchorText=${'Delete'}
                                .confirmText=${'Confirm'}
                                .cancelText=${'Cancel'}
                                @on-confirm=${() => this._deleteFile(file.id)}
                              >
                                <span>${unsafeSVG(deleteIcon)}</span>
                                <span slot="confirmIcon"
                                  >${unsafeSVG(deleteIcon)}</span
                                >
                              </kyn-inline-confirm>
                            </div>
                          </kyn-file-uploader-item>
                        `
                      )
                    : ''}
                </kyn-file-uploader-list-container>
              `
            : ''}
        </div>
        <!-- Upload status -->
        ${this._showNotification
          ? html`
              <kyn-notification
                slot="upload-status"
                .type=${'inline'}
                .hideCloseButton=${true}
                .notificationTitle=${this._notificationTitle}
                .tagStatus=${this._notificationStatus}
              >
                ${this._uploadedFilesStatus.progress !== 100 &&
                !this._uploadCancelled
                  ? html`
                      <div class="notification-status-body">
                        <kyn-progress-bar
                          .label=${this._uploadedFilesStatus.fileNames[
                            this._uploadedFilesStatus.currentFileIndex
                          ]}
                          .value=${this._uploadedFilesStatus.progress}
                          .max=${99}
                          .status=${this._uploadedFilesStatus.status}
                          .showInlineLoadStatus=${true}
                          .unit=${'%'}
                          .showActiveHelperText=${true}
                          .helperText=${this._getHelperText()}
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
        <!-- Upload button -->
        <div>
          ${this._validFiles.length > 0 || this._invalidFiles.length > 0
            ? html`<kyn-button
                size="small"
                @on-click=${() => this._startFileUpload()}
                >Start upload</kyn-button
              >`
            : ''}
        </div>
      </kyn-file-uploader>
    `;
  }

  private _getFilesSize(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} Bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  private _deleteFile(fileId: string) {
    this._validFiles = this._validFiles.filter((file) => file.id !== fileId);
    this._showNotification = false;
    this._resetNotificationContent();
  }

  // This is a placeholder function to show the files added to the file uploader after frontend validation.
  private _handleFilesToBeUploaded(event: any) {
    this._validFiles = [...event.detail.validFiles, ...this._validFiles];
    this._invalidFiles = [...event.detail.invalidFiles, ...this._invalidFiles];
  }

  // This is a placeholder function to simulate the logic for file upload.
  // In a real application, you would replace this with actual upload logic based on your backend API and handle the progress updates accordingly.
  private _startFileUpload() {
    this._showNotification = true;
    this._uploadCancelled = false;
    this._resetNotificationContent();

    const fileNames = this._validFiles.map((file) => file.file.name);
    const filesSizes = this._validFiles.map((file) => file.file.size);
    const totalFileSize = this._validFiles.reduce(
      (cur, file) => cur + file.file.size,
      0
    );

    this._uploadedFilesStatus = {
      fileNames,
      filesSizes,
      totalFileSize,
      progress: 0,
      status: 'active',
      currentFileIndex: 0,
    };

    this._uploadNextFile();
  }

  private _uploadNextFile() {
    const currentFile =
      this._validFiles[this._uploadedFilesStatus.currentFileIndex];
    const currentFileSize = currentFile.file.size;
    const chunkSize = currentFileSize / 100;

    let progress = 0;
    let totalProgress = 0;

    this._uploadInterval = setInterval(() => {
      progress += chunkSize;

      // Update the progress for the current file
      const currentFileProgress = Math.min(
        (progress / currentFileSize) * 100,
        100
      );

      // Calculate the total progress as the weighted average based on file sizes
      totalProgress = this._validFiles.reduce((acc, file, index) => {
        if (index <= this._uploadedFilesStatus.currentFileIndex) {
          // Progress for completed files is 100%
          const fileProgress =
            index === this._uploadedFilesStatus.currentFileIndex
              ? currentFileProgress
              : 100;
          return (
            acc +
            (fileProgress * file.file.size) /
              this._uploadedFilesStatus.totalFileSize
          );
        }
        return acc;
      }, 0);

      // Update total progress
      this._uploadedFilesStatus = {
        ...this._uploadedFilesStatus,
        progress: totalProgress,
      };

      this.requestUpdate();

      // Check if the current file is fully uploaded
      if (currentFileProgress >= 100) {
        this._uploadedFilesStatus = {
          ...this._uploadedFilesStatus,
          progress: totalProgress,
        };

        // Move to the next file
        clearInterval(this._uploadInterval); // Stop the interval for the current file

        if (
          this._uploadedFilesStatus.currentFileIndex <
          this._validFiles.length - 1
        ) {
          this._uploadedFilesStatus.currentFileIndex++;
          this._uploadNextFile();
        } else {
          // All files uploaded successfully
          this._uploadedFilesStatus = {
            ...this._uploadedFilesStatus,
            status: this._invalidFiles.length > 0 ? 'error' : 'success',
            progress: 100,
          };

          this._displayNotification();
        }

        this.requestUpdate();
      }
    }, 40); // This is a placeholder interval for simulating upload progress, in real case, it would be based on actual upload progress
  }

  // This is a placeholder function to simulate the logic for generating helper text for the progress bar.
  private _getHelperText() {
    const invalidFiles = this._invalidFiles.length;
    const uploadedFiles = this._validFiles.length;
    const totalFiles = uploadedFiles + invalidFiles;
    const index = this._uploadedFilesStatus.currentFileIndex;
    const progress = this._uploadedFilesStatus.progress;

    if (invalidFiles > 0) {
      if (progress < 100) {
        // Upload is still in progress
        return `Uploading ${index + 1} out of ${totalFiles} files.`;
      }
      // Upload is complete, but there are invalid files
      return `${invalidFiles} out of ${totalFiles} files not uploaded.`;
    }

    // All files are successfully uploaded
    if (progress === 100) {
      return 'Files uploaded.';
    }

    // Still uploading
    return `Uploading ${index + 1} out of ${totalFiles} files.`;
  }

  private _displayNotification() {
    const numberOfInvalidFiles = this._invalidFiles.length;
    const numberOfValidFiles = this._validFiles.length;
    if (numberOfInvalidFiles > 0) {
      this._notificationTitle = 'Upload partially successful';
      this._notificationMessage = `${numberOfInvalidFiles} out of ${
        numberOfInvalidFiles + numberOfValidFiles
      } could not be uploaded.`;
      this._notificationStatus = 'error';
    } else {
      this._notificationTitle = 'Files uploaded';
      this._notificationMessage = `Success! ${numberOfValidFiles} files have been uploaded.`;
      this._notificationStatus = 'success';
    }
  }

  // This is a placeholder function to simulate the logic for stopping the file upload.
  private _stopFileUpload() {
    // Stop the upload interval if it's running
    if (this._uploadInterval) {
      clearInterval(this._uploadInterval);
      this._uploadInterval = null;
    }
    this._uploadCancelled = true;
    this._notificationTitle = 'File upload was interrupted.';
    this._notificationStatus = 'warning';
    const totalFiles = this._validFiles.length + this._invalidFiles.length;
    const uploadedFiles = this._uploadedFilesStatus.currentFileIndex;
    this._notificationMessage = `Upload partially successful: ${
      this._validFiles.length - uploadedFiles
    } out of ${totalFiles} files was not uploaded.`;
  }

  private _resetNotificationContent() {
    this._notificationTitle = '';
    this._notificationMessage = '';
    this._notificationStatus = '';
    this._uploadedFilesStatus = {
      fileNames: [],
      filesSizes: [],
      totalFileSize: 0,
      progress: 0,
      status: 'active',
      currentFileIndex: 0,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sample-file-uploader': SampleFileUploader;
  }
}
