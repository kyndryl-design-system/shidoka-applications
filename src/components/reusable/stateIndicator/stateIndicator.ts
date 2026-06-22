import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import StateIndicatorScss from './stateIndicator.scss?inline';
import { STATE_TYPES, STATE_SIZES } from './defs';

import '../button';
import '../link';

// Mascot / illustration images (large / medium) from shidoka-foundation.
import errorMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/tech-issue.svg';
import accessMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/warning.svg';
import emptyMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/emptyState/empty-state-no-data.svg';
import noResultsMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/search.svg';
import sleepMascot from '@kyndryl-design-system/shidoka-foundation/assets/svg/mascot/sleep.svg';

// Icons (small) from shidoka-icons. The Figma small variant uses the monochrome
// circle-style marks (e.g. the circle-"!" for `error`).
import errorIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/error.svg';
import accessIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/no-access.svg';
import emptyIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/box-empty.svg';
import noResultsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/search.svg';
import sleepIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/time.svg';

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
 * Type -> icon (used by the `small` size).
 * NOTE: placeholder mapping using available shidoka-icons monochrome icons; finalize per design.
 */
const ICON_MAP: Record<STATE_TYPES, string> = {
  [STATE_TYPES.ERROR]: errorIcon,
  [STATE_TYPES.ACCESS]: accessIcon,
  [STATE_TYPES.EMPTY]: emptyIcon,
  [STATE_TYPES.NO_RESULTS]: noResultsIcon,
  [STATE_TYPES.SLEEP]: sleepIcon,
};

/**
 * State Indicator (a.k.a. the "State Pattern"). Communicates a contextual
 * state (error, no access, empty, no results, sleep/idle) with an
 * illustration, header, description, and call(s) to action. Replaces the
 * deprecated `kyn-error-block` and Empty State pattern.
 * @slot header - Slot for the state header text.
 * @slot unnamed - Slot for the state description / subheader text.
 * @slot primary - Slot for the primary call to action (e.g. `kyn-button`). Always rendered.
 * @slot secondary - Slot for the secondary button. Rendered only when `size="large"` and `showSecondaryAction` is true.
 * @slot link - Slot for the secondary link (e.g. `kyn-link`). Rendered only when `size="medium"` and `showSecondaryAction` is true.
 */
@customElement('kyn-state-indicator')
export class StateIndicator extends LitElement {
  static override styles = unsafeCSS(StateIndicatorScss);

  /** The state type, which determines the illustration/icon shown. */
  @property({ type: String, reflect: true })
  accessor type: STATE_TYPES = STATE_TYPES.EMPTY;

  /** The size variant. */
  @property({ type: String, reflect: true })
  accessor size: STATE_SIZES = STATE_SIZES.LARGE;

  /**
   * Shows the secondary call to action: a secondary button on `large`,
   * or a link on `medium`. Has no effect on `small` (primary CTA only).
   */
  @property({ type: Boolean })
  accessor showSecondaryAction = false;

  /** Shows the description / subheader text. */
  @property({ type: Boolean })
  accessor showDescription = true;

  /** Shows the call(s) to action. When false, all CTAs are hidden. */
  @property({ type: Boolean })
  accessor showCTA = true;

  override render() {
    const isSmall = this.size === STATE_SIZES.SMALL;
    const visual = isSmall ? ICON_MAP[this.type] : MASCOT_MAP[this.type];

    const showSecondaryButton =
      this.size === STATE_SIZES.LARGE && this.showSecondaryAction;
    const showLink =
      this.size === STATE_SIZES.MEDIUM && this.showSecondaryAction;

    const containerClasses = {
      'state-indicator': true,
      [`state-indicator--${this.size}`]: true,
    };

    return html`
      <div class=${classMap(containerClasses)}>
        <div class="state-indicator__visual">${unsafeSVG(visual)}</div>
        <div class="state-indicator__content">
          <div class="state-indicator__text">
            <div class="state-indicator__header">
              <slot name="header"></slot>
            </div>
            ${this.showDescription
              ? html`<div class="state-indicator__description">
                  <slot></slot>
                </div>`
              : null}
          </div>
          ${this.showCTA
            ? html`<div class="state-indicator__actions">
                <slot name="primary"></slot>
                ${showSecondaryButton
                  ? html`<slot name="secondary"></slot>`
                  : null}
                ${showLink ? html`<slot name="link"></slot>` : null}
              </div>`
            : null}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-state-indicator': StateIndicator;
  }
}
