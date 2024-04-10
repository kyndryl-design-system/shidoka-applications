import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import clearIcon16 from '@carbon/icons/es/close/16';
import TagScss from './tag.scss';

/**
 * Tag.
 * @fires on-close - Captures the close event and emits the Tag value. Works with filterable tags.
 */

@customElement('kyn-tag')
export class Tag extends LitElement {
  static override styles = TagScss;

  /**
   * Tag name (Required).
   */
  @property({ type: String })
  label = '';

  /**
   * Size of the tag, `'md'` (default) or `'sm'`. Icon size: 16px.
   */
  @property({ type: String })
  tagSize = 'md';

  /**
   * Specify if the Tag is disabled.
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Determine if Tag state is filter.
   */
  @property({ type: Boolean })
  filter = false;

  /**
   * Shade `'light'` (default) and `'dark'` for tag
   */
  @property({ type: String })
  shade = 'light';

  /**
   * Color variants. Default spruce
   */
  @property({ type: String })
  tagColor = 'spruce';

  override render() {
    const baseColorClass = `tag-${this.tagColor}`;
    const shadeClass = this.shade === 'dark' ? '-dark' : '';
    const sizeClass = this.tagSize === 'md' ? 'tag-medium' : 'tag-small';

    const tagClasses = {
      tags: true,
      'tag-disable': this.disabled,
      [`${baseColorClass}${shadeClass}`]: true,
      [`${sizeClass}`]: true,
      [`${sizeClass}-filter`]: this.filter,
    };

    const iconOutlineClasses = `${baseColorClass}${shadeClass}-close-btn`;
    const iconOutlineOffsetClass = `tag-close-btn-${this.tagSize}`;
    const iconClasses = {
      'tag-close-btn': true,
      [`${iconOutlineClasses}`]: true,
      [`${iconOutlineOffsetClass}`]: true,
    };

    const labelClasses = {
      'tag-label': true,
      [`${sizeClass}-label`]: true,
      [`${sizeClass}-label-filter`]: this.filter,
    };

    return html`
      <div
        class="${classMap(tagClasses)}"
        tagSize="${this.tagSize}"
        ?disabled="${this.disabled}"
        ?filter=${this.filter}
        tagColor=${this.tagColor}
        shade=${this.shade}
        title="${this.label}"
      >
        <span class="${classMap(labelClasses)}">${this.label}</span>
        ${this.filter
          ? html`
              <button
                class="${classMap(iconClasses)}"
                shade=${this.shade}
                ?disabled="${this.disabled}"
                title="Clear Tag"
                aria-label="Clear Tag"
                @click=${(e: any) => this.handleTagClear(e, this.label)}
              >
                <kd-icon .icon=${clearIcon16}></kd-icon>
              </button>
            `
          : ''}
      </div>
    `;
  }

  private handleTagClear(e: any, value: string) {
    if (!this.disabled) {
      const event = new CustomEvent('on-close', {
        bubbles: true,
        composed: true,
        detail: {
          value,
          origEvent: e,
        },
      });
      this.dispatchEvent(event);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag': Tag;
  }
}
