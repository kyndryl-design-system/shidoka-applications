import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../../reusable/badge';
import '../../reusable/button';
import '../../reusable/textArea';
import '../../reusable/thumbnail';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import plusIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import stopIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/control-stop-filled.svg';
import AiInputQueryScss from './aiInputQuery.scss?inline';

@customElement('kyn-ai-input-query')
export class AiInputQuery extends LitElement {
  static override styles = unsafeCSS(AiInputQueryScss);

  @property({ type: Boolean }) accessor floating = false;

  @property({ type: String }) accessor firstBadgeValue = '';
  @property({ type: String }) accessor secondBadgeValue = '';
  @property({ type: String }) accessor firstIconTitle = '';
  @property({ type: String }) accessor secondIconTitle = '';
  @property({ type: String }) accessor firstBadgeIcon = '';
  @property({ type: String }) accessor secondBadgeIcon = '';

  @property({ type: Boolean }) accessor showFirstBadge = false;
  @property({ type: Boolean }) accessor showSecondBadge = false;
  @property({ type: Boolean }) accessor showSendButton = false;
  @property({ type: Boolean }) accessor showStopButton = false;

  /** Files attached to the input query
   * @internal
   */
  private attachedFiles: Array<any> = [];

  override render() {
    return html`
      <form
        class="ai-input-query advanced query-footer"
        @submit=${this._handleSubmit}
      >
        <div class="files-container">
          ${this.attachedFiles.map(
            (file) => html`
              <kyn-thumbnail
                .fileName=${file.name}
                .fileType=${file.type}
                @thumbnail-close=${this._handleThumbnailClose}
              ></kyn-thumbnail>
            `
          )}
        </div>

        <div class="message-content">
          <kyn-text-area
            name="ai-query"
            rows="1"
            placeholder="Type your message..."
            maxRowsVisible="3"
            label="AI Prompt Query"
            hideLabel
            notResizeable
            unstyled
          ></kyn-text-area>
        </div>

        <div class="footer-content">
          <div class="footer-left">
            <input
              id="ai-file-input"
              type="file"
              name="ai-attachments"
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              style="display: none;"
              @change=${this._handleFileChange}
            />

            <kyn-button
              kind="ghost"
              size="small"
              iconPosition="right"
              description="Additional"
              @click=${() =>
                this.shadowRoot?.getElementById('ai-file-input')?.click()}
            >
              <span slot="icon">${unsafeSVG(plusIcon || '')}</span>
            </kyn-button>

            ${this.showFirstBadge
              ? html`
                  <kyn-badge
                    class="ai-mode"
                    label=${this.firstBadgeValue}
                    size="md"
                    type="medium"
                    status="ai"
                    iconTitle=${this.firstIconTitle}
                    @click=${(e: any) =>
                      this.dispatchEvent(
                        new CustomEvent('first-badge-clicked', {
                          detail: {
                            badgeValue: this.firstBadgeValue,
                            event: e,
                          },
                          bubbles: true,
                          composed: true,
                        })
                      )}
                  >
                    ${this.firstBadgeIcon ? unsafeSVG(this.firstBadgeIcon) : ''}
                  </kyn-badge>
                `
              : ''}
            ${this.showSecondBadge
              ? html`
                  <kyn-badge
                    class="ai-mode"
                    label=${this.secondBadgeValue}
                    size="md"
                    type="medium"
                    status="ai"
                    iconTitle=${this.secondIconTitle}
                    @click=${(e: any) =>
                      this.dispatchEvent(
                        new CustomEvent('second-badge-clicked', {
                          detail: {
                            badgeValue: this.secondBadgeValue,
                            event: e,
                          },
                          bubbles: true,
                          composed: true,
                        })
                      )}
                  >
                    ${this.secondBadgeIcon
                      ? unsafeSVG(this.secondBadgeIcon)
                      : ''}
                  </kyn-badge>
                `
              : ''}
          </div>

          <div class="footer-right">
            ${this.showSendButton
              ? html`
                  <kyn-button
                    type="submit"
                    kind="secondary-ai"
                    size="small"
                    description="Submit"
                    @click=${this._handleSubmit}
                  >
                    <span slot="icon">${unsafeSVG(sendIcon)}</span>
                  </kyn-button>
                `
              : ''}
            ${this.showStopButton
              ? html`
                  <kyn-button
                    type="button"
                    kind="secondary-ai"
                    size="small"
                    description="Stop"
                    @click=${this._handleStop}
                  >
                    <span slot="icon">${unsafeSVG(stopIcon)}</span>
                  </kyn-button>
                `
              : ''}
          </div>
        </div>
      </form>
    `;
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    this.dispatchEvent(
      new CustomEvent('submit', {
        detail: { formData, attachedFiles: this.attachedFiles },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleStop(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('stop', { bubbles: true, composed: true })
    );
  }

  private _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input?.files) return;
    const files = Array.from(input.files);

    files.forEach((file) => {
      const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      let fileType = 'document';
      if (['pdf'].includes(fileExtension)) fileType = 'pdf';
      else if (['ppt', 'pptx'].includes(fileExtension)) fileType = 'ppt';
      else if (['doc', 'docx'].includes(fileExtension)) fileType = 'document';

      this.attachedFiles = [
        ...this.attachedFiles,
        { id: fileId, name: file.name, type: fileType, file },
      ];
    });

    this.dispatchEvent(
      new CustomEvent('files-selected', { detail: { files } })
    );
  }

  private _handleThumbnailClose(e: Event) {
    const ev = e as CustomEvent;
    const fileName = ev.detail?.fileName;
    this.attachedFiles = this.attachedFiles.filter((f) => f.name !== fileName);
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent('thumbnail-close', { detail: ev.detail })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-input-query': AiInputQuery;
  }
}
