import {extendMethod} from "@crossassets-plugin/shortcuts/cls";
import {getPrototype} from "@crossassets-plugin/shortcuts/properties";
import {generateAssetsSource, generateAssetsSourceFolder} from "@crossassets-plugin/files";
import {handler} from "@crossassets-plugin/handler";

/**
 * Applies full boot functionality for the plugin.
 * Extends Scene_Boot.start to generate asset source files in Node.js environments
 * and initialize the handler. Skips generation during battle/event tests.
 * @returns {void}
 */
export function applyFullBoot() {
  extendMethod(
    getPrototype(Scene_Boot),
    "start", {
      beforeCall() {
        const manager = DataManager;
        if (manager.isBattleTest() || manager.isEventTest())
          return;

        if (Utils.isNwjs()) {
          generateAssetsSourceFolder();
          generateAssetsSource();
        }

        handler.setup();
      }
    }
  )
}


/**
 * Applies lite boot functionality for the plugin.
 * Extends Scene_Boot.start to initialize the handler only.
 * Does not generate asset source files (used for lighter deployment).
 * @returns {void}
 */
/**
 * Applies the lite boot configuration for the plugin.
 * Extends Scene_Boot.start to initialize the handler without generating asset source files.
 * This is used when asset source generation is not needed.
 * @returns {void}
 */
export function applyLiteBoot() {
  extendMethod(
    getPrototype(Scene_Boot),
    "start", {
      beforeCall: function () {
        handler.setup();
      }
    }
  )
}
