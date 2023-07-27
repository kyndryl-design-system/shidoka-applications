# Contributing

## Scripts

```bash
# install
npm i --legacy-peer-deps

# run development env
npm run dev

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

## Guidelines

1. Commits
   1. Commit messages MUST use [Conventional Commit format](https://www.conventionalcommits.org).
   1. [Certain commit types](https://semantic-release.gitbook.io/semantic-release/#commit-message-format) like `fix:` (patch), `feat:` (minor), and `perf:` (major) or `BREAKING CHANGE:` (in the commit body or footer, major), will automatically trigger a release to publish a new package and update the semantic version.
   1. [Conventional Commits Cheat Sheet](https://gist.github.com/Zekfad/f51cb06ac76e2457f11c80ed705c95a3)
   1. Git hooks are installed to enforce commit message formatting with commitlint, and code formatting with Prettier.
1. Branching
   1. `main` branch is for stable/current version changes.
   1. `beta` branch is for future version/prerelease changes. This will be the default branch in GitHub and for storybook deploys until initial release.
   1. Prefix your branch names based on the type of change, ex `feature/`, `bugfix/`, or `hotfix/`.
   1. Use the [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow).
      ![image](https://i0.wp.com/build5nines.com/wp-content/uploads/2018/01/GitHub-Flow.png)
1. Code Review
   1. Always have someone peer review your PR.
   1. Status checks must pass.
   1. Strongly recommend using the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to ensure consistent formatting.
1. Releases
   1. Releases will trigger automatically when the right commit messages are pushed to `main` or `beta`.
   1. All testing must be done on the PR level before merging, since the release will happen automatically after merge.
1. Creating Components
   1. Components should be contained within their own folder containing `ts`, `scss`, `test`, and `stories` files. Subcomponents can share the same folder.
   1. Add new components to the root `index.ts` file.
   1. Everything in the design system should be 100% generic. Remember that these components could be used to build any application. Application concerns must be separated.
   1. Use Lit [directives](https://lit.dev/docs/templates/directives/) and [decorators](https://lit.dev/docs/components/decorators/) whenever possible.
   1. Build responsive, build clean, focus on style and performance, enhance with quick and smooth animations.
1. Documentation
   1. Document everything in your components with [JSDoc](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc).
   1. Update the `custom-elements.json` file with the `npm run analyze` script any time you add or change documentation. This is where the Storybook args tables are derived from.
   1. Write your storybook stories with controls enabled for every property where possible.
   1. When building modular components with subcomponents, write multiple stories to show different variations. Include any subcomponents in the main story so it renders a new tab with an args table.
1. Testing
   1. Testing strategy TBD.

## Third-Party Docs Reference

1. [Lit](https://lit.dev/docs/)
1. [Storybook](https://storybook.js.org/docs/7.0/web-components/get-started/introduction)
1. [@carbon](https://github.com/carbon-design-system/carbon)
   1. [Icons](https://github.com/carbon-design-system/carbon/tree/main/packages/icons)
1. [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)
1. [@open-wc/testing](https://open-wc.org/docs/testing/testing-package/)
1. [TypeScript](https://www.typescriptlang.org/docs/)
1. [SCSS](https://sass-lang.com/guide)
1. [Rollup](https://rollupjs.org/guide/en/)
