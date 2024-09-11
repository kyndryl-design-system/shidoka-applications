import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';

import Prism from 'prismjs';

import copyIcon from '@carbon/icons/es/copy/20';
import checkmarkIcon from '@carbon/icons/es/checkmark--outline/20';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import BlockCodeViewStyles from './blockCodeView.scss';
import ShidokaLightTheme from './shidokaLightSyntaxStyles.scss';
import ShidokaDarkTheme from './shidokaDarkSyntaxStyles.scss';

/**
 * `<kyn-block-code-view>` component to display `<code>` snippets as standalone single-/multi-line block elements.
 * @fires on-custom-copy - Emits when the copy button is clicked.
 */
@customElement('kyn-block-code-view')
export class BlockCodeView extends LitElement {
  static override styles = [
    BlockCodeViewStyles,
    ShidokaLightTheme,
    ShidokaDarkTheme,
  ];

  /** Code snippet to be formatted and displayed within the html `<code>` element. */
  @property({ type: String })
  codeSnippet = '';

  /** Code snippet size: `auto`, `sm`, `md`, or `lg`. */
  @property({ type: String })
  size = 'md';

  /** Code language (ex: `javascript`, `css`, `markdown`, `xml`). */
  @property({ type: String })
  language = '';

  /** `aria-label` attribute value for accessibility purposes.*/
  @property({ type: String })
  ariaLabelAttr = '';

  /** Optional label value to be displayed above code snippet. */
  @property({ type: String })
  codeViewLabel = '';

  /** Optional title attr value. */
  @property({ type: String })
  copyButtonTitleAttr = '';

  /** Optional description attr value. */
  @property({ type: String })
  copyButtonDescriptionAttr = '';

  /** Copy code option available */
  @property({ type: Boolean })
  copyOptionVisible = false;

  /** Copy button text (optional) */
  @property({ type: String })
  copyButtonText = '';

  /** Optional dark theme boolean to toggle theme between light/dark */
  @property({ type: Boolean })
  darkTheme = false;

  /** Auto-detect whether code snippet is single line (boolean) -- styled accordingly
   * @internal
   */
  @state()
  private _isSingleLine = false;

  /** Formatted code (prism.js) to be displayed.
   * @internal
   */
  @state()
  private _highlightedCode = '';

  /** Copy key-values to communicate copy button styling and state.
   * @internal
   */
  @state() private _copyState = { copied: false, text: '' };

  override render() {
    return html`
      ${this.codeViewLabel
        ? html`<div class="code-view__label">
            <label>${this.codeViewLabel}</label>
          </div>`
        : null}
      <div
        aria-label=${this.ariaLabelAttr}
        class="${classMap({
          code_view__container: true,
          [`size--${this.size}`]: true,
          'single-line': this._isSingleLine,
          'multi-line': !this._isSingleLine,
          'shidoka-dark-syntax-theme': this.darkTheme,
          'shidoka-light-syntax-theme': !this.darkTheme,
        })}"
      >
        <pre
          tabindex="0"
          @keydown="${this.handleKeyDown}"
          role="region"
        ><code class="language-${this.language}">${unsafeHTML(
          this._highlightedCode
        )}</code></pre>

        ${this.copyOptionVisible
          ? html`<kd-button
              class="code-view__copy-button"
              kind="primary-web"
              size="small"
              iconPosition="left"
              ?disabled=${this._copyState.copied}
              title=${this.copyButtonTitleAttr}
              name=${this.copyButtonDescriptionAttr}
              description=${this.copyButtonDescriptionAttr}
              @click=${this.copyCode}
            >
              <kd-icon
                slot="icon"
                class="copy-icon"
                .icon=${this._copyState.copied ? checkmarkIcon : copyIcon}
              ></kd-icon>
              ${this._copyState.text
                ? html`<span class="copy-text">${this._copyState.text}</span>`
                : null}
            </kd-button>`
          : null}
      </div>
    `;
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('codeSnippet') ||
      changedProperties.has('language')
    ) {
      this.processCodeSnippet();
    }
    if (changedProperties.has('copyButtonText')) {
      this._copyState = { ...this._copyState, text: this.copyButtonText };
    }
  }

  private processCodeSnippet() {
    const processedCode = this.removeLeadingWhitespace(this.codeSnippet);
    this._isSingleLine = this.isSingleLineCode(processedCode);
    this._highlightedCode = Prism.highlight(
      processedCode,
      Prism.languages[this.language] || Prism.languages.plaintext,
      this.language
    );
    this.requestUpdate();
  }

  // detect single vs multi-line block code snippet for custom default styling
  private isSingleLineCode(code: string): boolean {
    return code.trim().split('\n').length === 1;
  }

  // for @action printout
  private formatExampleCode(code: string) {
    return { code };
  }

  // copy code button click lyric
  private copyCode(e: Event) {
    const originalText = this._copyState.text;
    navigator.clipboard
      .writeText(this.codeSnippet)
      .then(() => {
        this._copyState = {
          copied: true,
          text: originalText.length > 1 ? 'Copied!' : '',
        };
        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent('on-custom-copy', {
            detail: {
              origEvent: e,
              fullSnippet: this.formatExampleCode(this.codeSnippet),
            },
          })
        );
        setTimeout(() => {
          this._copyState = { copied: false, text: originalText };
          this.requestUpdate();
        }, 3000);
      })
      .catch((err) => console.error('Failed to copy code:', err));
  }

  // accessibility -- detection on scrollable code blocks
  private handleKeyDown(e: KeyboardEvent) {
    const pre = e.currentTarget as HTMLPreElement;
    if (e.key === 'ArrowDown') {
      pre.scrollTop += 10;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      pre.scrollTop -= 10;
      e.preventDefault();
    }
  }

  // ensures <pre> code snippet has correct indentation and formatting
  private removeLeadingWhitespace(code: string): string {
    if (!code) return '';
    const lines = code.split('\n');
    const minIndent = lines.reduce((min, line) => {
      const match = line.match(/^[ \t]*/);
      const indent = match ? match[0].length : 0;
      return line.trim().length ? Math.min(min, indent) : min;
    }, Infinity);
    return lines
      .map((line) => line.slice(minIndent))
      .join('\n')
      .trim();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}