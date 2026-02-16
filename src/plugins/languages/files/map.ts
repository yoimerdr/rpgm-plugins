import {set2, string} from "@languages-plugin/shortcuts/mappers";
import {FileManager} from "@core-plugin/modules/env/fs";
import {indefinite} from "@jstls/core/utils/types";
import {join} from "@languages-plugin/shortcuts/env/path";
import {each} from "@languages-plugin/shortcuts/iterables";
import {eventToCommand} from "@languages-plugin/mappers/event";
import {getKeys} from "@languages-plugin/shortcuts/properties";
import {append} from "@languages-plugin/shortcuts/env/logger";
import {EventTextCommand} from "@languages-plugin/models/source";

/**
 * Loads a map JSON file from the data folder.
 * @param value - The filename of the map (e.g., "Map001.json")
 * @param manager - The FileManager instance for reading files
 * @returns The parsed DataMap object, or indefinite if parsing fails
 */
export function loadMapFile(value: string, manager: FileManager) {

  try {
    return JSON.parse(manager.readFileSync(join("data", value))) as DataMap;
  } catch (e) {
    append(string(e));
    return indefinite;
  }
}

/**
 * Extracts text commands from all events in a map.
 * Iterates through all events and uses eventToCommand to extract Show Text commands.
 * @param file - The DataMap object to extract commands from
 * @returns An EventTextCommand object mapping event IDs to their text commands
 */
export function loadMapCommands(file: DataMap) {
  const messages: EventTextCommand = {}
  each(file.events, function (event) {
    if(!event)
      return;

    const commands = eventToCommand(event)
    getKeys(commands).isNotEmpty() && set2(messages, event.id, commands);
  });

  return messages;
}
