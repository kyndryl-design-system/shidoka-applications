import { html, render } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { action } from 'storybook/actions';

import '../../components/global/header';
import '../../components/reusable/link';
import '../../components/reusable/search';
import '../../components/reusable/iconSelector';

import exampleData from './example_workspace_switcher_data.json';

import accountsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/accounts.svg';
import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark.svg';
import copyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/copy.svg';
import userAvatarIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import chevronDownIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import circleIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-stroke.svg';
import filledNotificationIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/notifications-new.svg';
import arrowLeftIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/arrow-left.svg';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import launchIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/launch.svg';
import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';

const DEFAULT_TEXT_STRINGS = {
  currentTitle: 'CURRENT',
  workspacesTitle: 'WORKSPACES',
  backToWorkspaces: 'Workspaces',
  launchAssistiveText: 'Opens in a new tab',
};

const MOBILE_PRESENTATION_EVENT = 'kyn-internal-flyout-mobile-presentation';
const LEFT_PANEL_WIDTH = '275px';
const boundFlyouts = new WeakSet();
const patternHostByFlyout = new WeakMap();

const PATTERN_STYLES = /* css */ `
  .workspace-switcher-host {
    display: block;
    --workspace-switcher-left-panel-width: ${LEFT_PANEL_WIDTH};
    --workspace-switcher-max-height: none;
  }

  .workspace-switcher-host,
  .workspace-switcher-host * {
    box-sizing: border-box;
  }

  .workspace-switcher {
    position: relative;
    display: flex;
    width: 100%;
    max-height: var(--workspace-switcher-max-height, none);
    background: var(--kd-color-background-container-default);
    border-radius: 8px;
    overflow: hidden;
  }

  .workspace-switcher__left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    width: var(--workspace-switcher-left-panel-width, 275px);
    flex-shrink: 0;
    padding: 12px;
    background: var(--kd-color-background-opacity-1);
    border-radius: 8px 0 0 8px;
  }

  .workspace-switcher__right {
    position: absolute;
    inset: 0 0 0 var(--workspace-switcher-left-panel-width, 275px);
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    overflow-y: auto;
  }

  .workspace-switcher__back {
    margin-bottom: 8px;
  }

  .workspace-switcher__title {
    width: 100%;
    padding: 0 8px 2px;
    color: var(--kd-color-text-level-primary);
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.16px;
    text-transform: uppercase;
  }

  .workspace-switcher__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
  }

  .workspace-switcher__left-header {
    width: 100%;
    padding-left: 8px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--kd-color-border-variants-light);
  }

  .workspace-switcher__left-header--without-divider {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  .workspace-switcher__account-meta {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: var(--kd-color-text-level-primary);
    font-size: 14px;
    line-height: 20px;
  }

  .workspace-switcher__account-meta-status {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-top: 4px;
    color: var(--kd-color-badge-heavy-background-success);
  }

  .workspace-switcher__account-meta-status svg,
  .workspace-switcher__account-meta-link-icon svg,
  .workspace-switcher__menu-icon svg {
    width: 16px;
    height: 16px;
  }

  .workspace-switcher__account-meta-content {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .workspace-switcher__account-meta-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--kd-color-text-level-primary);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  .workspace-switcher__account-meta-item {
    color: var(--kd-color-text-level-primary);
    font-size: 14px;
    line-height: 20px;
  }

  .workspace-switcher__account-meta-link,
  .workspace-switcher__account-meta-action {
    width: fit-content;
    color: var(--kd-color-text-link-level-default);
  }

  .workspace-switcher__account-meta-action {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    line-height: 20px;
    cursor: pointer;
  }

  .workspace-switcher__account-meta-action:hover {
    color: var(--kd-color-text-link-level-hover);
  }

  .workspace-switcher__account-meta-action:active {
    color: var(--kd-color-text-link-level-pressed);
  }

  .workspace-switcher__account-meta-action:focus-visible {
    outline: 2px solid var(--kd-color-border-variants-focus);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .workspace-switcher__account-meta-link-icon {
    display: flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .workspace-switcher__menu-item {
    display: flex;
    align-items: center;
    padding: 0;
    border-radius: 4px;
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition: background-color 150ms ease-out, color 150ms ease-out,
      outline-color 150ms ease-out;
    font-size: 14px;
    line-height: 20px;
  }

  .workspace-switcher__menu-button {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    padding: 5px 8px;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
    outline: none;
  }

  .workspace-switcher__menu-button:focus-visible {
    outline: 2px solid var(--kd-color-border-variants-focus);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .workspace-switcher__menu-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--kd-color-text-level-primary);
  }

  .workspace-switcher__menu-item--workspace .workspace-switcher__menu-name {
    max-width: 25ch;
  }

  .workspace-switcher__menu-item--item .workspace-switcher__menu-name {
    max-width: 40ch;
  }

  .workspace-switcher__menu-count,
  .workspace-switcher__menu-icon {
    color: var(--kd-color-text-level-secondary);
  }

  .workspace-switcher__menu-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding-right: 8px;
  }

  .workspace-switcher__menu-favorite {
    color: var(--kd-color-text-level-secondary);
  }

  .workspace-switcher__menu-launch-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--kd-color-text-level-secondary);
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .workspace-switcher__menu-launch-indicator:focus-visible {
    outline: 2px solid var(--kd-color-border-variants-focus);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .workspace-switcher__menu-item--workspace:hover:not(.workspace-switcher__menu-item--selected),
  .workspace-switcher__menu-item--back:hover:not(.workspace-switcher__menu-item--selected) {
    background: var(--kd-color-background-menu-state-hover);
  }

  .workspace-switcher__menu-item--workspace:active:not(.workspace-switcher__menu-item--selected),
  .workspace-switcher__menu-item--back:active:not(.workspace-switcher__menu-item--selected) {
    background: var(--kd-color-background-menu-state-pressed);
  }

  .workspace-switcher__menu-item--workspace.workspace-switcher__menu-item--selected,
  .workspace-switcher__menu-item--back.workspace-switcher__menu-item--selected {
    background: var(--kd-color-background-menu-state-hover);
  }

  .workspace-switcher__menu-item--workspace:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--workspace:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-count,
  .workspace-switcher__menu-item--workspace:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-icon,
  .workspace-switcher__menu-item--back:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--back:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-icon,
  .workspace-switcher__menu-item--workspace:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--workspace:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-count,
  .workspace-switcher__menu-item--workspace:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-icon,
  .workspace-switcher__menu-item--back:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--back:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-icon,
  .workspace-switcher__menu-item--workspace.workspace-switcher__menu-item--selected .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--workspace.workspace-switcher__menu-item--selected .workspace-switcher__menu-count,
  .workspace-switcher__menu-item--workspace.workspace-switcher__menu-item--selected .workspace-switcher__menu-icon,
  .workspace-switcher__menu-item--back.workspace-switcher__menu-item--selected .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--back.workspace-switcher__menu-item--selected .workspace-switcher__menu-icon {
    color: var(--kd-color-text-level-light);
  }

  .workspace-switcher__menu-item--item:hover:not(.workspace-switcher__menu-item--selected) {
    --kyn-icon-selector-hover-opacity: 1;
    background: var(--kd-color-background-menu-state-hover);
  }

  .workspace-switcher__menu-item--item:active:not(.workspace-switcher__menu-item--selected) {
    background: var(--kd-color-background-menu-state-pressed);
  }

  .workspace-switcher__menu-item--item:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--item:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-favorite,
  .workspace-switcher__menu-item--item:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-launch-indicator,
  .workspace-switcher__menu-item--item:hover:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-icon,
  .workspace-switcher__menu-item--item:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-name,
  .workspace-switcher__menu-item--item:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-favorite,
  .workspace-switcher__menu-item--item:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-launch-indicator,
  .workspace-switcher__menu-item--item:active:not(.workspace-switcher__menu-item--selected) .workspace-switcher__menu-icon {
    color: var(--kd-color-text-level-light);
  }

  .workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected {
    background: var(--kd-color-background-menu-state-open);
  }

  .workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected .workspace-switcher__menu-name {
    color: var(--kd-color-text-level-primary);
    font-weight: 500;
  }

  .workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected:hover {
    --kyn-icon-selector-hover-opacity: 1;
  }

  .workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected:hover .workspace-switcher__menu-favorite,
  .workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected:hover .workspace-switcher__menu-launch-indicator,
  .workspace-switcher__menu-item--item.workspace-switcher__menu-item--selected:hover .workspace-switcher__menu-icon {
    color: var(--kd-color-text-level-primary);
  }

  .workspace-switcher__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .workspace-switcher__search {
    margin-bottom: 0;
    padding: 4px 8px 2px 0;
  }

  @media (max-width: calc(52rem - 0.001px)) {
    .workspace-switcher {
      display: block;
    }

    .workspace-switcher__left,
    .workspace-switcher__right {
      width: 100%;
      transition: transform 200ms ease-out;
    }

    .workspace-switcher__left.workspace-switcher__panel--inactive,
    .workspace-switcher__right.workspace-switcher__panel--inactive {
      visibility: hidden;
      pointer-events: none;
    }

    .workspace-switcher__left.workspace-switcher__panel--active,
    .workspace-switcher__right.workspace-switcher__panel--active {
      visibility: visible;
      pointer-events: auto;
    }

    .workspace-switcher__left {
      border-radius: 0;
      overflow-y: auto;
    }

    .workspace-switcher__right {
      inset: 0;
      padding: 12px;
    }

    .workspace-switcher-host:not([data-view='detail']) .workspace-switcher__left {
      transform: translateX(0);
    }

    .workspace-switcher-host:not([data-view='detail']) .workspace-switcher__right {
      transform: translateX(100%);
    }

    .workspace-switcher-host[data-view='detail'] .workspace-switcher__left {
      transform: translateX(-100%);
    }

    .workspace-switcher-host[data-view='detail'] .workspace-switcher__right {
      transform: translateX(0);
    }

    .workspace-switcher__back {
      margin-left: 8px;
      margin-right: 8px;
    }

    .workspace-switcher__account-meta-name,
    .workspace-switcher__menu-item--workspace .workspace-switcher__menu-name,
    .workspace-switcher__menu-item--item .workspace-switcher__menu-name {
      max-width: none;
    }

    .workspace-switcher__search {
      padding: 4px 0 2px 0;
    }
  }

  @media (min-width: 52rem) {
    .workspace-switcher__back {
      display: none;
    }
  }

  @media (max-width: calc(42rem - 0.001px)) {
    .workspace-switcher {
      margin-top: 4px;
    }
  }
`;

