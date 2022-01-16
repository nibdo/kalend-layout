/* eslint-disable no-undef */

import { CALENDAR_VIEW, CalendarEvent, LayoutRequestData } from '../../index';
import { TEST_TIMEZONE, createConfigMock, getMonthDaysMock } from '../common';
import KalendLayout from '../../views/main';
import assert from 'assert';

const eventA: any = {
  id: '2',
  summary: 'Test 2',
  calendarID: '1',
  startAt: '2021-11-08T18:00:00.000Z',
  endAt: '2021-11-08T19:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventB: any = {
  id: '3',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-09T18:00:00.000Z',
  endAt: '2021-11-09T19:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventC: any = {
  id: '4',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-09T08:00:00.000Z',
  endAt: '2021-11-10T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventD: any = {
  id: '5',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-05T08:00:00.000Z',
  endAt: '2021-11-08T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const monthViewLayoutData = (events?: CalendarEvent[]): LayoutRequestData => {
  return {
    calendarDays: getMonthDaysMock(),
    config: createConfigMock(),
    events: events ? events.map((item: CalendarEvent) => ({ ...item })) : [],
    height: 600,
    selectedView: CALENDAR_VIEW.MONTH,
    width: 700,
  };
};

describe(`monthView layout`, function () {
  it('should return layout with no events', async function () {
    const result = await KalendLayout(monthViewLayoutData());

    assert.equal(result.positions?.length, 6);
    assert.equal(result.positions?.[0].length, 0);
    assert.equal(JSON.stringify(result.overflowingEvents), '{}');
  });
  it('should return layout with simple events', async function () {
    const result = await KalendLayout(monthViewLayoutData([eventA, eventB]));

    const positions = result.positions?.[1];

    assert.equal(result.positions?.length, 6);
    assert.equal(positions.length, 2);
    assert.equal(positions[0].event.id, eventA.id);
    assert.equal(positions[0].width, 92);
    assert.equal(positions[0].height, 20);
    assert.equal(positions[0].offsetTop, 0);
    assert.equal(positions[0].offsetLeft, 2);
    assert.equal(positions[1].event.id, eventB.id);
    assert.equal(positions[1].width, 92);
    assert.equal(positions[1].height, 20);
    assert.equal(positions[1].offsetTop, 0);
    assert.equal(positions[1].offsetLeft, 102);
    assert.equal(JSON.stringify(result.overflowingEvents), '{}');
  });

  it('should return layout with multi-day event', async function () {
    const result = await KalendLayout(
      monthViewLayoutData([eventA, eventB, eventC])
    );

    const positions = result.positions?.[1];

    assert.equal(result.positions?.length, 6);
    assert.equal(positions.length, 3);
    assert.equal(positions[1].event.id, eventB.id);
    assert.equal(positions[1].width, 92);
    assert.equal(positions[1].height, 20);
    assert.equal(positions[1].offsetTop, 0);
    assert.equal(positions[1].offsetLeft, 102);
    assert.equal(positions[2].event.id, eventC.id);
    assert.equal(positions[2].width, 192);
    assert.equal(positions[2].height, 20);
    assert.equal(positions[2].offsetTop, 21);
    assert.equal(positions[2].offsetLeft, 102);
    assert.equal(JSON.stringify(result.overflowingEvents), '{}');
  });

  it('should return layout with multi-day event across rows', async function () {
    const result = await KalendLayout(monthViewLayoutData([eventD]));

    const positions1 = result.positions?.[0];
    const positions2 = result.positions?.[1];

    assert.equal(result.positions?.length, 6);
    assert.equal(positions1.length, 1);
    assert.equal(positions2.length, 1);

    assert.equal(positions1[0].event.id, eventD.id);
    assert.equal(positions1[0].width, 292); // 3 days
    assert.equal(positions2[0].event.id, eventD.id);
    assert.equal(positions2[0].width, 92); // 1 day
    assert.equal(JSON.stringify(result.overflowingEvents), '{}');
  });

  it('should put events to overflowingEvents array', async function () {
    const result = await KalendLayout(
      monthViewLayoutData([
        eventB,
        { ...eventB, id: '45' },
        { ...eventB, id: '75' },
        { ...eventB, id: '62' },
        { ...eventB, id: '20' },
        { ...eventB, id: '21' },
      ])
    );

    const positions = result.positions?.[1];

    assert.equal(result.positions?.length, 6);
    assert.equal(positions.length, 2);
    assert.equal(result.overflowingEvents['09-11-2021'].length, 4);
  });

  it(
    'should put events to overflowingEvents array, but put multi-day on' +
      ' next day normally',
    async function () {
      const result = await KalendLayout(
        monthViewLayoutData([
          eventB,
          { ...eventB, id: '45' },
          { ...eventB, id: '75' },
          { ...eventB, id: '62' },
          { ...eventB, id: '20' },
          {
            ...eventB,
            id: '21',
            startAt: '2021-11-09T18:00:00.000Z',
            endAt: '2021-11-10T19:00:00.000Z',
          },
        ])
      );

      const positions = result.positions?.[1];

      assert.equal(result.positions?.length, 6);
      assert.equal(positions.length, 3);
      assert.equal(result.overflowingEvents['09-11-2021'].length, 4);
    }
  );

  it('should stack events to correct indexes', async function () {
    const result = await KalendLayout(
      monthViewLayoutData([
        {
          ...eventB,
          id: '46',
          startAt: '2021-11-09T05:00:00.000Z',
          endAt: '2021-11-11T09:00:00.000Z',
        },
        {
          ...eventB,
          id: '47',
          startAt: '2021-11-09T08:00:00.000Z',
          endAt: '2021-11-09T09:00:00.000Z',
        },
        {
          ...eventB,
          id: '20',
          startAt: '2021-11-09T18:00:00.000Z',
          endAt: '2021-11-10T19:00:00.000Z',
        },
        {
          ...eventB,
          id: '21',
          startAt: '2021-11-10T18:00:00.000Z',
          endAt: '2021-11-10T19:00:00.000Z',
        },
      ])
    );

    const positions = result.positions?.[1];

    assert.equal(result.positions?.length, 6);
    assert.equal(positions.length, 3);
    assert.equal(positions[0].offsetTop, 0);
    assert.equal(positions[0].width, 292);
    assert.equal(positions[0].offsetLeft, 102);
    assert.equal(positions[1].offsetTop, 21);
    assert.equal(positions[1].width, 92);
    assert.equal(positions[1].offsetLeft, 102);
    assert.equal(positions[2].offsetTop, 21);
    assert.equal(positions[2].width, 92);
    assert.equal(positions[2].offsetLeft, 202);
  });

  it('should return event from previous month', async function () {
    const result = await KalendLayout(
      monthViewLayoutData([
        {
          ...eventB,
          id: '46',
          startAt: '2021-08-09T05:00:00.000Z',
          endAt: '2021-11-05T09:00:00.000Z',
        },
      ])
    );

    const positions = result.positions?.[0];

    assert.equal(result.positions?.length, 6);
    assert.equal(positions.length, 1);
    assert.equal(positions[0].offsetTop, 0);
    assert.equal(positions[0].width, 492);
    assert.equal(positions[0].offsetLeft, 2);
  });
});
