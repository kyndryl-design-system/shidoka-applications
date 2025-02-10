import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import chevronUpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-up.svg';
import chatIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chat.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import './index';
import '../button';

export default {
  title: 'Components/Button/With Floating Container',
  component: 'kyn-button-float-container',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Default = {
  render: () => html`
    <kyn-button-float-container>
      <kyn-button
        kind="primary-web"
        type="button"
        size="small"
        iconposition="left"
        description="Button 1"
        ?isFloating=${true}
        @on-click=${(e) => action(e.type)(e)}
        >Button 1
        <span slot="icon">${unsafeSVG(chevronUpIcon)}</span>
      </kyn-button>
    </kyn-button-float-container>
  `,
};

export const WithSecondaryButton = {
  render: () => html`
    <div style="padding-bottom:80px;">
      <!-- Add some space in bottom so FAB doesn't obstruct any essestial UI element -->
      <!-- Add some long content here to see the floating button in action -->
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum
      </p>
    </div>
    <kyn-button-float-container>
      <kyn-button
        kind="primary-web"
        type="button"
        size="small"
        iconposition="left"
        description="Button 1"
        ?isFloating=${true}
        @on-click=${(e) => action(e.type)(e)}
      >
        <span class="test">Button 1</span>
        <span class="_icon" slot="icon">${unsafeSVG(chevronUpIcon)}</span>
      </kyn-button>
      <kyn-button
        kind="primary-app"
        type="button"
        size="small"
        iconposition="left"
        description="Button 2"
        ?isFloating=${true}
        @on-click=${(e) => action(e.type)(e)}
      >
        <span class="test">Button 2</span>
        <span class="_icon" slot="icon">${unsafeSVG(chatIcon)}</span>
      </kyn-button>
    </kyn-button-float-container>
    <style>
      .test {
        display: none;
      }
      ._icon {
        display: flex;
      }

      @media (min-width: 42rem) {
        .test {
          display: inline;
        }
      }
    </style>
  `,
};

export const WithScroll = {
  render: () => html`
    <div style="padding-bottom:70px;">
      <!-- Add some space in bottom so FAB doesn't obstruct any essestial UI element -->
      <!-- Add some long content here to see the floating button in action -->
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        in voluptate velit esse cillum Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum Lorem ipsum dolor sit
        amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum
        dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </div>
    <kyn-button-float-container>
      <kyn-button
        kind="primary-web"
        type="button"
        size="small"
        iconposition="left"
        ?isFloating=${true}
        ?showOnScroll=${true}
        description="Button 1"
        @on-click=${(e) => action(e.type)(e)}
      >
        Button 1
        <span slot="icon">${unsafeSVG(chevronUpIcon)}</span>
      </kyn-button>
    </kyn-button-float-container>
  `,
};
