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
    popoverSize: { control: 'select', options: ['mini', 'narrow', 'wide'] },
    top: { control: 'text' },
    left: { control: 'text' },
    bottom: { control: 'text' },
    right: { control: 'text' },
    arrowOffset: { control: 'text' },
    triggerType: { control: 'select', options: ['icon', 'link', 'button'] },
    direction: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
    },
  },
};

const baseArgs = {
  isAnchored: true,
  top: undefined,
  right: undefined,
  bottom: undefined,
  left: undefined,
  arrowOffset: undefined,
  triggerType: 'button',
  direction: 'auto',
  popoverSize: 'mini',
  okText: 'Primary Button',
  secondaryButtonText: 'Secondary Button',
  showSecondaryButton: true,
  titleText: 'Popover Title',
  labelText: 'Example label text content.',
  destructive: false,
  cancelText: '',
  open: false,
  closeText: 'Close',
};

const Template = (args) => html`
  <kyn-popover
    ?isAnchored=${args.isAnchored}
    okText=${args.okText}
    cancelText=${args.cancelText}
    titleText=${args.titleText}
    labelText=${args.labelText}
    secondaryButtonText=${args.secondaryButtonText}
    ?showSecondaryButton=${args.showSecondaryButton}
    triggerType=${args.triggerType}
    direction=${args.direction}
    popoverSize=${args.popoverSize}
    top=${args.top}
    left=${args.left}
    bottom=${args.bottom}
    right=${args.right}
    arrowOffset=${args.arrowOffset}
    @on-open=${() => action('on-open')()}
    @on-close=${() => action('on-close')()}
  >
    ${args.triggerType === 'icon'
      ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
      : args.triggerType === 'link'
      ? html`<kyn-link slot="anchor" kind="primary">Launch</kyn-link>`
      : html`<kyn-button slot="anchor" kind="primary">Launch</kyn-button>`}
    ${args.popoverSize === 'mini'
      ? html`
          <div
            class="expansion-slot"
            style="
              display:flex;
              align-items:center;
              justify-content:center;
              background:var(--kd-color-background-container-subtle);
              padding:4px 8px;
              border-radius:4px;
              border:1px dashed var(--kd-color-utility-variant-border);
              width:95%;
              text-align:center;
            "
          >
            <span
              class="cube-icon"
              style="
                display:inline-flex;
                align-items:center;
                color:var(--kd-color-icon-brand);
                width:24px;
                height:24px;
                margin-right:8px;
              "
              >${unsafeSVG(smCube)}</span
            >
            <span>Slot</span>
          </div>
        `
      : html`
          <div
            class="expansion-slot"
            style="
              text-align:center;
              display:flex;
              flex-direction:column;
              align-items:center;
              justify-content:center;
              background:var(--kd-color-background-container-subtle);
              padding:32px 16px;
              height:255px;
              border-radius:4px;
              border:1px dashed var(--kd-color-utility-variant-border);
            "
          >
            <span class="cube-icon" style="color:var(--kd-color-icon-brand);"
              >${unsafeSVG(lgCube)}</span
            >
            <h3
              style="font-size:16px;font-weight:500;line-height:24px;letter-spacing:0.32px;"
            >
              Slot Content
            </h3>
            <p
              style="font-size:12px;font-weight:300;line-height:16px;letter-spacing:0.32px;"
            >
              Swap this with your own component.
            </p>
          </div>
        `}
  </kyn-popover>
`;

export const DefaultAuto = {
  render: Template,
  args: { ...baseArgs },
};

export const ManualBottomWide = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'bottom',
    popoverSize: 'wide',
  },
};

export const ManualLeftLinkNarrow = {
  render: Template,
  args: {
    ...baseArgs,
    triggerType: 'link',
    direction: 'right',
    popoverSize: 'narrow',
  },
};

export const FloatingUpperNoHeader = {
  render: Template,
  args: {
    ...baseArgs,
    isAnchored: false,
    titleText: '',
    labelText: '',
    popoverSize: 'narrow',
    direction: 'left',
    top: '5%',
    right: '1%',
  },
};

export const WideFloatingLower = {
  render: Template,
  args: {
    ...baseArgs,
    isAnchored: false,
    popoverSize: 'wide',
    direction: 'left',
    bottom: '5%',
    right: '2%',
  },
};

export const ManualArrowOffset = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'bottom',
    popoverSize: 'narrow',
    arrowOffset: '45px',
  },
};

export const CenteredButtonAutoMini = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'auto',
    popoverSize: 'mini',
    triggerType: 'button',
    arrowOffset: '80px',
  },
  decorators: [
    (Story) => html`
      <div
        style="height:80vh;display:flex;justify-content:center;align-items:center;"
      >
        <div style="position:relative;">${Story()}</div>
      </div>
    `,
  ],
};
