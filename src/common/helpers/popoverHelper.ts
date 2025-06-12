import { LitElement } from 'lit';

export interface PopoverHost extends LitElement {
  mode?: 'modal' | 'floating' | 'anchor';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  anchorPosition?: 'start' | 'center' | 'end';

  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;

  _modalEl?: HTMLElement & { shadowRoot: ShadowRoot };
  _anchor?: HTMLElement;
}

/** center-on-screen modal */
const applyModalPosition = (dialogEl: HTMLDialogElement): void => {
  Object.assign(dialogEl.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0',
  });
};

/** user-provided coords for floating */
const applyFloatingPosition = (
  dialogEl: HTMLDialogElement,
  host: PopoverHost
): void => {
  const { width: dW, height: dH } = dialogEl.getBoundingClientRect();

  const fmt = (v: string | number, axis: 'x' | 'y'): string => {
    if (typeof v === 'number' || /^\d+$/.test(String(v))) {
      return `${v}px`;
    }
    if (typeof v === 'string' && v.endsWith('%')) {
      const pct = parseFloat(v) / 100;
      const bound = axis === 'x' ? window.innerWidth : window.innerHeight;
      const size = axis === 'x' ? dW : dH;
      return `${pct * bound - size / 2}px`;
    }
    return `${v}`;
  };

  const style: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    margin: '0',
    transform: 'none',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
  };

  if (host.left != null && host.left !== '') {
    style.left = fmt(host.left, 'x');
  }
  if (host.right != null && host.right !== '') {
    style.right = fmt(host.right, 'x');
  }
  if (host.bottom != null && host.bottom !== '') {
    style.bottom = fmt(host.bottom, 'y');
  } else if (host.top != null && host.top !== '') {
    style.top = fmt(host.top, 'y');
  }

  Object.assign(dialogEl.style, style);
};

/** anchor-aligned tooltip with arrow */
const applyAnchorPosition = (
  dialogEl: HTMLDialogElement,
  host: PopoverHost
): void => {
  if (!host.placement || !host._anchor) return;
  host.direction = host.placement;

  const anchorRect = host._anchor.getBoundingClientRect();
  const hostRect = (host as HTMLElement).getBoundingClientRect();
  const dialogRect = dialogEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const offset = 0;

  // decide start/center/end
  let anchorPos: 'start' | 'center' | 'end' = 'center';
  if (host.placement === 'top' || host.placement === 'bottom') {
    anchorPos =
      anchorRect.left - hostRect.left > hostRect.width * 0.67
        ? 'end'
        : anchorRect.left - hostRect.left > hostRect.width * 0.33
        ? 'center'
        : 'start';
  } else {
    anchorPos =
      anchorRect.top - hostRect.top > hostRect.height * 0.67
        ? 'end'
        : anchorRect.top - hostRect.top > hostRect.height * 0.33
        ? 'center'
        : 'start';
  }
  host.anchorPosition = anchorPos;

  // compute panel position relative to host
  let top: number;
  let left: number;
  switch (host.placement) {
    case 'top':
      top = Math.round(
        anchorRect.top - hostRect.top - dialogRect.height - offset
      );
      left = Math.round(
        anchorRect.left -
          hostRect.left +
          anchorRect.width / 2 -
          dialogRect.width / 2
      );
      break;
    case 'bottom':
      top = Math.round(anchorRect.bottom - hostRect.top + offset);
      left = Math.round(
        anchorRect.left -
          hostRect.left +
          anchorRect.width / 2 -
          dialogRect.width / 2
      );
      break;
    case 'left':
      top = Math.round(
        anchorRect.top -
          hostRect.top +
          anchorRect.height / 2 -
          dialogRect.height / 2
      );
      left = Math.round(
        anchorRect.left - hostRect.left - dialogRect.width - offset
      );
      break;
    case 'right':
      top = Math.round(
        anchorRect.top -
          hostRect.top +
          anchorRect.height / 2 -
          dialogRect.height / 2
      );
      left = Math.round(anchorRect.right - hostRect.left + offset);
      break;
  }

  top = Math.min(Math.max(top, 0), hostRect.height - dialogRect.height);
  left = Math.min(Math.max(left, 0), hostRect.width - dialogRect.width);

  Object.assign(dialogEl.style, {
    position: 'absolute',
    top: '8px',
    left: '-16px',
    margin: '0',
    transform: 'none',
  });

  const finalRect = dialogEl.getBoundingClientRect();
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  const anchorCenterY = anchorRect.top + anchorRect.height / 2;
  const arrowX = anchorCenterX - finalRect.left;
  const arrowY = anchorCenterY - finalRect.top;
  dialogEl.style.setProperty(
    '--popover-arrow-offset-x',
    `${Math.round(arrowX)}px`
  );
  dialogEl.style.setProperty(
    '--popover-arrow-offset-y',
    `${Math.round(arrowY)}px`
  );
};

const positionPopover = function (this: PopoverHost): void {
  if (!this._modalEl) {
    this._modalEl = this.shadowRoot!.querySelector(
      'kyn-modal.popover-modal'
    ) as any;
  }
  if (!this._anchor) {
    this._anchor = this.shadowRoot!.querySelector('.anchor') as HTMLElement;
  }

  const modalEl = this._modalEl;
  if (!modalEl?.shadowRoot) return;
  const dialogEl = modalEl.shadowRoot.querySelector(
    'dialog'
  ) as HTMLDialogElement | null;
  if (!dialogEl) return;

  switch (this.mode) {
    case 'modal':
      applyModalPosition(dialogEl);
      break;
    case 'floating':
      applyFloatingPosition(dialogEl, this);
      break;
    default:
      applyAnchorPosition(dialogEl, this);
  }
};

export default positionPopover;
