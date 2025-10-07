import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import CardScss from './card.scss?inline';
import InfoCardScss from './infoCard.scss?inline';

type CardType = 'normal' | 'clickable';
type CardTarget = '_self' | '_blank' | '_parent' | '_top';
type CardVariant = 'default' | 'notification' | 'interaction';

import '../inlineConfirm/inlineConfirm';

/**
 * Card.
 * @fires on-card-click - Captures the click event of clickable card and emits the original event details. Use `e.stopPropagation()` / `e.preventDefault()` for any internal clickable elements when card type is `'clickable'` to stop bubbling / prevent event. `detail:{ origEvent: PointerEvent }`
 * @slot unnamed - Slot for card contents.
 * @slot leftIcon - Slot for left icon when `variant` is `'notification'`.
 * @slot inlineConfirm - Slot for right icon when `variant` is `'notification'`.
 * @part card-wrapper - The wrapper element of the card. Use this part to customize its styles such as padding . Ex: kyn-card::part(card-wrapper)
 */
@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = [unsafeCSS(CardScss), unsafeCSS(InfoCardScss)];

  /** Card Type. `'normal'` & `'clickable'` */
  @property({ type: String })
  accessor type: CardType = 'normal';

  /** Card link url for clickable cards. */
  @property({ type: String })
  accessor href = '';

  /** Use for Card type `'clickable'`. Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship. */
  @property({ type: String })
  accessor rel = '';

  /** Defines a target attribute for where to load the URL in case of clickable card. Possible options include `'_self'` (default), `'_blank'`, `'_parent'`, `'_top'` */
  @property({ type: String })
  accessor target: CardTarget = '_self';

  /** Hide card border. Useful when clickable card use inside `<kyn-notification>` component. */
  @property({ type: Boolean })
  accessor hideBorder = false;

  /** AI theme toggle */
  @property({ type: Boolean })
  accessor aiConnected = false;

  /** Set this to `true` for highlight */
  @property({ type: Boolean })
  accessor highlight = false;

  /** Card variant. `'default'`, `'notification'`, `'interaction'`
   * * `'notification'` variant is used primarily for Info Card
   * and contains additional padding, per design specs.
   * * `'interaction'` variant is used for AI response
  
   */
  @property({ type: String, reflect: true })
  accessor variant: CardVariant = 'default';

  override render() {
    const baseClasses = {
      'card-wrapper': this.type !== 'clickable',
      'card-wrapper-clickable': this.type === 'clickable',
      'card-border': !this.hideBorder && !this.aiConnected && !this.highlight,
      'hide-border': this.hideBorder,
      'ai-connected': this.aiConnected,
      'card-highlight': this.highlight,
      'ai-highlight': this.aiConnected && this.highlight,
      'variant-notification': this.variant === 'notification',
      'variant-interaction': this.variant === 'interaction',
    };

    const isAnchor = this.type === 'clickable' && this.href !== '';

    if (this.variant.indexOf('default') === -1) {
      return this.renderNonDefaultVariant(baseClasses);
    }

    return isAnchor
      ? html`
          <a
            part="card-wrapper"
            class=${classMap(baseClasses)}
            data-variant=${this.variant}
            data-ai=${String(this.aiConnected)}
            href=${this.href || '#'}
            target=${this.target}
            rel=${this._computedRel}
            @click=${this._onClick}
          >
            <slot></slot>
          </a>
        `
      : html`
          <div
            part="card-wrapper"
            class=${classMap(baseClasses)}
            data-variant=${this.variant}
            data-ai=${String(this.aiConnected)}
            role=${ifDefined(this.type === 'clickable' ? 'link' : undefined)}
            tabindex=${ifDefined(this.type === 'clickable' ? 0 : undefined)}
            @click=${this.type === 'clickable' ? this._onClick : null}
            @keydown=${this.type === 'clickable' ? this._onKeydown : null}
          >
            <slot></slot>
          </div>
        `;
  }

  private renderNonDefaultVariant(baseClasses: Record<string, boolean>) {
    return html`
      <div
        part="card-wrapper"
        class=${classMap(baseClasses)}
        data-variant=${this.variant}
        data-ai=${String(this.aiConnected)}
      >
        <div class="info-card-container">
          <div class="info-card-leftIcon">
            <slot name="leftIcon"></slot>
          </div>
          <div class="info-card-content-wrapper"><slot></slot></div>
          <div class="info-card-rightIcon">
            <slot name="inlineConfirm"></slot>
          </div>
        </div>
      </div>
    `;
  }

  private get _computedRel(): string {
    if (this.target === '_blank' && (!this.rel || this.rel.trim() === '')) {
      return 'noopener noreferrer';
    }
    return this.rel;
  }

  private _onClick = (e: Event) => {
    if (!this.href) e.preventDefault();
    const ev = new CustomEvent('on-card-click', {
      detail: { origEvent: e },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (!this.dispatchEvent(ev) || ev.defaultPrevented) e.preventDefault();
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onClick(e);
    }
  };

  private _forwardConfirm = (e: Event) => {
    if ((e.target as HTMLElement) === this) return;
    const detail = (e as CustomEvent)?.detail;
    const ev = new CustomEvent('on-confirm', {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(ev);
  };

  override connectedCallback() {
    super.connectedCallback();
    if (this.variant === 'default' && this.classList.contains('info-card')) {
      this.variant = 'notification';
    }
    this.addEventListener('on-confirm', this._forwardConfirm as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'on-confirm',
      this._forwardConfirm as EventListener
    );
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
