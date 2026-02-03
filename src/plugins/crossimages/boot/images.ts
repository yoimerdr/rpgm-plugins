import {extendMethod} from "@crossimages-plugin/shortcuts/cls";
import {handler} from "@crossimages-plugin/handler";
import {getPrototype} from "@crossimages-plugin/shortcuts/properties";
import {SafeParameters} from "@jstls/types/core";

export function applyImages() {
    extendMethod(
        ImageManager,
        "loadBitmap",
        {
            modifyParameters(folder, filename, hue, smooth) {
                filename = handler.getImage(folder, filename);
                return [folder, filename, hue, smooth] as any
            }
        }
    )

    extendMethod(
        getPrototype(Game_Screen),
        "showPicture",
        {
            modifyParameters(id, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
                name = handler.getImage("img/pictures", name);
                return [id, name, origin, x, y, scaleX, scaleY, opacity, blendMode] as SafeParameters<Game_Screen["showPicture"]>
            }
        }
    )
}