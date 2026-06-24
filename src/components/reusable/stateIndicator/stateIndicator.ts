import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import StateIndicatorScss from './stateIndicator.scss?inline';
import { STATE_TYPES, STATE_SIZES } from './defs';

// Mascot / illustration images (large / medium) from shidoka-foundation.
import errorMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/tech-issue.svg';
import accessMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/warning.svg';
import emptyMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/emptyState/empty-state-no-data.svg';
import noResultsMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/search.svg';
import sleepMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/sleep.svg';

// Icons (small) from shidoka-icons. The Figma small variant uses the duotone
// 48px marks (added in shidoka-icons 2.26.0). There is no `sleep` duotone mark;
// `sleep` is unsupported on `small` and falls back to `empty` before lookup.
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/error.svg';
import accessIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/no-access.svg';
import emptyIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/box-empty.svg';
import noResultsIcon from '@kyndryl-design-system/shidoka-icons/svg/duotone/48/data-search.svg';

/**
 * Type -> mascot / illustration image (used by `large` and `medium` sizes).
 */
const MASCOT_MAP: Record<STATE_TYPES, string> = {
  [STATE_TYPES.ERROR]: errorMascot,
  [STATE_TYPES.ACCESS]: accessMascot,
  [STATE_TYPES.EMPTY]: emptyMascot,
  [STATE_TYPES.NO_RESULTS]: noResultsMascot,
  [STATE_TYPES.SLEEP]: sleepMascot,
};

/**
 * Type -> duotone icon (used by the `small` size). The small variant provides
 * only four marks; `sleep` has no duotone equivalent and falls back to `empty`.
 */
const ICON_MAP: Record<Exclude<STATE_TYPES, STATE_TYPES.SLEEP>, string> = {
  [STATE_TYPES.ERROR]: errorIcon,
  [STATE_TYPES.ACCESS]: accessIcon,
  [STATE_TYPES.EMPTY]: emptyIcon,
  [STATE_TYPES.NO_RESULTS]: noResultsIcon,
};

/**
 * State Indicator. Communicates a contextual
 * state (error, no access, empty, no results, sleep/idle) with an
 * illustration, header, description, and call(s) to action. Replaces the
 * deprecated `kyn-error-block` and Empty State guidance.
 * @slot header - Slot for the state header text.
 * @slot unnamed - Slot for the state description / subheader text.
 * @slot primary - Slot for the primary call to action (e.g. `kyn-button`).
 * @slot secondary - Slot for the secondary button. Rendered only when `size="large"`.
 * @slot link - Slot for the secondary link (e.g. `kyn-link`). Rendered only when `size="medium"`.
 * @csspart visual - The illustration / icon container. Exposed so consumers can standardize its height when aligning multiple instances (e.g. in a grid).
 */
@customElement('kyn-state-indicator')
export class StateIndicator extends LitElement {
  static override styles = unsafeCSS(StateIndicatorScss);

  /**
   * The state type, which determines the illustration/icon shown.
   * Note: `sleep` is only supported on `size="large"`; on `medium` / `small`
   * it falls back to `empty`.
   */
  @property({ type: String })
  accessor type: STATE_TYPES = STATE_TYPES.EMPTY;

  /** The size variant. */
  @property({ type: String })
  accessor size: STATE_SIZES = STATE_SIZES.LARGE;

  /** Hides the description / subheader text. */
  @property({ type: Boolean })
  accessor hideDescription = false;

  /** Hides all call(s) to action. */
  @property({ type: Boolean })
  accessor hideActionsBtns = false;

  /** Hides the secondary call to action (large secondary button or medium link). */
  @property({ type: Boolean })
  accessor hideSecondaryAction = false;

  /**
   * Tracks whether the primary action slot has content.
   * @internal
   */
  @state()
  accessor _hasPrimaryAction = false;

  /**
   * Tracks whether the large secondary action slot has content.
   * @internal
   */
  @state()
  accessor _hasSecondaryAction = false;

  /**
   * Tracks whether the medium link action slot has content.
   * @internal
   */
  @state()
  accessor _hasLinkAction = false;

  override render() {
    const isSmall = this.size === STATE_SIZES.SMALL;

    // `sleep` is only supported on the `large` size; fall back to `empty`
    // for `medium` / `small`.
    const type =
      this.type === STATE_TYPES.SLEEP && this.size !== STATE_SIZES.LARGE
        ? STATE_TYPES.EMPTY
        : this.type;

    // `type` is already narrowed away from `sleep` for non-large sizes above.
    const visual = isSmall
      ? ICON_MAP[type as Exclude<STATE_TYPES, STATE_TYPES.SLEEP>]
      : MASCOT_MAP[type];

    const showSecondaryButton =
      this.size === STATE_SIZES.LARGE && !this.hideSecondaryAction;
    const showLink =
      this.size === STATE_SIZES.MEDIUM && !this.hideSecondaryAction;
    const hasVisibleActions =
      this._hasPrimaryAction ||
      (showSecondaryButton && this._hasSecondaryAction) ||
      (showLink && this._hasLinkAction);

    const containerClasses = {
      'state-indicator': true,
      [`state-indicator--${this.size}`]: true,
    };

    const visualClasses = {
      'state-indicator__visual': true,
      [`state-indicator__visual--${type}`]: true,
    };

    return html`
      <div class=${classMap(containerClasses)}>
        <div class=${classMap(visualClasses)} part="visual" aria-hidden="true">
          ${unsafeSVG(visual)}
        </div>
        <div class="state-indicator__content">
          <div class="state-indicator__text">
            <div class="state-indicator__header">
              <slot name="header"></slot>
            </div>
            ${!this.hideDescription
              ? html`<div class="state-indicator__description">
                  <slot></slot>
                </div>`
              : null}
          </div>
          ${!this.hideActionsBtns
            ? html`<div
                class="state-indicator__actions"
                ?hidden=${!hasVisibleActions}
              >
                <slot
                  name="primary"
                  @slotchange=${this._handleActionSlotChange}
                ></slot>
                ${showSecondaryButton
                  ? html`<slot
                      name="secondary"
                      @slotchange=${this._handleActionSlotChange}
                    ></slot>`
                  : null}
                ${showLink
                  ? html`<slot
                      name="link"
                      @slotchange=${this._handleActionSlotChange}
                    ></slot>`
                  : null}
              </div>`
            : null}
        </div>
      </div>
    `;
  }

  /**
   * Syncs action wrapper visibility with slotted CTA content.
   * @internal
   */
  _handleActionSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const hasAssignedContent =
      slot.assignedElements({ flatten: true }).length > 0;

    switch (slot.name) {
      case 'primary':
        this._hasPrimaryAction = hasAssignedContent;
        break;
      case 'secondary':
        this._hasSecondaryAction = hasAssignedContent;
        break;
      case 'link':
        this._hasLinkAction = hasAssignedContent;
        break;
      default:
        break;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-state-indicator': StateIndicator;
  }
}
