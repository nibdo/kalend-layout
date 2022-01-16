/* eslint-disable no-undef */

import { CalendarEvent } from '../index';
import { TEST_TIMEZONE } from './common';
import { parseAllDayEvent, parseAllDayEvents } from '../utils/allDayEvents';
import assert from 'assert';

const eventA: any = {
  id: '2',
  summary: 'Test 2',
  calendarID: '1',
  startAt: '2021-11-07T18:00:00.000Z',
  endAt: '2021-11-08T19:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventB: any = {
  id: '3',
  summary: 'Test 3',
  calendarID: '1',
  startAt: '2021-11-07T18:00:00.000Z',
  endAt: '2021-11-07T19:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

const eventData: any = {
  '07-11-2021': [eventA, eventB],
};

describe(`allDayEvents funcs`, function () {
  it('allDayEvents func: Should set props for allDay events', function () {
    const result: any = parseAllDayEvents(eventData, TEST_TIMEZONE);
    const events: CalendarEvent[] = result['07-11-2021'];

    assert.equal(events[0].allDay, true);
    assert.equal(events[1].allDay, false);
  });
  it('allDayEvent func: Should set props for allDay event', function () {
    const result: any = parseAllDayEvent(eventA, TEST_TIMEZONE);

    assert.equal(result.allDay, true);
  });
  it('allDayEvent func: Should not set props for allDay event', function () {
    const result: any = parseAllDayEvent(eventB, TEST_TIMEZONE);

    assert.equal(result.allDay, false);
  });
});