const stateByHost = new WeakMap();

const cloneExampleData = () => JSON.parse(JSON.stringify(exampleData));

const getTextStrings = (args = {}) => ({
  ...DEFAULT_TEXT_STRINGS,
  ...(args.textStrings || {}),
});

const getAllItems = (data) =>
  Object.values(data.itemsByWorkspace).flatMap((items) => items);

const getItemsForWorkspace = (data, workspaceId) =>
  workspaceId === 'global'
    ? getAllItems(data)
    : [...(data.itemsByWorkspace[workspaceId] || [])];

const filterItemsByQuery = (items, query) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return items;

  return items.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery)
  );
};

const getWorkspaceCount = (data, workspaceId) =>
  workspaceId === 'global'
    ? null
    : data.itemsByWorkspace[workspaceId]?.length || 0;

const createAccountMeta = (state) => {
  if (!state.accountMetaName) return null;

  return {
    name: state.accountMetaName,
    items: [
      {
        text: state.data.accountDetails.accountId,
        actionIcon: 'copy',
        copyValue: state.data.accountDetails.accountId,
      },
      {
        text: state.data.accountDetails.country,
      },
    ],
  };
};

const createInitialState = (args, options = {}) => {
  const data = cloneExampleData();
  const defaultWorkspaceId = data.defaultSelectedWorkspace;
  const defaultItems = getItemsForWorkspace(data, defaultWorkspaceId);
  const defaultSelectedItem = defaultItems[0] || null;

  return {
    args,
    options,
    data,
    selectedWorkspaceId: defaultWorkspaceId,
    selectedItemId: defaultSelectedItem?.id || null,
    accountMetaName: defaultSelectedItem?.name || '',
    copiedAccountMetaIndex: null,
    copyFeedbackTimeout: null,
    searchQuery: '',
    view: 'root',
  };
};

