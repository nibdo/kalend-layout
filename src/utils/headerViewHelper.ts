import { CALENDAR_VIEW, Config } from '../index';
import { DateTime } from 'luxon';
import { formatToDateKey } from './Helper';
import { getDaysNum } from './KalendHelper';
import { getRowLayout } from './commonHelper';
import { prepareMultiDayEvents } from '../views/monthView';

export const calculatePositionForHeaderEvents = (
  events: any,
  width: number,
  calendarDays: DateTime[],
  config: Config,
  selectedView: CALENDAR_VIEW
): any => {
  if (!events) {
    return [[]];
  }

  const breakPointDate = formatToDateKey(
    calendarDays[calendarDays.length - 1],
    config.timezone
  );

  const preparedEvents: any = prepareMultiDayEvents(
    events,
    config,
    breakPointDate,
    selectedView
  );

  const rowResult = getRowLayout(
    preparedEvents,
    width / getDaysNum(selectedView),
    calendarDays,
    config.timezone,
    150,
    true
  );

  return rowResult;
};
