import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/loader.json';
import Styles from './loader.scss?inline';

/**
 * Loader.
 * @fires on-start - Emits when the loader been started.
 * @fires on-stop - Emits when the loader has been stopped and all animations have completed.
 */
@customElement('kyn-loader')
export class Loader extends LitElement {
  static override styles = unsafeCSS(Styles);

  /** Animation stopped state */
  @property({ type: Boolean })
  accessor stopped = false;

  /** Display the loader as an overlay */
  @property({ type: Boolean })
  accessor overlay = false;

  /** Animation loop has finished and stopped
   * @internal
   */
  @state()
  private accessor _stopped = false;

  /** Wrapper element
   * @internal
   */
  @query('.wrapper')
  private accessor _wrapperEl!: any;

  /** Hidden state
   * @internal
   */
  @state()
  private accessor _hidden = false;

  /** Animation container element
   * @internal
   */
  @query('.container')
  private accessor _containerEl!: any;

  /** Animation instance
   * @internal
   */
  @state()
  private accessor _animation!: any;

  override render() {
    const Classes = {
      wrapper: true,
      overlay: this.overlay,
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

    // hide the wrapper element and emit an event after stopped and transitionend
    this._wrapperEl.addEventListener('transitionend', () => {
      if (this._stopped) {
        this._hidden = true;
        this._emitStop();
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
        this._emitStart();
      }
    }
  }

  private _emitStart() {
    const event = new CustomEvent('on-start');
    this.dispatchEvent(event);
  }

  private _emitStop() {
    const event = new CustomEvent('on-stop');
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-loader': Loader;
  }
}
