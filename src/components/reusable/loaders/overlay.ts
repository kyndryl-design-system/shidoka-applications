import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/preload.json';
import Styles from './overlay.scss';

/**
 * Loader.
 */
@customElement('kyn-loader-overlay')
export class LoaderOverlay extends LitElement {
  static override styles = Styles;

  /** Animation stopped state */
  @property({ type: Boolean })
  stopped = false;

  /** Animation loop has finished and stopped
   * @internal
   */
  @state()
  private _stopped = false;

  /** Overlay element
   * @internal
   */
  @query('.overlay')
  private _overlayEl!: any;

  /** Overlay hidden state
   * @internal
   */
  @state()
  private _hidden = false;

  /** Animation container element
   * @internal
   */
  @query('.container')
  private _containerEl!: any;

  /** Animation instance
   * @internal
   */
  @state()
  private _animation!: any;

  override render() {
    const Classes = {
      overlay: true,
      stopped: this._stopped,
      hidden: this._hidden,
    };

    return html`
      <div class="${classMap(Classes)}">
        <div class="container"></div>
      </div>
    `;
  }

  override firstUpdated() {
    // sync internal states
    this._stopped = this.stopped;
    this._hidden = this.stopped;

    // initialize the animation
    this._animation = lottie.loadAnimation({
      name: 'overlay',
      container: this._containerEl, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: animationData,
    });

    // stop the animation at the end of the loop
    this._animation.addEventListener('loopComplete', () => {
      if (this.stopped) {
        this._animation.stop();
        this._stopped = true;
      }
    });

    // hide the overlay element after stopped and transitionend
    this._overlayEl.addEventListener('transitionend', () => {
      if (this._stopped) {
        this._hidden = true;
      }
    });
  }

  override updated(changedProps: any) {
    if (changedProps.has('stopped')) {
      // play the animation if stopped prop changes to false
      if (!this.stopped) {
        this._animation.play();
        this._stopped = false;
        this._hidden = false;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-loader-overlay': LoaderOverlay;
  }
}
