/**
 * Global Switcher pattern — copy-paste HTML, Storybook Code snippet, dashboard source.
 * Storybook demo rendering lives in globalSwitcherRender.js (Lit + icons).
 */
import {
  createGlobalSwitcherStorySource,
  GLOBAL_SWITCHER_EQUAL_TAB_STYLE,
  GLOBAL_SWITCHER_PATTERN_STYLES,
} from './globalSwitcherPatternStyles.js';

export { GLOBAL_SWITCHER_PATTERN_STYLES, createGlobalSwitcherStorySource };

export const GLOBAL_SWITCHER_ICON_KEYS = [
  'recommend-filled',
  'recommend',
  'history',
  'catalog-management',
  'console',
  'services',
  'user-settings',
  'launch',
  'circle-stroke',
  'home',
  'dashboard',
];

export const GLOBAL_SWITCHER_DATA_REFERENCE_SOURCE = `// navData.sections[] — each item has a "type":
//   simple | mixed | tabbed | categorical
// Link: label, href, starred?, target?, icon?
// Section: id, label, icon, hideSearch?, dividerAfter? (simple), maxColumns? (categorical)`;

export const GLOBAL_SWITCHER_RENDER_LOGIC_SOURCE = `// Framework-agnostic: map navData.sections to markup.
// Icon keys: ${GLOBAL_SWITCHER_ICON_KEYS.join(', ')}

const TAB_STYLE = '${GLOBAL_SWITCHER_EQUAL_TAB_STYLE}';

const renderLink = (link) => {
  const attrs = [
    \`href="\${link.href || '#'}"\`,
    link.target ? \`target="\${link.target}"\` : '',
    link.target === '_blank' ? 'truncate' : '',
  ].filter(Boolean).join(' ');
  const label = link.icon
    ? \`<span class="global-switcher-link-label"><span class="global-switcher-link-icon"><!-- \${link.icon} --></span>\${link.label}</span>\`
    : \`<span>\${link.label}</span>\`;
  const star = \`<kyn-icon-selector\${link.starred ? ' checked' : ''}><span slot="icon-unchecked"></span><span slot="icon-checked"></span></kyn-icon-selector>\`;
  const launch = link.target === '_blank' ? '<span class="global-switcher-external-icon"></span>' : '';
  return \`<kyn-header-link \${attrs}>\${label}\${star}\${launch}</kyn-header-link>\`;
};

const renderCategory = (category, { spaced } = {}) =>
  \`<kyn-header-category heading="\${category.heading}"\${spaced ? ' class="global-switcher-category--spaced"' : ''}>
    <span slot="icon"><!-- \${category.icon || 'circle-stroke'} --></span>
    \${category.links.map(renderLink).join('')}
  </kyn-header-category>\`;

const renderLinksSlot = {
  simple: (s) => \`<kyn-header-category slot="links">\${s.links.map(renderLink).join('')}</kyn-header-category>\`,
  mixed: (s) => \`<div slot="links" class="global-switcher-mixed-links">\${s.topLinks.map(renderLink).join('')}\${s.categories.map((c) => renderCategory(c, { spaced: true })).join('')}</div>\`,
  tabbed: (s) => \`<kyn-tabs tabSize="md" slot="links" class="global-switcher-tabs">\${s.tabs.map((tab, i) => \`<kyn-tab slot="tabs" id="\${tab.id}" fill-width style="\${TAB_STYLE}"\${i === 0 ? ' selected' : ''}>\${tab.label}</kyn-tab>\`).join('')}\${s.tabs.map((tab, i) => \`<kyn-tab-panel tabId="\${tab.id}" noPadding\${i === 0 ? ' visible' : ''}><kyn-header-categories layout="masonry" limit-root-links="false">\${tab.categories.map(renderCategory).join('')}</kyn-header-categories></kyn-tab-panel>\`).join('')}</kyn-tabs>\`,
  categorical: (s) => \`<kyn-header-categories slot="links" layout="masonry" maxColumns="\${s.maxColumns || 3}" limit-root-links="false">\${s.categories.map(renderCategory).join('')}</kyn-header-categories>\`,
};

const renderSection = (section) => {
  const slot = renderLinksSlot[section.type]?.(section) ?? '';
  const attrs = [\`id="\${section.id}"\`, 'href="javascript:void(0)"', section.hideSearch ? 'hideSearch' : '', section.type === 'tabbed' ? 'full-width-flyout' : ''].filter(Boolean).join(' ');
  const divider = section.dividerAfter ? '<kyn-header-divider></kyn-header-divider>' : '';
  return \`<kyn-header-link \${attrs}><span><!-- \${section.icon} --></span>\${section.label}\${slot}</kyn-header-link>\${divider}\`;
};

// <kyn-header-nav class="global-switcher-nav" truncate-links auto-open-flyout="favorites">
//   \${navData.sections.map(renderSection).join('')}
// </kyn-header-nav>`;

