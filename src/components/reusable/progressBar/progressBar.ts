import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  /** Enables or disables automatic simulation. */
  @property({ type: Boolean })
  simulate = false;

  @state()
  private _progress = 0;

  @state()
  private _running = false;

  private _intervalId: number | null = null;

  override render() {
    const effectiveValue = this.simulate ? this._progress : this.value;
    const effectiveStatus = this.simulate
      ? this._progress >= this.max
        ? 'finished'
        : 'active'
      : this.status;

    const helperText = this.simulate
      ? this._running
        ? `${this._progress.toFixed(1)}MB of ${this.max}MB`
        : 'Fetching assets...'
      : this.helperText;

    return html`
      <div class="progress-bar__upper-container">
        ${this.label
          ? html`<h2 class="progress-bar__label">${this.label}</h2>`
          : null}
        <div class=${`progress-bar__status-icon ${effectiveStatus}`}>
          ${effectiveStatus === 'success' || effectiveStatus === 'finished'
            ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
            : effectiveStatus === 'error'
            ? html`<kd-icon .icon=${errorIcon}></kd-icon>`
            : null}
        </div>
      </div>
      <progress
        class="${this.getProgressBarClasses(effectiveStatus)}"
        max=${this.max}
        value=${ifDefined(effectiveValue !== null ? effectiveValue : undefined)}
        aria-valuenow=${ifDefined(
          effectiveValue !== null ? effectiveValue : undefined
        )}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        aria-label=${this.label}
      ></progress>
      ${helperText
        ? html`<h2 class=${`progress-bar__helper-text ${effectiveStatus}`}>
            ${helperText}
          </h2>`
        : null}
    `;
  }

  private getProgressBarClasses(status: string) {
    return classMap({
      'progress-bar__item': true,
      'progress-bar__active': status === 'active',
      'progress-bar__finished': status === 'finished',
      'progress-bar__success': status === 'success',
      'progress-bar__error': status === 'error',
      [`progress-bar__speed-${this.animationSpeed}`]: true,
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.simulate) {
      setTimeout(() => {
        this._running = true;
        this.startProgress();
      }, 3000);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }

  private startProgress() {
    this._intervalId = window.setInterval(() => {
      const advancement = Math.random() * 8;
      if (this._progress + advancement < this.max) {
        this._progress += advancement;
      } else {
        if (this._intervalId) {
          clearInterval(this._intervalId);
        }
        this._progress = this.max;
      }
      this.requestUpdate();
    }, 50);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-progress-bar': ProgressBar;
  }
}
