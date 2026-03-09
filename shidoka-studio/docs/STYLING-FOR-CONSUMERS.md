# Styling for consuming applications

When you use Shidoka (e.g. via Shidoka Studio–generated pages) in your own app, you need to load the design system’s global styles and ensure your application’s CSS does not override Shidoka tokens and component styling.

## Required styles

Your app must load these **before** or as part of your main entry so that `kyn-*` components and layout look correct:

1. **Shidoka Foundation** (tokens, reset, typography, layout)

   - Install: `npm install @kyndryl-design-system/shidoka-foundation`
   - In your app entry (e.g. `main.ts`, `App.vue`, `_app.tsx`, `index.html`):
     ```js
     import '@kyndryl-design-system/shidoka-foundation/css/root.css';
     import '@kyndryl-design-system/shidoka-foundation/css/index.css';
     ```

2. **Shidoka Applications** (if you use components from `@kyndryl-design-system/shidoka-applications`)

   - Any global styles or utility SCSS the applications package exposes (see its README or dist). Component-level styles are encapsulated in shadow DOM; only shared globals (e.g. gridstack/swiper overrides) may need to be imported if you use those components.

3. **Shidoka Charts** (if you use chart components)
   - Install and import any global CSS the charts package documents.

## Preventing your app from overwriting Shidoka

Application styles (e.g. Tailwind, app-specific CSS, framework defaults) can override design system variables and layout if they come later in the cascade or use higher specificity. Use **CSS cascade layers** so that Shidoka has higher precedence than your app’s global styles.

### How layers work

- **Unlayered styles** always win over **layered** styles.
- Among layers, **later-declared layers** win over earlier ones.
- So: declare an **app** layer first and a **shidoka** layer second. Put your app’s global styles in the **app** layer and Shidoka in the **shidoka** layer. Shidoka will then win when both target the same thing, and you can still override intentionally with unlayered or higher-specificity CSS when needed.

### Recommended setup

**1. Establish layer order** in a single, early-loaded CSS file (e.g. `src/styles/layers.css` or your app entry):

```css
/* Layer order: app first (lower priority), shidoka second (higher priority). */
@layer app, shidoka;
```

**2. Load Shidoka into the `shidoka` layer.**  
If your bundler supports `@import` with `layer()`:

```css
@layer app, shidoka;

@import '@kyndryl-design-system/shidoka-foundation/css/root.css' layer(shidoka);
@import '@kyndryl-design-system/shidoka-foundation/css/index.css' layer(shidoka);
```

Or in JS (e.g. Vite, Webpack), import the foundation CSS and wrap it in a layer in a small wrapper file:

```css
/* shidoka-layer.css */
@layer shidoka {
  @import '@kyndryl-design-system/shidoka-foundation/css/root.css';
  @import '@kyndryl-design-system/shidoka-foundation/css/index.css';
}
```

(Note: some bundlers may not support `@import` inside `@layer`; in that case, use a build step or load foundation first and put only your app styles in `@layer app` so they have lower priority.)

**3. Put your app’s global styles in the `app` layer** so they don’t override Shidoka:

```css
@layer app {
  /* Your app resets, layout, typography overrides, etc. */
  body {
    font-family: var(--kd-font-family, sans-serif);
  }
  .my-page {
    padding: 1rem;
  }
}
```

**4. Intentional overrides** (e.g. a page-specific tweak) can stay **unlayered** or use a later layer so they still win when needed.

### Summary

- **Required:** Load foundation `root.css` and `index.css` (and any applications/charts globals you use).
- **Protection:** Use `@layer app, shidoka` and put Shidoka in `shidoka`, your globals in `app`, so Shidoka isn’t overwritten by app styles.
- **Browser support:** `@layer` is supported in all modern browsers (2022+).

For more on cascade layers, see [MDN: @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).
