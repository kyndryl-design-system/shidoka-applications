import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import UiShellScss from './uiShell.scss?inline';

type LocalNavLike = HTMLElement & {
  pinned?: boolean;
  updateComplete?: Promise<unknown>;
};

const DESKTOP_BREAKPOINT = 672;
const PINNED_SPACE_CSS_VAR = '--kd-ui-shell-local-nav-pinned-space';
const MANUAL_EXPANDED_WIDTH_CSS_VAR = '--_local-nav-manual-expanded-width';

/**
 * Container to help with positioning and padding of the global elements such as: adds padding for the fixed Header and Local Nav, adds main content gutters, and makes Footer sticky. This takes the onus off of the consuming app to configure these values.
 * @slot unnamed - Slot for global elements.
 */
@customElement('kyn-ui-shell')
export class UiShell extends LitElement {
  static override styles = unsafeCSS(UiShellScss);

  /** @ignore */
  private _localNavResizeObserver: ResizeObserver | null = null;

  /** @ignore */
  private _observedLocalNav: LocalNavLike | null = null;

  /** @ignore */
  private _pinnedSpacingSyncFrame: number | null = null;

  /** @ignore */
  private readonly _onLocalNavToggle = () => {
    this._syncLayout({ syncPinnedSpacingImmediately: true });
  };

  /** @ignore */
  private readonly _onWindowResize = () => {
    this._queuePinnedSpacingSync();
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
    window.addEventListener('resize', this._onWindowResize);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._mainEl[0]?.classList.add('transitions-ready');
        this._footerEl[0]?.classList.add('transitions-ready');
      });
    });
  }

  override disconnectedCallback() {
    this._cleanupLocalNavListeners();
    this._clearPinnedSpacing();
    if (this._pinnedSpacingSyncFrame !== null) {
      cancelAnimationFrame(this._pinnedSpacingSyncFrame);
      this._pinnedSpacingSyncFrame = null;
    }
    window.removeEventListener('resize', this._onWindowResize);
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

    const navEl = this._getLocalNavPanel(localNav);
    if (navEl && 'ResizeObserver' in window) {
      this._localNavResizeObserver = new ResizeObserver(() => {
        this._queuePinnedSpacingSync();
      });
      this._localNavResizeObserver.observe(navEl);
    }

    if (localNav.updateComplete) {
      void localNav.updateComplete.then(() => {
        this._syncLayout();
      });
    }
  }

  /** @ignore */
  private _cleanupLocalNavListeners() {
    this._observedLocalNav?.removeEventListener(
      'on-toggle',
      this._onLocalNavToggle
    );
    this._localNavResizeObserver?.disconnect();
    this._localNavResizeObserver = null;
    this._observedLocalNav = null;
  }

  /** @ignore */
  private _syncLayout(options?: { syncPinnedSpacingImmediately?: boolean }) {
    const main = this._mainEl[0];
    const footer = this._footerEl[0];
    const localNav = this._getLocalNav();
    const hasLocalNav = !!localNav;
    const pinned = !!localNav?.pinned;

    main?.classList.toggle('has-local-nav', hasLocalNav);
    main?.classList.toggle('pinned', pinned);
    footer?.classList.toggle('has-local-nav', hasLocalNav);
    footer?.classList.toggle('pinned', pinned);

    if (!hasLocalNav) {
      this._clearPinnedSpacing();
      return;
    }

    if (options?.syncPinnedSpacingImmediately) {
      this._syncPinnedSpacing();
      return;
    }

    this._queuePinnedSpacingSync();
  }

  /** @ignore */
  private _queuePinnedSpacingSync() {
    if (this._pinnedSpacingSyncFrame !== null) {
      cancelAnimationFrame(this._pinnedSpacingSyncFrame);
    }

    this._pinnedSpacingSyncFrame = requestAnimationFrame(() => {
      this._pinnedSpacingSyncFrame = null;
      this._syncPinnedSpacing();
    });
  }

  /** @ignore */
  private _syncPinnedSpacing() {
    const pinnedSpace = this._getPinnedSpacingOverride();
    if (pinnedSpace === null) {
      this._clearPinnedSpacing();
      return;
    }

    this._getLayoutTargets().forEach((element) => {
      element.style.setProperty(PINNED_SPACE_CSS_VAR, `${pinnedSpace}px`);
    });
  }

  /** @ignore */
  private _clearPinnedSpacing() {
    this._getLayoutTargets().forEach((element) => {
      element.style.removeProperty(PINNED_SPACE_CSS_VAR);
    });
  }

  /** @ignore */
  private _getPinnedSpacingOverride(): number | null {
    const localNav = this._getLocalNav();
    if (!localNav?.pinned || window.innerWidth < DESKTOP_BREAKPOINT) {
      return null;
    }

    const navEl = this._getLocalNavPanel(localNav);
    if (!navEl) {
      return null;
    }

    const navRect = navEl.getBoundingClientRect();
    if (!navRect.width) {
      return null;
    }

    const targetExpandedWidth = this._measurePinnedTargetWidth(localNav, navEl);
    const expandedReservedSpace = this._measureCssLength(
      'var(--kd-local-nav-expanded-reserved-space)'
    );
    const expandedWidth = this._measureCssLength(
      'var(--kd-local-nav-width-expanded)'
    );

    if (
      targetExpandedWidth === null ||
      expandedReservedSpace === null ||
      expandedWidth === null
    ) {
      return null;
    }

    const gutter = Math.max(
      expandedReservedSpace - navRect.left - expandedWidth,
      0
    );
    const pinnedSpace = Math.ceil(navRect.left + targetExpandedWidth + gutter);

    return Math.abs(pinnedSpace - expandedReservedSpace) <= 1
      ? null
      : pinnedSpace;
  }

  /** @ignore */
  private _getLocalNavPanel(localNav: LocalNavLike): HTMLElement | null {
    return localNav.shadowRoot?.querySelector('nav') ?? null;
  }

  /** @ignore */
  private _getLocalNav(): LocalNavLike | null {
    return this._localNavEl?.[0] ?? null;
  }

  /** @ignore */
  private _measurePinnedTargetWidth(
    localNav: LocalNavLike,
    navEl: HTMLElement
  ): number | null {
    const hostExpandedWidth = Number.parseFloat(
      getComputedStyle(localNav).getPropertyValue(MANUAL_EXPANDED_WIDTH_CSS_VAR)
    );

    if (!Number.isNaN(hostExpandedWidth) && hostExpandedWidth > 0) {
      return hostExpandedWidth;
    }

    const navWidth = Number.parseFloat(getComputedStyle(navEl).width);
    if (!Number.isNaN(navWidth) && navWidth > 0) {
      return navWidth;
    }

    return this._measureCssLength('var(--kd-local-nav-width-expanded)');
  }

  /** @ignore */
  private _getLayoutTargets(): HTMLElement[] {
    return [this._mainEl?.[0], this._footerEl?.[0]].filter(
      Boolean
    ) as HTMLElement[];
  }

  /** @ignore */
  private _measureCssLength(value: string): number | null {
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.width = value;
    document.body.appendChild(probe);

    const width = Number.parseFloat(getComputedStyle(probe).width);
    probe.remove();

    return Number.isNaN(width) ? null : width;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ui-shell': UiShell;
  }
}
