import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import PageTitleScss from './pageTitle.scss';

import '@kyndryl-design-system/shidoka-foundation/components/icon';

/**
 * Page Title
 */

@customElement('kyn-page-title')
export class PageTitle extends LitElement {
  static override styles = PageTitleScss;

  /** Whether to show headline. */
  @property({ type: Boolean })
  showheadLine = false;

  /** Headline text. */
  @property({ type: String })
  headLine = '';

  /** Page title text (required). */
  @property({ type: String })
  pageTitle = '';

  /** Whether to show subtitle. */
  @property({ type: Boolean })
  showSubTitle = false;

  /** Page subtitle text. */
  @property({ type: String })
  subTitle = '';

  /** Type of page title `'primary'` & `'secondary'`. */
  @property({ type: String })
  type = 'primary';

  /** Whether to show icon. */
  @property({ type: Boolean })
  showIcon = false;

  /** The imported carbon icon. Size 56 * 56. Requires `showIcon` true. */
  @property({ type: Object })
  icon: any = {};

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
        ${this.showIcon
          ? html`<div class="icon-wrapper">
              <kd-icon .icon=${this.icon} sizeOverride="56"></kd-icon>
            </div>`
          : null}

        <div class="page-title-text-wrapper">
          <!-- Headline -->
          ${this.showheadLine
            ? html`<div class="page-headline">${this.headLine}</div>`
            : null}
          <!-- Title -->
          <h1 class="${classMap(classes)}">${this.pageTitle}</h1>
          <!-- Subtitle -->
          ${this.showSubTitle
            ? html`<h6 class="${classMap(subTitleClasses)}">
                ${this.subTitle}
              </h6>`
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
