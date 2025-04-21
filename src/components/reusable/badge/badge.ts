import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import criticalIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/critical.svg';
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/error-2.svg';
import warningIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/warning.svg';
import successIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/checkmark.svg';
import infoIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/information.svg';
import BadgeScss from './badge.scss';

@customElement('kyn-badge')
export class Badge extends LitElement {
  static override styles = BadgeScss;

  /**
   * Badge name.
   */
  @property({ type: String })
  label = '';

  /**
   * Badge size, `'md'` (default) or `'sm'`. Icon size: 12px.
   */
  @property({ type: String })
  size = 'md';

  /**
   * Badge type, `'medium'` (default), `'heavy'`, or `'light'`.
   */
  @property({ type: String })
  type = 'medium';

  /**
   * Badge status. `'success'` (default), `'critical'`, `'error'`, `'warning'`, `'information'`, `'others'`.
   *
   */
  @property({ type: String })
  status = 'success';

  /**
   * Removes label text truncation.
   */
  @property({ type: Boolean })
  noTruncation = false;

  /**
   * Set to true if the badge is only an icon.
   */
  @property({ type: Boolean })
  iconOnly = false;

  override render() {
    const sizeClass = this.size === 'md' ? 'badge-medium' : 'badge-small';

    const badgeClasses = {
      badge: true,
      [`${sizeClass}`]: true,
    };

    const badgeIconClasses = {
      'badge-icon': true,
      'icon-only': this.iconOnly,
    };

    const labelClasses = {
      'badge-label': true,
      'no-truncation': this.noTruncation,
    };
    return html`<div
      class=${classMap(badgeClasses)}
      title=${this.label}
      tabindex="0"
    >
      <div class=${classMap(badgeIconClasses)}>
        ${this.status === 'others'
          ? html`<slot></slot>`
          : html`<span>${unsafeSVG(this._getStatusIcon())}</span>`}
      </div>
      <span class=${classMap(labelClasses)}>${this.label}</span>
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
