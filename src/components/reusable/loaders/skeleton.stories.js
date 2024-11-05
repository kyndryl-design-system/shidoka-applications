import { html } from 'lit';
import './index';
import '../card/index';

export default {
  title: 'Components/Loaders/Skeleton',
  component: 'kyn-skeleton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Block = {
  render: () => {
    return html` <kyn-skeleton size="block"></kyn-skeleton> `;
  },
};

export const Inline = {
  render: () => {
    return html` <kyn-skeleton inline size="medium"></kyn-skeleton> `;
  },
};

export const CardPattern = {
  render: () => {
    return html`
      <div class="card-pattern">
        <kyn-card>
          <kyn-skeleton size="large"></kyn-skeleton>
          <kyn-skeleton size="title"></kyn-skeleton>
          <kyn-skeleton size="subtitle"></kyn-skeleton>
          <div class="card-body">
            <kyn-skeleton size="small"></kyn-skeleton>
          </div>
        </kyn-card>
      </div>
    `;
  },
};
