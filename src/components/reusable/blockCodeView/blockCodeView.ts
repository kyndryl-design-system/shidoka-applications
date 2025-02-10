import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { deepmerge } from 'deepmerge-ts';

import Prism from 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
import 'prismjs-components-importer';
Prism.plugins.autoloader.languages_path = 'node_modules/prismjs/components/';

import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/copy.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark.svg';
import chevronDown from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';

import '../button';

import BlockCodeViewStyles from './blockCodeView.scss';
import ShidokaSyntaxTheme from '../../../common/scss/shidoka-syntax-theme.scss';

interface LanguageMatch {
  language: string;
  relevance: number;
}

const _defaultTextStrings = {
  collapsed: 'Collapsed',
  expanded: 'Expanded',
};

const LANGUAGE_SPECIFIC_TOKENS: Record<string, string[]> = {
  markup: ['<', '>', '/', 'div', 'span', 'class', 'id'],
  html: ['<', '>', '/', 'div', 'span', 'class', 'id'],
  css: ['{', '}', ':', ';', '#', '.'],
  javascript: ['function', 'const', 'let', 'var', '=>'],
  typescript: ['interface', 'type', ':', 'as'],
  python: ['def', 'import', 'from', 'class'],
  java: ['public', 'private', 'class', 'void'],
};

/**
 * `<kyn-block-code-view>` component to display `<code>` snippets as standalone single-/multi-line block elements.
 * @fires on-copy - Emits when the copy button is clicked.
 */
@customElement('kyn-block-code-view')
export class BlockCodeView extends LitElement {
  static override styles = [BlockCodeViewStyles, ShidokaSyntaxTheme];

  /** Sets background and text theming. */
  @property({ type: String })
  darkTheme: 'light' | 'dark' | 'default' = 'default';

  /** If empty string, attempt language syntax auto-detection. Setting a value will override auto-detection and manually configure desired language. */
  @property({ type: String })
  language = '';

  /** Customizable max-height setting for code snippet container. */
  @property({ type: Number })
  maxHeight: number | null = null;

  /** Optionally displayed label above code snippet container. */
  @property({ type: String })
  codeViewLabel = '';

  /** Optionally display button to copy code snippet. */
  @property({ type: Boolean })
  copyOptionVisible = false;

  /** Optionally display button to expand code snippet container. */
  @property({ type: Boolean })
  codeViewExpandable = false;

  /** Sets copy code button text (optional). */
  @property({ type: String })
  copyButtonText = '';

  /** Sets copy button description attr value. */
  @property({ type: String })
  copyButtonDescriptionAttr = '';

  /** Sets code snippet for display -- NOTE: original formatting is preserved. */
  @property({ type: String })
  codeSnippet = '';

  /** Text string customization. */
  @property({ type: Object })
  textStrings = _defaultTextStrings;

