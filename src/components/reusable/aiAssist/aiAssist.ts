import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/ai_assist.json';
import aiAssistDisabled from './json/ai_assist_disabled.json';
import Styles from './aiAssist.scss';

/**
 * AI Assistant Launch Button.
 * @fires on-start - Emits when the animation been started.
 * @fires on-stop - Emits when the animation has been stopped and all animations have completed.
 */
@customElement('kyn-ai-assist')
export class AiAssist extends LitElement {
  static override styles = Styles;

  /** Display the animated icon as an overlay. */
  @property({ type: Boolean })
  overlay = false;

  /** Whether the button is disabled. */
  @property({ type: Boolean })
  disabled = false;

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
    this._animation = lottie.loadAnimation({
      container: this._containerEl,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: this.disabled ? aiAssistDisabled : animationData,
    });
    this._animation.setSpeed(2);

    this._animation.goToAndStop(0, true);

    const button = this.shadowRoot?.querySelector('button');
    if (button) {
      button.addEventListener('mouseenter', () => {
        if (!this.disabled) {
          this._animation.goToAndStop(0, true);
          this._animation.setDirection(1);
          this._animation.play();
          this._emitStart();
        }
      });
      button.addEventListener('mouseleave', () => {
        const slowdownInterval = setInterval(() => {
          const newSpeed = this._animation.playSpeed - 0.3;
          if (newSpeed <= 0.1) {
            clearInterval(slowdownInterval);
            this._animation.stop();
            this._animation.goToAndStop(0, true);
            this._animation.setSpeed(2);
            this._emitStop();
          } else {
            this._animation.setSpeed(newSpeed);
          }
        }, 100);
      });
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('disabled')) {
      this._animation.destroy();
      this._animation = lottie.loadAnimation({
        container: this._containerEl,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: this.disabled ? aiAssistDisabled : animationData,
      });
      this._animation.setSpeed(2);
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
