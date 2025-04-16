import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import { action } from '@storybook/addon-actions';
import '../tooltip';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

export default {
  title: 'Components/Toggle Button',
  component: 'kyn-toggle-button',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=4-421519&p=f&m=dev',
    },
  },
};

export const ToggleButton = {
  args: {
    label: 'Label',
    checked: false,
    name: 'toggle',
    value: 'example',
    small: false,
    disabled: false,
    reverse: false,
    hideLabel: false,
    checkedText: 'On',
    uncheckedText: 'Off',
  },
  render: (args) => {
    return html`
      <kyn-toggle-button
        label=${args.label}
        ?checked=${args.checked}
        name=${args.name}
        value=${args.value}
        ?small=${args.small}
        ?disabled=${args.disabled}
        ?reverse=${args.reverse}
        ?hideLabel=${args.hideLabel}
        checkedText=${args.checkedText}
        uncheckedText=${args.uncheckedText}
        @on-change=${(e) => action(e.type)(e)}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
      </kyn-toggle-button>
    `;
  },
};
