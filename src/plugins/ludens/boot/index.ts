import {method} from "@jstls/core/extender";
import {prototype} from "@jstls/core/shortcuts/object";
import {events} from "@ludens-plugin/modules/events";
import {KeyableObject} from "@jstls/types/core/objects";
import {isFunction} from "@jstls/core/objects/types";
import {doc} from "@jstls/components/shared/constants";
import {apply} from "@jstls/core/functions/apply";
import {get2, set2} from "@jstls/core/objects/handlers/getset";

export function applyBoot() {
  method(
    Graphics as KeyableObject,
    "_setupCssFontLoading",
    {
      replace(source) {
        if (isFunction(doc.fonts.ready.then))
          apply(source, this)
        else set2(Graphics, "_cssFontLoading", undefined);
      }
    }
  )

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
}
