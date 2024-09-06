import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';

import Prism from 'prismjs';

import copyIcon from '@carbon/icons/es/copy/20';
import checkmarkIcon from '@carbon/icons/es/checkmark--outline/20';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import CodeViewStyles from './codeView.scss';
import PrismStyles from './prismSyntaxStyles.scss';

/**
 * Code View component to display <code> snippets either inline with other text or inside a single-/multi-line block element.
 * @fires copy - Emits when the copy button is clicked.
 * @slot unnamed - inline text slot from story book.
 * @slot inline-example - Slot for non-code example text to preceed inline code snippet.
 * @slot copy-slot - Slot for copy button.
 */
@customElement('kyn-code-view')
export class CodeView extends LitElement {
  static override styles = [CodeViewStyles, PrismStyles];

  /** Code snippet type: `inline`, `block` */
  @property({ type: String })
  type = 'block';

  /** *For block type only* -- size: `auto`, `sm`, `md`, or `lg`. */
  @property({ type: String })
  size = 'md';

  /** Code language (ex: `javascript`, `css`, `markdown`, `xml`). */
  @property({ type: String })
  language = '';

  /** Optional title to be displayed above code snippet. */
  @property({ type: String })
  override title = '';

  /** Copy code option available */
  @property({ type: Boolean })
  copyOptionVisible = false;

  /** Copy button text (optional) */
  @property({ type: String })
  copyButtonText = '';

  /** Auto-detect whether code snippet is single line (boolean) -- styled accordingly
   *  * @internal
   */
  @state()
  _isSingleLine = false;

  /** Formatted code (prism.js) to be displayed.
   * @internal
   */
  @state()
  private _highlightedCode = '';

  /** 3s timeout where code has been copied to clipboard and button is temporarily disabled.
   * @internal
   */
  @state()
  private _codeCopied = false;

  /** Copied code content displayed in storybook action printout.
   * @internal
   */
  @state()
  private _codeContent = '';

  override render() {
    return html`
      ${this.title
        ? html`<div class="code-view__title">
            <h3 class="kd-type--headline-02">${this.title}</h3>
          </div>`
        : null}
      ${this.type === 'inline'
        ? html`<span class="inline-example"
            ><slot name="inline-example"></slot
          ></span>`
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
          'single-line': this._isSingleLine,
          'multi-line': !this._isSingleLine,
        })}"
      >
        <pre
          tabindex="0"
          @keydown="${this.handleKeyDown}"
          aria-label=${this._isSingleLine
            ? 'Code block'
            : 'Code block, use arrow keys to scroll'}
        ><code class="language-${this.language}">${unsafeHTML(
          this._highlightedCode
        )}</code></pre>
        <slot @slotchange=${this.highlightCode} style="display: none;"></slot>

        ${this.copyOptionVisible
          ? html`<slot name="copy-slot">
              <kd-button
                class="code-view__copy-button"
                kind="primary-web"
                title="Copy code"
                size=${this._sizeMap(this.type)}
                name="copy code button"
                description="copy code button"
                iconPosition="left"
                ?disabled=${this._codeCopied}
                @click=${(e: Event) => this._copyCode(e)}
              >
                <kd-icon
                  slot="icon"
                  class="copy-icon"
                  .icon=${this._codeCopied ? checkmarkIcon : copyIcon}
                ></kd-icon>
                ${this.copyButtonText
                  ? html`<span class="copy-text">${this.copyButtonText}</span>`
                  : null}
              </kd-button>
            </slot>`
          : null}
      </div>
    `;
  }

  private isSingleLineCode(code: string): boolean {
    return (this._isSingleLine = code.trim().split('\n').length === 1);
  }

  private formatExampleCode = (code: string) => {
    return {
      fullSnippet: code,
    };
  };

  private _copyCode(e: Event) {
    const originalText = this.copyButtonText;
    navigator.clipboard
      .writeText(this._codeContent)
      .then(() => {
        this._codeCopied = true;
        this.copyButtonText = originalText.length > 1 ? 'Copied!' : '';
        this.dispatchEvent(
          new CustomEvent('on-custom-copy', {
            detail: {
              origEvent: e,
              code: this.formatExampleCode(this._codeContent),
            },
          })
        );
        setTimeout(() => {
          this._codeCopied = false;
          this.copyButtonText = originalText;
        }, 3000);
      })
      .catch((err) => console.error('Failed to copy code:', err));
  }

  override firstUpdated() {
    this.highlightCode();
  }

  private _sizeMap(type: string): string {
    return type === 'inline' ? 'medium' : 'small';
  }

  private handleKeyDown(e: KeyboardEvent) {
    const pre = e.target as HTMLPreElement;
    if (e.key === 'ArrowDown') {
      pre.scrollTop += 10;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      pre.scrollTop -= 10;
      e.preventDefault();
    }
  }

  private getCodeLanguage(lang: string): Prism.Grammar | null {
    const languageMap: { [key: string]: Prism.Grammar } = {
      javascript: Prism.languages.javascript,
      js: Prism.languages.javascript,
      css: Prism.languages.css,
      html: Prism.languages.markup,
      xml: Prism.languages.markup,
      json: Prism.languages.json,
      typescript: Prism.languages.typescript,
      bash: Prism.languages.bash,
      scss: Prism.languages.scss,
      svg: Prism.languages.svg,
      yaml: Prism.languages.yaml,
    };

    const detectedLanguage = languageMap[lang.toLowerCase()];
    if (detectedLanguage) {
      return detectedLanguage;
    } else {
      console.warn(
        `Language '${lang}' is not supported. Falling back to plain text.`
      );
      return null;
    }
  }

  private highlightCode() {
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name])'
    ) as HTMLSlotElement;
    const nodes = slot?.assignedNodes();
    this._codeContent =
      nodes
        ?.map((node) => node.textContent)
        .join('')
        .trim() || '';

    if (this._codeContent) {
      this.isSingleLineCode(this._codeContent);
      const detectedLanguage = this.getCodeLanguage(this.language);
      if (detectedLanguage) {
        this._highlightedCode = Prism.highlight(
          this._codeContent,
          detectedLanguage,
          this.language
        );
      } else {
        // fallback to plain text if language is not supported
        this._highlightedCode = this._codeContent;
        this.isSingleLineCode(this._codeContent);
      }
    } else {
      // fallback to plain text if no lanugage detected
      this._highlightedCode = '';
    }
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-code-view': CodeView;
  }
}
