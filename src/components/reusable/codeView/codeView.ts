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
 * Code view component.
 * @fires copy - Emits when the copy button is clicked.
 * @slot unnamed - inline text slot from story book.
 * @slot inline-example - Slot for non-code example text to preceed inline code snippet.
 * @slot copy-slot - Slot for copy button.
 */
@customElement('kyn-code-view')
export class CodeView extends LitElement {
  static override styles = [CodeViewStyles, PrismStyles];

  /** Code View (block only) size: `auto`, `sm`, `md`, or `lg`. */
  @property({ type: String }) size = 'md';

  /** Code language (ex: `javascript`, `css`, `markdown`, `xml`). */
  @property({ type: String }) language = '';

  /** Optional title to be displayed above code snippet. */
  @property({ type: String }) override title = '';

  /** Code View type: `inline`, `block` */
  @property({ type: String }) type = 'block';

  /** Code View copy code option available */
  @property({ type: Boolean }) copyOptionVisible = false;

  /** Code View copy button text (optional) */
  @property({ type: String }) copyButtonText = '';

  /** Detected whether code snippet is single line (boolean) -- styled accordingly */
  @property({ type: Boolean }) isSingleLine = false;

  @state() private _highlightedCode = '';
  @state() private codeCopied = false;

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
          'single-line-true': this.isSingleLine,
          'single-line-false': !this.isSingleLine,
        })}"
      >
        <pre
          tabindex="0"
          @keydown="${this.handleKeyDown}"
          aria-label=${this.isSingleLine
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
                ?disabled=${this.codeCopied}
                @click=${(e: Event) => this._copyCode(e)}
              >
                <kd-icon
                  slot="icon"
                  class="copy-icon"
                  .icon=${this.codeCopied ? checkmarkIcon : copyIcon}
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
        this.codeCopied = true;
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
          this.codeCopied = false;
          this.copyButtonText = originalText;
        }, 3000);
      })
      .catch((err) => console.error('Failed to copy code:', err));
  }

  override firstUpdated(changedProperties: PropertyValues) {
    console.log({ changedProperties });
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
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
        return Prism.languages.javascript;
      case 'css':
        return Prism.languages.css;
      case 'html':
      case 'xml':
        return Prism.languages.markup;
      case 'json':
        return Prism.languages.json;
      case 'typescript':
        return Prism.languages.typescript;
      case 'bash':
        return Prism.languages.bash;
      case 'scss':
        return Prism.languages.scss;
      case 'svg':
        return Prism.languages.svg;
      case 'yaml':
        return Prism.languages.yaml;
      default:
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
      const grammar = this.getCodeLanguage(this.language);
      if (grammar) {
        this._highlightedCode = Prism.highlight(
          this._codeContent,
          grammar,
          this.language
        );
      } else {
        // Fallback to plain text if language is not supported
        this._highlightedCode = this._codeContent;
      }
    } else {
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
