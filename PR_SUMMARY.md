# Header & Categorical Nav Refactoring

This PR introduces significant improvements to the header navigation components, including two layout options for categorical navigation (grid and masonry), improved flyout behavior controls, and a new icon selector component for favorites functionality.

## Breaking Changes Prevention

All new features are **opt-in** with backwards-compatible defaults. Existing implementations will continue to work without modification.

---

## New Props

### `kyn-header-categories`

| Prop         | Type                  | Default     | Description                                                                                                                 |
| ------------ | --------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `layout`     | `'masonry' \| 'grid'` | `'masonry'` | Layout mode for categories. See Layout Options below.                                                                       |
| `maxColumns` | `number`              | `3`         | Maximum columns to display when using `layout="grid"` or `layout="masonry"`. Has no effect in default auto-responsive mode. |

### `kyn-header-nav`

| Prop                  | Type      | Default | Description                                                                                                                                                  |
| --------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `flyoutAutoCollapsed` | `boolean` | `true`  | When `true` (default), flyouts auto-close on mouse leave. When `false`, first categorical flyout auto-opens and flyouts stay open until another is selected. |

### `kyn-header-link`

| Prop                  | Type      | Default | Description                                                                         |
| --------------------- | --------- | ------- | ----------------------------------------------------------------------------------- |
| `flyoutAutoCollapsed` | `boolean` | `true`  | Controls whether this link's flyout auto-closes on mouse leave.                     |
| `truncate`            | `boolean` | `false` | When `true`, long text truncates with ellipsis instead of wrapping.                 |
| `hideSearch`          | `boolean` | `false` | Hides the search input regardless of the number of child links.                     |
| `linkTitle`           | `string`  | `''`    | Title attribute for the link, shown as tooltip on hover. Useful for truncated text. |

### `kyn-header-category`

| Prop            | Type      | Default | Description                                                                                                                                     |
| --------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `noAutoDivider` | `boolean` | `true`  | When `true` (default), dividers only show when `showDivider` is explicitly set. When `false`, dividers auto-detect based on sibling categories. |
| `indentLinks`   | `boolean` | `false` | When `true`, indents links to align with heading text when an icon slot is present.                                                             |

---

## Layout Options for `kyn-header-categories`

### Masonry Layout (`layout="masonry"`)

True CSS column masonry where items flow **vertically** down each column before moving to the next column. This creates a tighter, more compact layout matching the Figma design.

```html
<kyn-header-categories layout="masonry" maxColumns="3">
  <kyn-header-category heading="Category 1">...</kyn-header-category>
  <kyn-header-category heading="Category 2">...</kyn-header-category>
  <kyn-header-category heading="Category 3">...</kyn-header-category>
  <!-- Items flow: Col1 top-to-bottom, then Col2, then Col3 -->
</kyn-header-categories>
```

**Characteristics:**

- Uses CSS `column-count` based on `maxColumns`
- Items stack vertically within each column
- Creates compact layout without horizontal row gaps
- Recommended for categorical nav with varying category heights

### Grid Layout (`layout="grid"`)

CSS Grid where items flow **horizontally** (row-by-row, left to right, then wrap).

```html
<kyn-header-categories layout="grid" maxColumns="3">
  <kyn-header-category heading="Category 1">...</kyn-header-category>
  <kyn-header-category heading="Category 2">...</kyn-header-category>
  <kyn-header-category heading="Category 3">...</kyn-header-category>
  <!-- Items flow: Row1 left-to-right, then Row2, etc. -->
</kyn-header-categories>
```

**Characteristics:**

- Uses CSS Grid with fixed column templates
- Items flow left-to-right, wrapping to next row
- Creates aligned rows (items in same row share baseline)
- Automatic last-row divider detection

### Default (No Layout Prop)

Auto-responsive masonry using CSS `column-width`. Column count is determined by available space.

```html
<kyn-header-categories>
  <!-- Auto-responsive columns based on viewport width -->
</kyn-header-categories>
```

---

## New Patterns

### Persistent Flyout Behavior

For enhanced UX in categorical navigation, flyouts can stay open:

```html
<kyn-header-nav flyoutAutoCollapsed="false">
  <kyn-header-link href="#">
    <!-- First categorical link auto-opens when nav opens -->
    <kyn-header-categories layout="masonry" maxColumns="3" slot="links">
      ...
    </kyn-header-categories>
  </kyn-header-link>
</kyn-header-nav>
```

### Icon Slot Pattern for Categories

Icons are now placed on category headings rather than individual links:

