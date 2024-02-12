import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
  query,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenu.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import overflowIcon from '@carbon/icons/es/overflow-menu--horizontal/16';

/**
 * Overflow Menu.
 * @slot unnamed - Slot for overflow menu items.
 * @fires on-toggle - Capture the open/close event and emits the new state.
 */
@customElement('kyn-overflow-menu')
export class OverflowMenu extends LitElement {
  static override styles = SCSS;

  /** Menu open state. */
  @property({ type: Boolean })
  open = false;

  /** Anchors the menu to the right of the button. */
  @property({ type: Boolean })
  anchorRight = false;

  /** 3 dots vertical orientation. */
  @property({ type: Boolean })
  verticalDots = false;

  /** Use fixed instead of absolute position. Useful when placed within elements with overflow scroll. */
  @property({ type: Boolean })
  fixed = false;

  /** Button assistive text.. */
  @property({ type: String })
  assistiveText = 'Toggle Menu';

  /** Queries for slotted menu items.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-overflow-menu-item' })
  menuItems!: any;

  @query('.btn')
  _btnEl!: any;

  @query('.menu')
  _menuEl!: any;

  /**
   * A generated unique id
   * @ignore
   */
  @state() private _id = crypto.randomUUID();

  override render() {
    const buttonClasses = {
      btn: true,
      open: this.open,
      vertical: this.verticalDots,
    };

    const menuClasses = {
      menu: true,
      open: this.open,
      right: this.anchorRight,
      fixed: this.fixed,
    };

    return html`
      <div class="overflow-menu">
        <button
          class=${classMap(buttonClasses)}
          @click=${this.toggleMenu}
          aria-controls=${this._id}
          aria-expanded=${this.open}
          title=${this.assistiveText}
          aria-label=${this.assistiveText}
        >
          <kd-icon .icon=${overflowIcon}></kd-icon>
        </button>

        <div id=${this._id} class=${classMap(menuClasses)}>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _emitToggleEvent() {
    const event = new CustomEvent('on-toggle', {
      detail: {
        open: this.open,
      },
    });
    this.dispatchEvent(event);
  }

  private toggleMenu() {
    this.open = !this.open;
    this._emitToggleEvent();

    // set menu position on open
    if (this.open) {
      if (this.fixed) {
        const Top =
          this._btnEl.getBoundingClientRect().top +
          this._btnEl.getBoundingClientRect().height;
        const MenuHeight = this.menuItems.length * 48;

        if (Top + MenuHeight > window.innerHeight) {
          this._menuEl.style.top = 'initial';
          this._menuEl.style.bottom = '0px';
        } else {
          this._menuEl.style.top = Top + 'px';
          this._menuEl.style.bottom = 'initial';
        }
      } else {
        this._menuEl.style.top = 'initial';
      }
    }
  }

  private handleSlotChange() {
    this.menuItems.forEach((item: any) => {
      item.anchorRight = this.anchorRight;
    });
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('anchorRight')) {
      this.menuItems.forEach((item: any) => {
        item.anchorRight = this.anchorRight;
      });
    }
  }

  private handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.open = false;
      this._emitToggleEvent();
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', (e) => this.handleClickOut(e));
  }

  override disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleClickOut(e));

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-menu': OverflowMenu;
  }
}
