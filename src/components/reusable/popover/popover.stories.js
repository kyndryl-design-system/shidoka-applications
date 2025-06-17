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
    anchorPoint: {
      control: 'select',
      options: [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
    },
    positionType: {
      control: 'select',
      options: ['fixed', 'absolute'],
    },
    'z-index': { control: 'number' },
    'responsive-position': { control: 'text' },
    useModernPositioning: { control: 'boolean' },
    fullScreenOnMobile: { control: 'boolean' },
    hideHeader: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    anchorType: {
      control: 'select',
      options: ['icon', 'link', 'button', 'none'],
    },
    direction: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
    },
  },
};

const baseArgs = {
  top: undefined,
  right: undefined,
  bottom: undefined,
  left: undefined,
  arrowOffset: undefined,
  anchorType: 'button',
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
  anchorPoint: 'center',
  useModernPositioning: true,
  fullScreenOnMobile: false,
  hideHeader: false,
  autoFocus: true,
  offsetX: 0,
  offsetY: 0,
  positionType: 'fixed',
  'z-index': undefined,
  'responsive-position': undefined,
};

const Template = (args) => html`
  <kyn-popover
    okText=${args.okText}
    cancelText=${args.cancelText}
    titleText=${args.titleText}
    labelText=${args.labelText}
    secondaryButtonText=${args.secondaryButtonText}
    ?showSecondaryButton=${args.showSecondaryButton}
    anchorType=${args.anchorType}
    direction=${args.direction}
    popoverSize=${args.popoverSize}
    top=${args.top}
    left=${args.left}
    bottom=${args.bottom}
    right=${args.right}
    arrowOffset=${args.arrowOffset}
    anchorPoint=${args.anchorPoint}
    positionType=${args.positionType}
    z-index=${args['z-index']}
    responsive-position=${args['responsive-position']}
    ?useModernPositioning=${args.useModernPositioning}
    ?fullScreenOnMobile=${args.fullScreenOnMobile}
    ?hideHeader=${args.hideHeader}
    ?autoFocus=${args.autoFocus}
    offset-x=${args.offsetX}
    offset-y=${args.offsetY}
    @on-open=${() => action('on-open')()}
    @on-close=${() => action('on-close')()}
  >
    ${args.anchorType === 'icon'
      ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
      : args.anchorType === 'link'
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

export const ManualLeftIconNarrow = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'left',
    popoverSize: 'narrow',
    anchorType: 'icon',
  },
  decorators: [
    (Story) => html`
      <div style="position: relative; width: 100vw; height: 100vh;">
        <div style="position: absolute; right: 10%; top: 20px;">${Story()}</div>
      </div>
    `,
  ],
};

export const ManualRightLinkNarrow = {
  render: Template,
  args: {
    ...baseArgs,
    anchorType: 'link',
    direction: 'right',
    popoverSize: 'narrow',
    anchorPoint: 'top-left',
  },
};

export const FloatingUpperNoHeader = {
  render: Template,
  args: {
    ...baseArgs,
    anchorType: 'none',
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
    anchorType: 'none',
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
    arrowOffset: '35px',
    titleText: 'Arrow Offset Demo',
    labelText: 'Notice the arrow is offset to 5px from the left edge',
  },
  decorators: [
    (Story) => html`
      <div style="display: flex; justify-content: center; padding: 50px;">
        ${Story()}
      </div>
    `,
  ],
};

export const CenteredButtonAutoMini = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'auto',
    popoverSize: 'mini',
    anchorType: 'button',
    arrowOffset: '30px',
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

export const DirectionLeftButtonRight = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'left',
  },
  decorators: [
    (Story) => html`
      <div style="position: relative; width: 100vw; height: 100vh;">
        <div style="position: absolute; right: 10%; top: 20px;">${Story()}</div>
      </div>
    `,
  ],
};

export const PreciseAnchorPoint = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'bottom',
    popoverSize: 'narrow',
    anchorPoint: 'center',
  },
  decorators: [
    (Story) => html`
      <div style="padding: 100px;">
        <div style="position: relative;">
          <div
            style="border: 1px dashed var(--kd-color-border-variants-light); border-radius: 4px; padding: 40px; display: inline-block; position: relative;"
          >
            <span style="margin-right: 10px;">Anchor container</span>
            ${Story()}
          </div>
        </div>
      </div>
    `,
  ],
};

export const MobileFullScreen = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'bottom',
    popoverSize: 'wide',
    fullScreenOnMobile: true,
    titleText: 'Mobile Fullscreen Mode',
    labelText: 'Resize window to mobile size (under 480px) to see effect',
  },
};

export const AbsolutePositioning = {
  render: Template,
  args: {
    ...baseArgs,
    anchorType: 'none',
    positionType: 'absolute',
    popoverSize: 'narrow',
    top: '40px',
    left: '10px',
    titleText: 'Absolute Positioning',
    labelText: 'This popover uses position: absolute relative to its container',
  },
  decorators: [
    (Story) => html`
      <div
        style="position: relative; width: 80%; height: 300px; border: 1px dashed #ccc; padding: 10px; margin: 40px;"
      >
        <div style="margin-bottom: 10px;">
          Container with position: relative
        </div>
        ${Story()}
      </div>
    `,
  ],
};

export const CustomZIndex = {
  render: Template,
  args: {
    ...baseArgs,
    anchorType: 'none',
    popoverSize: 'narrow',
    top: '40%',
    left: '40%',
    'z-index': 2000,
    titleText: 'Custom Z-Index',
    labelText: 'This popover has a custom z-index of 2000',
  },
};

export const MiniWithCustomText = {
  args: {
    ...baseArgs,
    popoverSize: 'mini',
    titleText: 'Mini Popover',
    labelText: 'This is a mini popover with a paragraph of text.',
    anchorType: 'button',
    direction: 'right',
  },
  name: 'Mini With Custom Text',
  render: (args) => html`
    <kyn-popover
      okText=${args.okText}
      cancelText=${args.cancelText}
      titleText=${args.titleText}
      labelText=${args.labelText}
      secondaryButtonText=${args.secondaryButtonText}
      ?showSecondaryButton=${args.showSecondaryButton}
      direction=${args.direction}
      popoverSize=${args.popoverSize}
      arrowOffset=${args.arrowOffset}
      anchorPoint=${args.anchorPoint}
      ?useModernPositioning=${args.useModernPositioning}
      ?fullScreenOnMobile=${args.fullScreenOnMobile}
      ?hideHeader=${args.hideHeader}
      ?autoFocus=${args.autoFocus}
      offset-x=${args.offsetX}
      offset-y=${args.offsetY}
      @on-open=${() => action('on-open')()}
      @on-close=${() => action('on-close')()}
    >
      ${args.anchorType === 'icon'
        ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
        : args.anchorType === 'link'
        ? html`<kyn-link slot="anchor" kind="primary">Launch</kyn-link>`
        : html`<kyn-button slot="anchor" kind="primary">Launch</kyn-button>`}
      <div
        class="expansion-slot"
        style="
					padding:16px;
					background:var(--kd-color-background-container-subtle);
					border-radius:4px;
				"
      >
        <p
          style="
						font-size:14px;
						line-height:20px;
						margin:0;
					"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus.
        </p>
      </div>
    </kyn-popover>
  `,
};