```html
<kyn-header-category heading="Services" indentLinks>
  <span slot="icon">${serviceIcon}</span>
  <kyn-header-link href="#">Service 1</kyn-header-link>
  <kyn-header-link href="#">Service 2</kyn-header-link>
</kyn-header-category>
```

### Favorites with Icon Selector

Use the new icon selector for favorite/unfavorite functionality in nav links:

```html
<kyn-header-link href="#" truncate>
  <span>Service Name</span>
  <kyn-icon-selector
    value="service-id"
    ?checked="${isFavorited}"
    onlyVisibleOnHover
    persistWhenChecked
    @on-change="${handleFavoriteToggle}"
  >
    <span slot="icon-unchecked">${starOutlineIcon}</span>
    <span slot="icon-checked">${starFilledIcon}</span>
  </kyn-icon-selector>
</kyn-header-link>
```

---

## New Components

### `kyn-icon-selector`

A checkbox-style toggle using icons for visual states, primarily designed for favorite/unfavorite functionality.

**Props:**

| Prop                 | Type      | Default                   | Description                                                 |
| -------------------- | --------- | ------------------------- | ----------------------------------------------------------- |
| `checked`            | `boolean` | `false`                   | Checked/selected state                                      |
| `value`              | `string`  | `''`                      | Value associated with this selector                         |
| `checkedLabel`       | `string`  | `'Remove from favorites'` | Accessible label when checked                               |
| `uncheckedLabel`     | `string`  | `'Add to favorites'`      | Accessible label when unchecked                             |
| `disabled`           | `boolean` | `false`                   | Disabled state                                              |
| `onlyVisibleOnHover` | `boolean` | `false`                   | Icon only visible on parent hover                           |
| `persistWhenChecked` | `boolean` | `false`                   | Checked items remain visible even with `onlyVisibleOnHover` |

**Events:**

- `on-change` - Emits when checked state changes: `{ checked: boolean, value: string, origEvent: Event }`

**Slots:**

- `icon-unchecked` - Custom icon for unchecked state (default: star outline)
- `icon-checked` - Custom icon for checked state (default: filled star)

### `kyn-icon-selector-group`

Container for managing multiple icon selectors with multi-select functionality.

**Props:**

| Prop                 | Type                         | Default      | Description                       |
| -------------------- | ---------------------------- | ------------ | --------------------------------- |
| `value`              | `string[]`                   | `[]`         | Selected values array             |
| `disabled`           | `boolean`                    | `false`      | Disabled state for all selectors  |
| `direction`          | `'vertical' \| 'horizontal'` | `'vertical'` | Stack direction                   |
| `onlyVisibleOnHover` | `boolean`                    | `false`      | Propagates to all child selectors |

**Events:**

- `on-change` - Emits when any selector changes: `{ value: string[], origEvent: Event }`

---

## Modified Components

### `kyn-header-categories`

- **Layout Options**: Added `layout="masonry"` (vertical column flow) and `layout="grid"` (row-by-row)
- **Column Control**: `maxColumns` prop works with both grid and masonry layouts
- **Auto Truncation**: Links automatically get `truncate` attribute when using grid or masonry layouts
- **Divider Detection**: Automatic last-row divider removal in grid mode
- **ResizeObserver**: Responds to viewport changes to update dividers

### `kyn-header-link`

- **Flyout Behavior**: Added `flyoutAutoCollapsed` prop for controlling auto-close
- **Text Truncation**: Added optional `truncate` prop with ellipsis overflow
- **Auto-close Siblings**: Hovering a link now closes other open siblings at the same level
- **Categorical Detection**: Auto-detects when link contains categorical nav via `has-categorical` attribute
- **CSS Custom Properties**: Communicates flyout context to nested components

### `kyn-header-nav`

- **Flyout Auto-Open**: First categorical link auto-opens when nav opens (when `flyoutAutoCollapsed="false"`)
- **Global Control**: `flyoutAutoCollapsed` prop propagates to child links

### `kyn-header-category`

- **Auto-Dividers**: Optional automatic divider detection between categories
- **Link Indentation**: Optional `indentLinks` prop for alignment with icon
- **More Slot**: New `slot="more"` for "More" links (not indented)
- **Empty Heading**: Heading auto-hides when no text and no icon

### `kyn-header` (minor)

- Added `margin-top: 2px` to logo link for alignment

### `kyn-header-nav` (styling)

- Updated menu content padding from `8px 12px` to `16px 12px 8px 12px`

---

## CSS Custom Properties

