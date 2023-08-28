import { html } from 'lit';
import '../components/reusable/radioButton';
import '../components/reusable/checkbox';
import '../components/reusable/toggleButton';
import '../components/reusable/textInput';
import '../components/reusable/textArea';
import '../components/reusable/dropdown';
import '@kyndryl-design-system/foundation/components/button';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Patterns/Forms',
};

export const Default = {
  render: (args) => {
    return html`
      <form>
        <kyn-radio-button-group
          name="radio"
          value="1"
          @on-radio-group-change=${(e) => action(e.type)(e)}
        >
          <span slot="label">Radio Buttons</span>
          <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
          <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
          <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
        </kyn-radio-button-group>

        <br />

        <kyn-checkbox-group
          name="checkbox"
          .value=${['1']}
          required
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
          Toggle Button
        </kyn-toggle-button>

        <br /><br />

        <kyn-dropdown
          name="dropdown"
          caption="Dropdown example"
          @on-change=${(e) => action(e.type)(e)}
        >
          <span slot="label">Dropdown</span>
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
          <span slot="label">Multi-Select Dropdown</span>
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
          name="textInput"
          placeholder="Placeholder text"
          caption="Text input example"
          @on-input=${(e) => action(e.type)(e)}
        >
          Text Input
        </kyn-text-input>

        <br /><br />

        <kyn-text-area
          name="textArea"
          placeholder="Placeholder text"
          caption="Text area example"
          @on-input=${(e) => action(e.type)(e)}
          @keydown=${(e) => e.stopPropagation()}
        >
          Text Area
        </kyn-text-area>

        <br /><br />

        <kd-button
          @on-click=${(e) => {
            action('submit')(e);
            console.log(new FormData(document.querySelector('form')));
          }}
        >
          Submit
        </kd-button>
      </form>
    `;
  },
};
