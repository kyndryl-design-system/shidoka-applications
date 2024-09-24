import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import '../loaders';
import '../tooltip';
import checkmarkIcon from '@carbon/icons/es/checkmark--filled/20';
import errorIcon from '@carbon/icons/es/error--filled/20';
import informationIcon from '@carbon/icons/es/information/16';

import ProgressBarStyles from './progressBar.scss';

enum ProgressStatus {
  INDETERMINATE = 'indeterminate',
  ACTIVE = 'active',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * `<kyn-progress-bar>` -- progress bar status indicator component.
 */
@customElement('kyn-progress-bar')
export class ProgressBar extends LitElement {
  static override styles = ProgressBarStyles;

  /** Sets progress bar status mode -- `indeterminate`, `active`, `success`, `error`. */
  @property({ type: String })
  status: 'indeterminate' | 'active' | 'success' | 'error' = 'indeterminate';

  /** Initial progress bar value (optionally hard-coded). */
  @property({ type: Number })
  value: number | null = null;

  /** Sets manual max value. */
  @property({ type: Number })
  max = 100;

  /** Sets optional progress bar label. */
  @property({ type: String })
  label = '';

  /** Sets optionally displayed information icon and tooltip content. */
  @property({ type: String })
  informationalTooltipText = '';

  /** Sets optional helper text that appears underneath `<progress>` element. */
  @property({ type: String })
  helperText = '';

  /** Sets the unit for progress measurement (ex: 'MB', 'GB', '%') */
  @property({ type: String })
  unit = '';

  /** Sets visibility of optional inline load status spinner. */
  @property({ type: Boolean })
  inlineLoadStatusVisible = true;

  /** Incrementing percentage count value.
   * @internal
   */
  @state()
  private _percentage = 0;

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
  private _animationFrameId: number | null = null;

  override render() {
    const currentValue = this.status === 'active' ? this._progress : this.value;
    const currentStatus = this.getCurrentStatus(currentValue);

    const decimalUnits = ['GB', 'MB', 'KB', 'B'].includes(this.unit);
    const formattedProgress = decimalUnits
      ? this._progress.toFixed(1)
      : this._progress.toFixed(0);

    const formattedMax = decimalUnits
      ? this.max.toFixed(1)
      : this.max.toFixed(0);

    const helperText = this.getHelperText(formattedMax, formattedProgress);

    this._percentage = Math.round((this._progress / this.max) * 100);

    return html`
      ${this.renderProgressBarLabel(currentStatus)}
      ${this.renderProgressBar(currentStatus, currentValue)}
      ${helperText
        ? html`<div class=${`progress-bar__helper-text ${currentStatus}`}>
            <h2>${helperText}</h2>
          </div>`
        : null}
    `;
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

  private renderProgressBarLabel(currentStatus: ProgressStatus) {
    return html`<div class="progress-bar__upper-container">
      <h2 class="progress-bar__label">
        <span>${this.label}</span>
        ${this.informationalTooltipText
          ? html`<kyn-tooltip
              ><span slot="anchor"
                ><kd-icon .icon=${informationIcon}></kd-icon></span
              >${this.informationalTooltipText}</kyn-tooltip
            >`
          : null}
      </h2>
      ${currentStatus !== ProgressStatus.INDETERMINATE
        ? html`<div class=${`progress-bar__status-icon ${currentStatus}`}>
            ${currentStatus !== ProgressStatus.ACTIVE
              ? html`<kd-icon
                  .icon=${currentStatus === ProgressStatus.SUCCESS
                    ? checkmarkIcon
                    : errorIcon}
                ></kd-icon>`
              : html`<p ?hidden=${!this.inlineLoadStatusVisible}>
                  <span>${this._percentage}%</span
                  ><kyn-loader-inline status="active"></kyn-loader-inline>
                </p>`}
          </div>`
        : null}
    </div>`;
  }

  override updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('status') || changedProperties.has('value')) {
      this.cancelAnimation();
      this._running = false;

      if (this.status === ProgressStatus.ACTIVE) {
        this._running = true;
        this.startProgress();
      }
    }
  }

  private getHelperText(formattedMax: string, formattedProgress: string) {
    if (this.helperText && typeof this.helperText === 'string') {
      return this.helperText;
    }

    if (this.status === ProgressStatus.ACTIVE) {
      if (this._running) {
        return `${formattedProgress}${this.unit} of ${formattedMax}${this.unit}`;
      } else {
        return 'Fetching assets...';
      }
    }

    return this.helperText;
  }

  private getProgressBarClasses(status: string) {
    return classMap({
      'progress-bar__main': true,
      [`progress-bar__${status}`]: true,
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.status === ProgressStatus.ACTIVE) {
      setTimeout(() => {
        this._running = true;
        this.startProgress();
      }, 3000);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    if (this._animationFrameId !== null) {
      clearTimeout(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  private getCurrentStatus(currentValue: number | null): ProgressStatus {
    if (this.status === ProgressStatus.ERROR) {
      return ProgressStatus.ERROR;
    }

    if (
      this.status === ProgressStatus.SUCCESS ||
      (currentValue !== null && currentValue >= this.max)
    ) {
      return ProgressStatus.SUCCESS;
    }

    if (
      this.status === ProgressStatus.ACTIVE &&
      currentValue &&
      currentValue < this.max &&
      currentValue !== this.value
    ) {
      return ProgressStatus.ACTIVE;
    }

    return ProgressStatus.INDETERMINATE;
  }

  private startProgress() {
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    const step = () => {
      const targetValue = this.value ?? this.max;
      const advancement = 1;
      const difference = targetValue - this._progress;
      const direction = Math.sign(difference);
      const delta = Math.min(Math.abs(difference), advancement) * direction;

      if (Math.abs(difference) > 0.1) {
        this._progress += delta;
        this.requestUpdate();
        this._animationFrameId = requestAnimationFrame(step);
      } else {
        this._progress = targetValue;
        this.requestUpdate();
        this._animationFrameId = null;
        this.cancelAnimation();
      }
    };

    this._animationFrameId = requestAnimationFrame(step);
  }

  private cancelAnimation() {
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-progress-bar': ProgressBar;
  }
}
