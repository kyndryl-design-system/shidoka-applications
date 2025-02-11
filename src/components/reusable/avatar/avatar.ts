import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import AvatarScss from './avatar.scss';

/**
 * User avatar.
 */
@customElement('kyn-avatar')
export class Avatar extends LitElement {
  static override styles = AvatarScss;

  /** Two letters, first and last initial, to show in the user avatar circle. */
  @property({ type: String })
  initials = '';

  override render() {
    return html` ${this.initials} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-avatar': Avatar;
  }
}
