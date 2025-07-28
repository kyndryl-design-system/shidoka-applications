import { html, LitElement, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property } from 'lit/decorators.js';
import stylesheet from './emptyState.scss?inline';

/**
 * Empty State Component
 */
@customElement('kyn-empty-state-skeleton')
export class EmptyStateSkeleton extends LitElement {
  static override styles = unsafeCSS(stylesheet);

  /** Icon element or HTML to display */
  @property({ type: Object })
  accessor icon: unknown = '';

  /** Optional heading text */
  @property({ type: String })
  accessor emptyTitle: string = '';

  /** Main explanatory text */
  @property({ type: String })
  accessor description: string = '';

  /** Action buttons or links */
  @property({ type: Object })
  accessor actions: unknown = '';

  /** Size variant of the empty state */
  @property({ type: String })
  accessor size: 'small' | 'large' = 'large';

  /** Custom maximum width (CSS value) */
  @property({ type: String })
  accessor maxWidth: string = '';

  /** Additional CSS classes */
  @property({ type: String })
  accessor classes: string = '';

  /** ARIA role for accessibility */
  @property({ type: String })
  override accessor role: 'status' | 'alert' = 'status';

  /** ARIA live region setting */
  @property({ type: String })
  override accessor ariaLive: 'polite' | 'assertive' = 'polite';

  override render() {
    return html`
      <div
        class="empty-state--wrapper empty-state--${this.size} ${this.classes ||
        ''}"
        style="${this.maxWidth
          ? `--empty-state-max-width: ${this.maxWidth};`
          : ''}"
        role="${ifDefined(this.role)}"
        aria-live="${ifDefined(this.ariaLive)}"
      >
        <div class="empty-state--icon-wrapper">${this.icon ?? ''}</div>
        <div class="empty-state--content">
          <div class="empty-state-content-wrapper">
            ${this.emptyTitle
              ? html`
                  <div class="empty-state--title-div">
                    <h1>${this.emptyTitle}</h1>
                  </div>
                `
              : ''}
            ${this.description
              ? html`
                  <div class="empty-state--description-text">
                    <p>${this.description}</p>
                  </div>
                `
              : ''}
          </div>
          ${this.actions
            ? html`
                <div class="empty-state--action-wrapper">${this.actions}</div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-empty-state-skeleton': EmptyStateSkeleton;
  }
}
