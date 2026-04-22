import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {extendMethods} from "@languages-plugin/shortcuts/cls";
import {handler} from "@languages-plugin/handler";
import {SafeParameters} from "@jstls/types/core";
import {parameters} from "@languages-plugin/parameters";


function applyFirstParameterToCustomText<T extends (...args: any) => any, P extends Parameters<T>>(...parameters: P): P;
function applyFirstParameterToCustomText() {
  const args = arguments;
  args[0] = handler.getCustom("text", args[0]);
  return args;
}


/**
 * Applies custom text translation support to window rendering.
 * Extends Window_Base.drawText and Window_Base.drawTextEx to automatically
 * translate custom text strings when they are displayed.
 */
export function applyWindow() {
  if (!parameters.enableCustom)
    return;

  // text options
  extendMethods(
    getPrototype(Window_Base),
    {
      drawTextEx: {
        modifyParameters: applyFirstParameterToCustomText
      },
      drawText: {
        modifyParameters: applyFirstParameterToCustomText
      },
    }
  );
}
