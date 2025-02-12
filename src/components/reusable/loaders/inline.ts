import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';
import animationData from './json/indeterminate.json';
import Styles from './inline.scss';
import successIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

/**
 * Inline Loader.
 * @fires on-start - Emits when the loader been started.
 * @fires on-stop - Emits when the loader has been stopped and all animations have completed.
 * @slot unnamed - Slot for text/description.
 */
@customElement('kyn-loader-inline')
export class LoaderInline extends LitElement {
  static override styles = Styles;

  /** Status. Can be `active`, `inactive`, `success`, `error`. */
  @property({ type: String })
  status = 'active';

  /** Animation loop has finished and stopped
   * @internal
   */
  @state()
  private _stopped = false;

  // /** Wrapper element
  //  * @internal
  //  */
  // @query('.wrapper')
  // private _wrapperEl!: any;

  /** Hidden state
   * @internal
   */
  @state()
  private _hidden = false;

  /** Animation container element
   * @internal
   */
  @query('.container')
  private _containerEl!: any;

  // /** Animation instance
  //  * @internal
  //  */
  // @state()
  // private _animation!: any;

  override render() {
    const Classes = {
      wrapper: true,
      stopped: this._stopped,
      hidden: this._hidden,
      'status-success': this.status === 'success',
      'status-error': this.status === 'error',
    };

    return html`
      <div class="${classMap(Classes)}">
        <div class="container"></div>

        <span class="status-icon success">${unsafeSVG(successIcon)}</span>

        <span class="status-icon error">${unsafeSVG(errorIcon)}</span>

        <slot></slot>
      </div>
    `;
  }

  override firstUpdated() {
    // sync internal states
    this._stopped = this.status !== 'active';
    this._hidden = this._stopped;

    // initialize the animation
    lottie.loadAnimation({
      container: this._containerEl, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    // stop the animation at the end of the loop
    // this._animation.addEventListener('loopComplete', () => {
    //   if (this.status !== 'active') {
    //     this._animation.stop();
    //     this._stopped = true;
    //   }
    // });

    // hide the wrapper element after stopped and transitionend
    this._containerEl.addEventListener('transitionend', () => {
      if (this._stopped) {
        this._hidden = true;
        this._emitStop();
      }
    });
  }

  override updated(changedProps: any) {
    if (changedProps.has('status')) {
      // play the animation if stopped prop changes to false
      if (this.status === 'active') {
        // this._animation.play();
        this._stopped = false;
        this._hidden = false;
        this._emitStart();
      } else {
        // this._animation.pause();
        this._stopped = true;
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
    'kyn-loader-inline': LoaderInline;
  }
}
