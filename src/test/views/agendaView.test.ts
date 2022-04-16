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
  endAt: '2021-11-15T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventD: any = {
  id: '5',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-15T08:00:00.000Z',
  endAt: '2021-11-17T09:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const agendaViewLayoutData = (events?: CalendarEvent[]): LayoutRequestData => {
  return {
    calendarDays: getWeekDaysMock(),
    config: createConfigMock(),
    events: events ? events.map((item: CalendarEvent) => ({ ...item })) : [],
    height: 600,
    selectedView: CALENDAR_VIEW.AGENDA,
    width: 740,
  };
};

describe(`agendaView layout`, function () {
  it('should return layout with two events', async function () {
    const result = await KalendLayout(agendaViewLayoutData([eventA, eventC]));

    const eventAResult = result.events?.['15-11-2021'][0];

    assert.equal(result.events['15-11-2021'].length, 2);
    assert.equal(result.events['16-11-2021'], undefined);
    assert.equal(result.events['17-11-2021'], undefined);
    assert.equal(eventAResult.id, '2');
    assert.equal(eventAResult.summary, eventA.summary);
  });

  it('should return layout with multi day events', async function () {
    const result = await KalendLayout(agendaViewLayoutData([eventA, eventD]));

    const eventDResult = result.events?.['15-11-2021'][1];
    const eventAResult = result.events?.['15-11-2021'][0];

    assert.equal(result.events['15-11-2021'].length, 2);
    assert.equal(result.events['16-11-2021'].length, 1);
    assert.equal(result.events['17-11-2021'].length, 1);
    assert.equal(eventDResult.id, '5');
    assert.equal(eventAResult.summary, eventA.summary);
    assert.equal(eventDResult.summary, `${eventD.summary} 1/3`);
    assert.equal(result.events['16-11-2021'][0].id, eventDResult.id);
    assert.equal(
      result.events['16-11-2021'][0].summary,
      `${eventD.summary} 2/3`
    );
    assert.equal(result.events['17-11-2021'][0].id, eventDResult.id);
    assert.equal(
      result.events['17-11-2021'][0].summary,
      `${eventD.summary} 3/3`
    );
  });
});
