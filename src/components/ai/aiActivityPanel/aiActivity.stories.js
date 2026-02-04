import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '../../../components/reusable/button';
import '../../../components/reusable/textInput';
import { useArgs } from 'storybook/preview-api';

// ✅ Make sure this path points to the file that DOES:
//   @customElement('kyn-activity-panel')
//   export class KynActivityPanel extends LitElement { ... }
import '../aiActivityPanel';

export default {
  title: 'AI/Components/ActivityPanel',
  component: 'kyn-activity-panel',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-546829&p=f&t=A5tcETiCf23sAgKK-0',
    },
  },
};

export const ActivityPanel = {
  args: {
    showActivity: true,
    activityItems: [
      {
        id: '1',
        title: 'RCA flow started',
        description: 'Starting to pull together relevant sources',
        status: 'done',
      },
      {
        id: '2',
        title: 'Reviewing the Incident',
        description:
          'Incident Summarizer is reviewing content to create an incident summary.',
        status: 'done',
      },
    ],
  },

  render: () => {
    const [{ showActivity, activityItems }, updateArgs] = useArgs();

    const onDismissActivity = () => {
      action('dismiss')();
      updateArgs({ showActivity: false });
    };

    return html`
      ${showActivity
        ? html`
            <kyn-activity-panel-ai
              title="Activity"
              subtitleText="Reviewing logs"
              two-line
              @dismiss=${onDismissActivity}
            >
              <div>
                <h3>TITLE</h3>
                <p>you can put items in this body</p>
              </div>
            </kyn-activity-panel-ai>
          `
        : html`
            <!-- Optional: a button to show it again for demo -->
            <kyn-button
              kind="ghost-ai"
              @on-click=${() => updateArgs({ showActivity: true })}
            >
              Show Activity
            </kyn-button>
          `}
    `;
  },
};
export const ActivityPanelAlternate = {
  args: {
    showActivity: true,
    activityItems: [
      {
        id: '1',
        title: 'RCA flow started',
        description: 'Starting to pull together relevant sources',
        status: 'done',
      },
      {
        id: '2',
        title: 'Reviewing the Incident',
        description:
          'Incident Summarizer is reviewing content to create an incident summary.',
        status: 'done',
      },
    ],
  },

  render: () => {
    const [{ showActivity, activityItems }, updateArgs] = useArgs();

    const onDismissActivity = () => {
      action('dismiss')();
      updateArgs({ showActivity: false });
    };

    return html`
      ${showActivity
        ? html`
            <kyn-activity-panel-ai
              title="Activity"
              subtitleText="Reviewing logs"
              .items=${activityItems}
              two-line
              @dismiss=${onDismissActivity}
            >
            </kyn-activity-panel-ai>
          `
        : html`
            <!-- Optional: a button to show it again for demo -->
            <kyn-button
              kind="ghost-ai"
              @on-click=${() => updateArgs({ showActivity: true })}
            >
              Show Activity
            </kyn-button>
          `}
    `;
  },
};
