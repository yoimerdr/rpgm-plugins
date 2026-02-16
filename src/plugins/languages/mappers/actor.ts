import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";

/**
 * Transform descriptor for DataActor objects.
 * Maps RPG Maker actor properties to short keys for compact JSON storage.
 * - "n" (name): The actor's display name
 * - "c" (nickname): The actor's nickname
 * - "p" (profile): The actor's profile text
 */
export const actorDescriptor: Readonly<SetTransformDescriptor<DataActor>> = {
  /** Actor name -> "n" */
  name: "n",
  /** Actor nickname -> "c" */
  nickname: "c",
  /** Actor profile -> "p" */
  profile: "p"
};

/**
 * Transforms actor data for storage in language files.
 * - actorToTransform: Converts DataActor to compact JSON format
 * - actorFromTransform: Converts compact data back to DataActor format
 */
export const actorToTransform = toSourceTransform<DataActor>(actorDescriptor),
  actorFromTransform = fromSourceTransform<DataActor>(actorDescriptor);
