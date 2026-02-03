import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";

export const itemDescriptor: Readonly<SetTransformDescriptor<RPG_ItemBase>> = {
  name: "n",
  description: "d",
  note: "t"
}


export const itemToTransform = toSourceTransform<RPG_ItemBase>(itemDescriptor),
  itemFromTransform = fromSourceTransform<RPG_ItemBase>(itemDescriptor);

