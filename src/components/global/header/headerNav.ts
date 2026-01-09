import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS, type PropertyValueMap } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
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

  /** Mutation observer for attribute changes.
   * @internal
   */
  private _attrObserver?: MutationObserver;

  /** Bound document click handler to allow proper add/remove of listener
   * @internal
   */
  private _boundHandleClickOut = (e: Event) => this._handleClickOut(e);

  /** @internal */
  @query('slot')
  accessor _defaultSlot!: HTMLSlotElement;

  /** @internal */
  private get _isDesktop(): boolean {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 672;
  }

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

  private _updateCategoriesVisibility(): void {
    const links = this.querySelectorAll<HTMLElement>('kyn-header-link');

    const hasOpenCategory = Array.from(links).some((link) => {
      return link.hasAttribute('open') || link.hasAttribute('isactive');
    });

    const hasCategoriesElement = this._defaultSlot
      ?.assignedElements({ flatten: true })
      .some((el) => el.querySelector?.('kyn-header-categories'));

    const nextHasCategories = hasOpenCategory || hasCategoriesElement;

    if (this.hasCategories !== nextHasCategories) {
      this.hasCategories = nextHasCategories;
    }
  }

  /**
   * Determine whether the active link's categorical menu (mega nav) is open initially. Only applies on desktop; mobile should start collapsed and require explicit interaction.
   */
  private _ensureActiveMegaExpanded() {
    if (!this.expandActiveMegaOnLoad || !this._isDesktop) return;

    const links = Array.from(
      this.querySelectorAll<
        HTMLElement & { open?: boolean; isActive?: boolean }
      >('kyn-header-link')
    );

    if (!links.length) return;

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
    this._ensureActiveMegaExpanded();
    this._updateCategoriesVisibility();
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.menuOpen = false;
    }
  }

  protected override firstUpdated(_changed: PropertyValueMap<this>): void {
    this._ensureActiveMegaExpanded();
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
      childList: true,
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
