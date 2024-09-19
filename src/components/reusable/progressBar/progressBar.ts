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
  status: 'active' | 'success' | 'error' = 'active';

  /** Initial progress bar value (optionally hard-coded). */
  @property({ type: Number })
  value: number | null = null;

  /** Sets manual max value. */
  @property({ type: Number })
  max = 100;

  /** Sets optional progress bar label. */
  @property({ type: String })
  label = '';

  /** Sets optional helper text that appears underneath `<progress>` element. */
  @property({ type: String })
  helperText = '';

  /** Sets progress bar animation speed. */
  @property({ type: String })
  animationSpeed: 'slow' | 'normal' | 'fast' = 'normal';

  /** Enables or disables automatic simulation. */
  @property({ type: Boolean })
  simulate = false;

  /** Sets the unit for progress measurement (ex: 'MB', 'GB', '%') */
  @property({ type: String })
  unit = '';

  /** Increments animated movement in progress bar.
   * @internal
   */
  @state()
  private _progress = 0;

  /** Value indicates whether or not the bar is in animated motion, dynamic helper text values are proportionally incrementing.
   * @internal
   */
  @state()
  private _running = false;

  /** Controls timeout interval for incremented bar animation.
   * @internal
   */
  private _intervalId: number | null = null;

  override render() {
    const currentValue =
      this.simulate || (this.status === 'active' && this.value !== null)
        ? this._progress
        : this.value;
    const currentStatus = this.getCurrentStatus(currentValue);

    const formattedProgress = ['GB', 'MB', 'KB', 'B'].includes(this.unit)
      ? this._progress.toFixed(1)
      : this._progress.toFixed(0);

    const formattedMax = ['GB', 'MB', 'KB', 'B'].includes(this.unit)
      ? this.max.toFixed(1)
      : this.max.toFixed(0);

    const helperText =
      this.simulate || (this.status === 'active' && this.value !== null)
        ? this._running
          ? `${formattedProgress}${this.unit} of ${formattedMax}${this.unit}`
          : 'Fetching assets...'
        : this.helperText;

    return html`
      <div class="progress-bar__upper-container">
        ${this.label
          ? html`<h2 class="progress-bar__label">${this.label}</h2>`
          : null}
        <div class=${`progress-bar__status-icon ${currentStatus}`}>
          ${currentStatus === 'success'
            ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
            : currentStatus === 'error'
            ? html`<kd-icon .icon=${errorIcon}></kd-icon>`
            : null}
        </div>
      </div>
      ${this.renderProgressBar(currentStatus, currentValue)}
      ${helperText
        ? html`<h2 class=${`progress-bar__helper-text ${currentStatus}`}>
            ${helperText}
          </h2>`
        : null}
    `;
  }

  private getProgressBarClasses(status: string) {
    return classMap({
      'progress-bar__item': true,
      [`progress-bar__${status}`]: true,
      [`progress-bar__speed-${this.animationSpeed}`]: true,
    });
  }

  private renderProgressBar(
    currentStatus: string,
    currentValue: number | null
  ) {
    return html` <progress
      class="${this.getProgressBarClasses(currentStatus)}"
      max=${this.max}
      value=${ifDefined(currentValue !== null ? currentValue : undefined)}
      aria-valuenow=${ifDefined(
        currentValue !== null ? currentValue : undefined
      )}
      aria-valuemin=${0}
      aria-valuemax=${this.max}
      aria-label=${this.label}
    ></progress>`;
  }

  override updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('status') || changedProperties.has('value')) {
      if (this.status === 'active' && this.value !== null && !this._running) {
        this._running = true;
        this.startProgress();
      } else if (this.status !== 'active' || this.value === null) {
        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._running = false;
        }
      }
    }
  }

  private getCurrentStatus(
    currentValue: number | null
  ): 'active' | 'success' | 'error' {
    if (this.status === 'error') return 'error';
    if (
      this.status === 'success' ||
      (currentValue !== null && currentValue >= this.max)
    )
      return 'success';
    return 'active';
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.simulate || (this.status === 'active' && this.value !== null)) {
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
      const targetValue = this.simulate ? this.max : this.value ?? this.max;
      const advancement = Math.random() * 8;
      if (this._progress + advancement < targetValue) {
        this._progress += advancement;
      } else {
        if (this._intervalId) {
          clearInterval(this._intervalId);
        }
        this._progress = targetValue;
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
