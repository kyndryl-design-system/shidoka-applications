import { html } from 'lit';
import './index';
import { _defaultTextStrings } from './numberInput';
import { action } from 'storybook/actions';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
import { ValidationArgs } from '../../../common/helpers/helpers';

const integerErrorDemoReady = new WeakSet();

/** Surface the integer validation message on first paint (stories skip user interaction). */
const showIntegerErrorDemo = (el) => {
  if (!el || integerErrorDemoReady.has(el)) return;
  integerErrorDemoReady.add(el);
  queueMicrotask(async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector('input');
    if (!input) return;
    input.value = '1.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

export default {
  title: 'Components/Form Inputs/Number Input',
  component: 'kyn-number-input',
  parameters: {
    docs: {
      description: {
        component:
          'Integers outside `Number.MAX_SAFE_INTEGER` (±9007199254740991) are not exact in JavaScript. Typed digits are kept and the field is marked invalid because the emitted `Number` no longer matches. Use `allowEmpty` to leave the field blank (`null` instead of resetting to `0`). Use `integer` to block decimal separators and exponential notation; a complete decimal still uses native `step` / `badInput` validation.',
      },
    },
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    value: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    allowEmpty: {
      control: { type: 'boolean' },
    },
    integer: {
      control: { type: 'boolean' },
    },
    ...ValidationArgs,
  },
};

const args = {
  label: 'Label',
  size: 'md',
  name: 'numberInput',
  value: 0,
  placeholder: '',
  caption: '',
  required: false,
  disabled: false,
  readonly: false,
  invalidText: '',
  warnText: '',
  hideLabel: false,
  inline: false,
  allowEmpty: false,
  integer: false,
  step: 1,
  min: undefined,
  max: undefined,
  textStrings: { ..._defaultTextStrings },
};

const renderNumberInput = (storyArgs, style) => html`
  <kyn-number-input
    size=${storyArgs.size}
    name=${storyArgs.name}
    value=${storyArgs.value}
    placeholder=${storyArgs.placeholder}
    caption=${storyArgs.caption}
    ?required=${storyArgs.required}
    ?disabled=${storyArgs.disabled}
    ?readonly=${storyArgs.readonly}
    invalidText=${storyArgs.invalidText}
    warnText=${storyArgs.warnText}
    ?hideLabel=${storyArgs.hideLabel}
    ?inline=${storyArgs.inline}
    ?allowEmpty=${storyArgs.allowEmpty}
    ?integer=${storyArgs.integer}
    step=${ifDefined(storyArgs.step)}
    min=${ifDefined(storyArgs.min)}
    max=${ifDefined(storyArgs.max)}
    .textStrings=${storyArgs.textStrings}
    label=${storyArgs.label}
    style=${ifDefined(style)}
    @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
    @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
  >
  </kyn-number-input>
`;

export const Default = {
  args,
  render: (storyArgs) => renderNumberInput(storyArgs),
};

export const Gallery = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    return html`
      <div
        class="heading kd-type--headline-04"
        style="margin-bottom:var(--kd-spacing-24)"
      >
        Gallery
      </div>
      <div
        style="display: flex;gap: var(--kd-spacing-16); flex-direction: column; "
      >
        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Allow empty
          </div>
          <kyn-number-input
            name="allowEmpty"
            label="Label"
            allowEmpty
            .value=${0}
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Integer only
          </div>
          <kyn-number-input
            name="integerOnly"
            label="Quantity"
            caption="Try typing '.' — decimal separators and exponents are blocked."
            integer
            .value=${0}
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Integer only — pasted decimal
          </div>
          <kyn-number-input
            ${ref(showIntegerErrorDemo)}
            name="integerPastedDecimal"
            label="Quantity"
            caption="1.5 fails native step validation — same error as without integer."
            integer
            .value=${1.5}
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Unsafe integer
          </div>
          <kyn-number-input
            name="unsafeInteger"
            label="Label"
            .value=${0}
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Full width
          </div>
          <kyn-number-input
            name="fullWidth"
            label="Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Long Label"
            .value=${0}
            style="width: 100%; --kyn-number-input-inner-max-width: 100%;"
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Constrained max width
          </div>
          <kyn-number-input
            name="constrainedMaxWidth"
            label="Label"
            .value=${0}
            style="max-width: 300px"
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Long label, constrained input
          </div>
          <kyn-number-input
            name="longLabelConstrained"
            label="Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Long Label"
            .value=${0}
            style="max-width: 700px; --kyn-number-input-inner-max-width: 160px"
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>

        <div>
          <div class="heading kd-type--headline-06 heading-text">
            Long wrapping label
          </div>
          <kyn-number-input
            name="longWrappingLabel"
            label="Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Extra Long Label"
            .value=${0}
            style="max-width: 275px"
            @on-input=${(e) => action(e.type)({ ...e, detail: e.detail })}
          ></kyn-number-input>
        </div>
      </div>
      <style>
        .heading-text {
          margin-bottom: var(--kd-spacing-12);
        }
      </style>
    `;
  },
};
