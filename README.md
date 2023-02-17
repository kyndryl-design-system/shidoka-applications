# Kyndryl Design System - Web Components

[![kyndryl-web-components](https://github.kyndryl.net/kyndryl-design-system/web-components/actions/workflows/actions.yml/badge.svg)](https://github.kyndryl.net/kyndryl-design-system/web-components/actions/workflows/actions.yml)

## Usage

### Configuring your environments to enable installation of packages from the GitHub Enterprise npm package registry.

1. Create a [Personal Access Token](https://github.kyndryl.net/settings/tokens) with `read:packages` permission.
   1. Save the generated token somewhere safe for the next steps.
   2. Do NOT commit this secret to your project repository.
2. Create a `.npmrc` file in your project root with the following content:

```
//npm.github.kyndryl.net/:_authToken=${GH_TOKEN_PACKAGES}
@kyndryl-design-system:registry=https://npm.github.kyndryl.net
```

3. Set up the Personal Access Token in your local environment.
   1. Create an environment variable, named `GH_TOKEN_PACKAGES`, for whichever os/shell you are using locally.
      1. Git Bash example: Add a `.bashrc` file to your user home directory with the content: `export GH_TOKEN_PACKAGES=<your-token-here>`
      1. You will have to restart your shell/terminal after.
4. Set up the Personal Access Token in your CI environment. This example is for GitHub Actions.
   1. Create a new repository secret at: `https://github.kyndryl.net/<your-project-path>/settings/secrets/actions/new`
   1. Name the token `GH_TOKEN_PACKAGES`.
   1. Paste in the token you generated previously to the Secret field.

### Install the package

Note: This will not work until you have configured the enterprise package registry following the instructions above.

```bash
# official release
npm install @kyndryl-design-system/web-components -S

# beta release
npm install @kyndryl-design-system/web-components@beta -S
```

### Start using components

See [Storybook](https://pages.github.kyndryl.net/kyndryl-design-system/web-components/) for the full components documentation.

**Example:**

```js
import { Button } from '@kyndryl-design-system/web-components';
```

```html
<kyn-button>Button</kyn-button>
```

## Contributing

### Scripts

```bash
# install
npm i --legacy-peer-deps

# run development env
npm run storybook

# build
npm run build

# lint
npm run lint

# test (must run build first)
npm run test

# generate new custom-elements.json (updates storybook docs/args)
npm run analyze

# format all files with prettier
npm run format
```

### Guidelines

1. Commits
   1. Commit messages MUST use [Conventional Commit format](https://www.conventionalcommits.org).
   1. [Certain commit types](https://semantic-release.gitbook.io/semantic-release/#commit-message-format) like `fix:` (patch), `feat:` (minor), and `perf:` (major) or `BREAKING CHANGE:` (in the commit body or footer, major), will automatically trigger a release to publish a new package and update the semantic version.
   1. [Cheat Sheet](https://gist.github.com/Zekfad/f51cb06ac76e2457f11c80ed705c95a3)
1. Branching
   1. `main` branch is for current version changes.
   1. `beta` branch is for future version/prerelease changes. This will be the default branch in GitHub and for storybook deploys until initial release.
   1. Use the [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
   1. Delete branches after merging.
1. Documentation
   1. Document everything in your components with [JSDoc](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc)
   1. Update the `custom-elements.json` file with the `npm run analyze` script any time you add or change documentation. This is where the Storybook args tables are derived from.

### Third-Party Docs Reference

1. [Lit](https://lit.dev/docs/)
1. [Storybook](https://storybook.js.org/docs/7.0/web-components/get-started/introduction)
1. [@carbon](https://github.com/carbon-design-system/carbon)
   1. [Icons](https://github.com/carbon-design-system/carbon/tree/main/packages/icons)
1. [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)
1. [@open-wc/testing](https://open-wc.org/docs/testing/testing-package/)
1. [TypeScript](https://www.typescriptlang.org/docs/)
1. [SCSS](https://sass-lang.com/guide)
1. [Rollup](https://rollupjs.org/guide/en/)
