import { Config, TIME_FORMAT, WEEKDAY_START } from '../index';
import { DateTime } from 'luxon';

export const TEST_TIMEZONE = 'Europe/Berlin';

export const createConfigMock = (
  weekDayStart?: WEEKDAY_START,
  timezone?: string
): Config => {
  return {
    hasWorker: false,
    isDark: false,
    disableMobileDropdown: false,
    hourHeight: 40,
    timeFormat: TIME_FORMAT.H_24,
    timezone: timezone || TEST_TIMEZONE,
    weekDayStart: weekDayStart || WEEKDAY_START.MONDAY,
  };
};

export const getWeekDaysMock = (date = '2021-11-15T10:52:09.797') => {
  const result: DateTime[] = [];

  for (let i = 0; i < 7; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};

export const getWeekDaysInDSTMock = (date = '2021-08-15T10:52:09.797') => {
  const result: DateTime[] = [];

  for (let i = 0; i < 7; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};

export const getWeekDaysMockStartingSunday = (
  date = '2021-11-14T10:52:09.797'
) => {
  const result: DateTime[] = [];

  for (let i = 0; i < 7; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
export const getMonthDaysMock = (date = '2021-11-01T10:52:09.797') => {
  const result: DateTime[] = [];

  for (let i = 0; i < 43; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
export const getMonthDaysMockStartingSunday = (
  date = '2021-10-26T10:52:09.797'
) => {
  const result: DateTime[] = [];

  for (let i = 0; i < 43; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
export const getAgendaDaysMock = () => {
  const result: DateTime[] = [];

  for (let i = 0; i < 32; i += 1) {
    result.push(DateTime.fromISO('2021-10-01T10:52:09.797').plus({ days: i }));
  }

  return result;
};
