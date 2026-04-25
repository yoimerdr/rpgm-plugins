import {extendMethod} from "@crossimages-plugin/shortcuts/cls";
import {getPrototype} from "@crossimages-plugin/shortcuts/properties";
import {generateImagesSource, generateImagesSourceFolder} from "@crossimages-plugin/files";
import {handler} from "@crossimages-plugin/handler";

/**
 * Applies full boot functionality for the plugin.
 * Extends Scene_Boot.start to generate image source files in Node.js environments
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
          generateImagesSourceFolder();
          generateImagesSource();
        }

        handler.setup();
      }
    }
  )
}


/**
 * Applies lite boot functionality for the plugin.
 * Extends Scene_Boot.start to initialize the handler only.
 * Does not generate image source files (used for lighter deployment).
 * @returns {void}
 */
/**
 * Applies the lite boot configuration for the plugin.
 * Extends Scene_Boot.start to initialize the handler without generating image source files.
 * This is used when image source generation is not needed.
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