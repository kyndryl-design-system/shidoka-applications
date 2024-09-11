import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import Prism from 'prismjs';

import copyIcon from '@carbon/icons/es/copy/20';
import checkmarkIcon from '@carbon/icons/es/checkmark--outline/20';
import chevronDown from '@carbon/icons/es/chevron--down/20';

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

  /** Code snippet language (ex: `javascript`, `css`, `markdown`, `xml`). */
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

  /** Array to detect pre-defined command line languages for custom styling.
   * @internal
   */
  @state()
  private _commandLineLangs = ['bash', 'shell', 'powershell'];

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

  /** Formatted code (prism.js) to be displayed.
   * @internal
   */
  @state()
  private _highlightedCode = '';

  /** Copy key-values to communicate copy button styling and state.
   * @internal
   */
  @state()
  private _copyState = { copied: false, text: '' };

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
          class="${classMap({
            'command-line': this._commandLineLangs.includes(this.language),
          })}"
        ><code tabindex="0" class="language-${this.language}">${unsafeHTML(
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
      this.processCodeSnippet();
    }
    if (changedProperties.has('copyButtonText')) {
      this._copyState = { ...this._copyState, text: this.copyButtonText };
      this.checkOverflow();
    }
  }

  private processCodeSnippet() {
    const processedCode = this.removeLeadingWhitespace(this.codeSnippet);
    this._isSingleLine = this.isSingleLineCode(processedCode);
    this._highlightedCode = this.highlightCode(processedCode);
    this.requestUpdate();
  }

  private highlightCode(code: string): string {
    return Prism.highlight(
      code,
      Prism.languages[this.language] || Prism.languages.plaintext,
      this.language
    );
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

  private expandCodeView() {
    this.codeExpanded = !this.codeExpanded;
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
      .then(() => this.handleSuccessfulCopy(e, originalText))
      .catch((err) => console.error('Failed to copy code:', err));
  }

  private handleSuccessfulCopy(e: Event, originalText: string) {
    this._copyState = {
      copied: true,
      text: originalText.length > 1 ? 'Copied!' : '',
    };
    this.requestUpdate();
    this.dispatchCopyEvent(e);
    this.resetCopyStateAfterDelay(originalText);
  }

  private dispatchCopyEvent(e: Event) {
    this.dispatchEvent(
      new CustomEvent('on-custom-copy', {
        detail: {
          origEvent: e,
          fullSnippet: this.formatExampleCode(this.codeSnippet),
        },
      })
    );
  }

  private resetCopyStateAfterDelay(originalText: string) {
    setTimeout(() => {
      this._copyState = { copied: false, text: originalText };
      this.requestUpdate();
    }, 3000);
  }

  // accessibility -- handling for scrollable code blocks
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}
