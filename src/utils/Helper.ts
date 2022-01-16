import { CalendarEvent } from '../index';
import { DateTime } from 'luxon';

// TODO should add timezone?
export const formatToDateKey = (date: DateTime, timezone?: string) =>
  date.setZone(timezone || 'Europe/Berlin').toFormat('dd-MM-yyyy');

export const mapEventsToDate = (events: CalendarEvent[], timezone: string) => {
  const result: any = {};

  if (!events || events.length === 0) {
    return result;
  }

  events?.forEach((event) => {
    const startDate: DateTime = DateTime.fromISO(event.startAt).setZone(
      event.timezoneStartAt || timezone
    );
    const key: string = formatToDateKey(startDate);

    if (result[key]) {
      result[key] = [...result[key], ...[event]];
    } else {
      result[key] = [event];
    }
  });

  return result;
};

export const parseToCalendarDays = (
  calendarDays: DateTime[] | string[]
): DateTime[] => {
  if (typeof calendarDays[0] === 'string') {
    return calendarDays.map((item: any) => DateTime.fromISO(item));
  }

  return calendarDays as DateTime[];
};
