import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import PageTitleScss from './pageTitle.scss?inline';

/**
 * Page Title
 * @slot icon - Slot for icon. Use size 56 * 56 as per UX guidelines.
 */

@customElement('kyn-page-title')
export class PageTitle extends LitElement {
  static override styles = unsafeCSS(PageTitleScss);

  /** Headline text. */
  @property({ type: String })
  accessor headLine = '';

  /** Page title text (required). */
  @property({ type: String })
  accessor pageTitle = '';

  /** Page subtitle text. */
  @property({ type: String })
  accessor subTitle = '';

  /** Type of page title `'primary'` , `'secondary'` & `'tertiary'`. */
  @property({ type: String })
  accessor type = 'primary';

  /** Set this to `true` for AI theme. */
  @property({ type: Boolean })
  accessor aiConnected = false;

  override render() {
    const classes = {
      'page-title': true,
      [`page-title-${this.type}`]: true,
      'ai-connected': this.aiConnected,
    };

    const subTitleClasses = {
      'page-subtitle': true,
      [`page-subtitle-${this.type}`]: true,
    };

    return html`
      <div class="page-title-wrapper">
        <div class="icon-wrapper">
          <slot name="icon"></slot>
        </div>

        <div class="page-title-text-wrapper">
          <!-- Headline -->
          ${this.headLine !== ''
            ? html`<div class="page-headline">${this.headLine}</div>`
            : null}
          <!-- Title -->
          <h1 class="${classMap(classes)}">${this.pageTitle}</h1>
          <!-- Subtitle -->
          ${this.subTitle !== ''
            ? html`<div class="${classMap(subTitleClasses)}">
                ${this.subTitle}
              </div>`
            : null}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-page-title': PageTitle;
  }
}
