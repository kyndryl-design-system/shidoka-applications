import { html } from 'lit';

import '../button';
import '../pagetitle';
import '../sideDrawer';

export default {
  title: 'Components/Widget/Gridstack',
  decorators: [
    (story) => html`
      <style>
        .sample {
          width: 50%;
        }
      </style>
      ${story()}
    `,
  ],
};

const colorSwatch = [
  '#D9D9D9',
  '#FFFFFF',
  '#E8BA02',
  '#2F808C',
  '#FF462D',
  '#9747FF',
  '#4CDD84',
  '#1D2125',
  '#5FBEAC',
];

export const Settings = {
  render: () => {
    return html`
      <div class="sample">
        <div class="dashboard-wrapper">
          <kyn-page-title
            type="tertiary"
            pageTitle="Settings"
            subTitle="Change the background image or color"
          >
          </kyn-page-title>
          <div class="visual-customizer">
            <div class="bacground-image">
              <div class="bg_title kd-type--body-02">Background Image</div>
              <div class="image-grid">
                <div class="image-row">
                  <img
                    class="image-content"
                    src="./VisualSelector/VisualSelector.png"
                    alt="Logo"
                  />
                  <img
                    class="image-content"
                    src="./VisualSelector/VisualSelector1.png"
                    alt="Logo"
                  />
                </div>
                <div class="image-row">
                  <img
                    class="image-content"
                    src="./VisualSelector/VisualSelector2.png"
                    alt="Logo"
                  />
                  <img
                    class="image-content"
                    src="./VisualSelector/VisualSelector3.png"
                    alt="Logo"
                  />
                </div>
              </div>
              <kyn-side-drawer
                style="display:contents"
                ?open=${false}
                size="standard"
                titleText="Dashboard Manager"
                ?hideCancelButton=${true}
                submitBtnText="Save"
              >
                <kyn-button
                  style="width:100%"
                  slot="anchor"
                  kind="secondary"
                  type="button"
                  size="medium"
                  >Upload Image</kyn-button
                >
                <div class="dashboard-wrapper">
                  <div class="bacground-image">
                    <div class="bg_title kd-type--body-02">
                      Background Image
                    </div>
                    <div class="bacground-image">
                      <kyn-file-uploader style="width:100%"></kyn-file-uploader>
                    </div>
                  </div>
                </div>
              </kyn-side-drawer>
            </div>
            <div class="bacground-image">
              <div class="bg_title kd-type--body-02">Background Color</div>
              <div class="color-swatch">
                ${colorSwatch.map((color) => {
                  return html`
                    <div
                      class="color-selector"
                      style="background-color:${color}"
                    ></div>
                  `;
                })}
              </div>
              <kyn-button
                style="width:100%"
                kind="secondary"
                type="button"
                size="medium"
                iconposition="right"
                description="Add new color"
              >
                Add New Color
              </kyn-button>
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
      </style>
    `;
  },
};
