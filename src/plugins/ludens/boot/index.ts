import {method} from "@jstls/core/extender";
import {prototype} from "@jstls/core/shortcuts/object";
import {events} from "@ludens-plugin/modules/events";
import {KeyableObject} from "@jstls/types/core/objects";

export function applyBoot() {
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
        (window as KeyableObject).LudensBridge.callNative("LudensLoader", JSON.stringify({
          isEnabled: true,
          isLoading: false
        }));
      }
    }
  )
}
