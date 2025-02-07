import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import FileUploaderScss from './fileUploader.scss';
import '../button';
import { deepmerge } from 'deepmerge-ts';

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

  /** Set the file types that the component accepts. By default, it accepts all file types.  */
  @property({ type: Array })
  fileTypes: string[] = [];

  /** Set this to `true`, if the component accepts multiple file uploads. */
  @property({ type: Boolean })
  multiple = false;

  /** Uploaded files. */
  @property({ type: Array })
  uploadedFiles: File[] = [];

  /** Set the type of file uploader needed. Accepted values
   * are `button`, `drag-drop` or `both`. Default value is `button`.
   */
  @property({ type: String })
  fileUploderType = 'button';

  /**
   * Customizable text strings.
   */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  _textStrings = _defaultTextStrings;

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
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      this.uploadedFiles = Array.from(event.dataTransfer.files);
    }
    this._emitFileUploadEvent();
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override render() {
    return html`
      <div class="file-uploader-container">
        <div class="accepted-file-types-container">
          <p>
            ${this._textStrings.acceptedFileTypes}:
            ${this.renderAcceptedFileTypes()}
          </p>
        </div>
        ${this.fileUploderType === 'drag-drop' ||
        this.fileUploderType === 'both'
          ? this.renderDagDropContainer()
          : null}
        ${this.fileUploderType === 'both'
          ? html` <p class="or-text">${this._textStrings.or}</p> `
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

  private renderDagDropContainer() {
    return html`
      <div
        class="drag-drop-container"
        @dragover="${this.handleDragOver}"
        @drop="${this.handleDrop}"
      >
        <p>${this._textStrings.dragAndDrop}</p>
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
      />
    </div>`;
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

  private _triggerFileSelect() {
    const fileInputElement = this.shadowRoot?.querySelector(
      '#fileInput'
    ) as HTMLInputElement;
    fileInputElement?.click();
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
