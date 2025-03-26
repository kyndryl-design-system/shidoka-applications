import { html } from 'lit';
import './fileUploader.sample';

export default {
  title: 'Components/FileUploader',
  component: 'kyn-file-uploader',
  subcomponents: {
    FileUploaderListContainer: 'kyn-file-uploader-list-container',
    FileUploaderItem: 'kyn-file-uploader-item',
  },
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

export const FileUploader = {
  render: () => {
    return html` <sample-file-uploader></sample-file-uploader> `;
  },
};
