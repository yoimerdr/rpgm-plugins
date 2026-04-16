import {beforeEach, describe, expect, it} from 'vitest';

import {assignCommandToEvent, eventToCommand} from '@languages-plugin/mappers/event';
import {parameters} from '@languages-plugin/parameters';
import {applyExtensions} from "@languages-plugin/extensions";
import {LanguageTextCommand} from "@languages-plugin/models/source";
import {getKeys} from "@languages-plugin/shortcuts/properties";

const mkEvent = (id: number, list: Partial<EventItem>[] = [], pageIndex = 0): MapEvent => {
  const pages: MapEventPage[] = [];
  pages[pageIndex] = {
    list: list.map(c => ({code: 0, parameters: [], ...c}))
  } as MapEventPage;
  return {id, name: 'Event', pages: pages.filter(Boolean)} as MapEvent;
};

describe('eventToCommand', () => {
  beforeEach(() => {
    parameters.joinShowText = true;
    applyExtensions()
  });

  it('returns empty object for invalid event', () => {
    const result = eventToCommand({} as MapEvent);
    expect(result).toEqual({});
  });

  it('returns empty object for event with no pages', () => {
    const result = eventToCommand({id: 1, pages: []} as unknown as MapEvent);
    expect(result).toEqual({});
  });

  it('extracts text commands from event pages', () => {
    const event = {
      id: 5,
      name: 'Test Event',
      pages: [
        {
          list: [
            {code: 401, parameters: ['Hello world']},
            {code: 0, parameters: []}
          ]
        }
      ]
    };

    const result = eventToCommand(event as MapEvent);
    expect(result[0]).toBeDefined();
    expect(result[0][0]).toBeDefined();
    const json = JSON.parse(JSON.stringify(result[0][0]));
    expect(json.p).toEqual(['Hello world']);
  });

  it('joins multiple consecutive Show Text commands (401)', () => {
    parameters.joinShowText = true;
    const event = mkEvent(1, [
      {code: 401, parameters: ['Line 1']},
      {code: 401, parameters: ['Line 2']},
      {code: 401, parameters: ['Line 3']}
    ]);

    const result = eventToCommand(event);
    const json = JSON.parse(JSON.stringify(result[0][0]));
    expect(json.p).toEqual(['Line 1\nLine 2\nLine 3']);
  });

  it('extracts Show Choices commands (102)', () => {
    const event = mkEvent(1, [
      {code: 102, parameters: ['Choice A', 'Choice B']}
    ]);

    const result = eventToCommand(event);
    expect(result[0][0]).toBeDefined();
  });

  it('extracts Scroll Text commands (405)', () => {
    const event = mkEvent(1, [
      {code: 405, parameters: ['Scroll text here']}
    ]);

    const result = eventToCommand(event);
    expect(result[0][0]).toBeDefined();
  });

  it('does not join Show Text when joinShowText is false', () => {
    parameters.joinShowText = false;
    const event = mkEvent(
      1,
      [
        {code: 401, parameters: ['Line 1']},
        {code: 401, parameters: ['Line 2']}
      ]
    );

    const result = eventToCommand(event);
    expect(getKeys(result[0])).toHaveLength(2);
  });

  it('handles multiple pages correctly', () => {
    const event = mkEvent(
      1,
      [
        {code: 401, parameters: ['Page 0 text']},
      ]
    );

    event.pages.push({list: [{code: 401, parameters: ['Page 1 text']}]} as MapEventPage);

    const result = eventToCommand(event as MapEvent);
    const json0 = JSON.parse(JSON.stringify(result[0][0]));
    const json1 = JSON.parse(JSON.stringify(result[1][0]));
    expect(json0.p).toEqual(['Page 0 text']);
    expect(json1.p).toEqual(['Page 1 text']);
  });
});

describe('assignCommandToEvent', () => {
  beforeEach(() => {
    parameters.joinShowText = true;
  });

  it('does nothing with empty commands', () => {
    const events = [
      {id: 0, pages: [{list: [{code: 401, parameters: ['original']}]}]}
    ];
    assignCommandToEvent({}, events as MapEvent[]);
    expect(events[0].pages[0].list[0].parameters[0]).toBe('original');
  });

  it('does nothing with invalid events', () => {
    expect(() => assignCommandToEvent({}, [])).not.toThrow();
    expect(() => {
      const nullEvents = null as unknown as MapEvent[];
      assignCommandToEvent({}, nullEvents);
    }).not.toThrow();
  });

  it('assigns text to matching event commands', () => {
    const events = [
      {id: 0, pages: [{list: [{code: 401, parameters: ['original']}]}]}
    ];
    const commands = {
      0: {
        0: {p: ['translated'], l: 1}
      }
    } as unknown as LanguageTextCommand;

    assignCommandToEvent([commands], events as MapEvent[]);
    expect(events[0].pages[0].list[0].parameters[0]).toBe('translated');
  });

  it('handles page index correctly', () => {
    const events = [
      mkEvent(1, [], 0),
    ];
    events[0].pages.push({list: [{code: 41, parameters: []}, {code: 401, parameters: ['original']}]} as MapEventPage);
    const commands = {
      1: {
        1: {p: ['page 1 text'], l: 1}
      }
    } as unknown as LanguageTextCommand;

    assignCommandToEvent([commands], events as MapEvent[]);
    expect(events[0].pages[1].list[1].parameters[0]).toBe('page 1 text');
  });

  it('handles multiple commands in sequence', () => {
    const events = [
      mkEvent(1, [
        {code: 401, parameters: ['first']},
        {code: 401, parameters: ['second']},
        {code: 401, parameters: ['third']}
      ], 0),
    ];
    const commands = {
      0: {
        0: {p: ['primero\nsegundo\ntercero'], l: 3}
      }
    } as unknown as LanguageTextCommand;

    assignCommandToEvent([commands], events as MapEvent[]);
    expect(events[0].pages[0].list[0].parameters[0]).toBe('primero');
    expect(events[0].pages[0].list[1].parameters[0]).toBe('segundo');
    expect(events[0].pages[0].list[2].parameters[0]).toBe('tercero');
  });

  it('skips commands that are not text codes', () => {
    const events = [
      {id: 1, pages: [{list: [{code: 101, parameters: ['not text']}]}]}
    ];
    const commands = {
      1: {0: {p: ['should not apply']}}
    };

    assignCommandToEvent(commands, events as MapEvent[]);
    expect(events[0].pages[0].list[0].parameters[0]).toBe('not text');
  });
});