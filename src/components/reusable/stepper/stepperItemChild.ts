import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../link';
import StepChildCss from './stepperItemChild.scss';

/**
 * Stepper Item child.
 * @slot unnamed - Slot for other elements.
 * @fires on-child-click - Emits event on child click. Only for vertical mode.
 */
@customElement('kyn-stepper-item-child')
export class StepperItemChild extends LitElement {
  static override styles = StepChildCss;

  /** Child Title. Required for nested child inside step. */
  @property({ type: String })
  childTitle = '';

  /** Child link. */
  @property({ type: String })
  childLink = '';

  /** Optional Child Subtitle. */
  @property({ type: String })
  childSubTitle = '';

  /** Child disabled or not Internal state inherit from `<kyn-step-item>`.
   * @ignore
   */
  @state()
  disabled = false;

  /** Child State. `'pending'`, `'active'` & `'completed'`.  */
  @property({ type: String })
  childState = 'pending';

  /** Child Size. Inherit from `<kyn-step-item>`.
   * @ignore
   */
  @state()
  childSize = 'large';

  /** Child progress, calculate Internal progress.
   * @ignore
   */
  @state()
  progress = 0;

  /** Child index.
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
        <!-- Child Progress -->
        <div
          class="child-step-line-${this.childSize} child-step-line"
          role="progressbar"
          aria-valuenow="${this.progress}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Child progress: ${this.progress}%"
        >
          <div
            class="${this.progress === 100
              ? 'child-step-progress-line-completed'
              : ''} child-step-progress-line"
            style="height:${this.progress}%;"
          ></div>
        </div>
        <!-- Child Icon -->
        <div
          class="child-step-icon-wrapper child-step-icon-wrapper-${this
            .childSize}"
        >
          <div class="${classMap(childIconClasses)}"></div>
        </div>
        <div class="child-step-content">
          <!-- Child Title & Optional Subtitle -->
          ${this.childLink !== ''
            ? html`
                <kyn-link
                  href=${this.childLink}
                  kind="primary"
                  ?disabled=${this.disabled}
                  @on-click=${(e: any) => this._handleChildStepClick(e)}
                >
                  ${this.childTitle}
                </kyn-link>
              `
            : html`<p class="title-text">${this.childTitle}</p>`}
          ${this.childSubTitle !== ''
            ? html` <p class="child-step-subtitle">${this.childSubTitle}</p>`
            : null}

          <!-- Slot for other UI -->
          <div>
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  // Emit event on child click
  private _handleChildStepClick(e: Event) {
    if (this.disabled) {
      return;
    }
    const event = new CustomEvent('on-child-click', {
      detail: {
        child: this,
        href: this.childLink,
        childIndex: this.childIndex,
        origEvent: e,
      },
    });
    this.dispatchEvent(event);
  }

  override updated(changedProps: any) {
    if (changedProps.has('childState')) {
      this.progress = this.getProgressValue();
    }
  }

  private getProgressValue(): number {
    switch (this.childState) {
      case 'active':
        return 50;
      case 'completed':
        return 100;
      case 'pending':
      default:
        return 0;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper-item-child': StepperItemChild;
  }
}
