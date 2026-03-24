import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import DividerScss from './divider.scss?inline';

/**
 * Divider Component.
 */
@customElement('kyn-divider')
export class Divider extends LitElement {
  static override styles = unsafeCSS(DividerScss);

  /** Vertical orientation. <br><i>Note:</i> Vertical divider will span the full height of its container. */
  @property({ type: Boolean, reflect: true })
  accessor vertical = false;

  /**
   * When used with `vertical`, shows a centered drag grip and widens the hit area for split views.
   * Resize behavior is provided by the parent layout (for example the Split View pattern).
   */
  @property({ type: Boolean, reflect: true })
  accessor dragHandle = false;

  /** Accessible name when `dragHandle` is true (resize affordance). */
  @property({ type: String })
  accessor resizeLabel = 'Resize panels';

  /** Visual pressed state while the parent is dragging (optional). */
  @property({ type: Boolean, reflect: true })
  accessor dragging = false;

  /**
   * When using `drag-handle`, set to hide the internal hairline so a parent (e.g. split-view
   * track) can paint the line in the light DOM for reliable visibility.
   */
  @property({ type: Boolean, reflect: true })
  accessor hideHairline = false;

  override render() {
    const vertical = this.vertical;
    const showHandle = vertical && this.dragHandle;
    const hideHairline = showHandle && this.hideHairline;
    return html`
      <div
        role="separator"
        aria-orientation=${vertical ? 'vertical' : 'horizontal'}
        aria-label=${ifDefined(showHandle ? this.resizeLabel : undefined)}
        class="divider ${vertical ? 'vertical' : 'horizontal'} ${showHandle
          ? 'has-drag-handle'
          : ''} ${hideHairline ? 'hide-hairline' : ''}"
      >
        ${showHandle
          ? html`
              <div
                class="drag-handle ${this.dragging ? 'dragging' : ''}"
                aria-hidden="true"
              >
                <span class="drag-lines"></span>
              </div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-divider': Divider;
  }
}
