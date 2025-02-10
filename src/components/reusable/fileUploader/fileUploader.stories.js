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
  disabled: false,
};

// TODO: remove this function before merging
function logFileEvent(event) {
  console.log(event.detail.files[0]);
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

export const FileUploaderWithDargAndDropContainer = {
  args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        buttonLabel=${args.buttonLabel}
        .fileTypes=${args.fileTypes}
        .fileUploderType=${'drag-drop'}
        ?disabled=${args.disabled}
        @on-file-upload=${(e) => {
          action(e.type)(e);
          logFileEvent(e);
        }}
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
        ?disabled=${args.disabled}
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
        ?disabled=${args.disabled}
        @on-file-upload=${(e) => action(e.type)(e)}
      ></kyn-file-uploader>
    `;
  },
};
