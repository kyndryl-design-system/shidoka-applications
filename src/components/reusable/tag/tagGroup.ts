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

  private _toggleWrapMeasureFrame?: number;

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

  /** Toggle wrapped state.
   * @internal
   */
  @state()
  accessor _toggleWrapped = false;

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

  /** Maximum number of tags to display before showing the "Show all" button. */
  @property({ type: Number })
  accessor limitCount = 5;

  override render() {
    const toggleBtnClasses = {
      'tag-reveal-toggle': true,
      [`tag-reveal-toggle-${this.tagSize}`]: true,
      'tag-reveal-toggle-wrapped': this._toggleWrapped,
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
      changedProps.has('limitTags') ||
      changedProps.has('limitCount')
    ) {
      this._updateChildren();
    }
  }

  override disconnectedCallback() {
    if (this._toggleWrapMeasureFrame) {
      cancelAnimationFrame(this._toggleWrapMeasureFrame);
      this._toggleWrapMeasureFrame = undefined;
    }
    super.disconnectedCallback();
  }

  private _handleSlotChange() {
    this._updateChildren();
    this.requestUpdate();
  }

  private _updateToggleWrapped() {
    if (this._toggleWrapMeasureFrame) {
      cancelAnimationFrame(this._toggleWrapMeasureFrame);
    }

    this._toggleWrapMeasureFrame = requestAnimationFrame(() => {
      this._toggleWrapMeasureFrame = undefined;
      this._toggleWrapped = this._isToggleWrapped();
    });
  }

  private _isToggleWrapped(): boolean {
    // Restrict wrapped-spacing behavior to dropdown usage only.
    if (!this.classList.contains('dropdown-tag-group') || !this.limitTags) {
      return false;
    }

    const slotEl = this.renderRoot.querySelector(
      'slot'
    ) as HTMLSlotElement | null;
    const toggleEl = this.renderRoot.querySelector(
      '.tag-reveal-toggle'
    ) as HTMLElement | null;

    if (!toggleEl || !slotEl) {
      return false;
    }

    const visibleTags = slotEl
      .assignedElements({ flatten: true })
      .filter(
        (el) =>
          el instanceof HTMLElement &&
          el.localName === 'kyn-tag' &&
          getComputedStyle(el).display !== 'none'
      ) as HTMLElement[];

    if (visibleTags.length === 0) {
      return false;
    }

    const firstRowTop = Math.min(
      ...visibleTags.map((tag) => tag.getBoundingClientRect().top)
    );
    const toggleRectTop = toggleEl.getBoundingClientRect().top;
    const appliedMarginTop =
      parseFloat(getComputedStyle(toggleEl).marginTop || '0') || 0;
    const toggleTop = toggleRectTop - appliedMarginTop;

    return toggleTop - firstRowTop > 2;
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
      this._toggleWrapped = false;
      return;
    }

    // default behavior when not limiting or fully revealed: show everything.
    if (!this.limitTags || this.limitRevealed) {
      this.tags.forEach((t) => {
        t.style.display = 'inline-block';
      });
      this._updateToggleWrapped();
      return;
    }

    // split tags into persistent vs non-persistent.
    const persistentTags = this.tags.filter((t) => t.persistentTag);
    const nonPersistentTags = this.tags.filter((t) => !t.persistentTag);

    if (nonPersistentTags.length <= this.limitCount) {
      this.tags.forEach((t) => {
        t.style.display = 'inline-block';
      });
      this._updateToggleWrapped();
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

    this._updateToggleWrapped();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tag-group': TagGroup;
  }
}
