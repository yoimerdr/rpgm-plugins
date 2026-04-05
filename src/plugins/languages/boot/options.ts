import {handler} from "@languages-plugin/handler";
import {extendMethod, extendMethods} from "@languages-plugin/shortcuts/cls";
import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {SafeParameters} from "@jstls/types/core";
import {DefaultLanguage} from "@languages-plugin/models/language-option";
import {parameters} from "@languages-plugin/parameters";
import {ExtendMethodBuilders} from "@jstls/types/core/objects/extender";

/**
 * Adds the language option command to the options menu.
 * This is called as part of the Window_Options addGeneralOptions method.
 * @param this - The Window_Options instance
 */
export function addLanguageOption(this: Window_Options) {
  const name = handler.label || DefaultLanguage.label;
  this.addCommand(name, handler.code);
}

/**
 * Handles cursor navigation (left/right) when the language option is selected.
 * Cycles through available languages when the user presses left or right.
 * @param $this - The Window_Options instance
 * @param prev - If true, moves to previous language; false moves to next
 * @returns true if the action was handled, false otherwise
 */
function processOptionAction($this: Window_Options, prev: boolean): boolean {
  const symbol = $this.commandSymbol($this.index());
  if (symbol === handler.code) {
    $this.changeValue(symbol, handler.index + (prev ? -1 : 1));
    return true;
  }
  return false;
}

/**
 * Applies the language option to the game's options menu.
 * Extends Window_Options to add language selection and handles custom text for options.
 */
export function applyOptions() {
  const {enableCustom} = parameters,
    descriptors: ExtendMethodBuilders<Window_Options> = {
      statusText: {
        replace: function (original, index) {
          const $this = this;

          return $this.commandSymbol(index) === handler.code ? handler.name : original.call($this, index)
        }
      },
      addGeneralOptions: {
        afterCall: addLanguageOption
      },
      processOk: {
        replace: function (ok) {
          processOptionAction(this, false) || ok.apply(this);
        }
      },
      cursorLeft: {
        replace: function (left, wrap) {
          processOptionAction(this, true) || left.apply(this, [wrap])
        }
      },
      cursorRight: {
        replace: function (right, wrap) {
          processOptionAction(this, false) || right.apply(this, [wrap])
        }
      },
    };


  enableCustom && (
    descriptors["booleanStatusText"] = {
      afterCall: function (result,) {
        return handler.getCustom("status", result);
      }
    }
  );

  extendMethods(
    getPrototype(Window_Options),
    descriptors,
  );

  // command options
  enableCustom && extendMethod(
    getPrototype(Window_Command),
    "addCommand",
    {
      modifyParameters() {
        const args = arguments as unknown as SafeParameters<Window_Command["addCommand"]>;
        args[0] = handler.getCustom("option", args[0]);
        return args;
      }
    }
  );
}