const clearCopyFeedback = (state) => {
  state.copiedAccountMetaIndex = null;
  if (state.copyFeedbackTimeout != null) {
    window.clearTimeout(state.copyFeedbackTimeout);
    state.copyFeedbackTimeout = null;
  }
};

const setCopyFeedback = (host, state, index) => {
  state.copiedAccountMetaIndex = index;
  if (state.copyFeedbackTimeout != null) {
    window.clearTimeout(state.copyFeedbackTimeout);
  }

  state.copyFeedbackTimeout = window.setTimeout(() => {
    state.copiedAccountMetaIndex = null;
    state.copyFeedbackTimeout = null;
    renderWorkspaceSwitcherPattern(host);
  }, 3000);
};

const updateFavoriteState = (state, value, favorited) => {
  Object.values(state.data.itemsByWorkspace).forEach((items) => {
    const targetItem = items.find((item) => item.id === value);
    if (targetItem) {
      targetItem.favorited = favorited;
    }
  });
};

const syncFlyoutPresentation = (host) => {
  const state = stateByHost.get(host);
  if (!state) return;

  const flyout = host.closest('kyn-header-flyout');
  if (!flyout) return;

  const textStrings = getTextStrings(state.args);
  const accountMeta = createAccountMeta(state);
  const summaryDetails =
    accountMeta?.items?.filter((item) => item.text?.trim()).slice(0, 2) || [];

  flyout.dispatchEvent(
    new CustomEvent(MOBILE_PRESENTATION_EVENT, {
      detail: {
        buttonIconSvg: accountsIcon,
        summaryIconSvg: accountMeta?.name ? checkmarkFilledIcon : '',
        summaryLabel: accountMeta?.name || '',
        summaryDetails,
        mobileLabel: textStrings.backToWorkspaces,
        hideButtonContentOnMobile: true,
      },
    })
  );

  flyout.label = accountMeta?.name || '';

  const accountName = flyout.querySelector('.account-name');
  if (accountName) {
    accountName.textContent = accountMeta?.name || '';
  }
};

