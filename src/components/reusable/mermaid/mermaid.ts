import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import mermaid from 'mermaid';
import {
  getTokenThemeVal,
  getColorScheme,
  getPreferredColorScheme,
} from '@kyndryl-design-system/shidoka-foundation/common/helpers/color';
import Styles from './mermaid.scss?inline';

import { monochrome24 } from '@kyndryl-design-system/shidoka-icons';

/**
 * Mermaid diagram.
 * @slot unnamed - Slot for mermaid markdown/diagram definition.
 */
@customElement('kyn-mermaid')
export class MermaidDiagram extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Mermaid configuration object. */
  @property({ type: Object })
  accessor mermaidConfig = {};

  /** Container element query for rendering the mermaid diagram.
   * @internal */
  @query('#kyn-mermaid-container')
  private accessor _container!: HTMLDivElement;

  /** Observer that re-renders when slotted text content mutates.
   * @internal
   */
  private _slotObserver = new MutationObserver(() => this._renderDiagram());

  /** Theme observer to watch for meta color-scheme changes.
   * @internal
   */
  _themeObserver: any = new MutationObserver((mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'content'
      ) {
        const newValue = (mutation.target as HTMLMetaElement).content;
        const oldValue = mutation.oldValue;

        if (newValue !== oldValue) {
          this._renderDiagram();
          break;
        }
      }
    }
  });

  override render() {
    return html`
      <div id="kyn-mermaid-container"></div>
      <slot @slotchange=${this._handleSlotChange} style="display:none"></slot>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    // connect the theme change observer
    try {
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta instanceof Node) {
        this._themeObserver.observe(meta, {
          attributes: true,
          attributeFilter: ['content'], // only watch the content attribute
          attributeOldValue: true, // enables mutation.oldValue
        });
      }
    } catch (error) {
      console.warn('Failed to set up theme observer:', error);
    }
  }

  override disconnectedCallback() {
    this._slotObserver.disconnect();
    this._themeObserver.disconnect();

    super.disconnectedCallback();
  }

  private _handleSlotChange() {
    // Re-observe the (possibly new) assigned nodes for text mutations.
    this._slotObserver.disconnect();

    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    if (slot) {
      slot.assignedNodes({ flatten: true }).forEach((node) => {
        this._slotObserver.observe(node, {
          characterData: true,
          childList: true,
          subtree: true,
        });
      });
    }

    this._renderDiagram();
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    mermaid.registerIconPacks([
      {
        name: monochrome24.prefix,
        icons: monochrome24,
      },
      // {
      //   name: duotone64.prefix,
      //   icons: duotone64,
      // },
    ]);
  }

  override updated(changedProperties: Map<string, unknown>) {
    // re-render diagram when config is changed
    if (changedProperties.has('mermaidConfig')) {
      this._renderDiagram();
    }
  }

  /**
   * Build mermaid themeVariables from the active Shidoka design tokens.
   * Uses `theme: 'base'` so every variable is respected.
   * Any token that fails to resolve is omitted so mermaid uses its own default.
   */
  private _getThemeVariables(): Record<string, string> {
    // get current color theme
    let darkTheme = 'false';
    if (getColorScheme() === 'light dark') {
      if (getPreferredColorScheme() === 'dark') {
        darkTheme = 'true';
      } else {
        darkTheme = 'false';
      }
    } else if (getColorScheme() === 'dark') {
      darkTheme = 'true';
    } else {
      darkTheme = 'false';
    }

    const raw: Record<string, string> = {
      darkMode: darkTheme,

      // typography
      fontFamily: 'Roboto',
      fontSize: '14px',

      // primary nodes
      primaryColor: getTokenThemeVal('--kd-color-background-container-default'),
      primaryTextColor: getTokenThemeVal('--kd-color-text-level-primary'),
      primaryBorderColor: getTokenThemeVal(
        '--kd-color-background-container-default'
      ),

      // secondary nodes
      secondaryColor: getTokenThemeVal(
        '--kd-color-background-container-secondary'
      ),
      // secondaryTextColor: getTokenThemeVal('--kd-color-text-level-primary'),
      secondaryBorderColor: getTokenThemeVal(
        '--kd-color-background-container-secondary'
      ),

      // tertiary nodes
      tertiaryColor: getTokenThemeVal(
        '--kd-color-background-container-tertiary'
      ),
      // tertiaryTextColor: getTokenThemeVal('--kd-color-text-level-primary'),
      tertiaryBorderColor: getTokenThemeVal(
        '--kd-color-background-container-tertiary'
      ),

      // text / lines
      // textColor: getTokenThemeVal('--kd-color-text-level-primary'),
      lineColor: getTokenThemeVal('--kd-color-border-level-secondary'),

      // flowchart
      edgeLabelBackground: getTokenThemeVal(
        '--kd-color-background-container-secondary'
      ),
    };

    // Remove entries that failed to resolve so mermaid uses its own defaults
    // instead of receiving an empty string and throwing.
    return Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== ''));
  }

  // Render the mermaid diagram based on the slotted text content and current theme.
  private async _renderDiagram() {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    if (!slot || !this._container) return;

    const text = slot
      .assignedNodes({ flatten: true })
      .map((n) => n.textContent)
      .join('')
      .trim();

    if (!text) return;

    try {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose', // allow html in labels for icons
        theme: 'base',
        themeVariables: this._getThemeVariables(),
        architecture: {
          iconSize: 64,
        },
        ...this.mermaidConfig,
      });

      const id = `kyn-mermaid-svg`;
      const { svg } = await mermaid.render(id, text);
      this._container.innerHTML = svg;
    } catch (e) {
      console.error('[kyn-mermaid] render error:', e);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-mermaid': MermaidDiagram;
  }
}
