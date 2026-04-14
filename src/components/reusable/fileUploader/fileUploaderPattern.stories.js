import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import { action } from 'storybook/actions';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import closeIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import './index';
import './fileUploader.sample';

import '../notification';
import '../progressBar';
import '../button';

export default {
  title: 'Components/Form Inputs/File Uploader',
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
};
FileUploaderWithForm.storyName = 'With form';

export const FileUploaderSingle = {
  args: {
    ...args,
    validFiles: [],
    invalidFiles: [],
    showNotification: false,
    showProgressBar: false,
    overallProgress: 0,
    currentFileUploading: '',
    completedFiles: 0,
    totalFiles: 0,
    notificationStatus: 'default',
    notificationTitle: 'Uploading',
    notificationMessage: '',
  },
  render: () => {
    const [storyArgs, updateArgs] = useArgs();

    const startFileUpload = (filesToUpload) => {
      const filesCount = filesToUpload.length;
      updateArgs({
        showNotification: true,
        showProgressBar: true,
        totalFiles: filesCount,
        completedFiles: 0,
        overallProgress: 0,
        notificationStatus: 'default',
        notificationTitle: 'Uploading',
      });

      filesToUpload.forEach((file, index) => {
        setTimeout(() => {
          const newCompletedFiles = index + 1;
          const overallProgress = Math.round(
            (newCompletedFiles / filesCount) * 100
          );

          updateArgs({
            completedFiles: newCompletedFiles,
            overallProgress,
            currentFileUploading: file.file.name,
          });

          if (overallProgress === 100) {
            const uploadedFiles = filesToUpload.map((f) => ({
              ...f,
              status: 'uploaded',
            }));
            updateArgs({
              validFiles: uploadedFiles,
              showProgressBar: false,
              notificationStatus: 'success',
              notificationTitle: 'Files uploaded',
              notificationMessage: `Success! ${filesCount} files have been uploaded.`,
            });

            setTimeout(() => {
              updateArgs({ showNotification: false });
            }, 1500);
          }

          const fileUploader = document.querySelector('kyn-file-uploader');
          if (fileUploader) {
            fileUploader.validFiles = filesToUpload;
          }
        }, 100 * (index + 1));
      });
    };

    return html`
      <style>
        .notification-status-body {
          display: flex;
          gap: 16px;
        }
      </style>
      <form
        @submit=${(e) => {
          e.preventDefault();
          if (storyArgs.validFiles && storyArgs.validFiles.length > 0) {
            startFileUpload(storyArgs.validFiles);
          }
          const formData = new FormData(e.target);
          console.log(...formData);
          return false;
        }}
      >
        <kyn-file-uploader
          name="file-uploader"
          .accept=${['image/jpeg', 'image/png']}
          ?multiple=${false}
          .validFiles=${storyArgs.validFiles}
          .invalidFiles=${storyArgs.invalidFiles}
          .textStrings=${storyArgs.textStrings}
          .maxFileSize=${storyArgs.maxFileSize}
          @selected-files=${(e) => {
            action(e.type)(e);
            updateArgs({
              validFiles: e.detail.validFiles,
              invalidFiles: e.detail.invalidFiles,
            });
          }}
        >
          ${storyArgs.showNotification
            ? html`
                <kyn-notification-container slot="upload-status">
                  <kyn-notification
                    type="toast"
                    hideCloseButton
                    .tagStatus=${storyArgs.notificationStatus}
                    .notificationTitle=${storyArgs.notificationTitle}
                  >
                    ${storyArgs.showProgressBar
                      ? html`
                          <div
                            style="display: flex; gap: 1rem; align-items: center;"
                          >
                            <kyn-progress-bar
                              .label=${storyArgs.currentFileUploading}
                              .value=${storyArgs.overallProgress}
                              .max=${100}
                              .status=${storyArgs.overallProgress === 100
                                ? 'success'
                                : 'active'}
                              .showInlineLoadStatus=${true}
                              .showActiveHelperText=${true}
                              .helperText=${`Uploading file ${storyArgs.completedFiles} of ${storyArgs.totalFiles}`}
                              .unit=${'%'}
                            ></kyn-progress-bar>
                            <kyn-button kind="outline" size="small">
                              <span slot="icon">${unsafeSVG(closeIcon)}</span>
                            </kyn-button>
                          </div>
                        `
                      : storyArgs.notificationMessage}
                  </kyn-notification>
                </kyn-notification-container>
              `
            : ``}
        </kyn-file-uploader>
        ${storyArgs.validFiles?.length > 0 || storyArgs.invalidFiles?.length > 0
          ? html`
              <kyn-button
                type="submit"
                size="small"
                ?disabled=${storyArgs.validFiles.length === 0 ||
                storyArgs.validFiles.every((f) => f.status === 'uploaded') ||
                storyArgs.validFiles.some((f) => f.status === 'uploading')}
              >
                Start upload
              </kyn-button>
            `
          : ''}
      </form>
    `;
  },
};
FileUploaderSingle.storyName = 'Simulated upload - single file';

