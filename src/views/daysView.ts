import { CALENDAR_VIEW, CalendarEvent, Config } from '../index';
import { DateTime } from 'luxon';
import {
  EVENT_MIN_HEIGHT,
  EVENT_TABLE_DELIMITER_SPACE,
  SHOW_TIME_THRESHOLD,
} from '../constants';
import { calculatePositionForHeaderEvents } from '../utils/headerViewHelper';
import { formatToDateKey } from '../utils/Helper';
import { getCorrectWidth, getDaysNum } from '../utils/KalendHelper';
import { parseAllDayEventsArray } from '../utils/allDayEvents';
import { parseToDateTime } from '../utils/LuxonHelper';

const checkOverlappingYCoordinates = (
  item: any,
  refFirstCoordinate: number,
  refLastCoordinate: number
) => {
  if (
    (item.offsetTop >= refFirstCoordinate &&
      item.offsetTop <= refLastCoordinate) ||
    (refLastCoordinate >= item.offsetTop &&
      refLastCoordinate <= item.offsetTop) ||
    (refFirstCoordinate >= item.offsetTop &&
      refFirstCoordinate <= item.itemLastCoordinate) ||
    (item.offsetTop <= refFirstCoordinate &&
      item.itemLastCoordinate >= refLastCoordinate)
  ) {
    return true;
  }

  return false;
};

const calculateNormalEventPositions = (
  events: CalendarEvent[],
  baseWidth: number,
  config: any,
  selectedView: any,
  dateKey: string
): any[] => {
  const result: any[] = [];

  if (!events) {
    return result;
  }

  const tableWidth: number = baseWidth / getDaysNum(selectedView);
  const tableSpace: number = (tableWidth / 100) * EVENT_TABLE_DELIMITER_SPACE;

  // sort by event start
  let sortedEvents: CalendarEvent[] | any = events.sort(
    (a: CalendarEvent, b: CalendarEvent) => {
      return a.startAt.localeCompare(b.startAt);
    }
  );

  // add offset top and height
  // TODO can be moved to any iteration before to optimize more
  sortedEvents = sortedEvents.map((event: CalendarEvent) => {
    const offsetTop: any =
      // @ts-ignore
      parseToDateTime(event.startAt, event.timezoneStartAt, config.timezone)
        .diff(
          parseToDateTime(
            event.startAt,
            event.timezoneStartAt,
            config.timezone
          ).set({
            hour: 0,
            minute: 0,
            second: 0,
          }),
          'minutes'
        )
        .toObject().minutes /
      (60 / config.hourHeight); // adjust based on hour column height

    const eventHeight: any =
      // @ts-ignore
      parseToDateTime(event.endAt, event.timezoneStartAt)
        .diff(parseToDateTime(event.startAt, event.timezoneStartAt), 'minutes')
        .toObject().minutes /
      (60 / config.hourHeight); // adjust based on hour column height

    return {
      event,
      offsetTop,
      eventHeight,
      itemLastCoordinate: offsetTop + eventHeight,
    };
  });

  const layoutGroups: any = [];
  // now calculate layout for each overlapping group
  let currentGroup: any = [];
  let isFirst = true;
  let groupFirstCoordinate = 0;
  let groupLastCoordinate = 0;

  let currentGroupID = 0;
  const usedGroupIDs: string[] = [];

  sortedEvents.forEach((item: any) => {
    if (isFirst) {
      currentGroup.push(item);
      if (sortedEvents.length === 1) {
        layoutGroups.push(currentGroup);
        currentGroup = [];
      }
      groupFirstCoordinate = item.offsetTop;
      groupLastCoordinate = item.itemLastCoordinate;
      isFirst = false;
    } else {
      // check if next event is inside current group coordinates
      const isOverlapping = checkOverlappingYCoordinates(
        item,
        groupFirstCoordinate,
        groupLastCoordinate
      );
      // add to group
      if (isOverlapping) {
        currentGroup.push(item);
        // TODO this should never occur because of sorting
        if (item.offsetTop > groupFirstCoordinate) {
          groupFirstCoordinate = item.offsetTop;
        }
        if (item.itemLastCoordinate > groupLastCoordinate) {
          groupLastCoordinate = item.itemLastCoordinate;
        }
      } else {
        // we have new group of events

        // store previous group
        layoutGroups.push(currentGroup);
        usedGroupIDs.push(String(currentGroupID));

        currentGroupID += 1;

        currentGroup = [];
        currentGroup.push(item);
        groupFirstCoordinate = item.offsetTop;
        groupLastCoordinate = item.itemLastCoordinate;
      }
    }
  });

  if (!usedGroupIDs.includes(String(currentGroupID))) {
    if (currentGroup.length > 0) {
      layoutGroups.push(currentGroup);
    }
  }

  // now adjust layout for each event
  layoutGroups.forEach((groups: any[]) => {
    const count = groups.length;
    const eventWidth = tableWidth / count;
    //
    // const partialResult: any[] = result.map((item: any) => {
    //   // full event width
    //   if (item.meta?.isFullWidth) {
    //     return {
    //       ...item,
    //       width: Math.round(item.width - tableSpace), // add some padding,
    //     };
    //   } else if (item.offsetLeft > 0) {
    //     return {
    //       ...item,
    //       width: Math.round(item.width),
    //       offsetLeft: item.offsetLeft - tableSpace,
    //       zIndex: item.zIndex ? item.zIndex + 2 : 2,
    //     };
    //   } else {
    //     return { ...item, width: Math.round(item.width) };
    //   }
    // });

    groups.forEach((groupItem: any, index) => {
      const isFullWidth = eventWidth === tableWidth;
      const offsetLeft = eventWidth * index;

      result.push({
        dateKey,
        event: groupItem.event,
        height:
          groupItem.eventHeight < EVENT_MIN_HEIGHT
            ? EVENT_MIN_HEIGHT
            : groupItem.eventHeight,
        width: isFullWidth ? eventWidth - tableSpace : eventWidth, // add
        // some padding
        offsetLeft: offsetLeft > 0 ? offsetLeft - tableSpace : offsetLeft,
        offsetTop: groupItem.offsetTop,
        zIndex: 2 + index,
        meta: {
          isFullWidth: eventWidth === 1,
          showTime:
            eventWidth >= SHOW_TIME_THRESHOLD &&
            groupItem.eventHeight >= SHOW_TIME_THRESHOLD,
          centerText: groupItem.eventHeight <= SHOW_TIME_THRESHOLD,
        },
      });
    });
  });

  return result;
};

