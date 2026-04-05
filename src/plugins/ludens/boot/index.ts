import {method} from "@jstls/core/extender";
import {prototype} from "@jstls/core/shortcuts/object";
import {events} from "@ludens-plugin/modules/events";
import {KeyableObject} from "@jstls/types/core/objects";
import {isFunction} from "@jstls/core/objects/types";
import {doc} from "@jstls/components/shared/constants";
import {apply} from "@jstls/core/functions/apply";
import {get2, set2} from "@jstls/core/objects/handlers/getset";

/**
 * Applies boot modifications to RPG Maker's core systems for Ludens compatibility.
 * - Patches font loading to handle Promise-based APIs.
 * - Emits 'onload' event after title screen loads.
 * - Notifies LudensBridge when loading completes.
 * - Encodes image filenames in non-NWjs environments.
 */
export function applyBoot() {
  const fontLoadingFunctionKey = "_setupCssFontLoading";
  if (Graphics && isFunction(get2(Graphics, fontLoadingFunctionKey))) {
    method(
      Graphics as KeyableObject,
      fontLoadingFunctionKey,
      {
        replace(source) {
          if (isFunction(doc.fonts.ready.then))
            apply(source, this)
          else set2(Graphics, "_cssFontLoading", undefined);
        }
      }
    )
  }

  let loaded = false;
  method(
    prototype(Scene_Title),
    "start",
    {
      afterCall() {
        if (loaded)
          return;

        loaded = true;
        events.emit("onload");
        const bridge = get2(window, "LudensBridge");
        if (bridge && bridge.callNative) {
          bridge.callNative(
            "LudensLoader",
            JSON.stringify({
              isEnabled: true,
              isLoading: false
            })
          );
        }
      }
    }
  )

  method(
    ImageManager,
    "loadBitmap",
    {
      modifyParameters(folder, filename, hue, smooth) {
        if (!Utils.isNwjs()) {
          filename = encodeURIComponent(filename);
        }
        return [folder, filename, hue, smooth] as any;
      }
    }
  );

}
