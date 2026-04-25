import {mockRpgMakerEnvironment, mockRpgMakerGlobals} from '../index';
import {setupYdpCore} from '../mocks/core';
import {vi} from 'vitest';

const CrossAssetsData = {
  assets: {
    "$d": [
      "img/animations",
      "img/pictures",
      "audio/bgm"
    ],
    "$f": [
      [0, ["Absorb"]],
      [1, ["Hero"]],
      [2, ["Town"]]
    ],
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
