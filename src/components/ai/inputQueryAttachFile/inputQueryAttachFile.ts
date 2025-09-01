import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, query, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import stylesheet from './inputQueryAttachFile.scss?inline';
import { classMap } from 'lit-html/directives/class-map.js';
import '../../reusable/button';
import '../../reusable/tag';
import '../../reusable/dropdown';
import '../../reusable/loaders/inline';
import { FormMixin } from '../../../common/mixins/form-input';
import addSimpleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';

import docPngIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-png.svg';
import docJpgIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-jpg.svg';
import docPdfIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-pdf.svg';
import attachmentIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/attachment.svg';
import docDocxIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-docx.svg';
import docPptIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-ppt.svg';
import docPptXIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-pptx.svg';
import docXlsxIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/document-xlsx.svg';

/**
 * InputQueryAttachFile Component.
 * @fires selected-files - Emits the uploaded files.`detail:{ Files: Array}`
 * @fires on-input - Captures the input event and emits the selected value and original event details. `detail:{ origEvent: InputEvent,value: string }`
 * @slot footer - Slot for footer content.
 * @slot unnamed - Slot for button icon.
 */
@customElement('kyn-input-query-attach-file')
export class InputQueryAttachFile extends FormMixin(LitElement) {
  static override styles = unsafeCSS(stylesheet);

  /** Input placeholder. */
  @property({ type: String })
  accessor placeholder = '';

  /** Floating state*/
  @property({ type: Boolean })
  accessor floating = false;

  /**
   * Files Object.
   */
  @property({ type: Array })
  accessor files: {
    id: string;
    file: File;
    status: 'new' | 'uploading' | 'uploaded';
  }[] = [];

  /**
   * Queries the <textarea> DOM element.
   * @ignore
   */
  @query('textarea')
  accessor textareaEl!: HTMLTextAreaElement;

  /**
   * Internal valid files.
   * @internal
   */
  @state()
  accessor _files: Object[] = [];

