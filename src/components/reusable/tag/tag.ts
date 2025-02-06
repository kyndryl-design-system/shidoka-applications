import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import clearIcon16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
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
   * Removes label text truncation.
   */
  @property({ type: Boolean })
  noTruncation = false;

  /**
   * Determine if Tag is clickable.
   */
  @property({ type: Boolean })
  clickable = false;

  /**
   * Color variants. Default spruce
   */
  @property({ type: String })
  tagColor = 'spruce';

  /**
   * Clear Tag Text to improve accessibility
   */
  @property({ type: String })
  clearTagText = 'Clear Tag';

  override render() {
    const baseColorClass = `tag-${this.tagColor}`;
    const sizeClass = this.tagSize === 'md' ? 'tag-medium' : 'tag-small';

    const tagClasses = {
      tags: true,
      'tag-disable': this.disabled,
      'tag-clickable': this.clickable,
      [`tag-clickable-${this.tagColor}`]: this.clickable,
      [`${baseColorClass}`]: true,
      [`${sizeClass}`]: true,
      [`${sizeClass}-filter`]: this.filter,
    };

    const iconOutlineClasses = `${baseColorClass}-close-btn`;
    const iconOutlineOffsetClass = `tag-close-btn-${this.tagSize}`;
    const iconClasses = {
      'tag-close-btn': true,
      [`${iconOutlineClasses}`]: true,
      [`${iconOutlineOffsetClass}`]: true,
    };

    const labelClasses = {
      'tag-label': true,
      'no-truncation': this.noTruncation,
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
        title="${this.label}"
        tabindex="${this.clickable ? '0' : '-1'}"
        @click=${(e: any) => this.handleTagClick(e, this.label)}
        @keydown=${(e: any) => this.handleTagPress(e, this.label)}
      >
        <span class="${classMap(labelClasses)}" aria-disabled=${this.disabled}
          >${this.label}</span
        >
        ${this.filter
          ? html`
              <button
                class="${classMap(iconClasses)}"
                ?disabled="${this.disabled}"
                title="${this.clearTagText}
                 ${this.label}"
                aria-label="${this.clearTagText}
                 ${this.label}"
                @click=${(e: any) => this.handleTagClear(e, this.label)}
                @keydown=${(e: any) => this.handleTagClearPress(e, this.label)}
              >
                <span>${unsafeSVG(clearIcon16)}</span>
              </button>
            `
          : ''}
      </div>
    `;
  }

  private handleTagClear(e: any, value: string) {
    e.stopPropagation();
    if (e.pointerType && !this.disabled) {
      const event = new CustomEvent('on-close', {
        detail: {
          value,
          origEvent: e,
        },
      });
      this.dispatchEvent(event);
    }
  }

  private handleTagClearPress(e: any, value: string) {
    e.stopPropagation();
    // Keyboard key codes: 32 = SPACE | 13 = ENTER
    if ((e.keyCode === 32 || e.keyCode === 13) && !this.disabled) {
      const event = new CustomEvent('on-close', {
        detail: {
          value,
          origEvent: e,
        },
      });
      this.dispatchEvent(event);
    }
  }

  private handleTagClick(e: any, value: string) {
    if (!this.disabled && this.clickable) {
      const event = new CustomEvent('on-click', {
        detail: {
          value,
          origEvent: e,
        },
      });
      this.dispatchEvent(event);
    }
  }

  private handleTagPress(e: any, value: string) {
    // Keyboard key codes: 32 = SPACE | 13 = ENTER
    if (
      (e.keyCode === 32 || e.keyCode === 13) &&
      !this.disabled &&
      this.clickable
    ) {
      const event = new CustomEvent('on-click', {
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
