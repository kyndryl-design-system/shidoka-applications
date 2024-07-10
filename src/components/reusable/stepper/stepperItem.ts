import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import stepperItemStyles from './stepperItem.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/link';
import checkmarkFilled from '@carbon/icons/es/checkmark--filled/24';
import circleFilled from '@carbon/icons/es/circle--filled/24';
import substractFilled from '@carbon/icons/es/subtract--filled/24';
import errorFilled from '@carbon/icons/es/error--filled/24';

@customElement('kyn-stepper-item')
export class StepperItem extends LitElement {
  static override styles = stepperItemStyles;

  @property({ type: Boolean }) // vertical or not
  vertical = false;

  @property({ type: String })
  stepName = '';
  @property({ type: String })
  stepTitle = '';

  override render() {
    return html`
      ${this.vertical
        ? this.renderVerticalStepper()
        : this.renderHorizontalStepper()}
    `;
  }

  private renderHorizontalStepper() {
    return html`<div class="stepper-step" part="stepper-div">
      <div class="stepper-icon">
        <kd-icon slot="icon" .icon=${checkmarkFilled} fill="#2F808C"></kd-icon>
      </div>

      <div
        class="progress--root stepper-progress"
        role="progressbar"
        aria-valuenow="50"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="progressbar customstep-bar"></div>
      </div>
      <div class="step-content">
        <p class="step-text">${this.stepName}</p>
        <!-- <p class="step-title">Title 1</p> -->
        <kd-link
          standalone
          href=""
          target="_self"
          kind="primary"
          ?disabled=${false}
          @on-click=${(e: any) => console.log(e)}
          >${this.stepTitle}</kd-link
        >
      </div>
    </div>`;
  }

  private renderVerticalStepper() {
    return html`
      <div class="vertical-stepper-container">
        <div class="vertical-stepper-line">
          <div class="vertical-progress-line"></div>
        </div>

        <div class="vertical-icon-wrapper">
          <kd-icon
            slot="icon"
            .icon=${checkmarkFilled}
            fill="#2F808C"
          ></kd-icon>
        </div>
        <div class="vertical-item-content">
          <p class="vertical-step-text">${this.stepName}</p>
          <kd-link
            standalone
            href=""
            target="_self"
            kind="primary"
            ?disabled=${false}
            @on-click=${(e: any) => console.log(e)}
            >${this.stepTitle}</kd-link
          >
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper-item': StepperItem;
  }
}
