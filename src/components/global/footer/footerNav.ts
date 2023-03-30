import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { debounce } from '../../../common/helpers/helpers';
import FooterNavScss from './footerNav.scss';

/**
 * Container for footer navigation links.
 * @slot unnamed - This element has a slot.
 */
@customElement('kyn-footer-nav')
export class FooterNav extends LitElement {
  static override styles = FooterNavScss;
  
  /**
   * Determines screen breakpoint.
   * @ignore
   */
  @state()
  breakpointHit = false;

  override render() {
    const footerNavClasses = {'footer-nav': true}
    return html`
      <div class=${classMap(footerNavClasses)}>
        <slot></slot>
      </div> `;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.testBreakpoint();
    window?.addEventListener(
      'resize',
      debounce(() => {
        this.testBreakpoint();
      })
    );
  }

  private testBreakpoint() {
    const nav = querySelectorDeep('kyn-footer');
    if (nav) {
      this.breakpointHit = nav!.breakpointHit;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-footer-nav': FooterNav;
  }
}
