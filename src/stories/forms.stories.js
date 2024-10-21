import { html } from 'lit';
import '../components/reusable/radioButton';
import '../components/reusable/checkbox';
import '../components/reusable/toggleButton';
import '../components/reusable/textInput';
import '../components/reusable/textArea';
import '../components/reusable/numberInput';
import '../components/reusable/dropdown';
import '../components/reusable/timepicker';
import '../components/reusable/datePicker';
import '../components/reusable/daterangepicker';
import '../components/reusable/tooltip';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import infoIcon from '@carbon/icons/es/information/16';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Patterns/Forms',
};

export const Default = {
  render: () => {
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);

          // console.log(e.submitter);
          // submitter is not accessible with form associated custom elements, see https://github.com/WICG/webcomponents/issues/814

          return false;
        }}
      >
        <kyn-radio-button-group
          name="radio"
          @on-radio-group-change=${(e) => action(e.type)(e)}
          label="Radio buttons"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
          <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
          <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
          <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
        </kyn-radio-button-group>

        <br />

        <kyn-checkbox-group
          name="checkbox"
          @on-checkbox-group-change=${(e) => action(e.type)(e)}
        >
          <span slot="label">Checkboxes</span>
          <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
          <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
          <kyn-checkbox value="3"> Option 3 </kyn-checkbox>
        </kyn-checkbox-group>

        <br />

        <kyn-toggle-button
          name="toggle"
          value="example"
          @on-change=${(e) => action(e.type)(e)}
        >
          Toggle button
        </kyn-toggle-button>

        <br /><br />

        <kyn-dropdown
          name="dropdown"
          caption="Dropdown example"
          @on-change=${(e) => action(e.type)(e)}
        >
          <span slot="label"> Dropdown </span>
          <kyn-tooltip slot="label" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>

          <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
          <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          <kyn-dropdown-option value="3" disabled>
            Disabled Option
          </kyn-dropdown-option>
          <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
          <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
          <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
          <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
        </kyn-dropdown>

        <br /><br />

        <kyn-dropdown
          name="dropdownMulti"
          multiple
          searchable
          caption="Searchable Multi-Select Dropdown example"
          @on-change=${(e) => action(e.type)(e)}
        >
          <span slot="label">Multi-select dropdown</span>
          <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
          <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          <kyn-dropdown-option value="3" disabled>
            Disabled Option
          </kyn-dropdown-option>
          <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
          <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
          <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
          <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
        </kyn-dropdown>

        <br /><br />

        <kyn-text-input
          required
          name="textInput"
          placeholder="Placeholder text"
          caption="Text input example"
          label="Text input"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-text-input>
        <br /><br />

        <kyn-text-area
          name="textArea"
          placeholder="Placeholder text"
          caption="Text area example"
          label="Text area"
          @on-input=${(e) => action(e.type)(e)}
          @keydown=${(e) => e.stopPropagation()}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-text-area>
        <br /><br />

        <kyn-number-input
          name="numberInput"
          caption="Number input example"
          label="Number input"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-number-input>
        <br /><br />

        <kyn-time-picker
          name="time-picker"
          label="Time Picker"
          required
          dateFormat="H:i"
          caption="Time picker example"
          ?twentyFourHourFormat=${true}
          defaultErrorMessage="A time value is required"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-time-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-picker"
          label="Date Picker"
          dateFormat="Y-m-d"
          caption="Date picker example"
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
        ></kyn-date-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-time-picker"
          label="Date / Time Picker"
          dateFormat="Y-m-d h:i K"
          caption="Date time picker example"
          ?twentyFourHourFormat=${false}
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-picker>

        <br /><br />

        <kyn-date-range-picker
          required
          label="Date Range Picker"
          name="date-range"
          dateFormat="Y-m-d"
          caption="Date range picker example"
          defaultErrorMessage="Both start and end dates are required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 375px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-range-picker>

        <br /><br />

        <kyn-date-range-picker
          required
          name="date-time-range"
          label="Date / Time Range Picker"
          dateFormat="Y-m-d h:i K"
          caption="Date time range picker example"
          ?twentyFourHourFormat=${false}
          defaultErrorMessage="Both start and end dates are required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 375px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <kd-icon slot="anchor" .icon=${infoIcon}></kd-icon>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-range-picker>

        <br /><br />

        <kd-button
          type="submit"
          name="test"
          @on-click=${() => {
            // check validity of the overall form
            console.log(
              document.querySelector('form').reportValidity()
                ? 'valid'
                : 'invalid'
            );
          }}
        >
          Submit
        </kd-button>
      </form>
    `;
  },
};
