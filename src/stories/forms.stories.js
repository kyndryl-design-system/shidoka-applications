import { html } from 'lit';
import '../components/reusable/radioButton';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Patterns/Forms',
};

export const Default = {
  render: (args) => {
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          console.log(new FormData(e.target));
        }}
      >
        <kyn-radio-button-group
          labelText="Radio Buttons"
          name="radio"
          value="1"
          @on-radio-group-change=${(e) => action(e.type)(e)}
        >
          <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
          <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
          <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
        </kyn-radio-button-group>

        <br />

        <input type="submit" value="Submit" />
      </form>
    `;
  },
};
