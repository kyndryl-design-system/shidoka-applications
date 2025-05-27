import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { LINK_TYPES, LINK_TARGETS } from './defs';

import LinkStyles from './link.scss';

/**
 * Component for navigation links.
 * @fires on-click - Captures the click event and emits the original event details.
 * @slot unnamed - Slot for link text.
 * @slot icon - Slot for an icon.
 */

@customElement('kyn-link')
export class Link extends LitElement {
  static override styles = [LinkStyles];

  /** Link url. */
  @property({ type: String })
  href = '';

  /** Defines a target attribute for where to load the URL. Possible options include "_self" (default), "_blank", "_parent", "_top" */
  @property({ type: String })
  target: LINK_TARGETS = LINK_TARGETS.SELF;

  /** The Link type. Primary(App) or Secondary(Web).*/
  @property({ type: String })
  kind: LINK_TYPES = LINK_TYPES.PRIMARY;

  /** Defines a relationship between a linked resource and the document. An empty string (default) means no particular relationship */
  @property({ type: String })
  rel = '';

  /** Determines if the link is disabled.*/
  // Reference for disabled links:
  // https://www.scottohara.me/blog/2021/05/28/disabled-links.html
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Whether you want the standalone Link. By default false. Use this prop. (true) with icon with link variant. */
  @property({ type: Boolean })
  standalone = false;

  /** Positions icon on the left. */
  @property({ type: Boolean })
  iconLeft = false;

  /** Sets font-weight between default heavier and lighter font-weight. */
  @property({ type: String })
  linkFontWeight: 'lighter' | 'default' = 'default';

  override render() {
    const classes = this.returnClassMap();

    return html`
      <a
        class="kyn-link-text ${classes}"
        target=${this.target}
        part="link"
        rel=${this.rel}
        href=${this.href ? this.href : 'javascript:void(0)'}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        @click=${(e: Event) => this.handleClick(e)}
      >
        <span class="kyn-link-text-span-flex">
          <slot></slot>
          <slot name="icon"></slot>
        </span>
      </a>
    `;
  }
  // -- Apply classes according to states, kind etc. -- //
  private returnClassMap() {
    const baseClasses = {
      'kyn-link-text-disabled': this.disabled,
      'icon-left': this.iconLeft,
      'kyn-link-text-ai': this.kind === LINK_TYPES.AI_CONNECTED,
      'kyn-link-text-font-lighter': this.linkFontWeight === 'lighter',
    };

    if (this.disabled) {
      return classMap(baseClasses);
    } else {
      return classMap({
        ...baseClasses,
        'kyn-link-text-primary': this.kind === LINK_TYPES.PRIMARY || !this.kind,
        'kyn-link-text-secondary': this.kind === LINK_TYPES.SECONDARY,
        'kyn-link-text-secondary-ai': this.kind === LINK_TYPES.SECONDARY_AI,
        'kyn-link-text-inline': !this.standalone,
        'kyn-link-text-standalone': this.standalone,
      });
    }
  }

  private handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    const event = new CustomEvent('on-click', {
      detail: { href: this.href, origEvent: e },
    });
    this.dispatchEvent(event);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-link': Link;
  }
}
