import { html } from 'lit';
import '../components/reusable/radioButton';

export default {
  title: 'Patterns/Forms',
};

export const Default = {
  render: (args) => {
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          console.log(new FormData(e.target));
        }}
      >
        <kyn-radio-button-group labelText="Radio Buttons" name="radio">
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
