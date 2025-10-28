import { html } from 'lit';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import './index';
import '../button';
import '../link';

import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import lgCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cube.svg';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/cube.svg';

export default {
  title: 'Components/Popover',
  component: 'kyn-popover',
  argTypes: {
    size: { control: 'select', options: ['mini', 'narrow', 'wide'] },
    top: { control: 'text' },
    left: { control: 'text' },
    bottom: { control: 'text' },
    right: { control: 'text' },
    arrowPosition: { control: 'text' },
    offsetDistance: { control: 'number' },
    shiftPadding: { control: 'number' },
    positionType: { control: 'select', options: ['fixed', 'absolute'] },
    zIndex: { control: 'number' },
    responsivePosition: { control: 'text' },
    footerLinkText: { control: 'text' },
    footerLinkHref: { control: 'text' },
    launchBehavior: {
      control: 'select',
      options: ['default', 'hover', 'link'],
    },
    linkHref: { control: 'text' },
    linkTarget: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
    },
    triggerType: {
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
  triggerType: 'button',
  direction: 'auto',
  size: 'mini',
  positionType: 'fixed',
  offsetDistance: undefined,
  shiftPadding: undefined,
  arrowPosition: undefined,
  launchBehavior: 'default',
  linkHref: 'https://www.example.com',
  linkTarget: '_blank',
  okText: 'Primary Button',
  secondaryButtonText: 'Secondary Button',
  titleText: 'Popover Title',
  labelText: 'Example label text content.',
  cancelText: '',
  closeText: 'Close',
  footerLinkText: '',
  footerLinkHref: '',
  footerLinkTarget: '_blank',
  showSecondaryButton: true,
  showTertiaryButton: false,
  tertiaryButtonText: '',
  hideFooter: false,
  destructive: false,
  open: false,
  top: undefined,
  right: undefined,
  bottom: undefined,
  left: undefined,
  zIndex: undefined,
  responsivePosition: undefined,
};

const Template = (args) => html`
  <kyn-popover
    okText=${args.okText}
    cancelText=${args.cancelText}
    titleText=${args.titleText}
    labelText=${args.labelText}
    secondaryButtonText=${args.secondaryButtonText}
    ?showSecondaryButton=${args.showSecondaryButton}
    ?showTertiaryButton=${args.showTertiaryButton}
    tertiaryButtonText=${args.tertiaryButtonText}
    ?hideFooter=${args.hideFooter}
    triggerType=${args.triggerType}
    direction=${args.direction}
    size=${args.size}
    top=${args.top}
    left=${args.left}
    bottom=${args.bottom}
    right=${args.right}
    arrowPosition=${args.arrowPosition}
    .offsetDistance=${args.offsetDistance}
    .shiftPadding=${args.shiftPadding}
    positionType=${args.positionType}
    launchBehavior=${args.launchBehavior}
    linkHref=${args.linkHref}
    linkTarget=${args.linkTarget}
    z-index=${args['z-index']}
    footerLinkText=${args.footerLinkText}
    footerLinkHref=${args.footerLinkHref}
    footerLinkTarget=${args.footerLinkTarget}
    responsive-position=${args['responsive-position']}
    @on-open=${() => action('on-open')()}
    @on-close=${() => action('on-close')()}
  >
    ${args.triggerType === 'icon'
      ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
      : args.triggerType === 'link'
      ? html`<kyn-link slot="anchor" kind="primary">Link</kyn-link>`
      : html`<kyn-button
          slot="anchor"
          style="height:24px;width:24px;"
          kind="primary"
          size="small"
        >
          ${args.anchorLabel}
        </kyn-button>`}
    ${args.size === 'mini'
      ? html`
          <div
            class="expansion-slot"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--kd-color-background-container-subtle);
              padding: 4px 8px;
              border-radius: 4px;
              border: 1px dashed var(--kd-color-utility-variant-border);
              width: 95%;
              min-width: 170px;
              text-align: center;
            "
          >
            <span
              class="cube-icon"
              style="
                display: inline-flex;
                align-items: center;
                color: var(--kd-color-icon-brand);
                width: 24px;
                height: 24px;
                margin-right: 8px;
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
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: var(--kd-color-background-container-subtle);
              padding: 32px 16px;
              height: 255px;
              border-radius: 4px;
              border: 1px dashed var(--kd-color-utility-variant-border);
            "
          >
            <span class="cube-icon" style="color:var(--kd-color-icon-brand);"
              >${unsafeSVG(lgCube)}</span
            >
            <h3
              data-no-toc
              style="font-size: 16px; font-weight: 500; line-height: 24px; letter-spacing: 0.32px;"
            >
              Slot Content
            </h3>
            <p
              style="font-size: 12px; font-weight: 300; line-height: 16px; letter-spacing: 0.32px;"
            >
              Swap this with your own component.
            </p>
          </div>
        `}

    <kyn-link
      slot="footerLink"
      href="https://kyndryl.gitbook.io/kyndryl-cto/shidoka-design-system/getting-started/for-developers"
      class="footer-link"
      target="_blank"
    >
      Link
    </kyn-link>
  </kyn-popover>
`;

