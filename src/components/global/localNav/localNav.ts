import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import LocalNavScss from './localNav.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import openIcon from '@carbon/icons/es/side-panel--open/24';
import closeIcon from '@carbon/icons/es/side-panel--close/24';
import menuIcon from '@carbon/icons/es/menu/20';
import xIcon from '@carbon/icons/es/close/20';

/**
 * The global Side Navigation component.
 * @slot unnamed - The default slot, for local nav links.
 * @fires on-toggle - Captures the click event and emits the pinned state and original event details.
 */
@customElement('kyn-local-nav')
export class LocalNav extends LitElement {
  static override styles = LocalNavScss;

  /** Local nav pinned state. */
  @property({ type: Boolean })
  accessor pinned = false;

  /** Pin open button assistive text. */
  @property({ type: String })
  accessor pinText = 'Pin open';

  /** Unpin button assistive text. */
  @property({ type: String })
  accessor unpinText = 'Unpin';

  /** Local nav expanded state.
   * @internal
   */
  @state()
  accessor _expanded = false;

  /** Queries top-level slotted links links.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-local-nav-link' })
  accessor _navLinks!: any;

  override render() {
    return html`
      <nav
        class=${classMap({ 'nav--expanded': this._expanded || this.pinned })}
        @mouseenter=${this.handleMouseenter}
        @mouseleave=${this.handleMouseleave}
      >
        <ul>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </ul>

        <div class="toggle-container">
          <button
            class="nav-toggle"
            @click=${(e: Event) => this.onNavToggle(e)}
            title="${this.pinned ? this.unpinText : this.pinText}"
            aria-label="${this.pinned ? this.unpinText : this.pinText}"
          >
            <kd-icon .icon=${this.pinned ? closeIcon : openIcon}></kd-icon>
          </button>
        </div>
      </nav>

      <button class="mobile-toggle" @click=${(e: Event) => this.onNavToggle(e)}>
        <kd-icon .icon=${this.pinned ? xIcon : menuIcon}></kd-icon>
      </button>
    `;
  }

  private onNavToggle(e: Event) {
    this.pinned = !this.pinned;

    const event = new CustomEvent('on-toggle', {
      detail: { pinned: this.pinned, origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private handleMouseenter() {
    this._expanded = true;
  }

  private handleMouseleave() {
    this._expanded = false;
  }

  private updateChildren() {
    this._navLinks.forEach((link: any) => {
      link._navExpanded = this._expanded || this.pinned;
    });
  }

  private handleSlotChange() {
    this.updateChildren();
    this.requestUpdate();
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('_expanded') || changedProps.has('pinned')) {
      this.updateChildren();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav': LocalNav;
  }
}
