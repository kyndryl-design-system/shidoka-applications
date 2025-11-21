import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import './tag';
import TagGroupScss from './tagGroup.scss?inline';
import '../link';

/**
 * Tag & Tag Group
 * @slot unnamed - Slot for individual tags and tagsskeleton.
 */

@customElement('kyn-tag-group')
export class TagGroup extends LitElement {
  static override styles = unsafeCSS(TagGroupScss);

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

  private readonly limitCount = 5;

  override render() {
    const toggleBtnClasses = {
      'tag-reveal-toggle': true,
      [`tag-reveal-toggle-${this.tagSize}`]: true,
    };

    const hasOverflow =
      this.limitTags &&
      Array.isArray(this.tags) &&
      this.tags.length > this.limitCount;

    return html`
      <div class="tags-container">
        <slot @slotchange=${this._handleSlotChange}></slot>

        ${hasOverflow
          ? html`
              <kyn-link
                class="${classMap(toggleBtnClasses)}"
                standalone
                @on-click=${() => this._toggleRevealed(!this.limitRevealed)}
              >
                ${this.limitRevealed
                  ? this.textStrings.showLess
                  : html` ${this.textStrings.showAll}`}
              </kyn-link>
            `
          : null}
      </div>
    `;
  }

  override updated(changedProps: Map<string, unknown>) {
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
    if (!Array.isArray(this.tags)) {
      return;
    }

    // set filter for each tag
    this.tags.forEach((tag) => {
      tag.filter = this.filter;
    });

    // set tag size for each tag
    this.tags.forEach((tag) => {
      tag.tagSize = this.tagSize;
    });

    this._toggleRevealed(this.limitRevealed);
  }

  private _toggleRevealed(revealed: boolean) {
    this.limitRevealed = revealed;

    if (!Array.isArray(this.tags) || this.tags.length === 0) {
      return;
    }

    // default behavior when not limiting or fully revealed: show everything.
    if (!this.limitTags || this.limitRevealed) {
      this.tags.forEach((t) => {
        t.style.display = 'inline-block';
      });
      return;
    }

    // split tags into persistent vs non-persistent.
    const persistentTags = this.tags.filter((t) => t.persistentTag);
    const nonPersistentTags = this.tags.filter((t) => !t.persistentTag);

    if (nonPersistentTags.length <= this.limitCount) {
      this.tags.forEach((t) => {
        t.style.display = 'inline-block';
      });
      return;
    }

    // legacy limiting logic
    nonPersistentTags.forEach((t, index) => {
      t.style.display = index < this.limitCount ? 'inline-block' : 'none';
    });

    // persistent tags are always visible
    persistentTags.forEach((t) => {
      t.style.display = 'inline-block';
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag-group': TagGroup;
  }
}
