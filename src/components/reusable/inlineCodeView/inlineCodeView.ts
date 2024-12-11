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

  private _colorSchemeObserver: MutationObserver | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._observeColorScheme();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._colorSchemeObserver?.disconnect();
  }

  private _observeColorScheme() {
    const meta = this._colorSchemeMeta;
    if (meta) {
      this._colorSchemeObserver = new MutationObserver(() => {
        this.requestUpdate();
      });
      this._colorSchemeObserver.observe(meta, { attributes: true });
    }
  }

  private get _colorSchemeMeta(): HTMLMetaElement | null {
    return document.querySelector('meta[name="color-scheme"]');
  }

  private get _effectiveTheme(): 'light' | 'dark' {
    this._initPrefersColorSchemeListener();
    if (this.darkTheme !== 'default') {
      return this.darkTheme;
    }
    const metaScheme = this._colorSchemeMeta?.getAttribute('content');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark || metaScheme === 'dark' ? 'dark' : 'light';
  }

  private _initPrefersColorSchemeListener() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (event) => {
      const newColorScheme = event.matches ? 'dark' : 'light';
      console.log({ newColorScheme });
      this.darkTheme = newColorScheme;
      this.requestUpdate();
    });
  }

  override render() {
    const theme = this._effectiveTheme;
    return html`
      <code
        class="${classMap({
          'inline-code-view': true,
          'shidoka-dark-syntax-theme': theme === 'dark',
          'shidoka-light-syntax-theme': theme === 'light',
        })}"
        style="--inline-snippet-font-size: ${this
          .snippetFontSize}; --color-scheme: ${theme};"
      >
        <slot></slot>
      </code>
    `;
  }
}
