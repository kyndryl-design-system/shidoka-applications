import { html, LitElement, unsafeCSS } from 'lit';

import { BlockCodeView } from '../../components/reusable/blockCodeView/blockCodeView';

let blockCodeFlushCss = '';

/**
 * Registers `<split-view-code-rail>` with host shadow CSS from the story file. `flushBlockCss`
 * is applied to the slotted `kyn-block-code-view` shadow root (story-only flush rail).
 */
export function registerSplitViewCodeRail(
  hostShadowCss: string,
  flushBlockCss: string
) {
  blockCodeFlushCss = flushBlockCss;
  if (customElements.get('split-view-code-rail')) return;

  class SplitViewCodeRail extends LitElement {
    static override styles = unsafeCSS(hostShadowCss);

    override connectedCallback() {
      super.connectedCallback();
      queueMicrotask(() => this._onSlotContent());
    }

    private async _onSlotContent() {
      const view = this.querySelector(
        'kyn-block-code-view'
      ) as BlockCodeView | null;
      if (!view) return;
      await view.updateComplete;
      this._applyFlushRailShadowStyles(view);
      /* Keep maxHeight unset so flex + blockFlush CSS can fill the rail. */
      view.maxHeight = null;
    }

    private _applyFlushRailShadowStyles(view: BlockCodeView) {
      const el = view as BlockCodeView & { _splitViewCodeRailStyles?: boolean };
      if (el._splitViewCodeRailStyles || !blockCodeFlushCss.trim()) return;
      const root = view.shadowRoot;
      if (!root) return;

      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(blockCodeFlushCss);
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
        el._splitViewCodeRailStyles = true;
      } catch {
        /* adoptedStyleSheets unsupported */
      }
    }

    override firstUpdated() {
      this._onSlotContent();
    }

    override render() {
      return html`<slot @slotchange=${() => this._onSlotContent()}></slot>`;
    }
  }

  customElements.define('split-view-code-rail', SplitViewCodeRail);
}
