import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  /** Horizontal orientation. Default is `false` */
  @property({ type: Boolean })
  accessor horizontal = false;

  /** No background. Default is `false` */
  @property({ type: Boolean })
  accessor noBackground = false;

  /** Adds scrollable overflow to the slot content. Default is `false` */
  @property({ type: Boolean })
  accessor scrollableContent = false;

  /** Determine the icon slot has content.
   * @internal
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
          <div
            class="${classMap(metaValue)}"
            tabindex=${this.scrollableContent ? '0' : '-1'}
          >
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    this.hasIcon =
      this.iconSlot?.assignedElements({ flatten: true }).length > 0;
    this.hasLabel =
      this.labelSlot?.assignedElements({ flatten: true }).length > 0;
  }

  private onIconSlotChange() {
    this.hasIcon =
      this.iconSlot?.assignedElements({ flatten: true }).length > 0;
  }

  private onLabelSlotChange() {
    this.hasLabel =
      this.labelSlot?.assignedElements({ flatten: true }).length > 0;
  }

  /** Determine the icon slot content.
   * @ignore
   */
  private get iconSlot(): HTMLSlotElement {
    return this.shadowRoot!.querySelector(
      'slot[name="icon"]'
    )! as HTMLSlotElement;
  }

  /** Determine the label slot content.
   * @ignore
   */
  private get labelSlot(): HTMLSlotElement {
    return this.shadowRoot!.querySelector(
      'slot[name="label"]'
    )! as HTMLSlotElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-meta-data': MetaData;
  }
}
