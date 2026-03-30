import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import splitViewCodeRailCss from './splitViewCodeRail.scss?inline';

/**
 * Lightweight rail wrapper for pane-3 content.
 *
 * Keeps split-view layout concerns local to this host and does not mutate child component
 * internals.
 */
@customElement('split-view-code-rail')
export class SplitViewCodeRail extends LitElement {
  static override styles = unsafeCSS(splitViewCodeRailCss);

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'split-view-code-rail': SplitViewCodeRail;
  }
}