const connectFlyoutIntegration = (host) => {
  const flyout = host.closest('kyn-header-flyout');
  if (!flyout) return null;

  if (!boundFlyouts.has(flyout)) {
    flyout.addEventListener('on-flyout-toggle', (event) => {
      const currentHost = patternHostByFlyout.get(flyout);
      if (!currentHost) return;

      const currentState = stateByHost.get(currentHost);
      if (!currentState || event.detail?.open) return;

      currentState.searchQuery = '';
      currentState.view = 'root';
      renderWorkspaceSwitcherPattern(currentHost);
      syncFlyoutPresentation(currentHost);
    });

    boundFlyouts.add(flyout);
  }

  patternHostByFlyout.set(flyout, host);

  return flyout;
};

const scheduleFlyoutPresentationSync = (host) => {
  const sync = () => {
    const flyout = connectFlyoutIntegration(host);
    if (host.isConnected && flyout) {
      syncFlyoutPresentation(host);
    }
  };

  sync();

  queueMicrotask(() => {
    if (host.isConnected) {
      sync();
    }
  });

  requestAnimationFrame(() => {
    if (host.isConnected) {
      sync();
    }
  });
};

const renderAccountMetaItem = (host, state, item, index) => {
  const icon =
    item.actionIcon === 'copy'
      ? state.copiedAccountMetaIndex === index
        ? checkmarkIcon
        : copyIcon
      : item.actionIcon === 'launch'
      ? launchIcon
      : null;

  if (item.actionIcon === 'copy' && !item.href) {
    return html`
      <button
        type="button"
        class="workspace-switcher__account-meta-action"
        @click=${async () => {
          const copyValue = item.copyValue || item.text;

          try {
            await window.navigator?.clipboard?.writeText(copyValue);
            setCopyFeedback(host, state, index);
            action('on-account-meta-copy')({
              index,
              text: item.text,
              value: copyValue,
              success: true,
            });
            renderWorkspaceSwitcherPattern(host);
          } catch {
            return;
          }
        }}
      >
        <span>${item.text}</span>
        ${icon
          ? html`
              <span class="workspace-switcher__account-meta-link-icon">
                ${unsafeSVG(icon)}
              </span>
            `
          : null}
      </button>
    `;
  }

  if (item.href) {
    return html`
      <kyn-link
        class="workspace-switcher__account-meta-link"
        standalone
        animationInactive
        href=${item.href}
        target=${item.target || ''}
        rel=${item.rel || ''}
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
};

const renderMenuItem = (host, state, options) => {
  const {
    variant = 'item',
    name = '',
    nameTitle = '',
    count = null,
    value = '',
    selected = false,
    favorited = false,
    showLaunchIndicator = false,
    showFavorite = false,
    onClick = () => {},
    onFavoriteChange = () => {},
  } = options;

  const isWorkspace = variant === 'workspace';
  const isBack = variant === 'back';
  const tooltipName = nameTitle || name;
  const launchAssistiveText = getTextStrings(state.args).launchAssistiveText;
  const launchActionLabel = launchAssistiveText
    ? `${tooltipName}. ${launchAssistiveText}`
    : tooltipName;

  const classes = {
    'workspace-switcher__menu-item': true,
    'workspace-switcher__menu-item--workspace': isWorkspace,
    'workspace-switcher__menu-item--item': !isWorkspace && !isBack,
    'workspace-switcher__menu-item--back': isBack,
    'workspace-switcher__menu-item--selected': selected,
    'workspace-switcher__back': isBack,
  };

  return html`
    <div
      class=${classMap(classes)}
      role=${isBack ? 'none' : 'listitem'}
      aria-current=${selected ? 'true' : 'false'}
      data-value=${value}
    >
      <button
        type="button"
        class="workspace-switcher__menu-button"
        title=${tooltipName}
        @click=${onClick}
      >
        ${isBack
          ? html`
              <span class="workspace-switcher__menu-icon" aria-hidden="true">
                ${unsafeSVG(arrowLeftIcon)}
              </span>
            `
          : null}
        <span class="workspace-switcher__menu-name">${name}</span>
        ${isWorkspace && count != null
          ? html`
              <span class="workspace-switcher__menu-count">${count}</span>
              <span class="workspace-switcher__menu-icon" aria-hidden="true">
                ${unsafeSVG(chevronRightIcon)}
              </span>
            `
          : null}
        ${!isWorkspace && !isBack && showLaunchIndicator
          ? html`
              <span class="workspace-switcher__sr-only">
                ${getTextStrings(state.args).launchAssistiveText}
              </span>
            `
          : null}
      </button>
      ${!isWorkspace && !isBack && (showLaunchIndicator || showFavorite)
        ? html`
            <div class="workspace-switcher__menu-actions">
              ${showLaunchIndicator
                ? html`
                    <button
                      type="button"
                      class="workspace-switcher__menu-launch-indicator"
                      title=${launchActionLabel}
                      aria-label=${launchActionLabel}
                      @click=${onClick}
                    >
                      ${unsafeSVG(launchIcon)}
                    </button>
                  `
                : null}
              ${showFavorite
                ? html`
                    <kyn-icon-selector
                      class="workspace-switcher__menu-favorite"
                      ?checked=${favorited}
                      value=${value}
                      animateSelection
                      onlyVisibleOnHover
                      persistWhenChecked
                      @on-change=${onFavoriteChange}
                    ></kyn-icon-selector>
                  `
                : null}
            </div>
          `
        : null}
    </div>
  `;
};

const renderWorkspaceSwitcherMarkup = (host, state) => {
  const textStrings = getTextStrings(state.args);
  const accountMeta = createAccountMeta(state);
  const currentItems = getItemsForWorkspace(
    state.data,
    state.selectedWorkspaceId
  );
  const visibleItems =
    state.options.showSearch && state.options.filterSearchResults
      ? filterItemsByQuery(currentItems, state.searchQuery)
      : currentItems;
  const workspaces = state.data.workspaces.map((workspace) => ({
    ...workspace,
    count: getWorkspaceCount(state.data, workspace.id),
    selected: workspace.id === state.selectedWorkspaceId,
  }));

  return html`
    <style>
      ${PATTERN_STYLES}
    </style>
    <div
      class="workspace-switcher-host"
      data-view=${state.view}
      style=${`--workspace-switcher-max-height: ${
        state.args.maxHeight || 'none'
      };`}
    >
      <div class="workspace-switcher">
        <div
          class=${classMap({
            'workspace-switcher__left': true,
            'workspace-switcher__panel--active': state.view !== 'detail',
            'workspace-switcher__panel--inactive': state.view === 'detail',
          })}
        >
          ${!state.args.hideCurrentTitle
            ? html`
                <span class="workspace-switcher__title">
                  ${textStrings.currentTitle}
                </span>
              `
            : null}
          ${accountMeta
            ? html`
                <div
                  class=${classMap({
                    'workspace-switcher__left-header': true,
                    'workspace-switcher__left-header--without-divider':
                      !!state.args.hideLeftDivider,
                  })}
                >
                  <div class="workspace-switcher__account-meta">
                    <span
                      class="workspace-switcher__account-meta-status"
                      aria-hidden="true"
                    >
                      ${unsafeSVG(checkmarkFilledIcon)}
                    </span>
                    <div class="workspace-switcher__account-meta-content">
                      <span
                        class="workspace-switcher__account-meta-name"
                        title=${accountMeta.name}
                      >
                        ${accountMeta.name}
                      </span>
                      ${(accountMeta.items || []).map((item, index) =>
                        renderAccountMetaItem(host, state, item, index)
                      )}
                    </div>
                  </div>
                </div>
              `
            : null}
          ${!state.args.hideWorkspacesTitle
            ? html`
                <span class="workspace-switcher__title">
                  ${textStrings.workspacesTitle}
                </span>
              `
            : null}
          <div class="workspace-switcher__list" role="list">
            ${workspaces.map((workspace) =>
              renderMenuItem(host, state, {
                variant: 'workspace',
                value: workspace.id,
                name: workspace.name,
                count: workspace.count,
                selected: workspace.selected,
                onClick: () => {
                  action('on-workspace-select')({ workspace });
                  clearCopyFeedback(state);
                  state.selectedWorkspaceId = workspace.id;
                  state.selectedItemId = null;
                  state.searchQuery = '';
                  state.view = 'detail';
                  renderWorkspaceSwitcherPattern(host);
                  syncFlyoutPresentation(host);
                },
              })
            )}
          </div>
        </div>
        <div
          class=${classMap({
            'workspace-switcher__right': true,
            'workspace-switcher__panel--active': state.view === 'detail',
            'workspace-switcher__panel--inactive': state.view !== 'detail',
          })}
        >
          ${renderMenuItem(host, state, {
            variant: 'back',
            value: 'back',
            name: textStrings.backToWorkspaces,
            onClick: () => {
              state.view = 'root';
              renderWorkspaceSwitcherPattern(host);
            },
          })}
          ${state.options.showSearch
            ? html`
                <kyn-search
                  size="sm"
                  label="Search"
                  .value=${state.searchQuery}
                  .suggestions=${[]}
                  class="workspace-switcher__search"
                  @on-input=${(event) => {
                    state.searchQuery = event.detail.value;
                    action('on-search')(event.detail);
                    renderWorkspaceSwitcherPattern(host);
                  }}
                ></kyn-search>
              `
            : null}
          <div class="workspace-switcher__list" role="list">
            ${visibleItems.map((item) =>
              renderMenuItem(host, state, {
                variant: 'item',
                value: item.id,
                name: item.name,
                selected: state.selectedItemId === item.id,
                favorited: !!item.favorited,
                showLaunchIndicator: !!item.opensInNewTab,
                showFavorite: !item.hideFavorite,
                onClick: () => {
                  action('on-item-select')({ item });
                  clearCopyFeedback(state);
                  state.selectedItemId = item.id;
                  state.accountMetaName = item.name;
                  renderWorkspaceSwitcherPattern(host);
                  syncFlyoutPresentation(host);
                },
                onFavoriteChange: (event) => {
                  const favorited = !!event.detail.checked;
                  updateFavoriteState(state, item.id, favorited);
                  action('on-favorite-change')({
                    value: item.id,
                    favorited,
                  });
                  renderWorkspaceSwitcherPattern(host);
                },
              })
            )}
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderWorkspaceSwitcherPattern = (host) => {
  const state = stateByHost.get(host);
  if (!state) return;
  render(renderWorkspaceSwitcherMarkup(host, state), host);
};

const mountWorkspaceSwitcherPattern = (host, args, options = {}) => {
  if (!host) return;

  const previousState = stateByHost.get(host);
  if (previousState) {
    clearCopyFeedback(previousState);
  }

  const state = createInitialState(args, options);
  stateByHost.set(host, state);
  renderWorkspaceSwitcherPattern(host);

  if (options.withFlyout) {
    scheduleFlyoutPresentationSync(host);
  }
};

const createStandalonePattern = (args, options = {}) => html`
  <div
    ${ref((host) => {
      mountWorkspaceSwitcherPattern(host, args, options);
    })}
  ></div>
`;

const handleFlyoutToggle = (event) => {
  const chevron = event.target.querySelector('.account-chevron');
  if (chevron) {
    chevron.style.transform = event.detail.open
      ? 'rotate(180deg)'
      : 'rotate(0deg)';
  }
};

export default {
  title: 'Patterns/Workspace Switcher',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    maxHeight: {
      name: 'maxHeight',
      control: { type: 'text' },
      description: 'Example max height for the pattern container.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'none' },
      },
    },
  },
  args: {
    hideCurrentTitle: false,
    hideWorkspacesTitle: false,
    hideLeftDivider: false,
    textStrings: DEFAULT_TEXT_STRINGS,
    maxHeight: 'none',
  },
};

