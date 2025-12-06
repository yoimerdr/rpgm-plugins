import {getPrototype} from "@languages-plugin/shortcuts/properties";
import {extendMethod} from "@languages-plugin/shortcuts/cls";
import {handler} from "@languages-plugin/handler";
import {isDefined} from "@languages-plugin/shortcuts/validations";
import {assignCommandToEvent} from "@languages-plugin/mappers/event";

export function applyMap() {
  // Map files
  extendMethod(
    getPrototype(Scene_Map),
    "onMapLoaded",
    {
      afterCall() {
        const map = handler.getMap($gameMap.mapId())!;
        if (!isDefined(map))
          return;
        $dataMap.displayName = map.displayName;
        assignCommandToEvent(map.messages, $dataMap.events)
      }
    }
  );
}
