import {extendMethod} from "@languages-plugin/shortcuts/cls";
import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {handler} from "@languages-plugin/handler";
import {SafeParameters} from "@jstls/types/core";
import {parameters} from "@languages-plugin/parameters";

/**
 * Applies image localization support to the game.
 * Extends ImageManager.loadBitmap and Game_Screen.showPicture to automatically
 * resolve localized image filenames based on the current language.
 * Only applies if enableImages is true in parameters.
 */
export function applyImages() {
  if (!parameters.enableImages)
    return;

  // Bitmaps and images
  extendMethod(
    ImageManager,
    "loadBitmap",
    {
      modifyParameters() {
        const args = arguments as unknown as SafeParameters<((typeof ImageManager)["loadBitmap"])>;
        args[1] = handler.getImage(args[0], args[1]);
        return args;
      }
    }
  );

  extendMethod(
    getPrototype(Game_Screen),
    "showPicture",
    {
      modifyParameters() {
        const args = arguments as unknown as SafeParameters<Game_Screen["showPicture"]>;
        args[1] = handler.getImage("img/pictures", args[1]);
        return args;
      }
    }
  );
}
