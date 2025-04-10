import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/preview-api';
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

// Default text strings.
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
  maxFileSize: 2097152,
  disabled: false,
};

let validFiles = [];

const handleFileSubmit = () => {
  const fileUploader = document.querySelector('kyn-file-uploader');

  validFiles = validFiles.map((file) => ({
    ...file,
    status: 'uploaded',
  }));

  fileUploader.validFiles = validFiles;
};

export const Default = {
  args: args,
  render: (args) => {
    const [{ disabled }, updateArgs] = useArgs();
    return html`
      <form
        @submit=${(e) => {
          e.preventDefault();
          handleFileSubmit();
          const formData = new FormData(e.target);
          console.log(...formData);
          return false;
        }}
      >
        <kyn-file-uploader
          name="file-Uploader"
          .accept=${args.accept}
          .multiple=${args.multiple}
          .textStrings=${args.textStrings}
          .maxFileSize=${args.maxFileSize}
          ?disabled=${disabled}
          @selected-files=${(e) => {
            action(e.type)(e);
            validFiles = e.detail.validFiles;
          }}
        >
        </kyn-file-uploader>
        <kyn-button
          type="submit"
          name="test"
          size="small"
          ?disabled=${disabled}
          @on-click=${() => {
            console.log(
              document.querySelector('form').reportValidity()
                ? 'valid'
                : 'invalid'
            );
            updateArgs({ disabled: true });
          }}
        >
          Start upload
        </kyn-button>
      </form>
    `;
  },
};
