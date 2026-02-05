import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type ActivityStatus = 'done' | 'in-progress' | 'pending';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  status?: ActivityStatus;
}

@customElement('kyn-activity-panel-ai')
export class KynActivityPanel extends LitElement {
  /** Controls visibility of the panel */
  @property({ type: Boolean, reflect: true }) accessor open = true; // NEW

  /** Title text if no `slot="title"` content is provided. */
  @property({ type: String }) accessor activityTitle: string = 'Activity';

  @property({ type: String }) accessor subtitleText: string = '';

  /** Optional list of items to render if no body content is slotted. */
  @property({ type: Array }) accessor items: ActivityItem[] = [];

  /** Show a close button in the header */
  @property({ type: Boolean }) accessor dismissible: boolean = true;

  /** When true, uses two-line clamp on titles (otherwise single-line). */
  @property({ type: Boolean, attribute: 'two-line' }) accessor twoLine = false;

  /** Detect if the consumer provided custom body content. */
  @state() private accessor _hasBodySlot = false;

  /** Detect if a custom title slot is provided. */
  @state() private accessor _hasTitleSlot = false;

  @state() private accessor _hasSubtitleSlot = false;

  accessor bodyNodes!: Node[];
  accessor titleNodes!: Node[];
  accessor subtitleNodes!: Node[];

