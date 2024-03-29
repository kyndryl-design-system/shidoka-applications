# Shidoka Web Components for Applications

[![shidoka-applications](https://github.com/kyndryl-design-system/shidoka-applications/actions/workflows/actions.yml/badge.svg)](https://github.com/kyndryl-design-system/shidoka-applications/actions/workflows/actions.yml)

# Contributing to this project

Read the [Contributing Guide](CONTRIBUTING.md) here.

# Using this library in another project

## Install the package

<!-- Note: This will not work until you have configured the enterprise package registry following the instructions above. -->

```bash
npm install @kyndryl-design-system/shidoka-applications @kyndryl-design-system/shidoka-foundation -S
```

## Import the root stylesheet to your app's global styles

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

You can make use of tokens/variables included in root.css such as `--kd-header-height` to pad the body for the fixed position header, `--kd-page-gutter` for the padding on your main container, or any of the color tokens. These are very bare-bones currently, and will need to be fleshed out later.

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

React does not yet support automatic interop with Web Components. This means that React treats all props passed to Web Components as string attributes. It sounds like they are [planning to release it eventually](https://github.com/facebook/react/issues/11347#issuecomment-988970952), and is now available behind an `@experimental` flag. Until you've upgraded to a version of React that has support, you will need to use a library like [@lit/react](https://www.npmjs.com/package/@lit/react) to use these components in React.

Some options for React wrapper libraries:

1. [@lit/react](https://www.npmjs.com/package/@lit/react)
2. [reactify-wc](https://www.npmjs.com/package/reactify-wc)
3. [wc-react](https://www.npmjs.com/package/wc-react)

### Server-Side Rendering (SSR)

When using with an SSR framework like Next.js, you will encounter errors with code that only runs client-side, like `window` references for example. This is because web components cannot render on the server. Here is an article that provides some methods to work around this: [Using Non-SSR Friendly Components with Next.js](https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c) and [How to entirely disable server-side rendering in next.js v13?](https://stackoverflow.com/questions/75406728/how-to-entirely-disable-server-side-rendering-in-next-js-v13). Basically, they need their rendering deferred to only happen on the client-side.

Here is some additional information about why SSR does not work for web components, and some potential polyfills/solutions to enable server rendering: https://lit.dev/docs/ssr/overview/

### Handling `Failed to execute 'define' on 'CustomElementRegistry'`

#### The Problem

This is a common bundling issue that can appear when you incorporate a component that has already bundled Shidoka components. Typically this would be caused by having a middle layer, for example a Common UI layer that has a cross-platform Header component built using Shidoka components.

#### Avoiding This

You can get around this in by not declaring Shidoka components as dependencies, and instead declaring them as external or peer dependencies in the middle/common layer.

For example, from the shidoka-applications rollup.js config using [the external option](https://rollupjs.org/configuration-options/#external): `external: [/shidoka-foundation\/components/]`. Since shidoka-foundation components are used within shidoka-applications components, this prevents the foundation components from being bundled, meaning it leaves the import statements unaltered (ex: `import '@kyndryl-design-system/...'`). This way, the application bundler can handle it instead.

This works with bundling from node_modules, but not with CDN hosted files since the deployed application wouldn't know how to resolve aliased node_modules imports like: `import '@kyndryl-design-system/...'`. In this case you probably need a workaround.

#### Workaround

If for some reason the above suggestion does not help, there is a library containing a script/polyfill that can be used which allows custom elements to be redefined:
https://github.com/caridy/redefine-custom-elements.
