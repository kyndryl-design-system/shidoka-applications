export const GLOBAL_SWITCHER_PATTERN_STYLES = `
.global-switcher-nav {
  --global-switcher-tab-width: 170px;
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
/* Trailing controls, right-aligned and shrink-to-fit so the right-most icon always
   sits flush to the row's right edge. The persistent icon anchors that edge: legacy
   links place the launch icon last (right-most) with the star to its left; star-only
   links right-align the star. No reserved columns, so no blank gap on either. */
.global-switcher-link-actions {
  flex: 0 0 auto;
  margin-left: auto;
  display: flex;
  align-items: center;
}
/* Match the icon-selector's 24px footprint (16px glyph + 4px padding) and center the
   glyph, so the launch icon and the star land on the same centerline when each is the
   right-most icon. Two adjacent 24px slots also give an 8px visual gutter between them. */
.global-switcher-external-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  opacity: var(--kyn-icon-selector-hover-opacity, 0);
  transition: opacity 150ms ease-out;
}
.global-switcher-link-actions:has(kyn-icon-selector[checked])
  .global-switcher-external-icon {
  opacity: 1;
}
.global-switcher-external-icon svg {
  width: 16px;
  height: 16px;
}
.global-switcher-nav kyn-icon-selector[checked] {
  color: var(--kd-color-background-button-primary-state-default);
}

.icon_svg {
  display: contents;
}

`;

/** Tab hosts sized by --global-switcher-tab-width on .global-switcher-nav */
export const GLOBAL_SWITCHER_EQUAL_TAB_STYLE =
  'width: var(--global-switcher-tab-width); flex: 0 0 var(--global-switcher-tab-width);';
