import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {assign} from "@languages-plugin/shortcuts/properties";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {skillDescriptor} from "@languages-plugin/mappers/skill";

/**
 * Transform descriptor for DataState objects.
 * Extends skillDescriptor with state-specific messages:
 * - "3" (message3): Message when state is added
 * - "4" (message4): Message when state is removed
 * Plus all skill/item properties (name, description, note, message1, message2)
 */
export const stateDescriptor: Readonly<SetTransformDescriptor<DataState>> = assign(
  {
    /** State message 3 (when added) -> "3" */
    message3: "3",
    /** State message 4 (when removed) -> "4" */
    message4: "4"
  },
  skillDescriptor as any
)

/**
 * Transforms state data for storage in language files.
 * - stateToTransform: Converts DataState to compact JSON format
 * - stateFromTransform: Converts compact data back to DataState format
 */
export const stateToTransform = toSourceTransform<DataState>(stateDescriptor),
  stateFromTransform = fromSourceTransform<DataState>(stateDescriptor);
