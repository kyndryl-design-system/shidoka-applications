import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import checkmarkFilled from '@carbon/icons/es/checkmark--filled/24';
import circleFilled from '@carbon/icons/es/circle--filled/24';
import substractFilled from '@carbon/icons/es/subtract--filled/24';
import errorFilled from '@carbon/icons/es/error--filled/24';

@customElement('stepper-variant')
export class StepperVariant extends LitElement {
  @property({ type: Number })
  progress = 0;
  static override styles = css`
    p {
      margin: 0;
    }
    .stepper-wrapper {
      font-family: Arial;
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .stepper-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }

    .stepper-item::before {
      position: absolute;
      content: '';
      border-bottom: 3px solid #ddf0f3;
      border-radius: 5px;
      /* width: 100%;
      top: 12px;
      left: -50%; */
      width: calc(100% - 40px);
      top: 11.5px;
      left: calc(-50% + 20px);
      z-index: 2;
    }

    .stepper-item::after {
      position: absolute;
      content: '';
      border-bottom: 3px solid #ddf0f3;
      border-radius: 5px;
      /* width: 100%;
      top: 12px;
      left: 50%; */
      width: calc(100% - 40px);
      top: 11.5px;
      left: calc(50% + 20px);
      z-index: 2;
    }

    .stepper-item .step-counter {
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ccc;
      margin-bottom: 6px;
    }

    .stepper-item.active {
      font-weight: bold;
    }

    .stepper-item.completed .step-counter {
      background-color: #4bb543;
    }

    .stepper-item.completed::after {
      position: absolute;
      content: '';
      border-bottom: 3px solid #3fadbd;
      border-radius: 5px;
      top: 11.5px;
      /* width: 100%;
      left: 50%; */
      width: calc(100% - 40px);
      left: calc(50% + 20px);
      z-index: 3;
    }
    /* .stepper-item:first-child {
      align-items: flex-start;
    } */

    .stepper-item:first-child::before {
      display: none;
      content: none;
    }
    .stepper-item:last-child::after {
      display: none;
      content: none;
    }
    /** new h stepper */
    .st-h-wrapper {
      display: inline-flex;
      align-items: center;
    }
    .st-component {
      position: relative;
      display: flex;
      width: 174px;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .st-component::before {
      position: absolute;
      content: '';
      border-bottom: 2px solid #ccc;
      width: 100%;
      top: 12px;
      left: -50%;
      z-index: 2;
    }
    .st-component::after {
      position: absolute;
      content: '';
      border-bottom: 2px solid #ccc;
      width: 100%;
      top: 12px;
      left: 50%;
      z-index: 2;
    }
    .st-component:first-child::before {
      content: none;
    }
    .st-component:last-child::after {
      content: none;
    }
    .st-h-progress {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      align-self: stretch;
      position: relative;
      z-index: 3;
    }

    .st-h-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      align-self: stretch;
    }

    .stepper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      position: relative;
    }

    .steps {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      flex: 1;
      position: relative;
    }

    .step:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(100% - 24px);
      height: 2px;
      background-color: #ddd;
      transform: translateX(50%);
      z-index: -1;
    }

    .step.active::after {
      background-color: #3f51b5;
    }

    .step-label {
      margin-top: 8px;
    }

    .step-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #ddd;
      color: white;
    }

    .step-circle.active {
      background-color: #3f51b5;
    }

    .progress-bar {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #ddd;
      z-index: -2;
    }

    .progress {
      height: 100%;
      background-color: #3f51b5;
      transition: width 0.3s ease;
    }
  `;

  @property({ type: String })
  orientation = 'horizontal';

  @property({ type: Number })
  currentStep = 0;

  @property({ type: Array })
  steps = ['Step 1', 'Step 2', 'Step 3'];

