# Header Flyout CSS Fixes - Handoff Document

## Overview

Work in progress to fix layout issues in the categorical header navigation flyout.

## Original Issues Reported

1. **Missing/inconsistent right padding** on flyout nav wrapper
2. **Caret positioning** - In Header 'WithNav' story, caret (>) should be next to link text, not pushed far right. Nested flyout also needs right padding.
3. **Top padding issues** - Should be consistent regardless of `.wrapper` content
4. **Launch icons alignment** - Should be right-aligned (along with star icons on hover)
5. **Text truncation** - Link item text should truncate when necessary to leave space for icons

## Files Modified

- `src/components/global/header/headerLink.scss`
- `src/components/global/header/headerCategories.scss`
- `src/components/global/header/headerCategory.scss`

## Changes Made So Far

### headerLink.scss

- Added `min-width: 0` to `:host` for text truncation in flex/grid containers
- Changed `.arrow` from `margin-left: auto` to `flex-shrink: 0`
- Added `.level--1 > .nav-link .arrow { margin-left: auto }` - parent nav arrows right-aligned
- Level 2+ arrows stay next to text (no margin-left: auto)
- Added `margin-right: 16px` to categorical wrapper for gap between wrapper and flyout edge
- Changed categorical flyout padding to `8px 0px 8px 230px` (user reduced right padding to 0)
- Wrapper has `overflow: hidden; overflow-y: auto`

### headerCategories.scss

- Changed grid columns from fixed `400px` max to flexible `1fr`: `grid-template-columns: repeat(3, minmax(0, 1fr))`
- Host width set to `width: 100%; max-width: 100%` for all column counts
- Grid items have `min-width: 0` to allow shrinking

### headerCategory.scss

- Added `min-width: 0` to `:host`
- Added `min-width: 0` to `.category__links`
- Removed `overflow: hidden` that was clipping icons

## Current Issues (Remaining)

### Primary Issue: Content not contained within parent div

Looking at DevTools, there's a div with inline style:

```html
<div style="display: flex; gap: 32px; width: calc(100vw - 280px);"></div>
```

This div's children are overflowing outside its bounds. The launch icons appear OUTSIDE the wrapper on the left side.

**Key observation**: This inline style `width: calc(100vw - 280px)` is NOT coming from CSS - it appears to be set dynamically. Need to investigate where this is set.

### The container structure (from DevTools):

```
div.tab-panel.no-padding
  └── div (style="display: flex; gap: 32px; width: calc(100vw - 280px);")
       └── div (flex column with kyn-header-category elements)
            └── kyn-header-category
                 └── kyn-header-link (with icons overflowing)
```

## What Needs Investigation

1. **Where is `width: calc(100vw - 280px)` being set?** - This appears to be inline styles, possibly from JavaScript in a parent component (tab panel?). Check `headerCategories.ts` - but it doesn't seem to set this. May be in a different component.

2. **Why are icons overflowing left?** - The kyn-icon-selector elements with launch icons are appearing outside their parent container bounds.

3. **Text truncation still not working** - Long text like "Assessment for Microsoft Azure Stack Hyper Converged Infrastructure" is not truncating with ellipsis.

## Relevant Code Locations

- `headerLink.ts` - Line 165-227: render method, structure of nav-link and menu
- `headerCategories.ts` - Line 731-777: render method, creates `.header-categories__inner` grid
- Grid structure uses `data-columns` attribute for CSS targeting

## Testing

Check these Storybook stories:

- Header > WithNav (basic nested nav with carets)
- GlobalSwitcher > Full Implementation (categorical nav with tabs)

## Git Status

Branch: `feat/additional-categorical-nav-switcher`

Modified files (staged):

- custom-elements.json
- src/components/global/header/headerCategories.scss
- src/components/global/header/headerCategories.ts
- src/components/global/header/headerCategory.scss
- src/components/global/header/headerCategory.ts
- src/components/global/header/headerLink.scss
- src/components/global/header/headerLink.ts
- src/components/global/header/headerNav.scss
- src/components/reusable/iconSelector/iconSelector.stories.js
- src/components/reusable/iconSelector/iconSelectorGroup.ts
- src/stories/globalSwitcher/GlobalSwitcher.stories.js

## Next Steps

1. Find the source of `width: calc(100vw - 280px)` inline style
2. Ensure the grid container properly constrains its children
3. Fix text truncation so long links show ellipsis
4. Verify icons stay within their link containers and are right-aligned
5. Test at various viewport sizes to ensure responsive behavior
