import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

export default {
  title: 'Components/SideDrawer',
  component: 'kyn-side-drawer',
  argTypes: {
    size: {
      options: ['md', 'sm'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pQKkip0UrZqEbaGN2dQ3dY/Istanbul-Release?type=design&node-id=8-9732&mode=design&t=PzDSmelS0t4Y4gte-0',
    },
  },
};

const args = {
  open: false,
  size: 'md',
  titleText: 'Drawer Title',
  labelText: 'Label',
  submitBtnText: 'Ok',
  cancelBtnText: 'Cancel',
  submitBtnDisabled: false,
  hideFooter: false,
};

const dropDownArgs = {
  label: 'Label',
  placeholder: '',
  size: 'md',
  inline: false,
  name: 'example',
  open: false,
  required: false,
  disabled: false,
  hideTags: false,
  selectAll: false,
  selectAllText: 'Select all',
  invalidText: '',
  caption: '',
};

const textAreaArgs = {
  unnamed: 'Label',
  name: 'name',
  value: '',
  placeholder: 'Placeholder',
  caption: '',
  required: false,
  disabled: false,
  invalidText: '',
  minLength: undefined,
  maxLength: undefined,
};

export const SideDrawer = {
  args,
  render: (args) => {
    return html`
      <kyn-side-drawer
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        submitBtnText=${args.submitBtnText}
        cancelBtnText=${args.cancelBtnText}
        ?submitBtnDisabled=${args.submitBtnDisabled}
        ?hideFooter=${args.hideFooter}
        @on-close=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Open Drawer</span>

        <div>
          This is a simple paragraph for the drawer content. You can customize
          and add more content / components here as needed.
        </div>
        <br />
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus,
          purus vitae egestas mollis, augue augue interdum quam, sit amet
          volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat,
          sed placerat metus bibendum. Suspendisse pretium nibh
        </div>
      </kyn-side-drawer>
    `;
  },
};

export const BeforeClose = {
  args,
  render: (args) => {
    return html`
      <kyn-side-drawer
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        labelText=${args.labelText}
        submitBtnText=${args.submitBtnText}
        cancelBtnText=${args.cancelBtnText}
        ?submitBtnDisabled=${args.submitBtnDisabled}
        ?hideFooter=${args.hideFooter}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
      >
        <span slot="anchor">Open Drawer</span>

        <div>
          This is a simple paragraph for the drawer content. You can customize
          and add more content / components here as needed.
        </div>
        <br />
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus,
          purus vitae egestas mollis, augue augue interdum quam, sit amet
          volutpat justo magna quis justo. Aliquam dapibus mi a arcu consequat,
          sed placerat metus bibendum. Suspendisse pretium nibh
        </div>
      </kyn-side-drawer>
    `;
  },
};

const handleBeforeClose = (returnValue) => {
  if (returnValue === 'ok') {
    return confirm(`beforeClose handler triggered.`);
  } else {
    return true;
  }
};
