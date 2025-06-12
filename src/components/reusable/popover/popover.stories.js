import { html } from 'lit';
import { action } from '@storybook/addon-actions';

import './index';
import '../modal';
import '../button';
import '../link';

import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import lgCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/cube.svg';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/cube.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

/**
 * Stories for the Popover component.
 */
export default {
  title: 'Components/Popover',
  component: 'kyn-popover',
  argTypes: {
    mode: { control: 'select', options: ['modal', 'anchor', 'floating'] },
    triggerType: { control: 'select', options: ['icon', 'link', 'button'] },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    anchorPosition: { control: 'select', options: ['start', 'center', 'end'] },
    top: { control: 'text' },
    left: { control: 'text' },
    bottom: { control: 'text' },
    right: { control: 'text' },
    popoverSize: { control: 'select', options: ['mini', 'narrow', 'wide'] },
    titleText: { control: 'text' },
    labelText: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    closeText: { control: 'text' },
    hideFooter: { control: 'boolean' },
    open: { control: 'boolean' },
  },
};

const Template = ({
  mode,
  triggerType,
  placement,
  direction,
  anchorPosition,
  top,
  left,
  bottom,
  right,
  popoverSize,
  titleText,
  labelText,
  okText,
  cancelText,
  closeText,
  hideFooter,
  open,
}) => html`
  <kyn-popover
    mode=${mode}
    triggerType=${triggerType}
    placement=${placement}
    .direction=${direction}
    .anchorPosition=${anchorPosition}
    .popoverSize=${popoverSize}
    .top=${top}
    .left=${left}
    .bottom=${bottom}
    .right=${right}
    .titleText=${titleText}
    .labelText=${labelText}
    .okText=${okText}
    .cancelText=${cancelText}
    .closeText=${closeText}
    ?hideFooter=${hideFooter}
    .open=${open}
    @on-open=${action('on-open')}
    @on-close=${action('on-close')}
  >
    ${triggerType === 'icon'
      ? html`<span slot="anchor">${unsafeSVG(infoIcon)}</span>`
      : triggerType === 'link'
      ? html`<kyn-link slot="anchor" kind="primary"
          >Launch Popover Link</kyn-link
        >`
      : html`<kyn-button slot="anchor" kind="primary"
          >Launch Popover</kyn-button
        >`}
    ${popoverSize === 'mini'
      ? html`
          <div class="expansion-slot">
            <div>
              <span
                slot="icon"
                class="cube-icon"
                style="padding: 0; display: inline-flex; align-items: center; color: var(--kd-color-icon-brand); vertical-align: middle;"
              >
                ${unsafeSVG(smCube)}
              </span>
              <span
                class="kd-type--ui-02"
                style="display: inline-flex; align-items: center; color: var(--kd-color-text); margin-left: 8px;"
              >
                Slot
              </span>
            </div>
          </div>
          <kyn-link slot="link" kind="primary">Link</kyn-link>
        `
      : html`
          <div class="expansion-slot">
            <span
              slot="icon"
              class="cube-icon"
              style="width: 67px; height: 67px; color: var(--kd-color-icon-brand);"
            >
              ${unsafeSVG(
                lgCube.replace(
                  'viewBox="0 0 24 24"',
                  'viewBox="2 4 20 16" width="67" height="67"'
                )
              )}
            </span>
            <h3
              style="color: var(--kd-color-text-level-primary); font-size: var(kd-type--ui-01);"
            >
              Expansion Slot
            </h3>
            <p
              style="color: var(--kd-color-text-level-primary); font-size: var(kd-type--ui-04); line-height: 16px; letter-spacing: 0.32px; width: 95%; max-width: 195px; margin: 6px auto 0;"
              class="kd-type--weight-light"
            >
              Swap this with your own component.
            </p>
          </div>
        `}
  </kyn-popover>
`;

export const PopoverWithBackdrop = Template.bind({});
PopoverWithBackdrop.args = {
  mode: 'modal',
  triggerType: 'button',
  placement: 'bottom',
  direction: 'bottom',
  anchorPosition: 'center',
  popoverSize: 'wide',
  titleText: 'Modal Title',
  labelText: 'Modal Label',
  okText: 'Primary Button',
  cancelText: 'Secondary Button',
  closeText: 'Close',
  open: false,
  hideFooter: false,
};

export const AttachedToAnchor = Template.bind({});
AttachedToAnchor.args = {
  mode: 'anchor',
  triggerType: 'icon',
  placement: 'left',
  direction: 'top',
  anchorPosition: 'center',
  popoverSize: 'mini',
  titleText: 'Popover at Top',
  labelText: 'This popover is anchored to the top.',
  okText: 'Got it',
  cancelText: 'Nope',
  closeText: '×',
  open: false,
  hideFooter: true,
};

export const FloatingNoBackdrop = Template.bind({});
FloatingNoBackdrop.args = {
  mode: 'floating',
  triggerType: 'link',
  placement: 'bottom',
  direction: 'bottom',
  anchorPosition: 'center',
  popoverSize: 'narrow',
  titleText: 'Floating Popover',
  labelText: 'Right-aligned floating popover example.',
  okText: 'Primary Button',
  cancelText: 'Secondary Button',
  closeText: 'Close',
  top: '20%',
  right: '5%',
  open: false,
  hideFooter: false,
};

export const BottomRightPosition = Template.bind({});
BottomRightPosition.args = {
  mode: 'floating',
  triggerType: 'button',
  placement: 'bottom',
  direction: 'bottom',
  anchorPosition: 'end',
  popoverSize: 'narrow',
  titleText: 'Bottom Right Popover',
  labelText: 'Bottom right positioned popover example.',
  okText: 'Primary Button',
  cancelText: 'Secondary Button',
  closeText: 'Close',
  bottom: '5%',
  right: '5%',
  open: false,
  hideFooter: false,
};
