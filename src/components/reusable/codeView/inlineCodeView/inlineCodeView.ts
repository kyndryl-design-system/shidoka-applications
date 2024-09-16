import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import InlineCodeViewStyles from './inlineCodeView.scss';

/**
 * `<kyn-inline-code-view>` component to display code snippets inline within HTML content.
 * @slot unnamed - inline code snippet slot.
 */ @customElement('kyn-inline-code-view')
export class InlineCodeView extends LitElement {
  static override styles = InlineCodeViewStyles;

  /** Sets background and text theming. */
  @property({ type: String })
  darkTheme: 'light' | 'dark' = 'dark';

  /** Font size value (px) to match code snippet font-size of surrounding text (min, default 14px). */
  @property({ type: Number })
  snippetFontSize = 14;

  override render() {
    return html`
      <code
        class="${classMap({
          'inline-code-view': true,
          'shidoka-dark-syntax-theme': this.darkTheme === 'dark',
          'shidoka-light-syntax-theme': this.darkTheme === 'light',
        })}"
        style="--inline-snippet-font-size: ${this.snippetFontSize};"
      >
        <slot></slot>
      </code>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-inline-code-view': InlineCodeView;
  }
}
