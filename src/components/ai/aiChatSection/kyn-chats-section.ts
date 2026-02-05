import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

// Kyndryl DS icon (same you used elsewhere)
import chatHistory from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/chat-history.svg';

export interface ChatItem {
  id: string;
  title: string;
  href?: string;
}

@customElement('kyn-chats-section')
export class KynChatsSection extends LitElement {
  /** Chats to display (data-driven) */
  @property({ type: Array }) accessor chats: ChatItem[] = [];

  /** Show at most N items before "See all" appears */
  @property({ type: Number }) accessor maxVisible = 6;

  /** Link for the "See all" action. If empty, no link is rendered. */
  @property({ type: String }) accessor seeAllHref: string = '/chats';

  /** Open/closed state of the section */
  @property({ type: Boolean, reflect: true }) accessor open = true;

  /** Whether the whole side nav is collapsed; hides the body */
  @property({ type: Boolean, reflect: true }) accessor collapsed = false;

  /** Persist open/closed in localStorage under this key */
  @property({ type: String }) accessor persistKey = 'nav.chats.open';

  /** Currently selected chat id (for active row styling) */
  @property({ type: String }) accessor selectedId: string | null = null;

  /** Use two-line clamp for titles (instead of single line) */
  @property({ type: Boolean }) accessor twoLine = false;

  @state() private accessor _initialized = false;

  // Height animation refs
  private outerRef: Ref<HTMLDivElement> = createRef();
  private innerRef: Ref<HTMLDivElement> = createRef();

  // Roving tabindex for keyboard list navigation
  @state() private accessor _focusIndex: number = 0;

  static override styles = css`
    :host {
      display: block;
      --chats-collapsed-height: 220px; /* tweak to taste */
    }

    /* Header button */
    .nav-summary {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 12px;
      background: transparent;
      border: 0;
      color: inherit;
      text-align: left;
      cursor: pointer;
      border-radius: 8px;
      font: inherit;
    }
    .nav-summary:hover {
      background: var(--kd-color-background-accent-subtle, rgba(0, 0, 0, 0.04));
    }
    .nav-summary:focus-visible {
      outline: 2px solid var(--kd-color-border-variants-focus, #2563eb);
      outline-offset: 2px;
    }

    .label {
      font-weight: var(--kd-font-weight-semi, 600);
    }

    .chevron {
      margin-left: auto;
      width: 10px;
      height: 10px;
      border-right: 2px solid var(--kd-color-text-variant-placeholder, #6b7280);
      border-bottom: 2px solid var(--kd-color-text-variant-placeholder, #6b7280);
      transform: rotate(45deg);
      transition: transform 180ms ease;
    }
    :host([open]) .chevron {
      transform: rotate(-135deg);
    }

    /* Body container w/ animation */
    .panel-outer {
      overflow: hidden;
      transition: height 180ms ease;
    }
    .panel-inner {
      padding: 4px 0 6px;
    }

    /* List + items */
    .chat-list {
      list-style: none;
      margin: 8px 0 0;
      padding: 0;
    }
    .chat-btn {
      display: block;
      width: 100%;
      text-align: left;
      padding: 8px 12px 8px 40px; /* indent under the header icon/label */
      font-size: 14px;
      border: 0;
      background: transparent;
      color: inherit;
      border-radius: 8px;
      cursor: pointer;

      /* one-line truncation by default */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host([twoLine]) .chat-btn {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .chat-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .chat-btn:focus-visible {
      outline: 2px solid var(--kd-color-border-variants-focus, #2563eb);
      outline-offset: 2px;
    }

    .chat-btn.active {
      background: var(--kd-color-background-accent-subtle, rgba(0, 0, 0, 0.04));
    }

    .see-all {
      display: inline-flex;
      align-items: center;
      margin: 8px 0 0 40px;
      padding: 6px 0;
      color: var(--kd-color-text-link-default, #0f62fe);
      text-decoration: none;
      font-size: 14px;
      border-radius: 6px;
    }
    .see-all:hover {
      text-decoration: underline;
    }

    /* Hide body entirely when the nav rail is collapsed */
    :host([collapsed]) .panel-outer {
      height: var(--chats-collapsed-height) !important;
    }
    :host([collapsed]) .chat-list,
    :host([collapsed]) .see-all {
      display: none;
    }
  `;