//   render: () => {
//     return html`
//       <form
//         @submit=${(e) => {
//           e.preventDefault();
//           const formData = new FormData(e.target);
//           console.log(...formData);
//           return false;
//         }}
//       >
//         <kyn-file-uploader
//           name="file-uploader"
//           .accept=${['image/jpeg', 'image/png']}
//           multiple
//           .textStrings=${args.textStrings}
//           .maxFileSize=${args.maxFileSize}
//         ></kyn-file-uploader>
//         <kyn-button type="submit" size="small">Start upload</kyn-button>
//       </form>
//     `;
//   },
// };
// FileUploaderMultiple.storyName = 'Simulated upload - multiple files';

// export const FileUploaderImmediate = {
//   render: () => {
//     return html`
//       <form
//         @submit=${(e) => {
//           e.preventDefault();
//           return false;
//         }}
//       >
//         <kyn-file-uploader
//           name="file-uploader"
//           .accept=${['image/jpeg', 'image/png']}
//           immediate
//           .textStrings=${args.textStrings}
//           .maxFileSize=${args.maxFileSize}
//         ></kyn-file-uploader>
//       </form>
//     `;
//   },
// };
// FileUploaderImmediate.storyName = 'Simulated upload - immediate - single file';

export const FileUploaderImmediate = {
  args: {
    ...args,
    validFiles: [],
    invalidFiles: [],
    showNotification: false,
    showProgressBar: false,
    overallProgress: 0,
    currentFileUploading: '',
    completedFiles: 0,
    totalFiles: 0,
    notificationStatus: 'default',
    notificationTitle: 'Uploading',
    notificationMessage: '',
  },
  render: () => {
    const [storyArgs, updateArgs] = useArgs();

    const startFileUpload = (e) => {
      const filesToUpload = e;
      const filesCount = filesToUpload.length;

      updateArgs({
        showNotification: true,
        showProgressBar: true,
        totalFiles: filesCount,
        completedFiles: 0,
        overallProgress: 0,
        notificationStatus: 'default',
        notificationTitle: 'Uploading',
      });

      filesToUpload.forEach((file, index) => {
        setTimeout(() => {
          const newCompletedFiles = index + 1;
          const overallProgress = Math.round(
            (newCompletedFiles / filesCount) * 100
          );

          updateArgs({
            completedFiles: newCompletedFiles,
            overallProgress,
            currentFileUploading: file.id,
          });

          if (overallProgress === 100) {
            const uploadedFiles = filesToUpload.map((f) => ({
              ...f,
              status: 'uploaded',
            }));
            updateArgs({
              validFiles: uploadedFiles,
              showProgressBar: false,
              notificationStatus: 'success',
              notificationTitle: 'Files uploaded',
              notificationMessage: `Success! ${filesCount} files have been uploaded.`,
            });

            setTimeout(() => {
              updateArgs({ showNotification: false });
            }, 1500);
          }

          const fileUploader = document.querySelector('kyn-file-uploader');
          if (fileUploader) {
            fileUploader.validFiles = filesToUpload;
          }
        }, 100 * (index + 1));
      });
    };

    return html`
      <style>
        .notification-status-body {
          display: flex;
          gap: 16px;
        }
      </style>
      <form
        @submit=${(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          console.log(...formData);
          return false;
        }}
      >
        <kyn-file-uploader
          name="file-uploader"
          .accept=${['image/jpeg', 'image/png']}
          ?multiple=${false}
          immediate
          .validFiles=${storyArgs.validFiles}
          .invalidFiles=${storyArgs.invalidFiles}
          .textStrings=${storyArgs.textStrings}
          .maxFileSize=${storyArgs.maxFileSize}
          @selected-files=${(e) => {
            action(e.type)(e);
            updateArgs({
              validFiles: e.detail.validFiles,
              invalidFiles: e.detail.invalidFiles,
            });
            if (e.detail.validFiles.length > 0) {
              setTimeout(() => startFileUpload(e.detail.validFiles), 0);
            }
          }}
        >
          ${storyArgs.showNotification
            ? html`
                <kyn-notification-container slot="upload-status">
                  <kyn-notification
                    type="toast"
                    hideCloseButton
                    .tagStatus=${storyArgs.notificationStatus}
                    .notificationTitle=${storyArgs.notificationTitle}
                  >
                    ${storyArgs.showProgressBar
                      ? html`
                          <div
                            style="display: flex; gap: 1rem; align-items: center;"
                          >
                            <kyn-progress-bar
                              .label=${storyArgs.currentFileUploading}
                              .value=${storyArgs.overallProgress}
                              .max=${100}
                              .status=${storyArgs.overallProgress === 100
                                ? 'success'
                                : 'active'}
                              .showInlineLoadStatus=${true}
                              .showActiveHelperText=${true}
                              .helperText=${`Uploading file ${storyArgs.completedFiles} of ${storyArgs.totalFiles}`}
                              .unit=${'%'}
                            ></kyn-progress-bar>
                            <kyn-button kind="outline" size="small">
                              <span slot="icon">${unsafeSVG(closeIcon)}</span>
                            </kyn-button>
                          </div>
                        `
                      : storyArgs.notificationMessage}
                  </kyn-notification>
                </kyn-notification-container>
              `
            : ``}
        </kyn-file-uploader>
      </form>
    `;
  },
};
FileUploaderImmediate.storyName = 'Simulated upload -immediate - single file';

