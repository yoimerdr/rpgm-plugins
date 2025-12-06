import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {extendMethods} from "@languages-plugin/shortcuts/cls";
import {handler} from "@languages-plugin/handler";
import {SafeParameters} from "@jstls/types/core";

export function applyWindow() {
  // text options
  extendMethods(
    getPrototype(Window_Base),
    {
      drawTextEx: {
        modifyParameters(text, x, y) {
          text = handler.getCustom("text", text);
          return [text, x, y] as SafeParameters<Window_Base["drawTextEx"]>
        }
      },
      drawText: {
        modifyParameters(text, x, y, maxWidth, align) {
          text = handler.getCustom("text", text);
          return [text, x, y, maxWidth, align] as SafeParameters<Window_Base["drawText"]>;
        }
      }
    }
  );
}
