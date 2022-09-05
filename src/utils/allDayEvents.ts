import { CalendarEvent, Config } from '../index';
import { LuxonHelper, parseToDateTime } from './LuxonHelper';
import { formatToDateKey } from './Helper';
import { getEventDateTime } from './KalendHelper';

export const parseAllDayEvent = (
  event: CalendarEvent,
  timezone: string
): CalendarEvent => {
  const { dateTimeStart, dateTimeEnd } = getEventDateTime(event, {
    timezone,
  } as Config);

  return {
    ...event,
    allDay:
      event.allDay ||
      LuxonHelper.differenceInDays(dateTimeStart, dateTimeEnd) > 0,
  };
};

export const parseAllDayEvents = (events: any, timezone: string) => {
  const result: any = {};

  if (!events) {
    return {};
  }

  Object.entries(events).forEach((keyValue: any) => {
    const eventsItems: CalendarEvent[] = keyValue[1];

    eventsItems.forEach((item: CalendarEvent) => {
      const dateKey: any = formatToDateKey(
        parseToDateTime(item.startAt, timezone)
      );

      if (result[dateKey]) {
        result[dateKey] = [
          ...result[dateKey],
          ...[parseAllDayEvent(item, timezone)],
        ];
      } else {
        result[dateKey] = [parseAllDayEvent(item, timezone)];
      }
    });
  });

  return result;
};

export const parseAllDayEventsArray = (
  events: CalendarEvent[],
  timezone: string
) => {
  const result: any = [];

  if (!events) {
    return [];
  }

  events.forEach((item) => {
    result.push(parseAllDayEvent(item, timezone));
  });

  return result;
};
