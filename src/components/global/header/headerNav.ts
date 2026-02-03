import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS, type PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from 'query-selector-shadow-dom';
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

  /** Force correct slot
   * @internal
   */
  @property({ type: String, reflect: true })
  override accessor slot = 'left';

  /** when false (default), the first link's flyout automatically opens when the nav opens,
   * and flyouts don't auto-close on mouse leave.
   * when true, flyouts remain collapsed until user interaction.
   */
  @property({ type: Boolean })
  accessor flyoutAutoCollapsed = false;

  /** Boolean value reflecting whether the navigation has categories.
   * @internal
   */
  @state()
  accessor hasCategories = false;

  /** Mutation observer for attribute changes.
   * @internal
   */
  private _attrObserver?: MutationObserver;

  /** Bound document click handler to allow proper add/remove of listener
   * @internal
   */
  private _boundHandleClickOut = (e: Event) => this._handleClickOut(e);

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
    const links = querySelectorAllDeep('kyn-header-link', this);

    const hasOpenCategory = Array.from(links).some((link) => {
      return link.hasAttribute('open') || link.hasAttribute('isactive');
    });

    const hasCategoriesElement = Boolean(
      querySelectorDeep('kyn-header-categories', this)
    );

    const nextHasCategories = hasOpenCategory || hasCategoriesElement;

    if (this.hasCategories !== nextHasCategories) {
      this.hasCategories = nextHasCategories;
    }
  }

  private _handleSlotChange() {
    this._updateCategoriesVisibility();
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.menuOpen = false;
    }
  }

  protected override firstUpdated(_changed: PropertyValueMap<this>): void {
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

      // Auto-open first link's flyout when nav opens and flyoutAutoCollapsed is false
      // Only applies to categorical nav (when kyn-header-categories is present)
      if (this.menuOpen && !this.flyoutAutoCollapsed && this._isDesktop) {
        this._autoOpenFirstCategoricalLink();
      }
    }
  }

  /** Auto-open the first header link that contains categorical nav or slotted links
   * @internal
   */
  private _autoOpenFirstCategoricalLink(): void {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const links = this.querySelectorAll<HTMLElement & { open?: boolean }>(
        ':scope > kyn-header-link'
      );

      for (const link of links) {
        // Auto-open if this link contains kyn-header-categories (JSON-driven categorical nav)
        // OR kyn-header-category (slotted categorical nav)
        // OR has slotted links content
        const hasCategoricalNav =
          link.querySelector('kyn-header-categories') !== null;
        const hasSlottedCategory =
          link.querySelector('kyn-header-category') !== null;
        const hasSlottedLinks = link.querySelector('[slot="links"]') !== null;

        if (hasCategoricalNav || hasSlottedCategory || hasSlottedLinks) {
          link.open = true;
          break;
        }
      }
    });
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
