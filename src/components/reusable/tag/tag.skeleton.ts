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
      .tag-small kyn-skeleton {
        height: 100%;
        width: 100%;
        padding: 6px 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 50px;
        position: relative;
      }

      .tag-medium kyn-skeleton {
        height: 100%;
        width: 100%;
        padding: 6px 4px;
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
  tagSize = 'md';

  /**
   * Shade `'light'` (default) and `'dark'` for tag.
   */
  @property({ type: String })
  shade = 'light';

  /**
   * Color variants. Default spruce.
   */
  @property({ type: String })
  tagColor = 'spruce';

  override render() {
    const baseColorClass = `tag-${this.tagColor}`;
    const shadeClass = this.shade === 'dark' ? '-dark' : '';
    const sizeClass = this.tagSize === 'md' ? 'tag-medium' : 'tag-small';

    const tagClasses = {
      tags: true,
      [`${baseColorClass}${shadeClass}`]: true,
      [`${sizeClass}`]: true,
    };

    return html`
      <div
        class="${classMap(tagClasses)}"
        tagColor=${this.tagColor}
        shade=${this.shade}
      >
        <kyn-skeleton elementType="tag" inline></kyn-skeleton>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag-skeleton': TagSkeleton;
  }
}
