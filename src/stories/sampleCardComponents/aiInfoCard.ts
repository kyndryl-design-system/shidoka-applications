import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import aiInfoCardScss from './aiInfoCard.scss';

@customElement('ai-info-card-component')
export class AiInfoCardComponent extends LitElement {
  static override styles = aiInfoCardScss;

  /** show left Icon */
  @property({ type: Boolean })
  showLeftIcon = false;

  /** show title text*/
  @property({ type: Boolean })
  showTitle = false;

  /** show right Icon */
  @property({ type: Boolean })
  showRightIcon = false;

  override render() {
    return html`
      <div class="aiInfo-card-container">
        ${this.showLeftIcon
          ? html`<div class="aiInfo-card-leftIcon">
              <slot name="leftIcon"></slot>
            </div>`
          : null}

        <div class="aiInfo-card-content-wrapper">
          ${this.showTitle
            ? html`<div class="aiInfo-card-title-text">
                <slot name="title"></slot>
              </div>`
            : null}
          <div class="aiInfo-card-sub-text">
            <slot name="subText"></slot>
          </div>
        </div>
        ${this.showRightIcon
          ? html`<div class="aiInfo-card-rightIcon">
              <slot name="rightIcon"></slot>
            </div>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ai-info-card-component': AiInfoCardComponent;
  }
}