export const DefaultAuto = {
  render: Template,
  args: { ...baseArgs, anchorLabel: '1' },
};

export const CustomSpacingBodySlotOnly = {
  render: Template,
  args: {
    ...baseArgs,
    open: true,
    anchorLabel: '1',
    direction: 'right',
    size: 'mini',
    shiftPadding: 170,
    offsetDistance: 20,
    arrowPosition: '45%',
    titleText: '',
    labelText: '',
    hideFooter: true,
  },
  decorators: [
    (Story) =>
      html`<div
        style="height: 100vh; display: flex; justify-content: center; align-items: center;"
      >
        ${Story()}
      </div>`,
  ],
};

export const ManualBottomWide = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'bottom',
    anchorLabel: '1',
    size: 'wide',
  },
};

export const ManualLeftIconNarrow = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'left',
    size: 'narrow',
    triggerType: 'icon',
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
    triggerType: 'link',
    direction: 'right',
    size: 'narrow',
  },
};

export const FloatingUpperNoHeader = {
  render: Template,
  args: {
    ...baseArgs,
    triggerType: 'none',
    titleText: '',
    labelText: '',
    size: 'narrow',
    anchorLabel: '1',
    direction: 'left',
    top: '5%',
    right: '1%',
    arrowPosition: '15%',
  },
};

export const WideFloatingLower = {
  render: Template,
  args: {
    ...baseArgs,
    anchorLabel: '1',
    triggerType: 'none',
    size: 'wide',
    direction: 'left',
    bottom: '5%',
    right: '2%',
  },
};

