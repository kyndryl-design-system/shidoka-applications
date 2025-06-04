import { Instance } from 'flatpickr/dist/types/instance';
import { Hook } from 'flatpickr/dist/types/options';
import { setCalendarAttributes } from './flatpickr';

let srLiveRegion: HTMLElement | null = null;

function getScreenReaderLiveRegion(): HTMLElement {
  if (!srLiveRegion) {
    srLiveRegion = document.createElement('div');
    srLiveRegion.setAttribute('aria-live', 'polite');
    srLiveRegion.setAttribute('class', 'sr-only flatpickr-sr-live-region');
    srLiveRegion.style.position = 'absolute';
    srLiveRegion.style.width = '1px';
    srLiveRegion.style.height = '1px';
    srLiveRegion.style.padding = '0';
    srLiveRegion.style.overflow = 'hidden';
    srLiveRegion.style.clipPath = 'inset(100%)';
    srLiveRegion.style.whiteSpace = 'nowrap';
    srLiveRegion.style.border = '0';
    document.body.appendChild(srLiveRegion);
  }
  return srLiveRegion;
}

export function announceToScreenReader(message: string): void {
  const liveRegion = getScreenReaderLiveRegion();
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
}

const NAV_MAP: Record<string, [string, string]> = {
  '.flatpickr-prev-month': ['button', 'Previous month'],
  '.cur-month, .flatpickr-monthDropdown-months': ['button', 'Select month'],
  'input.cur-year': ['spinbutton', 'Year'],
  '.flatpickr-next-month': ['button', 'Next month'],
  '.flatpickr-months': ['navigation', 'Calendar navigation'],
  '.flatpickr-innerContainer': ['application', 'Calendar'],
  '.flatpickr-time': ['group', 'Time selection'],
};

export function makeFirstDayTabbable(container: HTMLElement) {
  const days = Array.from(
    container.querySelectorAll<HTMLElement>('.flatpickr-day')
  );

  days.forEach((day) => {
    day.tabIndex = day.classList.contains('flatpickr-disabled') ? -1 : 0;

    if (!day.getAttribute('role')) {
      day.setAttribute('role', 'button');
    }

    day.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        day.click();
        const dateText = day.getAttribute('aria-label') || day.textContent;
        if (dateText) announceToScreenReader(dateText);
      }
    });
  });

  const firstSelectableDay = days.find(
    (day) => !day.classList.contains('flatpickr-disabled')
  );
  if (firstSelectableDay) {
    firstSelectableDay.setAttribute('tabindex', '0');
    firstSelectableDay.classList.add('keyboard-selected');
  }
}

export function makeNavFocusable(container: HTMLElement) {
  Object.entries(NAV_MAP).forEach(([selector, [role, label]]) => {
    container.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.tabIndex = 0;
      el.setAttribute('role', role);
      el.setAttribute('aria-label', label);

      if (role === 'spinbutton') {
        const input = el as HTMLInputElement;
        input.disabled = false;

        input.addEventListener('keydown', (e: KeyboardEvent) => {
          const value = parseInt(input.value, 10);
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            input.value = String(value + 1);
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new Event('change'));
            announceToScreenReader(`Year ${input.value}`);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            input.value = String(value - 1);
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new Event('change'));
            announceToScreenReader(`Year ${input.value}`);
          }
        });
      }

      if (
        selector.includes('month') &&
        !selector.includes('prev') &&
        !selector.includes('next')
      ) {
        el.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            el.click();
            announceToScreenReader(`Month selection opened`);
          }
        });
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
    hour.setAttribute('role', 'spinbutton');
    hour.setAttribute('aria-label', 'Hour');

    hour.addEventListener('change', () => {
      const timeString =
        hour.value +
        ' hour' +
        (minute ? ', ' + minute.value + ' minutes' : '') +
        (ampm ? ', ' + ampm.textContent : '');
      announceToScreenReader(timeString);
    });

    hour.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setTimeout(() => {
          announceToScreenReader(`${hour.value} hour`);
        }, 50);
      }
    });
  }

  if (minute) {
    minute.tabIndex = 0;
    minute.setAttribute('role', 'spinbutton');
    minute.setAttribute('aria-label', 'Minute');

    minute.addEventListener('change', () => {
      const timeString =
        (hour ? hour.value + ' hour, ' : '') +
        minute.value +
        ' minutes' +
        (ampm ? ', ' + ampm.textContent : '');
      announceToScreenReader(timeString);
    });

    minute.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setTimeout(() => {
          announceToScreenReader(`${minute.value} minutes`);
        }, 50);
      }
    });
  }

  if (ampm) {
    ampm.tabIndex = 0;
    ampm.setAttribute('role', 'button');
    ampm.setAttribute('aria-label', 'Toggle AM/PM');

    ampm.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        ampm.click();
        announceToScreenReader(ampm.textContent || '');
      }
    });

    ampm.addEventListener('click', () => {
      setTimeout(() => {
        announceToScreenReader(ampm.textContent || '');
      }, 50);
    });
  }
}

