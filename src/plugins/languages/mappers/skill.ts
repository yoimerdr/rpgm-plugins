import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {assign} from "@languages-plugin/shortcuts/properties";
import {itemDescriptor} from "@languages-plugin/mappers/item";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";

export const skillDescriptor: Readonly<SetTransformDescriptor<DataSkill>> = assign(
  {
    message1: "1",
    message2: "2"
  },
  itemDescriptor as any
)

export const skillToTransform = toSourceTransform<DataSkill>(skillDescriptor),
  skillFromTransform = fromSourceTransform<DataSkill>(skillDescriptor);
