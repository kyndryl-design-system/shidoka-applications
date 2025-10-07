import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../loaders/skeleton';

import TagStyles from './tag.scss?inline';

@customElement('kyn-tag-skeleton')
export class TagSkeleton extends LitElement {
  static override styles = unsafeCSS(TagStyles);

  /**
   * Size of the tag, `'md'` (default) or `'sm'`. Icon size: 16px.
   */
  @property({ type: String })
  accessor tagSize = 'sm';

  override render() {
    const sizeClass = this.tagSize === 'md' ? 'tag-medium' : 'tag-small';

    const tagClasses = {
      tags: true,
      [`${sizeClass}`]: true,
    };

    return html`
      <div class="${classMap(tagClasses)}">
        <kyn-skeleton shape="rectangle" width="60px" inline></kyn-skeleton>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag-skeleton': TagSkeleton;
  }
}
