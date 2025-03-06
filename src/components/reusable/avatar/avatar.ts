import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import AvatarScss from './avatar.scss';
import { classMap } from 'lit/directives/class-map.js';

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

  /** Set this to `true` for AI theme. */
  @property({ type: Boolean })
  aiConnected = false;

  override render() {
    return html` <div
      part="avatar-wrapper"
      class=${classMap({
        'avatar-wrapper': true,
        aiConnected: this.aiConnected,
      })}
    >
      <slot>${this.initials}</slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-avatar': Avatar;
  }
}
