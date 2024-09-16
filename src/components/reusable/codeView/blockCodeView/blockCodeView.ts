import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { deepmerge } from 'deepmerge-ts';

import hljs from 'highlight.js/lib/common';

import copyIcon from '@carbon/icons/es/copy/20';
import checkmarkIcon from '@carbon/icons/es/checkmark--outline/20';
import chevronDown from '@carbon/icons/es/chevron--down/20';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import BlockCodeViewStyles from './blockCodeView.scss';
import ShidokaLightTheme from './shidokaLightSyntaxStyles.scss';
import ShidokaDarkTheme from './shidokaDarkSyntaxStyles.scss';

const _defaultTextStrings = {
  collapsed: 'Collapsed',
  expanded: 'Expanded',
};

/**
 * `<kyn-block-code-view>` component to display `<code>` snippets as standalone single-/multi-line block elements. Utilizes highlight.js (`https://highlightjs.org/`) for syntax highlighting.
 * @fires on-copy - Emits when the copy button is clicked.
 */
@customElement('kyn-block-code-view')
export class BlockCodeView extends LitElement {
  static override styles = [
    BlockCodeViewStyles,
    ShidokaLightTheme,
    ShidokaDarkTheme,
  ];

  /** Sets background and text theming. */
  @property({ type: String })
  darkTheme: 'light' | 'dark' = 'dark';

  /** Array of hard-coded languages to register and use for highlighting */
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

  /** Component `aria-label` attribute value for accessibility purposes.*/
  @property({ type: String })
  ariaLabelAttr = '';

  /** Sets copy button description attr value. */
  @property({ type: String })
  copyButtonDescriptionAttr = '';

  /** Sets copy button title attr value. */
  @property({ type: String })
  copyButtonTitleAttr = '';

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
  _textStrings = _defaultTextStrings;

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

  /** User manually toggled the expand/collapse state (visibility of expand button should persist).
   * @internal
   */
  @state()
  private userToggled = false;

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

  /** If expandable -- height of the container when fully expanded.
   * @internal
   */
  @state()
  private _expandedHeight: number | null = null;

