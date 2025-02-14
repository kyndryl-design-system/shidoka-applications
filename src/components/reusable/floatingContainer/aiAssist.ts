import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/ai_assist.json';
import Styles from './aiAssist.scss';

/**
 * AI Icon.
 * @fires on-start - Emits when the loader been started.
 * @fires on-stop - Emits when the loader has been stopped and all animations have completed.
 */
@customElement('kyn-ai-assist')
export class AiAssist extends LitElement {
  static override styles = Styles;

  /** Animation stopped state */
  @property({ type: Boolean })
  stopped = true;

  /** Display the loader as an overlay */
  @property({ type: Boolean })
  overlay = false;

  /** Animation loop has finished and stopped
   * @internal
   */
  @state()
  private _stopped = false;

  /** Wrapper element
   * @internal
   */
  @query('.wrapper')
  private _wrapperEl!: any;

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
      wrapper: true,
      overlay: this.overlay,
      stopped: this._stopped,
    };

    return html`
      <div class="${classMap(Classes)}">
        <div class="container"></div>
      </div>
    `;
  }

  override firstUpdated() {
    this._stopped = this.stopped;

    this._animation = lottie.loadAnimation({
      container: this._containerEl,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: animationData,
    });
    this._animation.setSpeed(1.5);

    this._animation.goToAndStop(0, true);

    // hover event to start animation on hover and stop on mouseleave
    const parentButton = this.closest('kyn-button');
    if (parentButton) {
      parentButton.addEventListener('mouseenter', () => {
        this.stopped = false;
        this._animation.play();
      });
      parentButton.addEventListener('mouseleave', () => {
        this.stopped = true;
      });
    }

    this._animation.addEventListener('loopComplete', () => {
      if (this.stopped) {
        this._animation.stop();
        this._stopped = true;
      }
    });

    this._wrapperEl.addEventListener('transitionend', () => {
      if (this._stopped) {
        this._emitStop();
      }
    });
  }

  override updated(changedProps: any) {
    if (changedProps.has('stopped')) {
      if (!this.stopped) {
        this._stopped = false;
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
    'kyn-ai-assist': AiAssist;
  }
}
