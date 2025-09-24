import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/qyPEUQckxj8LUgesi1OEES/Component-Library?node-id=19896-32511',
  {
    props: {
      unnamed: figma.string('Input'),
    },
    example: (props) => html` <kyn-button>${props.unnamed}</kyn-button> `,
    imports: [
      "import '@kyndryl-design-system/shidoka-applications/components/reusable/button'",
    ],
  }
);
