import { LitElement, html, css } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import stepperStyles from './stepperFinal.scss';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/link';
import checkmarkFilled from '@carbon/icons/es/checkmark--filled/24';
import circleFilled from '@carbon/icons/es/circle--filled/24';
import substractFilled from '@carbon/icons/es/subtract--filled/24';
import errorFilled from '@carbon/icons/es/error--filled/24';
import './stepperItem';

@customElement('kyn-stepper-final')
export class StepperFinalComponent extends LitElement {
  static override styles = [stepperStyles];

  @property({ type: Boolean })
  vertical = false;

  /**
   * Queries any slotted step items.
   * @ignore
   */
  @queryAssignedElements({ selector: 'kyn-stepper-item' })
  options!: Array<any>;

  override render() {
    return html`
      <!-- Horizontal stepper -->

      <div
        class="${this.vertical
          ? 'vertical-stepper-wrapper'
          : 'horizontal-stepper-wrapper'}"
      >
        <slot></slot>

        <!-- <div class="stepper-step">
          <div class="stepper-icon">
            <kd-icon
              slot="icon"
              .icon=${substractFilled}
              fill="#3d3c3c"
            ></kd-icon>
          </div>

          <div class="step-content">
            <p class="step-text">Step 4</p>
            <kd-link
              standalone
              href=""
              target="_self"
              kind="primary"
              ?disabled=${false}
              @on-click=${(e: any) => console.log(e)}
              >Step Title</kd-link
            >
          </div>
        </div> -->
      </div>
      <br /><br /><br />
      <!---------------------- VERTICAL STEPPER ----------------->
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Now `this.shadowRoot` should be defined
    console.log(this.shadowRoot); // should not be undefined
  }
  //   override firstUpdated() {
  //     const slot = this.shadowRoot?.querySelector('slot');
  //     const assignedNodes = slot?.assignedNodes({ flatten: true });
  //     //const firstChild = assignedNodes?.find(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'KYN-STEPPER_ITEM');
  //     const firstChild = assignedNodes?.find(
  //       (node) => node.nodeType === Node.ELEMENT_NODE
  //     );
  //     if (firstChild && firstChild.shadowRoot) {
  //       // Wait for the child to fully render its shadow DOM
  //       setTimeout(() => {
  //         const abcDiv = firstChild.shadowRoot.querySelector('.stepper-step');
  //         if (abcDiv) {
  //           abcDiv.style.alignItems = 'flex-start'; // Apply your desired style here
  //         }
  //       });
  //     }
  //   }
}
export default StepperFinalComponent;
