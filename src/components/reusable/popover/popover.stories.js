import { html } from 'lit';
import './index';
import smCube from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/cube.svg';

import '../button';
import '../textInput';
import '../badge';
import '../link';
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
  popoverSize: 'narrow',
  titleText: 'Modal Title',
  type: 'button',
  labelText: '',
  okText: 'Primary Button',
  cancelText: 'Secondary Button',
  closeText: 'Close',
  destructive: false,
  okDisabled: false,
  hideFooter: false,
  showSecondaryButton: false,
  secondaryButtonText: '',
  secondaryDisabled: false,
  hideCancelButton: false,
};

export const NarrowPopover = {
  args: {
    ...args,
    popoverSize: 'narrow',
    titleText: 'Narrow Popover Title',
    labelText: 'Narrow Popover Label',
    okText: 'Primary Button',
    cancelText: 'Secondary Button',
  },
  render: (args) => {
    return html`
      <kyn-popover
        type="${args.type}"
        popoverSize="${args.popoverSize}"
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
      >
        <kyn-button slot="anchor" kind="secondary"
          >Launch Narrow Popover</kyn-button
        >
        <div
          style="background: var(--kd-color-background-container-subtle); padding: 16px; border-radius: 4px;       text-align: center; height: 250px; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 8px;"
        >
          <span
            slot="icon"
            class="cube-icon"
            style="width: 67px; height: 67px; color: var(--kd-color-icon-brand);"
          >
            ${unsafeSVG(
              smCube.replace(
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
      </kyn-popover>
    `;
  },
};

export const WidePopover = {
  args: {
    ...args,
    popoverSize: 'wide',
    titleText: 'Wide Popover Title',
    labelText: 'Wide Popover Label',
    okText: 'Primary Button',
    cancelText: 'Secondary Button',
  },
  render: (args) => {
    return html`
      <kyn-popover
        type=${args.type}
        popoverSize=${args.popoverSize}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
      >
        <kyn-button slot="anchor" kind="primary"
          >Launch Wide Popover</kyn-button
        >
        <div
          style="background: var(--kd-color-background-container-subtle); padding: 16px; border-radius: 4px;       text-align: center; height: 250px; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 8px;"
        >
          <span
            slot="icon"
            class="cube-icon"
            style="width: 67px; height: 67px; color: var(--kd-color-icon-brand);"
          >
            ${unsafeSVG(
              smCube.replace(
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
      </kyn-popover>
    `;
  },
};

export const MiniPopover = {
  args: {
    ...args,
    titleText: '',
    labelText: '',
    popoverSize: 'mini',
    hideFooter: true,
  },
  render: (args) => {
    return html`
      <kyn-popover
        type=${args.type}
        popoverSize=${args.popoverSize}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
      >
        <kyn-button slot="anchor" kind="tertiary"
          >Launch Mini Popover</kyn-button
        >
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
      </kyn-popover>
    `;
  },
};

export const MiniPopoverIconAnchor = {
  args: {
    ...args,
    titleText: '',
    labelText: '',
    type: 'icon',
    popoverSize: 'mini',
    hideFooter: true,
  },
  render: (args) => {
    return html`
      <kyn-popover
        type=${args.type}
        popoverSize=${args.popoverSize}
        titleText=${args.titleText}
        labelText=${args.labelText}
        okText=${args.okText}
        cancelText=${args.cancelText}
        closeText=${args.closeText}
        ?destructive=${args.destructive}
        ?okDisabled=${args.okDisabled}
        ?hideFooter=${args.hideFooter}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?secondaryDisabled=${args.secondaryDisabled}
        ?hideCancelButton=${args.hideCancelButton}
      >
        <kyn-button slot="anchor" kind="tertiary"
          >Launch Mini Popover</kyn-button
        >
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
      </kyn-popover>
    `;
  },
};
