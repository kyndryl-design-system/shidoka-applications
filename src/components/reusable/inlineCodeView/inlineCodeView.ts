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

  /** Optional dark theme boolean to toggle theme between light/dark */
  @property({ type: Boolean })
  darkTheme = false;

  override render() {
    return html`
      <code
        class="${classMap({
          'inline-code-view': true,
          'shidoka-dark-syntax-theme': this.darkTheme,
          'shidoka-light-syntax-theme': !this.darkTheme,
        })}"
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
