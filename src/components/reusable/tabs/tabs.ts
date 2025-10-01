import { LitElement, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import TabsScss from './tabs.scss?inline';

/**
 * Tabs.
 * @slot unnamed - Slot for kyn-tab-panel components.
 * @slot tabs - Slot for kyn-tab components.
 * @fires on-change - Emits the new selected Tab ID when switching tabs. `detail:{ origEvent: PointerEvent,selectedTabId: string }`
 */
@customElement('kyn-tabs')
export class Tabs extends LitElement {
  static override styles = unsafeCSS(TabsScss);

  /** Size of the tab buttons, `'sm'` or `'md'`. Icon size: 16px. */
  @property({ type: String })
  accessor tabSize = 'md';

  /** Vertical orientation. */
  @property({ type: Boolean })
  accessor vertical = false;

  /** AI specifier. */
  @property({ type: Boolean })
  accessor aiConnected = false;

  /** Enables tab content change on focus with keyboard navigation/assistive technologies. */
  @property({ type: Boolean })
  accessor disableAutoFocusUpdate = false;

  /** Adds scrollable overflow to the tab panels. */
  @property({ type: Boolean })
  accessor scrollablePanels = false;

  /** Queries for slotted tabs.
   * @internal
   */
  @queryAssignedElements({ slot: 'tabs', selector: 'kyn-tab' })
  accessor _tabs!: Array<
    HTMLElement & {
      id: string;
      selected: boolean;
      disabled: boolean;
      tabIndex: number;
      focus: () => void;
      _size?: 'sm' | 'md';
      vertical?: boolean;
      aiConnected?: boolean;
    }
  >;

  /** Queries for slotted tab panels.
   * @internal
   */
  @queryAssignedElements({ selector: 'kyn-tab-panel' })
  accessor _tabPanels!: Array<
    HTMLElement & {
      tabId: string;
      visible: boolean;
      vertical?: boolean;
    }
  >;

  private readonly _onTabActivated = (e: Event) => {
    e.stopPropagation();
    const detail = (e as CustomEvent<{ origEvent: Event; tabId: string }>)
      .detail;
    this._updateChildrenSelection(detail.tabId);
    this._emitChangeEvent(detail.origEvent, detail.tabId);
  };

  private readonly _onKeydownCapture = (e: KeyboardEvent) =>
    this._handleKeyboard(e);

  override render() {
    const wrapperClasses = {
      wrapper: true,
      vertical: this.vertical,
      scrollable: this.scrollablePanels,
      'ai-connected': this.aiConnected,
    };

    const tabsClasses = {
      tabs: true,
      'ai-connected': this.aiConnected,
    };

    return html`
      <div class=${classMap(wrapperClasses)}>
        <div class=${classMap(tabsClasses)} role="tablist">
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
    this.addEventListener('tab-activated', this._onTabActivated);
    this.addEventListener('keydown', this._onKeydownCapture, true);
  }

  override disconnectedCallback() {
    this.removeEventListener('tab-activated', this._onTabActivated);
    this.removeEventListener('keydown', this._onKeydownCapture, true);
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this._initializeSelectionAndFocus();
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    if (
      changedProps.has('tabSize') ||
      changedProps.has('vertical') ||
      changedProps.has('aiConnected')
    ) {
      this._updateChildren();
    }
  }

  private _handleSlotChangeTabs() {
    this._updateChildren();
    this._initializeSelectionAndFocus();
  }

  private _updateChildren() {
    this._tabs.forEach((tab) => {
      tab._size = (this.tabSize as 'sm' | 'md') ?? 'md';
      tab.vertical = this.vertical;
      tab.aiConnected = this.aiConnected;
    });

    this._tabPanels.forEach((tabPanel) => {
      tabPanel.vertical = this.vertical;
    });
  }

  private _enabledIdxFrom(start: number, dir: 1 | -1): number {
    const n = this._tabs.length;
    let i = start;
    for (let step = 0; step < n; step++) {
      i = (i + dir + n) % n;
      if (!this._tabs[i].disabled) return i;
    }
    return start;
  }

  private _selectedIndex(): number {
    return this._tabs.findIndex((t) => t.selected);
  }

  private _focusableIndex(): number {
    return this._tabs.findIndex((t) => t.tabIndex === 0);
  }

  private _setFocusIndex(index: number) {
    this._tabs.forEach((t, i) => {
      t.tabIndex = !t.disabled && i === index ? 0 : -1;
    });
    this._tabs[index]?.focus();
  }

  private _ensureSelectedOrFirstEnabled() {
    const sel = this._selectedIndex();
    if (sel >= 0 && !this._tabs[sel].disabled) {
      this._setFocusIndex(sel);
      return;
    }
    const firstEnabled = this._tabs.findIndex((t) => !t.disabled);
    if (firstEnabled >= 0) this._setFocusIndex(firstEnabled);
  }

  private _initializeSelectionAndFocus() {
    this._ensureSelectedOrFirstEnabled();

    // Sync panel visibility to current selection
    const sel = this._selectedIndex();
    if (sel >= 0) this._syncPanels(this._tabs[sel].id);
  }

  /**
   * Updates the selected property of tabs and the visible property of tab panels based on
   * the selected tab ID.
   * @param {string} selectedTabId - The selectedTabId parameter is a string that represents the ID of
   * the tab that is currently selected.
   */
  private _updateChildrenSelection(selectedTabId: string, updatePanel = true) {
    // update tabs selected prop
    this._tabs.forEach((tab) => {
      tab.selected = tab.id === selectedTabId;
      tab.tabIndex = !tab.disabled && tab.selected ? 0 : -1;
    });

    // update tab-panels visible prop
    if (!updatePanel) return;
    this._syncPanels(selectedTabId);
  }

  private _syncPanels(selectedTabId: string) {
    this._tabPanels.forEach((tabPanel) => {
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
  private _emitChangeEvent(origEvent: Event, selectedTabId: string) {
    const event = new CustomEvent('on-change', {
      detail: { origEvent, selectedTabId },
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
  private _handleKeyboard(e: KeyboardEvent) {
    const LEFT_ARROW_KEY_CODE = 37;
    const UP_ARROW_KEY_CODE = 38;
    const RIGHT_ARROW_KEY_CODE = 39;
    const DOWN_ARROW_KEY_CODE = 40;
    const ENTER_KEY_CODE = 13;
    const SPACE_KEY_CODE = 32;
    const TAB_KEY_CODE = 9;

    if (!this._tabs?.length) return;

    const n = this._tabs.length;
    const focusIdx =
      this._focusableIndex() >= 0
        ? this._focusableIndex()
        : this._selectedIndex() >= 0
        ? this._selectedIndex()
        : 0;

    const emitAndMaybeUpdate = (idx: number) => {
      if (!this.disableAutoFocusUpdate) {
        this._updateChildrenSelection(this._tabs[idx].id, true);
        this._emitChangeEvent(e, this._tabs[idx].id);
      }
    };

    switch (e.keyCode) {
      case TAB_KEY_CODE: {
        e.preventDefault();
        const forward = !e.shiftKey;
        const target = this._enabledIdxFrom(focusIdx, forward ? 1 : -1);
        this._setFocusIndex(target);
        emitAndMaybeUpdate(target);
        return;
      }
      case LEFT_ARROW_KEY_CODE:
      case UP_ARROW_KEY_CODE: {
        e.preventDefault();
        const target = this._enabledIdxFrom(focusIdx, -1);
        this._setFocusIndex(target);
        emitAndMaybeUpdate(target);
        return;
      }
      case RIGHT_ARROW_KEY_CODE:
      case DOWN_ARROW_KEY_CODE: {
        e.preventDefault();
        const target = this._enabledIdxFrom(focusIdx, 1);
        this._setFocusIndex(target);
        emitAndMaybeUpdate(target);
        return;
      }
      case ENTER_KEY_CODE:
      case SPACE_KEY_CODE: {
        e.preventDefault();
        const idx = focusIdx % n;
        this._updateChildrenSelection(this._tabs[idx].id, true);
        this._emitChangeEvent(e, this._tabs[idx].id);
        return;
      }
      default:
        return;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tabs': Tabs;
  }
}
