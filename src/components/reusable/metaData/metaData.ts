import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Styles from './metaData.scss?inline';
/**
 * MetaData component.
 * @slot unnamed - Slot for other content.
 * @slot icon - Slot for icon.
 */
@customElement('kyn-meta-data')
export class MetaData extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Label text. */
  @property({ type: String })
  accessor labelText = '';

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

  override render() {
    const metaContainer = {
      'meta-container': true,
      'no-background': this.noBackground,
    };
    const metaIcon = {
      'meta-icon': true,
      'vertical-icon-align': !this.horizontal,
    };
    const metaWrapper = {
      'meta-wrapper': true,
      'horizontal-align': this.horizontal,
    };
    const metaLabel = {
      'meta-label': true,
    };
    const metaValue = {
      'meta-value': true,
      scrollable: this.scrollableContent,
    };
    return html`
      <div class="${classMap(metaContainer)}">
        <div
          class="${classMap(metaIcon)}"
          style=${!this.hasIcon ? 'display: none;' : ''}
        >
          <slot name="icon" @slotchange=${() => this.onIconSlotChange()}></slot>
        </div>
        ${this.hasIcon ? html` <div class="spacer"></div> ` : null}
        <div class="${classMap(metaWrapper)}">
          ${this.labelText !== '' || this.iconSlot?.assignedElements().length
            ? html`
                <div class="${classMap(metaLabel)}">${this.labelText}</div>
              `
            : null}
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
  }

  private onIconSlotChange() {
    this.hasIcon =
      this.iconSlot?.assignedElements({ flatten: true }).length > 0;
  }

  private get iconSlot(): HTMLSlotElement {
    return this.shadowRoot!.querySelector(
      'slot[name="icon"]'
    )! as HTMLSlotElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-meta-data': MetaData;
  }
}
