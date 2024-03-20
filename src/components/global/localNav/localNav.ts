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

import arrowIcon from '@carbon/icons/es/chevron--down/16';

/**
 * The global Side Navigation component.
 * @slot unnamed - The default slot, for local nav links.
 * @fires on-toggle - Captures the click event and emits the open state and original event details.
 */
@customElement('kyn-local-nav')
export class LocalNav extends LitElement {
  static override styles = LocalNavScss;

  /** Menu toggle button assistive text. */
  @property({ type: Object })
  accessor textStrings = {
    toggleMenu: 'Toggle Menu',
    collapse: 'Collapse',
  };

  /** Local nav expanded state.
   * @internal
   */
  @state()
  accessor _expanded = false;

  /** Active Link text.
   * @internal
   */
  @state()
  accessor _activeLinkText!: string;

  /** Queries top-level slotted links.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-local-nav-link' })
  accessor _navLinks!: any;

  /** Timeout function to delay modal close.
   * @internal
   */
  @state()
  accessor timer: any;

  override render() {
    return html`
      <nav
        class=${classMap({ 'nav--expanded': this._expanded })}
        @pointerleave=${(e: PointerEvent) => this.handlePointerLeave(e)}
        @pointerenter=${(e: PointerEvent) => this.handlePointerEnter(e)}
      >
        <button
          class="mobile-toggle"
          title=${this.textStrings.toggleMenu}
          aria-label=${this.textStrings.toggleMenu}
          @click=${(e: Event) => this._handleNavToggle(e)}
        >
          ${this._expanded ? this.textStrings.collapse : this._activeLinkText}
          <kd-icon .icon=${arrowIcon}></kd-icon>
        </button>

        <ul>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </ul>
      </nav>
    `;
  }

  private _handleNavToggle(e: Event) {
    this._expanded = !this._expanded;

    const event = new CustomEvent('on-toggle', {
      detail: { open: this._expanded, pinned: this._expanded, origEvent: e },
    });
    this.dispatchEvent(event);
  }

  private handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      clearTimeout(this.timer);
      this._expanded = true;
    }
  }

  private handlePointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && document.activeElement !== this) {
      this.timer = setTimeout(() => {
        this._expanded = false;
        clearTimeout(this.timer);
      }, 300);
    }
  }

  private _updateChildren() {
    this._navLinks.forEach((link: any) => {
      link._navExpanded = this._expanded;
    });
  }

  private handleSlotChange() {
    this._updateChildren();
    this._setActiveLinkText();
    this.requestUpdate();
  }

  private _setActiveLinkText() {
    const Link: any = this.querySelector('kyn-local-nav-link[active]');
    let text = '';

    if (Link?.shadowRoot?.querySelector('.text slot')) {
      const nodes = Link.shadowRoot.querySelector('.text slot')?.assignedNodes({
        flatten: true,
      });

      for (let i = 0; i < nodes.length; i++) {
        text += nodes[i].textContent.trim();
      }
    }

    this._activeLinkText = text;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('_expanded')) {
      this._updateChildren();
    }
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this._expanded = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this._handleClickOut(e));
    this.addEventListener('on-click', () => this._setActiveLinkText());
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this._handleClickOut(e));
    this.removeEventListener('on-click', () => this._setActiveLinkText());

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav': LocalNav;
  }
}
