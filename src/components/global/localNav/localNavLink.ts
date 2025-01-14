import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import LocalNavLinkScss from './localNavLink.scss';

import backIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';
import addIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import subtractIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/substract-simple.svg';

/**
 * Link component for use in the global Side Navigation component.
 * @fires on-click - Captures the click event and emits the original event, level, and if default was prevented.
 * @slot unnamed - The default slot, for the link text.
 * @slot icon - Slot for an icon. Use 16px size.
 * @slot links - Slot for the next level of links, supports three levels.
 */
@customElement('kyn-local-nav-link')
export class LocalNavLink extends LitElement {
  static override styles = LocalNavLinkScss;

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Expanded state. */
  @property({ type: Boolean })
  expanded = false;

  /** Active state. */
  @property({ type: Boolean, reflect: true })
  active = false;

  /** Disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Text for mobile "Back" button. */
  @property({ type: String })
  backText = 'Back';

  /** Link level, supports three levels.
   * @ignore
   */
  @state()
  _level = 1;

  /** The local nav desktop expanded state.
   * @internal
   */
  @state()
  _navExpanded = false;

  /** The local nav mobile expanded state.
   * @internal
   */
  @state()
  _navExpandedMobile = false;

  /** The slotted text.
   * @internal
   */
  @state()
  _text = '';

  /**
   * Queries slotted links.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links', selector: 'kyn-local-nav-link' })
  _navLinks!: Array<any>;

  /**
   * Queries slotted dividers.
   * @ignore
   */
  @queryAssignedElements({ slot: 'links', selector: 'kyn-local-nav-divider' })
  _dividers!: Array<any>;

  /**
   * Queries slotted icon.
   * @ignore
   */
  @queryAssignedElements({ slot: 'icon' })
  _icon!: Array<any>;

  override render() {
    const classes = {
      link: true,
      'top-level': this._level === 1,
      'sub-level': this._level > 1,
      'nav-expanded': this._navExpanded || this._navExpandedMobile,
      'link-expanded': this.expanded,
      'link-active': this.active,
      'link-disabled': this.disabled,
      'has-links': this._navLinks.length,
      'has-icon': this._icon.length,
    };

    return html`
      <div class=${classMap(classes)}>
        <a href=${this.href} @click=${(e: Event) => this.handleClick(e)}>
          ${this._navLinks.length
            ? html`
                <span class="expand-icon">
                  ${this.expanded
                    ? unsafeSVG(subtractIcon)
                    : unsafeSVG(addIcon)}
                </span>
              `
            : null}

          <slot name="icon"></slot>

          <span class="text">
            <slot @slotchange=${this._handleTextSlotChange}></slot>
          </span>
        </a>

        <div class="sub-menu">
          ${this._navLinks.length
            ? html`
                <button class="go-back" @click=${() => this._handleBack()}>
                  ${unsafeSVG(backIcon)} ${this.backText}
                </button>
              `
            : null}

          <div class="category">${this._text}</div>

          <slot name="links" @slotchange=${this._handleLinksSlotChange}></slot>
        </div>
      </div>
    `;
  }

  override willUpdate(changedProps: any) {
    if (changedProps.has('_navExpanded')) {
      this.updateChildren();
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('active') && this.active) {
      this._getSlotText();

      const event = new CustomEvent('on-link-active', {
        composed: true,
        bubbles: true,
        detail: {
          text: this._text,
        },
      });
      this.dispatchEvent(event);
    }
  }

  private _handleTextSlotChange() {
    this._getSlotText();
    this.requestUpdate();
  }

  private _getSlotText() {
    const Slot: any = this.shadowRoot?.querySelector('.text slot');
    let text = '';

    const nodes = Slot.assignedNodes({
      flatten: true,
    });

    for (let i = 0; i < nodes.length; i++) {
      text += nodes[i].textContent.trim();
    }

    this._text = text;
  }

  private _handleLinksSlotChange() {
    this.updateChildren();
    this.requestUpdate();
  }

  private updateChildren() {
    this._navLinks.forEach((link: any) => {
      link._level = this._level + 1;
      link._navExpanded = this._navExpanded;
    });

    this._dividers.forEach((divider: any) => {
      divider._navExpanded = this._navExpanded;
    });
  }

  private _handleBack() {
    this.expanded = false;
  }

  private handleClick(e: Event) {
    let preventDefault = false;

    if (this.disabled) {
      preventDefault = true;
    }

    if (this._navLinks.length) {
      preventDefault = true;
      this.expanded = !this.expanded;
    }

    if (preventDefault) {
      e.preventDefault();
    }

    this.requestUpdate();

    const event = new CustomEvent('on-click', {
      detail: {
        origEvent: e,
        level: this._level,
        defaultPrevented: preventDefault,
      },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-local-nav-link': LocalNavLink;
  }
}
