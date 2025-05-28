import { html } from 'lit';
import { useArgs } from '@storybook/preview-api';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import ClosedFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/close-filled.svg';
import CheckMarkFilledIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/checkmark-filled.svg';

import '../button';
import '../pagetitle';
import '../textInput';

export default {
  title: 'Components/Widget/Gridstack',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

// const colorSwatchArr = [
//   '#D9D9D9',
//   '#FFFFFF',
//   '#E8BA02',
//   '#2F808C',
//   '#FF462D',
//   '#9747FF',
//   '#4CDD84',
//   '#1D2125',
//   '#5FBEAC',
// ];

export const colorSwatch = {
  args: {
    showColorPicker: false,
    selected: false,
    selectedColor: '',
    addNewColor: false,
    colorSwatchArr: [
      '#D9D9D9',
      '#FFFFFF',
      '#E8BA02',
      '#2F808C',
      '#FF462D',
      '#9747FF',
      '#4CDD84',
      '#1D2125',
      '#5FBEAC',
    ],
  },
  render: () => {
    const [
      { addNewColor, showColorPicker, selected, colorSwatchArr, selectedColor },
      updateArgs,
    ] = useArgs();
    const handleAddNewColor = () => {
      updateArgs({ addNewColor: true });
    };
    const handleSave = (e) => {
      updateArgs({
        addNewColor: false,
        showColorPicker: false,
        selected: false,
        colorSwatchArr:
          e === 'save' && !colorSwatchArr.includes(selectedColor)
            ? [...colorSwatchArr, selectedColor]
            : colorSwatchArr,
      });
    };
    const handleColorChange = (e) => {
      e.stopPropagation();
      updateArgs({
        selectedColor: e.target.value,
      });
      const input = document.querySelector('kyn-text-input');
      if (input) input.value = e.target.value;
    };
    const handleInputColorChange = (e) => {
      console.log('handleInputColorChange----', e.detail.value);
      updateArgs({
        selectedColor: e.detail.value,
      });
    };
    const openColorPicker = (e) => {
      e.stopPropagation();

      updateArgs({ showColorPicker: true });
    };
    const handleBtnClicked = (e) => {
      e.stopPropagation();
      updateArgs({ selected: !selected });
    };
    return html`
      <div class="sample">
        <div class="dashboard-wrapper">
          <div class="visual-customizer">
            <div class="bacground-image">
              <div class="bg_title kd-type--body-02">Background Color</div>
              <div class="color-swatch">
                ${colorSwatchArr.map((color) => {
                  return html`
                    <button
                      class="test"
                      style="background-color:${color};"
                      type="button"
                      aria-label="Background Color"
                      title="Background Color"
                      name="Background Color"
                      value="hello"
                      @click=${(e) => handleBtnClicked(e)}
                    >
                      ${showColorPicker
                        ? html` <span>${unsafeSVG(ClosedFilledIcon)}</span> `
                        : null}
                      ${selected && !showColorPicker
                        ? html`<span>${unsafeSVG(CheckMarkFilledIcon)}</span>`
                        : null}
                    </button>
                  `;
                })}
              </div>
              <!-- <div class="color-swatch">
                ${colorSwatchArr.map((color) => {
                return html`
                  <div
                    class="color-selector"
                    style="background-color:${color}; position: relative;"
                  >
                    <span
                      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);padding-top: 8px;"
                      >${unsafeSVG(ClosedFilledIcon)}</span
                    >
                  </div>
                `;
              })}
              </div> -->
              ${addNewColor
                ? html`
                    <div>
                      <div
                        style="display: flex;align-items: center;gap: 10px;float:left;margin-right: 10px;"
                      >
                        <div class="bg_title kd-type--body-02">
                          Pick a color:
                        </div>
                        <input
                          class="custom-color"
                          type="color"
                          name="favcolor"
                          value=${selectedColor}
                          @input=${handleColorChange}
                          @click=${openColorPicker}
                        />
                      </div>
                      <div style="display: flex;">
                        <kyn-text-input
                          type="text"
                          size="sm"
                          name="textInput"
                          required
                          value=${selectedColor}
                          hideLabel
                          @on-input=${(e) => handleInputColorChange(e)}
                        >
                        </kyn-text-input>
                      </div>
                    </div>
                    <div class="add_color">
                      <kyn-button
                        style="width:100%"
                        kind="secondary"
                        type="button"
                        size="medium"
                        iconposition="right"
                        description="Save"
                        @on-click=${() => handleSave('save')}
                      >
                        Save
                      </kyn-button>
                      <kyn-button
                        style="width:100%"
                        kind="tertiary"
                        type="button"
                        size="medium"
                        iconposition="right"
                        description="Save"
                        @on-click=${() => handleSave('cancel')}
                      >
                        Cancel
                      </kyn-button>
                    </div>
                  `
                : html`
                    <kyn-button
                      style="width:100%"
                      kind="secondary"
                      type="button"
                      size="medium"
                      iconposition="right"
                      description="Add new color"
                      @on-click=${() => handleAddNewColor()}
                    >
                      Add New Color
                    </kyn-button>
                  `}
            </div>
          </div>
        </div>
      </div>
      <style>
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 32px;
          align-self: stretch;
        }
        .visual-customizer {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-self: stretch;
          .bg_title {
            color: var(--kd-color-text-title-tertiary);
          }
        }
        .bacground-image {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }
        .image-grid {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }
        .image-row {
          display: flex;
          align-items: center;
          gap: 16px;
          align-self: stretch;
        }
        .image-content {
          display: flex;
          height: 240px;
          align-items: flex-end;
          gap: 10px;
          flex: 1 0 0;
        }
        .color-picker {
          width: 32px;
          height: 32px;
          padding: 0;
          border-radius: 4px;
          border: 2px solid var(--kd-color-border-container-default);
        }
        .color-swatch {
          display: flex;
          align-items: flex-start;
          align-content: flex-start;
          gap: 10px;
          align-self: stretch;
          flex-wrap: wrap;
        }
        .color-selector {
          display: block;
          border-radius: 50%;
          outline: 1px solid var(--kd-color-border-accent-secondary);
          width: 60px;
          height: 60px;
        }
        .custom-color {
          -webkit-appearance: none;
          border: none;
          width: 32px;
          height: 32px;
          padding: 0;
          background: none;
          cursor: pointer;
        }
        .custom-color::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        .custom-color::-webkit-color-swatch {
          border: none;
          border-radius: 4px;
        }
        .custom-color::-moz-color-swatch {
          border: none;
          border-radius: 4px;
        }
        .add_color {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          align-self: stretch;
        }
        .test {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #d9d9d9;
          border: 1px solid var(--kd-color-border-accent-secondary);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          cursor: pointer;
          outline: 2px solid transparent;
          outline-offset: 2px;
          span > svg {
            fill: var(--kd-color-icon-primary);
          }
        }
        .test:focus-visible {
          outline-color: var(--kd-color-border-button-primary-state-focused);
        }
      </style>
    `;
  },
};
