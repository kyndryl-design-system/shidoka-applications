import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '../button';

export default {
  title: 'Components/SideDrawer',
  component: 'kyn-side-drawer',
  argTypes: {
    size: {
      options: ['md', 'standard', 'sm'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/CQuDZEeLiuGiALvCWjAKlu/branch/qMpff4GuFUEcsMUkvacS3U/Applications---Component-Library?node-id=8451-17321&node-type=canvas&m=dev',
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
  destructive: false,
  showSecondaryButton: true,
  secondaryButtonText: 'Secondary',
  hideCancelButton: false,
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
        ?destructive=${args.destructive}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
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
          sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae
          egestas mollis, augue augue interdum quam, sit amet volutpat justo
          magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat
          metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis,
          augue augue interdum quam, sit amet volutpat justo magna quis justo.
          Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum.
          Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue
          interdum quam, sit amet volutpat justo magna quis justo. Aliquam
          dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse
          pretium nibh
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
        ?destructive=${args.destructive}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)(e)}
        @on-open=${(e) => action(e.type)(e)}
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
          sed placerat metus bibendum. Suspendisse pretium nibh Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Proin cursus, purus vitae
          egestas mollis, augue augue interdum quam, sit amet volutpat justo
          magna quis justo. Aliquam dapibus mi a arcu consequat, sed placerat
          metus bibendum. Suspendisse pretium nibh Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Proin cursus, purus vitae egestas mollis,
          augue augue interdum quam, sit amet volutpat justo magna quis justo.
          Aliquam dapibus mi a arcu consequat, sed placerat metus bibendum.
          Suspendisse pretium nibh Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Proin cursus, purus vitae egestas mollis, augue augue
          interdum quam, sit amet volutpat justo magna quis justo. Aliquam
          dapibus mi a arcu consequat, sed placerat metus bibendum. Suspendisse
          pretium nibh
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
