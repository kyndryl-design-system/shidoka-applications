import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('stepper-component')
export class StepperComponent extends LitElement {
  static override styles = css`
    .stepper {
      display: flex;
      flex-direction: var(--stepper-direction, row);
      align-items: flex-start;
      gap: 1rem;
    }
    .step {
      text-align: center;
      position: relative;
      flex: 1;
      padding: 10px;
    }
    .step.vertical {
      width: 100%;
    }
    .progress-bar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      height: 4px;
      background-color: #e0e0e0;
      width: 100%;
      z-index: -1;
    }
    .progress-bar.completed {
      background-color: #4caf50;
    }
    .progress-bar.in-progress {
      background-color: #2196f3;
    }
    .circle-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
    }
    .circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 2px solid #e0e0e0;
      color: #e0e0e0;
      z-index: 1;
    }
    .circle.completed {
      background-color: #4caf50;
      border-color: #4caf50;
      color: white;
    }
    .circle.in-progress {
      border-color: #2196f3;
      color: #2196f3;
    }
    .circle.pending {
      border-color: #e0e0e0;
      color: #e0e0e0;
    }
    .circle.disabled {
      border-color: #e0e0e0;
      background-color: #e0e0e0;
      color: white;
    }
    .title {
      font-weight: bold;
    }
    .description {
      color: #888;
    }
    .status {
      color: gray;
    }
    .status.completed {
      color: #4caf50;
    }
    .status.in-progress {
      color: #2196f3;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
  `;

  @property({ type: Array }) steps = [
    { title: 'Step 1', description: 'Description 1', status: 'completed' },
    { title: 'Step 2', description: 'Description 2', status: 'completed' },
    { title: 'Step 3', description: 'Description 3', status: 'in-progress' },
    { title: 'Step 4', description: 'Description 4', status: 'pending' },
    { title: 'Step 5', description: 'Description 5', status: 'pending' },
    { title: 'Step 6', description: 'Description 6', status: 'disabled' },
    { title: 'Step 7', description: 'Description 7', status: 'pending' },
  ];
  @property({ type: Boolean }) vertical = false;
  @state() currentStep = 0;

  override render() {
    return html`
      <div
        class="stepper"
        style="--stepper-direction: ${this.vertical ? 'column' : 'row'};"
      >
        ${this.steps.map(
          (step, index) => html`
            <div class="step ${this.vertical ? 'vertical' : ''} ${step.status}">
              ${index !== this.steps.length - 1
                ? html`<div class="progress-bar ${step.status}"></div>`
                : ''}
              <div class="circle-container">
                <div class="circle ${step.status}">
                  ${step.status === 'completed' ? html`&#x2714;` : index + 1}
                </div>
              </div>
              <div class="title">${step.title}</div>
              <div class="description">${step.description}</div>
              <div class="status ${step.status}">
                ${this._getStatusText(step.status)}
              </div>
            </div>
          `
        )}
      </div>
      <div class="buttons">
        <button ?disabled=${this.currentStep === 0} @click=${this._prevStep}>
          Back
        </button>
        <button ?disabled=${this._isLastStep()} @click=${this._nextStep}>
          Next
        </button>
        ${this._isLastStep()
          ? html`<button @click=${this._submit}>Submit</button>`
          : ''}
      </div>
    `;
  }

  _getStatusText(status: String) {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'disabled':
        return 'Disabled';
      default:
        return 'Pending';
    }
  }

  _prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this._updateStepStatus();
    }
  }

  _nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this._updateStepStatus();
    }
  }

  _isLastStep() {
    return this.currentStep === this.steps.length - 1;
  }

  _submit() {
    alert('Form submitted');
  }

  _updateStepStatus() {
    this.steps = this.steps.map((step, index) => {
      if (index < this.currentStep) {
        step.status = 'completed';
      } else if (index === this.currentStep) {
        step.status = 'in-progress';
      } else if (step.status !== 'disabled') {
        step.status = 'pending';
      }
      return step;
    });
  }
}

export default StepperComponent;
