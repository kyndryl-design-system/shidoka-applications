import { html } from 'lit';
import { useArgs } from '@storybook/preview-api';
import { action } from '@storybook/addon-actions';
import './index';
import './fileUploader.sample';

export default {
  title: 'Components/File Uploader/Patterns',
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
  maxFileSize: 1048576,
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

export const FileUploaderWithForm = {
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
          ?disabled=${args.disabled}
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
          ?disabled=${args.disabled}
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
FileUploaderWithForm.storyName = 'With form';

export const FileUploaderSingle = {
  render: () => {
    return html` <sample-file-uploader></sample-file-uploader> `;
  },
};
FileUploaderSingle.storyName = 'Simulated upload - single file';

export const FileUploaderMultiple = {
  render: () => {
    return html`
      <sample-file-uploader ?multiple=${true}></sample-file-uploader>
    `;
  },
};
FileUploaderMultiple.storyName = 'Simulated upload - multiple files';
