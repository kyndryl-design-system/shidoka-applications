import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { deepmerge } from 'deepmerge-ts';

import WorkspaceSwitcherScss from './workspaceSwitcher.scss?inline';

import './workspaceSwitcherMenuItem';
import type { WorkspaceSwitcherMenuItem } from './workspaceSwitcherMenuItem';
import '../../reusable/link';
import { LINK_TARGETS } from '../../reusable/link/defs';

import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark.svg';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import accountsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/accounts.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';

const _defaultTextStrings = {
  currentTitle: 'CURRENT',
  workspacesTitle: 'WORKSPACES',
  backToWorkspaces: 'Workspaces',
  launchAssistiveText: 'Opens in a new tab',
};

export interface WorkspaceSwitcherAccountMetaItem {
  text: string;
  href?: string;
  target?: LINK_TARGETS;
  rel?: string;
  actionIcon?: 'copy' | 'launch';
  copyValue?: string;
}

export interface WorkspaceSwitcherAccountMeta {
  name: string;
  items?: WorkspaceSwitcherAccountMetaItem[];
}

type MobilePresentationDetail = {
  buttonIconSvg?: string;
  summaryIconSvg?: string;
  summaryLabel?: string;
  summaryDetails?: WorkspaceSwitcherAccountMetaItem[];
  mobileLabel?: string;
  hideButtonContentOnMobile?: boolean;
};

const _mobilePresentationEvent = 'kyn-internal-flyout-mobile-presentation';

type HeaderFlyoutHost = HTMLElement;

/**
 * Workspace Switcher shell component providing two-panel layout with mobile drill-down.
 * Component fits to 100% of the width and height of its container and surfaces two panels for content composition via slots.
 * Consumers compose workspace and account rows via named slots using
 * sub-components like `kyn-workspace-switcher-menu-item`.
 * The account meta block can also be provided via the `accountMeta` property,
 * which renders the preferred rigid built-in pattern.
 * @slot left - Legacy non-list content for the left panel when `accountMeta` is not used. Prefer `accountMeta`; this slot is maintained for backward compatibility.
 * @slot left-list - List items for the left panel (rendered inside role="list").
 * @slot mobile-trigger-icon - Optional icon override for the mobile flyout trigger. Provide an inline SVG or wrapper that contains one.
 * @slot account-status-icon - Optional icon override for the current account status indicator used by the built-in account meta block and mobile summary. Provide an inline SVG or wrapper that contains one.
 * @slot right - Non-list content for the right panel (e.g. search).
 * @slot right-list - List items for the right panel (rendered inside role="list").
 * @fires on-account-meta-copy - Emits when a copy-style account meta action is activated.
 * @cssprop [--kyn-workspace-switcher-max-height=none] - Maximum height of the switcher panel.
 * @cssprop [--kyn-workspace-switcher-left-panel-width=275px] - Width of the left panel in desktop two-panel layout.
 */
@customElement('kyn-workspace-switcher')
export class WorkspaceSwitcher extends LitElement {
  static override styles = unsafeCSS(WorkspaceSwitcherScss);

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = _defaultTextStrings;

  /** Built-in account meta content for the left panel. */
  @property({ attribute: false })
  accessor accountMeta: WorkspaceSwitcherAccountMeta | null = null;

  /** Mobile drill-down view state. 'root' shows left panel, 'detail' shows right panel.
   * @internal
   */
  @property({ type: String, reflect: true })
  accessor view: 'root' | 'detail' = 'root';

  /** Hides the heading above the account meta info. */
  @property({ type: Boolean, reflect: true })
  accessor hideCurrentTitle = false;

  /** Hides the heading above the lower left-hand side list. Example: suppress for accounts-only customers. */
  @property({ type: Boolean, reflect: true })
  accessor hideWorkspacesTitle = false;

  /** Hides the divider beneath the `left` slot content. */
  @property({ type: Boolean, reflect: true, attribute: 'hide-left-divider' })
  accessor hideLeftDivider = false;

  /** Merged text strings.
   * @internal
   */
  @state()
  private accessor _textStrings = _defaultTextStrings;

  /** Tracks whether legacy left-slot content is present. */
  @state()
  private accessor _hasLegacyLeftSlotContent = false;

  /** Tracks which copy-style account meta item is showing success feedback. */
  @state()
  private accessor _copiedAccountMetaIndex: number | null = null;

  /**
   * The nearest flyout host, if any.
   * @internal
   */
  private _flyoutHost: HeaderFlyoutHost | null = null;

  /**
   * Clears transient copy feedback after a short delay.
   * @internal
   */
  private _copyFeedbackTimeout: number | null = null;

  /**
   * Watches for legacy slot usage changes.
   * @internal
   */
  private _lightDomObserver: MutationObserver | null = null;

  /**
   * Ensures legacy slot guidance only logs once per host instance.
   * @internal
   */
  private _hasWarnedAboutLegacyLeftSlot = false;

  /**
   * Ensures conflicting input guidance only logs once per host instance.
   * @internal
   */
  private _hasWarnedAboutLeftSlotConflict = false;