  static override styles = css`
    :host {
      display: block;
      border-radius: 12px;
      background: var(--kd-color-background-container-subtle, #f5f4f3);
      color: var(--kd-color-text-default, #111);
      border: 1px solid var(--kd-color-border-ui-default, rgba(0, 0, 0, 0.08));
      height: 100%;
      max-block-size: 100%;
      min-block-size: 0;
    }

    /* Hide when not open (but keep in DOM for accessibility & transitions) */
    :host(:not([open])) {
      display: none;
    }

    .panel {
      display: flex;
      flex-direction: column;
      block-size: 100%;
      min-block-size: 0;
      height: 100%;
    }

    /* Header */

    .header {
      display: flex;
      flex-direction: column; /* subtitle sits below */
      gap: 6px;
      padding: 12px 16px;
    }

    .header-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0; /* allows title ellipsis */
    }

    /* Title grows, pushes the X to the end */
    .title {
      flex: 1 1 auto;
      min-width: 0;
      font-weight: var(--kd-font-weight-semi, 600);
      font-size: 16px;
      line-height: 1.2;
      /* remove margin-right: auto; not needed anymore */
      margin-right: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .close-btn {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      background: transparent;
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      color: inherit;
      flex: 0 0 auto; /* keep tight to the right */
    }

    .close-btn:hover {
      background: var(--kd-color-background-accent-subtle, rgba(0, 0, 0, 0.05));
    }

    .close-btn:focus-visible {
      outline: 2px solid var(--kd-color-border-variants-focus, #2563eb);
      outline-offset: 2px;
    }

    .subtitle {
      margin-top: 2px;
      font-size: 14px;
      line-height: 1.4;
      font-weight: 400;
      color: var(--kd-color-text-level-secondary, #6f6f6f);
      max-width: 100%;
      white-space: normal; /* wraps on next line */
    }

    .close-btn {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      background: transparent;
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      color: inherit;
    }
    .close-btn:hover {
      background: var(--kd-color-background-accent-subtle, rgba(0, 0, 0, 0.05));
    }
    .close-btn:focus-visible {
      outline: 2px solid var(--kd-color-border-variants-focus, #2563eb);
      outline-offset: 2px;
    }

    /* Divider */
    .divider {
      height: 1px;
      background: var(--kd-color-border-variants-light, rgba(0, 0, 0, 0.08));
      margin: 0 12px;
      flex: 0 0 auto;
    }

    /* Body owns scroll */
    .body {
      padding: 8px 12px 16px;
      flex: 1 1 auto;
      min-block-size: 0;
      overflow: auto;
    }

    /* Default list rendering (when items[] is used) */
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }

    .row {
      display: grid;
      grid-template-columns: 20px 1fr;
      gap: 10px;
      align-items: start;
      color: var(--kd-color-text-default, #111);
    }

    .row-title {
      font-weight: var(--kd-font-weight-semi, 600);
      font-size: 14px;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host([two-line]) .row-title {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .row-desc {
      margin: 2px 0 0 0;
      font-size: 13px;
      color: var(--kd-color-text-level-secondary, #4b5563);
    }

    /* Icons */
    .icon {
      height: 20px;
      width: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }
    .check {
      color: var(--kd-color-status-positive, #12a44b);
    }
    .spinner {
      color: var(--kd-color-text-level-secondary, #6b7280);
      position: relative;
    }
    .spinner::before {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px dashed currentColor;
      animation: spin 1.1s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  override firstUpdated() {
    this._updateSlotFlags();

    // Close on Esc when dismissible and open // NEW
    this.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.dismissible || !this.open) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.stopPropagation();
        this.close();
      }
    });
    // Ensure the host can receive key events if focused
    this.setAttribute('tabindex', this.getAttribute('tabindex') ?? '-1'); // optional
  }

  private _onSlotsChanged = () => {
    this._updateSlotFlags();
  };

  private _updateSlotFlags() {
    this._hasBodySlot = (this.bodyNodes?.length ?? 0) > 0;
    this._hasTitleSlot = (this.titleNodes?.length ?? 0) > 0;
    this._hasSubtitleSlot = (this.subtitleNodes?.length ?? 0) > 0;
  }

  /** Public API: open programmatically */ // NEW
  public openPanel() {
    if (!this.open) {
      this.open = true;
      this._emitOpen();
      this._emitToggle();
    }
  }

  /** Public API: close programmatically */ // NEW
  public close() {
    if (this.open) {
      this.open = false;
      this._emitClose();
      this._emitToggle();
    }
  }

  /** Public API: toggle programmatically */ // NEW
  public toggle() {
    this.open ? this.close() : this.openPanel();
  }

  /** Emitters */ // NEW
  private _emitOpen() {
    this.dispatchEvent(
      new CustomEvent('activity-open', { bubbles: true, composed: true })
    );
  }
  private _emitClose() {
    this.dispatchEvent(
      new CustomEvent('activity-close', { bubbles: true, composed: true })
    );
  }
  private _emitToggle() {
    this.dispatchEvent(
      new CustomEvent('activity-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      })
    );
  }

  /** Click handler for the X */ // NEW
  private _onDismiss = () => {
    if (!this.dismissible) return;
    this.close();
  };

  private _renderIcon(status?: ActivityStatus) {
    switch (status) {
      case 'done':
        return html`
          <span class="icon check" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8.5"
                stroke="currentColor"
                stroke-width="1.5"
              ></circle>
              <path
                d="M6 10.4l2.6 2.6L14.2 7.6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
        `;
      case 'in-progress':
        return html`<span class="icon spinner" aria-hidden="true"></span>`;
      case 'pending':
      default:
        return html`
          <span class="icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8.5"
                stroke="currentColor"
                stroke-width="1.5"
              ></circle>
            </svg>
          </span>
        `;
    }
  }

  private _renderItems() {
    if (!this.items?.length) return nothing;
    return html`
      <ul class="list">
        ${this.items.map(
          (it) => html`
            <li class="row">
              ${this._renderIcon(it.status)}
              <div>
                <p class="row-title">${it.title}</p>
                ${it.description
                  ? html`<p class="row-desc">${it.description}</p>`
                  : nothing}
              </div>
            </li>
          `
        )}
      </ul>
    `;
  }

  override render() {
    const label = this.ariaLabel ?? this.activityTitle ?? 'Activity';
    const showSubtitle = this._hasSubtitleSlot || !!this.subtitleText;

    return html`
      <section
        class="panel"
        aria-label=${label}
        aria-hidden=${String(!this.open)}
      >
        <header class="header">
          <div class="header-row">
            <div class="title">
              <slot name="title" @slotchange=${this._onSlotsChanged}>
                ${this.activityTitle}
              </slot>
            </div>

            ${this.dismissible
              ? html`
                  <button
                    class="close-btn"
                    @click=${this._onDismiss}
                    aria-label="Close activity panel"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 5l10 10M15 5L5 15"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                `
              : nothing}
          </div>

          ${showSubtitle
            ? html`
                <div class="subtitle">
                  <slot name="subtitle" @slotchange=${this._onSlotsChanged}>
                    ${this.subtitleText}
                  </slot>
                </div>
              `
            : nothing}
        </header>

        <div class="body">
          <slot @slotchange=${this._onSlotsChanged}></slot>
          ${this._hasBodySlot ? nothing : this._renderItems()}
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-activity-panel-ai': KynActivityPanel; // FIXED name
  }
}