  override render() {
    const containerStyle = this.getContainerStyle();

    return html`
      ${this.codeViewLabel
        ? html`<div class="code-view__label">
            <label>${this.codeViewLabel}</label>
          </div>`
        : null}
      <div
        aria-label=${ifDefined(this.ariaLabelAttr)}
        class="${this.getContainerClasses()}"
      >
        <div class="code-snippet-wrapper" style=${containerStyle}>
          <pre
            @keydown=${this.handleKeypress}
            role="region"
          ><code tabindex="0" class="language-${this
            ._effectiveLanguage} manually-set-language-${!!this
            .language}">${unsafeHTML(this._highlightedCode)}</code></pre>
        </div>

        ${this.copyOptionVisible
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
                ? html`<span class="copy-text">${this._copyState.text}</span>`
                : null}
            </kd-button>`
          : null}
        ${this.codeViewExpandable && this.hasOverflow
          ? html`<kd-button
              class="code-view__expand-button"
              kind="tertiary"
              size="small"
              iconPosition="left"
              title="Expand/Collapse code snippet"
              name="toggle-code-expanded"
              description=${this.codeExpanded
                ? this._textStrings.expanded
                : this._textStrings.collapsed}
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

  private getContainerClasses() {
    return classMap({
      'code-view__container': true,
      'single-line': this._isSingleLine,
      'multi-line': !this._isSingleLine,
      'copy-button-text-true':
        this.copyButtonText && this.copyButtonText.length > 0,
      'copy-button-text-false': !this.copyButtonText,
      'shidoka-dark-syntax-theme': this.darkTheme === 'dark',
      'shidoka-light-syntax-theme': this.darkTheme === 'light',
      'expanded-code-view': this.codeExpanded,
      'has-overflow': this.hasOverflow,
    });
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('codeExpanded')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }
  }

  override async updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('codeSnippet') ||
      changedProperties.has('language') ||
      changedProperties.has('maxHeight')
    ) {
      await this.highlightCode();

      if (
        changedProperties.has('codeSnippet') ||
        changedProperties.has('language') ||
        changedProperties.has('maxHeight')
      ) {
        this.userToggled = false;
        this.codeExpanded = false;
      }
    }

    if (changedProperties.has('copyButtonText')) {
      this._copyState = { ...this._copyState, text: this.copyButtonText };
    }
    super.updated(changedProperties);
  }

  //
  // CODE DETECTION & SYNTAX HIGHLIGHTING
  private async registerLanguages() {
    if (this.language) {
      for (const langName of this.language) {
        try {
          const langModule = await import(
            `highlight.js/lib/languages/${langName}`
          );
          hljs.registerLanguage(langName, langModule.default);
        } catch (err) {
          console.warn(
            `Language module for "${langName}" could not be loaded.`,
            err
          );
        }
      }
    }
  }

  private async highlightCode() {
    await this.registerLanguages();

    this._isSingleLine = this.isSingleLineCode(this.codeSnippet);

    let processedCode = this.language
      ? this.codeSnippet
      : this.normalizeCodeSnippet(this.codeSnippet);

    // prepend four spaces to the first line if it meets criteria
    if (!this._isSingleLine && !this.language) {
      const lines = processedCode.split('\n');
      lines[0] = `    ${lines[0]}`; // prepend four spaces to the first line
      processedCode = lines.join('\n');
    }

    let result;
    try {
      if (this.language) {
        result = hljs.highlight(processedCode, {
          language: this.language,
          ignoreIllegals: true,
        });
        this._effectiveLanguage = this.language;
      } else {
        result = hljs.highlightAuto(processedCode);
        this._effectiveLanguage = result.language || '';
      }

      this._highlightedCode = result.value;
    } catch (e) {
      console.warn(`Highlighting failed. Falling back to auto-detection.`, e);
      result = hljs.highlightAuto(processedCode);
      this._highlightedCode = result.value;
      this._effectiveLanguage = result.language || '';
    }

    await this.updateComplete;
    this.checkOverflow();
  }

  private normalizeCodeSnippet(code: string): string {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
    const minIndent = Math.min(
      ...nonEmptyLines.map((line) => line.match(/^\s*/)?.[0].length || 0)
    );
    const normalizedLines = lines.map((line) => {
      if (line.trim().length === 0) return '';
      return line.slice(minIndent);
    });

    return normalizedLines.join('\n');
  }

  private checkOverflow() {
    const container = this.shadowRoot?.querySelector(
      '.code-snippet-wrapper'
    ) as HTMLElement;
    const pre = container?.querySelector('pre') as HTMLElement;
    if (pre && container) {
      const naturalHeight = pre.scrollHeight;
      const containerHeight =
        this.maxHeight !== null ? this.maxHeight : container.clientHeight;

      const calcHeight = this.codeExpanded
        ? this._expandedHeight || containerHeight
        : containerHeight;

      const isOverflowing = naturalHeight > calcHeight;

      if (this.userToggled) {
        this.hasOverflow = true;
      } else {
        this.hasOverflow = isOverflowing;
      }

      this.codeViewExpandable = this.hasOverflow;

      this.requestUpdate();
    }
  }

  // detect single vs multi-line block code snippet for custom default styling
  private isSingleLineCode(code: string): boolean {
    return code.trim().split('\n').length === 1;
  }

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
      const pre = this.shadowRoot?.querySelector('pre') as HTMLElement;
      this._expandedHeight = pre?.scrollHeight || null;
      this.userToggled = true;
    } else {
      this._expandedHeight = null;
      this.userToggled = true;
    }

    this.requestUpdate();
    this.checkOverflow();
  }

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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}
