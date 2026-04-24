import {extendMethod} from "@crossassets-plugin/shortcuts/cls";
import {handler} from "@crossassets-plugin/handler";
import {SafeParameters} from "@jstls/types/core";
import {string} from "@crossassets-plugin/shortcuts/mappers";

/**
 * Applies asset path resolution to RPG Maker's image and audio loading systems.
 * Extends Bitmap.load to resolve cross-referenced image paths.
 * Extends AudioManager.createBuffer to resolve audio paths.
 * @returns {void}
 */
export function applyAssets() {
  extendMethod(
    Bitmap,
    "load",
    {
      modifyParameters() {
        const args = arguments as unknown as SafeParameters<(typeof Bitmap)["load"]>,
          {resolved, path} = handler.getAsset(args[0]);

        if (resolved && path) {
          args[0] = path.endsWith(".png") ? path : path + ".png";
        }
        return args;
      }
    }
  );

  extendMethod(
    AudioManager,
    "createBuffer",
    {
      modifyParameters() {
        const args = arguments as unknown as SafeParameters<(typeof AudioManager)["createBuffer"]>,
          folder = string(args[0]),
          hasAudioFolder = /^audio\//i.test(folder),
          {resolved, path} = handler.getAsset(hasAudioFolder ? folder : "audio/" + folder, args[1]);

        if (resolved && path) {
          const regex = new RegExp("^\\/?audio\\/" + folder, "i");

          if (regex.test(path)) {
            const result = path.replace(regex, "");
            args[1] = result[0] === "/" ? result.substring(1) : result;
          }
        }
        return args;
      }
    }
  );
}
