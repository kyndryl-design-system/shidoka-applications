import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import FooterLinkScss from './footerLink.scss';
import '../../reusable/icon/icon';

/**
 * Component for navigation links within the Footer.
 * @fires on-click - Captures the click event and emits the original event details.
 */
@customElement('kyn-footer-link')
export class FooterNavLink extends LitElement {
  static override styles = FooterLinkScss;

  /** Adds a 1px divider between footer nav links. */
  @property({ type: Boolean })
  divider = false;

  /** Link url. */
  @property({ type: String })
  href = '';

  override render() {
    const classes = {
      'footer-link': true,
      divider: this.divider,
    };
  
    return html`
      <span class=${classMap(classes)}>
        <a
          href=${this.href ? this.href : 'javascript:void(0)'}
          @click=${(e: Event) => this.handleClick(e)}
        >
        <slot></slot>
        </a>
      </span>
    `;
  }

  private handleClick(e: Event) {
    const event = new CustomEvent('on-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-footer-link': FooterNavLink;
  }
}
