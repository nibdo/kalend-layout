import { CalendarEvent } from '../index';
import { DateTime } from 'luxon';
import { parseToDateTime } from './LuxonHelper';

export const formatToDateKey = (date: DateTime, timezone?: string) => {
  if (!timezone || date.zoneName === timezone) {
    return date.toFormat('dd-MM-yyyy');
  }

  return date.setZone(timezone).toFormat('dd-MM-yyyy');
};

export const mapEventsToDate = (events: CalendarEvent[], timezone: string) => {
  const result: any = {};

  if (!events || events.length === 0) {
    return result;
  }

  events?.forEach((event) => {
    const startDate: DateTime = parseToDateTime(event.startAt, timezone);
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

export const isEventFloating = (event: CalendarEvent) => {
  if (event?.timezoneStartAt === 'floating') {
    return true;
  }

  return false;
};
