import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import { TinyColor } from '@ctrl/tinycolor';
import styles from './colorPicker.scss';

import { drag } from '../../../common/helpers/drag';

import '../fileUploader';
import '../textInput';

const hasEyeDropper = 'EyeDropper' in window;

interface EyeDropperConstructor {
  new (): EyeDropperInterface;
}

interface EyeDropperInterface {
  open: () => Promise<{ sRGBHex: string }>;
}

declare const EyeDropper: EyeDropperConstructor;

/**
 * ColorPicker component.
 * * @fires on-change - Captures the input event and emits the selected value and original event details.
 * @prop {string} label - Label text.
 * @prop {string} value - Value text.
 * @prop {boolean} opacity - Toggle Opacity.
 */
@customElement('kyn-color-picker')
export class ColorPicker extends LitElement {
  static override styles = styles;

  /** Label text. */
  @property({ type: String })
  label = '';

  /** Color text. */
  @property({ type: String })
  value = '';

  /** Set to true for Opacity enabled */
  @property({ type: Boolean })
  opacity = false;

  @state()
  isDragging = false;

  @state()
  showPicker = false;

  @state()
  handleX = 100;

  @state()
  handleY = 75;

  @state()
  hue = 0;

  @state()
  saturation = 100;

  @state()
  brightness = 100;

  @state()
  alpha = 100;

  @state()
  r = 0;

  @state()
  g = 0;

  @state()
  b = 0;

