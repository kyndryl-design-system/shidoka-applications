export const GLOBAL_SWITCHER_PATTERN_STYLES = `
.global-switcher-nav {
  --global-switcher-tab-width: 170px;
  --kyn-icon-selector-animate-selection: 1;
  --kyn-icon-selector-only-visible-on-hover: 1;
  --kyn-icon-selector-persist-when-checked: 1;
  --kyn-header-nav-menu-width: 246px;
  --kyn-header-nav-menu-padding: 12px;
  --kyn-header-nav-menu-background: var(--kd-color-background-menu-state-default);
  --kyn-header-nav-menu-border-radius: 8px;
  --kyn-header-nav-menu-open-border-radius: 8px 0 0 8px;
  --kyn-header-nav-menu-overflow: visible;
  --kyn-header-nav-sync-flyout-height: 1;
  --kyn-header-link-flyout-background: var(--kd-color-background-container-overlay-background);
  --kyn-header-link-flyout-padding: 0 0 0 246px;
  --kyn-header-link-wrapper-padding: 16px;
  --kyn-header-link-wrapper-background: transparent;
  --kyn-header-link-wrapper-border-radius: 0;
  --kyn-header-link-single-categorical-width: min(calc(246px + 350px), calc(100vw - 16px));
  --kyn-header-link-two-column-width: min(calc(246px + 2 * 350px + 32px), calc(100vw - 16px));
}
.global-switcher-tabs {
  width: 100%;
  max-width: none;
}
.global-switcher-mixed-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.global-switcher-category--spaced {
  margin-top: 8px;
}
.global-switcher-link-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.global-switcher-link-icon {
  display: flex;
  flex-shrink: 0;
  margin-top: -2px;
}
.global-switcher-external-icon {
  display: flex;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
`;

/** Tab hosts sized by --global-switcher-tab-width on .global-switcher-nav */
export const GLOBAL_SWITCHER_EQUAL_TAB_STYLE =
  'width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);';

export const getGlobalSwitcherPatternStyleBlock = () =>
  `<style>\n${GLOBAL_SWITCHER_PATTERN_STYLES.trim()}\n</style>`;

export const createGlobalSwitcherStorySource = (markup, extraStyles = '') =>
  `${getGlobalSwitcherPatternStyleBlock()}${
    extraStyles ? `\n<style>\n${extraStyles.trim()}\n</style>` : ''
  }\n${markup.trim()}`;

export const createGlobalSwitcherSourceParameters = (
  markup,
  extraStyles = ''
) => ({
  docs: {
    source: {
      language: 'html',
      code: createGlobalSwitcherStorySource(markup, extraStyles),
    },
  },
});

export const createGlobalSwitcherLogicSourceParameters = (code) => ({
  docs: {
    source: {
      language: 'javascript',
      code: code.trim(),
    },
  },
});