const limit = (items = [], count = 2) => items.slice(0, count);

export const shrinkSectionForReference = (section) => {
  switch (section.type) {
    case 'simple':
      return { ...section, links: limit(section.links) };
    case 'mixed':
      return {
        ...section,
        topLinks: limit(section.topLinks, 1),
        categories: limit(section.categories, 1).map((category) => ({
          ...category,
          links: limit(category.links),
        })),
      };
    case 'tabbed':
      return {
        ...section,
        tabs: limit(section.tabs).map((tab) => ({
          ...tab,
          categories: limit(tab.categories, 1).map((category) => ({
            ...category,
            links: limit(category.links),
          })),
        })),
      };
    case 'categorical':
      return {
        ...section,
        categories: limit(section.categories, 2).map((category) => ({
          ...category,
          links: limit(category.links),
        })),
      };
    default:
      return section;
  }
};

export const pickReferenceSections = (sections = []) => {
  const seen = new Set();
  return sections
    .filter((section) => {
      if (seen.has(section.type)) return false;
      seen.add(section.type);
      return true;
    })
    .map(shrinkSectionForReference);
};

const escapeSource = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const indentSource = (markup, spaces = 2) => {
  const prefix = ' '.repeat(spaces);
  return markup
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
};

const iconPlaceholder = (icon, slot = '', className = '') => {
  const slotAttr = slot ? ` slot="${slot}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  return `<span${slotAttr}${classAttr}><!-- ${escapeSource(
    icon
  )} icon --></span>`;
};

const starSelectorSource = (checked = false) =>
  `<kyn-icon-selector${checked ? ' checked' : ''}>
  <span slot="icon-unchecked"></span>
  <span slot="icon-checked"></span>
</kyn-icon-selector>`;

const buildLinkSource = (link) => {
  const attrs = [
    `href="${escapeSource(link.href || '#')}"`,
    link.target ? `target="${escapeSource(link.target)}"` : '',
    link.target === '_blank' ? 'truncate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const label = link.icon
    ? `<span class="global-switcher-link-label">${iconPlaceholder(
        link.icon,
        '',
        'global-switcher-link-icon'
      )}${escapeSource(link.label)}</span>`
    : `<span>${escapeSource(link.label)}</span>`;

  const launch =
    link.target === '_blank'
      ? iconPlaceholder('launch', '', 'global-switcher-external-icon')
      : '';

  return [
    `<kyn-header-link ${attrs}>`,
    indentSource(
      [label, starSelectorSource(link.starred), launch]
        .filter(Boolean)
        .join('\n'),
      2
    ),
    '</kyn-header-link>',
  ].join('\n');
};

const buildCategorySource = (category, { spaced = false } = {}) => {
  const classAttr = spaced ? ' class="global-switcher-category--spaced"' : '';
  return [
    `<kyn-header-category heading="${escapeSource(
      category.heading
    )}"${classAttr}>`,
    indentSource(iconPlaceholder(category.icon || 'circle-stroke', 'icon'), 2),
    indentSource(category.links.map(buildLinkSource).join('\n'), 2),
    '</kyn-header-category>',
  ].join('\n');
};

