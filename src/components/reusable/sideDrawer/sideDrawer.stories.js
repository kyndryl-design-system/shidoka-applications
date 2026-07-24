import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '../button';
import '../link';

export default {
  title: 'Components/Overlays & Floating UI/Side Drawer',
  component: 'kyn-side-drawer',
  argTypes: {
    size: {
      options: ['md', 'sm', 'xl', 'standard'],
      control: { type: 'select' },
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
  secondaryDestructive: false,
  secondaryBtnDisabled: false,
  showSecondaryButton: true,
  secondaryButtonText: 'Secondary',
  hideCancelButton: false,
  gradientBackground: false,
  resizable: false,
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
        ?gradientBackground=${args.gradientBackground}
        ?destructive=${args.destructive}
        ?secondaryDestructive=${args.secondaryDestructive}
        ?secondaryBtnDisabled=${args.secondaryBtnDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        ?resizable=${args.resizable}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-resize=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

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
        ?gradientBackground=${args.gradientBackground}
        ?destructive=${args.destructive}
        ?secondaryDestructive=${args.secondaryDestructive}
        ?secondaryBtnDisabled=${args.secondaryBtnDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        .beforeClose=${(returnValue) => handleBeforeClose(returnValue)}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

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

export const NoBackdrop = {
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
        ?gradientBackground=${args.gradientBackground}
        ?destructive=${args.destructive}
        ?secondaryDestructive=${args.secondaryDestructive}
        ?secondaryBtnDisabled=${args.secondaryBtnDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        noBackdrop
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

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

export const AIConnected = {
  args: { ...args, aiConnected: true, gradientBackground: true },
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
        ?gradientBackground=${args.gradientBackground}
        ?destructive=${args.destructive}
        ?secondaryDestructive=${args.secondaryDestructive}
        ?secondaryBtnDisabled=${args.secondaryBtnDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        ?aiConnected=${args.aiConnected}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor" kind="primary-ai">Open Drawer</kyn-button>

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

export const Resizable = {
  args: { ...args, resizable: true },
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
        ?gradientBackground=${args.gradientBackground}
        ?destructive=${args.destructive}
        ?secondaryDestructive=${args.secondaryDestructive}
        ?secondaryBtnDisabled=${args.secondaryBtnDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        ?resizable=${args.resizable}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-resize=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

        <div>
          This drawer can be resized by dragging the handle on its left edge.
          The width is constrained between 384px and 1024px. Check the
          <strong>Actions</strong> panel to see the <code>on-resize</code> event
          fired when you finish dragging.
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
          metus bibendum. Suspendisse pretium nibh
        </div>
      </kyn-side-drawer>
    `;
  },
};

export const LabelSlotWithLink = {
  args: {
    ...args,
    labelText: '',
    titleText: 'Dashboard settings',
    hideFooter: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the `label` slot for rich subtitle content such as inline `kyn-link`. When the slot is populated, it takes precedence over `labelText`.',
      },
    },
  },
  render: (args) => {
    return html`
      <kyn-side-drawer
        ?open=${args.open}
        size=${args.size}
        titleText=${args.titleText}
        submitBtnText=${args.submitBtnText}
        cancelBtnText=${args.cancelBtnText}
        ?submitBtnDisabled=${args.submitBtnDisabled}
        ?hideFooter=${args.hideFooter}
        ?gradientBackground=${args.gradientBackground}
        ?destructive=${args.destructive}
        ?secondaryDestructive=${args.secondaryDestructive}
        ?secondaryBtnDisabled=${args.secondaryBtnDisabled}
        ?showSecondaryButton=${args.showSecondaryButton}
        secondaryButtonText=${args.secondaryButtonText}
        ?hideCancelButton=${args.hideCancelButton}
        ?resizable=${args.resizable}
        @on-close=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-open=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-button slot="anchor">Open Drawer</kyn-button>

        <span slot="label">
          Adjust how this dashboard summarizes operations signals.
          <kyn-link
            href="/docs/dashboard"
            kind="secondary"
            linkFontWeight="lighter"
            @on-click=${(e) => {
              e.detail.origEvent.preventDefault();
              action('on-click')({ ...e, detail: e.detail });
            }}
            >Learn more</kyn-link
          >
        </span>

        <div>
          The subtitle above is rendered via
          <code>&lt;span slot="label"&gt;</code> and supports inline links.
          Plain text labels still work with the <code>labelText</code> property.
          Click “Learn more” to log <code>on-click</code> in the Actions panel
          without navigating away.
        </div>
      </kyn-side-drawer>
    `;
  },
};
