import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@kyndryl-design-system/shidoka-foundation/components/icon';
import checkmarkIcon from '@carbon/icons/es/checkmark--filled/20';
import errorIcon from '@carbon/icons/es/error--filled/20';

import ProgressBarStyles from './progressBar.scss';

enum ProgressStatus {
  ACTIVE = 'active',
  SUCCESS = 'success',
  ERROR = 'error',
}

enum AnimationSpeed {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast',
}

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
  private _animationFrameId: number | null = null;

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
      ${this.renderProgressBarLabel(currentStatus)}
      ${this.renderProgressBar(currentStatus, currentValue)}
      ${helperText
        ? html`<h2 class=${`progress-bar__helper-text ${currentStatus}`}>
            ${helperText}
          </h2>`
        : null}
    `;
  }

  override updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('status') || changedProperties.has('value')) {
      if (
        this.status === ProgressStatus.ACTIVE &&
        this.value !== null &&
        !this._running
      ) {
        this._running = true;
        this.startProgress();
      } else if (this.status !== ProgressStatus.ACTIVE || this.value === null) {
        if (this._animationFrameId) {
          clearInterval(this._animationFrameId);
          this._running = false;
        }
      }
    }
  }

  /// RENDER LOGIC
  private getProgressBarClasses(status: string) {
    return classMap({
      'progress-bar__item': true,
      [`progress-bar__${status}`]: true,
      [`progress-bar__speed-${this.animationSpeed}`]: true,
    });
  }

  private renderProgressBarLabel(currentStatus: string) {
    return html`<div class="progress-bar__upper-container">
      ${this.label
        ? html`<h2 class="progress-bar__label">${this.label}</h2>`
        : null}
      <div class=${`progress-bar__status-icon ${currentStatus}`}>
        ${currentStatus === ProgressStatus.SUCCESS
          ? html`<kd-icon .icon=${checkmarkIcon}></kd-icon>`
          : currentStatus === ProgressStatus.ERROR
          ? html`<kd-icon .icon=${errorIcon}></kd-icon>`
          : null}
      </div>
    </div>`;
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
  ///

  /// ANIMATED PROGRESS LOGIC
  override connectedCallback() {
    super.connectedCallback();
    if (
      this.simulate ||
      (this.status === ProgressStatus.ACTIVE && this.value !== null)
    ) {
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

    return ProgressStatus.ACTIVE;
  }

  private startProgress() {
    if (this._animationFrameId !== null) {
      return;
    }

    const step = () => {
      const targetValue = this.simulate ? this.max : this.value ?? this.max;
      const advancement = this.getAdvancement();

      if (this._progress + advancement < targetValue) {
        this._progress += advancement;
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

  private getAdvancement(): number {
    switch (this.animationSpeed) {
      case AnimationSpeed.SLOW:
        return 0.5;
      case AnimationSpeed.NORMAL:
        return 1;
      case AnimationSpeed.FAST:
        return 2;
      default:
        return 1;
    }
  }
  ///
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-progress-bar': ProgressBar;
  }
}
