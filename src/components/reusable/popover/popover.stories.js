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
    x: { control: 'number' },
    y: { control: 'number' },
    popoverSize: { control: 'select', options: ['mini', 'narrow', 'wide'] },
    titleText: { control: 'text' },
    labelText: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    closeText: { control: 'text' },
    hideFooter: { control: 'boolean' },
  },
};

const Template = ({
  mode,
  triggerType,
  placement,
  x,
  y,
  popoverSize,
  titleText,
  labelText,
  okText,
  cancelText,
  closeText,
  hideFooter,
}) => html`
  <kyn-popover
    mode=${mode}
    triggerType=${triggerType}
    placement=${placement}
    popoverSize=${popoverSize}
    titleText=${titleText}
    labelText=${labelText}
    okText=${okText}
    cancelText=${cancelText}
    closeText=${closeText}
    ?hideFooter=${hideFooter}
    .x=${x}
    .y=${y}
    @on-open=${action('on-open')}
    @on-close=${action('on-close')}
  >
    ${triggerType === 'icon'
      ? html`<span slot="anchor" kind="secondary">${unsafeSVG(infoIcon)}</span>`
      : triggerType === 'link'
      ? html`<kyn-link slot="anchor" kind="secondary"> Open Popover </kyn-link>`
      : html`<kyn-button slot="anchor" kind="secondary"> Open </kyn-button>`}
    ${popoverSize === 'mini'
      ? html`
          <div class="expansion-slot">
            <div>
              <span
                slot="icon"
                class="cube-icon"
                style="padding: 0; display: inline-flex; align-items: center; color: var(--kd-color-icon-brand); vertical-align: middle;"
                >${unsafeSVG(smCube)}</span
              ><span
                class="kd-type--ui-02"
                style="display: inline-flex; align-items: center; color: var(--kd-color-text);margin-left: 8px;"
                >Slot</span
              >
            </div>
          </div>
          <kyn-link slot="link">Link</kyn-link>
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

export const ModalWithBackdrop = Template.bind({});
ModalWithBackdrop.args = {
  mode: 'modal',
  triggerType: 'button',
  popoverSize: 'wide',
  titleText: 'Modal Title',
  labelText: 'Modal Label',
  okText: 'OK',
  cancelText: 'Cancel',
  hideFooter: false,
  closeText: 'Close',
};

export const FloatingNoBackdrop = Template.bind({});
FloatingNoBackdrop.args = {
  mode: 'floating',
  x: 100,
  y: 500,
  open: true,
  triggerType: 'link',
  popoverSize: 'narrow',
  hideFooter: false,
  titleText: 'Modal Title',
  labelText: 'Modal Label',
  okText: 'Primary Button',
  cancelText: 'Secondary Button',
  closeText: 'Close',
};

export const AttachedToAnchor = Template.bind({});
AttachedToAnchor.args = {
  mode: 'anchor',
  triggerType: 'icon',
  placement: 'bottom',
  popoverSize: 'mini',
  hideFooter: true,
  titleText: 'Modal Title',
  labelText: 'Modal Label',
  okText: 'Primary Button',
  cancelText: 'Secondary Button',
  closeText: 'Close',
};
