/**
 * Default workspace switcher boilerplate for pages that include a workspace switcher
 * in the header. Use this unless the consuming app supplies its own workspace JSON.
 *
 * Data shape:
 * - workspaces: Array<{ id: string, name: string, count: number }>
 * - itemsByWorkspace: Record<workspaceId, Array<{ id: string, name: string }>>
 * - accountDetails: { accountId: string, country: string } for the slot="left" meta block
 *
 * Rule: "Global Zone (All)" count = sum of all other workspace counts; its items =
 * union of all itemsByWorkspace entries.
 */

export const defaultWorkspaceSwitcherData = {
  accountDetails: {
    accountId: '023497uw02399023509',
    country: 'United States',
  },
  workspaces: [
    { id: 'global', name: 'Global Zone (All)', count: 6 },
    { id: 'tenants', name: 'Account Tenants', count: 3 },
    { id: 'compute', name: 'Compute Zones', count: 3 },
  ],
  itemsByWorkspace: {
    global: [
      { id: 't-1', name: 'Acme Corporation' },
      { id: 't-2', name: 'Beta Industries' },
      { id: 't-3', name: 'Cascade Systems' },
      { id: 'c-1', name: 'US East (Virginia)' },
      { id: 'c-2', name: 'US West (Oregon)' },
      { id: 'c-3', name: 'US West (California)' },
    ],
    tenants: [
      { id: 't-1', name: 'Acme Corporation' },
      { id: 't-2', name: 'Beta Industries' },
      { id: 't-3', name: 'Cascade Systems' },
    ],
    compute: [
      { id: 'c-1', name: 'US East (Virginia)' },
      { id: 'c-2', name: 'US West (Oregon)' },
      { id: 'c-3', name: 'US West (California)' },
    ],
  },
};

/**
 * Resolves display name by item id from data. Use this so the nav rail trigger
 * never shows the raw id (e.g. "t-2"); it always shows the account name.
 * @param {typeof defaultWorkspaceSwitcherData} data
 * @param {string} id
 * @returns {string}
 */
function getNameById(data, id) {
  for (const items of Object.values(data.itemsByWorkspace)) {
    const found = items.find((it) => it.id === id);
    if (found) return found.name;
  }
  return id;
}

/**
 * Wires workspace switcher behavior: left-list clicks switch workspace and repopulate
 * right-list; right-list clicks update selection and the trigger label.
 * Call from Storybook play() with canvasElement, or from app code with the root element.
 *
 * The trigger label is always set from the data's name (by id) so the nav rail
 * never displays the raw item id.
 *
 * @param {Element} rootEl - Root containing #workspace-switcher and #workspace-trigger-label
 * @param {typeof defaultWorkspaceSwitcherData} [data] - Workspace data; defaults to defaultWorkspaceSwitcherData
 */
export function setupWorkspaceSwitcher(
  rootEl,
  data = defaultWorkspaceSwitcherData
) {
  const root = rootEl || document;
  const switcher = root.querySelector?.('#workspace-switcher');
  const triggerLabel = root.querySelector?.('#workspace-trigger-label');
  if (!switcher) return;

  switcher.addEventListener('on-click', (e) => {
    const menuItem = e.target?.closest?.('kyn-workspace-switcher-menu-item');
    if (!menuItem || !e.detail?.value) return;
    const slot = menuItem.getAttribute('slot');
    const value = e.detail.value;

    if (slot === 'left-list') {
      switcher.view = 'detail';
      switcher
        .querySelectorAll('kyn-workspace-switcher-menu-item[slot="left-list"]')
        .forEach((el) => {
          el.selected = el.getAttribute('value') === value;
        });
      const items =
        value === 'global'
          ? data.itemsByWorkspace.global
          : data.itemsByWorkspace[value] || [];
      switcher
        .querySelectorAll('kyn-workspace-switcher-menu-item[slot="right-list"]')
        .forEach((el) => el.remove());
      items.forEach((item, index) => {
        const el = document.createElement('kyn-workspace-switcher-menu-item');
        el.slot = 'right-list';
        el.variant = 'item';
        el.value = item.id;
        el.name = item.name;
        el.selected = index === 0;
        el.addEventListener('on-click', () => {
          switcher
            .querySelectorAll(
              'kyn-workspace-switcher-menu-item[slot="right-list"]'
            )
            .forEach((n) => {
              n.selected = n.getAttribute('value') === item.id;
            });
          const name = item.name;
          if (triggerLabel) {
            triggerLabel.textContent = name;
            triggerLabel.title = name;
          }
          const metaName = switcher.querySelector('.account-meta-info__name');
          if (metaName) {
            metaName.textContent = name;
            metaName.title = name;
          }
        });
        switcher.appendChild(el);
      });
    } else if (slot === 'right-list') {
      // Always resolve name from data by id so the nav rail never shows raw id (e.g. "t-2")
      const name = getNameById(data, value);
      if (triggerLabel) {
        triggerLabel.textContent = name;
        triggerLabel.title = name;
      }
      const metaName = switcher.querySelector('.account-meta-info__name');
      if (metaName) {
        metaName.textContent = name;
        metaName.title = name;
      }
      switcher
        .querySelectorAll('kyn-workspace-switcher-menu-item[slot="right-list"]')
        .forEach((el) => {
          el.selected = el.getAttribute('value') === value;
        });
    }
  });
}
