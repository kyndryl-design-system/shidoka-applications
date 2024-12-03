import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';

import '../loaders/skeleton';

import TagStyles from './tag.scss';

@customElement('kyn-tag-skeleton')
export class TagSkeleton extends LitElement {
  static override styles = [
    TagStyles,
    css`
      .tag-small,
      .tag-medium {
        padding: 0px;
      }
      .tag-small kyn-skeleton,
      .tag-medium kyn-skeleton {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 50px;
        position: relative;
      }
    `,
  ];

  /**
   * Size of the tag, `'md'` (default) or `'sm'`. Icon size: 16px.
   */
  @property({ type: String })
  tagSize = 'sm';

  /**
   * Shade `'light'` (default) and `'dark'` for tag.
   */
  @property({ type: String })
  shade = 'light';

  override render() {
    const shadeClass = this.shade === 'dark' ? '-dark' : '';
    const sizeClass = this.tagSize === 'md' ? 'tag-medium' : 'tag-small';

    const tagClasses = {
      tags: true,
      [`${shadeClass}`]: true,
      [`${sizeClass}`]: true,
    };

    return html`
      <div class="${classMap(tagClasses)}" shade=${this.shade}>
        <kyn-skeleton
          shape="rectangle"
          height="100%"
          width="60px"
          inline
        ></kyn-skeleton>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag-skeleton': TagSkeleton;
  }
}