const calculateDaysViewLayout = (
  calendarDays: DateTime[],
  events: any,
  baseWidth: number,
  config: any,
  selectedView: any
) => {
  const result: any = {};
  calendarDays.forEach((calendarDay) => {
    const formattedDayString: string = formatToDateKey(
      calendarDay,
      config.timezone
    );
    const dayEvents: any = events[formattedDayString];

    const positions = calculateNormalEventPositions(
      dayEvents,
      baseWidth,
      config,
      selectedView,
      formattedDayString
    );

    result[formattedDayString] = positions;
  });

  return result;
};

export const getDaysViewLayout = (
  events: any,
  calendarDays: DateTime[],
  config: Config,
  width: number,
  selectedView: CALENDAR_VIEW,
  isMobile?: boolean
) => {
  // add allDay flag to events
  const eventsParsed: CalendarEvent[] = parseAllDayEventsArray(
    events,
    config.timezone
  );

  // filter to header and normal events
  const headerEvents: any = {};
  const headerEventsTemp: any = [];
  const normalEvents: any = {};

  eventsParsed.forEach((event) => {
    const startDate: DateTime = DateTime.fromISO(event.startAt).setZone(
      event.timezoneStartAt || config.timezone
    );
    const key: string = formatToDateKey(startDate, config.timezone);

    if (event.allDay) {
      headerEventsTemp.push(event);
      if (headerEvents[key]) {
        headerEvents[key] = [...headerEvents[key], ...[event]];
      } else {
        headerEvents[key] = [event];
      }
    } else {
      if (normalEvents[key]) {
        normalEvents[key] = [...normalEvents[key], ...[event]];
      } else {
        normalEvents[key] = [event];
      }
    }
  });

  const headerPositions: any = calculatePositionForHeaderEvents(
    headerEventsTemp,
    getCorrectWidth(width, isMobile || false, CALENDAR_VIEW.WEEK),
    calendarDays,
    config,
    selectedView
  );

  // TODO filter header and normal events before
  const normalPositions: any = calculateDaysViewLayout(
    calendarDays,
    normalEvents,
    getCorrectWidth(width, isMobile || false, CALENDAR_VIEW.WEEK),
    config,
    selectedView
  );

  return { normalPositions, headerPositions };
};
