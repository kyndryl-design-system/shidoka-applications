import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../../components/reusable/button';
import '../../components/reusable/link';

import emptyStateScss from './sampleEmptyStateComponents.scss?inline';

import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/warning.svg';
import chartComboIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/chart-combo.svg';
import emptyStateIcon from './emptyState-icon.svg';
import emptyStateLargeIcon from './emtpyStateLarge.svg';

/**  Sample Lit component to show vital card pattern. */
@customElement('empty-state-sample-component')
export class EmptyStateSampleComponent extends LitElement {
  static override styles = unsafeCSS(emptyStateScss);

  /** Empty state size. */
  @property({ type: String })
  accessor size: 'small' | 'medium' | 'large' | 'full' = 'medium';

  /** Empty state orientation -- only applicable when size is `'full'`. */
  @property({ type: String })
  accessor orientation: 'horizontal' | 'vertical' = 'vertical';

  override render() {
    const classes = classMap({
      'empty-state--wrapper': true,
      'empty-state--horizontal':
        this.size === 'full' && this.orientation === 'horizontal',
      'empty-state--vertical': this.orientation === 'vertical',
      'empty-state--small': this.size === 'small',
      'empty-state--medium': this.size === 'medium',
      'empty-state--large': this.size === 'large',
      'empty-state--full': this.size === 'full',
    });
    return html`
      <div class=${classes}>
        ${this.size === 'full'
          ? html`<div class="empty-state--icon-wrapper">
              ${unsafeSVG(emptyStateIcon)}
            </div>`
          : ''}
        ${this.size === 'small'
          ? html`<div class="empty-state--icon-wrapper">
              ${unsafeSVG(warningIcon)}
            </div>`
          : ''}
        ${this.size === 'medium'
          ? html`<div class="empty-state--icon-wrapper">
              ${unsafeSVG(chartComboIcon)}
            </div>`
          : ''}
        ${this.size === 'large'
          ? html`<div class="empty-state--icon-wrapper">
              ${unsafeSVG(emptyStateLargeIcon)}
            </div>`
          : ''}
        <div class="empty-state--content">
          <div class="empty-state-content-wrapper">
            ${this.size !== 'small'
              ? html`<div class="empty-state--title-div">
                  <h1>Main Title</h1>
                </div>`
              : ''}
            <div class="empty-state--description-text">
              <p>This is an example of an empty state.</p>
            </div>
          </div>
          ${this.size === 'full'
            ? html`<div class="empty-state--action-wrapper">
                <kyn-button
                  class="empty-state--action-button"
                  @on-click=${(e: Event) => e.preventDefault()}
                >
                  <span class="empty-state--action-button-text"
                    >Primary Action</span
                  >
                  <span slot="icon" class="empty-state--action-button-icon"
                    >${unsafeSVG(chevronRightIcon)}</span
                  >
                </kyn-button>
                <kyn-button
                  class="empty-state-secondary-action-button"
                  kind="secondary"
                  @on-click=${(e: Event) => e.preventDefault()}
                >
                  <span class="empty-state--secondary-action-button-text"
                    >Secondary Action</span
                  >
                </kyn-button>
              </div>`
            : ''}
          ${this.size === 'large'
            ? html`<div class="empty-state--link-wrapper">
                <kyn-link href="#" standalone>Link</kyn-link>
              </div>`
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'empty-state-sample-component': EmptyStateSampleComponent;
  }
}
