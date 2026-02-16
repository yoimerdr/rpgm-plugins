import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {assign} from "@languages-plugin/shortcuts/properties";
import {itemDescriptor} from "@languages-plugin/mappers/item";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";

/**
 * Transform descriptor for DataSkill objects.
 * Extends itemDescriptor with skill-specific properties.
 * - message1: First skill message (e.g., "uses skill!")
 * - message2: Second skill message
 * Plus all item properties (name, description, note)
 */
export const skillDescriptor: Readonly<SetTransformDescriptor<DataSkill>> = assign(
  {
    /** Skill message 1 -> "1" */
    message1: "1",
    /** Skill message 2 -> "2" */
    message2: "2"
  },
  itemDescriptor as any
)

/**
 * Transforms skill data for storage in language files.
 * - skillToTransform: Converts DataSkill to compact JSON format
 * - skillFromTransform: Converts compact data back to DataSkill format
 */
export const skillToTransform = toSourceTransform<DataSkill>(skillDescriptor),
  skillFromTransform = fromSourceTransform<DataSkill>(skillDescriptor);
