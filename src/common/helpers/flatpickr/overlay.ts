import type { Instance } from 'flatpickr/dist/types/instance';
import type { Hook } from 'flatpickr/dist/types/options';

/**
 * - offset: gap between input and calendar
 * - minViewportMargin: padding from viewport edges
 * - preferTop: bias toward opening upward when space is tight
 */
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

/**
 * Flatpickr plugin that positions the calendar using viewport-fixed coordinates.
 *  - detects modal/overlay contexts
 *  - tracks scroll/resize sources (including shadow DOM hosts) and repositions.
 *  - flips above the input when space below is insufficient.
 */
export function fixedOverlayPositionPlugin(
  opts: FixedOverlayPositionOpts = {}
): FPPlugin {
  const { offset = 6, minViewportMargin = 8, preferTop = false } = opts;

  return (fp: Instance) => {
    const fpp = fp as Instance & PositionPrivates;

    // active scroll containers + observers attach to while open
    let scrollParents: (Element | Document | Window)[] = [];
    let ro: ResizeObserver | null = null;

    let queued = false;

    // don’t force fixed positioning when flatpickr is configured as static/inline
    const isStaticOrInline = () =>
      !!(fp.config.static || (fp.config as any).inline);

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        recalc();
      });
    };

    // if inside shadow DOM, target the host to continue traversal
    const getRootHost = (node: Node): Element | null => {
      const root = (node as any).getRootNode?.();
      return root && root.host ? (root.host as Element) : null;
    };

    // initial check for scrollable containers
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

    // parse DOM to collect elements that can scroll
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

    // attach scroll/resize observers when the picker opens
    const addListeners = () => {
      if (isStaticOrInline()) return; // ignore for inline/static
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

      // resizeObserver to catch content-driven size changes
      ro = new ResizeObserver(() => schedule());
      const cal = fp.calendarContainer;
      if (cal) ro.observe(cal);
      if (pe) ro.observe(pe);
    };

    // clean up listeners/observers when the picker closes
    const removeListeners = () => {
      scrollParents.forEach((t) => {
        (t as any).removeEventListener?.('scroll', schedule);
      });
      scrollParents = [];
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      if (ro) {
        ro.disconnect();
        ro = null;
      }
    };

    // core positioning
    const recalc = () => {
      const cal = fp.calendarContainer;
      const pe =
        (fp.config.positionElement as HTMLElement | null) ??
        fpp._positionElement ??
        (fp.input as HTMLElement | null);
      if (!cal || !pe) return;

      // inline/static => let Flatpickr manage layout styles
      if (isStaticOrInline()) {
        cal.style.position = '';
        cal.style.top = '';
        cal.style.left = '';
        cal.style.right = '';
        cal.style.bottom = '';
        cal.classList.remove('fp-flipped');
        return;
      }

      // viewport-fixed coordinates so modal/body scrolls do not desync
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

      // fix within viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = Math.max(minViewportMargin, r.left);
      if (left + calW + minViewportMargin > vw) {
        left = Math.max(minViewportMargin, vw - calW - minViewportMargin);
      }

      // flip above the input if necessary
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

      // apply final position
      cal.style.top = `${top}px`;
      cal.style.left = `${left}px`;
      cal.style.right = '';
      cal.style.bottom = '';
      cal.classList.toggle('fp-flipped', shouldFlip);
    };

    fpp._positionCalendar = () => recalc();

    // wire into open/close
    const onOpen: Hook = () => {
      if (isStaticOrInline()) {
        removeListeners();
        recalc();
        return;
      }
      recalc();
      addListeners();
    };

    const onClose: Hook = () => {
      removeListeners();
    };

    // Append (don’t clobber) any existing hooks
    fp.config.onOpen = ([] as Hook[]).concat(fp.config.onOpen || [], onOpen);
    fp.config.onClose = ([] as Hook[]).concat(fp.config.onClose || [], onClose);

    return { onReady: () => recalc() };
  };
}
