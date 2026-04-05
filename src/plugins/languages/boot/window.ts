import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {extendMethods} from "@languages-plugin/shortcuts/cls";
import {handler} from "@languages-plugin/handler";
import {SafeParameters} from "@jstls/types/core";
import {parameters} from "@languages-plugin/parameters";

/**
 * Applies custom text translation support to window rendering.
 * Extends Window_Base.drawText and Window_Base.drawTextEx to automatically
 * translate custom text strings when they are displayed.
 */
export function applyWindow() {
  if(!parameters.enableCustom)
    return;

  // text options
  extendMethods(
    getPrototype(Window_Base),
    {
      drawTextEx: {
        modifyParameters() {
          const args = arguments as unknown as SafeParameters<Window_Base["drawTextEx"]>;
          args[0] = handler.getCustom("text", args[0]);
          return args;
        }
      },
      drawText: {
        modifyParameters() {
          const args = arguments as unknown as SafeParameters<Window_Base["drawText"]>;
          args[0] = handler.getCustom("text", args[0]);
          return args;
        }
      }
    }
  );
}
