import {handler} from "@languages-plugin/handler";
import {extendMethod, extendMethods} from "@languages-plugin/shortcuts/cls";
import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {SafeParameters} from "@jstls/types/core";
import {DefaultLanguage} from "@languages-plugin/models/language-option";

export function addLanguageOption(this: Window_Options) {
  const name = handler.label || DefaultLanguage.label;
  this.addCommand(name, handler.code);
}

export function applyOptions() {
  // command options
  extendMethod(
    getPrototype(Window_Command),
    "addCommand",
    {
      modifyParameters(name, symbol, enable, ext) {
        name = handler.getCustom("option", name)
        return [name, symbol, enable, ext] as SafeParameters<Window_Command["addCommand"]>;
      }
    }
  );

  // Window options
  function processOptionAction($this: Window_Options, prev: boolean): boolean {
    const symbol = $this.commandSymbol($this.index());
    if (symbol === handler.code) {
      $this.changeValue(symbol, handler.index + (prev ? -1 : 1));
      return true;
    }
    return false;
  }

  extendMethods(
    getPrototype(Window_Options),
    {
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
      booleanStatusText: {
        afterCall: function (result,) {
          return handler.getCustom("status", result);
        }
      }
    }
  );
}
