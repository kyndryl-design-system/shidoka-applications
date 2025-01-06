import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import '../loaders';
import '../tooltip';
import checkmarkIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

import ProgressBarStyles from './progressBar.scss';

enum ProgressStatus {
  ACTIVE = 'active',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * `<kyn-progress-bar>` -- progress bar status indicator component.
 * @slot unnamed - Slot for tooltip text content.
 */
@customElement('kyn-progress-bar')
export class ProgressBar extends LitElement {
  static override styles = ProgressBarStyles;

  /** Sets visibility of optional inline load status spinner. */
  @property({ type: Boolean })
  showInlineLoadStatus = false;

  /** Controls whether to show default helper text for active state. */
  @property({ type: Boolean })
  showActiveHelperText = false;

  /** Sets progress bar html id property for accessibility (ex: `example-progress-bar`). */
  @property({ type: String })
  progressBarId = '';

  /** Sets progress bar status mode. */
  @property({ type: String })
  status: 'active' | 'success' | 'error' = 'active';

  /** Sets initial progress bar value (optionally hard-coded). */
  @property({ type: Number })
  value: number | null = null;

  /** Sets manual max value (default = 100). */
  @property({ type: Number })
  max = 100;

  /** Sets optional progress bar label. */
  @property({ type: String })
  label = '';

  /** Sets optional helper text that appears underneath progress bar element. */
  @property({ type: String })
  helperText = '';

  /** Sets the unit for progress measurement (ex: 'MB', 'GB', '%') */
  @property({ type: String })
  unit = '';

  /** Visually hide the label. */
  @property({ type: Boolean })
  hideLabel = false;

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

  /** Value set to indicate absence of value and max to identify indeterminate state.
   * @internal
   */
  @state()
  private _isIndeterminate = false;

  /** Controls timeout interval for incremented bar animation.
   * @internal
   */
  private _animationFrameId: number | null = null;

  override render() {
    const currentValue =
      this.status === ProgressStatus.ACTIVE ? this._progress : this.value;
    const currentStatus = this.getCurrentStatus(currentValue);
    const helperText = this.getHelperText();

    this._isIndeterminate =
      currentValue === null ||
      currentValue === undefined ||
      this.max === null ||
      this.max === undefined;

    this._percentage = this.max
      ? Math.round((this._progress / this.max) * 100)
      : 0;

    return html`
      ${this.renderProgressBarLabel(currentStatus, currentValue)}
      ${this.renderProgressBar(currentStatus, currentValue)}
      ${helperText
        ? html`<div
            class=${`progress-bar__helper-text options-text ${currentStatus}`}
          >
            ${helperText}
          </div>`
        : null}
    `;
  }

  private renderProgressBar(
    currentStatus: ProgressStatus,
    currentValue: number | null
  ) {
    const resolvedValue =
      currentStatus === ProgressStatus.ACTIVE ? currentValue : this.max;

    const widthStyle = this._isIndeterminate
      ? 'width: 55px;'
      : currentStatus === ProgressStatus.ERROR && currentValue != null
      ? `width: ${currentValue}%`
      : `width: ${this._percentage}%`;

    return html`
      <div
        id=${this.progressBarId}
        class="progress-bar__container"
        role="progressbar"
        aria-valuemin=${ifDefined(this.value ?? 0)}
        aria-valuemax=${ifDefined(this.max ?? 100)}
        aria-valuenow=${ifDefined(Number(resolvedValue))}
        aria-valuetext=${`${resolvedValue}% complete`}
        aria-label=${this.label}
      >
        <div class="progress-bar__background">
          <div
            class=${classMap(this.getProgressBarClasses(currentStatus))}
            style=${widthStyle}
          ></div>
        </div>
      </div>
    `;
  }

  private renderProgressBarLabel(
    currentStatus: ProgressStatus,
    currentValue: number | null
  ) {
    return html`
      <div
        class="progress-bar__upper-container${this.hideLabel ? ' sr-only' : ''}"
      >
        <label class="progress-bar__label label-text" for=${this.progressBarId}>
          <span>${this.label}</span>
          <slot name="unnamed"></slot>
        </label>
        ${!this._isIndeterminate
          ? html`<div class="progress-bar__status-icon">
              ${this.renderStatusIconOrLoader(currentStatus, currentValue)}
            </div>`
          : null}
      </div>
    `;
  }

  private renderStatusIconOrLoader(
    currentStatus: ProgressStatus,
    currentValue: number | null
  ) {
    if (currentStatus !== ProgressStatus.ACTIVE) {
      return html`<span class="${currentStatus}-icon"
        >${currentStatus === ProgressStatus.SUCCESS
          ? unsafeSVG(checkmarkIcon)
          : unsafeSVG(errorIcon)}</span
      >`;
    }

    const hardcodedProgressReached =
      currentValue != null && this.value != null && currentValue >= this.value;

    if (this.showInlineLoadStatus && !hardcodedProgressReached) {
      return html`<p>
        <span>${this._percentage}%</span>
        <kyn-loader-inline status="active"></kyn-loader-inline>
      </p>`;
    }

    return null;
  }

  override firstUpdated() {
    if (this.status === ProgressStatus.ACTIVE) {
      this.startProgress();
    }
  }

  override updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('status') || changedProperties.has('value')) {
      this.cancelAnimation();

      if (this.status === ProgressStatus.ACTIVE) {
        this.startProgress();
      }
    }
  }

  private getProgressBarClasses(status: ProgressStatus) {
    return {
      'progress-bar__main': true,
      'is-indeterminate': this._isIndeterminate,
      [`progress-bar__${status}`]: true,
    };
  }

  private getHelperText() {
    if (this.helperText) {
      return this.helperText;
    }

    if (this._isIndeterminate) {
      return '';
    }

    if (this.showActiveHelperText) {
      const progressValue = this._progress ?? 0;
      const maxValue = this.max ?? 0;
      const unit = this.unit || '';

      return `${progressValue}${unit} of ${maxValue}${unit}`;
    }

    return '';
  }

  private getCurrentStatus(currentValue: number | null): ProgressStatus {
    if (this.status === ProgressStatus.ERROR) {
      return ProgressStatus.ERROR;
    }

    if (this.status === ProgressStatus.SUCCESS || currentValue === this.max) {
      return ProgressStatus.SUCCESS;
    }

    return ProgressStatus.ACTIVE;
  }

  private startProgress() {
    this.cancelAnimation();

    const targetValue = this.value ?? this.max;
    const advancement = 1;

    const step = () => {
      const difference = targetValue - this._progress;
      const progressStep =
        Math.sign(difference) * Math.min(Math.abs(difference), advancement);

      if (Math.abs(difference) > 0.1) {
        this._progress += progressStep;
        this._animationFrameId = requestAnimationFrame(step);
      } else {
        this._progress = targetValue;
        this.cancelAnimation();
      }
    };

    step();
  }

  private cancelAnimation() {
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cancelAnimation();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-progress-bar': ProgressBar;
  }
}
