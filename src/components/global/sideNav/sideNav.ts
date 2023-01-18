import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SideNavScss from './sideNav.scss';
import '../../../components/reusable/icon';

import chevRightIcon from '@carbon/icons/es/chevron--right/24';

/**
 * The global Side Navigation component.
 * @slot unnamed - The default slot, for side nav links.
 * @fires on-toggle - Captures the click event and emits the collapsed state and original event details.
 */
@customElement('kyn-side-nav')
export class SideNav extends LitElement {
  static override styles = SideNavScss;

  /** Side nav collapsed state. */
  @property({ type: Boolean })
  collapsed = false;

  override render() {
    return html`
      <nav class=${classMap({ 'nav--collapsed': this.collapsed })}>
        <ul>
          <slot></slot>
        </ul>

        <button
          class=${classMap({
            'nav-toggle': true,
            'nav-toggle--collapsed': this.collapsed,
          })}
          @click=${(e: Event) => this.onNavToggle(e)}
        >
          <kyn-icon .icon=${chevRightIcon}></kyn-icon>
        </button>
      </nav>
    `;
  }

  private onNavToggle(e: Event) {
    this.collapsed = !this.collapsed;

    const event = new CustomEvent('on-toggle', {
      detail: { collapsed: this.collapsed, origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-side-nav': SideNav;
  }
}
