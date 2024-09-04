import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';

import Prism from 'prismjs';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import copyIcon from '@carbon/icons/es/copy/20';

import CodeViewStyles from './codeView.scss';

/**
 * Code view component.
 * @fires copy - Emits when the copy button is clicked.
 * @slot unnamed - Slot for custom copy button.
 */
@customElement('kyn-code-view')
export class CodeView extends LitElement {
  static override styles = CodeViewStyles;

  /** Code view size: `sm`, `md`, or `lg`. */
  @property({ type: String, reflect: true })
  size = 'md';

  /** Language: `javascript`, `css`, `scss`, `json`, `html`, `xml`, `markdown` */
  @property({ type: String, reflect: true })
  language = '';

  /** Title for code view. */
  @property({ type: String })
  override title = '';

  /** Label for code view accessibility */
  @property({ type: String })
  label = '';

  /** Code view type: `inline`or `block`. */
  @property({ type: String, reflect: true })
  type: 'inline' | 'block' = 'inline';

  /** Copy code option available for user: true/false. */
  @property({ type: Boolean, reflect: true })
  copyOptionVisible = true;

  /** The code content to display and copy. */
  @property({ type: String })
  code = '';

  @state()
  private _highlightedCode = '';

  copyCode() {
    console.log('Copying code:', this.code);
    navigator.clipboard
      .writeText(this.code)
      .then(() =>
        this.dispatchEvent(new CustomEvent('copy', { detail: 'Code copied!' }))
      )
      .catch((err) => console.error('Failed to copy code:', err));
  }

  override updated(changedProperties: PropertyValues) {
    console.log('CONNECTED');
    if (changedProperties.has('language') || changedProperties.has('code')) {
      this.highlightCode();
    }
  }

  private highlightCode() {
    if (this.code && this.language) {
      const grammar = Prism.languages[this.language];
      if (grammar) {
        this._highlightedCode = Prism.highlight(
          this.code,
          grammar,
          this.language
        );
      } else {
        this._highlightedCode = this.code;
      }
    } else {
      this._highlightedCode = this.code;
    }
  }

  override render() {
    return html`
      ${this.title
        ? html`<div class="code-view__title">
            <h3 class="kd-type--headline-02">${this.title}</h3>
          </div>`
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
        })}"
      >
        <pre><code class="language-${this.language}">${unsafeHTML(
          this._highlightedCode
        )}</code></pre>
        ${this.copyOptionVisible && this.type === 'block'
          ? html`<slot name="copy-button">
              <kd-button
                class="code-view__copy-button"
                slot="actions"
                kind="primary-app"
                size="small"
                iconPosition="left"
                @click=${this.copyCode}
              >
                <kd-icon slot="icon" .icon=${copyIcon}></kd-icon>
                <span class="copy-text">Copy</span>
              </kd-button>
            </slot>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-code-view': CodeView;
  }
}