export function applyCalendarA11y(
  instance: Instance,
  modalDetected = false
): void {
  const container = instance.calendarContainer;
  if (!container) return;

  setCalendarAttributes(instance, modalDetected);

  makeNavFocusable(container);
  makeFirstDayTabbable(container);
  if (instance.config.enableTime) {
    makeTimeFocusable(container);
  }

  if (instance.config.mode === 'range') {
    announceToScreenReader(
      'Date range calendar opened. Select start date first, then end date.'
    );
  } else if (instance.config.mode === 'multiple') {
    announceToScreenReader(
      'Multiple date calendar opened. Select dates using Enter or Space key.'
    );
  } else if (instance.config.enableTime) {
    announceToScreenReader('Date and time picker opened. Use tab to navigate.');
  } else {
    announceToScreenReader(
      'Calendar opened. Use tab and arrow keys to navigate.'
    );
  }

  addDayKeyboardNavigation(container);

  const monthHook: Hook = (_dates, _dateStr, inst) => {
    const c = inst.calendarContainer!;
    makeNavFocusable(c);
    makeFirstDayTabbable(c);
    addDayKeyboardNavigation(c);

    const monthName = c.querySelector('.cur-month')?.textContent || '';
    const year =
      c.querySelector('.numInput.cur-year')?.getAttribute('value') || '';
    announceToScreenReader(`${monthName} ${year}`);
  };

  const prevOnMonthChange = instance.config.onMonthChange;
  if (Array.isArray(prevOnMonthChange)) {
    prevOnMonthChange.push(monthHook);
  } else if (typeof prevOnMonthChange === 'function') {
    instance.config.onMonthChange = [prevOnMonthChange, monthHook];
  } else {
    instance.config.onMonthChange = [monthHook];
  }

  const prevOnDayCreate = instance.config.onDayCreate;
  const dayCreateHook: Hook = (_selectedDates, _dateStr, inst, dayElement) => {
    dayElement.addEventListener('click', () => {
      setTimeout(() => {
        if (instance.config.mode === 'range') {
          const dates = inst.selectedDates;
          if (dates.length === 1) {
            announceToScreenReader(
              `Start date selected: ${formatDate(
                dates[0]
              )}. Please select an end date.`
            );
          } else if (dates.length === 2) {
            announceToScreenReader(
              `Date range selected: From ${formatDate(
                dates[0]
              )} to ${formatDate(dates[1])}`
            );
          }
        } else if (instance.config.mode === 'multiple') {
          const dates = inst.selectedDates;
          if (dates.length === 1) {
            announceToScreenReader(`Date selected: ${formatDate(dates[0])}`);
          } else {
            announceToScreenReader(`${dates.length} dates selected.`);
          }
        } else {
          const date = inst.selectedDates[0];
          if (date) {
            announceToScreenReader(`Date selected: ${formatDate(date)}`);
          }
        }
      }, 100);
    });
  };

  if (Array.isArray(prevOnDayCreate)) {
    prevOnDayCreate.push(dayCreateHook);
  } else if (typeof prevOnDayCreate === 'function') {
    instance.config.onDayCreate = [prevOnDayCreate, dayCreateHook];
  } else {
    instance.config.onDayCreate = [dayCreateHook];
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

      setTimeout(() => {
        const monthName =
          container.querySelector('.cur-month')?.textContent || '';
        const year =
          container
            .querySelector('.numInput.cur-year')
            ?.getAttribute('value') || '';
        announceToScreenReader(`${monthName} ${year}`);
      }, 50);
    }
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function addDayKeyboardNavigation(container: HTMLElement): void {
  const days = Array.from(
    container.querySelectorAll<HTMLElement>(
      '.flatpickr-day:not(.flatpickr-disabled)'
    )
  );
  if (!days.length) return;

  const daysGrid: HTMLElement[][] = [];
  let currentWeek: HTMLElement[] = [];

  days.forEach((day) => {
    if (!day.hasAttribute('data-keyboard-nav')) {
      day.setAttribute('data-keyboard-nav', 'true');

      day.addEventListener('keydown', (e: KeyboardEvent) => {
        let targetDay: HTMLElement | undefined;

        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            targetDay = days[days.indexOf(day) + 1];
            break;
          case 'ArrowLeft':
            e.preventDefault();
            targetDay = days[days.indexOf(day) - 1];
            break;
          case 'ArrowUp': {
            e.preventDefault();
            const weekIndex = daysGrid.findIndex((week) => week.includes(day));
            const dayIndex = daysGrid[weekIndex].indexOf(day);
            targetDay =
              weekIndex > 0 ? daysGrid[weekIndex - 1][dayIndex] : undefined;
            break;
          }
          case 'ArrowDown': {
            e.preventDefault();
            const weekIndex = daysGrid.findIndex((week) => week.includes(day));
            const dayIndex = daysGrid[weekIndex].indexOf(day);
            targetDay =
              weekIndex < daysGrid.length - 1
                ? daysGrid[weekIndex + 1][dayIndex]
                : undefined;
            break;
          }
          case ' ':
          case 'Enter':
            e.preventDefault();
            day.click();
            return;
        }

        if (targetDay) {
          targetDay.focus();
          const dateStr =
            targetDay.getAttribute('aria-label') || targetDay.textContent;
          if (dateStr) {
            announceToScreenReader(dateStr);
          }
        }
      });
    }

    if (day.offsetLeft < days[0].offsetLeft && currentWeek.length) {
      daysGrid.push([...currentWeek]);
      currentWeek = [day];
    } else {
      currentWeek.push(day);
    }
  });

  if (currentWeek.length) {
    daysGrid.push(currentWeek);
  }
}
