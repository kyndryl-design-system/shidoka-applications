import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import CardScss from './card.scss?inline';

/**
 * Card.
 * @fires on-card-click - Captures the click event of clickable card and emits the original event details. Use `e.stopPropogation()` / `e.preventDefault()` for any internal clickable elements when card type is `'clickable'` to stop bubbling / prevent event. `detail:{ origEvent: PointerEvent }`
 * @slot unnamed - Slot for card contents.
 * @part card-wrapper - The wrapper element of the card. Use this part to customize its styles such as padding . Ex: kyn-card::part(card-wrapper)
 */
@customElement('kyn-card')
export class Card extends LitElement {
  static override styles = unsafeCSS(CardScss);

  /** Card Type. `'normal'` & `'clickable'` */
  @property({ type: String }) accessor type = 'normal';

  /** Card link url for clickable cards. */
  @property({ type: String })
  accessor href = '';

  /** Use for Card type `'clickable'`. Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship. */
  @property({ type: String })
  accessor rel = '';

  /** Defines a target attribute for where to load the URL in case of clickable card. Possible options include `'_self'` (deafult), `'_blank'`, `'_parent`', `'_top'` */
  @property({ type: String })
  accessor target: any = '_self';

  /** Hide card border. Useful when clickable card use inside `<kyn-notification>` component. */
  @property({ type: Boolean })
  accessor hideBorder = false;

  /** AI theme toggle */
  @property({ type: Boolean })
  accessor aiConnected = false;

  /** Set this to `true` for highlight */
  @property({ type: Boolean })
  accessor highlight = false;

  @state()
  private accessor _hover = false;

  override render() {
    const clickable = {
      'card-wrapper-clickable': true,
      'card-border':
        this.hideBorder === false && !this.aiConnected && !this.highlight,
      'ai-connected': this.aiConnected,
      'card-highlight': this.highlight,
      'ai-highlight': this.aiConnected && this.highlight,
      'is-hover': this._hover,
    };

    const cardWrapperDefaultClasses = {
      'card-wrapper': true,
      'ai-connected': this.aiConnected,
      'card-highlight': this.highlight,
      'ai-highlight': this.aiConnected && this.highlight,
      'card-border':
        this.hideBorder === false && !this.aiConnected && !this.highlight,
      'is-hover': this._hover,
    };

    return this.type === 'clickable'
      ? html`
          <a
            part="card-wrapper"
            class="${classMap(clickable)}"
            href=${this.href}
            target=${this.target}
            rel=${this.rel}
            @pointerenter=${this._onEnter}
            @pointerleave=${this._onLeave}
            @click=${(e: Event) => this.handleClick(e)}
          >
            <slot></slot>
          </a>
        `
      : html`
          <div
            part="card-wrapper"
            class="${classMap(cardWrapperDefaultClasses)}"
            @pointerenter=${this._onEnter}
            @pointerleave=${this._onLeave}
          >
            <slot></slot>
          </div>
        `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._hover = false;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('aiConnected') || changed.has('highlight')) {
      this._hover = false;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hover = false;
  }

  private _onEnter = () => {
    this._hover = true;
  };
  private _onLeave = () => {
    this._hover = false;
  };

  private handleClick(e: Event) {
    const event = new CustomEvent('on-card-click', {
      detail: { origEvent: e },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (!this.dispatchEvent(event) || event.defaultPrevented)
      e.preventDefault();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-card': Card;
  }
}
