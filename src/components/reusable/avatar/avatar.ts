import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import AvatarScss from './avatar.scss';

/**
 * User avatar.
 * @slot unnamed - Slot for the profile picture img.
 */
@customElement('kyn-avatar')
export class Avatar extends LitElement {
  static override styles = AvatarScss;

  /** 1-2 letters to represent the user with the initials in the avatar circle. It also provides a slot that allows an image/photo to replace the initials */
  @property({ type: String })
  initials = '';

  override render() {
    return html` <div class="avatar-wrapper">
      <slot>${this.initials}</slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-avatar': Avatar;
  }
}
