import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import '../tooltip';
import { ValidationArgs } from '../../../common/helpers/helpers';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';

export default {
  title: 'Components/Checkbox',
  component: 'kyn-checkbox-group',
  subcomponents: {
    'kyn-checkbox': 'kyn-checkbox',
    'kyn-checkbox-subgroup': 'kyn-checkbox-subgroup',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=1-370464&m=dev',
    },
  },
  argTypes: {
    ...ValidationArgs,
  },
};

const args = {
  label: 'Label',
  name: 'name',
  value: ['1'],
  required: false,
  disabled: false,
  horizontal: false,
  selectAll: false,
  hideLegend: false,
  filterable: false,
  limitCheckboxes: false,
  limitCount: 4,
  invalidText: '',
  description: 'Description',
  textStrings: {
    selectAll: 'Select all',
    showMore: 'Show more',
    showLess: 'Show less',
    search: 'Search',
    required: 'Required',
    error: 'Error',
  },
};

export const CheckboxGroup = {
  args,
  render: (args) => {
    return html`
      <kyn-checkbox-group
        name=${args.name}
        label=${args.label}
        .value=${args.value}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?horizontal=${args.horizontal}
        ?selectAll=${args.selectAll}
        ?hideLegend=${args.hideLegend}
        ?filterable=${args.filterable}
        ?limitCheckboxes=${args.limitCheckboxes}
        .limitCount=${args.limitCount}
        invalidText=${args.invalidText}
        .textStrings=${args.textStrings}
        @on-checkbox-group-change=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
        @on-search=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-limit-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <div slot="description">${args.description}</div>
        <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
        <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
        <kyn-checkbox value="3"> Option 3 </kyn-checkbox>
        <kyn-checkbox value="4"> Option 4 </kyn-checkbox>
        <kyn-checkbox value="5"> Option 5 </kyn-checkbox>
        <kyn-checkbox value="6"> Option 6 </kyn-checkbox>
      </kyn-checkbox-group>
    `;
  },
};

export const CheckboxSubgroups = {
  args,
  render: (args) => {
    return html`
      <kyn-checkbox-group
        name=${args.name}
        label=${args.label}
        .value=${args.value}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?horizontal=${args.horizontal}
        ?selectAll=${args.selectAll}
        ?hideLegend=${args.hideLegend}
        ?filterable=${args.filterable}
        ?limitCheckboxes=${args.limitCheckboxes}
        .limitCount=${args.limitCount}
        invalidText=${args.invalidText}
        .textStrings=${args.textStrings}
        @on-checkbox-group-change=${(e) =>
          action(e.type)({ ...e, detail: e.detail })}
        @on-search=${(e) => action(e.type)({ ...e, detail: e.detail })}
        @on-limit-toggle=${(e) => action(e.type)({ ...e, detail: e.detail })}
      >
        <kyn-tooltip slot="tooltip">
          <span slot="anchor" style="display:flex">${unsafeSVG(infoIcon)}</span>
          tooltip
        </kyn-tooltip>
        <div slot="description">${args.description}</div>
        <kyn-checkbox-subgroup>
          <kyn-checkbox slot="parent" value="parent1">
            Parent option 1
          </kyn-checkbox>
          <kyn-checkbox value="1"> Child option 1 </kyn-checkbox>
          <kyn-checkbox value="2"> Child option 2 </kyn-checkbox>
          <kyn-checkbox value="3"> Child option 3 </kyn-checkbox>
        </kyn-checkbox-subgroup>
        <kyn-checkbox-subgroup>
          <kyn-checkbox slot="parent" value="parent2">
            Parent option 2
          </kyn-checkbox>
          <kyn-checkbox value="4"> Child option 4 </kyn-checkbox>
          <kyn-checkbox value="5"> Child option 5 </kyn-checkbox>
          <kyn-checkbox value="6"> Child option 6 </kyn-checkbox>
        </kyn-checkbox-subgroup>
      </kyn-checkbox-group>
    `;
  },
};
