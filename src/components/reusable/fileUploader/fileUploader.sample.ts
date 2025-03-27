import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from '@storybook/addon-actions';
import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import errorFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import SampleFileUploaderScss from './fileUploader.sample.scss';
import './index';
import '../inlineConfirm';
import '../link';

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

  @property({ type: Array })
  validFiles: any[] = [];

  @property({ type: Array })
  invalidFiles: any[] = [];

  override render() {
    return html`
      <!-- File uploader -->
      <kyn-file-uploader
        .accept=${this.accept}
        .multiple=${this.multiple}
        .textStrings=${this.textStrings}
        @on-file-upload=${(e: any) => {
          action(e.type)(e);
          this._handleUploadedFiles(e);
        }}
      ></kyn-file-uploader>
      <!-- File details list -->
      ${this.validFiles.length > 0 || this.invalidFiles.length > 0
        ? html`
            <kyn-file-uploader-list-container>
              <!-- Valid files -->
              ${this.validFiles.length > 0
                ? this.validFiles.map(
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
                            <span class="delete-icon"
                              >${unsafeSVG(deleteIcon)}</span
                            >
                            <span slot="confirmIcon"
                              >${unsafeSVG(deleteIcon)}</span
                            >
                          </kyn-inline-confirm>
                        </div>
                      </kyn-file-uploader-item>
                    `
                  )
                : ''}
              <!-- Invalid files -->
              ${this.invalidFiles.length > 0
                ? this.invalidFiles.map(
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
                        <div slot="actions">
                          <kyn-link standalone>Re-upload</kyn-link>
                        </div>
                      </kyn-file-uploader-item>
                    `
                  )
                : ''}
            </kyn-file-uploader-list-container>
          `
        : ''}
    `;
  }

  private _handleUploadedFiles(event: any) {
    this.validFiles = [...event.detail.validFiles, ...this.validFiles];
    this.invalidFiles = [...event.detail.invalidFiles, ...this.invalidFiles];
    console.log('Valid files:', this.validFiles);
    console.log('Invalid files:', this.invalidFiles);
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
    this.validFiles = this.validFiles.filter((file) => file.id !== fileId);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sample-file-uploader': SampleFileUploader;
  }
}
