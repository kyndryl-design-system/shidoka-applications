# Shidoka Web Components for Applications

[![Release](https://github.com/kyndryl-design-system/shidoka-applications/actions/workflows/release.yml/badge.svg)](https://github.com/kyndryl-design-system/shidoka-applications/actions/workflows/release.yml)

# Contributing

Read the [Contributing Guide](CONTRIBUTING.md) here.

# Usage

## Install

```bash
npm install @kyndryl-design-system/shidoka-applications -S
```

## Import the root stylesheets to your app's global styles

The method used (SCSS @use, CSS @import, JS import, or &lt;style&gt; tag) will vary based on your framework/bundler. Some examples:

### SCSS

```css
@use '@kyndryl-design-system/shidoka-foundation/scss/root.scss';
```

### CSS

```css
@import '@kyndryl-design-system/shidoka-foundation/css/root.css';
```

### JS

```js
import '@kyndryl-design-system/shidoka-foundation/css/root.css';
```

### Set a color scheme

More info on color schemes in the [Foundation Storybook](https://shidoka-foundation.netlify.app/?path=/docs/foundation-colors--docs#setting-a-theme).

### Use CSS tokens/variables

You can make use of tokens/variables included in Foundation to style your non-Shidoka elements.

## Start using components

See [Storybook](https://shidoka-applications.netlify.app) for the full components documentation.

### Example: Component with Sub-components

This example imports the Header component AND all of it's subcomponents by targeting the index file.

```js
import '@kyndryl-design-system/shidoka-applications/components/global/header';
```

```html
<kyn-header>
  <kyn-header-nav>
    <kyn-header-link>Link</kyn-header-link>
  </kyn-header-nav>
</kyn-header>
```

### Example: Single Component

This example imports the HeaderLink component by targeting the component file directly.

```js
import '@kyndryl-design-system/shidoka-applications/components/global/header/headerLink';
```

```html
<kyn-header-link>Link</kyn-header-link>
```

### React usage

**[React 19 has introduced native support for Custom Elements](https://react.dev/blog/2024/04/25/react-19#support-for-custom-elements).**

Older versions of React do not support automatic interop with Custom Elements. This means that React treats all props passed to Web Components as string attributes. Until you've upgraded to React 19+, you will need to use a library like [@lit/react](https://www.npmjs.com/package/@lit/react) or [reactify-wc](https://www.npmjs.com/package/reactify-wc) to wrap these components for use in React.

### Server-Side Rendering (SSR)

When using with an SSR framework like Next.js, you will encounter errors with code that only runs client-side, like `window` references for example. This is because web components cannot render on the server. Here is an article that provides some methods to work around this: [Using Non-SSR Friendly Components with Next.js](https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c) and [How to entirely disable server-side rendering in next.js v13?](https://stackoverflow.com/questions/75406728/how-to-entirely-disable-server-side-rendering-in-next-js-v13). Basically, web components need their rendering deferred to only happen on the client-side.

Here is some additional information about why SSR does not work for web components, and some potential polyfills/solutions to enable server rendering: https://lit.dev/docs/ssr/overview/

### Handling `Failed to execute 'define' on 'CustomElementRegistry'`

#### The Problem

This is a common bundling issue that can appear when you incorporate a component that has already bundled Shidoka components. Typically this would be caused by having a middle layer served via CDN, for example a Common UI layer that has a cross-platform Header component built using Shidoka components.

#### Avoiding This

The best solution is to always include external dependencies as npm packages so the application can dedupe the dependencies. This diagram illustrates the problem and solution:
<img width="2249" height="2040" alt="shidoka-dependencies" src="https://github.com/user-attachments/assets/a0153a42-84e8-4444-88fb-481a27ad5c33" />

#### Workaround

If the npm package solution is no go, there is a library containing a script/polyfill that can be used which allows custom elements to be redefined:
https://github.com/caridy/redefine-custom-elements. We've found that this script works best when served from the app's `<head>` tag. Beware this creates a race condition and can cause serious version conflicts if not carefully maintained.