  constructor() {
    super();
    // restore open/closed
    try {
      const saved = localStorage.getItem(this.persistKey);
      if (saved != null) this.open = saved === '1';
    } catch {
      /* ignore */
    }
  }

  override firstUpdated() {
    this._initialized = true;
    this.#syncHeight();
    const inner = this.innerRef.value;
    if (inner) {
      const ro = new ResizeObserver(() => this.#syncHeight());
      ro.observe(inner);
    }
    // Initialize focus index
    this._focusIndex = Math.min(
      this._focusIndex,
      Math.max(0, this.#visible().length - 1)
    );
  }

  override updated(changed: Map<string, unknown>) {
    if (!this._initialized) return;
    if (
      changed.has('open') ||
      changed.has('chats') ||
      changed.has('maxVisible') ||
      changed.has('collapsed')
    ) {
      this.#syncHeight();
      // Keep focus index in bounds if the visible list changed
      this._focusIndex = Math.min(
        this._focusIndex,
        Math.max(0, this.#visible().length - 1)
      );
    }
  }

  #syncHeight() {
    const outer = this.outerRef.value;
    const inner = this.innerRef.value;
    if (!outer || !inner) return;
    const target = this.collapsed ? 0 : this.open ? inner.scrollHeight : 0;
    requestAnimationFrame(() => (outer.style.height = `${target}px`));
  }

  #toggle = () => {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('chats-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      })
    );
  };

  #visible(): ChatItem[] {
    return this.chats.slice(0, this.maxVisible);
  }

  #onChatClick(item: ChatItem, e: MouseEvent) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('chat-selected', {
        detail: item,
        bubbles: true,
        composed: true,
      })
    );
  }

  // Roving tabindex for keyboard list navigation
  #onChatKeyDown(i: number, item: ChatItem, e: KeyboardEvent) {
    const visible = this.#visible();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusIndex = Math.min(i + 1, visible.length - 1);
      this.#focusRow(this._focusIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._focusIndex = Math.max(i - 1, 0);
      this.#focusRow(this._focusIndex);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#onChatClick(item, new MouseEvent('click'));
    }
  }

  #focusRow(idx: number) {
    const list =
      this.renderRoot.querySelectorAll<HTMLButtonElement>('.chat-btn');
    const el = list[idx];
    if (el) el.focus();
  }

  override render() {
    const visible = this.#visible();

    return html`
      <!-- Header -->
      <button
        class="nav-summary"
        aria-expanded=${this.open && !this.collapsed}
        aria-controls="chats-panel"
        @click=${this.#toggle}
      >
        <i aria-hidden="true">${unsafeSVG(chatHistory)}</i>
        <span class="label">Chats</span>
        <span class="chevron" aria-hidden="true"></span>
      </button>

      <!-- Collapsible body -->
      <div
        id="chats-panel"
        class="panel-outer"
        role="region"
        aria-label="Recent chats"
        ${ref(this.outerRef)}
      >
        <div class="panel-inner" ${ref(this.innerRef)}>
          <ul class="chat-list">
            ${visible.map((c, i) => {
              const isActive =
                this.selectedId != null && this.selectedId === c.id;
              // Roving tabindex: first visible row gets 0 by default (or active row if found)
              let tabindex = -1;
              if (this._focusIndex === i) tabindex = 0;
              // If selectedId exists and matches this row, prefer it for initial focus index
              if (!this._initialized && isActive) tabindex = 0;

              return html`
                <li>
                  <button
                    type="button"
                    class="chat-btn ${isActive ? 'active' : ''}"
                    title=${c.title}
                    @click=${(e: MouseEvent) => this.#onChatClick(c, e)}
                  >
                    ${c.title}
                  </button>
                </li>
              `;
            })}
          </ul>

          ${this.chats.length > visible.length && this.seeAllHref
            ? html`<a
                class="see-all"
                href=${'/'}
                @click=${() =>
                  this.dispatchEvent(
                    new CustomEvent('see-all', {
                      bubbles: true,
                      composed: true,
                    })
                  )}
                >See all</a
              >`
            : null}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-chats-section': KynChatsSection;
  }
}
