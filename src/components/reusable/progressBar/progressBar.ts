import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import checkmarkIcon from '@carbon/icons/es/checkmark--filled/20';
import errorIcon from '@carbon/icons/es/error--filled/20';

import ProgressBarStyles from './progressBar.scss';

/**
 * `<kyn-progress-bar>` -- progress bar status indicator component.
 */
@customElement('kyn-progress-bar')
export class ProgressBar extends LitElement {
  static override styles = ProgressBarStyles;

  /** Sets progress bar status mode. */
  @property({ type: String })
  status: 'active' | 'finished' | 'success' | 'error' = 'active';

  /** Initial progress bar value (optionally hard-coded). */
  @property({ type: Number })
  value: number | null = null;

  /** Sets manual max value. */
  @property({ type: Number })
  max = 100;

  /** Sets progress bar label (optional). */
  @property({ type: String })
  label = '';

  /** Sets helper text that appears underneath `<progress>` element (optional). */
  @property({ type: String })
  helperText = '';

  /** Sets progress bar animation speed. */
  @property({ type: String })
  animationSpeed: 'slow' | 'normal' | 'fast' = 'normal';

  override render() {
    return html`
      <div class="progress-bar__upper-container">
        ${this.label
          ? html`<h2 class="progress-bar__label">${this.label}</h2>`
          : null}
        <div class=${`progress-bar__status-icon ${this.status}`}>
          ${this.status === 'success'
            ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
            : this.status === 'error'
            ? html`<kd-icon .icon=${errorIcon}></kd-icon>`
            : null}
        </div>
      </div>
      <progress
        class="${this.getProgressBarClasses()}"
        max=${this.max}
        value=${this.value}
        aria-valuenow="${ifDefined(
          this.status === 'active' ? undefined : this.value
        )}"
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        aria-label=${this.label}
      ></progress>
      ${this.helperText
        ? html`<h2 class=${`progress-bar__helper-text ${this.status}`}>
            ${this.helperText}
          </h2>`
        : null}
    `;
  }

  private getProgressBarClasses() {
    return classMap({
      'progress-bar__item': true,
      'progress-bar__active': this.status === 'active',
      'progress-bar__finished': this.status === 'finished',
      'progress-bar__success': this.status === 'success',
      'progress-bar__error': this.status === 'error',
      'progress-bar__speed-slow': this.animationSpeed === 'slow',
      'progress-bar__speed-normal': this.animationSpeed === 'normal',
      'progress-bar__speed-fast': this.animationSpeed === 'fast',
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-progress-bar': ProgressBar;
  }
}
