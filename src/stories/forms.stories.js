import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html } from 'lit';
import '../components/reusable/radioButton';
import '../components/reusable/checkbox';
import '../components/reusable/toggleButton';
import '../components/reusable/textInput';
import '../components/reusable/textArea';
import '../components/reusable/numberInput';
import '../components/reusable/dropdown';
import '../components/reusable/timepicker';
import '../components/reusable/datePicker';
import '../components/reusable/daterangepicker';
import '../components/reusable/tooltip';
import '../components/reusable/button';
import '../components/reusable/sliderInput';
import '../components/reusable/fileUploader';
import '../components/reusable/colorInput';
import '../components/reusable/multiInputField';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import { action } from 'storybook/actions';

export default {
  title: 'Patterns/Forms',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-15301&p=f&m=dev',
    },
  },
};

export const Default = {
  render: () => {
    return html`
      <style>
        .info-icon {
          display: flex;
        }
      </style>
      <form
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          handleFileSubmit();
          const formData = new FormData(e.target);
          console.log(...formData);
          // console.log(e.submitter);
          // submitter is not accessible with form associated custom elements, see https://github.com/WICG/webcomponents/issues/814

          return false;
        }}
      >
        <kyn-radio-button-group
          name="radio"
          @on-radio-group-change=${(e) => action(e.type)(e)}
          label="Radio buttons"
        >
          <kyn-tooltip slot="tooltip">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
          <kyn-radio-button value="1"> Option 1 </kyn-radio-button>
          <kyn-radio-button value="2"> Option 2 </kyn-radio-button>
          <kyn-radio-button value="3"> Option 3 </kyn-radio-button>
        </kyn-radio-button-group>

        <br />

        <kyn-checkbox-group
          name="checkbox"
          label="Checkboxes"
          @on-checkbox-group-change=${(e) => action(e.type)(e)}
        >
          <kyn-checkbox value="1"> Option 1 </kyn-checkbox>
          <kyn-checkbox value="2"> Option 2 </kyn-checkbox>
          <kyn-checkbox value="3"> Option 3 </kyn-checkbox>
        </kyn-checkbox-group>

        <br />

        <kyn-toggle-button
          label="Toggle button"
          name="toggle"
          value="example"
          @on-change=${(e) => action(e.type)(e)}
        >
        </kyn-toggle-button>

        <br /><br />

        <kyn-dropdown
          label="Dropdown"
          name="dropdown"
          openDirection="down"
          value="1"
          caption="Dropdown example"
          @on-change=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>

          <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
          <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          <kyn-dropdown-option value="3" disabled>
            Disabled Option
          </kyn-dropdown-option>
          <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
          <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
          <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
          <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
        </kyn-dropdown>

        <br /><br />

        <kyn-dropdown
          name="dropdownMulti"
          label="Multi-select dropdown (auto open direction)"
          openDirection="auto"
          multiple
          searchable
          caption="Searchable Multi-Select Dropdown example"
          @on-change=${(e) => action(e.type)(e)}
        >
          <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
          <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          <kyn-dropdown-option value="3" disabled>
            Disabled Option
          </kyn-dropdown-option>
          <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
          <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
          <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
          <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
        </kyn-dropdown>

        <br /><br />

        <kyn-dropdown
          name="dropdownMulti"
          label="Multi-select dropdown (opens up)"
          openDirection="up"
          multiple
          searchable
          caption="Searchable Multi-Select Dropdown example"
          @on-change=${(e) => action(e.type)(e)}
        >
          <kyn-dropdown-option value="1">Option 1</kyn-dropdown-option>
          <kyn-dropdown-option value="2">Option 2</kyn-dropdown-option>
          <kyn-dropdown-option value="3" disabled>
            Disabled Option
          </kyn-dropdown-option>
          <kyn-dropdown-option value="4">Option 4</kyn-dropdown-option>
          <kyn-dropdown-option value="5">Option 5</kyn-dropdown-option>
          <kyn-dropdown-option value="6">Option 6</kyn-dropdown-option>
          <kyn-dropdown-option value="7">Option 7</kyn-dropdown-option>
        </kyn-dropdown>

        <br /><br />

        <kyn-text-input
          required
          name="textInput"
          placeholder="Placeholder text"
          caption="Text input example"
          label="Text input"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-text-input>
        <br /><br />

        <kyn-text-area
          name="textArea"
          placeholder="Placeholder text"
          caption="Text area example"
          label="Text area"
          @on-input=${(e) => action(e.type)(e)}
          @keydown=${(e) => e.stopPropagation()}
        >
          <kyn-tooltip slot="tooltip">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-text-area>
        <br /><br />

        <kyn-text-input
          name="password-form-input"
          label="Password"
          type="password"
          placeholder="Enter password"
          minLength="8"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
          caption="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
          style="width: 95%; max-width: 350px;"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Password must be at least 8 characters.
          </kyn-tooltip>
        </kyn-text-input>
        <br /><br />

        <kyn-number-input
          name="numberInput"
          caption="Number input example"
          label="Number input"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-number-input>
        <br /><br />

        <kyn-time-picker
          name="time-picker"
          label="Time Picker"
          required
          dateFormat="H:i"
          caption="Time picker example"
          ?twentyFourHourFormat=${true}
          defaultErrorMessage="A time value is required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-time-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-picker"
          label="Date Picker"
          dateFormat="Y-m-d"
          caption="Date picker example"
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        ></kyn-date-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-picker"
          label="Multi-Date Picker"
          dateFormat="Y-m-d"
          mode="multiple"
          caption="Date picker example"
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        ></kyn-date-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-time-picker"
          label="Date + Time Picker"
          dateFormat="Y-m-d h:i K"
          caption="Date time picker example"
          ?twentyFourHourFormat=${false}
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-picker>

        <br /><br />

        <kyn-date-range-picker
          required
          label="Date Range Picker"
          name="date-range"
          dateFormat="Y-m-d"
          caption="Date range picker example"
          defaultErrorMessage="Both start and end dates are required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-range-picker>

        <br /><br />

        <kyn-date-range-picker
          required
          name="date-time-range"
          label="Date + Time Range Picker"
          dateFormat="Y-m-d h:i K"
          caption="Date time range picker example"
          ?twentyFourHourFormat=${false}
          defaultErrorMessage="Both start and end dates are required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-range-picker>

        <br /><br />

        <h3 class="kd-type--headline-08">
          Pre-selected Date/Time/Date-Range Inputs
        </h3>

        <br />

        <kyn-time-picker
          required
          name="time-picker-pre-selected"
          label="Time Picker"
          dateFormat="H:i"
          caption="Time picker example (pre-selected)"
          ?twentyFourHourFormat=${true}
          defaultErrorMessage="A time value is required"
          defaultMinute=${30}
          defaultHour=${12}
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-time-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-picker-pre-selected"
          label="Multi-Date Picker"
          dateFormat="Y-m-d"
          mode="multiple"
          caption="Date picker example (multi, pre-selected)"
          .defaultDate=${'2022-01-03T00:00:00Z'}
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        ></kyn-date-picker>

        <br /><br />

        <kyn-date-picker
          required
          name="date-picker-pre-selected-1"
          label="Multi-Date Picker"
          dateFormat="Y-m-d"
          mode="multiple"
          caption="Date picker example (multi, pre-selected)"
          .defaultDate=${['2022-01-02', '2022-01-03']}
          defaultErrorMessage="A date value is required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        ></kyn-date-picker>

        <br /><br />

        <kyn-date-range-picker
          required
          name="date-time-range--pre-selected"
          label="Date + Time Range Picker"
          dateFormat="Y-m-d h:i K"
          caption="Date time range picker example"
          ?twentyFourHourFormat=${false}
          .defaultDate=${['2025-01-02T00:00:00Z', '2025-01-13T00:00:00Z']}
          defaultErrorMessage="Both start and end dates are required"
          @on-input=${(e) => action(e.type)(e)}
          style="min-width: 425px;"
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-date-range-picker>

        <br /><br />

        <kyn-slider-input
          name="slider range input"
          value="0"
          caption="Slider input example"
          label="Slider Input"
          min="0"
          max="100"
          ?enableTooltip=${true}
          ?enableTickMarker=${false}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>
        <br /><br />

        <kyn-slider-input
          name="slider input with discrete step"
          value="0"
          caption="Slider input with discrete step example"
          label="Slider Input with discrete step example"
          step="10"
          min="0"
          max="100"
          ?enableTooltip=${true}
          ?enableTickMarker=${true}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>
        <br /><br />

        <kyn-slider-input
          name="slider input with custom labels"
          value="0"
          caption="Slider input with custom labels example"
          label="Slider Input with custom labels example"
          step="10"
          min="0"
          max="100"
          .customLabels=${['Low', 'Medium', 'High']}
          ?enableTooltip=${true}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>
        <br /><br />

        <kyn-slider-input
          name="Slider with editable input"
          value="0"
          caption="Slider with editable input example"
          label="Slider With Editable Input"
          min="0"
          max="100"
          ?editableInput=${true}
          ?enableTooltip=${true}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>
        <br /><br />

        <kyn-slider-input
          name="Slider input with discrete step"
          value="0"
          caption="Slider with editable input example"
          label="Slider Input with discrete step"
          step="10"
          min="0"
          max="100"
          ?editableInput=${true}
          ?enableTooltip=${false}
          ?enableTickMarker=${true}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>
        <br /><br />

        <h3 class="kd-type--headline-08">
          Pre-selected Slider Input with Editable Input
        </h3>
        <br />
        <kyn-slider-input
          name="Slider Input with Pre-selected value"
          caption="Slider input example"
          label="Slider Input"
          min="0"
          max="100"
          value="30"
          ?editableInput=${true}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>
        <br /><br />

        <kyn-slider-input
          name="Slider Input with Pre-selected value"
          caption="Slider input example"
          label="Slider Input"
          step="10"
          min="0"
          max="100"
          value="30"
          ?editableInput=${true}
          ?enableTooltip=${false}
          ?enableTickMarker=${true}
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-slider-input>

        <br /><br />
        <kyn-color-input
          name="colorInput"
          value=""
          caption="Color input example"
          label="Color input"
          @on-input=${(e) => action(e.type)(e)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Tooltip example.
          </kyn-tooltip>
        </kyn-color-input>
        <br /><br />

        <kyn-multi-input-field
          name="inviteEmails"
          inputType="email"
          label="Email Invites"
          caption="Enter email addresses and press Enter after each one."
          placeholder="Enter email addresses"
          @on-change=${(e) => action('email-change')(e.detail)}
        >
          <kyn-tooltip slot="tooltip" anchorPosition="start">
            <span slot="anchor" class="info-icon">${unsafeSVG(infoIcon)}</span>
            Enter multiple email addresses
          </kyn-tooltip>
        </kyn-multi-input-field>
        <br /><br />
        <kyn-file-uploader
          name="file-uploader"
          .accept=${['image/jpeg', 'image/png']}
          .textStrings=${{
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
          }}
          .validFiles=${validFiles}
          ?multiple=${true}
          @selected-files=${(e) => {
            validFiles = e.detail.validFiles;
          }}
        ></kyn-file-uploader>

        <kyn-button
          type="submit"
          name="test"
          @on-click=${() => {
            // check validity of the overall form
            console.log(
              document.querySelector('form').reportValidity()
                ? 'valid'
                : 'invalid'
            );
          }}
        >
          Submit
        </kyn-button>
      </form>
    `;
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
