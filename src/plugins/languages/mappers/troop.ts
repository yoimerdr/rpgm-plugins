import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {Troop} from "@languages-plugin/models/source";

/**
 * Transform descriptor for Troop objects (enemy groups in battle).
 * Maps troop properties to short keys:
 * - "n" (name): The troop's name
 * - "m" (messages): Battle text messages from troop pages
 */
export const troopDescriptor: Readonly<SetTransformDescriptor<Troop>> = {
  /** Troop name -> "n" */
  name: "n",
  /** Troop battle messages -> "m" */
  messages: "m"
}

/**
 * Transforms troop data for storage in language files.
 * - troopToTransform: Converts Troop to compact JSON format
 * - troopFromTransform: Converts compact data back to Troop format
 */
export const troopToTransform = toSourceTransform<Troop>(troopDescriptor),
  troopFromTransform = fromSourceTransform<Troop>(troopDescriptor);
