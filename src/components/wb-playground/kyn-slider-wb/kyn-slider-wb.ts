import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import SliderStyles from './kyn-slider-wb.scss';

/**
 * Slider.
 */
@customElement('kyn-slider-wb')
export class KynSliderWb extends LitElement {
  static override styles = [SliderStyles];

  /**
   * Slider size `'auto'`, `'sm'`, `'md'`, or `'lg'`.
   * @type {string}
   * @default 'auto'
   */
  @property({ type: String })
  size = 'auto';

  /**
   * Slider label, optional.
   * @type {string}
   * @default ''
   */
  @property({ type: String })
  sliderLabel = '';

  /**
   * Sets color of slider thumb and preceding fill of status bar (ex: #, rgb).
   * @type {string}
   * @default 'spruce'
   */
  @property({ type: String })
  sliderThemeColor = 'spruce';

  /**
   * Default, pre-set slider value, optional.
   * @type {number}
   * @default 0
   */
  @property({ type: Number })
  defaultSliderValue = 0;

  /**
   * Default lower slider threshold value, optional.
   * @type {number}
   * @default 0
   */
  @property({ type: Number })
  lowerValue = 0;

  /**
   * Default upper slider threshold value, optional.
   * @type {number}
   * @default 0
   */
  @property({ type: Number })
  upperValue = 100;

  /**
   * Show/hide current slider value.
   * @type {boolean}
   * @default true
   */
  @property({ type: Boolean })
  sliderValueVisible = true;

  /**
   * Show/hide min/max values on either side of slider.
   * @type {boolean}
   * @default true
   */
  @property({ type: Boolean })
  minMaxVisible = true;

  /** Modal element
   * @internal
   */
  @state()
  _currentValue = 0;

  /** Slider element
   * @internal
   */
  @query('#slider')
  _sliderBar!: HTMLDivElement;

  /** Animated slider bar element
   * @internal
   */
  @query('#slider-input')
  private _sliderInput!: HTMLInputElement;

  override render() {
    return html`
      <div id="slider" class=${this.size}>
        <label id="slider-label">${this.sliderLabel}</label>
        <span class="min-max-value" ?hidden=${!this.minMaxVisible}
          >${this.lowerValue}</span
        >
        <input
          id="slider-input"
          type="range"
          min=${this.lowerValue}
          max=${this.upperValue}
          value=${this._currentValue}
          @input=${this.handleSliderChange}
          class="${`${this.size} theme-${this.sliderThemeColor}`}"
          style="--slider-percentage: ${this.calculatePercentage()}%;"
        />
        <span class="min-max-value" ?hidden=${!this.minMaxVisible}
          >${this.upperValue}</span
        >
        ${this.sliderValueVisible
          ? html`<div
              id="displayed-slider-value"
              class=${`theme-${this.sliderThemeColor}`}
            >
              ${this._currentValue}
            </div>`
          : null}
      </div>
    `;
  }

  /** Set intiial current value
   * @internal
   */
  override firstUpdated() {
    this._currentValue = this.defaultSliderValue || 0;
    this.updateSliderColor();
  }

  private handleSliderChange(event: Event) {
    const sliderValue = (event.target as HTMLInputElement).value;
    this._currentValue = Number(sliderValue);
    this.updateSliderColor();
  }

  private updateSliderColor() {
    if (this._sliderInput) {
      const percentage = this.calculatePercentage();
      this._sliderInput.style.setProperty(
        '--slider-percentage',
        `${percentage}%`
      );
    }
  }

  private calculatePercentage(): number {
    return (
      ((this._currentValue - this.lowerValue) /
        (this.upperValue - this.lowerValue)) *
      100
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-slider-wb': KynSliderWb;
  }
}
