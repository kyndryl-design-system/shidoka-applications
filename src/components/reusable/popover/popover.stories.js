import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';

import '../button';
import '../link';

import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import lgCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cube.svg';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/cube.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export default {
  title: 'Components/Popover',
  component: 'kyn-popover',
  argTypes: {
    triggerType: {
      control: 'select',
      options: ['icon', 'link', 'button'],
    },
    direction: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
    },
    popoverSize: {
      control: 'select',
      options: ['mini', 'narrow', 'wide'],
    },
    open: { control: 'boolean' },
  },
};

const baseArgs = {
  triggerType: 'button',
  direction: 'auto',
  popoverSize: 'mini',
  open: false,
  okText: 'Primary Button',
  secondaryButtonText: 'Secondary Button',
  showSecondaryButton: true,
  titleText: 'Popover Title',
  labelText: 'Example label text content.',
};

const Template = (args) => {
  return html`
    <kyn-popover
      okText=${args.okText}
      cancelText=${args.cancelText}
      titleText=${args.titleText}
      labelText=${args.labelText}
      secondaryButtonText=${args.secondaryButtonText}
      ?showSecondaryButton=${args.showSecondaryButton}
      triggerType=${args.triggerType}
      direction=${args.direction}
      popoverSize=${args.popoverSize}
      ?open=${args.open}
      @on-open=${() => action('on-open')()}
      @on-close=${() => action('on-close')()}
    >
      <!-- anchor -->
      ${args.triggerType === 'icon'
        ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
        : args.triggerType === 'link'
        ? html`<kyn-link slot="anchor" kind="primary">Launch</kyn-link>`
        : html`<kyn-button slot="anchor" kind="primary">Launch</kyn-button>`}

      <!-- default slot – *no* slot="default" -->
      ${args.popoverSize === 'mini'
        ? html`
            <div
              class="expansion-slot"
              style="display: flex; flex-direction: row; align-items: center; justify-content: center; background-color: var(--kd-color-background-container-subtle); padding: 4px 8px; border-radius: 4px; border: 1px dashed var(--kd-color-utility-variant-border); width: 95%; text-align: center;"
            >
              <span
                class="cube-icon"
                style="display: inline-flex; align-items: center; color: var(--kd-color-icon-brand); width: 24px; height: 24px; margin-right: 8px;"
                >${unsafeSVG(smCube)}</span
              >
              <span>Slot</span>
            </div>
          `
        : html`
            <div
              class="expansion-slot"
              style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: var(--kd-color-background-container-subtle); padding: 32px 16px; height: 255px; border-radius: 4px; border: 1px dashed var(--kd-color-utility-variant-border);"
            >
              <span class="cube-icon" style="color: var(--kd-color-icon-brand);"
                >${unsafeSVG(lgCube)}</span
              >
              <h3
                style=" font-size: 16px; font-style: normal; font-weight: 500; line-height: 24px; letter-spacing: 0.32px;"
              >
                Slot Content
              </h3>
              <p
                style="font-size: 12px; font-style: normal; font-weight: 300; line-height: 16px;letter-spacing: 0.32px;"
              >
                Swap this with your own component.
              </p>
            </div>
          `}
    </kyn-popover>
  `;
};

export const Default = {
  render: Template,
  args: {
    ...baseArgs,
    triggerType: 'button',
    open: false,
  },
};

export const OpenMini = {
  render: Template,
  args: {
    ...baseArgs,
    open: false,
  },
};

export const ManualTopWide = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'top',
    popoverSize: 'wide',
    open: false,
  },
};

export const ManualLeftNarrow = {
  render: Template,
  args: {
    ...baseArgs,
    triggerType: 'link',
    direction: 'left',
    popoverSize: 'narrow',
    open: false,
  },
};

export const IconWideAutoClosed = {
  render: Template,
  args: {
    ...baseArgs,
    titleText: '',
    labelText: '',
    triggerType: 'icon',
    direction: 'auto',
    popoverSize: 'wide',
    open: false,
  },
};
