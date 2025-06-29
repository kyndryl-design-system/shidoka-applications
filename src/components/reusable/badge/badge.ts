import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import criticalIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/critical.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-2.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/warning.svg';
import successIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark.svg';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import BadgeScss from './badge.scss?inline';

/**
 * Badge.
 * @slot unnamed - Slot for custom icon.
 */
@customElement('kyn-badge')
export class Badge extends LitElement {
  static override styles = unsafeCSS(BadgeScss);

  /**
   * Badge name.
   */
  @property({ type: String })
  accessor label = '';

  /**
   * Badge size, `'md'` (default) or `'sm'`. Icon size: 16px only.
   */
  @property({ type: String })
  accessor size = 'md';

  /**
   * Badge type, `'medium'` (default), `'heavy'`, or `'light'`.
   */
  @property({ type: String })
  accessor type = 'medium';

  /**
   * Badge status, `'success'` (default), `'critical'`, `'error'`, `'warning'`, `'information'`, `'others'`.
   *
   */
  @property({ type: String })
  accessor status = 'success';

  /**
   * Removes label text truncation.
   */
  @property({ type: Boolean })
  accessor noTruncation = false;

  /**
   * Icon title for screen readers.
   */
  @property({ type: String })
  accessor iconTitle = 'Icon title';

  /**
   * Hide icon. Default is `false`.
   */
  @property({ type: Boolean })
  accessor hideIcon = false;

  /**
   * Determine if Badge is icon only.
   * @internal
   */
  @state()
  accessor _iconOnly = false;

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (this.label.length === 0) {
      this._iconOnly = true;
    } else {
      this._iconOnly = false;
    }
  }

  override render() {
    const sizeClass = this.size === 'md' ? 'badge-medium' : 'badge-small';

    const badgeClasses = {
      badge: true,
      'no-truncation': this.noTruncation,
      [`${sizeClass}`]: true,
      [`badge-${this.type}-${this.status}`]: true,
    };

    return html`<div class=${classMap(badgeClasses)} title=${this.label}>
      ${!this.hideIcon
        ? html`<slot>
            <span
              class="badge-icon"
              aria-labelledby=${this.iconTitle}
              aria-hidden="true"
            >
              ${unsafeSVG(this._getStatusIcon())}
            </span>
          </slot>`
        : ''}
      ${!this._iconOnly
        ? html`<span class="badge-label">${this.label}</span>`
        : ''}
    </div>`;
  }

  private _getStatusIcon() {
    switch (this.status) {
      case 'critical':
        return criticalIcon;
      case 'error':
        return errorIcon;
      case 'warning':
        return warningIcon;
      case 'success':
        return successIcon;
      case 'information':
        return infoIcon;
      default:
        return '';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-badge': Badge;
  }
}
