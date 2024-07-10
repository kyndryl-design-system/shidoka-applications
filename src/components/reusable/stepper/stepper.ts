import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import checkmarkFilled from '@carbon/icons/es/checkmark--filled/24';
import circleFilled from '@carbon/icons/es/circle--filled/24';
import substractFilled from '@carbon/icons/es/subtract--filled/24';
import errorFilled from '@carbon/icons/es/error--filled/24';
import StepperScss from './stepper.scss';

@customElement('kyn-stepper')
export class Stepper extends LitElement {
  @property({ type: Boolean })
  firstStep = false;

  @property({ type: Boolean })
  lastStep = false;

  static override styles = StepperScss;

  override render() {
    const notificationIconFillColor: any = {
      pending: 'var(--kd-color-border-success, #1FA452)',
      inprogress: 'var(--kd-color-border-accent-spruce-light, #3FADBD)',
      completed: 'var(--kd-color-spruce-50,#2F808C)',
      disabled: 'var(--kd-color-background-secondary, ##3D3C3C)',
      excluded: 'var(--kd-color-background-ui, #898888)',
    };

    return html`
      <div>
        <div style="display: inline-flex; align-items:center;">
          <div
            style="display: flex;width: 174px;flex-direction: column;align-items: center;gap: 8px;"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;gap: 8px;align-self: stretch;"
            >
              <div
                style="width:24px;height:24px;border-radius:24px;display:flex; align-items:;flex-start;"
              >
                <kd-icon slot="icon" .icon=${checkmarkFilled} fill=""></kd-icon>
              </div>
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
            </div>

            <div
              style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;align-self: stretch;"
            >
              <p class="st-step-text">STEP 1</p>
              <p class="st-step-title">Title 1</p>
            </div>
          </div>

          <!-- step 2-->
          <div
            style="display: flex;width: 174px;flex-direction: column;align-items: center;gap: 8px;"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;gap: 8px;align-self: stretch;"
            >
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
              <div
                style="width:24px;height:24px;border-radius:24px;display:flex; align-items:;flex-start;"
              >
                <kd-icon slot="icon" .icon=${checkmarkFilled} fill=""></kd-icon>
              </div>
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
            </div>
            <div
              style="display: flex;flex-direction: column;align-items: center;gap: 4px;align-self: stretch;"
            >
              <p class="st-step-text">STEP 2</p>
              <p class="st-step-title">Title 2</p>
            </div>
          </div>

          <!-- step 3-->
          <div
            style="display: flex;width: 174px;flex-direction: column;align-items: center;gap: 8px;"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;gap: 8px;align-self: stretch;"
            >
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
              <div
                style="width:24px;height:24px;border-radius:24px;display:flex; align-items:;flex-start;"
              >
                <kd-icon slot="icon" .icon=${checkmarkFilled} fill=""></kd-icon>
              </div>
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
            </div>
            <div
              style="display: flex;flex-direction: column;align-items: center;gap: 4px;align-self: stretch;"
            >
              <p class="st-step-text">STEP 3</p>
              <p class="st-step-title">Title 3</p>
            </div>
          </div>

          <!-- step 4-->
          <div
            style="display: flex;width: 174px;flex-direction: column;align-items: center;gap: 8px;"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;gap: 8px;align-self: stretch;"
            >
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
              <div
                style="width:24px;height:24px;border-radius:24px;display:flex; align-items:;flex-start;"
              >
                <kd-icon slot="icon" .icon=${checkmarkFilled} fill=""></kd-icon>
              </div>
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
            </div>
            <div
              style="display: flex;flex-direction: column;align-items: center;gap: 4px;align-self: stretch;"
            >
              <p class="st-step-text">STEP 4</p>
              <p class="st-step-title">Title 4</p>
            </div>
          </div>

          <div
            style="display: flex;width: 174px;flex-direction: column;align-items: center;gap: 8px;"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;gap: 8px;align-self: stretch;"
            >
              <progress
                class=${this.firstStep ? 'progress-hidden' : ''}
                value="0"
                max="100"
              ></progress>
              <div
                style="width:24px;height:24px;border-radius:24px;display:flex; align-items:;flex-start;"
              >
                <kd-icon slot="icon" .icon=${checkmarkFilled} fill=""></kd-icon>
              </div>
            </div>
            <div
              style="display: flex;flex-direction: column;align-items: flex-end;gap: 4px;align-self: stretch;"
            >
              <p class="st-step-text">STEP 5</p>
              <p class="st-step-title">Title 5</p>
            </div>
          </div>
        </div>
      </div>

      <!-- demo with flex -->
      <br />
      <br />
      <br />
      <div class="wrapper">
        <div class="st-parent">
          <div class="st-wrapper">
            <progress
              class=${this.firstStep ? 'progress-hidden' : ''}
              value="0"
              max="100"
            ></progress>
            <div style="width:24px;height:24px;border-radius:24px;">
              <kd-icon slot="icon" .icon=${checkmarkFilled} fill=""></kd-icon>
            </div>
            <progress value="57" max="100"></progress>
          </div>

          <div class="st-txt-container">
            <p class="st-step-text">STEP 1</p>
            <p class="st-step-title">Title 1</p>
          </div>
        </div>

        <div class="st-parent">
          <div class="st-wrapper">
            <progress value="0" max="100"></progress>
            <div style="width:24px;height:24px;border-radius:24px;">
              <kd-icon slot="icon" .icon=${circleFilled}></kd-icon>
            </div>
            <progress value="57" max="100"></progress>
          </div>
          <div class="st-txt-container">
            <p class="st-step-text">STEP 2</p>
            <p class="st-step-title">Title 2</p>
          </div>
        </div>

        <div class="st-parent">
          <div class="st-wrapper">
            <progress value="0" max="100"></progress>
            <div style="width:24px;height:24px;border-radius:24px;">
              <kd-icon slot="icon" .icon=${substractFilled}></kd-icon>
            </div>
            <progress value="57" max="100"></progress>
          </div>
          <div class="st-txt-container">
            <p class="st-step-text">STEP 3</p>
            <p class="st-step-title">Title 3</p>
          </div>
        </div>

        <div class="st-parent">
          <div class="st-wrapper">
            <progress value="0" max="100"></progress>
            <div style="width:24px;height:24px;border-radius:24px;">
              <kd-icon slot="icon" .icon=${errorFilled}></kd-icon>
            </div>
            <progress value="57" max="100"></progress>
          </div>
          <div class="st-txt-container">
            <p class="st-step-text">STEP 4</p>
            <p class="st-step-title">Title 4</p>
          </div>
        </div>

        <div class="st-parent">
          <div class="st-wrapper">
            <progress value="0" max="100"></progress>
            <div
              style="min-width:24px;height:24px;border-radius:24px;border: 2px dashed #8ECFD9;"
            ></div>
            <progress value="57" max="100"></progress>
          </div>
          <div class="st-txt-container">
            <p class="st-step-text">STEP 5</p>
            <p class="st-step-title">Title 5</p>
          </div>
        </div>

        <div class="st-parent">
          <div class="st-wrapper">
            <progress value="0" max="100"></progress>
            <div style="width:24px;height:24px;border-radius:24px;">
              <kd-icon .icon=${checkmarkFilled}></kd-icon>
            </div>
            <progress value="57" max="100"></progress>
          </div>
          <div class="st-txt-container">
            <p class="st-step-text">STEP 6</p>
            <p class="st-step-title">Title 6</p>
          </div>
        </div>
      </div>

      <!-- <div>
        <div class="">
          <div class="">
            <progress value="0" max="100"></progress>
            <div style="width:24px;height:24px;border-radius:24px;">
              <kd-icon .icon=${checkmarkFilled}></kd-icon>
            </div>
            <progress value="57" max="100"></progress>
          </div>
          <div class="">
            <p class="">STEP 6</p>
            <p class="">Title 6</p>
          </div>
        </div>
      </div> -->
    `;
  }

  _getStatusText(status: String) {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper': Stepper;
  }
}
