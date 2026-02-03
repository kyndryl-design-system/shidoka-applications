import { html } from 'lit';

import '../../reusable/floatingContainer';
// Use the built JS for the component you’re showcasing.
// Adjust the path/filename to match your build output.
import './aiSIdeDrawer';

import { useArgs } from 'storybook/preview-api';
import { action } from 'storybook/actions';

export default {
  title: 'AI/Components/AI Side Drawer',
  component: 'kyn-ai-side-drawer',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300055&p=f&m=dev',
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the AI Side Drawer is disabled.',
    },
  },
};

export const Default = {
  args: {
    disabled: false,
  },
  render: () => {
    const [{ disabled }, updateArgs] = useArgs();

    const onDrawerTabChange = (e) => {
      action('drawer-tab-change')(e.detail);
      if (e?.detail?.selectedTabId) {
        updateArgs({ selectedTabId: e.detail.selectedTabId });
      }
    };

    const onDrawerChatSelected = (e) => {
      action('drawer-chat-selected')(e.detail);
      // example: e.detail = { id, title, href }
    };

    const onDismissActivity = () => {
      action('dismiss')();
      updateArgs({ showActivity: false });
    };

    return html`
      <kyn-ai-side-drawer
        class="modal-left"
        ?disabled=${disabled}
        @drawer-tab-change=${onDrawerTabChange}
        @drawer-chat-selected=${onDrawerChatSelected}
        @dismiss=${onDismissActivity}
      ></kyn-ai-side-drawer>
    `;
  },
};
