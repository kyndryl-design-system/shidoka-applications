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
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-stepper-item': StepperItem;
  }
}
