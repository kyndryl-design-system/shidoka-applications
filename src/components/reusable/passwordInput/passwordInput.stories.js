import { html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import './passwordInput';
import '../tooltip';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

export default {
  title: 'Components/Password Input',
  component: 'kyn-password-input',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Default = () => html`
  <div style="max-width: 500px;">
    <kyn-password-input></kyn-password-input>
  </div>
`;

export const WithValidation = () => html`
  <div style="max-width: 500px;">
    <kyn-password-input
      required
      minLength="8"
      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
      helperText="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
    >
    </kyn-password-input>
    <div style="margin-top: 1rem;">
      <p>This password field validates for:</p>
      <ul style="margin-top: 0.5rem;">
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
      </ul>
    </div>
  </div>
`;

export const WithError = () => html`
  <div style="max-width: 500px;">
    <kyn-password-input
      required
      value="a"
      minLength="8"
      invalidText="Password must contain at least 8 characters"
      helperText="Type at least 8 characters to make this field valid"
      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
    ></kyn-password-input>
    <div style="margin-top: 1rem;">
      <p>This password field validates for:</p>
      <ul style="margin-top: 0.5rem;">
        <li>
          At least 8 characters (will become valid when this criteria is met)
        </li>
      </ul>
    </div>
  </div>
`;

export const Disabled = () => html`
  <div style="max-width: 500px;">
    <kyn-password-input disabled></kyn-password-input>
  </div>
`;

export const WithTooltip = () => html`
  <div style="max-width: 500px;">
    <kyn-password-input
      label="Password"
      name="password-tooltip"
      placeholder="Enter password"
      helperText="Password must meet validation requirements"
    >
      <kyn-tooltip slot="tooltip">
        <span slot="anchor" style="display: flex">${unsafeSVG(infoIcon)}</span>
        Password requirements:
        <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
          <li>At least 8 characters</li>
          <li>At least one uppercase letter</li>
          <li>At least one lowercase letter</li>
          <li>At least one number</li>
        </ul>
      </kyn-tooltip>
    </kyn-password-input>
  </div>
`;
