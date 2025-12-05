import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS, type PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import HeaderNavScss from './headerNav.scss?inline';

import menuIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/hamburger-menu.svg';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-simple.svg';

/**
 * Container for header navigation links.
 * @slot unnamed - This element has a slot.
 */
@customElement('kyn-header-nav')
export class HeaderNav extends LitElement {
  static override styles = unsafeCSS(HeaderNavScss);

  /** Small screen header nav visibility.
   * @ignore
   */
  @state()
  accessor menuOpen = false;

  /** Force correct slot */
  @property({ type: String, reflect: true })
  override accessor slot = 'left';

  /** Boolean value reflecting whether the navigation has categories. */
  @state()
  accessor hasCategories = false;

  /**
   * When true, the nav will automatically expand the active link's
   * categorical menu (mega nav) on first render (desktop) / once the menu is opened
   * (mobile). This does not affect `menuOpen`.
   */
  @property({ type: Boolean, reflect: true })
  accessor expandActiveMegaOnLoad = false;

  /** Mutation observer for attribute changes. */
  private _attrObserver?: MutationObserver;

  /** Bound document click handler to allow proper add/remove of listener */
  private _boundHandleClickOut = (e: Event) => this._handleClickOut(e);

  override render() {
    const classes = {
      'header-nav': true,
      menu: true,
      open: this.menuOpen,
    };

    const menuContentClasses = {
      menu__content: true,
      left: true,
      'categories-open': this.hasCategories,
    };

    return html`
      <div class=${classMap(classes)}>
        <button
          class="btn interactive"
          aria-label="Toggle Menu"
          title="Toggle Menu"
          @click=${() => this._toggleMenuOpen()}
        >
          ${this.menuOpen
            ? html`<span>${unsafeSVG(closeIcon)}</span>`
            : html`<span>${unsafeSVG(menuIcon)}</span>`}
        </button>

        <div class=${classMap(menuContentClasses)}>
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _toggleMenuOpen() {
    this.menuOpen = !this.menuOpen;
  }

  private _updateCategoriesVisibility() {
    const links = this.querySelectorAll<HTMLElement & { isActive?: boolean }>(
      'kyn-header-link'
    );

    const next = Array.from(links).some(
      (link) => link.hasAttribute('open') || (link as any).isActive
    );

    if (this.hasCategories !== next) {
      this.hasCategories = next;
    }
  }

  /**
   * Determine whether the active link's categorical menu (mega nav) is open when user clicks hamburger (depends on expandActiveMegaOnLoad value).
   */
  private _expandActiveMegaOnce() {
    if (!this.expandActiveMegaOnLoad) return;

    const links = Array.from(
      this.querySelectorAll<
        HTMLElement & { open?: boolean; isActive?: boolean }
      >('kyn-header-link')
    );

    if (!links.length) return;

    // explicity isactive link set by dev
    let activeLink = links.find((link) => link.hasAttribute('isactive'));

    // fallback: first link that owns mega content (slot="links")
    if (!activeLink) {
      activeLink = links.find((link) => link.querySelector('[slot="links"]'));
    }

    if (!activeLink) return;

    links.forEach((link) => {
      const shouldBeOpen = link === activeLink;

      link.toggleAttribute('open', shouldBeOpen);

      if ('open' in link) {
        (link as any).open = shouldBeOpen;
      }

      if (shouldBeOpen) {
        link.setAttribute('isactive', '');
      } else {
        link.removeAttribute('isactive');
      }
    });
  }

  private _handleSlotChange() {
    this._expandActiveMegaOnce();
    this._updateCategoriesVisibility();
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.menuOpen = false;
    }
  }

  protected override firstUpdated(_changed: PropertyValueMap<this>): void {
    this._expandActiveMegaOnce();
    this._updateCategoriesVisibility();
  }

  override willUpdate(changedProps: PropertyValueMap<this>): void {
    if (changedProps.has('menuOpen')) {
      const detail = { open: this.menuOpen };

      this.dispatchEvent(
        new CustomEvent('on-nav-toggle', {
          composed: true,
          bubbles: true,
          detail,
        })
      );

      // dispatch to document for other components to listen
      this.ownerDocument?.dispatchEvent(
        new CustomEvent('on-nav-toggle', { detail })
      );
    }
  }

  override updated(changedProps: PropertyValueMap<this>): void {
    if (changedProps.has('hasCategories')) {
      this.classList.toggle('categories-open', this.hasCategories);
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener('click', this._boundHandleClickOut);

    this._attrObserver = new MutationObserver(() => {
      this._updateCategoriesVisibility();
    });

    this._attrObserver.observe(this, {
      attributes: true,
      subtree: true,
      attributeFilter: ['open'],
    });
  }

  override disconnectedCallback(): void {
    document.removeEventListener('click', this._boundHandleClickOut);

    if (this._attrObserver) {
      this._attrObserver.disconnect();
      this._attrObserver = undefined;
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-nav': HeaderNav;
  }
}
