import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import hljs from 'highlight.js/lib/common';

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

  /** Sets background and text theming. */
  @property({ type: String })
  darkTheme: 'light' | 'dark' | 'darker' = 'darker';

  /** List of languages to register and use for highlighting */
  @property({ type: Array })
  languages: string[] = [];

  /** Sets code snippet size. */
  @property({ type: String })
  size: 'auto' | 'sm' | 'md' = 'md';

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
            ._effectiveLanguage}">${unsafeHTML(
            this._highlightedCode
          )}</code></pre>
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
        ${this.codeViewExpandable &&
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
          : null}
      </div>
    `;
  }

  private getContainerClasses() {
    return classMap({
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
    });
  }

  override async updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('codeSnippet') ||
      changedProperties.has('languages') ||
      changedProperties.has('maxHeight')
    ) {
      await this.highlightCode();
      this.checkOverflow();
    }

    if (changedProperties.has('copyButtonText')) {
      this._copyState = { ...this._copyState, text: this.copyButtonText };
    }
    super.updated(changedProperties);
  }

  //
  // CODE DETECTION & SYNTAX HIGHLIGHTING
  private async registerLanguages() {
    if (this.languages && this.languages.length > 0) {
      for (const langName of this.languages) {
        try {
          const langModule = await import(
            /* webpackChunkName: "hljs-language-[request]" */
            `highlight.js/lib/languages/${langName}`
          );
          hljs.registerLanguage(langName, langModule.default);
        } catch (err) {
          console.warn(
            `Language module for ${langName} could not be loaded`,
            err
          );
        }
      }
    }
  }

  private async highlightCode() {
    await this.registerLanguages();

    const codeElement = this.shadowRoot?.querySelector('code');
    if (codeElement) {
      codeElement.textContent = this.codeSnippet;
      this._isSingleLine = this.isSingleLineCode(this.codeSnippet);

      if (this.languages.length === 1) {
        // use the specified language
        const language = this.languages[0];
        const result = hljs.highlight(this.codeSnippet, {
          language: language,
          ignoreIllegals: true,
        });
        codeElement.innerHTML = result.value;
        this._effectiveLanguage = language;
      } else {
        const result = hljs.highlightAuto(this.codeSnippet);
        codeElement.innerHTML = result.value;
        this._effectiveLanguage = result.language || '';
      }
    }

    this.requestUpdate();
    this.checkOverflow();
  }

  // evaluate whether height of code snippet exceeds container height
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
      const pre = this.shadowRoot?.querySelector('pre') as HTMLElement;
      this._expandedHeight = pre?.scrollHeight || null;
    } else {
      this._expandedHeight = null;
    }

    this.requestUpdate();
    setTimeout(() => this.checkOverflow(), 0);
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
