import { CALENDAR_VIEW, CalendarEvent, Config } from '../index';
import { DateTime } from 'luxon';
import { ONE_DAY, SCROLLBAR_WIDTH, SEVEN_DAYS, THREE_DAYS } from '../constants';

export const getDaysNum = (calendarView: CALENDAR_VIEW): number => {
  switch (calendarView) {
    case CALENDAR_VIEW.WEEK:
      return SEVEN_DAYS;
    case CALENDAR_VIEW.THREE_DAYS:
      return THREE_DAYS;
    case CALENDAR_VIEW.DAY:
      return ONE_DAY;
    default:
      return SEVEN_DAYS;
  }
};

export const getCorrectWidth = (
  width: number,
  isMobile: boolean,
  selectedView: CALENDAR_VIEW
): number => {
  if (
    selectedView === CALENDAR_VIEW.WEEK ||
    selectedView === CALENDAR_VIEW.DAY ||
    selectedView === CALENDAR_VIEW.THREE_DAYS
  ) {
    if (isMobile) {
      return width;
    } else {
      return width - SCROLLBAR_WIDTH;
    }
  }

  return width;
};

export const getEventDateTime = (event: CalendarEvent, config: Config) => {
  const dateTimeStart = DateTime.fromISO(event.startAt).setZone(
    event.timezoneStartAt || config.timezone
  );
  const dateTimeEnd = DateTime.fromISO(event.endAt).setZone(
    event.timezoneStartAt || config.timezone
  );

  return {
    dateTimeStart,
    dateTimeEnd,
  };
};
