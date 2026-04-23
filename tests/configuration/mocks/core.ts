import {cls} from '@core-plugin/modules/cls';
import {exceptions} from '@core-plugin/modules/exceptions';
import {requests} from '@core-plugin/modules/requests';
import {validations} from '@core-plugin/modules/validations';
import {parameters} from '@core-plugin/modules/parameters';
import {properties} from '@core-plugin/modules/properties';
import {iterables} from '@core-plugin/modules/iterables';
import {mappers} from '@core-plugin/modules/mappers';
import {env} from '@core-plugin/modules/env';
import {images} from '@core-plugin/modules/images';
import {functions} from '@core-plugin/modules/functions';
import {files, YDPCore} from "@core-plugin/index";
import {vi} from "vitest";
import {applyPolyfills} from "@core-plugin/modules/polyfills";

declare const global: { YDP_Core: YDPCore };
vi.mock("@core-plugin/types", () => ({
  default: global.YDP_Core,
  YDP_Core: global.YDP_Core,
}))

export function setupYdpCore() {
  applyPolyfills();

  const YDP_Core = {
    class: cls,
    exceptions,
    requests,
    validations,
    parameters,
    properties,
    iterables,
    mappers,
    env,
    images,
    files,
    functions,
    PluginName: 'YDP_Core',
  };

  global.YDP_Core = YDP_Core;

  return YDP_Core;
}