import {mockRpgMakerEnvironment, mockRpgMakerGlobals} from '../index';
import {setupYdpCore} from '../mocks/core';
import {vi} from 'vitest';

const CrossAssetsData = {
  assets: {
    img: {
      animations: { absorb: "img/animations/Absorb" },
      pictures: { hero: "img/pictures/Hero" }
    },
    audio: { bgm: { town: "audio/bgm/Town" } }
  }
};

vi.mock('@crossassets-plugin/parameters', () => ({
  parameters: { filename: 'assets', folder: 'data/crossassets', loadMode: 'flatten' },
  PluginName: 'YDP_CrossAssets'
}));

vi.mock('@crossassets-plugin/shortcuts/requests', () => ({
  fetchJson: vi.fn().mockResolvedValue(CrossAssetsData.assets)
}));

mockRpgMakerEnvironment();
mockRpgMakerGlobals();
setupYdpCore();
