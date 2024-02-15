import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import clearIcon16 from '@carbon/icons/es/close/16';
import TagScss from './tag.scss';

/**
 * Tag.
 * @fires on-close - Captures the close event and emits the Tag value.
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
   * Determine if Tag state is filter/chip.
   */
  @property({ type: Boolean })
  filter = false;

  /**
   * Shade `'light'` (default) and `'dark'` for tag
   */
  @property({ type: String })
  shade = 'light';

  /**
   * Color variants. Default grey
   */
  @property({ type: String })
  color: 'grey';

  override render() {
    const baseColorClass = `tag-${this.color}`;
    const shadeClass = this.shade === 'dark' ? '-dark' : '';

    const tagClasses = {
      tags: true,
      'tag-disable': this.disabled,
      'tag-medium': this.tagSize === 'md',
      'tag-small': this.tagSize === 'sm',
      [`${baseColorClass}${shadeClass}`]: true,
    };

    const iconOutlineClasses = `${baseColorClass}${shadeClass}-close-btn`;
    const iconClasses = {
        'tag-close-btn': true,
        [`${iconOutlineClasses}`]: true
    }

    return html`
      <div
        class="${classMap(tagClasses)}"
        tagSize="${this.tagSize}"
        ?disabled="${this.disabled}"
        ?filter=${this.filter}
        color=${this.color}
        shade=${this.shade}
        title="${this.label}"
      >
        <span class="tag-label">${this.label}</span>
        ${this.filter
          ? html`
              <button
                class="${classMap(iconClasses)}"
                shade=${this.shade}
                ?disabled="${this.disabled}"
                @click=${() => this.handleTagClear(this.label)}
              >
                <kd-icon .icon=${clearIcon16}></kd-icon>
              </button>
            `
          : ''}
      </div>
    `;
  }

  private handleTagClear(value: string) {
    if (!this.disabled) {
        const event = new CustomEvent('on-close', {
          detail: {
            value,
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
