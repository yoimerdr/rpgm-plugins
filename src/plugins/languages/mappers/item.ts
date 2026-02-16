import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";

/**
 * Transform descriptor for RPG_ItemBase objects (items, weapons, armors).
 * Maps RPG Maker item properties to short keys for compact JSON storage.
 * - "n" (name): The item's display name
 * - "d" (description): The item's description text
 * - "t" (note): The item's note/annotation field
 */
export const itemDescriptor: Readonly<SetTransformDescriptor<RPG_ItemBase>> = {
  /** Item name -> "n" */
  name: "n",
  /** Item description -> "d" */
  description: "d",
  /** Item note -> "t" */
  note: "t"
}


/**
 * Transforms item data for storage in language files.
 * - itemToTransform: Converts RPG_ItemBase to compact JSON format
 * - itemFromTransform: Converts compact data back to RPG_ItemBase format
 */
export const itemToTransform = toSourceTransform<RPG_ItemBase>(itemDescriptor),
  itemFromTransform = fromSourceTransform<RPG_ItemBase>(itemDescriptor);

