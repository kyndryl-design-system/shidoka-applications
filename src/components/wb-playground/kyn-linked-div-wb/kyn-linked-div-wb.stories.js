import { html } from 'lit';
import './index';

export default {
  title: 'Components/InteractiveUrlContainer',
  component: 'kyn-linked-div-wb',
  argTypes: {
    size: {
      options: ['auto', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  size: 'lg',
  hoverColor: '#23564d',
  divTitle: 'Linked Div',
  mainHeader: 'Main Header',
  body: 'This is a linked div, meaning you can hover over it and the entire things is clickable.',
  linkHref: 'https://www.example.com',
};

export const KynLinkedDivWb = {
  args,
  render: (args) => {
    return html`
      <kyn-linked-div-wb
        size=${args.size}
        hoverColor=${args.hoverColor}
        divTitle=${args.divTitle}
        mainHeader=${args.mainHeader}
        linkHref=${args.linkHref}
      >
        <p>${args.body}</p>
      </kyn-linked-div-wb>
    `;
  },
};