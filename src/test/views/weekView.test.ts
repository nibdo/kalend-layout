/* eslint-disable no-undef */
import { CALENDAR_VIEW, CalendarEvent, LayoutRequestData } from '../../index';
import { TEST_TIMEZONE, createConfigMock, getWeekDaysMock } from '../common';
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

const eventC: any = {
  id: '4',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-15T08:00:00.000Z',
  endAt: '2021-11-16T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const weekViewLayoutData = (events?: CalendarEvent[]): LayoutRequestData => {
  return {
    calendarDays: getWeekDaysMock(),
    config: createConfigMock(),
    events: events ? events.map((item: CalendarEvent) => ({ ...item })) : [],
    height: 600,
    selectedView: CALENDAR_VIEW.WEEK,
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

    assert.equal(eventResult1.height, 20);
    assert.equal(eventResult1.width, 95);
    assert.equal(eventResult1.offsetLeft, 2);
    assert.equal(eventResult1.offsetTop, 0);

    assert.equal(eventResult2.height, 20);
    assert.equal(eventResult2.width, 199);
    assert.equal(eventResult2.offsetLeft, 2);
    assert.equal(eventResult2.offsetTop, 21);

    assert.equal(eventResult3.height, 20);
    assert.equal(eventResult3.width, 95);
    assert.equal(eventResult3.offsetLeft, 105.57142857142857);
    assert.equal(eventResult3.offsetTop, 0);

    assert.equal(eventResult4.height, 20);
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
});
