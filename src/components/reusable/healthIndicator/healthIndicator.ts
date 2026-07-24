import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HealthIndicatorScss from './healthIndicator.scss?inline';
import {
  HEALTH_INDICATOR_STATUS,
  HEALTH_INDICATOR_STATUS_LABELS,
} from './defs';

const HEALTH_INDICATOR_DEFAULT_PERCENTAGE: Record<
  HEALTH_INDICATOR_STATUS,
  number
> = {
  [HEALTH_INDICATOR_STATUS.HEALTHY]: 100,
  [HEALTH_INDICATOR_STATUS.WARNING]: 72,
  [HEALTH_INDICATOR_STATUS.ERROR]: 46,
  [HEALTH_INDICATOR_STATUS.CRITICAL]: 26,
};

const HEALTH_INDICATOR_STATUSES = new Set(
  Object.values(HEALTH_INDICATOR_STATUS)
);

/**
 * Health Indicator.
 * Compact status meter for service or resource health.
 */
@customElement('kyn-health-indicator')
export class HealthIndicator extends LitElement {
  static override styles = unsafeCSS(HealthIndicatorScss);

  /** Label shown above the indicator bar. */
  @property({ type: String })
  accessor label = '';

  /** Semantic health state that controls color and default fill. */
  @property({ type: String })
  accessor status: HEALTH_INDICATOR_STATUS = HEALTH_INDICATOR_STATUS.HEALTHY;

  /** Optional percentage override (0-100). */
  @property({ type: Number })
  accessor value: number | null = null;

  /** Visually hide the label while keeping it for screen readers. */
  @property({ type: Boolean })
  accessor hideLabel = false;

  override render() {
    const status = this._resolvedStatus;
    const label = this.label || HEALTH_INDICATOR_STATUS_LABELS[status];
    const percentage = this._resolvedPercentage(status);

    return html`
      <div class="health-indicator">
        <label
          class="health-indicator__label label-text ${this.hideLabel
            ? 'sr-only'
            : ''}"
        >
          ${label}
        </label>
        <div
          class="health-indicator__bar health-indicator__bar--${status}"
          role="meter"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${percentage}
          aria-valuetext=${`${label}: ${percentage}%`}
          aria-label=${label}
        >
          <div
            class="health-indicator__fill health-indicator__fill--${status}"
            style=${`width: ${percentage}%`}
          ></div>
        </div>
      </div>
    `;
  }

  /**
   * @internal
   * @ignore
   */
  private get _resolvedStatus(): HEALTH_INDICATOR_STATUS {
    return HEALTH_INDICATOR_STATUSES.has(this.status)
      ? this.status
      : HEALTH_INDICATOR_STATUS.HEALTHY;
  }

  private _resolvedPercentage(status: HEALTH_INDICATOR_STATUS): number {
    if (
      this.value === null ||
      this.value === undefined ||
      Number.isNaN(this.value)
    ) {
      return HEALTH_INDICATOR_DEFAULT_PERCENTAGE[status];
    }

    return Math.max(0, Math.min(100, Math.round(this.value)));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-health-indicator': HealthIndicator;
  }
}
