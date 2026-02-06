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

  /** When true (default), flyouts auto-close on mouse leave and remain collapsed until user interaction (original behavior).
   * When false, the first categorical link's flyout auto-opens when the nav opens, and flyouts stay open on mouse leave.
   */
  @property({ type: Boolean })
  accessor flyoutAutoCollapsed = true;

  /** Boolean value reflecting whether the navigation has categories.
   * @internal
   */
  @state()
  accessor hasCategories = false;

  /** Mutation observer for attribute changes.
   * @internal
   */
  private _attrObserver?: MutationObserver;

  /** Tracks whether auto-open has already been triggered to prevent multiple triggers.
   * @internal
   */
  private _autoOpenTriggered = false;

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

    // Trigger auto-open when slot content changes (handles late-loading content)
    if (
      !this.flyoutAutoCollapsed &&
      this._isDesktop &&
      !this._autoOpenTriggered
    ) {
      this._autoOpenFirstCategoricalLink();
    }
  }

  private _handleClickOut(e: Event) {
    if (!e.composedPath().includes(this)) {
      this.menuOpen = false;
    }
  }

  protected override firstUpdated(_changed: PropertyValueMap<this>): void {
    this._updateCategoriesVisibility();

    // Auto-open first categorical link on initial render when flyoutAutoCollapsed is false.
    // This handles the case where the nav is already visible (desktop) without a menuOpen toggle.
    if (!this.flyoutAutoCollapsed && this._isDesktop) {
      this._autoOpenFirstCategoricalLink();
    }
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

      // Reset auto-open flag when nav closes so it can re-trigger on next open
      if (!this.menuOpen) {
        this._autoOpenTriggered = false;
      }
    }
  }

  /** Auto-open the first header link that contains categorical nav
   * @internal
   */
  private _autoOpenFirstCategoricalLink(): void {
    // Use setTimeout to ensure all components are fully initialized
    // This needs to run after document click handlers have finished
    setTimeout(() => {
      const links = this.querySelectorAll<HTMLElement & { open?: boolean }>(
        ':scope > kyn-header-link'
      );

      for (const link of links) {
        // Auto-open only if this link contains categorical nav
        // Check both light DOM (querySelector) and shadow DOM (querySelectorDeep)
        // (kyn-header-categories for JSON-driven, kyn-header-category for slotted)
        const hasCategoricalNav =
          link.querySelector('kyn-header-categories') !== null ||
          querySelectorDeep('kyn-header-categories', link) !== null;
        const hasSlottedCategory =
          link.querySelector('kyn-header-category') !== null ||
          querySelectorDeep('kyn-header-category', link) !== null;

        if (hasCategoricalNav || hasSlottedCategory) {
          link.open = true;
          this._autoOpenTriggered = true;
          break;
        }
      }
    }, 100);
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
