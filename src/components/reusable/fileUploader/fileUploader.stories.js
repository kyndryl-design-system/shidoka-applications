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

export const FileUploader = {
  args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        buttonLabel=${args.buttonLabel}
        .fileTypes=${args.fileTypes}
        @on-file-upload=${(e) => action(e.type)(e)}
      ></kyn-file-uploader>
    `;
  },
};

export const FileUploaderWithDargAndDropContainer = {
  args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        buttonLabel=${args.buttonLabel}
        .fileTypes=${args.fileTypes}
        .fileUploderType=${'drag-drop'}
        @on-file-upload=${(e) => action(e.type)(e)}
      ></kyn-file-uploader>
    `;
  },
};

export const FileUploaderWithBoth = {
  args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        buttonLabel=${args.buttonLabel}
        .fileTypes=${args.fileTypes}
        .fileUploderType=${'both'}
        @on-file-upload=${(e) => action(e.type)(e)}
      ></kyn-file-uploader>
    `;
  },
};

export const FileUploaderMultipleExample = {
  args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        buttonLabel=${args.buttonLabel}
        .fileTypes=${args.fileTypes}
        ?multiple=${true}
        @on-file-upload=${(e) => action(e.type)(e)}
      ></kyn-file-uploader>
    `;
  },
};
