import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {assign} from "@languages-plugin/shortcuts/properties";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {skillDescriptor} from "@languages-plugin/mappers/skill";

export const stateDescriptor: Readonly<SetTransformDescriptor<DataState>> = assign(
  {
    message3: "3",
    message4: "4"
  },
  skillDescriptor as any
)

export const stateToTransform = toSourceTransform<DataState>(stateDescriptor),
  stateFromTransform = fromSourceTransform<DataState>(stateDescriptor);
