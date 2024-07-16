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

  /** Whether step is disabled */
  @property({ type: Boolean })
  disabled = false;

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

  @property({ type: String })
  stepName = '';

  @property({ type: String })
  stepTitle = '';

  /** Stepper size `'large'` & `'small'`. Bydefault `'large'`. Use small size only for status stepper.  */
  @property({ type: String })
  size = 'large';

  /** Step state. Default `'pending'`. `'pending'`, `'active'`, `'completed'`, `'excluded'`. */
  @property({ type: String })
  stepState = 'active';

  override render() {
    // change icon based on states (active, completed, disable, err etc.)
    console.log(this.size);

    const iconMapper = {
      active: this.size === 'large' ? circleFilled : circleFilled16,
      excluded: this.size === 'large' ? errorFilled : errorFilled16,
      disabled: this.size === 'large' ? substractFilled : substractFilled16,
      completed: this.size === 'large' ? checkmarkFilled : checkmarkFilled16,
    };

    const iconFillColor: any = {
      active: 'var(--kd-color-border-accent-spruce-light, #3FADBD)',
      completed: 'var(--kd-color-spruce-50,#2F808C)',
      excluded: 'var(--kd-color-background-secondary, ##3D3C3C)',
      disabled: 'var(--kd-color-background-ui, #898888)',
    };

    return html`
      ${this.vertical
        ? this.renderVerticalStepper(iconMapper, iconFillColor)
        : this.renderHorizontalStepper(iconMapper, iconFillColor)}
    `;
  }

  // ---------------------------------- HORIZONTAL STEPPER UI ------------------------------------ //
  private renderHorizontalStepper(iconMapper: any, iconFillColor: any) {
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

    return html` <div class="${classMap(stepContainerClasses)}">
      <div
        class="${this.stepState === 'pending'
          ? 'stepper-icon-pending'
          : ''} stepper-icon"
      >
        ${this.stepState !== 'pending'
          ? html` <kd-icon
              slot="icon"
              .icon=${iconMapper[this.stepState]}
              fill=${this.disabled
                ? iconFillColor.disabled
                : iconFillColor[this.stepState]}
            ></kd-icon>`
          : null}
      </div>
      ${this.isLastStep
        ? null
        : html`<div
            class="progress--root stepper-progress"
            role="progressbar"
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="progressbar customstep-bar"></div>
          </div>`}

      <div class="${classMap(stepContentClasses)}">
        <p class="step-text">${this.stepName}</p>
        <!-- <p class="step-title">Title 1</p> -->
        <kd-link
          standalone
          href=""
          target="_self"
          kind="primary"
          ?disabled=${this.disabled}
          @on-click=${(e: any) => console.log(e)}
          >${this.stepTitle}</kd-link
        >
      </div>
    </div>`;
  }

  // ---------------------------------- VERTICAL STEPPER UI ------------------------------------ //
  private renderVerticalStepper(iconMapper: any, iconFillColor: any) {
    return html`
      <div class="vertical-stepper-container">
        ${this.isLastStep
          ? null
          : html` <div class="vertical-stepper-line">
              <div class="vertical-progress-line"></div>
            </div>`}

        <div
          class="${this.stepState === 'pending'
            ? 'vertical-icon-wrapper-pending'
            : ''} vertical-icon-wrapper"
        >
          ${this.stepState !== 'pending'
            ? html`<kd-icon
                slot="icon"
                .icon=${checkmarkFilled}
                fill=${this.disabled
                  ? iconFillColor.disabled
                  : iconFillColor[this.stepState]}
              ></kd-icon>`
            : null}
        </div>
        <div class="vertical-item-content">
          <p class="vertical-step-text">${this.stepName}</p>
          <kd-link
            standalone
            href=""
            target="_self"
            kind="primary"
            ?disabled=${this.disabled}
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