// const fileUploaderTemplate = (
//   storyArgs,
//   updateArgs,
//   startFileUpload,
//   isImmediate = false
// ) => {
//   return html`
//     <style>
//       .notification-status-body {
//         display: flex;
//         gap: 16px;
//       }
//     </style>
//     <form
//       @submit=${(e) => {
//         e.preventDefault();
//         if (
//           !isImmediate &&
//           storyArgs.validFiles &&
//           storyArgs.validFiles.length > 0
//         ) {
//           startFileUpload(storyArgs.validFiles);
//         }
//         const formData = new FormData(e.target);
//         console.log(...formData);
//         return false;
//       }}
//     >
//       <kyn-file-uploader
//         name="file-uploader"
//         .accept=${['image/jpeg', 'image/png']}
//         ?multiple=${false}
//         ?immediate=${isImmediate}
//         .validFiles=${storyArgs.validFiles}
//         .invalidFiles=${storyArgs.invalidFiles}
//         .textStrings=${storyArgs.textStrings}
//         .maxFileSize=${storyArgs.maxFileSize}
//         @selected-files=${(e) => {
//           action(e.type)(e);
//           updateArgs({
//             validFiles: e.detail.validFiles,
//             invalidFiles: e.detail.invalidFiles,
//           });
//           if (isImmediate && e.detail.validFiles.length > 0) {
//             setTimeout(() => startFileUpload(e.detail.validFiles), 0);
//           }
//         }}
//       >
//         ${storyArgs.showNotification
//           ? html`
//               <kyn-notification-container slot="upload-status">
//                 <kyn-notification
//                   type="toast"
//                   hideCloseButton
//                   .tagStatus=${storyArgs.notificationStatus}
//                   .notificationTitle=${storyArgs.notificationTitle}
//                 >
//                   ${storyArgs.showProgressBar
//                     ? html`
//                         <div
//                           style="display: flex; gap: 1rem; align-items: center;"
//                         >
//                           <kyn-progress-bar
//                             .label=${storyArgs.currentFileUploading}
//                             .value=${storyArgs.overallProgress}
//                             .max=${100}
//                             .status=${storyArgs.overallProgress === 100
//                               ? 'success'
//                               : 'active'}
//                             .showInlineLoadStatus=${true}
//                             .showActiveHelperText=${true}
//                             .helperText=${`Uploading file ${storyArgs.completedFiles} of ${storyArgs.totalFiles}`}
//                             .unit=${'%'}
//                           ></kyn-progress-bar>
//                           <kyn-button kind="outline" size="small">
//                             <span slot="icon">${unsafeSVG(closeIcon)}</span>
//                           </kyn-button>
//                         </div>
//                       `
//                     : storyArgs.notificationMessage}
//                 </kyn-notification>
//               </kyn-notification-container>
//             `
//           : ``}
//       </kyn-file-uploader>
//       ${!isImmediate &&
//       (storyArgs.validFiles?.length > 0 || storyArgs.invalidFiles?.length > 0)
//         ? html`
//             <kyn-button
//               type="submit"
//               size="small"
//               ?disabled=${storyArgs.validFiles.length === 0 ||
//               storyArgs.validFiles.every((f) => f.status === 'uploaded') ||
//               storyArgs.validFiles.some((f) => f.status === 'uploading')}
//             >
//               Start upload
//             </kyn-button>
//           `
//         : ''}
//     </form>
//   `;
// };
