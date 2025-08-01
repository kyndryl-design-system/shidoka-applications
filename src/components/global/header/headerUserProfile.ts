import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import HeaderUserProfileScss from './headerUserProfile.scss?inline';
import '../../reusable/link';

/**
 * Header user profile.
 * @fires on-profile-link-click - Captures the view profile link click event and emits the original event details. `detail:{ origEvent: Event }`
 * @slot unnamed - Slot for the profile picture img.
 */
@customElement('kyn-header-user-profile')
export class HeaderUserProfile extends LitElement {
  static override styles = unsafeCSS(HeaderUserProfileScss);

  /** The user's name. */
  @property({ type: String })
  accessor name = '';

  /** The user's job title, or subtext. */
  @property({ type: String })
  accessor subtitle = '';

  /** The user's email address. */
  @property({ type: String })
  accessor email = '';

  /** View profile link URL. */
  @property({ type: String })
  accessor profileLink = '';

  /** View Profile link text. */
  @property({ type: String })
  accessor profileLinkText = 'View Profile';

  override render() {
    return html`
      <div class="user-profile">
        <div class="picture"><slot></slot></div>

        <div class="info">
          ${this.name !== ''
            ? html` <div class="name">${this.name}</div>`
            : null}
          ${this.subtitle !== ''
            ? html` <div class="subtitle">${this.subtitle}</div>`
            : null}
          ${this.email !== ''
            ? html`
                <div class="email">
                  <kyn-link standalone href="mailto:${this.email}">
                    ${this.email}
                  </kyn-link>
                </div>
              `
            : null}
        </div>

        ${this.profileLink !== ''
          ? html`
              <div class="view-profile">
                <kyn-link
                  standalone
                  href=${this.profileLink}
                  @on-click=${(e: Event) => this._handleProfileClick(e)}
                >
                  ${this.profileLinkText}
                </kyn-link>
              </div>
            `
          : null}
      </div>
    `;
  }

  private _handleProfileClick(e: any) {
    const event = new CustomEvent('on-profile-link-click', {
      detail: { origEvent: e },
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-user-profile': HeaderUserProfile;
  }
}
