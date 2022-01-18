import { CALENDAR_VIEW, LayoutRequestData, LayoutResult } from '../index';
import { checkIfIsDaysView } from '../utils/commonHelper';
import { getDaysViewLayout } from './daysView';
import { getMaxEventsVisible } from '../utils/monthViewHelper';
import { getMonthViewLayout } from './monthView';
import { mapEventsToDate, parseToCalendarDays } from '../utils/Helper';
import { validateInput } from '../utils/validator';

export default (data: LayoutRequestData): Promise<LayoutResult> => {
  return new Promise((resolve) => {
    if (data) {
      validateInput(data);

      const { events, width, config, height, isMobile, selectedView } = data;

      // parse to calendar days if dates are ISO string
      const calendarDays = parseToCalendarDays(data.calendarDays);

      // calculate layout for different views
      if (selectedView === CALENDAR_VIEW.MONTH) {
        const monthPositions = getMonthViewLayout(
          events,
          width,
          calendarDays,
          config,
          getMaxEventsVisible(height)
        );

        resolve({
          selectedView: CALENDAR_VIEW.MONTH,
          ...monthPositions,
          calendarDays,
          overflowingEvents: monthPositions.overflowingEvents,
        });
      } else if (checkIfIsDaysView(selectedView)) {
        const result = getDaysViewLayout(
          events,
          calendarDays,
          config,
          width,
          selectedView,
          isMobile
        );

        resolve({
          selectedView,
          headerPositions: result.headerPositions.positions,
          headerOffsetTop: result.headerPositions.headerOffsetTop,
          calendarDays,
          normalPositions: result.normalPositions,
        });
      } else if (selectedView === CALENDAR_VIEW.AGENDA) {
        // format events to date key obj
        const eventsDateKeyed: any = mapEventsToDate(events, config.timezone);

        resolve(eventsDateKeyed);
      }
    }
  });
};
