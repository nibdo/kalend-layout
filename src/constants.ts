// constants
export const EVENT_TABLE_DELIMITER_SPACE = 8;
export const FLOATING_DATETIME = 'floating'; // fixed datetime without timezone
export const UTC_TIMEZONE = 'UTC';
export const CALENDAR_OFFSET_LEFT = 40;
export const EVENT_MIN_HEIGHT = 8;
export const SCROLLBAR_WIDTH = 15;
export const SHOW_TIME_THRESHOLD = 60;
export const ONE_DAY = 1;
export const THREE_DAYS = 3;
export const SEVEN_DAYS = 7;
export const MONTH_EVENT_HEIGHT = 17;
export const HEADER_EVENT_HEIGHT = 20;

export const getEventHeight = (isHeaderEvents?: boolean) => {
  if (isHeaderEvents) {
    return HEADER_EVENT_HEIGHT;
  }

  return MONTH_EVENT_HEIGHT;
};