  /** Internal text strings.
   * @internal
   */
  @state()
  private _textStrings = _defaultTextStrings;

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

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('darkTheme')) {
      this.requestUpdate();
    }

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

  override render() {
    const containerStyle = `${this.getContainerStyle()};`;

    return html`
      ${this.codeViewLabel
        ? html`<div class="code-view__label">
            <label>${this.codeViewLabel}</label>
          </div>`
        : null}
      <div class="${this.getContainerClasses()}" style="${containerStyle}">
        <div class="code-snippet-wrapper">
          <pre
            @keydown=${this.handleKeypress}
            role="region"
          ><code tabindex="0" class="language-${this
            ._effectiveLanguage}">${unsafeHTML(
            this._highlightedCode
          )}</code></pre>
        </div>
        ${this.renderCopyButton()} ${this.renderExpandButton()}
      </div>
    `;
  }

  private getContainerClasses() {
    return classMap({
      'code-view__container': true,
      'single-line': this._isSingleLine,
      'multi-line': !this._isSingleLine,
      'copy-button-text-true':
        this.copyButtonText && this.copyButtonText.length > 0,
      'copy-button-text-false': !this.copyButtonText,
      'shidoka-syntax-theme': true,
      'shidoka-syntax-theme--dark': this.darkTheme === 'dark',
      'shidoka-syntax-theme--light': this.darkTheme === 'light',
      'expanded-code-view': this.codeExpanded,
      'has-overflow': this.hasOverflow,
    });
  }

  private renderCopyButton() {
    if (!this.copyOptionVisible) return null;
    return html`
      <kyn-button
        class="code-view__copy-button"
        kind="tertiary"
        size="small"
        iconPosition="left"
        ?disabled=${this._copyState.copied}
        description=${ifDefined(this.copyButtonDescriptionAttr)}
        @click=${this.copyCode}
      >
        <span slot="icon" class="copy-icon"
          >${this._copyState.copied
            ? unsafeSVG(checkmarkIcon)
            : unsafeSVG(copyIcon)}</span
        >
        ${this._copyState.text
          ? html`<span class="copy-text">${this._copyState.text}</span>`
          : null}
      </kyn-button>
    `;
  }

  private renderExpandButton() {
    if (
      !this.codeViewExpandable ||
      (!this.hasOverflow && this._codeFitsContainerOnLoad)
    )
      return null;
    return html`
      <kyn-button
        class="code-view__expand-button"
        kind="tertiary"
        size="small"
        iconPosition="left"
        outlineOnly
        description=${this.codeExpanded
          ? this._textStrings.expanded
          : this._textStrings.collapsed}
        @click=${this.expandCodeView}
      >
        <span slot="icon" class="expand-icon">${unsafeSVG(chevronDown)}</span>
      </kyn-button>
    `;
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    if (changedProps.has('codeExpanded')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  private highlightCode() {
    const processedCode = this.removeLeadingWhitespace(this.codeSnippet);
    this._isSingleLine = processedCode.trim().split('\n').length === 1;
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

  private detectLanguage(code: string): string {
    if (!code.trim()) return 'plaintext';

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

    return bestMatch.language === 'markup'
      ? this.determineMarkupLanguage(code)
      : bestMatch.language;
  }

  private calculateRelevance(
    tokens: (string | Prism.Token)[],
    language: string
  ): number {
    return tokens.reduce((relevance, token) => {
      if (typeof token !== 'string') {
        relevance += this.getTokenRelevance(token, language);
      }
      return relevance;
    }, 0);
  }

  private getTokenRelevance(token: Prism.Token, language: string): number {
    let relevance =
      1 +
      (token.alias ? (Array.isArray(token.alias) ? token.alias.length : 1) : 0);
    if (this.isLanguageSpecificToken(token, language)) relevance += 2;
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
    const specificTokens = LANGUAGE_SPECIFIC_TOKENS[language] || [];
    return specificTokens.some((t) => token.content.toString().includes(t));
  }

  private determineMarkupLanguage(code: string): string {
    if (/<\/?[a-z][\s\S]*>/i.test(code)) return 'html';
    if (/<\?xml/i.test(code)) return 'xml';
    if (/<svg/i.test(code)) return 'svg';
    if (/<math/i.test(code)) return 'mathml';
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

  private formatExampleCode(code: string) {
    return { code };
  }

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
          new CustomEvent('on-copy', {
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

  private getContainerStyle(): string {
    if (this.codeExpanded) {
      return this._expandedHeight
        ? `max-height: ${this._expandedHeight}px`
        : '';
    }
    return this.maxHeight !== null ? `max-height: ${this.maxHeight}px` : '';
  }

  private expandCodeView() {
    this.codeExpanded = !this.codeExpanded;

    if (this.codeExpanded) {
      const pre = this.shadowRoot?.querySelector('pre') as HTMLElement;
      this._expandedHeight = pre?.scrollHeight || null;
    } else {
      this._expandedHeight = null;
    }

    this.requestUpdate();
    setTimeout(() => this.checkOverflow(), 0);
  }

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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}