  /**
   * @internal
   */
  private _handleFlyoutToggle = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (!detail?.open) {
      this.view = 'root';
    }
  };

  /**
   * Re-syncs the parent flyout when icon slot assignments change.
   * @internal
   */
  private _handleMobileIconSlotChange = () => {
    this._syncFlyoutHostMobilePresentation();
  };

  override connectedCallback() {
    super.connectedCallback();
    this._updateLegacyLeftSlotState();
    this._lightDomObserver = new MutationObserver(() =>
      this._updateLegacyLeftSlotState()
    );
    this._lightDomObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ['slot'],
    });
    this._flyoutHost = this.closest(
      'kyn-header-flyout'
    ) as HeaderFlyoutHost | null;
    this._flyoutHost?.addEventListener(
      'on-flyout-toggle',
      this._handleFlyoutToggle as EventListener
    );
    this._syncFlyoutHostMobilePresentation();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._flyoutHost?.removeEventListener(
      'on-flyout-toggle',
      this._handleFlyoutToggle as EventListener
    );
    this._clearFlyoutHostMobilePresentation();
    this._clearCopyFeedback();
    this._lightDomObserver?.disconnect();
    this._lightDomObserver = null;
    this._flyoutHost = null;
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('textStrings')) {
      this._textStrings = deepmerge(_defaultTextStrings, this.textStrings);
    }

    if (changedProperties.has('accountMeta')) {
      this._clearCopyFeedback();
      this._warnForLegacyLeftSlotUsage();
    }
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('textStrings')) {
      this._updateChildMenuItemTextStrings();
    }

    if (
      changedProperties.has('textStrings') ||
      changedProperties.has('accountMeta')
    ) {
      this._syncFlyoutHostMobilePresentation();
    }
  }

  override render() {
    const showLeftHeader =
      this.accountMeta != null || this._hasLegacyLeftSlotContent;

    return html`
      <div hidden aria-hidden="true">
        <slot
          name="mobile-trigger-icon"
          @slotchange=${this._handleMobileIconSlotChange}
        ></slot>
      </div>
      <div class="workspace-switcher">
        <div class="workspace-switcher__left">
          ${!this.hideCurrentTitle
            ? html`<span class="workspace-switcher__title"
                >${this._textStrings.currentTitle}</span
              >`
            : null}
          ${showLeftHeader
            ? html`
                <div class="workspace-switcher__left-header">
                  ${this.accountMeta
                    ? this._renderAccountMeta()
                    : html`<slot name="left"></slot>`}
                </div>
              `
            : null}
          ${!this.hideWorkspacesTitle
            ? html`<span class="workspace-switcher__title"
                >${this._textStrings.workspacesTitle}</span
              >`
            : null}
          <div class="workspace-switcher__list" role="list">
            <slot name="left-list"></slot>
          </div>
        </div>
        <div class="workspace-switcher__right">
          <kyn-workspace-switcher-menu-item
            class="workspace-switcher__back"
            variant="back"
            name=${this._textStrings.backToWorkspaces}
            @on-click=${this._handleBackClick}
          ></kyn-workspace-switcher-menu-item>
          <slot name="right"></slot>
          <div class="workspace-switcher__list" role="list">
            <slot name="right-list"></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _handleBackClick() {
    this.view = 'root';
  }

  private _updateLegacyLeftSlotState() {
    this._hasLegacyLeftSlotContent = Array.from(this.children).some(
      (child) => child.getAttribute('slot') === 'left'
    );
    this._updateChildMenuItemTextStrings();
    this._warnForLegacyLeftSlotUsage();
    this._syncFlyoutHostMobilePresentation();
  }

  private _updateChildMenuItemTextStrings() {
    const menuItemTextStrings = {
      launchAssistiveText: this._textStrings.launchAssistiveText,
    };

    this.querySelectorAll<WorkspaceSwitcherMenuItem>(
      'kyn-workspace-switcher-menu-item'
    ).forEach((item) => {
      item.textStrings = menuItemTextStrings;
    });
  }

  private _syncFlyoutHostMobilePresentation() {
    this._emitFlyoutHostMobilePresentation({
      buttonIconSvg: this._getMobilePresentationIconSvg(
        'mobile-trigger-icon',
        accountsIcon
      ),
      summaryIconSvg: this.accountMeta?.name
        ? this._getMobilePresentationIconSvg(
            'account-status-icon',
            checkmarkFilledIcon
          )
        : '',
      summaryLabel: this.accountMeta?.name ?? '',
      summaryDetails:
        this.accountMeta?.items
          ?.filter((item) => !!item.text?.trim())
          .slice(0, 2) ?? [],
      mobileLabel: this._textStrings.backToWorkspaces,
      hideButtonContentOnMobile: true,
    });
  }

  private _clearFlyoutHostMobilePresentation() {
    this._emitFlyoutHostMobilePresentation();
  }

  private _emitFlyoutHostMobilePresentation(
    detail: MobilePresentationDetail = {}
  ) {
    this._flyoutHost?.dispatchEvent(
      new CustomEvent(_mobilePresentationEvent, {
        detail,
      })
    );
  }

  private _getMobilePresentationIconSvg(
    slotName: 'mobile-trigger-icon' | 'account-status-icon',
    fallbackSvg = ''
  ) {
    const assignedIconHost = Array.from(this.children).find(
      (child) => child.getAttribute('slot') === slotName
    );

    if (!assignedIconHost) return fallbackSvg;

    const iconNode =
      assignedIconHost.tagName.toLowerCase() === 'svg'
        ? assignedIconHost
        : assignedIconHost.querySelector('svg');

    if (iconNode?.outerHTML.trim().startsWith('<svg')) {
      return iconNode.outerHTML;
    }

    return fallbackSvg;
  }

  private _warnForLegacyLeftSlotUsage() {
    if (!this._hasLegacyLeftSlotContent || typeof console === 'undefined')
      return;

    if (this.accountMeta && !this._hasWarnedAboutLeftSlotConflict) {
      console.warn(
        '[kyn-workspace-switcher] `accountMeta` overrides legacy `slot="left"` content. Remove the slot content or migrate fully to `accountMeta`.'
      );
      this._hasWarnedAboutLeftSlotConflict = true;
      return;
    }

    if (!this.accountMeta && !this._hasWarnedAboutLegacyLeftSlot) {
      console.warn(
        '[kyn-workspace-switcher] `slot="left"` is a legacy API. Prefer the `accountMeta` property for rigid account meta rendering.'
      );
      this._hasWarnedAboutLegacyLeftSlot = true;
    }
  }

  private _renderAccountMeta() {
    if (!this.accountMeta) return null;

    return html`
      <div class="workspace-switcher__account-meta">
        <span
          class="workspace-switcher__account-meta-status"
          aria-hidden="true"
        >
          <slot
            name="account-status-icon"
            @slotchange=${this._handleMobileIconSlotChange}
            >${unsafeSVG(checkmarkFilledIcon)}</slot
          >
        </span>
        <div class="workspace-switcher__account-meta-content">
          <span
            class="workspace-switcher__account-meta-name"
            title=${this.accountMeta.name}
          >
            ${this.accountMeta.name}
          </span>
          ${this.accountMeta.items?.map((item, index) =>
            this._renderAccountMetaItem(item, index)
          )}
        </div>
      </div>
    `;
  }

  private _renderAccountMetaItem(
    item: WorkspaceSwitcherAccountMetaItem,
    index: number
  ) {
    const icon =
      item.actionIcon === 'copy'
        ? this._copiedAccountMetaIndex === index
          ? checkmarkIcon
          : copyIcon
        : item.actionIcon === 'launch'
        ? launchIcon
        : null;

    if (item.href || item.actionIcon === 'copy') {
      const target = item.target ?? LINK_TARGETS.SELF;
      const rel =
        item.rel ?? (target === '_blank' ? 'noopener noreferrer' : '');

      return html`
        <kyn-link
          class="workspace-switcher__account-meta-link"
          standalone
          animationInactive
          href=${item.href || 'javascript:void(0)'}
          target=${target}
          rel=${rel}
          @on-click=${(e: CustomEvent) =>
            this._handleAccountMetaItemClick(e, item, index)}
        >
          ${item.text}
          ${icon
            ? html`
                <span
                  slot="icon"
                  class="workspace-switcher__account-meta-link-icon"
                >
                  ${unsafeSVG(icon)}
                </span>
              `
            : null}
        </kyn-link>
      `;
    }

    return html`
      <span class="workspace-switcher__account-meta-item">${item.text}</span>
    `;
  }

  private async _handleAccountMetaItemClick(
    e: CustomEvent,
    item: WorkspaceSwitcherAccountMetaItem,
    index: number
  ) {
    if (item.actionIcon !== 'copy') return;

    const copyValue = item.copyValue ?? item.text;
    const origEvent = e.detail?.origEvent as Event | undefined;

    origEvent?.preventDefault();
    const clipboard = globalThis.navigator?.clipboard;

    try {
      await clipboard?.writeText(copyValue);
      this._showCopyFeedback(index);
    } catch {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('on-account-meta-copy', {
        detail: { index, text: item.text, value: copyValue, success: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _showCopyFeedback(index: number) {
    this._copiedAccountMetaIndex = index;

    if (this._copyFeedbackTimeout != null) {
      window.clearTimeout(this._copyFeedbackTimeout);
    }

    this._copyFeedbackTimeout = window.setTimeout(() => {
      this._copiedAccountMetaIndex = null;
      this._copyFeedbackTimeout = null;
    }, 3000);
  }

  private _clearCopyFeedback() {
    this._copiedAccountMetaIndex = null;

    if (this._copyFeedbackTimeout != null) {
      window.clearTimeout(this._copyFeedbackTimeout);
      this._copyFeedbackTimeout = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-workspace-switcher': WorkspaceSwitcher;
  }
}
