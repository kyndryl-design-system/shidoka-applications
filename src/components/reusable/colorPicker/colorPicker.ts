import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '@kyndryl-design-system/shidoka-foundation/css/typography.css';
import penIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/pen.svg';
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
  value = '#ff0000';

  /** Set to true for Opacity enabled */
  @property({ type: Boolean })
  opacity = false;

  @state()
  isDragging = false;

  @state()
  isDraggingHue = false;

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
  lightness = 100;

  @state()
  alpha = 100;

  @state()
  r = 0;

  @state()
  g = 0;

  @state()
  b = 0;

  override render() {
    const { r, g, b } = this.hexToRgba(this.value);
    this.r = r;
    this.g = g;
    this.b = b;
    const alphaValue = this.getAlphaFromHex(this.value);
    this.alpha = Math.round(alphaValue * 100);
    return html`
      <div class="field">
        <label>${this.label}</label>
        <div style="display: flex; gap:8px;">
          <div tabindex="0" class="color-picker__preview"></div>
          <input
            type="text"
            maxlength="9"
            aria-label="hex color"
            .value=${this.value.toUpperCase()}
            @input=${(e: any) => this.handleValueChange(e)}
            @click=${this.togglePicker}
          />
        </div>

        ${this.showPicker
          ? html`
              <div
                class="picker-popup"
                @click=${(e: any) => e.stopPropagation()}
                @keydown=${(e: any) => e.stopPropagation()}
              >
                <canvas
                  id="color-canvas"
                  class="canvas"
                  width="275"
                  height="180"
                  @mousedown=${this.startDrag}
                  @mousemove=${(e: any) => this.onDrag(e)}
                  @mouseup=${this.stopDrag}
                  @mouseleave=${this.stopDrag}
                  @click=${(e: any) => this.pickColor(e)}
                ></canvas>
                <div class="color-picker__controls">
                  ${hasEyeDropper
                    ? html`
                        <kyn-button
                          kind="outline"
                          type="button"
                          size="small"
                          description="Eyedropper"
                          name="eyedropper"
                          @on-click=${(e: any) => this.handleEyeDropper(e)}
                        >
                          <span slot="icon">${unsafeSVG(penIcon)}</span>
                        </kyn-button>
                      `
                    : null}
                  <div class="color-picker__sliders">
                    <div
                      class="color-picker__hue color-picker__slider"
                      @pointerdown=${this.handleHueDrag}
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
                          >
                            <div
                              class="color-picker__alpha-gradient"
                              style="background-image: linear-gradient(to right, ${this.getHexString(
                                this.hue,
                                this.saturation,
                                this.lightness,
                                0
                              )} 0%,
                          ${this.getHexString(
                                this.hue,
                                this.saturation,
                                this.lightness,
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
                  <div class="colors-content">
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
                    <div class="colors-content">
                      <div class="kd-type--body-02">R</div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        aria-label="r"
                        .value=${String(this.r)}
                        @input=${(e: any) => this.handleRgbChange(e, 'r')}
                      />
                    </div>
                    <div class="colors-content">
                      <div class="kd-type--body-02">G</div>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        aria-label="g"
                        .value=${String(this.g)}
                        @input=${(e: any) => this.handleRgbChange(e, 'g')}
                      />
                    </div>
                    <div class="colors-content">
                      <div class="kd-type--body-02">B</div>
                      <input
                        type="number"
                        min="0"
                        max="255"
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
      this.syncFromValue(newValue);
      this.updateColorPreview();
    }
  }

  handleHueDrag(event: PointerEvent) {
    event.stopPropagation();
    const container = this.shadowRoot!.querySelector<HTMLElement>(
      '.color-picker__slider.color-picker__hue'
    )!;
    const handle = container.querySelector<HTMLElement>(
      '.color-picker__slider-handle'
    )!;
    const { width, left } = container.getBoundingClientRect();

    handle.focus();
    event.preventDefault();

    const x = event.clientX - left;

    this.hue = Math.round(this.clamp((x / width) * 360, 0, 360));
    this.syncValues();
    drag(container, {
      onMove: (x) => {
        this.hue = Math.round(this.clamp((x / width) * 360, 0, 360));
        this.syncValues();
        this.updateHueHandleColor();
        this.updateCanvasAndHandle();
        this.dispatchColorChange();
        this.updateColorPreview();
      },
      onStop: () => {},
      initialEvent: event,
    });
  }

  updateColorPreview() {
    const preview = this.shadowRoot?.querySelector(
      '.color-picker__preview'
    ) as HTMLElement;
    if (preview) {
      const color = this.opacity
        ? `rgba(${this.r}, ${this.g}, ${this.b}, ${(this.alpha / 100).toFixed(
            2
          )})`
        : this.value;
      preview.style.backgroundColor = color;
    }
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
      `hsva(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${
        this.alpha / 100
      })`
    );

    console.log('Syncing values:', this.alpha);

    if (currentColor === null) {
      return;
    }

    this.value = this.opacity ? currentColor.hexa : currentColor.hex;
    await this.updateComplete;
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
      this.updateColorPreview();
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
        console.log('Alpha: drag', this.alpha);
        this.syncValues();
        this.updateHueHandleColor();
        this.updateColorPreview();
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
    lightness: number,
    alpha: number
  ) {
    const color = new TinyColor(
      `hsva(${hue}, ${saturation}%, ${lightness}%, ${alpha / 100})`
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

  async handleEyeDropper(e: Event) {
    e.preventDefault();
    if (!hasEyeDropper) {
      return;
    }
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    const parsed = this.parseColor(result.sRGBHex);
    if (parsed) {
      this.hue = parsed.hsva.h;
      this.saturation = parsed.hsva.s;
      this.lightness = parsed.hsva.v;
      const pos = this.findClosestPixelPosition(parsed.rgb);
      this.handleX = pos.x;
      this.handleY = pos.y;
      this.syncValues();
      this.updateCanvasAndHandle();
      this.updateColorPreview();
      this.dispatchColorChange();
    }
  }

  findClosestPixelPosition(targetRgb: {
    r: number;
    g: number;
    b: number;
    a?: number;
  }) {
    const canvas = this.shadowRoot?.getElementById(
      'color-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return { x: 0, y: 0 };

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx?.getImageData(0, 0, width, height).data;

    let minDiff = Number.MAX_VALUE;
    let closestX = 0;
    let closestY = 0;

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const index = (y * width + x) * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        const a = imageData[index + 3];

        const alphaDiff =
          this.opacity && targetRgb.a !== undefined
            ? Math.abs(a - targetRgb.a)
            : 0;

        const diff =
          Math.abs(r - targetRgb.r) +
          Math.abs(g - targetRgb.g) +
          Math.abs(b - targetRgb.b) +
          alphaDiff;
        if (diff < minDiff) {
          minDiff = diff;
          closestX = x;
          closestY = y;
        }
      }
    }

    return { x: closestX, y: closestY };
  }

  setColor(colorString: string) {
    const newColor = this.parseColor(colorString);
    if (!newColor) return;

    this.hue = newColor.hsva.h;
    this.saturation = newColor.hsva.s;
    this.lightness = newColor.hsva.v;
    this.alpha = this.opacity ? newColor.hsva.a * 100 : 100;
    console.log('Alpha value: setColor', this.alpha);
    const canvas = this.shadowRoot?.getElementById(
      'color-canvas'
    ) as HTMLCanvasElement;
    if (canvas) {
      this.handleX = (this.saturation / 100) * canvas.width;
      this.handleY = canvas.height - (this.lightness / 100) * canvas.height;
    }
    this.syncValues();
    this.updateCanvasAndHandle();
    return true;
  }

  syncFromValue(colorString: string) {
    const parsedColor = this.parseColor(colorString);
    if (parsedColor) {
      this.hue = parsedColor.hsva.h;
      this.saturation = parsedColor.hsva.s;
      this.lightness = parsedColor.hsva.v;
      this.alpha = this.opacity ? parsedColor.hsva.a * 100 : 100;
      if (this.opacity) {
        const pos = this.findClosestPixelPosition({
          r: this.r,
          g: this.g,
          b: this.b,
        });
        this.handleX = pos.x;
        this.handleY = pos.y;
      } else {
        this.handleX = (this.saturation / 100) * 275;
        this.handleY = 180 - (this.lightness / 100) * 180;
      }
      this.updateCanvasAndHandle();
      this.requestUpdate();
    }
  }

  override firstUpdated() {
    this.updateColorPreview();
    this.updateHueHandleColor();
    this.syncFromValue(this.value);
    this.drawCanvas();
    this.handleX = (this.saturation / 100) * 275;
    this.handleY = 180 - (this.lightness / 100) * 180;

    // Update the handle position style
    const handle = this.shadowRoot?.querySelector(
      '.canvas__handle'
    ) as HTMLElement;
    if (handle) {
      handle.style.left = `${this.handleX}px`;
      handle.style.top = `${this.handleY}px`;
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('showPicker') && this.showPicker) {
      this.updateCanvasAndHandle();
    }
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
    this.updateComplete.then(() => this.updateCanvasAndHandle());
  }

  drawCanvas() {
    const canvas = this.shadowRoot?.getElementById(
      'color-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    const width = canvas?.width;
    const height = canvas?.height;

    if (!ctx || !width || !height) {
      return;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    const whiteGrad = ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, width, height);

    const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, width, height);
  }

  drawHandle() {
    const canvas = this.shadowRoot?.getElementById(
      'color-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(this.handleX, this.handleY, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
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

    const imageData = ctx?.getImageData(clampedX, clampedY, 1, 1).data;
    this.saturation = this.clamp((x / canvas.width) * 100, 0, 100);
    this.lightness = this.clamp(100 - (y / canvas.height) * 100, 0, 100);
    const alphaValue = this.opacity
      ? Math.round((this.alpha / 100) * 255)
      : 255;
    const newValue = this.rgbToHex(
      imageData[0],
      imageData[1],
      imageData[2],
      alphaValue
    );
    if (newValue !== this.value) {
      this.r = imageData[0];
      this.g = imageData[1];
      this.b = imageData[2];
      this.handleX = x;
      this.handleY = y;
      this.value = newValue;
      this.updateCanvasAndHandle();
      this.dispatchColorChange();
    }
  }

  pickColor(e: any) {
    this.pickColorAt(e.offsetX, e.offsetY);
    this.updateColorPreview();
  }

  startDrag() {
    this.isDragging = true;
  }

  onDrag(e: any) {
    if (this.isDragging) {
      this.pickColorAt(e.offsetX, e.offsetY);
      this.updateColorPreview();
    }
  }

  stopDrag() {
    this.isDragging = false;
  }

  // updateHue(e: any) {
  //   this.hue = e.target.value;
  //   this.updateCanvasAndHandle();
  // }

  handleHexInput(e: any) {
    this.value = e.target.value;
    if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(this.value)) {
      const { r, g, b, a } = this.hexToRgba(this.value);
      this.r = r;
      this.g = g;
      this.b = b;
      if (this.opacity && a !== undefined) {
        this.alpha = (a / 255) * 100;
      }
    }
  }

  handleRgbChange(e: any, rgb: 'r' | 'g' | 'b') {
    if (
      parseInt(e.target.value) <= 255 &&
      parseInt(e.target.value) >= 0 &&
      e.target.value.length <= 3
    ) {
      this[rgb] = parseInt(e.target.value) || 0;
      this.value = this.rgbToHex(this.r, this.g, this.b, 255);
    }
  }

  rgbToHex(r: number, g: number, b: number, a: number) {
    const toHex = (x: number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hex = [r, g, b].map(toHex).join('');
    if (this.opacity) {
      const alphaHex = toHex(a);
      return '#' + hex + alphaHex; // include alpha in hex
    }

    return '#' + hex;
  }

  hexToRgba(hex: string) {
    let c = hex.replace('#', '');
    if (c.length === 6) c += 'ff'; // default to fully opaque if no alpha provided

    const bigint = parseInt(c, 16);

    return {
      r: (bigint >> 24) & 255,
      g: (bigint >> 16) & 255,
      b: (bigint >> 8) & 255,
      a: bigint & 255,
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

  private updateCanvasAndHandle() {
    this.drawCanvas();
    this.drawHandle();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-color-picker': ColorPicker;
  }
}
