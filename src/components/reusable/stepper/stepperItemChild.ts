import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '@kyndryl-design-system/shidoka-foundation/components/link';
import StepChildCss from './stepperItemChild.scss';

/**
 * Stepper Item child.
 * @slot unnamed - Slot for other elements.
 * @fires on-child-click - Emits event on child click.
 */
@customElement('kyn-stepper-item-child')
export class StepperItemChild extends LitElement {
  static override styles = StepChildCss;

  /** Child title. Required for nested child inside step. */
  @property({ type: String })
  childTitle = '';

  /** Child title. Required for nested child inside step. */
  @property({ type: String })
  childSubTitle = '';

  /** Child disabled or not Internal state inherit from `<kyn-step-item>`.
   * @ignore
   */
  @state()
  disabled = false;

  /** Child state. `'pending', `'active'` & `'completed'`.  */
  @property({ type: String })
  childState = 'pending';

  /** Child size. Inherit from `<kyn-step-item>`.
   * @ignore
   */
  @state()
  childSize = 'large';

  /** Child progress calculate Internal progress.
   * @ignore
   */
  @state()
  progress = 0;

  /** child index
   * @ignore
   */
  @state()
  childIndex = 0;

  override render() {
    const childIconClasses = {
      'child-step-icon': true,
      [`child-step-icon-${this.childState}`]: this.childState !== 'pending',
    };

    return html`
      <div class=" child-wrapper child-wrapper-${this.childSize}">
        <div class="child-step-line-${this.childSize} child-step-line">
          <div
            class="child-step-progress-line"
            style="height:${this.progress}%;"
          ></div>
        </div>
        <div
          class="child-step-icon-wrapper child-step-icon-wrapper-${this
            .childSize}"
        >
          <div class="${classMap(childIconClasses)}"></div>
        </div>
        <div class="child-step-content">
          <kd-link
            standalone
            kind="primary"
            ?disabled=${this.disabled}
            @on-click=${(e: any) => this._handleChildStepClick(e)}
            >${this.childTitle}</kd-link
          >
          ${this.childSubTitle !== ''
            ? html` <p class="child-step-subtitle">${this.childSubTitle}</p>`
            : null}
          <div>
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _handleChildStepClick(e: Event) {
    if (this.disabled) {
      return;
    }
    // Prevent the event from propagating to parent elements
    e.stopPropagation();
    const event = new CustomEvent('on-child-click', {
      detail: {
        child: this,
        childIndex: this.childIndex,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('childState')) {
      if (this.childState === 'active') {
        this.progress = 50;
      } else if (this.childState === 'pending') {
        this.progress = 0;
      } else {
        this.progress = 100;
      }
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper-item-child': StepperItemChild;
  }
}
