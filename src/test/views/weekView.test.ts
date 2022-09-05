/* eslint-disable no-undef */
import { CALENDAR_VIEW, CalendarEvent, LayoutRequestData } from '../../index';
import { DateTime } from 'luxon';
import { FLOATING_DATETIME, HEADER_EVENT_HEIGHT } from '../../constants';
import {
  TEST_TIMEZONE,
  createConfigMock,
  getWeekDaysInDSTMock,
  getWeekDaysMock,
} from '../common';
import KalendLayout from '../../views/main';
import assert from 'assert';

const eventA: any = {
  id: '2',
  summary: 'Test 2',
  calendarID: '1',
  startAt: '2021-11-15T18:00:00.000Z',
  endAt: '2021-11-15T19:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventB: any = {
  id: '5',
  summary: 'Test 5',
  calendarID: '1',
  startAt: '2021-11-16T00:00:00.000Z',
  endAt: '2021-11-17T02:00:00.000Z',
  timezoneStartAt: FLOATING_DATETIME,
  allDay: true,
};

const eventC: any = {
  id: '4',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-15T08:00:00.000Z',
  endAt: '2021-11-16T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventD: any = {
  id: '1',
  summary: 'Test 1',
  calendarID: '1',
  startAt: '2021-11-14T22:00:00.000Z',
  endAt: '2021-11-17T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventE: any = {
  id: '5',
  summary: 'Test 5',
  calendarID: '1',
  startAt: '2021-11-16T00:00:00.000Z',
  endAt: '2021-11-16T00:00:00.000Z',
  timezoneStartAt: FLOATING_DATETIME,
  allDay: true,
};

const eventF: any = {
  id: '6',
  startAt: '2021-11-16T00:00:00.000Z',
  endAt: '2021-11-17T23:59:59.999Z',
  timezoneStartAt: 'UTC',
  summary: 'Test 5',
  calendarID: 'simple',
  allDay: true,
};

