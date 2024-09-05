import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';

import Prism from 'prismjs';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import copyIcon from '@carbon/icons/es/copy/20';
import checkmarkIcon from '@carbon/icons/es/checkmark/20';
import checkMarkOutlineIcon from '@carbon/icons/es/checkmark--outline/20';

import CodeViewStyles from './codeView.scss';

/**
 * Code view component.
 * @fires copy - Emits when the copy button is clicked.
 * @slot unnamed - Slot for custom copy button.
 * @slot tooltip - Slot for tooltip in header.
 */
@customElement('kyn-code-view')
export class CodeView extends LitElement {
  static override styles = CodeViewStyles;

  /** Code view size: `sm`, `md`, or `lg`. */
  @property({ type: String })
  size = 'md';

  /** Language: `javascript`, `css`, `scss`, `json`, `html`, `xml`, `markdown` */
  @property({ type: String })
  language = '';

  /** Title for code view. */
  @property({ type: String })
  override title = '';

  /** Label for code view accessibility */
  @property({ type: String })
  label = '';

  /** Code view type: `block` or `inline`. */
  @property({ type: String })
  type = 'block';

  /** Copy button text (empty string sets visibility to hidden) */
  @property({ type: String })
  copyButtonText = '';

  /** Copy code option available for user: true/false. */
  @property({ type: Boolean })
  copyOptionVisible = false;

  /** The code content to display and copy. */
  @property({ type: String })
  code = '';

  @state()
  private _highlightedCode = '';

  @state()
  private codeCopied = false;

  formatExampleCode = (code: any) => {
    return {
      fullSnippet: code,
    };
  };

  private _copyCode(e: Event) {
    const originalText = this.copyButtonText;
    navigator.clipboard
      .writeText(this.code)
      .then(() => {
        this.codeCopied = true;
        this.copyButtonText = originalText.length > 1 ? 'Copied!' : '';
        this.dispatchEvent(
          new CustomEvent('on-custom-copy', {
            detail: {
              origEvent: e,
              code: this.formatExampleCode(this.code),
            },
          })
        );
        setTimeout(() => {
          this.codeCopied = false;
          this.copyButtonText = originalText;
        }, 3000);
      })
      .catch((err) => console.error('Failed to copy code:', err));
  }

  override firstUpdated(changedProperties: PropertyValues) {
    if (changedProperties.has('language') || changedProperties.has('code')) {
      this.highlightCode();
    }
  }

  private _sizeMap(type: string): string {
    let btnSize = 'small';

    switch (type) {
      case 'inline':
        btnSize = 'medium';
        break;
    }

    return btnSize;
  }

  private highlightCode() {
    if (this.code && this.language) {
      const langAvailable = Prism.languages[this.language];
      if (langAvailable) {
        this._highlightedCode = Prism.highlight(
          this.code,
          langAvailable,
          this.language
        );
      } else {
        this._highlightedCode = this.code;
      }
    } else {
      this._highlightedCode = this.code;
    }
  }

  override render() {
    return html`
      ${this.title
        ? html`<div class="code-view__title">
            <h3 class="kd-type--headline-02">${this.title}</h3>
          </div>`
        : null}
      <div
        class="${classMap({
          'size--auto': this.size === 'auto',
          'size--sm': this.size === 'sm',
          'size--md': this.size === 'md',
          'size--lg': this.size === 'lg',
          code_view__container: true,
          'type--block': this.type === 'block',
          'type--inline': this.type === 'inline',
        })}"
      >
        <pre><code class="language-${this.language}">${unsafeHTML(
          this._highlightedCode
        )}</code></pre>

        ${this.copyOptionVisible
          ? html`<slot name="copy-button">
              <kd-button
                class="code-view__copy-button"
                slot="actions"
                kind="primary-web"
                size=${this._sizeMap(this.type)}
                iconPosition="left"
                ?disabled=${this.codeCopied}
                @click=${(e: Event) => this._copyCode(e)}
              >
                <kd-icon
                  slot="icon"
                  class="copy-icon"
                  .icon=${this.codeCopied ? checkmarkIcon : copyIcon}
                ></kd-icon>
                <span class="copy-text" ?hidden=${this.copyButtonText === ''}
                  >${this.copyButtonText}</span
                >
              </kd-button>
            </slot>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-code-view': CodeView;
  }
}
