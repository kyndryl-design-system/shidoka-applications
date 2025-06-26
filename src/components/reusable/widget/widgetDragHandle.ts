import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './widgetDragHandle.scss?inline';

import dragIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/draggable.svg';

/**
 * Widget drag handle.
 */
@customElement('kyn-widget-drag-handle')
export class WidgetDragHandle extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Force widget slot */
  @property({ type: String, reflect: true })
  override accessor slot = 'draghandle';

  override render() {
    return html`
      <div class="drag-handle">
        <span>${unsafeSVG(dragIcon)}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-widget-drag-handle': WidgetDragHandle;
  }
}
