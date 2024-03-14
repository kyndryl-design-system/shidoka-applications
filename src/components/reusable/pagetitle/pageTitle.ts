import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import PageTitleScss from './pageTitle.scss';

/**
 * Page Title
 * @slot icon - Slot for icon. Use size 56 * 56 as per UX guidelines.
 */

@customElement('kyn-page-title')
export class PageTitle extends LitElement {
  static override styles = PageTitleScss;

  /** Headline text. */
  @property({ type: String })
  headLine = '';

  /** Page title text (required). */
  @property({ type: String })
  pageTitle = '';

  /** Page subtitle text. */
  @property({ type: String })
  subTitle = '';

  /** Type of page title `'primary'` & `'secondary'`. */
  @property({ type: String })
  type = 'primary';

  override render() {
    const classes = {
      'page-title': true,
      [`page-title-${this.type}`]: true,
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
