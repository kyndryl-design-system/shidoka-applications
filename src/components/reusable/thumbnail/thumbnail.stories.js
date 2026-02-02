import { html } from 'lit';
import './index';
import { action } from 'storybook/actions';
import './thumbnail';

export default {
  title: 'Components/Thumbnail',
  component: 'kyn-thumbnail',
  parameters: {
    docs: {
      description: {
        component: `
Thumbnail component for displaying file previews with close functionality.
        `,
      },
    },
  },
  argTypes: {
    fileName: {
      control: { type: 'text' },
      description: 'The name of the file to display',
    },
    fileType: {
      control: { type: 'select' },
      options: ['document', 'pdf', 'ppt'],
      description: 'The type of file, determines which icon to show',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the thumbnail is in a loading state',
    },
    'thumbnail-close': {
      description:
        'Fired when the close button is clicked. Event detail: `{ fileName: string, fileType: string }`',
      table: {
        category: 'Events',
        type: { summary: 'CustomEvent' },
      },
      control: false,
    },
  },
};

export const Default = {
  args: {
    fileName: 'Document-Sample.pdf',
    fileType: 'document',
    loading: false,
  },
  render: (args) => {
    return html`
      <kyn-thumbnail
        fileName=${args.fileName}
        fileType=${args.fileType}
        ?loading=${args.loading}
        @thumbnail-close=${(e) => action('thumbnail-close')(e.detail)}
      ></kyn-thumbnail>
    `;
  },
};
export const Loading = {
  args: {
    fileName: 'Document-Sample.pdf',
    fileType: 'document',
    loading: true,
  },
  render: (args) => {
    return html`
      <kyn-thumbnail
        fileName=${args.fileName}
        fileType=${args.fileType}
        ?loading=${args.loading}
        @thumbnail-close=${(e) => action('thumbnail-close')(e.detail)}
      ></kyn-thumbnail>
    `;
  },
};
