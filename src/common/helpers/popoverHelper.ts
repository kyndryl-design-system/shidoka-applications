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

export default function positionPopover(this: PopoverHost) {
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

  // ———  modal mode  ———
  if (this.mode === 'modal') {
    Object.assign(dialogEl.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      margin: '0',
    });
    return;
  }

  // ———  floating mode  ———
  if (this.mode === 'floating') {
    const { width: dW, height: dH } = dialogEl.getBoundingClientRect();

    const fmt = (v: string | number, axis: 'x' | 'y') => {
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

    if (this.left != null && this.left !== '') {
      style.left = fmt(this.left, 'x');
    }
    if (this.right != null && this.right !== '') {
      style.right = fmt(this.right, 'x');
    }
    if (this.bottom != null && this.bottom !== '') {
      style.bottom = fmt(this.bottom, 'y');
    } else if (this.top != null && this.top !== '') {
      style.top = fmt(this.top, 'y');
    }

    Object.assign(dialogEl.style, style);
    return;
  }

  // ———  anchor mode  ———
  if (!this.placement || !this._anchor) return;
  this.direction = this.placement;

  const anchorRect = this._anchor.getBoundingClientRect();
  const dialogRect = dialogEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const offset = 0;

  let anchorPos: 'start' | 'center' | 'end' = 'center';
  if (this.placement === 'top' || this.placement === 'bottom') {
    anchorPos =
      anchorRect.left > vw * 0.67
        ? 'end'
        : anchorRect.left > vw * 0.33
        ? 'center'
        : 'start';
  } else {
    anchorPos =
      anchorRect.top > vh * 0.67
        ? 'end'
        : anchorRect.top > vh * 0.33
        ? 'center'
        : 'start';
  }
  this.anchorPosition = anchorPos;

  let top = 0;
  let left = 0;
  switch (this.placement) {
    case 'top':
      top = Math.round(anchorRect.top - dialogRect.height - offset);
      left = Math.round(
        anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2
      );
      break;
    case 'bottom':
      top = Math.round(anchorRect.bottom + offset);
      left = Math.round(
        anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2
      );
      break;
    case 'left':
      top = Math.round(
        anchorRect.top + anchorRect.height / 2 - dialogRect.height / 2
      );
      left = Math.round(anchorRect.left - dialogRect.width - offset);
      break;
    case 'right':
      top = Math.round(
        anchorRect.top + anchorRect.height / 2 - dialogRect.height / 2
      );
      left = Math.round(anchorRect.right + offset);
      break;
  }

  if (top + dialogRect.height > vh) top = vh - dialogRect.height;
  if (top < 0) top = 0;
  if (left + dialogRect.width > vw) left = vw - dialogRect.width;
  if (left < 0) left = 0;

  Object.assign(dialogEl.style, {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    margin: '0',
  });
}
