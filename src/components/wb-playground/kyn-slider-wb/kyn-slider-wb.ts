import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import SliderStyles from './kyn-slider-wb.scss';

/**
 * Slider.
 */
@customElement('kyn-slider-wb')
export class KynSliderWb extends LitElement {
  static override styles = [
    SliderStyles,
    css`
      #slider-label {
        color: #000000; /* Ensure high contrast */
        font-weight: bold;
      }
      .min-max-value {
        color: #000000; /* Ensure high contrast */
      }
    `,
  ];

  /** @ignore */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Associate the component with forms.
   * @ignore
   */
  static formAssociated = true;

  /**
   * Attached internals for form association.
   * @ignore
   */
  @state()
  internals = this.attachInternals();

  /**
   * Slider size `'auto'`, `'sm'`, `'md'`, or `'lg'`.
   */
  @property({ type: String })
  size = 'auto';

  /** Slider name. */
  @property({ type: String })
  name = '';

  /**
   * Slider label, optional.
   */
  @property({ type: String })
  sliderLabel = '';

  /**
   * Sets color of slider thumb and preceding fill of status bar (ex: #, rgb).
   */
  @property({ type: String })
  sliderThemeColor = 'spruce';

  /** Input disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Default lower slider threshold value, optional.
   */
  @property({ type: Number })
  min!: number;

  /**
   * Default upper slider threshold value, optional.
   */
  @property({ type: Number })
  max!: number;

  /** Input invalid text. */
  @property({ type: String })
  invalidText = '';

  /**
   * Show/hide current slider value.
   */
  @property({ type: Boolean })
  sliderValueVisible = true;

  /**
   * Step interval for slider.
   */
  @property({ type: Number })
  step = 1;

  /**
   * Show/hide min/max values on either side of slider.
   */
  @property({ type: Boolean })
  minMaxVisible = true;

  /**
   * Current input value.
   */
  @property({ type: Number })
  value = 0;

  /**
   * Default input value on load.
   */
  @property({ type: Number })
  defaultSliderValue = 0;

  /**
   * Queries the <input> DOM element.
   * @ignore
   */
  @query('input')
  inputEl!: HTMLInputElement;

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
          >${this.min}</span
        >
        <input
          id="slider-input"
          name=${this.name}
          type="range"
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
          .value=${this.value.toString()}
          @input=${this._handleSliderChange}
          class="${`${this.size} theme-${this.sliderThemeColor}`}"
          style="--slider-percentage: ${this.calculatePercentage()}%;"
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-valuenow=${this.value}
          aria-label=${this.sliderLabel || 'Slider'}
          step=${ifDefined(this.step)}
          ?disabled=${this.disabled}
        />
        <span class="min-max-value" ?hidden=${!this.minMaxVisible}
          >${this.max}</span
        >
        ${this.sliderValueVisible
          ? html`<div
              id="displayed-slider-value"
              class=${`theme-${this.sliderThemeColor}`}
            >
              ${this.value}
            </div>`
          : null}
      </div>
    `;
  }

  override updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('defaultSliderValue') &&
      this.defaultSliderValue !== undefined
    ) {
      this.value = Number(this.defaultSliderValue);
      this.updateSliderColor();
    }
  }

  private _handleSliderChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
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
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-slider-wb': KynSliderWb;
  }
}
