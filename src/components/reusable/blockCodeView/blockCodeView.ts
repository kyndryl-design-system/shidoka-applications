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

  /** Code snippet to be formatted and displayed within the html `<code>` element. */
  @property({ type: String })
  codeSnippet = '';

  /** If provided, syntax highlighting will default to this value, otherwise it will attempt to auto-detect language. */
  @property({ type: String })
  language = '';

  /** Code snippet size: `auto`, `sm`, `md`, or `lg`. */
  @property({ type: String })
  size = 'md';

  /** Dark theme boolean to display theming differences -- light/dark background and contrasting text -- (TEMPORARY: until global dark mode is available) */
  @property({ type: Boolean })
  darkTheme = false;

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

  override render() {
    return html`
      ${this.codeViewLabel
        ? html`<div class="code-view__label">
            <label>${this.codeViewLabel}</label>
          </div>`
        : null}
      <div
        aria-label=${ifDefined(this.ariaLabelAttr)}
        class="${classMap({
          'code-view__container': true,
          [`size--${this.size}`]: true,
          'single-line': this._isSingleLine,
          'multi-line': !this._isSingleLine,
          'shidoka-dark-syntax-theme': this.darkTheme,
          'shidoka-light-syntax-theme': !this.darkTheme,
          'expanded-code-view': this.codeExpanded,
          'has-overflow': this.hasOverflow,
        })}"
      >
        <pre
          @keydown=${this.handleKeypress}
          role="region"
        ><code tabindex="0" class="language-${this
          ._effectiveLanguage}">${unsafeHTML(
          this._highlightedCode
        )}</code></pre>

        ${this.copyOptionVisible
          ? html`<kd-button
              class="code-view__copy-button"
              kind="primary-web"
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
                ? html`<span class="copy-text">${this._copyState.text}</span>`
                : null}
            </kd-button>`
          : null}
        ${this.codeViewExpandable && this.hasOverflow
          ? html`<kd-button
              class="code-view__expand-button"
              kind="primary-web"
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
          : null}
      </div>
    `;
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('codeSnippet') ||
      changedProperties.has('language')
    ) {
      this.highlightCode();
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

  detectLanguage(code: string, languagesToCheck?: string[]): string {
    const languages =
      languagesToCheck ||
      Object.keys(Prism.languages).filter(
        (lang) => typeof Prism.languages[lang] === 'object'
      );

    let bestMatch: LanguageMatch = { language: 'plaintext', relevance: 0 };

    for (const lang of languages) {
      if (Prism.languages[lang]) {
        const tokens = Prism.tokenize(code, Prism.languages[lang]);
        const relevance = this.processTokens(tokens);

        if (relevance > bestMatch.relevance) {
          bestMatch = { language: lang, relevance };
        }
      }
    }

    return bestMatch.language;
  }

  private processTokens(tokens: (string | Prism.Token)[]): number {
    let relevance = 0;
    for (const token of tokens) {
      if (typeof token !== 'string') {
        relevance += 1;
        if (token.alias) {
          relevance += Array.isArray(token.alias) ? token.alias.length : 1;
        }
      }
    }
    return relevance;
  }

  private checkOverflow() {
    requestAnimationFrame(() => {
      const container = this.shadowRoot?.querySelector(
        '.code-view__container'
      ) as HTMLElement;
      const pre = container.querySelector('pre') as HTMLElement;
      if (pre && container) {
        this.hasOverflow = pre.scrollHeight > container.clientHeight;
      }
    });
  }

  // detect single vs multi-line block code snippet for custom default styling
  private isSingleLineCode(code: string): boolean {
    return code.trim().split('\n').length === 1;
  }

  // for @action printout
  private formatExampleCode(code: string) {
    return { code };
  }
  //////*

  //
  // BUTTON CLICK ACTIONS
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

  private expandCodeView() {
    this.codeExpanded = !this.codeExpanded;
    this.requestUpdate();
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
  //////*
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}