  override render() {
    return html`
      <div
        class="st-h-wrapper"
        style="display:inline-flex; justify-content: center; "
      >
        <div class="st-component">
          <div class="st-h-progress">
            <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          </div>
          <div class="st-h-content">
            <p>Step 1</p>
            <p class="st-step-title">Title 1</p>
          </div>
        </div>
        <div class="st-component">
          <div class="st-h-progress">
            <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          </div>
          <div class="st-h-content">
            <p>Step 1</p>
            <p class="st-step-title">Title 1</p>
          </div>
        </div>
        <div class="st-component">
          <div class="st-h-progress">
            <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          </div>
          <div class="st-h-content">
            <p>Step 1</p>
            <p class="st-step-title">Title 1</p>
          </div>
        </div>
      </div>

      <br /><br /><br />

      <div class="stepper-wrapper">
        <div class="stepper-item completed">
          <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          <div class="step-name">
            <p>Step 1</p>
            <p class="st-step-title">Title 1</p>
          </div>
        </div>
        <div class="stepper-item">
          <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          <div class="step-name">Second</div>
        </div>
        <div class="stepper-item active">
          <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          <div class="step-name">Third</div>
        </div>
        <div class="stepper-item">
          <kd-icon slot="icon" .icon=${circleFilled} fill=""></kd-icon>
          <div class="step-name">Forth</div>
        </div>
      </div>

      <div class="stepper-wrapper">
        <div class="stepper-item">
          <div class="step-counter">1</div>
          <div class="step-name">First</div>
        </div>
        <div class="stepper-item ">
          <div class="step-counter">2</div>
          <div class="step-name">Second</div>
        </div>
        <div class="stepper-item active">
          <div class="step-counter">3</div>
          <div class="step-name">Third</div>
        </div>
        <div class="stepper-item">
          <div class="step-counter">4</div>
          <div class="step-name">Forth</div>
        </div>
        <div class="stepper-item">
          <div class="step-counter">5</div>
          <div class="step-name">Fifth</div>
        </div>
        <div class="stepper-item">
          <div class="step-counter">6</div>
          <div class="step-name">Sixth</div>
        </div>
      </div>

      <div class="stepper">
        <div class="progress-bar">
          <div
            class="progress"
            style="width: ${this.getProgressWidth()}%;"
          ></div>
        </div>
        <div class="steps">
          ${this.steps.map(
            (step, index) => html`
              <div
                class="step ${this.currentStep >= index ? 'active' : ''}"
                @click="${() => this.handleClick(index)}"
              >
                <div
                  class="step-circle ${this.currentStep >= index
                    ? 'active'
                    : ''}"
                >
                  ${index + 1}
                </div>
                <div class="step-label">${step}</div>
              </div>
            `
          )}
        </div>
      </div>
    `;
    // return html`<div class="stepper-wrapper">
    //   <div class="stepper-item completed">
    //     <div class="step-counter">1</div>
    //     <div class="step-name">First</div>
    //   </div>
    //   <div class="stepper-item completed">
    //     <div class="step-counter">2</div>
    //     <div class="step-name">Second</div>
    //   </div>
    //   <div class="stepper-item active">
    //     <div class="step-counter">3</div>
    //     <div class="step-name">Third</div>
    //   </div>
    //   <div class="stepper-item">
    //     <div class="step-counter">4</div>
    //     <div class="step-name">Forth</div>
    //   </div>
    // </div>`;
    // return html`
    //   <div class="stepper ${this.orientation === 'vertical' ? 'vertical' : ''}">
    //     ${this.steps?.map(
    //       (step, index) => html`
    //         <div
    //           class="step ${this.currentStep === index ? 'active' : ''}"
    //           @click="${() => this.handleClick(index)}"
    //         >
    //           ${step}
    //         </div>
    //       `
    //     )}
    //   </div>
    // `;
  }
  getProgressWidth() {
    const stepFraction = this.currentStep / (this.steps.length - 1);
    const progressWithinStep = this.progress / 100;
    return (stepFraction + progressWithinStep / (this.steps.length - 1)) * 100;
  }

  handleClick(stepIndex: any) {
    this.currentStep = stepIndex;
    this.dispatchEvent(
      new CustomEvent('step-change', {
        detail: { currentStep: this.currentStep },
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stepper-variant': StepperVariant;
  }
}
