import { CALENDAR_VIEW, Config, WEEKDAY_START } from '../index';
import {
  DEFAULT_ROW_LAYOUT_RESULT,
  RowLayoutResult,
  getRowLayout,
} from '../utils/commonHelper';
import { DateTime } from 'luxon';
import { FLOATING_DATETIME } from '../constants';
import { LuxonHelper, parseToDateTime } from '../utils/LuxonHelper';
import { formatToDateKey, isEventFloating } from '../utils/Helper';
import { getEventDateTime } from '../utils/KalendHelper';
import { getMonthRows } from '../utils/monthViewHelper';
import { parseTimezone } from './daysView';

export const prepareMultiDayEvents = (
  events: any,
  config: Config,
  breakPointDate?: string,
  view?: CALENDAR_VIEW
) => {
  const preparedEvents: any = {};
  events.forEach((event: any) => {
    const { dateTimeStart, dateTimeEnd } = getEventDateTime(event, config);

    // check if is multi-day
    const isSameDay = LuxonHelper.isSameDay(dateTimeStart, dateTimeEnd);

    // origin date to determine when event starts in each row
    let originDate: any = formatToDateKey(
      dateTimeStart
      // parseTimezone(config.timezone, event.timezoneStartAt ===
      // 'floating') // TODO remove
    );

    // handle multi-day
    if (!isSameDay) {
      let diffInDays = LuxonHelper.differenceInDays(dateTimeStart, dateTimeEnd);

      // handle overnight events with less than 1 diffInDays
      // but don't adjust behaviour for actual header events with floating
      // timezone
      if (diffInDays === 0 && !event.isFloating) {
        diffInDays = 1;
      }

      // handle all day events ending at 00:00:00 on next day and display
      // them as single allDay event by subtracting one day from diff in days
      if (
        diffInDays > 0 &&
        event.timezoneStartAt !== FLOATING_DATETIME && // TODO TEST
        dateTimeEnd.hour === 0 &&
        dateTimeEnd.minute === 0 &&
        dateTimeEnd.second === 0
      ) {
        diffInDays = diffInDays - 1;
      }

      // need to store each occurrence
      let daySpawns: string[] = [];

      // flag if events continue in next row
      // split daySpawns and adjust originDate
      for (let i = 0; i <= diffInDays; i++) {
        const refDate = dateTimeStart.plus({ days: i });

        const dateKey = formatToDateKey(
          refDate
          // parseTimezone(config.timezone, event.timezoneStartAt === 'floating')
        );

        // check if dateKey is same or less than end date
        const endDateDateKey = formatToDateKey(
          dateTimeEnd
          // parseTimezone(config.timezone, event.timezoneStartAt === 'floating')
        );
        if (
          DateTime.fromFormat(endDateDateKey, 'dd-MM-yyyy').valueOf() >=
          DateTime.fromFormat(dateKey, 'dd-MM-yyyy').valueOf()
        ) {
          // store each day in multi-day event range
          daySpawns.push(dateKey);
        }

        // break events spawned across multiple rows
        const dateOfWeek = refDate.weekday;
        const weekDayBreakPoint =
          config.weekDayStart === WEEKDAY_START.MONDAY ? 7 : 1;

        if (
          dateOfWeek === weekDayBreakPoint ||
          i === diffInDays ||
          view === CALENDAR_VIEW.DAY
        ) {
          const eventClone = {
            ...event,
            originDate,
            daysAfter: diffInDays - i,
          };

          eventClone.daySpawns = daySpawns;

          if (view === CALENDAR_VIEW.DAY) {
            if (!preparedEvents[dateKey]) {
              preparedEvents[dateKey] = [eventClone];
            } else {
              preparedEvents[dateKey] = [
                ...preparedEvents[dateKey],
                ...[eventClone],
              ];
            }
          } else {
            if (!preparedEvents[originDate]) {
              preparedEvents[originDate] = [eventClone];
            } else {
              preparedEvents[originDate] = [
                ...preparedEvents[originDate],
                ...[eventClone],
              ];
            }
          }

          daySpawns = [];
        }

        const getBreakPointDateWithZone = (date: string) =>
          DateTime.fromFormat(date, 'yyyy-MM-DD').setZone(
            parseTimezone(config.timezone, isEventFloating(event))
          );
        if (
          ((breakPointDate &&
            formatToDateKey(
              getBreakPointDateWithZone(breakPointDate),
              parseTimezone(config.timezone, isEventFloating(event))
            ) === dateKey) ||
            dateOfWeek === weekDayBreakPoint) &&
          i < diffInDays
        ) {
          originDate = formatToDateKey(
            refDate.plus({ days: 1 }),
            parseTimezone(config.timezone, isEventFloating(event))
          );
        }
      }
    } else {
      // single day event
      const dateKey = formatToDateKey(
        parseToDateTime(
          event.startAt,
          parseTimezone(config.timezone, isEventFloating(event))
        )
      );

      event.originDate = originDate;

      if (!preparedEvents[dateKey]) {
        preparedEvents[dateKey] = [event];
      } else {
        preparedEvents[dateKey] = [...preparedEvents[dateKey], ...[event]];
      }
    }
  });

  return preparedEvents;
};

export const getMonthViewLayout = (
  events: any,
  width: number,
  calendarDays: DateTime[],
  config: Config,
  maxEventsVisible: number,
  isHeaderEvents?: boolean
): RowLayoutResult => {
  const result: any[] = [];

  // split calendar days to rows
  const calendarDaysRows: DateTime[][] = getMonthRows(calendarDays);

  // Group all events by date key
  // Clone multi-day events to all dates in its range (start from first
  // calendar day and end in last calendar day

  if (!events) {
    return DEFAULT_ROW_LAYOUT_RESULT;
  }

  const preparedEvents: any = prepareMultiDayEvents(events, config);

  // store max offset top to adjust height of header events parent element
  let headerOffsetTop = 0;

  let overflowingEvents: any = {};

  // get layout for each row
  calendarDaysRows.forEach((row) => {
    const rowResult: RowLayoutResult = getRowLayout(
      preparedEvents,
      width / 7,
      row,
      config.timezone,
      maxEventsVisible,
      isHeaderEvents,
      overflowingEvents
    );

    // store only max value
    if (rowResult.headerOffsetTop > headerOffsetTop) {
      headerOffsetTop = rowResult.headerOffsetTop;
    }

    result.push(rowResult.positions);
    overflowingEvents = rowResult.overflowingEvents;
  });

  return {
    positions: result,
    overflowingEvents,
    headerOffsetTop,
  };
};
