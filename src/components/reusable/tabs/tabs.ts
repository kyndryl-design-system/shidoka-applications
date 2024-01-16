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

  /** Tab contained style type. */
  @property({ type: Boolean })
  contained = false;

  /** Size of the tab buttons. Icon sizes: 16px sm, 24px md, 32px lg. */
  @property({ type: String })
  tabSize = 'md';

  /** Vertical orientation. */
  @property({ type: Boolean })
  vertical = false;

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
    const classes = {
      wrapper: true,
      contained: this.contained,
      'size--sm': this.tabSize === 'sm',
      'size--md': this.tabSize === 'md',
      'size--lg': this.tabSize === 'lg',
      vertical: this.vertical,
    };

    return html`
      <div class=${classMap(classes)}>
        <div
          class="tabs"
          role="tablist"
          @keydown=${(e: any) => this._handleKeyboard(e)}
        >
          <slot name="tabs" @slotchange=${this._handleSlotChangeTabs}></slot>
        </div>

        <div class="panels">
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
    if (changedProps.has('tabSize')) {
      this._updateChildren();
    }
  }

  private _handleSlotChangeTabs() {
    this._updateChildren();
  }

  private _updateChildren() {
    this._tabs.forEach((tab: any) => {
      tab._size = this.tabSize;
    });
  }

  /**
   * Updates children and emits a change event based on the provided
   * event details when a child kyn-tab is clicked.
   * @param {any} e - The parameter "e" is an event object that contains information about the event
   * that triggered the handleChange function.
   */
  private _handleChange(e: any) {
    this._updateChildrenSelection(e.detail.tabId);
    this._emitChangeEvent(e.detail.origEvent, e.detail.tabId);
  }

  /**
   * Updates the selected property of tabs and the visible property of tab panels based on
   * the selected tab ID.
   * @param {string} selectedTabId - The selectedTabId parameter is a string that represents the ID of
   * the tab that is currently selected.
   */
  private _updateChildrenSelection(selectedTabId: string) {
    // update tabs selected prop
    this._tabs.forEach((tab: any) => {
      tab.selected = tab.id === selectedTabId;
    });

    // update tab-panels visible prop
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
    const RIGHT_ARROW_KEY_CODE = 39;
    const TabCount = this._tabs.length;
    const SelectedTabIndex = this._tabs.findIndex((tab: any) => tab.selected);

    switch (e.keyCode) {
      case LEFT_ARROW_KEY_CODE: {
        // activate previous tab
        const PrevIndex =
          SelectedTabIndex === 0 ? TabCount - 1 : SelectedTabIndex - 1;
        const PrevTab = this._tabs[PrevIndex];
        PrevTab.focus();

        this._updateChildrenSelection(PrevTab.id);
        this._emitChangeEvent(e, PrevTab.id);

        return;
      }
      case RIGHT_ARROW_KEY_CODE: {
        // activate next tab
        const NextIndex =
          SelectedTabIndex === TabCount - 1 ? 0 : SelectedTabIndex + 1;
        const NextTab = this._tabs[NextIndex];

        NextTab.focus();

        this._updateChildrenSelection(NextTab.id);
        this._emitChangeEvent(e, NextTab.id);

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
