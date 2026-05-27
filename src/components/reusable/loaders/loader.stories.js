import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';

export default {
  title: 'Components/Feedback & Status/Loaders/Loader',
  component: 'kyn-loader',
};

export const Block = {
  args: {
    stopped: false,
  },
  render: (args) => {
    return html`
      <kyn-loader
        ?stopped=${args.stopped}
        @on-start=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-stop=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-loader>
    `;
  },
};

export const Overlay = {
  args: {
    stopped: false,
  },
  render: (args) => {
    return html`
      <kyn-loader
        overlay
        ?stopped=${args.stopped}
        @on-start=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-stop=${(e) => action(e.type)({ ...e, detail: e.detail })}
      ></kyn-loader>
    `;
  },
};
