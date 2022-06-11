import { CALENDAR_VIEW, Config, WEEKDAY_START } from '../index';
import {
  DEFAULT_ROW_LAYOUT_RESULT,
  RowLayoutResult,
  getRowLayout,
} from '../utils/commonHelper';
import { DateTime } from 'luxon';
import { LuxonHelper, parseToDateTime } from '../utils/LuxonHelper';
import { formatToDateKey } from '../utils/Helper';
import { getEventDateTime } from '../utils/KalendHelper';
import { getMonthRows } from '../utils/monthViewHelper';

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
    let originDate: any = formatToDateKey(dateTimeStart);

    // handle multi-day
    if (!isSameDay) {
      const diffInDays = LuxonHelper.differenceInDays(
        dateTimeStart,
        dateTimeEnd
      );

      // need to store each occurrence
      let daySpawns: string[] = [];

      // flag if events continue in next row
      // split daySpawns and adjust originDate
      for (let i = 0; i <= diffInDays; i++) {
        const refDate = dateTimeStart.plus({ days: i });

        const dateKey = formatToDateKey(refDate, config.timezone);

        // store each day in multi-day event range
        daySpawns.push(dateKey);

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

        if (
          ((breakPointDate && breakPointDate === dateKey) ||
            dateOfWeek === weekDayBreakPoint) &&
          i < diffInDays
        ) {
          originDate = formatToDateKey(refDate.plus({ days: 1 }));
        }
      }
    } else {
      // single day event
      const dateKey = formatToDateKey(
        parseToDateTime(event.startAt, event.timezoneStartAt || config.timezone)
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
