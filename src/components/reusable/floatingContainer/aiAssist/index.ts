import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/ai_assist.json';
import aiAssistDisabled from './json/ai_assist_disabled.json';
import Styles from './aiAssist.scss';

/**
 * AI Icon.
 * @fires on-start - Emits when the loader been started.
 * @fires on-stop - Emits when the loader has been stopped and all animations have completed.
 */
@customElement('kyn-ai-assist')
export class AiAssist extends LitElement {
  static override styles = Styles;

  /** Animation stopped state. */
  @property({ type: Boolean })
  stopped = true;

  /** Display the loader as an overlay. */
  @property({ type: Boolean })
  overlay = false;

  /** Whether the button is disabled. */
  @property({ type: Boolean })
  disabled = false;

  /** Animation loop has finished and stopped.
   * @internal
   */
  @state()
  private _stopped = false;

  /** Animation container element.
   * @internal
   */
  @query('.container')
  private _containerEl!: any;

  /** Instance of animation.
   * @internal
   */
  @state()
  private _animation!: any;

  override render() {
    const Classes = {
      'ai-launch-button': true,
      overlay: this.overlay,
      stopped: this._stopped,
      disabled: this.disabled,
    };

    return html`
      <button
        type="button"
        class="${classMap(Classes)}"
        aria-label="AI Assistant"
        tabindex="0"
        ?disabled="${this.disabled}"
      >
        <div class="container"></div>
      </button>
    `;
  }

  override firstUpdated() {
    this._stopped = this.stopped;

    this._animation = lottie.loadAnimation({
      container: this._containerEl,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: this.disabled ? aiAssistDisabled : animationData,
    });
    this._animation.setSpeed(2);

    this._animation.goToAndStop(0, true);

    // hover event to start animation on hover and stop on mouseleave
    const button = this.shadowRoot?.querySelector('button');
    if (button) {
      button.addEventListener('mouseenter', () => {
        this.stopped = false;
        this._animation.play();
      });
      button.addEventListener('mouseleave', () => {
        this.stopped = true;
      });
    }

    this._animation.addEventListener('loopComplete', () => {
      if (this.stopped) {
        this._animation.stop();
        this._stopped = true;
      }
    });

    button?.addEventListener('transitionend', () => {
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

    if (changedProps.has('disabled')) {
      this._animation.destroy();
      this._animation = lottie.loadAnimation({
        container: this._containerEl,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: this.disabled ? aiAssistDisabled : animationData,
      });
      this._animation.setSpeed(1.5);
      this._animation.goToAndStop(0, true);
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
