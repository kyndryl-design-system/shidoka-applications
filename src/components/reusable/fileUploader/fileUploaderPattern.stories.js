import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import { action } from 'storybook/actions';
import './index';
import './fileUploader.sample';

export default {
  title: 'Examples/File Uploader',
};

const args = {
  name: 'file-uploader',
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
  maxFileSize: 10485760, // 10MB
  disabled: false,
};

const parameters = {
  docs: {
    source: {
      code: `
      // For guidance on how to construct this code, please refer to the 'fileUploader.sample.ts' file.
      // You can find it at the following path:
      // https://github.com/kyndryl-design-system/shidoka-applications/tree/main/src/components/reusable/fileUploader/fileUploader.sample.ts
      `,
    },
  },
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
          name=${args.name}
          .accept=${args.accept}
          .multiple=${args.multiple}
          .textStrings=${args.textStrings}
          .maxFileSize=${args.maxFileSize}
          ?disabled=${args.disabled}
          @selected-files=${(e) => {
            action(e.type)({ ...e, detail: e.detail });
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
  parameters,
};
FileUploaderWithForm.storyName = 'With form';

export const FileUploaderSingle = {
  render: () => {
    return html` <sample-file-uploader></sample-file-uploader> `;
  },
  parameters,
};
FileUploaderSingle.storyName = 'Simulated upload - single file';

export const FileUploaderMultiple = {
  render: () => {
    return html`
      <sample-file-uploader ?multiple=${true}></sample-file-uploader>
    `;
  },
  parameters,
};
FileUploaderMultiple.storyName = 'Simulated upload - multiple files';

export const FileUploaderImmediate = {
  render: () => {
    return html` <sample-file-uploader immediate></sample-file-uploader> `;
  },
  parameters,
};
FileUploaderImmediate.storyName = 'Simulated upload - immediate - single file';
