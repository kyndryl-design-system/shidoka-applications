# Shidoka Web Components for Applications

[![shidoka-applications](https://github.com/kyndryl-design-system/shidoka-applications/actions/workflows/actions.yml/badge.svg)](https://github.com/kyndryl-design-system/shidoka-applications/actions/workflows/actions.yml)

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
@use '~@kyndryl-design-system/shidoka-foundation/scss/root.scss';
```

### CSS

```css
@import '@kyndryl-design-system/shidoka-foundation/css/root.css';
```

### JS

```js
import '@kyndryl-design-system/shidoka-foundation/css/root.css';
```

### Use CSS tokens/variables

After installation, you can make use of tokens/variables included in root.css such as the color tokens.

## Start using components

See [Storybook](https://kyndryl-design-system.github.io/shidoka-applications/) for the full components documentation.

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

This is a common bundling issue that can appear when you incorporate a component that has already bundled Shidoka components. Typically this would be caused by having a middle layer, for example a Common UI layer that has a cross-platform Header component built using Shidoka components.

#### Avoiding This

You can get around this in by not declaring Shidoka components as dependencies, and instead declaring them as external or peer dependencies in the middle/common layer.

For example, from the shidoka-applications rollup.js config using [the external option](https://rollupjs.org/configuration-options/#external): `external: [/shidoka-foundation\/components/]`. Since shidoka-foundation components are used within shidoka-applications components, this prevents the foundation components from being bundled, meaning it leaves the import statements unaltered (ex: `import '@kyndryl-design-system/...'`). This way, the application bundler can handle it instead.

This works with bundling from node_modules, but not with CDN hosted files since the deployed application won't know how to resolve aliased node_modules imports ex: `import '@kyndryl-design-system/...'`. In this case, you probably need a workaround.

#### Workaround

If for some reason the above suggestion does not help, there is a library containing a script/polyfill that can be used which allows custom elements to be redefined:
https://github.com/caridy/redefine-custom-elements. We've found that this script works best when served from the app's `<head>` tag.