const eventG: any = {
  id: '1',
  summary: 'Test 1',
  calendarID: '1',
  startAt: '2021-11-15T22:00:00.000Z',
  endAt: '2021-11-16T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};
const eventH: any = {
  id: '1',
  summary: 'Test 1',
  calendarID: '1',
  startAt: '2021-08-15T22:00:00.000Z',
  endAt: '2021-08-16T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventT: any = {
  id: '5',
  summary: 'Test 5',
  calendarID: '1',
  startAt: '2021-11-18T00:00:00.000Z',
  endAt: '2021-11-19T00:00:00.000Z',
  timezoneStartAt: FLOATING_DATETIME,
};

const eventW: any = {
  id: '5',
  summary: 'Test 5',
  calendarID: '1',
  startAt: '2021-11-18T00:00:00.000Z',
  endAt: '2021-11-18T00:00:00.000Z',
  timezoneStartAt: FLOATING_DATETIME,
  timezoneEndAt: FLOATING_DATETIME,
  allDay: true,
};

const eventR: any = {
  id: '5',
  summary: 'Test 5',
  calendarID: '1',
  startAt: '2021-11-18T00:00:00.000Z',
  endAt: '2021-11-19T00:00:00.000Z',
  timezoneStartAt: FLOATING_DATETIME,
  timezoneEndAt: FLOATING_DATETIME,
};

const eventX: any = {
  id: '5',
  summary: 'Test 5',
  calendarID: '1',
  startAt: '2021-08-17T00:00:00.000Z',
  endAt: '2021-08-18T00:00:00.000Z',
  timezoneStartAt: FLOATING_DATETIME,
  timezoneEndAt: FLOATING_DATETIME,
};

const weekViewLayoutData = (
  events?: CalendarEvent[],
  config?: any
): LayoutRequestData => {
  return {
    calendarDays: getWeekDaysMock(),
    config: config || createConfigMock(),
    events: events ? events.map((item: CalendarEvent) => ({ ...item })) : [],
    height: 600,
    selectedView: CALENDAR_VIEW.WEEK,
    width: 740,
  };
};

const weekViewLayoutDataInDST = (
  events?: CalendarEvent[]
): LayoutRequestData => {
  return {
    calendarDays: getWeekDaysInDSTMock(),
    config: createConfigMock(),
    events: events ? events.map((item: CalendarEvent) => ({ ...item })) : [],
    height: 600,
    selectedView: CALENDAR_VIEW.WEEK,
    width: 740,
  };
};

const dayViewLayoutData = (
  date: string,
  events?: CalendarEvent[]
): LayoutRequestData => {
  return {
    calendarDays: [DateTime.fromISO(date)],
    config: createConfigMock(),
    events: events ? events.map((item: CalendarEvent) => ({ ...item })) : [],
    height: 600,
    selectedView: CALENDAR_VIEW.DAY,
    width: 740,
  };
};

describe(`weekView layout`, function () {
  it('should return layout with no events', async function () {
    const result = await KalendLayout(weekViewLayoutData());

    assert.equal(result.headerPositions.length, 0);
    assert.equal(result.normalPositions?.['15-11-2021'].length, 0);
  });
  it('should return layout with simple events', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventA, eventC]));

    const eventCResult = result.normalPositions?.['15-11-2021'][0];

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 199);
    assert.equal(result.headerPositions[0].offsetLeft, 2);
    assert.equal(result.headerPositions[0].event.allDay, true);
    assert.equal(result.normalPositions?.['15-11-2021'].length, 1);
    assert.equal(eventCResult.height, 40);
    assert.equal(eventCResult.width, 95.28571428571428);
    assert.equal(eventCResult.offsetLeft, 0);
    assert.equal(eventCResult.offsetTop, 760);
    assert.equal(eventCResult.event.allDay, false);
  });

  it('should return layout with event in DST', async function () {
    const result = await KalendLayout(weekViewLayoutDataInDST([eventH]));

    const eventBResultTwo = result.normalPositions?.['16-08-2021'][0];

    assert.equal(result.headerPositions.length, 0);
    assert.equal(result.normalPositions?.['15-08-2021'].length, 0);
    assert.equal(result.normalPositions?.['16-08-2021'].length, 1);

    assert.equal(eventBResultTwo.height, 440);
    assert.equal(eventBResultTwo.width, 95.28571428571428);
    assert.equal(eventBResultTwo.offsetLeft, 0);
    assert.equal(eventBResultTwo.offsetTop, 0);
    assert.equal(eventBResultTwo.event.allDay, false);
  });

  it('should return layout with event DST false', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventG]));

    const eventBResultOne = result.normalPositions?.['15-11-2021'][0];
    const eventBResultTwo = result.normalPositions?.['16-11-2021'][0];

    assert.equal(result.headerPositions.length, 0);
    assert.equal(result.normalPositions?.['15-11-2021'].length, 1);
    assert.equal(result.normalPositions?.['16-11-2021'].length, 1);

    assert.equal(eventBResultOne.height, 39.98888888888889);
    assert.equal(eventBResultOne.width, 95.28571428571428);
    assert.equal(eventBResultOne.offsetLeft, 0);
    assert.equal(eventBResultOne.offsetTop, 920);
    assert.equal(eventBResultOne.event.allDay, false);
    assert.equal(eventBResultTwo.height, 400);
    assert.equal(eventBResultTwo.width, 95.28571428571428);
    assert.equal(eventBResultTwo.offsetLeft, 0);
    assert.equal(eventBResultTwo.offsetTop, 0);
    assert.equal(eventBResultTwo.event.allDay, false);
  });

  it('should return layout with event in header for longer duration', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventD]));

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.normalPositions?.['15-11-2021'].length, 0);
    assert.equal(result.normalPositions?.['16-11-2021'].length, 0);
  });

  it('should return layout with two stack events', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([
        {
          ...eventC,
          id: '41',
          startAt: '2021-11-15T08:00:00.000Z',
          endAt: '2021-11-15T09:00:00.000Z',
        },
        {
          ...eventC,
          id: '42',
          startAt: '2021-11-15T07:00:00.000Z',
          endAt: '2021-11-15T10:00:00.000Z',
        },
      ])
    );

    const eventResult1 = result.normalPositions?.['15-11-2021'][0];
    const eventResult2 = result.normalPositions?.['15-11-2021'][1];

    assert.equal(result.headerPositions.length, 0);

    assert.equal(result.normalPositions?.['15-11-2021'].length, 2);

    assert.equal(eventResult1.height, 120);
    assert.equal(eventResult1.width, 51.785714285714285);
    assert.equal(eventResult1.offsetLeft, 0);
    assert.equal(eventResult1.offsetTop, 320);

    assert.equal(eventResult2.height, 40);
    assert.equal(eventResult2.width, 51.785714285714285);
    assert.equal(eventResult2.offsetLeft, 43.5);
    assert.equal(eventResult2.offsetTop, 360);
  });

  it('should return layout with two stack events', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([
        {
          ...eventC,
          id: '41',
          startAt: '2021-11-15T08:00:00.000Z',
          endAt: '2021-11-15T09:00:00.000Z',
        },
        {
          ...eventC,
          id: '42',
          startAt: '2021-11-15T07:00:00.000Z',
          endAt: '2021-11-15T10:00:00.000Z',
        },
      ])
    );

    const eventResult1 = result.normalPositions?.['15-11-2021'][0];
    const eventResult2 = result.normalPositions?.['15-11-2021'][1];

    assert.equal(result.headerPositions.length, 0);

    assert.equal(result.normalPositions?.['15-11-2021'].length, 2);

    assert.equal(eventResult1.height, 120);
    assert.equal(eventResult1.width, 51.785714285714285);
    assert.equal(eventResult1.offsetLeft, 0);
    assert.equal(eventResult1.offsetTop, 320);

    assert.equal(eventResult2.height, 40);
    assert.equal(eventResult2.width, 51.785714285714285);
    assert.equal(eventResult2.offsetLeft, 43.5);
    assert.equal(eventResult2.offsetTop, 360);
  });

  it('should return layout with multi-day header events', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([
        {
          ...eventC,
          id: '41',
          startAt: '2021-11-15T08:00:00.000Z',
          endAt: '2021-11-15T09:00:00.000Z',
          allDay: true,
        },
        {
          ...eventC,
          id: '42',
          startAt: '2021-11-15T07:00:00.000Z',
          endAt: '2021-11-16T10:00:00.000Z',
        },
        {
          ...eventC,
          id: '43',
          startAt: '2021-11-16T07:00:00.000Z',
          endAt: '2021-11-16T10:00:00.000Z',
          allDay: true,
        },
        {
          ...eventC,
          id: '44',
          startAt: '2021-11-16T07:00:00.000Z',
          endAt: '2021-11-17T10:00:00.000Z',
        },
      ])
    );

    assert.equal(result.headerPositions.length, 4);

    const eventResult1 = result.headerPositions[0];
    const eventResult2 = result.headerPositions[1];
    const eventResult3 = result.headerPositions[2];
    const eventResult4 = result.headerPositions[3];

    assert.equal(result.normalPositions?.['15-11-2021'].length, 0);

    assert.equal(eventResult1.height, HEADER_EVENT_HEIGHT);
    assert.equal(eventResult1.width, 95);
    assert.equal(eventResult1.offsetLeft, 2);
    assert.equal(eventResult1.offsetTop, 0);

    assert.equal(eventResult2.height, HEADER_EVENT_HEIGHT);
    assert.equal(eventResult2.width, 199);
    assert.equal(eventResult2.offsetLeft, 2);
    assert.equal(eventResult2.offsetTop, 21);

    assert.equal(eventResult3.height, HEADER_EVENT_HEIGHT);
    assert.equal(eventResult3.width, 95);
    assert.equal(eventResult3.offsetLeft, 105.57142857142857);
    assert.equal(eventResult3.offsetTop, 0);

    assert.equal(eventResult4.height, HEADER_EVENT_HEIGHT);
    assert.equal(eventResult4.width, 199);
    assert.equal(eventResult4.offsetLeft, 105.57142857142857);
    assert.equal(eventResult4.offsetTop, 42);
  });

  it('should return layout with multi day event from previous week', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([
        {
          ...eventC,
          startAt: '2021-11-01T07:00:00.000Z',
          endAt: '2021-11-17T10:00:00.000Z',
        },
      ])
    );

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 302);
    assert.equal(result.headerPositions[0].offsetLeft, 2);
    assert.equal(result.headerPositions[0].event.allDay, true);
    assert.equal(result.normalPositions?.['15-11-2021'].length, 0);
  });

  it('should return layout with all day event with floating timezone', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([
        {
          ...eventC,
          startAt: '2021-11-17T00:00:00.000Z',
          endAt: '2021-11-17T23:59:00.000Z',
          allDay: true,
          timezoneStartAt: FLOATING_DATETIME,
        },
      ])
    );

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 95);
    assert.equal(result.headerPositions[0].offsetLeft, 209.14285714285714);
    assert.equal(result.headerPositions[0].event.allDay, true);
    assert.equal(
      result.headerPositions[0].event.startAt,
      '2021-11-17T00:00:00.000Z'
    );
    assert.equal(
      result.headerPositions[0].event.timezoneStartAt,
      FLOATING_DATETIME
    );
    assert.equal(result.normalPositions?.['17-11-2021'].length, 0);
  });

  it('should return layout with all day event across two days', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventE]));

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 95);
    assert.equal(result.headerPositions[0].offsetLeft, 105.57142857142857);
    assert.equal(result.headerPositions[0].event.allDay, true);
    assert.equal(result.headerPositions[0].event.startAt, eventE.startAt);
    assert.equal(
      result.headerPositions[0].event.timezoneStartAt,
      FLOATING_DATETIME
    );
    assert.equal(result.normalPositions?.['17-11-2021'].length, 0);
  });

  it('should return layout with all day event across two days for day view', async function () {
    const result = await KalendLayout(
      dayViewLayoutData(eventE.startAt, [eventE])
    );

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 667);
    assert.equal(result.headerPositions[0].offsetLeft, 2);
    assert.equal(result.headerPositions[0].event.allDay, true);
    assert.equal(result.headerPositions[0].event.startAt, eventE.startAt);
    assert.equal(
      result.headerPositions[0].event.timezoneStartAt,
      FLOATING_DATETIME
    );
    assert.equal(result.normalPositions?.['16-11-2021'].length, 0);
  });
  it('should return layout with all day event across two days for day view', async function () {
    const result = await KalendLayout(
      dayViewLayoutData(eventE.startAt, [eventE])
    );
    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 667);
    assert.equal(result.headerPositions[0].offsetLeft, 2);
    assert.equal(result.headerPositions[0].event.allDay, true);
    assert.equal(result.headerPositions[0].event.startAt, eventE.startAt);
    assert.equal(
      result.headerPositions[0].event.timezoneStartAt,
      FLOATING_DATETIME
    );
    assert.equal(result.normalPositions?.['16-11-2021'].length, 0);
  });

  it('should spawn event to three days', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventF]));

    const event = result.headerPositions[0].event;

    assert.equal(result.headerPositions.length, 1);
    assert.equal(event.daySpawns.length, 3);
  });

  it('should show event with floating timezone spawn one day', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventE]));

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 95);
    assert.equal(result.headerPositions[0].offsetLeft, 105.57142857142857);
  });

  it('should show event with floating timezone spawn one day with UTC zone', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([eventE], createConfigMock(undefined, 'UTC'))
    );

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 95);
    assert.equal(result.headerPositions[0].offsetLeft, 105.57142857142857);
  });

  it(
    'should show event with floating timezone spawn two days with' +
      ' America/Nome' +
      ' zone',
    async function () {
      const result = await KalendLayout(
        weekViewLayoutData(
          [eventT],
          createConfigMock(undefined, 'America/Nome')
        )
      );

      const event = result.headerPositions[0].event;

      assert.equal(result.headerPositions.length, 1);
      assert.equal(event.daySpawns.length, 2);
      assert.equal(result.headerPositions[0].width, 199);
      assert.equal(result.headerPositions[0].offsetLeft, 312.7142857142857);
    }
  );

  it('should show event from 00 to 00 as 1 day spawn', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([eventW], createConfigMock(undefined, 'Europe/Berlin'))
    );

    assert.equal(result.headerPositions.length, 1);
    assert.equal(result.headerPositions[0].width, 95);
    assert.equal(result.headerPositions[0].offsetLeft, 312.7142857142857);
  });

  it('should show event with floating timezone spawn two days', async function () {
    const result = await KalendLayout(weekViewLayoutData([eventB]));

    const event = result.headerPositions[0].event;

    assert.equal(result.headerPositions.length, 1);
    assert.equal(event.daySpawns.length, 2);
    assert.equal(result.headerPositions[0].width, 199);
    assert.equal(result.headerPositions[0].offsetLeft, 105.57142857142857);
  });

  it(
    'should show event with floating timezone spawn two days with config' +
      ' mock',
    async function () {
      const result = await KalendLayout(
        weekViewLayoutData([eventB], createConfigMock(undefined, 'UTC'))
      );

      const event = result.headerPositions[0].event;

      assert.equal(result.headerPositions.length, 1);
      assert.equal(event.daySpawns.length, 2);
      assert.equal(result.headerPositions[0].width, 199);
      assert.equal(result.headerPositions[0].offsetLeft, 105.57142857142857);
    }
  );

  it('should show event with floating timezone spawn two days', async function () {
    const result = await KalendLayout(
      weekViewLayoutData([eventR], createConfigMock(undefined, 'Europe/Berlin'))
    );

    const event = result.headerPositions[0].event;

    assert.equal(result.headerPositions.length, 1);
    assert.equal(event.daySpawns.length, 2);
    assert.equal(result.headerPositions[0].width, 199);
    assert.equal(result.headerPositions[0].offsetLeft, 312.7142857142857);
  });

  it(
    'should show event with floating timezone spawn two days with config' +
      ' mock',
    async function () {
      const result = await KalendLayout(
        weekViewLayoutData([eventR], createConfigMock(undefined, 'UTC'))
      );

      const event = result.headerPositions[0].event;

      assert.equal(result.headerPositions.length, 1);
      assert.equal(event.daySpawns.length, 2);
      assert.equal(result.headerPositions[0].width, 199);
      assert.equal(result.headerPositions[0].offsetLeft, 312.7142857142857);
    }
  );

  it('should show event with floating timezone spawn two days', async function () {
    const result = await KalendLayout(
      weekViewLayoutDataInDST(
        [eventX],
        createConfigMock(undefined, 'Europe/Berlin')
      )
    );

    const event = result.headerPositions[0].event;

    assert.equal(result.headerPositions.length, 1);
    assert.equal(event.daySpawns.length, 2);
    assert.equal(result.headerPositions[0].width, 199);
    assert.equal(result.headerPositions[0].offsetLeft, 209.14285714285714);
  });

  it(
    'should show event with floating timezone spawn two days with config' +
      ' mock',
    async function () {
      const result = await KalendLayout(
        weekViewLayoutDataInDST([eventX], createConfigMock(undefined, 'UTC'))
      );

      const event = result.headerPositions[0].event;

      assert.equal(result.headerPositions.length, 1);
      assert.equal(event.daySpawns.length, 2);
      assert.equal(result.headerPositions[0].width, 199);
      assert.equal(result.headerPositions[0].offsetLeft, 209.14285714285714);
    }
  );
});
