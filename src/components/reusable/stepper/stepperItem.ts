import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import stepperItemStyles from './stepperItem.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/link';

import checkmarkFilled from '@carbon/icons/es/checkmark--filled/24';
import checkmarkFilled16 from '@carbon/icons/es/checkmark--filled/16';

import circleFilled from '@carbon/icons/es/circle--filled/24';
import circleFilled16 from '@carbon/icons/es/circle--filled/16';

import substractFilled from '@carbon/icons/es/subtract--filled/24';
import substractFilled16 from '@carbon/icons/es/subtract--filled/16';
import errorFilled from '@carbon/icons/es/error--filled/24';
import errorFilled16 from '@carbon/icons/es/error--filled/16';

/** Stepper Item.
 * @fires on-step-click - Emits the step details to the parent stepper component when click on step title.
 */

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

  /** Step state. Default `'pending'`. `'pending'`, `'active'`, `'completed'`, `'excluded'` & `'error'`. */
  @property({ type: String })
  stepState = 'pending';

  /** Stepper type. Inherited from <kyn-stepper>.
   * @ignore
   */
  @state()
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

  /** Internal state for step index.
   * @ignore
   */
  @state()
  stepIndex = 0;

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
      error: this.stepSize === 'large' ? substractFilled : substractFilled16,
    };
    const iconFillColor: any = {
      active: 'var(--kd-color-border-accent-spruce-light, #3FADBD)',
      completed: 'var(--kd-color-spruce-50,#2F808C)',
      excluded: 'var(--kd-color-background-secondary, ##3D3C3C)',
      disabled: 'var(--kd-color-background-ui, #898888)',
      error: 'var(--kd-color-background-destructive, #CC1800)',
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

    const horizontalStepTextClass = {
      'step-text': true,
      'step-text-disabled': this.disabled,
      'step-text-error': this.stepState === 'error',
    };

    const verticalStepContainerClasses = {
      'vertical-stepper-container': true,
      [`vertical-stepper-container-${this.stepSize}`]: true,
    };

    const verticalIconClasses = {
      'vertical-icon-wrapper': true,
      [`vertical-icon-wrapper-${this.stepSize}`]: true,
      'vertical-icon-wrapper-pending': this.stepState === 'pending',
    };

    const verticalStepperLineClasses = {
      'vertical-stepper-line': true,
      [`vertical-stepper-line-${this.stepSize}`]: true,
    };

    const verticalStepNameClasses = {
      'vertical-step-text': true,
      'vertical-step-text-error': this.stepState === 'error',
      'vertical-step-text-large': this.stepSize === 'large',
      'vertical-step-text-disabled': this.disabled,
    };

    console.log(this.stepSize);
    return html`
      <!-- -------------------------|| Vertical stepper || ----------------------------------->

      ${this.vertical
        ? html`<div class="${classMap(verticalStepContainerClasses)}">
            ${this.isLastStep
              ? null
              : html`<div class="${classMap(verticalStepperLineClasses)}">
                  <div
                    class="${this.progress === 100
                      ? 'vertical-progress-line-completed'
                      : ''} vertical-progress-line"
                    style="height:${this.progress}%;"
                  ></div>
                </div>`}

            <div class="${classMap(verticalIconClasses)}">
              ${this.stepState !== 'pending'
                ? html`<kd-icon
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

            <div class="vertical-item-content">
              <p class="${classMap(verticalStepNameClasses)}">
                ${this.stepName}
              </p>

              ${this.stepTitle === ''
                ? null
                : this.stepperType === 'procedure'
                ? html`<kd-link
                    standalone
                    href=""
                    target="_self"
                    kind="primary"
                    ?disabled=${this.disabled}
                    @on-click=${(e: any) => this._handleStepClick(e)}
                    >${this.stepTitle}</kd-link
                  >`
                : this.stepperType === 'status'
                ? html`<p class="step-title-text">${this.stepTitle}</p>`
                : null}
            </div>
          </div>`
        : html` <!-- -------------------------|| horizontal stepper || ----------------------------------->
            <div class="${classMap(stepContainerClasses)}">
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

              <!----------------[ Stepper progress bar ]--------------->
              ${this.isLastStep
                ? null
                : html`<div
                    class="${classMap(stepperProgressClass)}"
                    role="progressbar"
                    aria-valuenow="${this.progress}"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Step progress: ${this.progress}%"
                  >
                    <div
                      class="${this.progress === 100
                        ? 'progressbar-completed'
                        : ''} progressbar"
                      style="width:${this.progress}%;"
                    ></div>
                  </div>`}

              <!-----------------[ Stepper content ]--------------------->
              <div class="${classMap(stepContentClasses)}">
                <p class="${classMap(horizontalStepTextClass)}">
                  ${this.stepName}
                </p>

                ${this.stepTitle === ''
                  ? null
                  : this.stepperType === 'procedure'
                  ? html`<kd-link
                      standalone
                      href=""
                      target="_self"
                      kind="primary"
                      ?disabled=${this.disabled}
                      @on-click=${(e: any) => this._handleStepClick(e)}
                      >${this.stepTitle}</kd-link
                    >`
                  : this.stepperType === 'status'
                  ? html`<p class="step-title-text">${this.stepTitle}</p>`
                  : null}
              </div>
            </div>`}
    `;
  }

  private _handleStepClick(e: Event) {
    // prevent click if disabled
    if (this.disabled) {
      return;
    }
    // emit selected value, bubble so it can be captured by the parent element
    const event = new CustomEvent('on-step-click', {
      bubbles: true,
      composed: true,
      detail: {
        step: this,
        stepIndex: this.stepIndex,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('stepState') && !this.vertical) {
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

    if (this.vertical) {
      if (this.stepState === 'active') {
        this.progress = 20;
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
