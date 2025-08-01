import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import clearIcon16 from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/close-simple.svg';
import TagScss from './tag.scss?inline';

/**
 * Tag.
 * @fires on-close - Captures the close event and emits the Tag value. Works with filterable tags. `detail:{ origEvent: PointerEvent,value: string }`
 * @fires on-click - Captures the click event and emits the Tag value. Works with clickable tags. `detail:{ origEvent: PointerEvent,value: string }`
 * @slot unnamed - Slot for icon.
 */

@customElement('kyn-tag')
export class Tag extends LitElement {
  static override styles = unsafeCSS(TagScss);

  /**
   * Tag name (Required).
   */
  @property({ type: String })
  accessor label = '';

  /**
   * Size of the tag, `'md'` (default) or `'sm'`. Icon size: 16px.
   */
  @property({ type: String })
  accessor tagSize = 'md';

  /**
   * Specify if the Tag is disabled.
   */
  @property({ type: Boolean })
  accessor disabled = false;

  /**
   * Determine if Tag state is filter.
   */
  @property({ type: Boolean })
  accessor filter = false;

  /**
   * Removes label text truncation.
   */
  @property({ type: Boolean })
  accessor noTruncation = false;

  /**
   * Determine if Tag is clickable(applicable for old tags only).
   * <br>
   * **NOTE**: New tags are **clickable** by **default**.
   */
  @property({ type: Boolean })
  accessor clickable = false;

  /**
   * Color variants.
   */
  @property({ type: String })
  accessor tagColor: 'default' | 'spruce' | 'sea' | 'lilac' | 'ai' | 'red' =
    'default';

  /**
   * Clear Tag Text to improve accessibility
   */
  @property({ type: String })
  accessor clearTagText = 'Clear Tag';

  override updated() {
    this.label = this.label.trim();
  }

  override render() {
    /* --------------------- DEPRECATED --------------------- */
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
    /* --------------------- DEPRECATED --------------------- */

    const newBaseColorClass = `tag--new-${this.tagColor}`;
    const newSizeClass =
      this.tagSize === 'md' ? 'tag--new-medium' : 'tag--new-small';

    const newTagClasses = {
      'tags--new': true,
      'no-truncation': this.noTruncation,
      'tag--new-disable': this.disabled,
      'tag--new-clickable': this._isTagClickable(),
      [`tag--new-clickable-${this.tagColor}`]: this._isTagClickable(),
      [`${newBaseColorClass}`]: true,
      [`${newSizeClass}`]: true,
    };

    const newIconOutlineClasses = `${newBaseColorClass}-close-btn`;
    const newIconOutlineOffsetClass = `tag-close-btn--new-${this.tagSize}`;
    const newIconClasses = {
      'tag-close-btn--new': true,
      [`${newIconOutlineClasses}`]: true,
      [`${newIconOutlineOffsetClass}`]: true,
    };

    const newLabelClasses = {
      'tag-label--new': true,
    };

    return html`
      <div
        class="${classMap(this._chechForNewTag() ? newTagClasses : tagClasses)}"
        tagSize="${this.tagSize}"
        ?disabled="${this.disabled}"
        ?filter=${this.filter}
        tagColor=${this.tagColor}
        title="${this.label}"
        tabindex="${this._isTagClickable() ? '0' : '-1'}"
        @click=${(e: any) => this.handleTagClick(e, this.label)}
        @keydown=${(e: any) => this.handleTagPress(e, this.label)}
      >
        ${this._chechForNewTag() ? html`<slot></slot>` : ''}
        <span
          class="${classMap(
            this._chechForNewTag() ? newLabelClasses : labelClasses
          )}"
          aria-disabled=${this.disabled}
          >${this.label}</span
        >
        ${this.filter
          ? html`
              <button
                class="${classMap(
                  this._chechForNewTag() ? newIconClasses : iconClasses
                )}"
                ?disabled="${this.disabled}"
                title="${this.clearTagText} ${this.label}"
                aria-label="${this.clearTagText} ${this.label}"
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

  private _chechForNewTag() {
    const newTags = ['default', 'spruce', 'sea', 'lilac', 'ai', 'red'];
    if (newTags.includes(this.tagColor)) {
      return true;
    } else {
      return false;
    }
  }

  private _isTagClickable() {
    if (this._chechForNewTag()) {
      return !this.filter;
    } else {
      return this.clickable;
    }
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
    if (!this.disabled && this._isTagClickable()) {
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
      this._isTagClickable()
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