  override render() {
    const { r, g, b } = this.hexToRgb(this.value);
    this.r = r;
    this.g = g;
    this.b = b;
    const alphaValue = this.getAlphaFromHex(this.value);
    this.alpha = alphaValue * 100;
    return html`
      <div class="field">
        <label>${this.label}</label>
        <div style="display: flex; gap:8px;">
          <div
            tabindex="0"
            class="color-picker__preview"
            style="background-color: ${this.value};"
          ></div>
          <input
            type="text"
            aria-label="hex color"
            .value=${this.value.toUpperCase()}
            @input=${(e: any) => this.handleValueChange(e)}
            @click=${this.togglePicker}
          />
        </div>

        ${this.showPicker
          ? html`
              <div class="overlay"></div>
              <div
                class="picker-popup"
                @click=${(e: any) => e.stopPropagation()}
                @keydown=${(e: any) => e.stopPropagation()}
              >
                <canvas
                  id="color-canvas"
                  class="canvas"
                  width="270"
                  height="180"
                  @mousedown=${this.startDrag}
                  @mousemove=${(e: any) => this.onDrag(e)}
                  @mouseup=${this.stopDrag}
                  @mouseleave=${this.stopDrag}
                  @click=${(e: any) => this.pickColor(e)}
                ></canvas>
                <div class="color-picker__controls">
                  <div class="color-picker__sliders">
                    <div
                      class="color-picker__hue color-picker__slider"
                      @pointerdown=${this.handleHueDrag}
                      @touchmove=${this.handleTouchMove}
                    >
                      <span
                        class="color-picker__slider-handle"
                        style="--hue-color: hsl(${this
                          .hue}, 100%, 50%);left : ${this.hue === 0
                          ? 0
                          : 100 / (360 / this.hue)}%"
                        role="slider"
                        aria-label="hue"
                        aria-orientation="horizontal"
                        aria-valuemin="0"
                        aria-valuemax="360"
                        aria-valuenow=${`${Math.round(this.hue)}`}
                        tabindex="0"
                        @keydown=${this.handleHueKeyDown}
                      ></span>
                    </div>
                    ${this.opacity
                      ? html`
                          <div
                            class="color-picker__alpha color-picker__slider color-picker__transparent-bg"
                            @pointerdown="${this.handleOpacityDrag}"
                            @touchmove=${this.handleTouchMove}
                          >
                            <div
                              class="color-picker__alpha-gradient"
                              style="background-image: linear-gradient(to right, ${this.getHexString(
                                this.hue,
                                this.saturation,
                                this.brightness,
                                0
                              )} 0%,
                          ${this.getHexString(
                                this.hue,
                                this.saturation,
                                this.brightness,
                                100
                              )} 100%);"
                            ></div>
                            <span
                              class="color-picker__slider-handle"
                              role="slider"
                              aria-label="alpha"
                              aria-orientation="horizontal"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style="--hue-color: hsl(${this
                                .hue}, 100%, 50%);left: ${this.alpha}%"
                              aria-valuenow=${this.alpha}
                              tabindex="0"
                              @keydown=${this.handleOpacityKeyDown}
                            ></span>
                          </div>
                        `
                      : null}
                  </div>
                </div>

                <div class="colors">
                  <div
                    style="display: flex; flex-direction: column;gap:2px;align-items: flex-start;"
                  >
                    <div class="kd-type--body-02">HEX</div>
                    <input
                      type="text"
                      aria-label="hex"
                      .value=${this.value.toUpperCase()}
                      readonly
                      @input=${(e: any) => this.handleHexInput(e)}
                    />
                  </div>
                  <div style="display: flex;align-items: center;gap: 2px;">
                    <div
                      style="display: flex; flex-direction: column;gap:2px;align-items: flex-start;"
                    >
                      <div class="kd-type--body-02">R</div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        maxlength="3"
                        aria-label="r"
                        .value=${String(this.r)}
                        @input=${(e: any) => this.handleRgbChange(e, 'r')}
                      />
                    </div>
                    <div
                      style="display: flex; flex-direction: column;align-items: flex-start;gap: 2px;"
                    >
                      <div class="kd-type--body-02">G</div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        maxlength="3"
                        aria-label="g"
                        .value=${String(this.g)}
                        @input=${(e: any) => this.handleRgbChange(e, 'g')}
                      />
                    </div>
                    <div
                      style="display: flex; flex-direction: column;align-items: flex-start;gap: 2px;"
                    >
                      <div class="kd-type--body-02">B</div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        maxlength="3"
                        aria-label="b"
                        .value=${String(this.b)}
                        @input=${(e: any) => this.handleRgbChange(e, 'b')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  getAlphaFromHex(hex: string): number {
    if (hex.length === 9) {
      return parseInt(hex.slice(7, 9), 16) / 255;
    } else {
      return 1;
    }
  }

  handleValueChange(event: any) {
    const newValue = event.target.value;
    if (newValue !== this.value) {
      this.value = newValue;
      const parsedColor = this.parseColor(newValue);
      if (parsedColor) {
        this.hue = parsedColor.hsva.h;
        this.saturation = parsedColor.hsva.s;
        this.brightness = parsedColor.hsva.v;
        this.alpha = this.opacity ? parsedColor.hsva.a * 100 : 100;
        this.handleX = (this.saturation / 100) * 260;
        this.handleY = 180 - (this.brightness / 100) * 180;
        this.drawCanvas();
        this.syncValues();
      }
    }
  }

  handleHueDrag(event: PointerEvent) {
    console.log('handleHueDrag--', event);
    const container = this.shadowRoot!.querySelector<HTMLElement>(
      '.color-picker__slider.color-picker__hue'
    )!;
    const handle = container.querySelector<HTMLElement>(
      '.color-picker__slider-handle'
    )!;
    const { width } = container.getBoundingClientRect();

    handle.focus();
    event.preventDefault();

    drag(container, {
      onMove: (x) => {
        this.hue = Math.round(this.clamp((x / width) * 360, 0, 360));
        this.syncValues();
        this.updateHueHandleColor();
        this.pickColorAt(this.handleX, this.handleY);
      },
      onStop: () => {},
      initialEvent: event,
    });
  }

  updateHueHandleColor() {
    const handle = this.shadowRoot?.querySelector(
      '.color-picker__slider-handle'
    ) as HTMLElement;
    if (handle) {
      handle.style.setProperty('--hue-color', `hsl(${this.hue}, 100%, 50%)`);
    }
  }

  async syncValues() {
    const currentColor = this.parseColor(
      `hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${
        this.alpha / 100
      })`
    );

    if (currentColor === null) {
      return;
    }

    this.value = this.opacity ? currentColor.hexa : currentColor.hex;
    await this.updateComplete;
  }

  handleTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  clamp(value: number, min: number, max: number) {
    const noNegativeZero = (n: number) => (Object.is(n, -0) ? 0 : n);
    if (value < min) {
      return noNegativeZero(min);
    }
    if (value > max) {
      return noNegativeZero(max);
    }
    return noNegativeZero(value);
  }

  handleHueKeyDown(event: KeyboardEvent) {
    const increment = event.shiftKey ? 10 : 1;
    const oldValue = this.value;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.hue = this.clamp(this.hue - increment, 0, 360);
      this.syncValues();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.hue = this.clamp(this.hue + increment, 0, 360);
      this.syncValues();
    }

    if (this.value !== oldValue) {
      this.pickColorAt(this.handleX, this.handleY);
    }
  }

  handleOpacityDrag(event: PointerEvent) {
    const container = this.shadowRoot!.querySelector<HTMLElement>(
      '.color-picker__slider.color-picker__alpha'
    )!;
    const handle = container.querySelector<HTMLElement>(
      '.color-picker__slider-handle'
    )!;
    const { width } = container.getBoundingClientRect();

    handle.focus();
    event.preventDefault();

    drag(container, {
      onMove: (x) => {
        this.alpha = Math.round(this.clamp((x / width) * 100, 0, 100));
        this.syncValues();
        this.dispatchColorChange();
      },
      onStop: () => {},
      initialEvent: event,
    });
  }

  handleOpacityKeyDown(event: KeyboardEvent) {
    const increment = event.shiftKey ? 10 : 1;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.alpha = this.clamp(this.alpha - increment, 0, 100);
      this.syncValues();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.alpha = this.clamp(this.alpha + increment, 0, 100);
      this.syncValues();
    }
  }

  private getHexString(
    hue: number,
    saturation: number,
    brightness: number,
    alpha = 100
  ) {
    const color = new TinyColor(
      `hsva(${hue}, ${saturation}%, ${brightness}%, ${alpha / 100})`
    );
    if (!color.isValid) {
      return '';
    }

    return color.toHex8String();
  }

  parseColor(colorString: string) {
    const color = new TinyColor(colorString);
    if (!color.isValid) {
      return null;
    }
    const rgb = color.toRgb();

    const hex = color.toHexString();
    const hexa = color.toHex8String();
    const hsvColor = color.toHsv();

    const hsv = {
      h: hsvColor.h,
      s: hsvColor.s * 100,
      v: hsvColor.v * 100,
      a: hsvColor.a,
    };

    return {
      rgb: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        string: this.setLetterCase(
          `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(
            rgb.b
          )})`
        ),
      },
      rgba: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: rgb.a,
        string: this.setLetterCase(
          `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(
            rgb.b
          )}, ${rgb.a.toFixed(2).toString()})`
        ),
      },
      hex: this.setLetterCase(hex),
      hexa: this.setLetterCase(hexa),
      hsva: {
        h: hsv.h,
        s: hsv.s,
        v: hsv.v,
        a: hsv.a,
        string: this.setLetterCase(
          `hsva(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(
            hsv.v
          )}%, ${hsv.a.toFixed(2).toString()})`
        ),
      },
    };
  }

  setLetterCase(string: string) {
    if (typeof string !== 'string') {
      return '';
    }
    return string.toUpperCase();
  }

  setColorFromValue() {
    const parsed = new TinyColor(this.value);
    if (parsed.isValid) {
      const hsv = parsed.toHsv();
      this.hue = hsv.h;
      this.saturation = hsv.s * 100;
      this.brightness = hsv.v * 100;
      const canvas = this.shadowRoot?.getElementById(
        'color-canvas'
      ) as HTMLCanvasElement;
      if (canvas) {
        this.handleX = (this.saturation / 100) * canvas.width;
        this.handleY = canvas.height - (this.brightness / 100) * canvas.height;
      }
    }
  }

  handleEyeDropper() {
    if (!hasEyeDropper) {
      return;
    }

    const eyeDropper = new EyeDropper();

    eyeDropper
      .open()
      .then((colorSelectionResult) => {
        const oldValue = this.value;

        this.setColor(colorSelectionResult.sRGBHex);

        if (this.value !== oldValue) {
          console.log('eye dropper-- on stop', this.value);
        }
      })
      .catch(() => {});
  }

  setColor(colorString: string) {
    const newColor = this.parseColor(colorString);

    if (newColor === null) {
      return false;
    }

    this.hue = newColor.hsva.h;
    this.saturation = newColor.hsva.s;
    this.brightness = newColor.hsva.v;
    this.alpha = this.opacity ? newColor.hsva.a * 100 : 100;

    this.syncValues();

    return true;
  }

  override firstUpdated() {
    this.setColorFromValue();
    this.updateHueHandleColor();
    this.drawCanvas();
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleOutsideClick);
  }

  override disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
    super.disconnectedCallback();
  }

  handleOutsideClick = (e: any) => {
    if (!this.shadowRoot?.contains(e.target)) {
      this.showPicker = false;
    }
  };

  togglePicker(e: Event) {
    e.stopPropagation();
    this.showPicker = !this.showPicker;
    this.updateComplete.then(() => this.drawCanvas());
  }

  drawCanvas() {
    const canvas = this.shadowRoot?.getElementById(
      'color-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    const width = canvas?.width;
    const height = canvas?.height;

    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    const whiteGrad = ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, '#fff');
    whiteGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, width, height);

    const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'transparent');
    blackGrad.addColorStop(1, '#000');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, width, height);

    // canvas handle
    ctx.beginPath();
    ctx.arc(this.handleX, this.handleY, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.handleX, this.handleY, 3, 0, 2 * Math.PI);
  }

  pickColorAt(x: number, y: number) {
    const canvas = this.shadowRoot?.getElementById(
      'color-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
      return;
    }

    const clampedX = Math.max(0, Math.min(canvas.width - 1, x));
    const clampedY = Math.max(0, Math.min(canvas.height - 1, y));

    const imageData = ctx.getImageData(clampedX, clampedY, 1, 1).data;

    const alpha = this.opacity
      ? Math.round((this.alpha / 100) * 255)
      : undefined;
    const newValue = this.rgbToHex(
      imageData[0],
      imageData[1],
      imageData[2],
      alpha
    );

    if (newValue !== this.value) {
      this.r = imageData[0];
      this.g = imageData[1];
      this.b = imageData[2];
      this.value = newValue;
      this.handleX = x;
      this.handleY = y;
      this.drawCanvas();
      this.dispatchColorChange();
    }
  }

  pickColor(e: any) {
    this.pickColorAt(e.offsetX, e.offsetY);
  }

  startDrag() {
    this.isDragging = true;
  }

  onDrag(e: any) {
    if (this.isDragging) {
      this.pickColorAt(e.offsetX, e.offsetY);
    }
  }

  stopDrag() {
    this.isDragging = false;
  }

  updateHue(e: any) {
    this.hue = e.target.value;
    this.drawCanvas();
  }

  handleHexInput(e: any) {
    this.value = e.target.value;
    if (/^#([0-9A-Fa-f]{6})$/.test(this.value)) {
      const { r, g, b } = this.hexToRgb(this.value);
      this.r = r;
      this.g = g;
      this.b = b;
    }
  }

  handleRgbChange(e: any, rgb: 'r' | 'g' | 'b') {
    this[rgb] = parseInt(e.target.value) || 0;
    this.value = this.rgbToHex(this.r, this.g, this.b);
  }

  rgbToHex(r: number, g: number, b: number, a?: number) {
    const toHex = (x: number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hex = [r, g, b].map(toHex).join('');
    if (typeof a === 'number') {
      return '#' + hex + toHex(a);
    }
    return '#' + hex;
  }

  hexToRgb(hex: string) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    const bigint = parseInt(c, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  dispatchColorChange() {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { color: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-color-picker': ColorPicker;
  }
}
