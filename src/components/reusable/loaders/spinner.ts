import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import lottie from 'lottie-web';

import InlineStyles from './inline.scss?inline';
import AiStyles from './aiLoader.scss?inline';

import animationData from './json/indeterminate.json';
import successIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark-filled.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-filled.svg';

type SpinnerVariant = 'ai' | 'inline';
type SpinnerSize = 'default' | 'mini';

/**
 * Spinner component
 *
 * - tag: <kyn-spinner>
 * - variant: 'ai' (CSS/SVG spinner) or 'inline' (lottie indeterminate animation)
 * - status: for inline variant -> 'active' | 'inactive' | 'success' | 'error'
 * - size: for ai variant -> 'default' | 'mini'
 *
 * Colors can be set via properties: primaryColor, secondaryColor, trackColor
 * which set CSS variables on the host (--loader-primary, --loader-secondary, --loader-track).
 */
@customElement('kyn-spinner')
export class KynSpinner extends LitElement {
  static override styles = [unsafeCSS(InlineStyles), unsafeCSS(AiStyles)];

  /** Which variant to render: 'ai' | 'inline' */
  @property({ type: String })
  accessor variant: SpinnerVariant = 'ai';

  /** Inline spinner status. Can be `active`, `inactive`, `success`, `error`. */
  @property({ type: String })
  accessor status = 'active';

  /** Size for AI spinner */
  @property({ type: String })
  accessor size: SpinnerSize = 'default';

  /** Primary color for spinner (CSS color string). Sets --loader-primary on host. */
  @property({ type: String })
  accessor primaryColor: string | undefined = undefined;

  /** Secondary color (e.g., arc color). Sets --loader-secondary on host. */
  @property({ type: String })
  accessor secondaryColor: string | undefined = undefined;

  /** Track/backdrop color for SVG track. Sets --loader-track on host. */
  @property({ type: String })
  accessor trackColor: string | undefined = undefined;

  /** Inline spinner internal states */
  @state()
  private accessor _stopped = false;

  @state()
  private accessor _hidden = false;

  @query('.container')
  private accessor _containerEl!: any;

  override connectedCallback() {
    super.connectedCallback();
    this._syncCssVars();
  }

  override updated(changedProps: any) {
    if (
      changedProps.has('primaryColor') ||
      changedProps.has('secondaryColor') ||
      changedProps.has('trackColor')
    ) {
      this._syncCssVars();
    }

    if (changedProps.has('status') && this.variant === 'inline') {
      this._stopped = this.status !== 'active';
      this._hidden = this._stopped;
      if (this.status === 'active') {
        this._emitStart();
      } else {
        this._stopped = true;
      }
    }
  }

  override render() {
    if (this.variant === 'inline') {
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

    const Classes = {
      wrapper: true,
      'ai-connected': true,
      [`size-${this.size}`]: true,
    };

    return html`
      <div
        class="${classMap(Classes)}"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div class="ai-spinner-svg" aria-hidden="true">
          <svg viewBox="0 0 100 100" class="ai-svg">
            <circle class="ai-track" cx="50" cy="50" r="44" />
            <circle class="ai-arc" cx="50" cy="50" r="44" />
          </svg>
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    if (this.variant === 'inline') {
      this._stopped = this.status !== 'active';
      this._hidden = this._stopped;

      try {
        lottie.loadAnimation({
          container: this._containerEl,
          renderer: 'svg',
          loop: true,
          autoplay: this.status === 'active',
          animationData: animationData,
        });
      } catch (err) {
        // lottie init errors
      }

      this._containerEl?.addEventListener('transitionend', () => {
        if (this._stopped) {
          this._hidden = true;
          this._emitStop();
        }
      });
    }
  }

  private _syncCssVars() {
    if (this.primaryColor) {
      this.style.setProperty('--loader-primary', this.primaryColor);
    }
    if (this.secondaryColor) {
      this.style.setProperty('--loader-secondary', this.secondaryColor);
    }
    if (this.trackColor) {
      this.style.setProperty('--loader-track', this.trackColor);
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
    'kyn-spinner': KynSpinner;
  }
}
