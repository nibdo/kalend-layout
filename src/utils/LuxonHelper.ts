import { DateTime, DurationObjectUnits } from 'luxon';
import { FLOATING_DATETIME, UTC_TIMEZONE } from '../constants';

export const LuxonHelper: any = {
  isSameDay: (dateA: DateTime, dateB: DateTime): boolean => {
    return (
      dateA.year === dateB.year &&
      dateA.month === dateB.month &&
      dateA.day === dateB.day
    );
  },

  differenceInDays: (start: DateTime, end: DateTime): number => {
    const diffInDaysObj: DurationObjectUnits = end
      .diff(start, 'hours')
      .toObject();

    const diffInHours = diffInDaysObj.hours;

    if (diffInHours) {
      if (diffInHours < 24) {
        return 0;
      } else if (diffInHours === 24) {
        return 1;
      } else {
        return Number((diffInHours / 24).toFixed(0));
      }
    }

    return 0;
  },
};

export const parseToDateTime = (
  // @ts-ignore
  date: DateTime | string,
  zone: string,
  deviceTimezone?: string
  // @ts-ignore
): DateTime => {
  const dateString: string = typeof date === 'string' ? date : date.toString();

  const isFloatingDatetime: boolean = zone === FLOATING_DATETIME;

  // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
  if (isFloatingDatetime) {
    // @ts-ignore
    const dateFloating: DateTime = DateTime.fromISO(dateString, {
      zone: UTC_TIMEZONE,
    });

    return dateFloating.toUTC();
  }
  // @ts-ignore
  const thisDate: DateTime = DateTime.fromISO(dateString);

  if (!zone) {
    // Adjust datetime to device timezone
    if (deviceTimezone) {
      return thisDate.setZone(deviceTimezone);
    } else {
      return thisDate;
    }
  }

  return thisDate.setZone(zone);
};
