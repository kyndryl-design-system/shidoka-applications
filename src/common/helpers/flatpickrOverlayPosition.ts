import type { Instance } from 'flatpickr/dist/types/instance';
import type { Hook } from 'flatpickr/dist/types/options';

type FixedOverlayPositionOpts = {
  offset?: number;
  minViewportMargin?: number;
  preferTop?: boolean;
};

type PositionPrivates = {
  _positionCalendar: () => void;
  _positionElement?: HTMLElement | null;
};

type FPPlugin = (fp: Instance) => { onReady?: Hook };

export function fixedOverlayPositionPlugin(
  opts: FixedOverlayPositionOpts = {}
): FPPlugin {
  const { offset = 6, minViewportMargin = 8, preferTop = false } = opts;

  return (fp: Instance) => {
    const fpp = fp as Instance & PositionPrivates;

    let scrollParents: (Element | Document | Window)[] = [];
    let ro: ResizeObserver | null = null;
    let queued = false;

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        recalc();
      });
    };

    const getRootHost = (node: Node): Element | null => {
      const root = (node as any).getRootNode?.();
      return root && root.host ? (root.host as Element) : null;
    };

    const isScrollable = (el: Element) => {
      const cs = getComputedStyle(el);
      const oy = cs.overflowY;
      const ox = cs.overflowX;
      return (
        oy === 'auto' ||
        oy === 'scroll' ||
        oy === 'overlay' ||
        ox === 'auto' ||
        ox === 'scroll' ||
        ox === 'overlay'
      );
    };

    const collectScrollParents = (start: Element | null) => {
      const parents: (Element | Document | Window)[] = [];
      let node: Element | null = start;
      const visited = new Set<Element>();
      while (node && !visited.has(node)) {
        visited.add(node);
        if (isScrollable(node)) parents.push(node);
        const host = getRootHost(node);
        node = (node.parentElement as Element | null) ?? host;
      }
      if (document.scrollingElement) parents.push(document);
      parents.push(window);
      return parents;
    };

    const addListeners = () => {
      removeListeners();
      const pe =
        (fp.config.positionElement as HTMLElement | null) ??
        fpp._positionElement ??
        (fp.input as HTMLElement | null);
      scrollParents = collectScrollParents(pe ?? null);
      scrollParents.forEach((t) => {
        (t as any).addEventListener?.('scroll', schedule, { passive: true });
      });
      window.addEventListener('resize', schedule, { passive: true });
      window.addEventListener('orientationchange', schedule, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', schedule, {
          passive: true,
        } as any);
        window.visualViewport.addEventListener('scroll', schedule, {
          passive: true,
        } as any);
      }

      const ROCtor = (window as any).ResizeObserver;
      ro = ROCtor ? new ROCtor(() => schedule()) : null;
      const cal = fp.calendarContainer;
      if (ro) {
        if (cal) ro.observe(cal);
        if (pe) ro.observe(pe);
      }
    };

    const removeListeners = () => {
      scrollParents.forEach((t) => {
        (t as any).removeEventListener?.('scroll', schedule);
      });
      scrollParents = [];
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', schedule as any);
        window.visualViewport.removeEventListener('scroll', schedule as any);
      }
      if (ro) {
        ro.disconnect();
        ro = null;
      }
    };

    const recalc = () => {
      const cal = fp.calendarContainer;
      const pe =
        (fp.config.positionElement as HTMLElement | null) ??
        fpp._positionElement ??
        (fp.input as HTMLElement | null);
      if (!cal || !pe || !pe.isConnected) return;

      cal.style.position = 'fixed';

      const r = pe.getBoundingClientRect();

      const prevVis = cal.style.visibility;
      const prevDisp = cal.style.display;
      if (getComputedStyle(cal).display === 'none') {
        cal.style.visibility = 'hidden';
        cal.style.display = 'block';
      }
      const calW = cal.offsetWidth;
      const calH = cal.offsetHeight;
      cal.style.visibility = prevVis;
      cal.style.display = prevDisp;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = Math.max(minViewportMargin, r.left);
      if (left + calW + minViewportMargin > vw) {
        left = Math.max(minViewportMargin, vw - calW - minViewportMargin);
      }

      const spaceBelow = vh - r.bottom;
      const spaceAbove = r.top;
      const shouldFlip = preferTop
        ? calH + offset > spaceBelow && spaceAbove > spaceBelow
        : calH + offset > spaceBelow && spaceAbove > calH + offset;

      let top = shouldFlip ? r.top - calH - offset : r.bottom + offset;
      top = Math.max(
        minViewportMargin,
        Math.min(top, vh - calH - minViewportMargin)
      );

      cal.style.top = `${top}px`;
      cal.style.left = `${left}px`;
      cal.style.right = '';
      cal.style.bottom = '';
      cal.classList.toggle('fp-flipped', shouldFlip);
    };

    fpp._positionCalendar = () => recalc();

    const onOpen: Hook = () => {
      recalc();
      addListeners();
    };
    const onClose: Hook = () => {
      removeListeners();
    };
    const onDestroy: Hook = () => {
      removeListeners();
    };

    fp.config.onOpen = ([] as Hook[]).concat(fp.config.onOpen || [], onOpen);
    fp.config.onClose = ([] as Hook[]).concat(fp.config.onClose || [], onClose);
    fp.config.onDestroy = ([] as Hook[]).concat(
      fp.config.onDestroy || [],
      onDestroy
    );

    return { onReady: () => recalc() };
  };
}
