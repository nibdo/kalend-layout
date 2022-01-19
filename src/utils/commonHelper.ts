import { CALENDAR_VIEW, CalendarEvent, EventLayoutData } from '../index';
import { DateTime } from 'luxon';
import { EVENT_TABLE_DELIMITER_SPACE, MONTH_EVENT_HEIGHT } from '../constants';
import { formatToDateKey } from './Helper';

export interface RowLayoutResult {
  positions: EventLayoutData[];
  overflowingEvents: CalendarEvent[];
  headerOffsetTop: number;
}

interface CalendarEventRowExtended extends CalendarEvent {
  daySpawns?: string[];
  originDate: string;
}

/**
 * Find free slot in day column where to put event
 * @param indexes
 * @param maxEventsVisible
 */
const findFreeSlot = (indexes: number[], maxEventsVisible: number): number => {
  let freeIndex;

  if (!maxEventsVisible || maxEventsVisible <= 0) {
    return -999;
  }

  for (let i = 0; i < maxEventsVisible + 1; i++) {
    if (indexes.length === 0 || !indexes.includes(i)) {
      freeIndex = i;
      return freeIndex;
    }
  }

  return -1;
};

const addEventToResult = (
  usedIDs: string[],
  event: CalendarEventRowExtended,
  takenIndexes: any,
  offsetTopIndex: number,
  width: number,
  headerOffsetTop: number,
  tableSpace: number,
  dayIndex: number,
  result: any,
  isHeaderEvents?: boolean
) => {
  usedIDs.push(event.id);
  if (event.daySpawns) {
    event.daySpawns.forEach((daySpawn) => {
      if (takenIndexes[daySpawn]) {
        takenIndexes[daySpawn] = [
          ...takenIndexes[daySpawn],
          ...[offsetTopIndex],
        ];
      } else {
        takenIndexes[daySpawn] = [offsetTopIndex];
      }
    });
  } else {
    if (takenIndexes[event.originDate]) {
      takenIndexes[event.originDate] = [
        ...takenIndexes[event.originDate],
        ...[offsetTopIndex],
      ];
    } else {
      takenIndexes[event.originDate] = [offsetTopIndex];
    }
  }

  // spawn width across all days
  const eventWidth = event.daySpawns ? width * event.daySpawns.length : width;

  const eventOffsetTop = 20 * offsetTopIndex;

  if (isHeaderEvents && eventOffsetTop > headerOffsetTop) {
    headerOffsetTop = eventOffsetTop;
  }

  const data: EventLayoutData = {
    event,
    width: Math.round(eventWidth - tableSpace),
    offsetLeft: dayIndex * width + 2,
    offsetTop: MONTH_EVENT_HEIGHT * offsetTopIndex + offsetTopIndex,
    height: MONTH_EVENT_HEIGHT,
    zIndex: 2,
  };

  result.push(data);

  return {
    headerOffsetTop,
    takenIndexes,
  };
};

export const DEFAULT_ROW_LAYOUT_RESULT = {
  positions: [],
  overflowingEvents: [],
  headerOffsetTop: 0,
};

/**
 * Use for month view and header events
 * @param events
 * @param width
 * @param calendarDays
 * @param timezone
 * @param maxEventsVisible
 * @param isHeaderEvents
 * @param overflowingEvents
 */
