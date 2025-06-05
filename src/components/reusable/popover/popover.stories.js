import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import cube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cube.svg';

import '../button';
import '../textInput';
import '../badge';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export default {
  title: 'Components/Popover',
  component: 'kyn-popover',
  argTypes: {
    size: {
      options: ['mini', 'narrow', 'wide'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  open: false,
  size: 'auto',
  titleText: 'Modal Title',
  labelText: '',
  okText: 'Pria',
  cancelText: 'Cancel',
  closeText: 'Close',
  destructive: false,
  okDisabled: false,
  hideFooter: false,
  showSecondaryButton: true,
  secondaryButtonText: 'Secondary',
  secondaryDisabled: false,
  hideCancelButton: false,
  aiConnected: false,
  disableScroll: false,
};

export const WidePopover = {
  args: {
    ...args,
    size: 'wide',
  },
  render: (args) => {
    return html`
      <kyn-popover
        size="wide"
        titleText="Wide Popover Title"
        labelText="Wide Popover Label"
      >
        <kyn-button slot="anchor" kind="primary">Wide Popover</kyn-button>
        <div
          slot="expansion"
          style="background: var(--kd-color-background-container-subtle); padding: 16px; margin-top: 16px; border-radius: 4px;       text-align: center;"
        >
          <span
            slot="icon"
            class="cube-icon"
            style="color: var(--kd-color-icon-brand);"
            >${unsafeSVG(cube)}</span
          >
          <h3>Expansion Slot</h3>
          <p>Swap this content with your own component.</p>
        </div>
      </kyn-popover>
    `;
  },
};

export const NarrowPopover = {
  args: {
    ...args,
    size: 'narrow',
  },
  render: (args) => {
    return html`
      <kyn-popover
        size="narrow"
        titleText="Narrow Popover Title"
        labelText="Narrow Popover Label"
      >
        <kyn-button slot="anchor" kind="secondary">Narrow Popover</kyn-button>
        <div
          slot="expansion"
          style="background: var(--kd-color-background-container-subtle); padding: 16px; margin-top: 16px; border-radius: 4px;       text-align: center;"
        >
          <span
            slot="icon"
            class="cube-icon"
            style="color: var(--kd-color-icon-brand);"
            >${unsafeSVG(cube)}</span
          >
          <h3>Expansion Slot</h3>
          <p>Swap this content with your own component.</p>
        </div>
      </kyn-popover>
    `;
  },
};

export const MiniPopover = {
  args: {
    ...args,
    size: 'mini',
  },
  render: (args) => {
    return html`
      <kyn-popover size="mini">
        <kyn-button slot="anchor" kind="tertiary">Mini Popover</kyn-button>
        <div
          slot="expansion"
          style="background: var(--kd-color-background-container-subtle); padding: 16px; 
          text-align: center;border-radius: 4px;"
        >
          <div>
            <span
              slot="icon"
              class="cube-icon"
              style="padding: 0; margin-left: 10px; display: inline-flex; align-items: center; color: var(--kd-color-icon-brand);"
              >${unsafeSVG(cube)}</span
            ><span
              style="display: inline-flex; align-items: center; color: var(--kd-color-text); font-size: 14px; font-weight: 500; margin-left: 8px;"
              >Slot</span
            >
          </div>
        </div>
      </kyn-popover>
    `;
  },
};
