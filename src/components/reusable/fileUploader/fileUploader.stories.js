import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import '../button';
import './index';

export default {
  title: 'Components/File Uploader',
  component: 'kyn-file-uploader',
  subcomponents: {
    FileUploaderListContainer: 'kyn-file-uploader-list-container',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/rC5XdRnXVbDmu3vPN8tJ4q/2.1-Edinburgh?node-id=4253-31509&t=IEdMJk3IbVS8A5JL-0',
    },
  },
};

const args = {
  accept: ['image/jpeg', 'image/png'],
  multiple: true,
  textStrings: {
    dragAndDropText: 'Drag files here to upload',
    separatorText: 'or',
    buttonText: 'Browse files',
    maxFileSizeText: 'Max file size',
    supportedFileTypeText: 'Supported file type: ',
    fileTypeDisplyText: '.jpeg, .png',
    invalidFileListLabel: 'Some files could not be added:',
    validFileListLabel: 'Files added:',
    clearListText: 'Clear list',
    fileTypeErrorText: 'Invaild file type',
    fileSizeErrorText: 'Max file size exceeded',
    customFileErrorText: 'Custom file error',
    inlineConfirmAnchorText: 'Delete',
    inlineConfirmConfirmText: 'Confirm',
    inlineConfirmCancelText: 'Cancel',
    validationNotificationTitle: 'Multiple files not allowed',
    validationNotificationMessage: 'Please select only one file.',
  },
  maxFileSize: 2097152, // 2MB
  disabled: false,
};

export const Default = {
  args: args,
  render: (args) => {
    return html`
      <kyn-file-uploader
        .accept=${args.accept}
        .multiple=${args.multiple}
        .textStrings=${args.textStrings}
        .maxFileSize=${args.maxFileSize}
        ?disabled=${args.disabled}
        @selected-files=${(e) => action(e.type)(e)}
      >
      </kyn-file-uploader>
    `;
  },
};
