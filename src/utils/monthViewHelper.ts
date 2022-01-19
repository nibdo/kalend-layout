/**
 * Get how many events can fit in one day column in month view
 * @param height
 */
export const getMaxEventsVisible = (height: number) => {
  const result = Number(((height / 6 - 22) / 19 - 1).toFixed(0));
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
