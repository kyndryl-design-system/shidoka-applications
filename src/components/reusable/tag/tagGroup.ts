import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
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
  textStrings = {
    showAll: 'Show all',
    showLess: 'Show less',
  };

  /** Limits visible tags (5) behind a "Show all" button. Use only if having more than 5 tags.*/
  @property({ type: Boolean })
  limitTags = false;

  /** Tag limit visibility.
   * @internal
   */
  @state()
  limitRevealed = false;

  /** Tag group disabled state. */
  @property({ type: Boolean })
  disabled = false;

  /** Tag group filter */
  @property({ type: Boolean })
  filter = false;

  /**
   * Size of the tag, `'md'` (default) or `'sm'`. Icon size: 16px.
   */
  @property({ type: String })
  tagSize = 'md';

  /**
   * Shade `'light'` (default) and `'dark'` for tag
   */
  @property({ type: String })
  shade = 'light';

  /**
   * Color variants. Default grey
   */
  @property({ type: String })
  tagColor = 'grey';

  /**
   * Queries for slotted tags.
   * @ignore
   */
  @queryAssignedElements()
  tags!: Array<any>;

  override render() {
    return html`
      <div>
        <slot></slot>
        ${this.limitTags && this.tags.length > 5
          ? html`
              <button
                class="tag-reveal-toggle"
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
    // set disabled for each tag
    if (changedProps.has('disabled')) {
      this.tags.forEach((tag: any) => {
        tag.disabled = this.disabled;
      });
    }
    // set filter for each tag
    if (changedProps.has('filter')) {
      this.tags.forEach((tag: any) => {
        tag.filter = this.filter;
      });
    }
    // set tag size for each tag
    if (changedProps.has('tagSize')) {
      this.tags.forEach((tag: any) => {
        tag.tagSize = this.tagSize;
      });
    }
    // set tag shade for each tag
    if (changedProps.has('shade')) {
      this.tags.forEach((tag: any) => {
        tag.shade = this.shade;
      });
    }
    // set tag color for each tag
    if (changedProps.has('tagColor')) {
      this.tags.forEach((tag: any) => {
        tag.tagColor = this.tagColor;
      });
    }
    if (changedProps.has('limitTags')) {
      this._toggleRevealed(false);
    }
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