New CSS custom properties for cross-shadow-DOM communication:

| Property                               | Purpose                                    |
| -------------------------------------- | ------------------------------------------ |
| `--kyn-header-link-in-flyout`          | Signals link is in flyout context          |
| `--kyn-header-span-only-width`         | Controls span width in context             |
| `--kyn-header-span-only-height`        | Controls span height in context            |
| `--kyn-header-span-only-overflow`      | Controls overflow behavior                 |
| `--kyn-header-span-only-text-overflow` | Controls text-overflow                     |
| `--kyn-header-span-only-white-space`   | Controls white-space                       |
| `--kyn-header-span-only-min-width`     | Controls min-width                         |
| `--kyn-icon-selector-hover-opacity`    | Controls icon selector visibility on hover |

---

## Bug Fixes

### Flyout Width/Height Sizing

**Issue:** Flyouts had excessive width/height, not sizing to content properly. For 1-2 column flyouts, wrapper and container had too much whitespace.

**Root Cause:**

- The flyout container used `display: flex` which caused it to expand
- The wrapper had `flex-grow: 1` causing unnecessary horizontal expansion
- Circular dependency between container width and auto-fit column calculation

**Fix:**

- Changed `.menu__content.slotted` to `display: inline-flex` for shrink-to-fit behavior
- Used `width: max-content` on `kyn-header-categories` for content-based sizing
- Replaced CSS Grid `auto-fit` with fixed column templates based on `data-columns` attribute
- Flyout containers now properly shrink to fit content

### Text Truncation in Flyouts

**Issue:** Long link text was wrapping instead of truncating with ellipsis.

**Fix:**

- Added `truncate` prop to `kyn-header-link` for opt-in truncation
- `kyn-header-categories` automatically applies `truncate` to links when using `layout="grid"` or `layout="masonry"`
- Proper `min-width: 0` on flex/grid items to allow shrinking

### Level 2/3 Flyout Padding

**Issue:** Nested flyouts (level 2 and 3) had asymmetric padding.

**Fix:**

- Changed padding from `8px 8px 8px 230px` to symmetrical `8px` for nested flyouts

---

## Migration Guide

### For Existing Implementations

**No changes required.** All defaults preserve original behavior.

### For New Categorical Nav Implementations

To use the new features, explicitly opt-in:

```html
<kyn-header-nav flyoutAutoCollapsed="false">
  <kyn-header-link href="#">
    <span>${icon}</span>
    Services

    <kyn-tabs slot="links">
      <kyn-tab-panel>
        <!-- Use masonry for Figma-style vertical flow -->
        <kyn-header-categories layout="masonry" maxColumns="3">
          <kyn-header-category heading="Category" indentLinks>
            <span slot="icon">${categoryIcon}</span>
            <kyn-header-link href="#" truncate>
              <span>Link Text</span>
              <kyn-icon-selector onlyVisibleOnHover persistWhenChecked>
                <span slot="icon-unchecked">${starOutline}</span>
                <span slot="icon-checked">${starFilled}</span>
              </kyn-icon-selector>
            </kyn-header-link>
          </kyn-header-category>
        </kyn-header-categories>
      </kyn-tab-panel>
    </kyn-tabs>
  </kyn-header-link>
</kyn-header-nav>
```

---

## Stories

- **Categorical Nav > Slotted HTML Example** - Manual HTML with grid layout (row-by-row)
- **Categorical Nav > JSON-driven with linkRenderer** - JSON config driven with grid layout
- **Patterns > Global Switcher > FullImplementation** - Full implementation with masonry layout (Figma-style vertical flow), tabs, and favorites
- **Reusable > Icon Selector** - Icon selector component demos

---

## Summary of Recent Changes

### GlobalSwitcher Story Refactoring

Refactored the GlobalSwitcher story to use `kyn-header-categories` instead of manual div elements:

**Before:**

```html
<div style="display: flex; gap: 32px; width: 100%;">
  <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
    <kyn-header-category heading="Category 1">...</kyn-header-category>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
    <kyn-header-category heading="Category 2">...</kyn-header-category>
  </div>
</div>
```

**After:**

```html
<kyn-header-categories layout="masonry" maxColumns="3">
  <kyn-header-category heading="Category 1">...</kyn-header-category>
  <kyn-header-category heading="Category 2">...</kyn-header-category>
</kyn-header-categories>
```

**Benefits:**

- Cleaner, more maintainable code
- Automatic truncation handling
- Consistent layout behavior
- Proper flyout sizing