const buildSectionTriggerSource = (section) => {
  const attrs = [
    `id="${escapeSource(section.id)}"`,
    'href="javascript:void(0)"',
    section.hideSearch ? 'hideSearch' : '',
    section.type === 'tabbed' ? 'full-width-flyout' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return [
    `<kyn-header-link ${attrs}>`,
    indentSource(iconPlaceholder(section.icon), 2),
    indentSource(escapeSource(section.label), 2),
  ].join('\n');
};

const buildLinksSlotSource = {
  simple: (section) =>
    [
      indentSource('<kyn-header-category slot="links">', 2),
      indentSource(section.links.map(buildLinkSource).join('\n'), 4),
      indentSource('</kyn-header-category>', 2),
    ].join('\n'),
  mixed: (section) =>
    [
      indentSource('<div slot="links" class="global-switcher-mixed-links">', 2),
      indentSource(
        [
          ...section.topLinks.map(buildLinkSource),
          ...section.categories.map((category) =>
            buildCategorySource(category, { spaced: true })
          ),
        ].join('\n'),
        4
      ),
      indentSource('</div>', 2),
    ].join('\n'),
  tabbed: (section) => {
    const tabs = section.tabs
      .map(
        (tab, index) =>
          `<kyn-tab slot="tabs" id="${escapeSource(
            tab.id
          )}" fill-width style="${GLOBAL_SWITCHER_EQUAL_TAB_STYLE}"${
            index === 0 ? ' selected' : ''
          }>
  ${escapeSource(tab.label)}
</kyn-tab>`
      )
      .join('\n');
    const panels = section.tabs
      .map(
        (tab, index) =>
          `<kyn-tab-panel tabId="${escapeSource(tab.id)}" noPadding${
            index === 0 ? ' visible' : ''
          }>
  <kyn-header-categories layout="masonry" limit-root-links="false">
${indentSource(tab.categories.map(buildCategorySource).join('\n'), 4)}
  </kyn-header-categories>
</kyn-tab-panel>`
      )
      .join('\n');

    return [
      indentSource(
        '<kyn-tabs tabSize="md" slot="links" class="global-switcher-tabs">',
        2
      ),
      indentSource(tabs, 4),
      indentSource(panels, 4),
      indentSource('</kyn-tabs>', 2),
    ].join('\n');
  },
  categorical: (section) =>
    [
      indentSource(
        `<kyn-header-categories slot="links" layout="masonry" maxColumns="${
          section.maxColumns || 3
        }" limit-root-links="false">`,
        2
      ),
      indentSource(section.categories.map(buildCategorySource).join('\n'), 4),
      indentSource('</kyn-header-categories>', 2),
    ].join('\n'),
};

const buildSectionSource = (section) => {
  const slot = buildLinksSlotSource[section.type]?.(section) ?? '';
  const divider = section.dividerAfter
    ? '<kyn-header-divider></kyn-header-divider>'
    : '';

  return [
    buildSectionTriggerSource(section),
    slot,
    '</kyn-header-link>',
    divider,
  ]
    .filter(Boolean)
    .join('\n');
};

const buildNavSource = (
  sections,
  { autoOpenFlyout = 'favorites', truncateLinks = true } = {}
) => {
  const navAttrs = [
    'class="global-switcher-nav"',
    autoOpenFlyout ? `auto-open-flyout="${escapeSource(autoOpenFlyout)}"` : '',
    truncateLinks ? 'truncate-links' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return [
    `<kyn-header-nav ${navAttrs}>`,
    indentSource(sections.map(buildSectionSource).join('\n'), 2),
    '</kyn-header-nav>',
  ].join('\n');
};

const buildHeaderSource = (
  navMarkup,
  { rootUrl = '/', appTitle = 'Application' } = {}
) =>
  [
    `<kyn-header rootUrl="${escapeSource(rootUrl)}" appTitle="${escapeSource(
      appTitle
    )}">`,
    '  <span slot="logo" style="--kyn-header-logo-width: 120px;"><!-- product logo --></span>',
    indentSource(navMarkup, 2),
    '</kyn-header>',
  ].join('\n');

const buildReferenceMarkup = (navData, headerOptions = {}, navOptions = {}) =>
  buildHeaderSource(
    buildNavSource(pickReferenceSections(navData.sections), navOptions),
    headerOptions
  );

export const createGlobalSwitcherSectionSource = buildSectionSource;

export const createGlobalSwitcherPatternSnippet = (
  navData,
  headerOptions = { rootUrl: '/', appTitle: 'Application' },
  navOptions = { autoOpenFlyout: 'favorites', truncateLinks: true }
) => {
  const referenceMarkup = createGlobalSwitcherStorySource(
    buildReferenceMarkup(navData, headerOptions, navOptions)
  );

  return [
    '================================================================================',
    'GLOBAL SWITCHER PATTERN — copy this Code panel',
    '================================================================================',
    '',
    '/* --- [1] Pattern CSS --- */',
    GLOBAL_SWITCHER_PATTERN_STYLES.trim(),
    '',
    '/* --- [2] Reference HTML (one exemplar per type; loop navData.sections in [4] for full nav) --- */',
    referenceMarkup,
    '',
    '/* --- [3] Navigation data --- */',
    `const navData = ${JSON.stringify(navData, null, 2)};`,
    '',
    '/* --- [4] Render logic --- */',
    `// Icon keys: ${GLOBAL_SWITCHER_ICON_KEYS.join(', ')}`,
    GLOBAL_SWITCHER_DATA_REFERENCE_SOURCE,
    '',
    GLOBAL_SWITCHER_RENDER_LOGIC_SOURCE.trim(),
  ].join('\n');
};

export const createGlobalSwitcherPatternSnippetParameters = (
  navData,
  headerOptions = {},
  navOptions = {}
) => ({
  docs: {
    source: {
      type: 'code',
      code: createGlobalSwitcherPatternSnippet(
        navData,
        headerOptions,
        navOptions
      ),
    },
  },
});
