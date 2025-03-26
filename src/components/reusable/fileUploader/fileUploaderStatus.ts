import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import FileUploaderStatusScss from './fileUploaderStatus.scss';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import '../progressBar';
import '../button';
import '../loaders';

/**
 * File Uploader status
 */
@customElement('kyn-file-uploader-status')
export class FileUploaderStatus extends LitElement {
  static override styles = FileUploaderStatusScss;

  @property({ type: Array })
  uploadedFiles: File[] = [];

  @property({ type: Array })
  invalidFiles: File[] = [];

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

  override render() {
    const Classes = {
      'file-uploader-status-container': true,
      active: this._uploadedFilesStatus.status === 'active',
      success: this._uploadedFilesStatus.status === 'success',
      error: this._uploadedFilesStatus.status === 'error',
    };
    return html`
      <div class=${classMap(Classes)}>
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
        ${this._uploadedFilesStatus.progress !== 100
          ? html`
              <kyn-button
                kind="outline"
                size="small"
                @on-click=${this.handleCloseClick}
              >
                <span slot="icon">${unsafeSVG(closeIcon)}</span>
              </kyn-button>
            `
          : ''}
      </div>
    `;
  }

  override updated(changedProps: any) {
    if (changedProps.has('uploadedFiles') || changedProps.has('invalidFiles')) {
      if (this.uploadedFiles.length === 0) return;

      const fileNames = this.uploadedFiles.map((file) => file.name);
      const filesSizes = this.uploadedFiles.map((file) => file.size);
      const totalFileSize = this.uploadedFiles.reduce(
        (cur, file) => cur + file.size,
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

      this.uploadNextFile();
    }
  }

  uploadNextFile() {
    const currentFile =
      this.uploadedFiles[this._uploadedFilesStatus.currentFileIndex];
    const currentFileSize = currentFile.size;
    const chunkSize = currentFileSize / 100;

    let progress = 0;
    let totalProgress = 0;

    const uploadInterval = setInterval(() => {
      progress += chunkSize;

      // Update the progress for the current file
      const currentFileProgress = Math.min(
        (progress / currentFileSize) * 100,
        100
      );

      // Calculate the total progress as the weighted average based on file sizes
      totalProgress = this.uploadedFiles.reduce((acc, file, index) => {
        if (index <= this._uploadedFilesStatus.currentFileIndex) {
          // Progress for completed files is 100%
          const fileProgress =
            index === this._uploadedFilesStatus.currentFileIndex
              ? currentFileProgress
              : 100;
          return (
            acc +
            (fileProgress * file.size) / this._uploadedFilesStatus.totalFileSize
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
        clearInterval(uploadInterval); // Stop the interval for the current file

        if (
          this._uploadedFilesStatus.currentFileIndex <
          this.uploadedFiles.length - 1
        ) {
          this._uploadedFilesStatus.currentFileIndex++;
          this.uploadNextFile();
        } else {
          // All files uploaded successfully
          this._uploadedFilesStatus = {
            ...this._uploadedFilesStatus,
            status: this.invalidFiles.length > 0 ? 'error' : 'success',
            progress: 100,
          };
        }

        this.requestUpdate();
      }
    }, 30);
  }

  handleCloseClick() {}

  private _getHelperText() {
    const invalidFiles = this.invalidFiles.length;
    const uploadedFiles = this.uploadedFiles.length;
    const totalFiles = uploadedFiles + invalidFiles;
    const index = this._uploadedFilesStatus.currentFileIndex;
    const progress = this._uploadedFilesStatus.progress;

    // TODO: Replace all the hardcoded strings with proper translations

    if (invalidFiles > 0) {
      // Upload is still in progress
      if (progress < 100) {
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-file-uploader-status': FileUploaderStatus;
  }
}
