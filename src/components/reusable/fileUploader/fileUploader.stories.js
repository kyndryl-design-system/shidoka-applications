import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import './index';

export default {
  title: 'Components/FileUploader',
  component: 'kyn-file-uploader',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const args = {
  fileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
};

// TODO: remove this function before merging
function logFileEvent(event) {
  console.log(event.detail.files);
}

export const FileUploader = {
  args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        buttonLabel=${args.buttonLabel}
        .fileTypes=${args.fileTypes}
        ?disabled=${args.disabled}
        @on-file-upload=${(e) => action(e.type)(e)}
      ></kyn-file-uploader>
    `;
  },
};
