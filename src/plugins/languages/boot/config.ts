import {define, descriptor2} from "@languages-plugin/shortcuts/properties";
import {handler} from "@languages-plugin/handler";
import {extendMethods} from "@languages-plugin/shortcuts/cls";
import {get2, set2} from "@languages-plugin/shortcuts/mappers";

export function applyConfig() {
  // config manager
  define(
    ConfigManager,
    handler.code,
    descriptor2(
      function () {
        return handler.index;
      },
      function (value: number) {
        handler.load(value) && handler.update();
      },
    )
  )

  extendMethods(
    ConfigManager, {
      makeData: {
        afterCall: function (config) {
          const {code} = handler;
          set2(config, code, handler.index);
          return config
        }
      },
      applyData: {
        beforeCall: function (config) {
          const {code} = handler;
          set2(this, code, get2(config, code));
        }
      }
    }
  )
}
