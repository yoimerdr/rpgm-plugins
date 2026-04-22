import {describe, expect, it} from 'vitest';
import {audio} from '@ludens-plugin/modules/audio';

declare const global: any;

describe('Ludens Audio Module', () => {
  it('volume applies clamp and integer conversion', () => {
    audio.volume(130.9);

    expect(global.AudioManager.bgmVolume).toBe(100);
    expect(global.AudioManager.bgsVolume).toBe(100);
    expect(global.AudioManager.meVolume).toBe(100);
    expect(global.AudioManager.seVolume).toBe(100);

    audio.volume(-9.2);

    expect(global.AudioManager.bgmVolume).toBe(0);
    expect(global.AudioManager.bgsVolume).toBe(0);
    expect(global.AudioManager.meVolume).toBe(0);
    expect(global.AudioManager.seVolume).toBe(0);
  });

  it('mute and unmute preserve previous volumes', () => {
    global.AudioManager.bgmVolume = 80;
    global.AudioManager.bgsVolume = 60;
    global.AudioManager.meVolume = 40;
    global.AudioManager.seVolume = 20;

    audio.mute();
    expect(audio.isMuted).toBe(true);

    audio.unmute();
    expect(audio.isMuted).toBe(false);
    expect(global.AudioManager.bgmVolume).toBe(80);
    expect(global.AudioManager.bgsVolume).toBe(60);
    expect(global.AudioManager.meVolume).toBe(40);
    expect(global.AudioManager.seVolume).toBe(20);
  });

  it('toggle swaps between mute and unmute', () => {
    audio.toggle();
    expect(audio.isMuted).toBe(true);

    audio.toggle();
    expect(audio.isMuted).toBe(false);
  });
});