export const ManualArrowPosition = {
  render: Template,
  args: {
    ...baseArgs,
    direction: 'bottom',
    anchorLabel: '1',
    size: 'narrow',
    arrowPosition: '50%',
    titleText: 'Arrow Offset Demo',
    labelText: 'Example labelText content.',
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
    size: 'mini',
    anchorLabel: '1',
    triggerType: 'button',
    arrowPosition: '50%',
  },
  decorators: [
    (Story) => html`
      <div
        style="height: 80vh; display: flex; justify-content: center; align-items: center;"
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
    shiftPadding: 38,
    anchorLabel: '1',
    arrowPosition: '28px',
  },
  decorators: [
    (Story) => html`
      <div style="position: relative; width: 100vw; height: 100vh;">
        <div style="position: absolute; right: 10%; top: 20px;">${Story()}</div>
      </div>
    `,
  ],
};

export const PreciseAnchorAlignWithLink = {
  args: {
    ...baseArgs,
    direction: 'bottom',
    size: 'narrow',
    shiftPadding: 165,
    arrowPosition: '20px',
  },
  render: (args) => html`
    <kyn-popover
      okText=${args.okText}
      cancelText=${args.cancelText}
      titleText=${args.titleText}
      labelText=${args.labelText}
      secondaryButtonText=${args.secondaryButtonText}
      ?showSecondaryButton=${args.showSecondaryButton}
      ?showTertiaryButton=${args.showTertiaryButton}
      tertiaryButtonText=${args.tertiaryButtonText}
      ?hideFooter=${args.hideFooter}
      triggerType=${args.triggerType}
      direction=${args.direction}
      size=${args.size}
      top=${args.top}
      left=${args.left}
      bottom=${args.bottom}
      right=${args.right}
      arrowPosition=${args.arrowPosition}
      .offsetDistance=${args.offsetDistance}
      .shiftPadding=${args.shiftPadding}
      positionType=${args.positionType}
      z-index=${args['z-index']}
      responsive-position=${args['responsive-position']}
      @on-open=${() => action('on-open')()}
      @on-close=${() => action('on-close')()}
    >
      ${args.triggerType === 'icon'
        ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
        : args.triggerType === 'link'
        ? html`<kyn-link slot="anchor" kind="primary">Link</kyn-link>`
        : html`<kyn-button
            slot="anchor"
            style="height:24px;width:24px;"
            kind="primary"
            size="small"
            >1</kyn-button
          >`}
      ${args.size === 'mini'
        ? html`
            <div
              class="expansion-slot"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--kd-color-background-container-subtle);
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px dashed var(--kd-color-utility-variant-border);
                width: 95%;
                min-width: 170px;
                text-align: center;
              "
            >
              <span
                class="cube-icon"
                style="
                  display: inline-flex;
                  align-items: center;
                  color: var(--kd-color-icon-brand);
                  width: 24px;
                  height: 24px;
                  margin-right: 8px;
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
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: var(--kd-color-background-container-subtle);
                padding: 32px 16px;
                height: 255px;
                border-radius: 4px;
                border: 1px dashed var(--kd-color-utility-variant-border);
              "
            >
              <span class="cube-icon" style="color:var(--kd-color-icon-brand);"
                >${unsafeSVG(lgCube)}</span
              >
              <h3
                data-no-toc
                style="font-size: 16px; font-weight: 500; line-height: 24px; letter-spacing: 0.32px;"
              >
                Slot Content
              </h3>
              <p
                style="font-size: 12px; font-weight: 300; line-height: 16px; letter-spacing: 0.32px;"
              >
                Swap this with your own component.
              </p>
            </div>
          `}
      <kyn-link
        slot="footerLink"
        href="https://kyndryl.gitbook.io/kyndryl-cto/shidoka-design-system/getting-started/for-developers"
        class="footer-link"
        target="_blank"
      >
        Link
      </kyn-link>
    </kyn-popover>
  `,
  decorators: [
    (Story) => html`
      <div style="padding: 100px;">
        <div style="position: relative;">
          <div
            style="border: 1px dashed var(--kd-color-border-variants-light); border-radius: 4px; padding: 40px; display: inline-block; position: relative;"
          >
            <span style="margin-right: 10px; padding-bottom: 10px;"
              >Anchor container</span
            >
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
    size: 'wide',
    anchorLabel: '1',
    titleText: 'Mobile Fullscreen Mode',
    labelText: 'Resize window to mobile size (under 480px) to see effect',
    showTertiaryButton: true,
    tertiaryButtonText: 'Tertiary Button',
  },
};

export const AbsolutePositioning = {
  render: Template,
  args: {
    ...baseArgs,
    triggerType: 'none',
    positionType: 'absolute',
    size: 'narrow',
    top: '35px',
    anchorLabel: '1',
    left: '0px',
    titleText: 'Absolute Positioning',
    labelText: 'This popover uses position: absolute relative to its container',
    arrowPosition: '10px',
  },
  decorators: [
    (Story) => html`
      <div
        style="position: relative; width: 80%; height: 300px; border: 1px dashed var(--kd-color-border-variants-light); padding: 10px; margin: 40px;"
      >
        <div style="margin-bottom: 10px;">
          Container with position: relative
        </div>
        ${Story()}
      </div>
    `,
  ],
};

