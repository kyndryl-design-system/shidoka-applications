import { Instance } from 'flatpickr/dist/types/instance';
import { Hook } from 'flatpickr/dist/types/options';
import { setCalendarAttributes } from './flatpickr';

/**
 * NAV_MAP tells Flatpickr which selectors to make focusable,
 * and which ARIA roles/labels to assign.
 */
const NAV_MAP: Record<string, [string, string]> = {
  '.flatpickr-prev-month': ['button', 'Previous month'],
  '.cur-month, .flatpickr-monthDropdown-months': ['button', 'Select month'],
  'input.cur-year': ['spinbutton', 'Year'],
  '.flatpickr-next-month': ['button', 'Next month'],
};

/**
 * Once the calendar is in the DOM, this makes sure that the first day cell
 * is tabbable (0) and everything else is -1, so screen‐readers can land
 * on the very first date, then use arrow keys.
 */
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

/**
 * Walks NAV_MAP entries and forces each matching element to be
 * focusable (tabIndex=0) with the correct ARIA role + label.
 */
export function makeNavFocusable(container: HTMLElement) {
  Object.entries(NAV_MAP).forEach(([selector, [role, label]]) => {
    container.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.tabIndex = 0;
      el.setAttribute('role', role);
      el.setAttribute('aria-label', label);
      if (role === 'spinbutton') {
        // ensure the year input (spinbutton) is not disabled
        (el as HTMLInputElement).disabled = false;
      }
    });
  });
}

/**
 * If Flatpickr is showing a time picker, make sure hour/minute/AMPM nodes
 * are also focusable.
 */
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

/**
 * Top‐level entrypoint for applying all a11y adjustments to a newly‐rendered Calendar.
 *
 * 1) Calls `setCalendarAttributes(...)` so that Flatpickr’s own container gets the
 *    correct “container‐modal” vs “container‐default” class and ARIA roles.
 * 2) Invokes the smaller helper functions (`makeNavFocusable`, `makeFirstDayTabbable`, etc.)
 *    so that arrow keys, month navigation, and time picker (if present) are all keyboard‐friendly.
 */
export function applyCalendarA11y(
  instance: Instance,
  modalDetected = false
): void {
  const container = instance.calendarContainer;
  if (!container) return;

  // 1) Let setCalendarAttributes add role="application",
  //    the container‐modal or container‐default class, and other attributes:
  setCalendarAttributes(instance, modalDetected);

  // 2) Now wire up keyboard focus for navigation arrows, year select, etc.
  makeNavFocusable(container);
  makeFirstDayTabbable(container);
  if (instance.config.enableTime) {
    makeTimeFocusable(container);
  }

  // 3) When the month changes (e.g. user clicks the “next month” arrow),
  //    re‐apply nav/day focusability so newly‐inserted nodes are also tabbable.
  const monthHook: Hook = (_dates, _dateStr, inst) => {
    const c = inst.calendarContainer!;
    makeNavFocusable(c);
    makeFirstDayTabbable(c);
  };

  const prevOnMonthChange = instance.config.onMonthChange;
  if (Array.isArray(prevOnMonthChange)) {
    prevOnMonthChange.push(monthHook);
  } else if (typeof prevOnMonthChange === 'function') {
    instance.config.onMonthChange = [prevOnMonthChange, monthHook];
  } else {
    instance.config.onMonthChange = [monthHook];
  }

  // 4) Handle “Enter” or “Space” on the prev/next month arrows to mimic click:
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
