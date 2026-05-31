import {method} from "@jstls/core/extender";
import {prototype} from "@jstls/core/shortcuts/object";
import {events} from "@ludens-plugin/modules/events";
import {KeyableObject} from "@jstls/types/core/objects";
import {isFunction} from "@jstls/core/objects/types";
import {doc} from "@jstls/components/shared/constants";
import {apply} from "@jstls/core/functions/apply";
import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {SafeParameters} from "@jstls/types/core";
import {applyWindow} from "./window";
import {applySceneManager} from "./scene-manager";

/**
 * Applies boot modifications to RPG Maker's core systems for Ludens compatibility.
 * - Patches font loading to handle Promise-based APIs.
 * - Emits 'onload' event after title screen loads.
 * - Notifies LudensBridge when loading completes.
 * - Encodes image filenames in non-NWjs environments.
 */
export function applyBoot() {
  applyWindow();
  applySceneManager();

  const fontLoadingFunctionKey = "_setupCssFontLoading",
    isMV = Utils.RPGMAKER_NAME == "MV";

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
              isLoading: false,
              canToggleDrawEngine: isMV // Only MV supports toggling the draw engine, for MZ is required WebGL.
            })
          );
        }
      }
    }
  )

  method(
    Bitmap,
    "load",
    {
      modifyParameters() {
        const args = arguments;

        if (!Utils.isNwjs() && args[0] && isMV) {
          // This may not be entirely accurate, but it seems that, before calling `Bitmap.load`,
          // the path is decoded in MV, whereas in MZ it is not.
          // So we encode it here to be sure it works like URL for both engines.
          args[0] = encodeURIComponent(args[0])
            .replace(/%2F/g, "/");
        }

        return args as unknown as SafeParameters<((typeof Bitmap)["load"])>;
      }
    }
  );

}
