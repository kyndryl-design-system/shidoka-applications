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
import PrismStyles from './prismSyntaxStyles.scss';

/**
 * `<kyn-block-code-view>` component to display `<code>` snippets, either inline within HTML content or as standalone single-/multi-line block elements.
 * @fires on-custom-copy - Emits when the copy button is clicked.
 * @slot unnamed - inline text slot from story book.
 */
@customElement('kyn-block-code-view')
export class BlockCodeView extends LitElement {
  static override styles = [BlockCodeViewStyles, PrismStyles];

  /** Code snippet size: `auto`, `sm`, `md`, or `lg`. */
  @property({ type: String })
  size = 'md';

  /** Code language (ex: `javascript`, `css`, `markdown`, `xml`). */
  @property({ type: String })
  language = '';

  /** Optional code view label, visible to the user above the block code snippet. */
  @property({ type: String })
  codeViewLabel = '';

  /** Optional title to be displayed above code snippet. */
  @property({ type: String })
  copyButtonTitleAttr = '';

  /** Optional descrition to be displayed above code snippet. */
  @property({ type: String })
  copyButtonDescriptionAttr = '';

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

  /** Slotted code content displayed in storybook action printout.
   * @internal
   */
  @state()
  private _slotContent = '';

  override render() {
    return html`
      <div class="code-view__label">
        <label>${this.codeViewLabel}</label>
      </div>

      <div
        class="${classMap({
          code_view__container: true,
          'snippetType--block': true,
          'size--auto': this.size === 'auto',
          'size--sm': this.size === 'sm',
          'size--md': this.size === 'md',
          'size--lg': this.size === 'lg',
          'single-line': this._isSingleLine,
          'multi-line': !this._isSingleLine,
        })}"
      >
        <pre
          tabindex="0"
          @keydown="${this.handleKeyDown}"
          role="region"
          aria-label=${this._isSingleLine
            ? 'Code block'
            : 'Code block, use arrow keys to scroll'}
        ><code class="language-${this.language}">${unsafeHTML(
          this._highlightedCode
        )}</code></pre>

        <div style="display: none;">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>

        ${this.copyOptionVisible
          ? html`<kd-button
              class="code-view__copy-button"
              kind="primary-web"
              title=${this.copyButtonTitleAttr}
              name=${this.copyButtonDescriptionAttr}
              description=${this.copyButtonDescriptionAttr}
              size="small"
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
            </kd-button>`
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

  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._slotContent = slot
      .assignedNodes()
      .map((node) => node.textContent?.trim())
      .join('');
    this.highlightCode();
  }

  private highlightCode() {
    if (this._slotContent) {
      this._codeContent = this._slotContent;
      this.isSingleLineCode(this._codeContent);
      this._highlightedCode = Prism.highlight(
        this._codeContent,
        Prism.languages[this.language],
        this.language
      );
    } else {
      this._highlightedCode = '';
    }

    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-block-code-view': BlockCodeView;
  }
}
