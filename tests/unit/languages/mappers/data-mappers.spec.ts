import {describe, expect, it} from 'vitest';

import {actorFromTransform, actorToTransform,} from '@languages-plugin/mappers/actor';
import {itemFromTransform, itemToTransform,} from '@languages-plugin/mappers/item';
import {skillFromTransform, skillToTransform,} from '@languages-plugin/mappers/skill';
import {stateFromTransform, stateToTransform,} from '@languages-plugin/mappers/state';
import {troopFromTransform, troopToTransform,} from '@languages-plugin/mappers/troop';
import {mapFromTransform, mapToTransform,} from '@languages-plugin/mappers/map';
import {MapSource, Troop} from '@languages-plugin/models/source';

describe('actorToTransform / actorFromTransform', () => {
  const raw = {
    name: 'Hero',
    nickname: 'The One',
    profile: 'A brave soul.',
  } as DataActor;

  it('toTransform produces compact keys', () => {
    const result = actorToTransform(raw);
    const json = JSON.parse(JSON.stringify(result));
    expect(json.n).toBe('Hero');
    expect(json.c).toBe('The One');
    expect(json.p).toBe('A brave soul.');
  });

  it('fromTransform restores full property names', () => {
    const compact = { n: 'Hero', c: 'The One', p: 'A brave soul.' };
    const result = actorFromTransform(compact);
    expect(result.name).toBe('Hero');
    expect(result.nickname).toBe('The One');
    expect(result.profile).toBe('A brave soul.');
  });

  it('round-trips through toJSON', () => {
    const transformed = actorToTransform(raw);
    const json = JSON.parse(JSON.stringify(transformed));
    const restored = actorFromTransform(json);
    expect(restored.name).toBe('Hero');
  });

  it('omits empty properties in toJSON', () => {
    const partial = { name: 'Partial', nickname: '', profile: '' } as DataActor;
    const transformed = actorToTransform(partial);
    const json = JSON.parse(JSON.stringify(transformed));
    expect(json.n).toBe('Partial');
    expect('c' in json).toBe(false);
    expect('p' in json).toBe(false);
  });
});

describe('itemToTransform / itemFromTransform', () => {
  const raw = {
    name: 'Sword',
    description: 'A sharp blade.',
    note: '<tag>',
  } as RPG_ItemBase;

  it('packs to n/d/t', () => {
    const result = itemToTransform(raw);
    const json = JSON.parse(JSON.stringify(result));
    expect(json.n).toBe('Sword');
    expect(json.d).toBe('A sharp blade.');
    expect(json.t).toBe('<tag>');
  });

  it('unpacks back to name/description/note', () => {
    const compact = { n: 'Sword', d: 'A sharp blade.', t: '<tag>' };
    const result = itemFromTransform(compact);
    expect(result.name).toBe('Sword');
    expect(result.description).toBe('A sharp blade.');
    expect(result.note).toBe('<tag>');
  });
});

describe('skillToTransform / skillFromTransform', () => {
  const raw = {
    name: 'Fire',
    description: 'Burns enemies.',
    note: '',
    message1: ' cast Fire!',
    message2: '',
  } as DataSkill;

  it('includes message1/message2 mapped to "1"/"2"', () => {
    const result = skillToTransform(raw);
    const json = JSON.parse(JSON.stringify(result));
    expect(json['1']).toBe(' cast Fire!');
  });

  it('fromTransform restores message1', () => {
    const compact = { n: 'Fire', '1': ' cast Fire!' };
    const result = skillFromTransform(compact);
    expect(result.message1).toBe(' cast Fire!');
    expect(result.name).toBe('Fire');
  });
});

describe('stateToTransform / stateFromTransform', () => {
  const raw = { name: 'Poison', message3: 'is poisoned!', message4: 'recovered.' } as DataState;

  it('maps message3 and message4 to "3" and "4"', () => {
    const result = stateToTransform(raw);
    const json = JSON.parse(JSON.stringify(result));
    expect(json['3']).toBe('is poisoned!');
    expect(json['4']).toBe('recovered.');
  });

  it('restores full keys', () => {
    const compact = { n: 'Poison', '3': 'is poisoned!' };
    const result = stateFromTransform(compact);
    expect(result.name).toBe('Poison');
    expect(result.message3).toBe('is poisoned!');
  });
});

describe('troopToTransform / troopFromTransform', () => {
  it('maps name to "n" and messages to "m"', () => {
    const raw = { name: 'Goblin x3', messages: { 0: {} } } as Troop;
    const result = troopToTransform(raw);
    const json = JSON.parse(JSON.stringify(result));
    expect(json.n).toBe('Goblin x3');
    expect(json.m).toEqual({ 0: {} });
  });

  it('restores from compact', () => {
    const compact = { n: 'Goblin x3', m: { 0: {} } };
    const result = troopFromTransform(compact);
    expect(result.name).toBe('Goblin x3');
    expect(result.messages).toEqual({ 0: {} });
  });
});

describe('mapToTransform / mapFromTransform', () => {
  it('maps displayName to "n" and messages to "m"', () => {
    const raw = { displayName: 'Overworld', messages: { 1: {} } } as unknown as MapSource;
    const result = mapToTransform(raw);
    const json = JSON.parse(JSON.stringify(result));
    expect(json.n).toBe('Overworld');
    expect(json.m).toEqual({ 1: {} });
  });

  it('restores from compact', () => {
    const compact = { n: 'Overworld', m: { 1: {} } };
    const result = mapFromTransform(compact);
    expect(result.displayName).toBe('Overworld');
    expect(result.messages).toEqual({ 1: {} });
  });

  it('returns undefined values for missing keys', () => {
    const result = mapFromTransform({});
    expect(result.displayName).toBeUndefined();
    expect(result.messages).toBeUndefined();
  });
});