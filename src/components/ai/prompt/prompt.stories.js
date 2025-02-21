import { html } from 'lit';
import '../../reusable/link';
import './prompt';
import './promptGroup';

export default {
  title: 'AI/Components/Prompt',
  component: 'kyn-prompt',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    isClickable: {
      control: { type: 'boolean' },
    },
    hideBorder: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    selected: {
      control: { type: 'boolean' },
    },
  },
};

const args = {
  size: 'md',
  hideBorder: false,
  isClickable: false,
  disabled: false,
  selected: false,
  value: '',
};

export const Default = {
  args,
  render: (args) => html`
    <kyn-prompt
      type=${args.type}
      .size=${args.size}
      ?hideBorder=${args.hideBorder}
      ?disabled=${args.disabled}
      ?selected=${args.selected}
      ?isClickable=${false}
      value=${args.value}
    >
      <div slot="label">Default Prompt</div>
    </kyn-prompt>
  `,
};

export const Clickable = {
  args: { ...args, isClickable: true },
  render: (args) => html`
    <kyn-prompt
      type=${args.type}
      .size=${args.size}
      ?hideBorder=${args.hideBorder}
      ?disabled=${args.disabled}
      ?selected=${args.selected}
      ?isClickable=${true}
      value=${args.value}
    >
      <div slot="label">Clickable Prompt</div>
    </kyn-prompt>
  `,
};

export const Selected = {
  args: { ...args, size: 'md', selected: true, isClickable: true },
  render: (args) => html`
    <kyn-prompt
      type=${args.type}
      .size=${args.size}
      ?hideBorder=${args.hideBorder}
      ?disabled=${args.disabled}
      ?selected=${args.selected}
      ?isClickable=${true}
      value=${args.value}
    >
      <div slot="label">Selected Prompt</div>
    </kyn-prompt>
  `,
};

export const Groups = {
  args: { ...args, isClickable: true },
  render: (args) => html`
    <div>
      <div>
        <div class="heading kd-type--headline-08">Single Select Group</div>
        <p style="margin: 5px 0 20px;">
          Only one prompt can be selected at a time.
        </p>
        <kyn-prompt-group promptOrientation=${'horizontal'}>
          <kyn-prompt
            type=${args.type}
            .size=${args.size}
            ?hideBorder=${args.hideBorder}
            ?disabled=${args.disabled}
            ?selected=${args.selected}
            ?isClickable=${true}
            value=${'option1'}
          >
            <div slot="label">Option 1</div>
          </kyn-prompt>
          <kyn-prompt
            type=${args.type}
            .size=${args.size}
            ?hideBorder=${args.hideBorder}
            ?disabled=${args.disabled}
            ?selected=${args.selected}
            ?isClickable=${true}
            value=${'option2'}
          >
            <div slot="label">Option 2</div>
          </kyn-prompt>
          <kyn-prompt
            type=${args.type}
            .size=${args.size}
            ?hideBorder=${args.hideBorder}
            ?disabled=${args.disabled}
            ?selected=${args.selected}
            ?isClickable=${true}
            value=${'option3'}
          >
            <div slot="label">Option 3</div>
          </kyn-prompt>
        </kyn-prompt-group>
      </div>

      <div>
        <div class="heading kd-type--headline-08" style="margin-top: 30px;">
          Multi-select Group
        </div>
        <p style="margin: 5px 0 20px;">Multiple prompts can be selected.</p>
        <kyn-prompt-group promptOrientation=${'vertical'} multipleSelect>
          <kyn-prompt
            type=${args.type}
            .size=${args.size}
            ?hideBorder=${args.hideBorder}
            ?disabled=${false}
            ?isClickable=${true}
            value=${'option1'}
          >
            <div slot="label">Option 1</div>
          </kyn-prompt>
          <kyn-prompt
            type=${args.type}
            .size=${args.size}
            ?hideBorder=${args.hideBorder}
            ?disabled=${false}
            ?isClickable=${true}
            selected
            value=${'option2'}
          >
            <div slot="label">Option 2</div>
          </kyn-prompt>
          <kyn-prompt
            type=${args.type}
            .size=${args.size}
            ?hideBorder=${args.hideBorder}
            ?isClickable=${true}
            disabled
            value=${'option3'}
          >
            <div slot="label">Option 3</div>
          </kyn-prompt>
        </kyn-prompt-group>
      </div>
    </div>
  `,
};
