import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import stepperItemStyles from './stepperItem.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/link';

import checkmarkFilled from '@carbon/icons/es/checkmark--filled/24';
import checkmarkFilled16 from '@carbon/icons/es/checkmark--filled/16';

import circleFilled from '@carbon/icons/es/circle--filled/24';
import circleFilled16 from '@carbon/icons/es/circle--filled/16';

import substractFilled from '@carbon/icons/es/subtract--filled/24';
import substractFilled16 from '@carbon/icons/es/subtract--filled/16';
import errorFilled from '@carbon/icons/es/error--filled/24';
import errorFilled16 from '@carbon/icons/es/error--filled/16';

@customElement('kyn-stepper-item')
export class StepperItem extends LitElement {
  static override styles = stepperItemStyles;

  /** Wheter the stepper is in vertical type. */
  @property({ type: Boolean })
  vertical = false;

  /** Stepper size `'large'` & `'small'`. Bydefault `'large'`. Use small size only for status stepper.  */
  @property({ type: String })
  stepSize = 'large';

  /** Step name. */
  @property({ type: String })
  stepName = '';

  /** Step title. Optional */
  @property({ type: String })
  stepTitle = '';

  /** Step state. Default `'pending'`. `'pending'`, `'active'`, `'completed'` & `'excluded'`. */
  @property({ type: String })
  stepState = 'pending';

  /** Stepper type. Inherited from <kyn-stepper>.*/
  @property({ type: String })
  stepperType = 'procedure';

  /** Disable step. */
  @property({ type: Boolean })
  disabled = false;

  /** Progress of stepper.
   * @ignore
   */
  @state()
  progress = 0;
  /** Internal state to indicate whether it's 1st step.
   * @ignore
   */
  @state()
  isFirstStep = false;

  /** Internal state to indicate whether it's last step.
   * @ignore
   */
  @state()
  isLastStep = false;

  /** Internal state to indicate whether it's second-last step.
   * @ignore
   */
  @state()
  isSecondLastStep = false;

  /** Internal state to indicate whether only two steps are there inside `<kyn-wrapper>`.
   * @ignore
   */
  @state()
  isTwoStepStepper = false;

  override render() {
    const iconMapper: any = {
      active: this.stepSize === 'large' ? circleFilled : circleFilled16,
      excluded: this.stepSize === 'large' ? substractFilled : substractFilled16,
      disabled: this.stepSize === 'large' ? errorFilled : errorFilled16,
      completed:
        this.stepSize === 'large' ? checkmarkFilled : checkmarkFilled16,
    };
    const iconFillColor: any = {
      active: 'var(--kd-color-border-accent-spruce-light, #3FADBD)',
      completed: 'var(--kd-color-spruce-50,#2F808C)',
      excluded: 'var(--kd-color-background-secondary, ##3D3C3C)',
      disabled: 'var(--kd-color-background-ui, #898888)',
    };
    // map first step and last step class to parent div
    const stepContainerClasses = {
      'stepper-step': true,
      'stepper-step-first': this.isFirstStep,
      'stepper-step-last': this.isLastStep,
    };
    // map first step and last step class to content div
    const stepContentClasses = {
      'step-content': true,
      'step-content-first': this.isFirstStep,
      'step-content-last': this.isLastStep,
    };

    const stepperProgressClass = {
      'stepper-progress': true,
      [`stepper-progress-${this.stepSize}`]: true,
      'stepper-progress-first': this.isFirstStep,
      'stepper-progress-secondlast':
        this.isSecondLastStep || this.isTwoStepStepper,
    };

    const stepperIconClasses = {
      'stepper-icon': true,
      'stepper-icon-pending': this.stepState === 'pending',
      [`stepper-icon-${this.stepSize}`]: true,
    };

    console.log(this.stepSize);
    return html`
      ${this.vertical
        ? html`<div>Vertical ${this.stepSize}</div>`
        : html`<div class="${classMap(stepContainerClasses)}">
            <div class="${classMap(stepperIconClasses)}">
              <!-- Stepper icon -->
              ${this.stepState !== 'pending'
                ? html` <kd-icon
                    slot="icon"
                    .icon=${this.disabled
                      ? iconMapper.disabled
                      : iconMapper[this.stepState]}
                    fill=${this.disabled
                      ? iconFillColor.disabled
                      : iconFillColor[this.stepState]}
                  ></kd-icon>`
                : null}
            </div>

            <!-- Stepper progress bar -->
            ${this.isLastStep
              ? null
              : html`<div
                  class="${classMap(stepperProgressClass)}"
                  role="progressbar"
                  aria-valuenow="${this.progress}"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="${this.progress === 100
                      ? 'progressbar-completed'
                      : ''} progressbar"
                    style="width:${this.progress}%;"
                  ></div>
                </div>`}

            <!-- Stepper content -->
            <div class="${classMap(stepContentClasses)}">
              <p class="${this.disabled ? 'step-text-disabled' : ''} step-text">
                ${this.stepName}
              </p>
              <!-- <p class="step-title">Title 1</p> -->
              ${this.stepTitle === ''
                ? null
                : html`<kd-link
                    standalone
                    href=""
                    target="_self"
                    kind="primary"
                    ?disabled=${this.disabled}
                    @on-click=${(e: any) => console.log(e)}
                    >${this.stepTitle}</kd-link
                  >`}
            </div>
          </div>`}
    `;
  }
  override updated(changedProps: any) {
    if (changedProps.has('stepState')) {
      if (this.stepState === 'active') {
        // show random progress
        this.progress = 50;
      }
      if (this.stepState === 'pending') {
        this.progress = 0;
      }
      if (this.stepState === 'completed') {
        this.progress = 100;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper-item': StepperItem;
  }
}
