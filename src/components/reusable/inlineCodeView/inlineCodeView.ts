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

  /** Optional dark theme boolean (light/dark background and contrasting text) */
  @property({ type: Boolean })
  darkTheme = false;

  /** Font size value (px) to match code snippet font-size with surrounding text */
  @property({ type: Number })
  snippetFontSize = 14;

  override render() {
    return html`
      <code
        class="${classMap({
          'inline-code-view': true,
          'shidoka-dark-syntax-theme': this.darkTheme,
          'shidoka-light-syntax-theme': !this.darkTheme,
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
