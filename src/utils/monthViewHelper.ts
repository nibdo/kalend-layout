/**
 * Get how many events can fit in one day column in month view
 * @param height
 */
export const getMaxEventsVisible = (height: number) => {
  const baseHeight = parseInt((height / 6 - 22).toString());

  // number of events
  const baseFit = (baseHeight - 15) / 17;

  // number of events with offset top
  const baseFitWithOffset = (baseHeight - 15) / (17 + baseFit);

  const result = parseInt(baseFitWithOffset.toString());
  return result;
};

/**
 * Get row of days in month view
 * @param calendarDays
 */
export const getMonthRows = (calendarDays: any[]): any => {
  const calendarDaysRows: any[][] = [];

  let tempArray: any[] = [];

  calendarDays.forEach((item, i) => {
    const index = i + 1;
    if (index % 7 === 0) {
      tempArray.push(item); // TODO REMOVE
      calendarDaysRows.push(tempArray);
      tempArray = [];
    } else {
      tempArray.push(item);
    }
  });

  return calendarDaysRows;
};
