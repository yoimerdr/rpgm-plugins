import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {MapSource} from "@languages-plugin/models/source";

/**
 * Transform descriptor for MapSource objects.
 * Maps map properties to short keys for compact JSON storage.
 * - "n" (displayName): The map's display name
 * - "m" (messages): Event text commands from the map
 */
export const mapDescriptor: Readonly<SetTransformDescriptor<MapSource>> = {
  /** Map display name -> "n" */
  displayName: "n",
  /** Map event text messages -> "m" */
  messages: "m"
}


/**
 * Transforms map data for storage in language files.
 * - mapToTransform: Converts MapSource to compact JSON format
 * - mapFromTransform: Converts compact data back to MapSource format
 */
export const mapToTransform = toSourceTransform<MapSource>(mapDescriptor),
  mapFromTransform = fromSourceTransform<MapSource>(mapDescriptor);
