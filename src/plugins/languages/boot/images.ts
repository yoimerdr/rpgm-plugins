import {extendMethod} from "@languages-plugin/shortcuts/cls";
import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {handler} from "@languages-plugin/handler";
import {SafeParameters} from "@jstls/types/core";
import {parameters} from "@languages-plugin/parameters";

export function applyImages() {
  if (!parameters.enableImages)
    return;

  // Bitmaps and images
  extendMethod(
    ImageManager,
    "loadBitmap",
    {
      modifyParameters(folder, filename, hue, smooth) {
        filename = handler.getImage(folder, filename);
        return [folder, filename, hue, smooth] as any
      }
    }
  );

  extendMethod(
    getPrototype(Game_Screen),
    "showPicture",
    {
      modifyParameters(id, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        name = handler.getImage("img/pictures", name);
        return [id, name, origin, x, y, scaleX, scaleY, opacity, blendMode] as SafeParameters<Game_Screen["showPicture"]>
      }
    }
  );
}
