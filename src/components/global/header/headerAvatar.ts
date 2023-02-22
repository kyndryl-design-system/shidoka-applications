import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderAvatarScss from './headerAvatar.scss';

/**
 * Container for header flyout items, aligns to the right, place last.
 */
@customElement('kyn-header-avatar')
export class HeaderAvatar extends LitElement {
  static override styles = HeaderAvatarScss;

  /** Two letters, first and last initial, to show in the user avatar circle. */
  @property({ type: String })
  initials = '';

  override render() {
    return html` ${this.initials} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-avatar': HeaderAvatar;
  }
}
