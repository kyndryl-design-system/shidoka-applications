import { html } from 'lit';
import './fileUploader.sample';

export default {
  title: 'Components/File Uploader',
  component: 'kyn-file-uploader',
  subcomponents: {
    FileUploaderListContainer: 'kyn-file-uploader-list-container',
    FileUploaderItem: 'kyn-file-uploader-item',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/rC5XdRnXVbDmu3vPN8tJ4q/2.1-Edinburgh?node-id=4253-31509&t=IEdMJk3IbVS8A5JL-0',
    },
  },
};

export const FileUploader = {
  render: () => {
    return html` <sample-file-uploader></sample-file-uploader> `;
  },
};
