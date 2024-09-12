import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import Prism from 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
import 'prismjs-components-importer';
Prism.plugins.autoloader.languages_path = 'node_modules/prismjs/components/';

import copyIcon from '@carbon/icons/es/copy/20';
import checkmarkIcon from '@carbon/icons/es/checkmark--outline/20';
import chevronDown from '@carbon/icons/es/chevron--down/20';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import BlockCodeViewStyles from './blockCodeView.scss';
import ShidokaLightTheme from './shidokaLightSyntaxStyles.scss';
import ShidokaDarkTheme from './shidokaDarkSyntaxStyles.scss';

interface LanguageMatch {
  language: string;
  relevance: number;
}

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

  /** Dark theme -- sets background and text contrast */
  @property({ type: String })
  darkTheme: 'light' | 'dark' | 'darker' = 'darker';

  /** If provided, syntax highlighting will default to this value, otherwise it will attempt to auto-detect language. */
  @property({ type: String })
  language = '';

  /** Code snippet size. */
  @property({ type: String })
  size: 'auto' | 'sm' | 'md' | 'lg' = 'md';

  /** Dev modifiable code snippet max-height. */
  @property({ type: Number })
  maxHeight: number | null = null;

  /** Optionally display label value above code snippet. */
  @property({ type: String })
  codeViewLabel = '';

  /** Optionally display copy code button. */
  @property({ type: Boolean })
  copyOptionVisible = false;

  /** Optionally display button to expand code snippet container. */
  @property({ type: Boolean })
  codeViewExpandable = false;

  /** Set copy code button text (optional). */
  @property({ type: String })
  copyButtonText = '';

  /** Component `aria-label` attribute value for accessibility purposes.*/
  @property({ type: String })
  ariaLabelAttr = '';

  /** Copy button description attr value. */
  @property({ type: String })
  copyButtonDescriptionAttr = '';

  /** Copy button title attr value. */
  @property({ type: String })
  copyButtonTitleAttr = '';

  /** Code snippet to be formatted and displayed within the html `<code>` element. */
  @property({ type: String })
  codeSnippet = '';

  /** Auto-detect whether code snippet is single line (boolean) -- styled accordingly (boolean).
   * @internal
   */
  @state()
  private _isSingleLine = false;

  /** Auto-detect whether code snippet exceeds the max-height allowance (boolean).
   * @internal
   */
  @state()
  private hasOverflow = false;

  /** Value indicating whether overflow code sample is expanded (boolean).
   * @internal
   */
  @state()
  private codeExpanded = false;

  /** Copy key-values to communicate copy button styling and state.
   * @internal
   */
  @state()
  private _copyState = { copied: false, text: '' };

  /** Detected language for the code snippet.
   * @internal
   */
  @state()
  private _effectiveLanguage = '';

  /** Highlighted code to be displayed.
   * @internal
   */
  @state()
  private _highlightedCode = '';

  /** Code snippet fits into the height of the container -- no expansion needed.
   * @internal
   */
  @state()
  private _codeFitsContainerOnLoad = true;

  /** If expandable -- height of the container when fully expanded.
   * @internal
   */
  @state()
  private _expandedHeight: number | null = null;

  override render() {
    const containerStyle = this.getContainerStyle();

    return html`
      ${
        this.codeViewLabel
          ? html`<div class="code-view__label">
              <label>${this.codeViewLabel}</label>
            </div>`
          : null
      }
      <div
        aria-label=${ifDefined(this.ariaLabelAttr)}
        class="${classMap({
          'code-view__container': true,
          [`size--${this.size}`]: true,
          'single-line': this._isSingleLine,
          'multi-line': !this._isSingleLine,
          'copy-button-text-true':
            this.copyButtonText && this.copyButtonText.length > 0,
          'copy-button-text-false': !this.copyButtonText,
          'shidoka-darker-syntax-theme': this.darkTheme === 'darker',
          'shidoka-dark-syntax-theme': this.darkTheme === 'dark',
          'shidoka-light-syntax-theme': this.darkTheme === 'light',
          'expanded-code-view': this.codeExpanded,
          'has-overflow': this.hasOverflow,
        })}"
      >
          <div class="code-snippet-wrapper" style=${containerStyle}>
              <pre
              @keydown=${this.handleKeypress}
              role="region"
            ><code tabindex="0" class="language-${
              this._effectiveLanguage
            }">${unsafeHTML(this._highlightedCode)}</code></pre>
          </div>

          ${
            this.copyOptionVisible
              ? html`<kd-button
                  class="code-view__copy-button"
                  kind="tertiary"
                  size="small"
                  iconPosition="left"
                  ?disabled=${this._copyState.copied}
                  title=${ifDefined(this.copyButtonTitleAttr)}
                  name=${ifDefined(this.copyButtonDescriptionAttr)}
                  description=${ifDefined(this.copyButtonDescriptionAttr)}
                  @click=${this.copyCode}
                >
                  <kd-icon
                    slot="icon"
                    class="copy-icon"
                    .icon=${this._copyState.copied ? checkmarkIcon : copyIcon}
                  ></kd-icon>
                  ${this._copyState.text
                    ? html`<span class="copy-text"
                        >${this._copyState.text}</span
                      >`
                    : null}
                </kd-button>`
              : null
          }
          ${
            this.codeViewExpandable &&
            (this.hasOverflow || !this._codeFitsContainerOnLoad)
              ? html`<kd-button
                  class="code-view__expand-button"
                  kind="tertiary"
                  size="small"
                  iconPosition="left"
                  title="Expand/Collapse code snippet"
                  name="toggle-code-expanded"
                  description="Click to ${this.codeExpanded
                    ? 'collapse'
                    : 'expand'} the full code snippet"
                  @click=${this.expandCodeView}
                >
                  <kd-icon
                    slot="icon"
                    class="expand-icon"
                    .icon=${chevronDown}
                  ></kd-icon>
                </kd-button>`
              : null
          }
        </div>
      </div>
    `;
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('codeSnippet') ||
      changedProperties.has('language') ||
      changedProperties.has('maxHeight')
    ) {
      this.highlightCode();
      this.checkOverflow();
    }

    if (changedProperties.has('copyButtonText')) {
      this._copyState = { ...this._copyState, text: this.copyButtonText };
    }
    super.updated(changedProperties);
  }

  //
  // CODE DETECTION & SYNTAX HIGHLIGHTING
  private highlightCode() {
    const processedCode = this.removeLeadingWhitespace(this.codeSnippet);
    this._isSingleLine = this.isSingleLineCode(processedCode);

    this._effectiveLanguage =
      this.language || this.detectLanguage(processedCode);

    if (!Prism.languages[this._effectiveLanguage]) {
      console.warn(
        `Language '${this._effectiveLanguage}' not loaded. Falling back to plaintext.`
      );
      this._effectiveLanguage = 'plaintext';
    }

    this._highlightedCode = Prism.highlight(
      processedCode,
      Prism.languages[this._effectiveLanguage],
      this._effectiveLanguage
    );

    this.requestUpdate();
    this.checkOverflow();
  }

  detectLanguage(code: string): string {
    if (!code.trim()) {
      return 'plaintext';
    }

    const languages = [
      'markup',
      'html',
      'xml',
      'svg',
      'mathml',
      'css',
      'javascript',
      'typescript',
      'python',
      'java',
      'c',
      'cpp',
    ];

    let bestMatch: LanguageMatch = { language: 'plaintext', relevance: 0 };

    for (const lang of languages) {
      if (Prism.languages[lang]) {
        const tokens = Prism.tokenize(code, Prism.languages[lang]);
        const relevance = this.calculateRelevance(tokens, lang);

        if (relevance > bestMatch.relevance) {
          bestMatch = { language: lang, relevance };
        }
      }
    }

    if (bestMatch.language === 'markup') {
      bestMatch.language = this.determineMarkupLanguage(code);
    }

    return bestMatch.language;
  }

  private calculateRelevance(
    tokens: (string | Prism.Token)[],
    language: string
  ): number {
    let relevance = 0;
    for (const token of tokens) {
      if (typeof token !== 'string') {
        relevance += this.getTokenRelevance(token, language);
      }
    }
    return relevance;
  }

  private getTokenRelevance(token: Prism.Token, language: string): number {
    let relevance = 1;
    if (token.alias) {
      relevance += Array.isArray(token.alias) ? token.alias.length : 1;
    }
    if (this.isLanguageSpecificToken(token, language)) {
      relevance += 2;
    }
    if (token.content) {
      if (Array.isArray(token.content)) {
        relevance += token.content.reduce(
          (acc, t) =>
            acc +
            (typeof t === 'string' ? 0 : this.getTokenRelevance(t, language)),
          0
        );
      } else if (typeof token.content !== 'string') {
        relevance += this.getTokenRelevance(token.content, language);
      }
    }
    return relevance;
  }

  private isLanguageSpecificToken(
    token: Prism.Token,
    language: string
  ): boolean {
    const languageSpecificTokens: { [key: string]: string[] } = {
      markup: ['<', '>', '/', 'div', 'span', 'class', 'id'],
      html: ['<', '>', '/', 'div', 'span', 'class', 'id'],
      css: ['{', '}', ':', ';', '#', '.'],
      javascript: ['function', 'const', 'let', 'var', '=>'],
      typescript: ['interface', 'type', ':', 'as'],
      python: ['def', 'import', 'from', 'class'],
      java: ['public', 'private', 'class', 'void'],
    };

    const specificTokens = languageSpecificTokens[language] || [];
    return specificTokens.some((t) => token.content.toString().includes(t));
  }

  private determineMarkupLanguage(code: string): string {
    if (/<\/?[a-z][\s\S]*>/i.test(code)) {
      return 'html';
    }
    if (/<\?xml/i.test(code)) {
      return 'xml';
    }
    if (/<svg/i.test(code)) {
      return 'svg';
    }
    if (/<math/i.test(code)) {
      return 'mathml';
    }
    return 'markup';
  }

  private checkOverflow() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const container = this.shadowRoot?.querySelector(
          '.code-snippet-wrapper'
        ) as HTMLElement;
        const pre = container?.querySelector('pre') as HTMLElement;
        if (pre && container) {
          const naturalHeight = pre.scrollHeight;
          const calcHeight = this.codeExpanded
            ? this._expandedHeight || container.clientHeight
            : this.maxHeight !== null
            ? this.maxHeight
            : container.clientHeight;

          this.hasOverflow = naturalHeight > calcHeight;
          this._codeFitsContainerOnLoad =
            naturalHeight <= (this.maxHeight || container.clientHeight);
        }
      });
    }, 100);
  }

  // ensures <pre> code snippet has correct indentation and formatting
  private removeLeadingWhitespace(code: string): string {
    if (!code) return '';
    const lines = code.split('\n');
    const minIndent = this.findMinimumIndent(lines);
    return lines
      .map((line) => line.slice(minIndent))
      .join('\n')
      .trim();
  }

  private findMinimumIndent(lines: string[]): number {
    return lines.reduce((min, line) => {
      const match = line.match(/^[ \t]*/);
      const indent = match ? match[0].length : 0;
      return line.trim().length ? Math.min(min, indent) : min;
    }, Infinity);
  }

  // detect single vs multi-line block code snippet for custom default styling
  private isSingleLineCode(code: string): boolean {
    return code.trim().split('\n').length === 1;
  }
  //////*

  // for @action printout
  private formatExampleCode(code: string) {
    return { code };
  }

  //
  // BUTTON CLICK ACTION
  // copy code button click logic
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
        }, 5000);
      })
      .catch((err) => console.error('Failed to copy code:', err));
  }

  // expand code snippet container logic
  private getContainerStyle(): string {
    if (this.codeExpanded) {
      return this._expandedHeight
        ? `max-height: ${this._expandedHeight}px;`
        : '';
    }
    return this.maxHeight !== null ? `max-height: ${this.maxHeight}px;` : '';
  }

  private expandCodeView() {
    this.codeExpanded = !this.codeExpanded;

    if (this.codeExpanded) {
      // When expanding, set the expanded height to the full scroll height
      const pre = this.shadowRoot?.querySelector('pre') as HTMLElement;
      this._expandedHeight = pre?.scrollHeight || null;
    } else {
      // When collapsing, reset the expanded height
      this._expandedHeight = null;
    }

    this.requestUpdate();
    // Re-check overflow after expansion
    setTimeout(() => this.checkOverflow(), 0);
  }
  //////*

  //
  // ACCESSIBILITY -- handling for scrollable code blocks
  private handleKeypress(e: KeyboardEvent) {
    const pre = e.currentTarget as HTMLPreElement;
    const scrollAmount = 40;

    const isVerticallyScrollable = pre.scrollHeight > pre.clientHeight;
    const isHorizontallyScrollable = pre.scrollWidth > pre.clientWidth;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (isVerticallyScrollable) {
        pre.scrollTop += e.key === 'ArrowDown' ? scrollAmount : -scrollAmount;
        e.preventDefault();
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (isHorizontallyScrollable) {
        pre.scrollLeft += e.key === 'ArrowRight' ? scrollAmount : -scrollAmount;
        e.preventDefault();
      }
    }
  }
  //////*
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}
