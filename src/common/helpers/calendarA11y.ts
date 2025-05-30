import { Instance } from 'flatpickr/dist/types/instance';
import { Hook } from 'flatpickr/dist/types/options';

const NAV_MAP: Record<string, [string, string]> = {
  '.flatpickr-prev-month': ['button', 'Previous month'],
  '.cur-month, .flatpickr-monthDropdown-months': ['button', 'Select month'],
  'input.cur-year': ['spinbutton', 'Year'],
  '.flatpickr-next-month': ['button', 'Next month'],
};

export function makeFirstDayTabbable(container: HTMLElement) {
  const days = Array.from(
    container.querySelectorAll<HTMLElement>('.flatpickr-day')
  );
  days.forEach((day, i) => {
    day.tabIndex = day.classList.contains('flatpickr-disabled')
      ? -1
      : i === 0
      ? 0
      : -1;
  });
}

export function makeNavFocusable(container: HTMLElement) {
  Object.entries(NAV_MAP).forEach(([selector, [role, label]]) => {
    container.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.tabIndex = 0;
      el.setAttribute('role', role);
      el.setAttribute('aria-label', label);
      if (role === 'spinbutton') {
        (el as HTMLInputElement).disabled = false;
      }
    });
  });
}

export function makeTimeFocusable(container: HTMLElement) {
  const hour = container.querySelector<HTMLInputElement>('.flatpickr-hour');
  const minute = container.querySelector<HTMLInputElement>('.flatpickr-minute');
  const ampm = container.querySelector<HTMLElement>('.flatpickr-am-pm');

  if (hour) {
    hour.tabIndex = 0;
    hour.setAttribute('aria-label', 'Hour');
  }
  if (minute) {
    minute.tabIndex = 0;
    minute.setAttribute('aria-label', 'Minute');
  }
  if (ampm) {
    ampm.tabIndex = 0;
    ampm.setAttribute('role', 'button');
    ampm.setAttribute('aria-label', 'Toggle AM/PM');
  }
}

export function applyCalendarA11y(
  instance: Instance,
  modalDetected = false
): void {
  const container = instance.calendarContainer;
  if (!container) return;

  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Calendar');
  container.classList.remove('container-modal', 'container-default');
  container.classList.add(
    modalDetected ? 'container-modal' : 'container-default'
  );

  makeNavFocusable(container);
  makeFirstDayTabbable(container);
  if (instance.config.enableTime) {
    makeTimeFocusable(container);
  }

  const monthHook: Hook = (_dates, _str, inst) => {
    const c = inst.calendarContainer!;
    makeNavFocusable(c);
    makeFirstDayTabbable(c);
  };
  const prevMC = instance.config.onMonthChange;
  if (Array.isArray(prevMC)) {
    prevMC.push(monthHook);
  } else if (typeof prevMC === 'function') {
    instance.config.onMonthChange = [prevMC, monthHook];
  } else {
    instance.config.onMonthChange = [monthHook];
  }

  container.addEventListener('keydown', (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (
      (t.matches('.flatpickr-prev-month') ||
        t.matches('.flatpickr-next-month')) &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault();
      t.click();
    }
  });
}
