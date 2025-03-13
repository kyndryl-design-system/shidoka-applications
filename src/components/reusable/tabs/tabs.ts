import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabsScss from './tabs.scss';

/**
 * Tabs.
 * @slot unnamed - Slot for kyn-tab-panel components.
 * @slot tabs - Slot for kyn-tab components.
 * @fires on-change - Emits the new selected Tab ID when switching tabs.
 */
@customElement('kyn-tabs')
export class Tabs extends LitElement {
  static override styles = TabsScss;

  /** Tab style. `'primary'` or `'secondary'`. `'contained'` and `'line'` are now deprecated. */
  @property({ type: String })
  tabStyle = 'primary';

  /** Size of the tab buttons, `'sm'` or `'md'`. Icon size: 16px. */
  @property({ type: String })
  tabSize = 'md';

  /** Vertical orientation. */
  @property({ type: Boolean })
  vertical = false;

  /** AI specifier. */
  @property({ type: Boolean })
  aiConnected = false;

  /** Enables tab content change on focus with keyboard navigation/assistive technologies. */
  @property({ type: Boolean })
  disableAutoFocusUpdate = false;

  /** Adds scrollable overflow to the tab panels. */
  @property({ type: Boolean })
  scrollablePanels = false;

  /** Queries for slotted tabs.
   * @internal
   */
  @queryAssignedElements({ slot: 'tabs', selector: 'kyn-tab' })
  _tabs!: any;

  /** Queries for slotted tab panels.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-tab-panel' })
  _tabPanels!: any;

  override render() {
    const wrapperClasses = {
      wrapper: true,
      vertical: this.vertical,
      scrollable: this.scrollablePanels,
      [`ai-connected--${this.aiConnected}`]: true,
    };

    const tabsClasses = {
      tabs: true,
      primary: this.tabStyle === 'primary' || this.tabStyle === 'contained',
      secondary: this.tabStyle === 'secondary' || this.tabStyle === 'line',
      [`ai-connected--${this.aiConnected}`]: true,
    };

    return html`
      <div class=${classMap(wrapperClasses)}>
        <div
          class=${classMap(tabsClasses)}
          role="tablist"
          @keydown=${(e: any) => this._handleKeyboard(e)}
        >
          <slot name="tabs" @slotchange=${this._handleSlotChangeTabs}></slot>
        </div>

        <div class="panels" tabindex=${this.scrollablePanels ? '0' : '-1'}>
          <slot></slot>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('tab-activated', (e) => this._handleChange(e));
  }

  override disconnectedCallback() {
    this.removeEventListener('tab-activated', (e) => this._handleChange(e));
    super.disconnectedCallback();
  }

  override willUpdate(changedProps: any) {
    if (
      changedProps.has('tabSize') ||
      changedProps.has('vertical') ||
      changedProps.has('tabStyle') ||
      changedProps.has('aiConnected')
    ) {
      this._updateChildren();
    }
  }

  private _handleSlotChangeTabs() {
    this._updateChildren();
  }

  private _updateChildren() {
    this._tabs.forEach((tab: any) => {
      tab._size = this.tabSize;
      tab.vertical = this.vertical;
      tab.tabStyle = this.tabStyle;
      tab.aiConnected = this.aiConnected;
    });

    this._tabPanels.forEach((tabPanel: any) => {
      tabPanel.vertical = this.vertical;
    });
  }

  /**
   * Updates children and emits a change event based on the provided
   * event details when a child kyn-tab is clicked.
   * @param {any} e - The parameter "e" is an event object that contains information about the event
   * that triggered the handleChange function.
   */
  private _handleChange(e: any) {
    e.stopPropagation();
    this._updateChildrenSelection(e.detail.tabId);
    this._emitChangeEvent(e.detail.origEvent, e.detail.tabId);
  }

  /**
   * Updates the selected property of tabs and the visible property of tab panels based on
   * the selected tab ID.
   * @param {string} selectedTabId - The selectedTabId parameter is a string that represents the ID of
   * the tab that is currently selected.
   */
  private _updateChildrenSelection(selectedTabId: string, updatePanel = true) {
    // update tabs selected prop
    this._tabs.forEach((tab: any) => {
      tab.selected = tab.id === selectedTabId;
    });

    // update tab-panels visible prop
    if (!updatePanel) return;
    this._tabPanels.forEach((tabPanel: any) => {
      tabPanel.visible = tabPanel.tabId === selectedTabId;
    });
  }

  /**
   * Creates and dispatches a custom event called 'on-change' with the provided original event and
   * selected tab ID as details.
   * @param {any} origEvent - The origEvent parameter is the original event object that triggered the
   * change event. It could be any type of event object, such as a click event or a keydown event.
   * @param {string} selectedTabId - The selectedTabId parameter is a string that represents the ID of
   * the selected tab.
   */
  private _emitChangeEvent(origEvent: any, selectedTabId: string) {
    const event = new CustomEvent('on-change', {
      detail: { origEvent: origEvent, selectedTabId: selectedTabId },
    });
    this.dispatchEvent(event);
  }

  /**
   * Handles keyboard events for navigating between tabs.
   * @param {any} e - The parameter `e` is an event object that represents the keyboard event. It
   * contains information about the keyboard event, such as the key code of the pressed key.
   * @returns In this code, the function `_handleKeyboard` returns nothing in all cases
   * except when the `keyCode` matches the left or right arrow key codes.
   */
  private _handleKeyboard(e: any) {
    const LEFT_ARROW_KEY_CODE = 37;
    const UP_ARROW_KEY_CODE = 38;
    const RIGHT_ARROW_KEY_CODE = 39;
    const DOWN_ARROW_KEY_CODE = 40;
    const ENTER_KEY_CODE = 13;
    const SPACE_KEY_CODE = 32;
    const TabCount = this._tabs.length;
    const SelectedTabIndex = this._tabs.findIndex((tab: any) => tab.selected);

    switch (e.keyCode) {
      case ENTER_KEY_CODE:
      case SPACE_KEY_CODE: {
        this._updateChildrenSelection(
          this._tabs[SelectedTabIndex].id,
          this.disableAutoFocusUpdate
        );
        return;
      }
      case LEFT_ARROW_KEY_CODE:
      case UP_ARROW_KEY_CODE: {
        // activate previous tab
        let prevIndex =
          SelectedTabIndex === 0 ? TabCount - 1 : SelectedTabIndex - 1;
        let prevTab = this._tabs[prevIndex];

        if (prevTab.disabled) {
          prevIndex = prevIndex === 0 ? TabCount - 1 : prevIndex - 1;
          prevTab = this._tabs[prevIndex];
        }

        prevTab.focus();

        this._updateChildrenSelection(prevTab.id, !this.disableAutoFocusUpdate);
        this._emitChangeEvent(e, prevTab.id);
        return;
      }
      case RIGHT_ARROW_KEY_CODE:
      case DOWN_ARROW_KEY_CODE: {
        // activate next tab
        let nextIndex =
          SelectedTabIndex === TabCount - 1 ? 0 : SelectedTabIndex + 1;
        let nextTab = this._tabs[nextIndex];

        if (nextTab.disabled) {
          nextIndex = nextIndex === TabCount - 1 ? 0 : nextIndex + 1;
          nextTab = this._tabs[nextIndex];
        }

        nextTab.focus();

        this._updateChildrenSelection(nextTab.id, !this.disableAutoFocusUpdate);
        this._emitChangeEvent(e, nextTab.id);
        return;
      }
      default: {
        return;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tabs': Tabs;
  }
}
