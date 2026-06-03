import '../../components/global/header';
import '../../components/reusable/tabs';
import '../../components/reusable/iconSelector';

import bridgeLogo from '@kyndryl-design-system/shidoka-foundation/assets/svg/bridge-logo-large.svg';

import navData from './example_global_switcher_data.json';
import { createGlobalSwitcherPatternSnippetParameters } from './globalSwitcherPattern.js';
import { renderGlobalSwitcherHeader } from './globalSwitcherRender.js';

const args = {
  rootUrl: '/',
  appTitle: 'Application',
};

const headerSourceOptions = (renderArgs = args) => ({
  rootUrl: renderArgs.rootUrl,
  appTitle: renderArgs.appTitle,
});

const fullNavSourceOptions = {
  autoOpenFlyout: 'favorites',
  truncateLinks: true,
};

const patternSnippetParameters = (renderArgs = args) =>
  createGlobalSwitcherPatternSnippetParameters(
    navData,
    headerSourceOptions(renderArgs),
    fullNavSourceOptions
  );

const patternSnippetDescription = {
  story:
    'Copy the **Code** panel below — it includes pattern CSS, reference HTML, and trimmed `navData` exemplars with schema notes in one place.',
};

const renderFullSwitcher = (renderArgs) =>
  renderGlobalSwitcherHeader(navData, {
    ...headerSourceOptions(renderArgs),
    logoSvg: bridgeLogo,
    autoOpenFlyout: fullNavSourceOptions.autoOpenFlyout,
    truncateLinks: fullNavSourceOptions.truncateLinks,
  });

export default {
  title: 'Global Components/Header/Global Switcher',
  args,
  parameters: patternSnippetParameters(),
};

export const SlottedHTMLSwitcher = {
  name: 'Slotted HTML',
  parameters: {
    docs: {
      ...patternSnippetParameters().docs,
      description: patternSnippetDescription,
    },
  },
  render: renderFullSwitcher,
};

export const JSONSwitcher = {
  name: 'JSON-driven',
  parameters: {
    docs: {
      ...patternSnippetParameters().docs,
      description: patternSnippetDescription,
    },
  },
  render: renderFullSwitcher,
};
