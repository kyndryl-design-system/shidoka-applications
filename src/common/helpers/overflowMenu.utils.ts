export type Align = 'left' | 'right';

export function toCssSize(
  v: string | number | null | undefined
): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  if (!s || s === 'auto') return null;
  if (/^\d+(\.\d+)?(px|rem|em|ch|vw|vh|%|vmin|vmax)$/.test(s)) return s;
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
}

export function resolveParentWidth(
  host: HTMLElement,
  width: string | null
): string | null {
  const propW = toCssSize(width);
  if (propW) return propW;
  const varW =
    getComputedStyle(host)
      .getPropertyValue('--kyn-overflow-menu-width')
      ?.trim() || '';
  return varW || null;
}

export function resolveNestedWidth(
  host: HTMLElement,
  nestedWidth: string | null,
  parentPixelWidth: number
): string | null {
  const nw = (nestedWidth ?? '').trim();
  if (nw === 'match-parent') return `${Math.max(parentPixelWidth, 0)}px`;
  const coerced = toCssSize(nw || null);
  if (coerced) return coerced;
  const varW =
    getComputedStyle(host)
      .getPropertyValue('--kyn-overflow-submenu-width')
      ?.trim() || '';
  return varW || null;
}

export interface PositionInput {
  containerRect: DOMRect;
  parentRect: DOMRect;
  anchorRect: DOMRect;
  widthPx: number;
  anchorRight: boolean;
  depth: number;
  gapL: number;
  gapR: number;
  viewportW: number;
}
export interface PositionResult {
  left: number;
  top: number;
  align: Align;
}

export function computeSubmenuPosition(i: PositionInput): PositionResult {
  const top = Math.max(i.anchorRect.top - i.containerRect.top - 8, 0);
  let left = 0;
  let align: Align;

  if (i.anchorRight) {
    // cascade left
    const desired =
      i.parentRect.left - i.containerRect.left - i.gapL - i.widthPx;
    if (i.depth >= 2) {
      left = Math.max(8, desired);
      align = 'left';
    } else {
      const overflowL = i.parentRect.left - i.gapL - i.widthPx < 8;
      left = overflowL
        ? i.parentRect.right - i.containerRect.left + i.gapR
        : desired;
      align = overflowL ? 'right' : 'left';
    }
  } else {
    // cascade right
    const desired = i.parentRect.right - i.containerRect.left + i.gapR;
    if (i.depth >= 2) {
      left = Math.min(i.viewportW - 8 - i.widthPx, desired);
      align = 'right';
    } else {
      const overflowR = desired + i.widthPx > i.viewportW - 8;
      left = overflowR
        ? i.parentRect.left - i.containerRect.left - i.gapL - i.widthPx
        : desired;
      align = overflowR ? 'left' : 'right';
    }
  }
  return { left: Math.round(left), top: Math.round(top), align };
}

export type StackItem = { menu: HTMLDivElement; anchor: HTMLElement };
export class SubmenuStack {
  private s: StackItem[] = [];
  push(x: StackItem) {
    this.s.push(x);
  }
  popFrom(startDepth: number) {
    for (let i = this.s.length - 1; i >= startDepth; i--) {
      const { menu, anchor } = this.s[i];
      try {
        menu.remove();
      } catch {
        /* no-op */
      }
      anchor.removeAttribute('aria-expanded');
      this.s.pop();
    }
  }
  top(): StackItem | null {
    return this.s[this.s.length - 1] ?? null;
  }
  prev(): StackItem | null {
    return this.s[this.s.length - 2] ?? null;
  }
  len(): number {
    return this.s.length;
  }
  menus(): HTMLDivElement[] {
    return this.s.map((x) => x.menu);
  }
  contains(node: Node | EventTarget | null): boolean {
    if (!node || !(node instanceof Node)) return false;
    return this.menus().some((m) => m.contains(node));
  }
  clearAll() {
    this.popFrom(0);
  }
}

export function inAnyMenu(
  rootMenu: HTMLElement,
  stack: SubmenuStack,
  node: EventTarget | null
): boolean {
  if (!node) return false;
  if (node instanceof Node) {
    if (rootMenu.contains(node)) return true;
    if (stack.contains(node)) return true;
  }
  return false;
}