export const getRowLayout = (
  events: any,
  width: number,
  calendarDays: DateTime[],
  timezone: string,
  maxEventsVisible: number,
  isHeaderEvents?: boolean,
  overflowingEvents?: any
): RowLayoutResult => {
  // store biggest offset top for day view header events
  let headerOffsetTop = 0;

  const tableSpace: number = (width / 100) * EVENT_TABLE_DELIMITER_SPACE;
  const result: any = [];

  if (!events) {
    return DEFAULT_ROW_LAYOUT_RESULT;
  }

  // prevent adding duplicates from multi-day clones
  const usedIDs: string[] = [];

  // store taken indexes under date key
  let takenIndexes: any = {};

  const calendarDaysDateKey: string[] = calendarDays.map((day) =>
    formatToDateKey(day, timezone)
  );

  calendarDays.forEach((day, dayIndex) => {
    const dateKey = formatToDateKey(day, timezone);

    // get only events for this day
    const dayEvents: CalendarEventRowExtended[] = events[dateKey];

    let eventRealIndex = 0; // use basic index for events with free slots

    if (dayEvents) {
      dayEvents.forEach((event) => {
        const takenSlots = takenIndexes[event.originDate];
        // find free slot
        let offsetTopIndex = takenSlots
          ? findFreeSlot(takenSlots, maxEventsVisible)
          : eventRealIndex;

        if (!usedIDs.includes(event.id)) {
          //
          if (
            !maxEventsVisible ||
            maxEventsVisible <= 0 ||
            eventRealIndex >= maxEventsVisible ||
            offsetTopIndex >= maxEventsVisible
          ) {
            offsetTopIndex = -999;
          }

          eventRealIndex += 1;

          // check for overflowing events
          if (offsetTopIndex === -1 && overflowingEvents) {
            // save all clones to overflown array

            if (event.daySpawns) {
              event.daySpawns.forEach((daySpawn) => {
                // check if we can fit spawn to column
                const takenSlotsSpawn = takenIndexes[daySpawn];

                // find free slot
                offsetTopIndex = takenSlotsSpawn
                  ? findFreeSlot(takenSlotsSpawn, maxEventsVisible)
                  : 0; // we can use 0 top index as either next day wasn't
                // iterated yet or takenSlotsSpawn exists for that column

                if (offsetTopIndex <= -1 && overflowingEvents) {
                  if (overflowingEvents[daySpawn]) {
                    overflowingEvents[daySpawn] = [
                      ...overflowingEvents[daySpawn],
                      event,
                    ];
                  } else {
                    overflowingEvents[daySpawn] = [event];
                  }
                } else {
                  const eventAddResult = addEventToResult(
                    usedIDs,
                    // need to adjust date
                    {
                      ...event,
                      originDate: daySpawn,
                      daySpawns: event.daySpawns?.slice(
                        event.daySpawns?.indexOf(daySpawn)
                      ),
                    },
                    takenIndexes,
                    offsetTopIndex,
                    width,
                    headerOffsetTop,
                    tableSpace,
                    // adjust date index for daySpawn
                    calendarDaysDateKey.indexOf(daySpawn),
                    result,
                    isHeaderEvents
                  );
                  headerOffsetTop = eventAddResult.headerOffsetTop;
                  takenIndexes = eventAddResult.takenIndexes;
                }
              });
            } else {
              if (overflowingEvents[event.originDate]) {
                overflowingEvents[event.originDate] = [
                  ...overflowingEvents[event.originDate],
                  event,
                ];
              } else {
                overflowingEvents[event.originDate] = [event];
              }
            }
          } else if (offsetTopIndex === -999) {
            if (overflowingEvents[event.originDate]) {
              overflowingEvents[event.originDate] = [
                ...overflowingEvents[event.originDate],
                event,
              ];
            } else {
              overflowingEvents[event.originDate] = [event];
            }
          } else {
            const eventAddResult = addEventToResult(
              usedIDs,
              event,
              takenIndexes,
              offsetTopIndex,
              width,
              headerOffsetTop,
              tableSpace,
              dayIndex,
              result,
              isHeaderEvents
            );
            headerOffsetTop = eventAddResult.headerOffsetTop;
            takenIndexes = eventAddResult.takenIndexes;
          }
        }
      });
    }
  });

  return {
    positions: result,
    overflowingEvents,
    headerOffsetTop,
  };
};

export const checkIfIsDaysView = (view: CALENDAR_VIEW): boolean => {
  return (
    view === CALENDAR_VIEW.WEEK ||
    view === CALENDAR_VIEW.DAY ||
    view === CALENDAR_VIEW.THREE_DAYS
  );
};