export const UIImplementation = {
  decorators: [
    (story) => html`
      <style>
        .account-name {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .account-chevron {
          display: flex;
          transition: transform 0.2s;
        }

        .ui-impl-switcher {
          width: 625px;
        }

        @media (max-width: calc(52rem - 0.001px)) {
          .ui-impl-switcher {
            max-width: 375px;
          }

          .account-chevron {
            display: none;
          }
        }

        @media (max-width: calc(42rem - 0.001px)) {
          .ui-impl-switcher {
            width: 100%;
            max-width: none;
          }
        }
      </style>
      <div
        style="height: 100vh; min-height: 500px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
      >
        ${story()}
      </div>
    `,
  ],
  render: (args) => html`
    <kyn-header rootUrl="/" appTitle="Bridge">
      <span slot="logo" style="--kyn-header-logo-width: 120px;">
        ${unsafeSVG(bridgeLogo)}
      </span>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Dashboard
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Services
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Reports
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <span>${unsafeSVG(circleIcon)}</span>
          Administration
        </kyn-header-link>
      </kyn-header-nav>

      <kyn-header-flyouts>
        <kyn-header-flyout
          label="Very Long Name That Exceeds The Limit That Exceeds Width Limit"
          hideMenuLabel
          hideButtonLabel
          noPadding
          @on-flyout-toggle=${handleFlyoutToggle}
        >
          <span
            slot="button"
            style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
          >
            <span class="account-name">
              Very Long Name That Exceeds The Limit That Exceeds Width Limit
            </span>
            <span class="account-chevron">${unsafeSVG(chevronDownIcon)}</span>
          </span>

          <div class="ui-impl-switcher">
            ${createStandalonePattern(args, { withFlyout: true })}
          </div>
        </kyn-header-flyout>

        <kyn-header-flyout label="Notifications" hideMenuLabel>
          <span slot="button">${unsafeSVG(filledNotificationIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            System update scheduled
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            New report available
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Help">
          <span slot="button">${unsafeSVG(helpIcon)}</span>

          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Documentation
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <span>${unsafeSVG(circleIcon)}</span>
            Support
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="User Profile" hideMenuLabel>
          <span slot="button">${unsafeSVG(userAvatarIcon)}</span>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            Profile Settings
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            Sign Out
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `,
};

export const FullWorkspaceInfo = {
  render: (args) => createStandalonePattern(args),
};

export const SimpleWorkspaceInfo = {
  args: {
    hideWorkspacesTitle: true,
  },
  render: (args) => createStandalonePattern(args),
};

export const WithSearch = {
  render: (args) =>
    createStandalonePattern(args, {
      showSearch: true,
      filterSearchResults: true,
    }),
};
