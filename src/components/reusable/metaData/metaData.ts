import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './metaData.scss?inline';
/**
 * MetaData component.
 * @slot icon - Slot for icon.
 * @slot label - Slot for label.
 * @slot unnamed - Slot for other content.
 */
@customElement('kyn-meta-data')
export class MetaData extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Horizontal orientation. */
  @property({ type: Boolean })
  accessor horizontal = false;

  /** No background. */
  @property({ type: Boolean })
  accessor noBackground = false;

  /** Adds scrollable overflow to the slot content. */
  @property({ type: Boolean })
  accessor scrollableContent = false;

  /** Determine the icon slot has content.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  accessor iconSlotItems!: Array<HTMLElement>;

  /** Determine the icon slot has content.
   * @ignore
   */
  @queryAssignedElements({ slot: 'label' })
  accessor labelSlotItems!: Array<HTMLElement>;

  /** Determine the icon slot has content.
   * @ignore
   */
  @state()
  private accessor hasIcon = false;

  /** Determine the label slot has content.
   * @internal
   */
  @state()
  private accessor hasLabel = false;

  override render() {
    const metaContainer = {
      'meta-container': true,
      'no-background': this.noBackground,
    };
    const metaIcon = {
      'meta-icon': true,
      displayEle: !this.hasIcon,
    };
    const metaWrapper = {
      'meta-wrapper': true,
      'horizontal-align': this.horizontal,
    };
    const metaLabel = {
      'meta-label': true,
      displayEle: !this.hasLabel,
    };
    const metaValue = {
      'meta-value': true,
      scrollable: this.scrollableContent,
    };
    return html`
      <div class="${classMap(metaContainer)}">
        <div class="${classMap(metaIcon)}">
          <slot name="icon" @slotchange=${() => this.onIconSlotChange()}></slot>
        </div>
        ${this.hasIcon ? html` <div class="spacer"></div> ` : null}
        <div class="${classMap(metaWrapper)}">
          <div class="${classMap(metaLabel)}">
            <slot
              name="label"
              @slotchange=${() => this.onLabelSlotChange()}
            ></slot>
          </div>
          <div class="${classMap(metaValue)}">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  private onIconSlotChange() {
    this.hasIcon = this.iconSlotItems.length > 0;
  }

  private onLabelSlotChange() {
    this.hasLabel = this.labelSlotItems.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-meta-data': MetaData;
  }
}
