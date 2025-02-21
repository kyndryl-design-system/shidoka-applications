import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/ai_assist.json';
import aiLaunchButtonDisabled from './json/ai_assist_disabled.json';
import Styles from './aiLaunchButton.scss';

/**
 * AI Assistant Launch Button.
 * @fires on-click - Emits when the button is clicked.
 */
@customElement('kyn-ai-assist')
export class AILaunchButton extends LitElement {
  static override styles = Styles;

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

  /** Whether to stop at next loop completion
   * @internal
   */
  @state()
  private _shouldStop = false;

  override render() {
    const Classes = {
      'ai-launch-button': true,
      disabled: this.disabled,
    };

    return html`
      <button
        type="button"
        class="${classMap(Classes)}"
        aria-label="AI Assistant"
        ?disabled="${this.disabled}"
        @click=${() => this._emitClick()}
        @mouseenter=${() => this._startHoverAnimation()}
        @mouseleave=${() => this._stopHoverAnimation()}
      >
        <div class="container"></div>
      </button>
    `;
  }

  override firstUpdated() {
    this._initAnimation();
  }

  /// loop the animation on mouseenter. on mouseleave, complete the current loop and then stop.
  private _initAnimation() {
    this._animation = lottie.loadAnimation({
      container: this._containerEl,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: this.disabled ? aiLaunchButtonDisabled : animationData,
    });
    this._animation.setSpeed(2);
    this._animation.goToAndStop(0, true);

    this._animation.addEventListener('loopComplete', () => {
      if (this._shouldStop) {
        this._animation.goToAndStop(0, true);
        this._shouldStop = false;
      }
    });
  }

  private _startHoverAnimation() {
    if (!this.disabled) {
      this._shouldStop = false;
      this._animation.goToAndStop(0, true);
      this._animation.setDirection(1);
      this._animation.play();
    }
  }

  private _stopHoverAnimation() {
    if (!this.disabled) {
      this._shouldStop = true;
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('disabled')) {
      this._animation.destroy();
      this._initAnimation();
    }
  }

  private _emitClick() {
    if (!this.disabled) {
      const event = new CustomEvent('on-click');
      this.dispatchEvent(event);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-assist': AILaunchButton;
  }
}