export const MiniWithCustomText = {
  args: {
    ...baseArgs,
    size: 'mini',
    titleText: 'Mini Popover',
    labelText: 'This is a mini popover with a paragraph of text.',
    triggerType: 'button',
    direction: 'right',
    arrowPosition: '15%',
  },
  render: (args) => html`
    <kyn-popover
      okText=${args.okText}
      cancelText=${args.cancelText}
      titleText=${args.titleText}
      labelText=${args.labelText}
      secondaryButtonText=${args.secondaryButtonText}
      ?showSecondaryButton=${args.showSecondaryButton}
      ?showTertiaryButton=${args.showTertiaryButton}
      tertiaryButtonText=${args.tertiaryButtonText}
      ?hideFooter=${args.hideFooter}
      direction=${args.direction}
      size=${args.size}
      footerLinkText=${args.footerLinkText}
      footerLinkHref=${args.footerLinkHref}
      footerLinkTarget=${args.footerLinkTarget}
      arrowPosition=${args.arrowPosition}
      .offsetDistance=${args.offsetDistance}
      .shiftPadding=${args.shiftPadding}
      @on-open=${() => action('on-open')()}
      @on-close=${() => action('on-close')()}
    >
      ${args.triggerType === 'icon'
        ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
        : args.triggerType === 'link'
        ? html`<kyn-link slot="anchor" kind="primary">Link</kyn-link>`
        : html`<kyn-button
            slot="anchor"
            style="height: 24px; width: 24px;"
            kind="primary"
            size="small"
            >1</kyn-button
          >`}
      <div
        class="expansion-slot"
        style="
					padding: 16px;
					background: var(--kd-color-background-container-subtle);
					border-radius: 4px;
				"
      >
        <p
          style="
						font-size: 14px;
						line-height: 20px;
						margin: 0;
					"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus.
        </p>
      </div>
    </kyn-popover>
  `,
};

export const LaunchBehavior = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 40px; padding: 40px;"
    >
      <div>
        <h3 data-no-toc style="margin-bottom: 20px; font-size: 16px;">
          Default (Click)
        </h3>
        ${Template({
          ...baseArgs,
          anchorLabel: '1',
          launchBehavior: 'default',
          titleText: 'Default Click Behavior',
          labelText: 'Click the citation to toggle the popover',
          size: 'mini',
          direction: 'right',
          hideFooter: true,
          arrowPosition: '40%',
          top: '5px',
        })}
      </div>
      <div>
        <h3 data-no-toc style="margin-bottom: 20px; font-size: 16px;">Hover</h3>
        ${Template({
          ...baseArgs,
          anchorLabel: '2',
          launchBehavior: 'hover',
          titleText: 'Hover Behavior',
          labelText: 'Hover over the citation to see the popover',
          size: 'mini',
          direction: 'right',
          hideFooter: true,
          arrowPosition: '40%',
          top: '5px',
        })}
      </div>
      <div>
        <h3 data-no-toc style="margin-bottom: 20px; font-size: 16px;">
          Link (Click for external link, hover to open)
        </h3>
        ${Template({
          ...baseArgs,
          anchorLabel: '3',
          launchBehavior: 'link',
          linkHref: 'https://www.kyndryl.com',
          linkTarget: '_blank',
          titleText: 'Link Behavior',
          labelText: 'Click to navigate, hover to preview',
          size: 'mini',
          direction: 'right',
          hideFooter: true,
          arrowPosition: '40%',
          top: '5px',
        })}
      </div>
    </div>
  `,
};
