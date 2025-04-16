import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../../reusable/floatingContainer';
import './aiLaunchButton';

export default {
  title: 'AI/Components/AI Launch Button',
  component: 'kyn-ai-launch-btn',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300055&p=f&m=dev',
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the AI Assistant button is disabled.',
    },
  },
};

export const Default = {
  args: {
    disabled: false,
  },
  render: (args) => html`
    <div style="padding-bottom:80px;">
      <!-- Add some space in bottom so FAB doesn't obstruct any essestial UI element -->
      <!-- Add some long content here to see the floating button in action -->
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum
      </p>
    </div>
    <kyn-button-float-container>
      <kyn-ai-launch-btn
        ?disabled="${args.disabled}"
        @on-click=${() => action('on-click')()}
      ></kyn-ai-launch-btn>
    </kyn-button-float-container>
  `,
};

export const Disabled = {
  args: {
    disabled: true,
  },
  render: (args) => html`
    <div style="padding-bottom:80px;">
      <!-- Add some space in bottom so FAB doesn't obstruct any essestial UI element -->
      <!-- Add some long content here to see the floating button in action -->
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum
      </p>
    </div>
    <kyn-button-float-container>
      <kyn-ai-launch-btn
        ?disabled="${args.disabled}"
        @on-click=${() => action('on-click')()}
      ></kyn-ai-launch-btn>
    </kyn-button-float-container>
  `,
};
