import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import UiShellScss from './uiShell.scss?inline';

type LocalNavLike = HTMLElement & {
  pinned?: boolean;
  manualToggleVariant?: boolean;
};

/**
 * Container to help with positioning and padding of the global elements such as: adds padding for the fixed Header and Local Nav, adds main content gutters, and makes Footer sticky. This takes the onus off of the consuming app to configure these values.
 * @slot unnamed - Slot for global elements.
 */
@customElement('kyn-ui-shell')
export class UiShell extends LitElement {
  static override styles = unsafeCSS(UiShellScss);

  /** @ignore */
  private _observedLocalNav: LocalNavLike | null = null;

  /** @ignore */
  private readonly _onLocalNavToggle = () => {
    this._syncLayout();
  };

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-header' })
  accessor _headerEl!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-local-nav' })
  accessor _localNavEl!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-footer' })
  accessor _footerEl!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'main' })
  accessor _mainEl!: any;

  override render() {
    return html` <slot @slotchange=${this._handleSlotChange}></slot> `;
  }

  override firstUpdated() {
    this._bindLocalNavListeners();
    this._syncLayout();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._mainEl[0]?.classList.add('transitions-ready');
        this._footerEl[0]?.classList.add('transitions-ready');
      });
    });
  }

  override disconnectedCallback() {
    this._cleanupLocalNavListeners();
    super.disconnectedCallback();
  }

  /** @ignore */
  private _handleSlotChange() {
    this._bindLocalNavListeners();
    this._syncLayout();
    this.requestUpdate();
  }

  /** @ignore */
  private _bindLocalNavListeners() {
    const localNav = this._getLocalNav();
    if (this._observedLocalNav === localNav) {
      return;
    }

    this._cleanupLocalNavListeners();

    if (!localNav) {
      return;
    }

    this._observedLocalNav = localNav;
    localNav.addEventListener('on-toggle', this._onLocalNavToggle);
  }

  /** @ignore */
  private _cleanupLocalNavListeners() {
    this._observedLocalNav?.removeEventListener(
      'on-toggle',
      this._onLocalNavToggle
    );
    this._observedLocalNav = null;
  }

  /** @ignore */
  private _syncLayout() {
    const main = this._mainEl[0];
    const footer = this._footerEl[0];
    const localNav = this._getLocalNav();
    const hasLocalNav = !!localNav;
    const pinned = !!localNav?.pinned;
    const manualToggleVariant = !!localNav?.manualToggleVariant;

    main?.classList.toggle('has-local-nav', hasLocalNav);
    main?.classList.toggle('pinned', pinned);
    main?.classList.toggle(
      'manual-toggle-variant',
      hasLocalNav && manualToggleVariant
    );
    footer?.classList.toggle('has-local-nav', hasLocalNav);
    footer?.classList.toggle('pinned', pinned);
    footer?.classList.toggle(
      'manual-toggle-variant',
      hasLocalNav && manualToggleVariant
    );
  }

  /** @ignore */
  private _getLocalNav(): LocalNavLike | null {
    return this._localNavEl?.[0] ?? null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ui-shell': UiShell;
  }
}
