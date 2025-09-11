import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  resolveNestedWidth,
  computeSubmenuPosition,
  SubmenuStack,
} from '../../../common/helpers/overflowMenu.utils';

@customElement('kyn-overflow-submenu')
export class OverflowSubmenu extends LitElement {
  static override styles = css`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
  `;

  /** Parent container rect space (the parent passes its `.overflow-menu` element). */
  @property({ attribute: false })
  accessor container: HTMLElement | null = null;

  /** Align context. */
  @property({ type: Boolean })
  accessor anchorRight = false;

  /** Width rules. */
  @property({ type: String })
  accessor nestedWidth: string | null = 'match-parent';

  /** Style variant. */
  @property({ type: String })
  accessor kind: 'ai' | 'default' = 'default';

  private _stack = new SubmenuStack();
  private _anchor: HTMLElement | null = null;
  private _hoverOpenDelay = 140;
  private _hoverCloseDelay = 520;
  private _hoverTimer: number | null = null;
  private _closeTimer: number | null = null;
  private _containerBound = false;

  openFor(host: HTMLElement, provided: HTMLElement | HTMLTemplateElement) {
    if (!this.container) return;

    if (!this._containerBound) {
      this._containerBound = true;

      this.container.addEventListener(
        'pointerenter',
        () => {
          this._cancelScheduledClose();
        },
        true
      );

      this.container.addEventListener(
        'pointerleave',
        (e: PointerEvent) => {
          const to = e.relatedTarget as EventTarget | null;
          if (this.containsNode(to)) return;
          this._scheduleCloseDeepest();
        },
        true
      );
    }

    const rootMenu = this.container.querySelector(
      '.menu'
    ) as HTMLElement | null;
    const menus = this._stack.menus();
    const inRoot = !!rootMenu && rootMenu.contains(host);

    let parentDepth = -1;
    for (let i = menus.length - 1; i >= 0; i--) {
      if (menus[i].contains(host)) {
        parentDepth = i;
        break;
      }
    }

    if (inRoot && this._stack.len() > 0) {
      const sameRootAnchor =
        this._stack.top()?.anchor === host ||
        (this._stack.len() >= 1 &&
          (this as any)._stack['s']?.[0]?.anchor === host);

      if (sameRootAnchor) {
        this.closeFrom(1);
        this._anchor = host;
        this.reposition();
        return;
      }

      this.closeFrom(0);
    } else if (parentDepth >= 0) {
      this.closeFrom(parentDepth + 1);
    } else {
      this.closeFrom(0);
    }

    const submenu = document.createElement('div');
    submenu.className = 'menu nested';
    submenu.setAttribute('role', 'menu');
    submenu.setAttribute('aria-orientation', 'vertical');
    if (this.kind === 'ai') submenu.classList.add('ai-connected');

    if (provided instanceof HTMLTemplateElement) {
      submenu.appendChild(provided.content.cloneNode(true));
    } else {
      submenu.append(
        ...Array.from(provided.childNodes).map((n) => n.cloneNode(true))
      );
    }

    submenu.addEventListener(
      'on-click',
      (e: Event) => {
        const ce = e as CustomEvent<{ nested?: boolean }>;
        if (ce.detail?.nested) return;
        requestAnimationFrame(() => this.closeAll());
        this.dispatchEvent(
          new CustomEvent('submenu-menu-item-selected', {
            bubbles: true,
            composed: true,
          })
        );
      },
      { capture: true }
    );

    submenu.addEventListener(
      'pointerenter',
      ((ev: Event) => {
        this._cancelScheduledClose();

        const path = (ev as any).composedPath?.() ?? [];
        const nestedTrigger = path.find(
          (n: unknown) =>
            n instanceof HTMLElement &&
            n.tagName.toLowerCase() === 'kyn-overflow-menu-item'
        ) as HTMLElement | undefined;

        if (!nestedTrigger || !nestedTrigger.hasAttribute('nested')) return;

        if (this._hoverTimer) {
          window.clearTimeout(this._hoverTimer);
          this._hoverTimer = null;
        }
        this._hoverTimer = window.setTimeout(() => {
          const nextProvided =
            (nestedTrigger.querySelector('[slot="submenu"]') as
              | HTMLElement
              | HTMLTemplateElement
              | null) ?? null;
          if (nextProvided) this.openFor(nestedTrigger, nextProvided);
        }, this._hoverOpenDelay);
      }) as EventListener,
      true
    );

    this.container.appendChild(submenu);
    this._stack.push({ menu: submenu as HTMLDivElement, anchor: host });
    this._anchor = host;
    host.setAttribute('aria-expanded', 'true');

    this.reposition();
    requestAnimationFrame(() => submenu.classList.add('open'));
  }

  reposition() {
    const top = this._stack.top();
    if (!top || !this.container || !this._anchor) return;

    const contRect = this.container.getBoundingClientRect();
    const parentRect =
      this._stack.prev()?.menu.getBoundingClientRect() ??
      (
        this.container.querySelector('.menu') as HTMLElement
      ).getBoundingClientRect();

    const resolved = resolveNestedWidth(
      this,
      this.nestedWidth,
      parentRect.width
    );
    if (resolved) top.menu.style.width = resolved;
    else top.menu.style.removeProperty('width');

    const widthPx =
      parseFloat(resolved || '') ||
      top.menu.getBoundingClientRect().width ||
      parentRect.width;

    const cs = getComputedStyle(this);
    const gapR =
      parseFloat(cs.getPropertyValue('--kyn-overflow-gap-right') || '') || 8;
    const gapL =
      parseFloat(cs.getPropertyValue('--kyn-overflow-gap-left') || '') || 8;

    const pos = computeSubmenuPosition({
      containerRect: contRect,
      parentRect,
      anchorRect: this._anchor.getBoundingClientRect(),
      widthPx,
      anchorRight: this.anchorRight,
      depth: this._stack.len(),
      gapL,
      gapR,
      viewportW: window.innerWidth,
    });

    top.menu.style.left = `${pos.left}px`;
    top.menu.style.top = `${pos.top}px`;
    this.setAttribute('data-align', pos.align);
  }

  closeFrom(startDepth: number) {
    this._stack.popFrom(startDepth);
    const top = this._stack.top();
    this._anchor = top?.anchor ?? null;
    if (!top) this.removeAttribute('data-align');
  }

  closeAll() {
    this._stack.clearAll();
    this._anchor = null;
    this.removeAttribute('data-align');
  }

  closeDeepest() {
    if (this._stack.len() > 0) this.closeFrom(this._stack.len() - 1);
  }

  topAnchor() {
    return this._stack.top()?.anchor ?? null;
  }

  containsNode(node: Node | EventTarget | null): boolean {
    if (!node || !(node instanceof Node)) return false;
    if (this.container?.contains(node)) return true;
    return this._stack.menus().some((m) => m.contains(node));
  }

  private _scheduleCloseDeepest() {
    this._cancelScheduledClose();
    this._closeTimer = window.setTimeout(() => {
      this.closeDeepest();
    }, this._hoverCloseDelay);
  }

  private _cancelScheduledClose() {
    if (this._closeTimer) {
      window.clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'kyn-overflow-submenu': OverflowSubmenu;
  }
}
