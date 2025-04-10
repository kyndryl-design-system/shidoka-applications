import { html } from 'lit';
import './fileUploader.sample';

export default {
  title: 'Components/File Uploader/ With Progress Simulation ',
};

export const FileUploaderSingle = {
  render: () => {
    return html` <sample-file-uploader></sample-file-uploader> `;
  },
};
FileUploaderSingle.storyName = 'File Uploader - Single file';

export const FileUploaderMultiple = {
  render: () => {
    return html`
      <sample-file-uploader ?multiple=${true}></sample-file-uploader>
    `;
  },
};
FileUploaderMultiple.storyName = 'File Uploader - Multiple files';
