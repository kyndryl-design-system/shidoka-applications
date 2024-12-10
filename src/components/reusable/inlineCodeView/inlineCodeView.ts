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
  darkTheme: 'light' | 'dark' | 'default' = 'default';

  /** Font size value (px) to match code snippet font-size of surrounding text (min, default 14px). */
  @property({ type: Number })
  snippetFontSize = 14;

  override render() {
    return html`
      <code
        class="${classMap({
          'inline-code-view': true,
          'shidoka-dark-syntax-theme': this._effectiveTheme === 'dark',
          'shidoka-light-syntax-theme': this._effectiveTheme === 'light',
        })}"
        style="--inline-snippet-font-size: ${this.snippetFontSize};"
      >
        <slot></slot>
      </code>
    `;
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('darkTheme')) {
      this._syncColorScheme();
    }
    super.updated(changedProperties);
  }

  private get _colorSchemeMeta(): HTMLMetaElement | null {
    return document.querySelector('meta[name="color-scheme"]');
  }

  private get _effectiveTheme(): 'light' | 'dark' {
    if (this.darkTheme !== 'default') {
      return this.darkTheme;
    }
    return this._colorSchemeMeta?.getAttribute('content') === 'dark'
      ? 'dark'
      : 'light';
  }

  private _syncColorScheme() {
    if (this.darkTheme === 'default') {
      if (this._colorSchemeMeta) {
        const scheme = this._colorSchemeMeta.getAttribute('content');
        if (scheme !== 'light' && scheme !== 'dark') {
          console.warn('Invalid color-scheme value:', scheme);
        }
      }
    } else {
      if (this._colorSchemeMeta) {
        this._colorSchemeMeta.setAttribute('content', this.darkTheme);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'color-scheme');
        meta.setAttribute('content', this.darkTheme);
        document.head.appendChild(meta);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-inline-code-view': InlineCodeView;
  }
}
