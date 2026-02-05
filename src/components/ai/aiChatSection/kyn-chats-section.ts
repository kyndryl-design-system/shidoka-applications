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

  /** Show at most N items (hard cap before we even try to fit) */
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

  // How many rows fit physically (computed)
  @state() private accessor _fitCount: number = 0;

  // Observers for resize
  private _hostRO?: ResizeObserver;
  private _innerRO?: ResizeObserver;

  static override styles = css`
    :host {
      display: block;
      /* Keep the component in a fixed-height area provided by the parent.
         Adjust this from the parent (or override here) as needed. */
      --chats-collapsed-height: 300px;
      --chats-notCollapsed-height: 400px;
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
      overflow: hidden; /* 🔒 no scrollbars here */
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

    /* Collapsed: hide body entirely */
    :host([collapsed]) .panel-outer {
      height: var(--chats-collapsed-height) !important;
    }

    /* Optional: keep a fixed overall height for this section when not collapsed */
    :host(:not([collapsed])) {
      height: var(--chats-notCollapsed-height) !important;
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

    // Observe the HOST for size changes (e.g., parent resizes)
    this._hostRO = new ResizeObserver(() => {
      this.#recalcVisibleByFit();
      this.#syncHeight();
    });
    this._hostRO.observe(this);

    // Observe inner content for height changes (font size, density, etc.)
    const inner = this.innerRef.value;
    if (inner) {
      this._innerRO = new ResizeObserver(() => {
        this.#recalcVisibleByFit();
        this.#syncHeight();
      });
      this._innerRO.observe(inner);
    }

    // Initial calc
    this.#recalcVisibleByFit();
    this.#syncHeight();

    // Initialize focus index
    this._focusIndex = Math.min(
      this._focusIndex,
      Math.max(0, this.#visible().length - 1)
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hostRO?.disconnect();
    this._innerRO?.disconnect();
  }

  override updated(changed: Map<string, unknown>) {
    if (!this._initialized) return;

    if (
      changed.has('open') ||
      changed.has('collapsed') ||
      changed.has('chats') ||
      changed.has('maxVisible') ||
      changed.has('twoLine')
    ) {
      // Recompute fit FIRST so syncHeight uses the post-slice height
      this.#recalcVisibleByFit();
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

    // When collapsed or closed, height is 0; otherwise match rendered content.
    const target = this.collapsed ? 0 : this.open ? inner.scrollHeight : 0;
    requestAnimationFrame(() => (outer.style.height = `${target}px`));
  }

  // Compute how many rows physically fit within the host
  #recalcVisibleByFit() {
    if (this.collapsed || !this.open) {
      this._fitCount = 0;
      return;
    }

    const hostRect = this.getBoundingClientRect();
    if (!hostRect.height || hostRect.height <= 0) {
      // When unknown, fall back to maxVisible
      this._fitCount = Math.min(this.maxVisible, this.chats.length);
      return;
    }

    // Heights to subtract from host: header + vertical paddings + "See all" (if shown)
    const header = this.renderRoot.querySelector(
      '.nav-summary'
    ) as HTMLElement | null;
    const headerH = header?.getBoundingClientRect().height ?? 0;
    const verticalPadding = 4 + 6; // from .panel-inner { padding: 4px 0 6px; }

    // First pass: fit rows ignoring "See all"
    let availableForList = hostRect.height - headerH - verticalPadding;
    if (availableForList <= 0) {
      this._fitCount = 0;
      return;
    }

    // Row height: measure a real row if present; otherwise use a reasonable fallback
    const firstRow = this.renderRoot.querySelector(
      '.chat-btn'
    ) as HTMLElement | null;
    const rowH =
      firstRow?.getBoundingClientRect().height || (this.twoLine ? 40 : 32);

    let fit = Math.floor(availableForList / rowH);
    fit = Math.max(0, Math.min(fit, this.chats.length));
    let n = Math.min(fit, this.maxVisible);

    // Decide if "See all" will be shown; if so, subtract its height and recompute
    const willShowSeeAll = this.seeAllHref && this.chats.length > n;
    if (willShowSeeAll) {
      // Measure real link if present; else conservative default
      const seeAllEl = this.renderRoot.querySelector(
        '.see-all'
      ) as HTMLElement | null;
      const seeAllH = seeAllEl?.getBoundingClientRect().height ?? 28;

      availableForList = hostRect.height - headerH - verticalPadding - seeAllH;
      if (availableForList <= 0) {
        this._fitCount = 0;
        return;
      }

      fit = Math.floor(availableForList / rowH);
      fit = Math.max(0, Math.min(fit, this.chats.length));
      n = Math.min(fit, this.maxVisible);
    }

    this._fitCount = n;
  }

  #toggle = () => {
    this.open = !this.open;
    // Persist if desired
    try {
      localStorage.setItem(this.persistKey, this.open ? '1' : '0');
    } catch {
      /* ignore */
    }
    this.dispatchEvent(
      new CustomEvent('chats-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      })
    );
  };

  #visible(): ChatItem[] {
    const n = Number.isFinite(this._fitCount)
      ? this._fitCount
      : this.maxVisible;
    return this.chats.slice(0, n);
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
    const showSeeAll = !!this.seeAllHref && this.chats.length > visible.length;

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
              let tabindex = -1;
              if (this._focusIndex === i) tabindex = 0;
              if (!this._initialized && isActive) tabindex = 0;

              return html`
                <li>
                  <button
                    type="button"
                    class="chat-btn ${isActive ? 'active' : ''}"
                    title=${c.title}
                    @click=${(e: MouseEvent) => this.#onChatClick(c, e)}
                    @keydown=${(e: KeyboardEvent) =>
                      this.#onChatKeyDown(i, c, e)}
                    tabindex=${tabindex}
                    aria-current=${isActive ? 'true' : 'false'}
                  >
                    ${c.title}
                  </button>
                </li>
              `;
            })}
          </ul>

          ${showSeeAll
            ? html`<a
                class="see-all"
                href=${this.seeAllHref}
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