  override render() {
    return html`
      <div class="chat-input ${this.floating ? 'floating' : ''}">
        <div class="message">
          <div
            class=${classMap({
              'input-query': true,
              'has-files': this._files.length > 0,
            })}
          >
            <div class="tags">
              ${this._files.map(
                (file: any) => html`
                  <div class="tag-wrapper">
                    <kyn-tag
                      .label=${file?.file?.name ?? file?.id}
                      tagSize="md"
                      tagColor="ai"
                      ?clickable=${false}
                      @on-close=${(e: any) => this.handleClear(e, file.id)}
                      ?filter=${file.status === 'uploaded'}
                    >
                      <span style="display: flex;">
                        ${unsafeSVG(this._getFileIcon(file?.file?.name))}
                      </span>
                    </kyn-tag>
                    ${file.status === 'uploading'
                      ? html`
                          <div class="overlay">
                            <kyn-loader-inline
                              class="overlay-loader"
                              status="active"
                            >
                            </kyn-loader-inline>
                          </div>
                        `
                      : null}
                  </div>
                `
              )}
            </div>
            <textarea
              class=${classMap({
                compact: this._files.length > 0,
              })}
              name="textInput"
              placeholder=${this.placeholder}
              autocomplete="off"
              @input=${this._handleInput}
            ></textarea>
          </div>
          <slot></slot>
        </div>
        <div class="footer-content">
          <kyn-button
            type="button"
            kind="outline-ai"
            description="Submit"
            size="small"
            @on-click=${this._triggerFileSelect}
          >
            <span slot="icon">${unsafeSVG(addSimpleIcon)}</span>
          </kyn-button>
          <input
            id="fileInput"
            type="file"
            name="attachments"
            multiple
            hidden
            @change=${this._handleFileSelected}
          />
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('files')) {
      this._files = this.files;
      this._setFormValue();
    }
  }

  override updated() {
    if (this._files.length === 0) {
      const textarea = this.shadowRoot?.querySelector('textarea');
      if (textarea) {
        textarea.style.height = '';
        textarea.style.overflowY = '';
      }
    }
  }

  private _handleInput(e: Event) {
    this._handleTextInput(e);
    if (this.files.length > 0) {
      this.autoResize(e);
    }
  }

  private _handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files).map((f, index) => ({
        id: `${Date.now()}-${Math.random()}-${index}`,
        file: f,
        status: 'new',
      }));
      this._files = [...this._files, ...newFiles];
      input.value = '';
      this._setFormValue();
      this._emitFileUploadEvent();
      const textarea = this.shadowRoot?.querySelector('textarea');
      const textareaValue = this.shadowRoot?.querySelector('textarea')?.value;
      if (textarea && textareaValue) {
        this.autoResize({ target: textarea } as unknown as Event);
      }
    }
  }

  private _getFileIcon(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'png':
        return docPngIcon;

      case 'jpg':
      case 'jpeg':
        return docJpgIcon;

      case 'pdf':
        return docPdfIcon;

      case 'doc':
      case 'docx':
        return docDocxIcon;

      case 'ppt':
        return docPptIcon;

      case 'pptx':
        return docPptXIcon;

      case 'xls':
      case 'xlsx':
        return docXlsxIcon;

      default:
        return attachmentIcon;
    }
  }

  private _setFormValue() {
    const formData = new FormData();
    formData.append('textInput', this.value ?? '');
    this._files.forEach((fileObj: any) => {
      const { file } = fileObj;
      formData.append('attachments', file);
    });
    this._internals.setFormValue(formData);
  }

  private _triggerFileSelect() {
    const fileInputElement = this.shadowRoot?.querySelector(
      '#fileInput'
    ) as HTMLInputElement;
    fileInputElement?.click();
  }

  private _emitFileUploadEvent() {
    const event = new CustomEvent('selected-files', {
      detail: {
        files: this._files,
      },
    });
    this.dispatchEvent(event);
  }

  private _handleTextInput(e: any) {
    this.value = e.target.value;
    this._setFormValue();
    const event = new CustomEvent('on-input', {
      detail: {
        value: e.target.value,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  private handleClear(e: any, id: string) {
    e.preventDefault();
    this._files = this._files.filter((file: any) => file.id !== id);
    this.files = this.files.filter((file: any) => file.id !== id);
    this._setFormValue();
    this._emitFileUploadEvent();
  }

  private autoResize(e: Event) {
    const el = e.target as HTMLTextAreaElement;
    el.style.height = '24px';
    const scrollH = el.scrollHeight;
    if (scrollH <= 24) {
      el.style.height = '24px';
      el.style.overflowY = 'hidden';
    } else if (scrollH <= 48) {
      el.style.height = '48px';
      el.style.overflowY = 'hidden';
    } else {
      el.style.height = '48px';
      el.style.overflowY = 'auto';
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._handleResize);
  }

  /** @internal */
  private _handleResize = () => {
    if (this.files.length === 0) return;
    const textarea = this.shadowRoot?.querySelector('textarea');
    if (textarea && this.files.length > 0) {
      this.autoResize({ target: textarea } as unknown as Event);
    }
  };

  private _validate(interacted: Boolean, report: Boolean) {
    // get validity state from textareaEl, combine customError flag if invalidText is provided
    const Validity =
      this.invalidText !== ''
        ? { ...this.textareaEl.validity, customError: true }
        : this.textareaEl.validity;
    // set validationMessage to invalidText if present, otherwise use textareaEl validationMessage
    const ValidationMessage =
      this.invalidText !== ''
        ? this.invalidText
        : this.textareaEl.validationMessage;

    // set validity on custom element, anchor to textareaEl
    this._internals.setValidity(Validity, ValidationMessage, this.textareaEl);

    // set internal validation message if value was changed by user input
    if (interacted) {
      this._internalValidationMsg = this.textareaEl.validationMessage;
    }

    // focus the form field to show validity
    if (report) {
      this._internals.reportValidity();
    }
  }
}
