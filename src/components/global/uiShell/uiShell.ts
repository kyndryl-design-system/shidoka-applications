import { LitElement, html } from 'lit';
import { customElement, state, queryAssignedElements } from 'lit/decorators.js';
import UiShellScss from './uiShell.scss';

/**
 * Container to help with positioning and padding of the global elements such as: adds padding for the fixed Header, adds main content gutters, and makes Footer sticky. This takes the onus off of the consuming app to configure these values.
 * @slot unnamed - Slot for global elements.
 */
@customElement('kyn-ui-shell')
export class UiShell extends LitElement {
  static override styles = UiShellScss;

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-header' })
  _headerEl!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-local-nav' })
  _localNavEl!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'kyn-footer' })
  _footerEl!: any;

  /** @internal */
  @queryAssignedElements({ selector: 'main' })
  _mainEl!: any;

  override render() {
    return html` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }

  override firstUpdated() {
    if (this._localNavEl.length) {
      const LocalNav = this._localNavEl[0];
      const Main = this._mainEl[0];

      LocalNav.addEventListener('on-toggle', (e: any) => {
        e.detail.pinned
          ? Main.classList.add('pinned')
          : Main.classList.remove('pinned');

        if (this._footerEl.length) {
          e.detail.pinned
            ? this._footerEl[0].classList.add('pinned')
            : this._footerEl[0].classList.remove('pinned');
        }
      });
    }
  }

  private handleSlotChange() {
    const Main = this._mainEl[0];

    if (this._localNavEl.length) {
      const LocalNav = this._localNavEl[0];

      Main.classList.add('has-local-nav');

      LocalNav.pinned
        ? Main.classList.add('pinned')
        : Main.classList.remove('pinned');

      if (this._footerEl.length) {
        this._footerEl[0].classList.add('has-local-nav');

        LocalNav.pinned
          ? this._footerEl[0].classList.add('pinned')
          : this._footerEl[0].classList.remove('pinned');
      }
    } else {
      Main.classList.remove('has-local-nav');
      Main.classList.remove('pinned');

      if (this._footerEl.length) {
        this._footerEl[0].classList.remove('pinned');
      }
    }

    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ui-shell': UiShell;
  }
}
