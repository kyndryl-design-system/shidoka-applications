import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import CardSampleScss from './cardSample.scss';
import '../../components/reusable/overflowMenu';
import '../../components/reusable/tag';

import '../../components/reusable/button';
import actionIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/bookmark.svg';

/**  Sample Lit component to show containable items inside Card. */
@customElement('sample-card-story-content-component')
export class SampleCardStoryContentComponent extends LitElement {
  static override styles = CardSampleScss;

  override render() {
    const tagGroupArr = [
      {
        value: '1',
        text: 'Tag 1',
      },
      {
        value: '2',
        text: 'Tag 2',
      },
      {
        value: '3',
        text: 'Tag 3',
      },
      {
        value: '4',
        text: 'Tag 4',
      },
    ];
    return html`
      <div class="card-logo-container">
        <div class="card-logo">
          <img
            class="card-logo-img"
            src="https://fastly.picsum.photos/id/163/32/32.jpg?hmac=6Ev67xrdofIgcyzhr8G7E_OCYUUziK4DoqoH3XZ4I08"
            alt="product logo"
          />
        </div>
        <div class="card-logo-right">
          <div class="card-actions">
            <!-- Example : Card action button -->
            <div class="card-action-btn-class">
              <kyn-button
                kind="tertiary"
                size="small"
                iconPosition="center"
                description="Action"
                @click=${(e: Event) => e.preventDefault()}
              >
                <span slot="icon">${unsafeSVG(actionIcon)}</span>
              </kyn-button>
            </div>

            <div class="card-option-wrapper">
              <!-- Example : overflow menu -->
              <!-- Note : Use e.stopPropogation() / e.preventDefault() for any internal clickable elements when card type is 'clickable' to stop bubbling / prevent event -->
              <kyn-overflow-menu @click=${(e: any) => e.preventDefault()}>
                <kyn-overflow-menu-item>Option 1</kyn-overflow-menu-item>
                <kyn-overflow-menu-item>Option 2</kyn-overflow-menu-item>
              </kyn-overflow-menu>
            </div>
          </div>
        </div>
      </div>
      <!-- Example : Card Thumbnail -->
      <img
        class="card-thumbnail-img"
        alt="Card thumbnail"
        src="https://fastly.picsum.photos/id/521/216/128.jpg?hmac=r5KpZKHm2EaJAOKiLrULNwt5HEtevAOPle1qwxV6V3E"
      />

      <h1 class="card-title">This is a card title</h1>
      <div class="card-subtitle">This is card subtitle</div>
      <div class="card-description">
        Amazon EC2 Auto Scaling ensures that your application always has the
        right amount of compute capacity by dynamically adjusting the number of
        Amazon EC2 instances based on demand.
      </div>

      <div class="tags">
        <!-- Example : Tags -->
        <kyn-tag-group>
          ${tagGroupArr.map(
            (tag) =>
              html` <kyn-tag label=${tag.text} tagColor="spruce"></kyn-tag> `
          )}
        </kyn-tag-group>
      </div>

      <!-- Example : Card links -->
      <div class="card-link">
        <div class="card-link-elements">
          <kyn-button
            href="#"
            kind="tertiary"
            size="small"
            @click=${(e: Event) => e.preventDefault()}
            >Link 1</kyn-button
          >
          <kyn-button
            href="#"
            kind="tertiary"
            size="small"
            @click=${(e: Event) => e.preventDefault()}
            >Link 2</kyn-button
          >
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sample-card-story-content-component': SampleCardStoryContentComponent;
  }
}
