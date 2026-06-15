import { html } from 'lit';
import { action } from 'storybook/actions';
import './index';

export default {
  title: 'Examples/Split Button',
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      disable: true,
    },
  },
};

export const NearViewportEdge = {
  parameters: {
    docs: {
      description: {
        story:
          'A split button pinned to the far-right edge of a scrollable page, with a menu wider than the button itself. When opened, the menu detects that a left-aligned dropdown would overflow the viewport and automatically anchors to the right edge (opening toward the left) so it stays fully visible — without introducing any horizontal page scroll.',
      },
    },
  },
  render: () => {
    return html`
      <div
        style="
          min-height: 150vh;
          padding: 32px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
        "
      >
        <p style="max-width: 60ch; margin: 0;">
          The split button below is pinned to the far-right edge of this
          scrollable page. Opening its menu keeps the dropdown fully within the
          viewport (it opens toward the left) and does not introduce any
          horizontal page scroll.
        </p>

        <div style="display: flex; justify-content: flex-end;">
          <kyn-split-btn
            label="Download"
            description="Download options"
            menuMinWidth="260px"
            @on-click=${(e) => action(e.type)({ ...e, detail: e.detail })}
          >
            <kyn-splitbutton-option value="1"
              >Standard Drill Planner</kyn-splitbutton-option
            >
            <kyn-splitbutton-option value="2"
              >Download Workloads</kyn-splitbutton-option
            >
            <kyn-splitbutton-option value="3"
              >Workload Group Association</kyn-splitbutton-option
            >
          </kyn-split-btn>
        </div>
      </div>
    `;
  },
};
