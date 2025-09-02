import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { action } from 'storybook/actions';
import './index';
import '../../reusable/button';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';

/** This is just a sample component for AI chat input with file attachment */

@customElement('sample-attach-file')
export class SampleAttachFile extends LitElement {
  @state()
  accessor _files: any[] = [];

  override render() {
    return html`
      <form
        @submit=${(e: any) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log('Form Data:', ...formData);
          return false;
        }}
      >
        <kyn-input-query-attach-file
          name="attach-file"
          placeholder="Type your message..."
          .floating=${false}
          .enableFileUpload=${true}
          .files=${this._files}
          @selected-files=${(e: any) => {
            action(e.type)({ ...e, detail: e.detail }), this._handleFiles(e);
          }}
          @on-input=${(e: any) => action(e.type)({ ...e, detail: e.detail })}
        >
          <kyn-button
            type="submit"
            name="test"
            kind="primary-ai"
            description="Submit"
            @on-change=${(e: any) => action(e.type)({ ...e, detail: e.detail })}
          >
            <span slot="icon">${unsafeSVG(sendIcon)}</span>
          </kyn-button>
        </kyn-input-query-attach-file>
      </form>
    `;
  }

  /** This is just a sample function to handle file upload simulation */
  private _handleFiles = (e: CustomEvent) => {
    const attachedFiles = e.detail.files;

    this._files = attachedFiles.map((f: any) => {
      const existing = this._files.find((x) => x.id === f.id);
      if (existing) {
        return existing;
      }
      return { ...f, status: 'uploading' };
    });

    this.requestUpdate();
    attachedFiles.forEach((file: any) => {
      if (file.status === 'new') {
        const uploadTime = 1000 + Math.random() * 3000;
        setTimeout(() => {
          this._markUploaded(file.id);
        }, uploadTime);
      }
    });
  };

  private _markUploaded(id: string) {
    this._files = this._files.map((f: any) =>
      f.id === id ? { ...f, status: 'uploaded' } : f
    );
    this.requestUpdate();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'sample-attach-file': SampleAttachFile;
  }
}
