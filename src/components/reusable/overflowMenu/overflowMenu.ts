import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SCSS from './overflowMenu.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import overflowIcon from '@carbon/icons/es/overflow-menu--horizontal/16';

/**
 * Overflow Menu.
 * @slot unnamed - Slot for overflow menu items.
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

  /** Button assistive text.. */
  @property({ type: String })
  assistiveText = 'Toggle Menu';

  /** Queries for slotted menu items.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-overflow-menu-item' })
  menuItems!: any;

  /**
   * A generated unique id
   * @ignore
   */
  @state() private _id = crypto.randomUUID();

  override render() {
    const buttonClasses = {
      btn: true,
      open: this.open,
    };

    const menuClasses = {
      menu: true,
      open: this.open,
      right: this.anchorRight,
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

  private toggleMenu() {
    this.open = !this.open;
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
