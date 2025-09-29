import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import CardScss from './card.scss?inline';
import { ifDefined } from 'lit/directives/if-defined.js';

type CardType = 'normal' | 'clickable';
type CardTarget = '_self' | '_blank' | '_parent' | '_top';
type CardVariant = 'default' | 'info';

/**
 * Card.
 * @fires on-card-click - Captures the click event of clickable card and emits the original event details. Use `e.stopPropagation()` / `e.preventDefault()` for any internal clickable elements when card type is `'clickable'` to stop bubbling / prevent event. `detail:{ origEvent: PointerEvent }`
 * @slot unnamed - Slot for card contents.
 * @part card-wrapper - The wrapper element of the card. Use this part to customize its styles such as padding . Ex: kyn-card::part(card-wrapper)
 */
@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = unsafeCSS(CardScss);

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

  @property({ type: String })
  accessor variant: CardVariant = 'default';

  override render() {
    const baseClasses = {
      'card-wrapper': this.type !== 'clickable',
      'card-wrapper-clickable': this.type === 'clickable',
      'card-border': !this.hideBorder && !this.aiConnected && !this.highlight,
      'ai-connected': this.aiConnected,
      'card-highlight': this.highlight,
      'ai-highlight': this.aiConnected && this.highlight,
      'variant-info': this.variant === 'info',
    };

    const isAnchor = this.type === 'clickable' && this.href !== '';

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

  private get _computedRel(): string {
    if (this.target === '_blank' && (!this.rel || this.rel.trim() === '')) {
      return 'noopener noreferrer';
    }
    return this.rel;
  }

  private _onClick = (e: Event) => {
    if (!this.href) e.preventDefault(); // stay put when href is empty
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

  // shim to ensure backwards compatibility with old `info-card` class
  override connectedCallback() {
    super.connectedCallback();
    if (this.variant === 'default' && this.classList.contains('info-card')) {
      this.variant = 'info';
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
