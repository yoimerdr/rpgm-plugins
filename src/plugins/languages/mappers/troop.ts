import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {Troop} from "@languages-plugin/models/source";

export const troopDescriptor: Readonly<SetTransformDescriptor<Troop>> = {
  name: "n",
  messages: "m"
}

export const troopToTransform = toSourceTransform<Troop>(troopDescriptor),
  troopFromTransform = fromSourceTransform<Troop>(troopDescriptor);
