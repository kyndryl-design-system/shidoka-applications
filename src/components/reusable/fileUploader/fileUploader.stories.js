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

// Default text strings.
const args = {
  textStrings: {
    dragAndDropText: 'Drag files here to upload',
    separatorText: 'or',
    buttonText: 'Browse files',
    maxFileSizeText: 'Max file size',
    supportedFileTypeText: 'Supported file type: ',
    fileTypeDisplyText: 'Any file type',
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
};

export const FileUploaderSingle = {
  render: () => {
    return html` <sample-file-uploader></sample-file-uploader> `;
  },
};
FileUploaderSingle.storyName = 'File Uploader - Single file';

export const FileUploaderMultiple = {
  args: args,
  render: (args) => {
    return html`
      <sample-file-uploader ?multiple=${true}></sample-file-uploader>
    `;
  },
};
FileUploaderMultiple.storyName = 'File Uploader - Multiple files';
