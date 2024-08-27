import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import ProgressBarStyles from './kyn-progress-bar-wb.scss';

/**
 * Progress Bar component.
 */
@customElement('kyn-progress-bar-wb')
export class KynProgressBarWb extends LitElement {
  static override styles = [ProgressBarStyles];

  /**
   * Percent -- numeric value to be converted to string percentage
   */
  @property({ type: Number })
  progress = 0;

  /**
   * Progress bar size. `'auto'`, `'md'`, or `'lg'`.
   */
  @property({ type: String })
  size = 'auto';

  /**
   * Progress bar animation speed. `'default'`, `'slow'`, or `'fast'`.
   */
  @property({ type: String })
  animationSpeed = 'default';

  /**
   * Progress bar animated status color
   */
  @property({ type: String })
  progressBarThemeColor = 'spruce';

  /**
   * Main progress bar title header, required.
   */
  @property({ type: String })
  mainHeader = '';

  /**
   * Progress bar subheader, optional.
   */
  @property({ type: String })
  subheader = '';

  /** Progress bar element
   * @internal
   */
  @query('#progress-bar')
  _progressBar!: HTMLDivElement;

  /** Progress bar fill level
   * @internal
   */
  @state()
  _progressBarFillLevel = 'light';

  /** Increasing status % value for animation -- separation of concerns
   * @internal
   */
  @state()
  private _currentProgress = 0;

  override render() {
    const styles = {
      width: `${this._currentProgress}%`,
      transition: 'width 0.3s ease-out',
      'border-top-right-radius': `${this.progress === 100 ? '3px' : '0'}`,
      'border-bottom-right-radius': `${this.progress === 100 ? '3px' : '0'}`,
    };

    return html`
      <div id="progress-bar" class=${this.size}>
        <div id="progress-bar-header">${this.mainHeader}</div>
        <div class="status-bar">
          <div
            class=${`theme-${this.progressBarThemeColor} status-bar-fill fill-${
              this.progress > 100 ? 'full' : this._progressBarFillLevel
            }`}
            style=${styleMap(styles)}
          ></div>
        </div>
        <div id="progress-bar-subheader" ?hidden=${!this.subheader}>
          ${this.subheader}
        </div>
      </div>
    `;
  }

  override willUpdate(changedProperties: Map<string, any>) {
    super.willUpdate(changedProperties);
    this._progressBarFillLevel =
      this.progress > 75 ? 'full' : this.progress > 50 ? 'med' : 'light';

    // limit the progress to a maximum of 100(%) to prevent overflow
    if (this.progress > 100) {
      this.progress = 100;
    }

    if (changedProperties.has('progress')) {
      this.animateProgress();
    }
  }

  private animateProgress() {
    const durationMap: { [key: string]: number } = {
      slow: 2000,
      fast: 500,
      default: 1000,
    };
    const duration = durationMap[this.animationSpeed] || durationMap.default;
    const start = this._currentProgress;
    const end = this.progress;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsedTime = time - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      this._currentProgress = start + (end - start) * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this._currentProgress = end;
      }
      this.requestUpdate();
    };

    // creates smooth, progressive web animation
    requestAnimationFrame(animate);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-progress-bar-wb': KynProgressBarWb;
  }
}
