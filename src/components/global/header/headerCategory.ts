import { LitElement, html, unsafeCSS, type PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import HeaderCategoryScss from './headerCategory.scss?inline';
import chevronRightIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chevron-right.svg';
import './headerLink';

/**
 * Header link category
 * @slot unnamed - Slot for links.
 * @slot icon - Slot for icon.
 * @slot more - Slot for "More" link (indented with category links).
 */
@customElement('kyn-header-category')
export class HeaderCategory extends LitElement {
  static override styles = unsafeCSS(HeaderCategoryScss);

  /** Category text. */
  @property({ type: String })
  accessor heading = '';

  /** Add left padding when icon is not provided to align text with links that do have icons. */
  @property({ type: Boolean })
  accessor leftPadding = false;

  /** Show bottom border/divider. Set to true to force show, false to force hide. By default, dividers are automatically shown when followed by another category. */
  @property({ type: Boolean })
  accessor showDivider = false;

  /** Disable automatic divider detection (default: true for backwards compatibility).
   * When true, only shows divider if showDivider is explicitly set.
   * When false, dividers auto-detect based on sibling categories.
   * @internal
   */
  @property({ type: Boolean })
  accessor noAutoDivider = true;

  /** Maximum number of visible root links before showing the generated "More" action.
   * @internal
   */
  @property({ type: Number, attribute: false })
  accessor maxVisibleLinks = Number.POSITIVE_INFINITY;

  /** When true, show all links and switch the category into the detail layout.
   * @internal
   */
  @property({ type: Boolean, attribute: false })
  accessor detailView = false;

  /** Optional heading override used by the parent detail view.
   * @internal
   */
  @property({ type: String, attribute: false })
  accessor detailHeading = '';

  /** Text for the generated root-view "More" action.
   * @internal
   */
  @property({ type: String, attribute: false })
  accessor moreLabel = 'More';

  /** Resolved category id provided by the parent wrapper.
   * Falls back to the host `id` attribute when unset.
   * @internal
   */
  @property({ type: String, attribute: false })
  accessor categoryId = '';

  /** Minimum desired links per detail column.
   * @internal
   */
  @property({ type: Number, attribute: false })
  accessor detailLinksPerColumn = 6;

  /** @internal */
  @state()
  private accessor _hasIcon = false;

  /** @internal */
  @state()
  private accessor _hasNextCategorySibling = false;

  /** @internal */
  @state()
  private accessor _showGeneratedMore = false;

  /** @internal */
  @state()
  private accessor _detailColumnCount = 1;

  /** @internal */
  private _resizeObserver?: ResizeObserver;

  /** @internal */
  private _observedCategoriesHost: Element | null = null;

  private _handleIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasIcon = assignedNodes.length > 0;
  }

  private _checkForNextCategorySibling() {
    this._hasNextCategorySibling =
      this.nextElementSibling?.tagName === 'KYN-HEADER-CATEGORY' || false;
  }

  private _getRegularLinks(): HTMLElement[] {
    return Array.from(this.children).filter(
      (child): child is HTMLElement =>
        child.tagName === 'KYN-HEADER-LINK' &&
        child.getAttribute('slot') !== 'more'
    );
  }

  private _getCustomMoreNodes(): HTMLElement[] {
    return Array.from(this.children).filter(
      (child): child is HTMLElement => child.getAttribute('slot') === 'more'
    );
  }

  /**
   * Detail columns are designed at ~200px (`inline-size` on links). Cap the
   * count so narrow flyouts drop columns instead of crushing labels.
   * @internal
   */
  private _computeDetailColumnCount(linkCount: number): number {
    if (linkCount <= 0) return 1;

    const minPerColumn = Math.max(this.detailLinksPerColumn, 1);
    const maxColumns = 4;
    const idealColumns = Math.ceil(linkCount / minPerColumn);
    const byContent = Math.min(maxColumns, Math.max(1, idealColumns));

    return this._capDetailColumnsByWidth(byContent);
  }

  /**
   * Cap by the flyout/panel width — not the category's own clientWidth.
   * Measuring self feedback-locks at 1 column (host shrinks to one 200px track).
   * @internal
   * @ignore
   */
  private _capDetailColumnsByWidth(maxColumns: number): number {
    if (maxColumns <= 1) return maxColumns;

    // Prefer the categories host / tab panel, which fills the flyout content box.
    const categoriesHost = this.closest('kyn-header-categories');
    const available =
      categoriesHost?.clientWidth ||
      this.parentElement?.clientWidth ||
      this.clientWidth ||
      0;
    if (available <= 0) return maxColumns;

    const gapValue = getComputedStyle(this)
      .getPropertyValue('--kyn-header-category-column-gap')
      .trim();
    const gap = Number.parseFloat(gapValue) || 32;
    // Detail links are designed at 200px inline-size.
    const minColumnWidth = 200;
    const maxByWidth = Math.max(
      1,
      Math.floor((available + gap) / (minColumnWidth + gap))
    );

    return Math.min(maxColumns, maxByWidth);
  }

  /**
   * @internal
   */
  private _handleDetailResize = (): void => {
    if (!this.detailView) return;
    const next = this._computeDetailColumnCount(this._getRegularLinks().length);
    if (next !== this._detailColumnCount) {
      this._detailColumnCount = next;
    }
  };

  private _syncLinks(): void {
    const regularLinks = this._getRegularLinks();
    const hasFiniteLimit =
      Number.isFinite(this.maxVisibleLinks) && this.maxVisibleLinks > 0;
    const visibleLimit =
      !this.detailView && hasFiniteLimit
        ? this.maxVisibleLinks
        : Number.POSITIVE_INFINITY;

    regularLinks.forEach((link, index) => {
      const shouldHide = index >= visibleLimit;
      link.toggleAttribute('hidden', shouldHide);
    });

    this._detailColumnCount = this.detailView
      ? this._computeDetailColumnCount(regularLinks.length)
      : 1;
    this._showGeneratedMore =
      !this.detailView &&
      hasFiniteLimit &&
      regularLinks.length > visibleLimit &&
      this._getCustomMoreNodes().length === 0;
  }

  private _getResolvedCategoryId(): string {
    return this.categoryId.trim() || this.getAttribute('id')?.trim() || '';
  }

  private _emitMoreClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('on-more-click', {
        detail: {
          categoryId: this._getResolvedCategoryId(),
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleGeneratedMoreClick(e: Event) {
    this._emitMoreClick(e);
  }

  private _handleGeneratedMoreKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this._emitMoreClick(e);
    }
  }

  private _handleLinksSlotChange() {
    this._syncLinks();
  }

  private _handleMoreSlotChange() {
    this._syncLinks();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._checkForNextCategorySibling();
    this._syncLinks();

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(this._handleDetailResize);
      this._resizeObserver.observe(this);
      const categoriesHost = this.closest('kyn-header-categories');
      if (categoriesHost) {
        this._resizeObserver.observe(categoriesHost);
      }
    }
  }

  override disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    this._observedCategoriesHost = null;
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValueMap<this>) {
    if (
      changed.has('maxVisibleLinks') ||
      changed.has('detailView') ||
      changed.has('detailLinksPerColumn')
    ) {
      this._syncLinks();
    }

    // Detail opens while often still display:none / zero-width; remeasure after paint.
    if (changed.has('detailView') && this.detailView) {
      const categoriesHost = this.closest('kyn-header-categories');
      if (
        this._resizeObserver &&
        categoriesHost &&
        !this._observedCategoriesHost
      ) {
        this._resizeObserver.observe(categoriesHost);
        this._observedCategoriesHost = categoriesHost;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this._handleDetailResize());
      });
    }
  }

  override render() {
    // Add heading padding when leftPadding is set AND there's no icon (for alignment with other categories that have icons)
    const indentHeading = this.leftPadding && !this._hasIcon;
    // Indent links to align with heading text when icon is present (8px + 16px icon + 8px gap = 32px)
    const shouldIndentLinks = this._hasIcon;

    // Show divider if explicitly set, or if auto-detection finds a next category sibling
    const shouldShowDivider =
      this.showDivider || (!this.noAutoDivider && this._hasNextCategorySibling);

    // Hide heading when there's no text and no icon
    const headingText = this.detailHeading || this.heading;
    const hideHeading = !headingText && !this._hasIcon;
    const linksStyles = this.detailView
      ? {
          'column-count': String(this._detailColumnCount),
        }
      : {};

    return html`
      <div
        class="category ${shouldShowDivider ? 'divider' : ''} ${this.detailView
          ? 'detail-view'
          : ''} ${this._detailColumnCount === 1 ? 'detail-single-column' : ''}"
      >
        <div
          class="heading ${indentHeading ? 'left-padding' : ''} ${hideHeading
            ? 'empty'
            : ''}"
        >
          <slot name="icon" @slotchange=${this._handleIconSlotChange}></slot>
          ${headingText}
        </div>
        <div
          class="category__links ${shouldIndentLinks ? 'has-icon' : ''}"
          style=${styleMap(linksStyles)}
        >
          <slot @slotchange=${this._handleLinksSlotChange}></slot>
          ${this._showGeneratedMore
            ? html`
                <kyn-header-link
                  href="#"
                  @click=${this._handleGeneratedMoreClick}
                  @keydown=${this._handleGeneratedMoreKeydown}
                >
                  <span
                    style="display: inline-flex; align-items: center; gap: 8px;"
                  >
                    ${this.moreLabel} ${unsafeSVG(chevronRightIcon)}
                  </span>
                </kyn-header-link>
              `
            : null}
          <slot name="more" @slotchange=${this._handleMoreSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-header-category': HeaderCategory;
  }
}
