import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import './tag';
import TagGroupScss from './tagGroup.scss';

/**
 * Tag & Tag Group
 * @slot unnamed - Slot for individual tags.
 */

@customElement('kyn-tag-group')
export class TagGroup extends LitElement {
  static override styles = TagGroupScss;

  /** Text string customization. */
  @property({ type: Object })
  accessor textStrings = {
    showAll: 'Show all',
    showLess: 'Show less',
  };

  /** Limits visible tags (5) behind a "Show all" button. Use only if having more than 5 tags.*/
  @property({ type: Boolean })
  accessor limitTags = false;

  /** Tag limit visibility.
   * @internal
   */
  @state()
  accessor limitRevealed = false;

  /** Tag group filter */
  @property({ type: Boolean })
  accessor filter = false;

  /**
   * Size of the tag, `'md'` (default) or `'sm'`. Icon size: 16px.
   */
  @property({ type: String })
  accessor tagSize = 'md';

  /**
   * Queries for slotted tags.
   * @ignore
   */
  @queryAssignedElements()
  accessor tags!: Array<any>;

  override render() {
    const toggleBtnClasses = {
      'tag-reveal-toggle': true,
      [`tag-reveal-toggle-${this.tagSize}`]: true,
    };

    return html`
      <div class="tags-container">
        <slot @slotchange=${this._handleSlotChange}></slot>

        ${this.limitTags && this.tags.length > 5
          ? html`
              <button
                class="${classMap(toggleBtnClasses)}"
                @click=${() => this._toggleRevealed(!this.limitRevealed)}
              >
                ${this.limitRevealed
                  ? this.textStrings.showLess
                  : html` ${this.textStrings.showAll}`}
              </button>
            `
          : null}
      </div>
    `;
  }
  override updated(changedProps: any) {
    if (
      changedProps.has('filter') ||
      changedProps.has('tagSize') ||
      changedProps.has('limitTags')
    ) {
      this._updateChildren();
    }
  }

  private _handleSlotChange() {
    this._updateChildren();
    this.requestUpdate();
  }

  private _updateChildren() {
    // set filter for each tag
    this.tags.forEach((tag: any) => {
      tag.filter = this.filter;
    });

    // set tag size for each tag
    this.tags.forEach((tag: any) => {
      tag.tagSize = this.tagSize;
    });

    this._toggleRevealed(false);
  }

  private _toggleRevealed(revealed: boolean) {
    const Limit = 5;
    this.limitRevealed = revealed;
    this.tags.forEach((tagEl, index) => {
      if (!this.limitTags || this.limitRevealed) {
        tagEl.style.display = 'inline-block';
      } else {
        if (index < Limit) {
          tagEl.style.display = 'inline-block';
        } else {
          tagEl.style.display = 'none';
        }
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag-group': TagGroup;
  }
}
