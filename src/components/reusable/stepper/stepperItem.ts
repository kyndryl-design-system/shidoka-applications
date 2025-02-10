import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-down.svg';

import stepperItemStyles from './stepperItem.scss';
import '../link';

import checkmarkFilled from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/checkmark-filled.svg';
import checkmarkFilled16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';

import circleSelected from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/circle-selected.svg';
import circleSelected16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/circle-selected.svg';

import substractFilled from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/substract-filled.svg';
import substractFilled16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/substract-filled.svg';

import errorFilled from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/error-filled.svg';
import errorFilled16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

import warningFilled from '@kyndryl-design-system/shidoka-icons/svg/monochrome/24/warning-filled.svg';
import warningFilled16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/warning-filled.svg';

import './stepperItemChild';

/** Stepper Item.
 * @fires on-step-click - Emits the step details to the parent stepper component when click on step title.
 * @slot tooltip - Slot for tooltip.
 * @slot child - Children slot. Used for nested children in vertical stepper. Visible only when step state is active. Do not use inside stepperType `'status'`.
 * @slot unnamed - Optional slot for content in vertical stepper. Visible only when step state is active.
 */

@customElement('kyn-stepper-item')
export class StepperItem extends LitElement {
  static override styles = stepperItemStyles;

  /** Whether the stepper is in vertical type. */
  @property({ type: Boolean })
  vertical = false;

  /** Stepper size `'large'` & `'small'`. */
  @property({ type: String })
  stepSize = 'large';

  /** Step name. */
  @property({ type: String })
  stepName = '';

  /** Step title.*/
  @property({ type: String })
  stepTitle = '';

  /** Step link. */
  @property({ type: String })
  stepLink = '';

  /** Step state. `'pending'`, `'active'`, `'completed'`, `'excluded'`, `'warning'` & `'destructive'`.
   *
   * `'pending'`, `'active'` and `'completed'` / `'excluded'` states has 0%, 50% & 100% progress set internally.
   */
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

  /** Optional. Show counter for vertical stepper when stepState is `'pending'`. */
  @property({ type: Boolean })
  showCounter = false;

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

  /** Open children toggle
   * @ignore
   */
  @state()
  openChildren = false;

  /**
   * Queries any slotted step child items.
   * @ignore
   */
  @queryAssignedElements({ slot: 'child', selector: 'kyn-stepper-item-child' })
  childSteps!: Array<any>;

