import {describe, it, expect, beforeEach} from 'vitest';
import {handler} from '@crossassets-plugin/handler';

describe('Handler getAsset', () => {
  beforeEach(() => handler.setup());

  it('resolves exact filepath', () => {
    const result = handler.getAsset("img/animations/absorb");
    expect(result.resolved).toBe(true);
    expect(result.path).toBe("img/animations/Absorb");
  });

  it('resolves case-insensitive filepath', () => {
    const result = handler.getAsset("img/animations/ABSORB");
    expect(result.resolved).toBe(true);
  });

  it('returns unresolved when not found', () => {
    const result = handler.getAsset("img/nonexistent");
    expect(result.resolved).toBe(false);
  });

  it('resolves audio filepath', () => {
    const result = handler.getAsset("audio/bgm/town");
    expect(result.resolved).toBe(true);
  });

  it('resolves audio case-insensitive', () => {
    const result = handler.getAsset("audio/bgm/TOWN");
    expect(result.resolved).toBe(true);
  });

  it('returns unresolved when audio not found', () => {
    const result = handler.getAsset("audio/bgm/nonexistent");
    expect(result.resolved).toBe(false);
  });

  it('strips and restores extension from filepath', () => {
    const result = handler.getAsset("img/animations/absorb.png");
    expect(result.resolved).toBe(true);
    expect(result.path).toBe("img/animations/Absorb.png");
  });

  it('strips and restores extension from audio filepath', () => {
    const result = handler.getAsset("audio/bgm/town.ogg");
    expect(result.resolved).toBe(true);
    expect(result.path).toBe("audio/bgm/Town.ogg");
  });

  it('strips and restores extension case-insensitive', () => {
    const result = handler.getAsset("IMG/ANIMATIONS/ABSORB.PNG");
    expect(result.resolved).toBe(true);
    expect(result.path).toBe("img/animations/Absorb.png");
  });

  it('strips m4a extension', () => {
    const result = handler.getAsset("audio/bgm/town.m4a");
    expect(result.resolved).toBe(true);
  });

  it('strips encoded image extension', () => {
    const result = handler.getAsset("audio/bgm/town.rpgmvo");
    expect(result.resolved).toBe(true);
  });
});