import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import { action } from '@storybook/addon-actions';

import '../index';

@customElement('story-stepper')
class MyStoryStepper extends LitElement {
  static override styles = css`
    .button-div {
      margin-top: 50px;
      display: flex;
      gap: 8px;
    }
  `;
  @query('kyn-stepper') stepper: any;

  @property({ type: String })
  stepperType = 'procedure';

  @property({ type: Boolean })
  vertical = false;

  @property({ type: String })
  stepperSize = 'large';

  @property({ type: Number })
  currentIndex = 0;

  steps = [
    {
      stepName: 'Step 1',
      stepTitle: 'Step Title',
      disabled: false,
    },
    {
      stepName: 'Step 2',
      stepTitle: 'Step Title',
      disabled: false,
    },
    {
      stepName: 'Step 3',
      stepTitle: 'Step Title',
      disabled: false,
    },
    {
      stepName: 'Step 4',
      stepTitle: 'Step Title',
      disabled: false,
    },
    {
      stepName: 'Step 5',
      stepTitle: 'Step Title',
      disabled: false,
    },
  ];

  statusSteps = [
    {
      stepName: 'Processing Request',
      stepTitle: 'Monday June 26, 2023 2:05:25 PM',
      disabled: false,
    },
    {
      stepName: 'Processing Request',
      stepTitle: 'Monday June 26, 2023 3:05:25 PM',
      disabled: false,
    },
    {
      stepName: 'Draft',
      stepTitle: 'Monday June 26, 2023 4:05:25 PM',
      disabled: false,
    },
    {
      stepName: 'Request Received',
      stepTitle: 'Monday June 26, 2023 6:05:25 PM',
      disabled: false,
    },
    {
      stepName: 'Generating Contract',
      stepTitle: 'Tuesday June 26, 2023 6:05:25 PM',
      disabled: false,
    },
    {
      stepName: 'Contract Ready for Review',
      stepTitle: 'Tuesday June 26, 2023 7:05:25 PM',
      disabled: false,
    },
  ];

  override render() {
    // Example of how to pass stepState prop. to <kyn-stepper-item>
    const returnStepState = (
      currentIndex: Number,
      index: Number,
      disabled: Boolean
    ) => {
      if (!disabled) {
        return currentIndex > index
          ? 'completed'
          : currentIndex === index
          ? 'active'
          : 'pending';
      }
      return '';
    };

    const stepArr =
      this.stepperType === 'procedure' ? this.steps : this.statusSteps;

    return html`
      <kyn-stepper
        stepperType=${this.stepperType}
        stepperSize=${this.stepperSize}
        currentIndex=${this.currentIndex}
        ?vertical=${this.vertical}
        @on-step-change=${(e: any) => action(e.type)(e)}
        @on-click=${(e: any) => action(e.type)(e)}
      >
        ${stepArr.map(
          (step, index) => html`
            <kyn-stepper-item
              stepName=${step.stepName}
              stepTitle=${step.stepTitle}
              stepState=${returnStepState(
                this.currentIndex,
                index,
                step.disabled
              )}
              ?disabled=${step.disabled}
            ></kyn-stepper-item>
          `
        )}
      </kyn-stepper>

      <div class="button-div">
        <kd-button
          kind="primary-app"
          type="button"
          size="small"
          ?disabled=${this.currentIndex >= this.steps.length}
          @on-click=${() => this.handleNext()}
          >Next</kd-button
        >
        <kd-button
          kind="secondary"
          type="button"
          size="small"
          ?disabled=${this.currentIndex < 0}
          @on-click=${() => this.handlePrev()}
          >Back</kd-button
        >
      </div>
    `;
  }

  handleNext() {
    if (this.currentIndex >= this.steps.length) return;
    this.stepper.next();
    this.currentIndex += 1;
  }

  handlePrev() {
    if (this.currentIndex < 0) return;
    this.stepper.prev();
    this.currentIndex -= 1;
  }

  //   gotoStep(n: Number) {
  //     this.stepper.gotoStep(n);
  //   }
}

declare global {
  interface HTMLElementTagNameMap {
    'story-stepper': MyStoryStepper;
  }
}
