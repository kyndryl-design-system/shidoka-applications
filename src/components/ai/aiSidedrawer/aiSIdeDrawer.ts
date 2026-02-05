import { LitElement, html, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import drawerStyles from './aiSideDrawer.scss?inline';
import pinIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/side-drawer-out.svg';
import edit from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/edit.svg';
import helpIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/question.svg';
import settingsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/settings.svg';
import '../aiChatSection';
const _defaultTextStrings = {
  pin: 'Pin',
  unpin: 'Unpin',
  toggleMenu: 'Toggle Menu',
  collapse: 'Collapse',
  menu: 'Menu',
};

type TabId = 'chat' | 'history' | 'settings' | 'help' | 'new-chat';

@customElement('kyn-ai-side-drawer')
export class aiSideDrawer extends LitElement {
  @property({ type: String, attribute: 'selected-tab-id' })
  accessor selectedTabId: TabId = 'chat';
  @property({ type: Boolean, reflect: true })
  accessor collapsed = false;
  @property({ type: Boolean })
  @state()
  accessor selectedChatId: string | null = null;

  accessor pinned = false;
  @state()
  accessor _textStrings = _defaultTextStrings;
  static override styles = unsafeCSS(drawerStyles);
  toggle() {
    this.collapsed = !this.collapsed;
    this.pinned = !this.pinned;
    this.dispatchEvent(new CustomEvent('dismiss'));
  }

  private _selectTab = (id: TabId) => {
    console.log('[SideDrawer] tab clicked:', id);
    if (this.selectedTabId !== id) {
      this.selectedTabId = id;
    }
    // Bubble up so the parent can swap main content
    this.dispatchEvent(
      new CustomEvent('drawer-tab-change', {
        detail: { selectedTabId: id },
        bubbles: true,
        composed: true,
      })
    );
  };

  /** Keyboard support: Space/Enter activates */
  private _tabKeydown = (id: TabId, e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      console.log('clicked');
      this._selectTab(id);
    }
  };

  @state()
  accessor chats = [
    { id: '1', title: 'Introduction to Cloud Computing', href: '/c/1' },
    { id: '2', title: 'Cloud IT / Cloud Computing Kynd…', href: '/c/2' },
    { id: '3', title: 'Infrastructure modernization', href: '/c/3' },
    { id: '4', title: 'DevOps pipelines for IT moderniz…', href: '/c/4' },
    { id: '5', title: 'ROI analysis for VMware migra…', href: '/c/5' },
    { id: '6', title: 'Methodology of migrating VMWa…', href: '/c/6' },
    { id: '7', title: 'Another recent chat', href: '/c/7' },
  ];

  private _onChatSelected = (
    e: CustomEvent<{ id: string; title: string; href?: string }>
  ) => {
    const chat = e.detail;
    // route / analytics / set selected
    this.selectedChatId = chat.id;
  };

  close() {
    this.collapsed = true;
    this.pinned = true;
  }
  override render() {
    return html`
      <div class="side-nav">
        <!-- HEADER -->
        <div class="drawer-header">
          <div class="ai-button">
            <kyn-button kind="ghost" size="small" @click="${this.toggle}">
              <span
                class="pin-icon ${classMap({ rotated: !this.collapsed })}"
                slot="icon"
              >
                ${unsafeSVG(pinIcon)}
              </span>
            </kyn-button>
          </div>

          <div
            class="nav-item"
            role="tab"
            aria-selected=${this.selectedTabId === 'new-chat'}
            tabindex=${this.selectedTabId === 'new-chat' ? 0 : -1}
            @click=${() => this._selectTab('new-chat')}
            @keydown=${(e: KeyboardEvent) => this._tabKeydown('new-chat', e)}
          >
            <i aria-hidden="true">${unsafeSVG(edit)}</i>
            <span>New Chat</span>
          </div>
        </div>
        <!-- CONTENT -->
        <div class="drawer-content">
          <div class="chat-section">
            <kyn-chats-section
              .chats=${this.chats}
              .maxVisible=${6}
              seeAllHref="/chats"
              ?collapsed=${this.collapsed}
              .selectedId=${this.selectedChatId ?? null}
              @chat-selected=${this._onChatSelected}
              @see-all=${() => (window.location.href = '/chats')}
            ></kyn-chats-section>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="drawer-footer">
          <div
            class="nav-item"
            role="tab"
            aria-selected=${this.selectedTabId === 'help'}
            tabindex=${this.selectedTabId === 'help' ? 0 : -1}
            @click=${() => this._selectTab('help')}
            @keydown=${(e: KeyboardEvent) => this._tabKeydown('new-chat', e)}
          >
            <i>${unsafeSVG(helpIcon)}</i>
            <span>Help</span>
          </div>

          <div
            class="nav-item"
            role="tab"
            aria-selected=${this.selectedTabId === 'settings'}
            tabindex=${this.selectedTabId === 'settings' ? 0 : -1}
            @click=${() => this._selectTab('settings')}
            @keydown=${(e: KeyboardEvent) => this._tabKeydown('new-chat', e)}
          >
            <i>${unsafeSVG(settingsIcon)}</i>
            <span>Settings</span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ai-side-drawer': aiSideDrawer;
  }
}
