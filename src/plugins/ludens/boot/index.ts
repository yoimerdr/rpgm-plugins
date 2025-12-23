import {method} from "@jstls/core/extender";
import {prototype} from "@jstls/core/shortcuts/object";
import {events} from "@ludens-plugin/modules/events";

export function applyBoot() {
  method(
    prototype(Scene_Boot),
    "start",
    {
      afterCall() {
        events.emit("onload")
      }
    }
  )
}
