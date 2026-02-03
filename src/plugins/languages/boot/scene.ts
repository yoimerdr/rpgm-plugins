import {extendMethod} from "@languages-plugin/shortcuts/cls";
import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {generateLanguageFiles, generateLanguagesFolder} from "@languages-plugin/files";
import {handler} from "@languages-plugin/handler";

export function applyFullBoot() {
  // Scene boot
  extendMethod(
    getPrototype(Scene_Boot),
    "start",
    {
      beforeCall() {
        if (DataManager.isBattleTest() || DataManager.isEventTest())
          return;

        if (Utils.isNwjs()) {
          generateLanguagesFolder();
          generateLanguageFiles();
        }

        handler.setup();
      }
    }
  );
}

export function applyLiteBoot() {
  extendMethod(
    getPrototype(Scene_Boot),
    "start",
    {
      beforeCall() {
        handler.setup();
      }
    }
  )
}
