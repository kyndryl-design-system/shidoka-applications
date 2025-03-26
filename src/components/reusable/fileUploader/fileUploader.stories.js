import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import checkmarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';
import errorFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/error-filled.svg';
import deleteIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/delete.svg';
import './index';
import '../link';
import '../inlineConfirm';

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
      <kyn-file-uploader-list-container>
        <kyn-file-uploader-item>
          <span slot="status-icon" class="success"
            >${unsafeSVG(checkmarkFilledIcon)}</span
          >
          <div class="file-details-container">
            <p>file_1.txt</p>
          </div>
          <div slot="actions">
            <kyn-inline-confirm ?destructive=${true}>
              <span class="delete">${unsafeSVG(deleteIcon)}</span>
              <span slot="confirmIcon">${unsafeSVG(deleteIcon)}</span>
            </kyn-inline-confirm>
          </div>
        </kyn-file-uploader-item>
        <kyn-file-uploader-item>
          <span slot="status-icon" class="error"
            >${unsafeSVG(errorFilledIcon)}</span
          >
          <div class="file-details-container">
            <p>file_2.txt</p>
          </div>
          <div slot="actions">
            <kyn-link standalone>Re-upload</kyn-link>
          </div>
        </kyn-file-uploader-item>
        <kyn-file-uploader-item>
          <span slot="status-icon" class="error"
            >${unsafeSVG(errorFilledIcon)}</span
          >
          <div class="file-details-container">
            <p>file_2.txt</p>
          </div>
          <div slot="actions">
            <kyn-link standalone>Re-upload</kyn-link>
          </div>
        </kyn-file-uploader-item>
        <kyn-file-uploader-item>
          <span slot="status-icon" class="error"
            >${unsafeSVG(errorFilledIcon)}</span
          >
          <div class="file-details-container">
            <p>file_2.txt</p>
          </div>
          <div slot="actions">
            <kyn-link standalone>Re-upload</kyn-link>
          </div>
        </kyn-file-uploader-item>
      </kyn-file-uploader-list-container>
      <style>
        .success {
          svg {
            fill: var(--kd-color-status-success-dark);
          }
        }
        .error {
          svg {
            fill: var(--kd-color-status-error-dark);
          }
        }
        .delete {
          svg {
            fill: var(--kd-color-background-button-primary-destructive-default);
          }
        }
      </style>
    `;
  },
};
