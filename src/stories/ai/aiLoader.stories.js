import { html } from 'lit';
import '../../components/reusable/loaders/aiLoader';

export default {
  title: 'AI/Components/AI Loaders',
  parameters: { design: { type: 'figma', url: '' } },
};

export const Default = {
  render: () => html`
    <div
      style="display:flex;align-items:center;justify-content:center;min-height:200px;"
    >
      <kyn-ai-loader
        size="default"
        ariaLabel="Loading AI analysis"
      ></kyn-ai-loader>
    </div>
  `,
};

export const Mini = {
  render: () => html`
    <div
      style="display:flex;align-items:center;justify-content:center;min-height:200px;"
    >
      <kyn-ai-loader
        size="mini"
        ariaLabel="Loading AI analysis (mini)"
      ></kyn-ai-loader>
    </div>
  `,
};
