import { html } from 'lit';
import '../link';
import './prompt';
import './promptGroup';

export default {
  title: 'Components/Prompt',
  component: 'kyn-prompt',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const Normal = {
  render: () => html`
    <kyn-prompt size="large">
      <div slot="label">Normal Prompt</div>
    </kyn-prompt>
  `,
};

export const Clickable = {
  render: () => html`
    <kyn-prompt type="clickable" size="large">
      <div slot="label">Clickable Prompt</div>
    </kyn-prompt>
  `,
};

export const Selected = {
  render: () => html`
    <kyn-prompt selected size="large">
      <div slot="label">Selected Prompt</div>
    </kyn-prompt>
  `,
};

export const Vertical = {
  render: () => html`
    <kyn-prompt promptOrientation="vertical" size="large">
      <div slot="label">
        <div>First Label</div>
        <div>Second Label</div>
        <div>Third Label</div>
      </div>
    </kyn-prompt>
  `,
};

export const Groups = {
  render: () => html`
    <div
      style="max-width: 800px; display: flex; flex-direction: column; gap: 32px;"
    >
      <div>
        <h3>Single Select Group</h3>
        <p style="margin: 10px 0 15px;">
          Only one prompt can be selected at a time
        </p>
        <kyn-prompt-group orientation="horizontal">
          <kyn-prompt type="clickable" value="option1" selected size="large">
            <div slot="label">Option 1</div>
          </kyn-prompt>
          <kyn-prompt type="clickable" value="option2" size="large">
            <div slot="label">Option 2</div>
          </kyn-prompt>
          <kyn-prompt type="clickable" value="option3" size="large">
            <div slot="label">Option 3</div>
          </kyn-prompt>
        </kyn-prompt-group>
      </div>

      <div>
        <h3>Multiple Select Group</h3>
        <p style="margin: 10px 0 15px;">Multiple prompts can be selected</p>
        <kyn-prompt-group orientation="vertical" multipleSelect>
          <kyn-prompt type="clickable" value="option1">
            <div slot="label">Option 1</div>
          </kyn-prompt>
          <kyn-prompt type="clickable" value="option2" selected>
            <div slot="label">Option 2</div>
          </kyn-prompt>
          <kyn-prompt type="clickable" value="option3" selected>
            <div slot="label">Option 3</div>
          </kyn-prompt>
        </kyn-prompt-group>
      </div>
    </div>
  `,
};