  override render() {
    const iconMapper: any = {
      active: this.stepSize === 'large' ? circleSelected : circleSelected16,
      excluded: this.stepSize === 'large' ? substractFilled : substractFilled16,
      disabled: this.stepSize === 'large' ? substractFilled : substractFilled16,
      completed:
        this.stepSize === 'large' ? checkmarkFilled : checkmarkFilled16,
      destructive: this.stepSize === 'large' ? errorFilled : errorFilled16,
      warning: this.stepSize === 'large' ? warningFilled : warningFilled16,
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
      'stepper-icon-pending': this.stepState === 'pending' && !this.disabled,
      [`stepper-icon-${this.stepSize}`]: true,
    };

    const horizontalStepTextClass = {
      'step-text': true,
      'step-text-disabled': this.disabled,
      'step-text-error': this.stepState === 'destructive',
    };

    const verticalStepContainerClasses = {
      'vertical-stepper-container': true,
      [`vertical-stepper-container-${this.stepSize}`]: true,
    };

    const verticalIconClasses = {
      'vertical-icon-wrapper': true,
      [`vertical-icon-wrapper-${this.stepSize}`]: true,
      'vertical-icon-wrapper-pending':
        this.stepState === 'pending' && !this.disabled,
    };

    const verticalStepperLineClasses = {
      'vertical-stepper-line': true,
      [`vertical-stepper-line-${this.stepSize}`]: true,
    };

    const verticalStepNameClasses = {
      'vertical-step-text': true,
      'vertical-step-text-error': this.stepState === 'destructive',
      'vertical-step-text-large': this.stepSize === 'large',
      'vertical-step-text-disabled': this.disabled,
    };
    // -------------------------||>> Horizontal stepper <<|| --------------------------------- //
    const renderHorizontalUI = () => {
      return html`
        <div
          class="${classMap(stepContainerClasses)}"
          aria-disabled=${this.disabled}
        >
          <div class="${classMap(stepperIconClasses)}">
            <!-- Step icon -->
            ${this.stepState !== 'pending'
              ? html` <span
                  slot="icon"
                  class=${this.disabled ? 'disabled' : this.stepState}
                  >${this.disabled
                    ? unsafeSVG(iconMapper.disabled)
                    : unsafeSVG(iconMapper[this.stepState])}</span
                >`
              : this.stepState === 'pending' && this.disabled
              ? html`
                  <span slot="icon" class="disabled"
                    >${unsafeSVG(iconMapper.disabled)}</span
                  >
                `
              : null}
          </div>

          <!-- Step progress bar  -->
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

          <div class="${classMap(stepContentClasses)}">
            <!--- Step name ---->
            <p class="${classMap(horizontalStepTextClass)}">${this.stepName}</p>
            <!-- Step Title -->
            <div class="step-title-wrapper">
              ${this.stepperType === 'procedure' && this.stepLink !== ''
                ? html`
                    <kyn-link
                      href=${this.stepLink}
                      kind="primary"
                      ?disabled=${this.disabled}
                      @on-click=${(e: Event) => this._handleStepClick(e)}
                    >
                      ${this.stepTitle}
                    </kyn-link>
                  `
                : html`
                    <p class="step-title-text type--${this.stepperType}">
                      ${this.stepTitle}
                    </p>
                  `}

              <!-- Tooltip slot --->
              <slot name="tooltip"></slot>
            </div>
          </div>
        </div>
      `;
    };

    // -------------------------||>> Vertical stepper <<|| -----------------------------------> //
    const renderVerticalUI = () => {
      return html`
        <div
          class="${classMap(verticalStepContainerClasses)}"
          aria-disabled=${this.disabled}
        >
          <!-- Step progress -->
          ${this.isLastStep
            ? null
            : html`<div
                class="${classMap(verticalStepperLineClasses)}"
                role="progressbar"
                aria-valuenow="${this.progress}"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Step progress: ${this.progress}%"
              >
                <div
                  class="${this.progress === 100
                    ? 'vertical-progress-line-completed'
                    : ''} vertical-progress-line"
                  style="height:${this.progress}%;"
                ></div>
              </div>`}
          <!-- Step icons -->
          <div class="${classMap(verticalIconClasses)}">
            ${this.stepState !== 'pending'
              ? html` <span
                  slot="icon"
                  class=${this.disabled ? 'disabled' : this.stepState}
                  >${this.disabled
                    ? unsafeSVG(iconMapper.disabled)
                    : unsafeSVG(iconMapper[this.stepState])}</span
                >`
              : this.stepState === 'pending' && this.disabled
              ? html`
                  <span slot="icon" class="disabled"
                    >${unsafeSVG(iconMapper.disabled)}</span
                  >
                `
              : this.showCounter
              ? html`<p class="counter-txt ${this.stepSize}">
                  ${this.stepIndex + 1}
                </p>`
              : null}
          </div>
          <!-- Step name -->
          <div class="vertical-item-content">
            <p class="${classMap(verticalStepNameClasses)}">${this.stepName}</p>
            <!-- Step title -->
            <div class="vertical-title-wrapper">
              ${this.stepperType === 'procedure' && this.stepLink !== ''
                ? html`
                    <kyn-link
                      href=${this.stepLink}
                      kind="primary"
                      ?disabled=${this.disabled}
                      @on-click=${(e: Event) => this._handleStepClick(e)}
                    >
                      ${this.stepTitle}
                    </kyn-link>
                  `
                : html`
                    <p class="step-title-text type--${this.stepperType}">
                      ${this.stepTitle}
                    </p>
                  `}
              <!-- Tooltip slot --->
              <slot name="tooltip"></slot>

              <!-- Toggle children stuff -->
              ${this.childSteps?.length > 0 && this.stepperType === 'procedure'
                ? html`
                    <button
                      class="toggle-icon-button"
                      aria-label="Toggle children"
                      type="button"
                      @click=${() => this._handleChildToggle()}
                      ?disabled=${this.disabled}
                    >
                      <span
                        slot="icon"
                        class=${classMap({
                          'arrow-icon': true,
                          open: this.openChildren,
                          disabled: this.disabled,
                          'not-disabled': !this.disabled,
                        })}
                        >${unsafeSVG(downIcon)}</span
                      >
                    </button>
                  `
                : null}
            </div>

            <slot></slot>
          </div>
        </div>

        <div
          class=${classMap({
            children: true,
            open: this.openChildren,
          })}
        >
          <slot name="child" @slotchange=${this._handleChildSlotChange}></slot>
        </div>
      `;
    };

    return html` ${this.vertical ? renderVerticalUI() : renderHorizontalUI()} `;
  }

  private _handleChildToggle() {
    this.openChildren = !this.openChildren;
  }

  private _handleStepClick(e: any) {
    if (this.disabled) return;
    // emit selected value step
    const event = new CustomEvent('on-step-click', {
      bubbles: true,
      composed: true,
      detail: {
        step: this,
        href: this.stepLink,
        stepIndex: this.stepIndex,
        origEvent: e.detail.origEvent,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('stepState')) {
      this.progress = this.getProgressValue();
    }

    if (
      changedProps.has('stepState') ||
      changedProps.has('stepSize') ||
      changedProps.has('disabled')
    ) {
      this._updateChildren();
    }
  }

  private _handleChildSlotChange() {
    if (
      this.vertical &&
      this.stepState === 'active' &&
      this.childSteps?.length > 0
    ) {
      this.openChildren = true; // default open toggle when state is active
    }

    this._updateChildren();
    this.requestUpdate();
  }

  private _updateChildren() {
    this.childSteps?.forEach((child, index) => {
      // First child is active by default when step is active
      if (index === 0 && child.childState !== 'completed') {
        child.childState = 'active';
      }

      // update children props / states
      child.childSize = this.stepSize;
      child.childIndex = index;
      child.disabled = this.disabled;
    });
  }

  private getProgressValue(): number {
    switch (this.stepState) {
      case 'active':
        return this.vertical ? (this.childSteps?.length > 0 ? 100 : 50) : 50;
      case 'completed':
      case 'excluded':
        return 100;
      case 'pending':
      default:
        return 0;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper-item': StepperItem;
  }
}
